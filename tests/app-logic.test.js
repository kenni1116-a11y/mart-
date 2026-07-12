const test = require("node:test");
const assert = require("node:assert/strict");
const logic = require("../app-logic.js");

test("estimateListValue uses the cheapest price and item quantity", () => {
  const result = logic.estimateListValue(
    [{ id: "milk", quantity: 2 }, { id: "manual:1", quantity: 4 }],
    [{ productId: "milk", price: 1.79 }, { productId: "milk", price: 1.49 }]
  );

  assert.deepEqual(result, {
    total: 2.98,
    pricedItemCount: 1,
    missingItemCount: 1,
    currency: "EUR"
  });
});

test("estimateListValue ignores invalid prices and handles an empty list", () => {
  assert.deepEqual(logic.estimateListValue([], []), {
    total: 0,
    pricedItemCount: 0,
    missingItemCount: 0,
    currency: "EUR"
  });

  assert.deepEqual(
    logic.estimateListValue(
      [{ id: "apple", quantity: 3 }],
      [
        { productId: "apple", price: -1 },
        { productId: "apple", price: "unknown" },
        { productId: "apple", price: 2.4 },
        { productId: "apple", price: 1.2, currency: "EUR" }
      ]
    ),
    { total: 3.6, pricedItemCount: 1, missingItemCount: 0, currency: "EUR" }
  );
});

test("buildManualSuggestions prefers catalog prefixes and removes duplicate names", () => {
  const result = logic.buildManualSuggestions(
    "apf",
    [{ id: "fruit:apple", name: "Äpfel", shelfTitle: "Obst" }],
    [
      { id: "manual:old", name: "Äpfel" },
      { id: "manual:juice", name: "Apfelsaft" },
      { id: "manual:baked", name: "Bratapfel" }
    ],
    5
  );

  assert.deepEqual(
    result.map((entry) => [entry.name, entry.source]),
    [["Äpfel", "catalog"], ["Apfelsaft", "history"], ["Bratapfel", "history"]]
  );
});

test("buildManualSuggestions limits results and returns none for an empty query", () => {
  const items = Array.from({ length: 8 }, (_, index) => ({
    id: `manual:${index}`,
    name: `Milch ${index}`
  }));

  assert.equal(logic.buildManualSuggestions("milch", [], items, 5).length, 5);
  assert.deepEqual(logic.buildManualSuggestions("", [], items, 5), []);
});

test("mapWithConcurrency never exceeds its worker limit and preserves order", async () => {
  let active = 0;
  let maximum = 0;
  const result = await logic.mapWithConcurrency([1, 2, 3, 4], 2, async (value) => {
    active += 1;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, value % 2 ? 8 : 2));
    active -= 1;
    return value * 2;
  });

  assert.equal(maximum, 2);
  assert.deepEqual(result, [2, 4, 6, 8]);
});

test("mapWithConcurrency propagates worker errors", async () => {
  await assert.rejects(
    logic.mapWithConcurrency([1, 2], 2, async (value) => {
      if (value === 2) throw new Error("write failed");
      return value;
    }),
    /write failed/
  );
});

test("rotateInviteWithRollback restores list metadata after a failed persist", async () => {
  const list = {
    inviteCode: "old",
    updatedAt: "before",
    updatedByUserId: "owner",
    revision: 4
  };
  let rollbackCalls = 0;

  const success = await logic.rotateInviteWithRollback({
    target: list,
    nextCode: "new",
    mutate(target, code) {
      Object.assign(target, {
        inviteCode: code,
        updatedAt: "after",
        updatedByUserId: "device",
        revision: 5
      });
    },
    persist: async () => false,
    rollback: () => {
      rollbackCalls += 1;
    }
  });

  assert.equal(success, false);
  assert.equal(rollbackCalls, 1);
  assert.deepEqual(list, {
    inviteCode: "old",
    updatedAt: "before",
    updatedByUserId: "owner",
    revision: 4
  });
});

test("rotateInviteWithRollback keeps a successfully persisted code", async () => {
  const list = {
    inviteCode: "old",
    updatedAt: "before",
    updatedByUserId: "owner",
    revision: 4
  };

  const success = await logic.rotateInviteWithRollback({
    target: list,
    nextCode: "new",
    mutate(target, code) {
      Object.assign(target, {
        inviteCode: code,
        updatedAt: "after",
        updatedByUserId: "device",
        revision: 5
      });
    },
    persist: async () => true,
    rollback: () => assert.fail("rollback must not run")
  });

  assert.equal(success, true);
  assert.equal(list.inviteCode, "new");
});

test("chooseActiveListId retains a valid target and falls back deterministically", () => {
  assert.equal(logic.chooseActiveListId("a", ["a", "b"], "b"), "a");
  assert.equal(logic.chooseActiveListId("", ["a", "b"], "b"), "b");
  assert.equal(logic.chooseActiveListId("missing", ["a", "b"]), "a");
  assert.equal(logic.chooseActiveListId("a", ["b", "c"]), "b");
  assert.equal(logic.chooseActiveListId("", [], "new"), "");
});
