const assert = require("node:assert/strict");
const test = require("node:test");

const SyncLogic = require("../sync-logic.js");

const ACCOUNT_ID = "10000000-0000-4000-8000-000000000001";
const OPERATION_ID_1 = "20000000-0000-4000-8000-000000000001";
const OPERATION_ID_2 = "20000000-0000-4000-8000-000000000002";
const CREATED_AT = "2026-07-15T08:00:00.000Z";

function itemMutation(overrides = {}) {
  return SyncLogic.createMutation({
    operationId: OPERATION_ID_1,
    accountId: ACCOUNT_ID,
    type: "upsert_item",
    listId: "list-1",
    itemId: "milk",
    payload: { quantity: 2, done: false },
    createdAt: CREATED_AT,
    ...overrides
  });
}

test("replayed operations retain one stable operation ID", () => {
  const mutation = itemMutation();

  assert.equal(mutation.operationId, OPERATION_ID_1);
  assert.deepEqual(SyncLogic.compactQueue([mutation], mutation), [mutation]);
});

test("later absolute item state replaces an unattempted state for the same account item", () => {
  const oldMutation = itemMutation();
  const newMutation = itemMutation({
    operationId: OPERATION_ID_2,
    payload: { quantity: 3, done: true },
    createdAt: "2026-07-15T08:01:00.000Z"
  });

  assert.deepEqual(SyncLogic.compactQueue([oldMutation], newMutation), [newMutation]);
});

test("attempted item mutations are retained before a later item state", () => {
  const attempted = itemMutation({ attempts: 1 });
  const later = itemMutation({
    operationId: OPERATION_ID_2,
    payload: { quantity: 4 },
    createdAt: "2026-07-15T08:02:00.000Z"
  });

  assert.deepEqual(SyncLogic.compactQueue([attempted], later), [attempted, later]);
});

test("compaction never crosses account, list, item, or mutation-type boundaries", () => {
  const original = itemMutation();
  const variants = [
    itemMutation({ operationId: OPERATION_ID_2, accountId: "10000000-0000-4000-8000-000000000002" }),
    itemMutation({ operationId: OPERATION_ID_2, listId: "list-2" }),
    itemMutation({ operationId: OPERATION_ID_2, itemId: "bread" }),
    itemMutation({ operationId: OPERATION_ID_2, type: "delete_item", payload: {} })
  ];

  variants.forEach((variant) => {
    assert.deepEqual(SyncLogic.compactQueue([original], variant), [original, variant]);
  });
});

test("mutations validate identifiers, supported types, item requirements, and JSON payloads", () => {
  assert.throws(() => itemMutation({ operationId: "not-a-uuid" }), /operationId/);
  assert.throws(() => itemMutation({ accountId: "" }), /accountId/);
  assert.throws(() => itemMutation({ type: "unknown" }), /type/);
  assert.throws(() => itemMutation({ listId: "  " }), /listId/);
  assert.throws(() => itemMutation({ itemId: "" }), /itemId/);
  assert.throws(() => itemMutation({ payload: { quantity: Number.NaN } }), /payload/);
  assert.throws(() => itemMutation({ payload: { value: undefined } }), /payload/);
});

test("created mutations own a JSON-safe payload copy", () => {
  const payload = { quantity: 2, tags: ["bio"] };
  const mutation = itemMutation({ payload });

  payload.quantity = 9;
  payload.tags.push("changed");

  assert.deepEqual(mutation.payload, { quantity: 2, tags: ["bio"] });
  assert.equal(mutation.attempts, 0);
});

test("authorization and deletion conflicts stop replay while transient failures retry", () => {
  ["membership_removed", "list_deleted", "forbidden", "invalid_mutation"].forEach((code) => {
    assert.equal(SyncLogic.shouldRetry(code), false, code);
  });
  ["network_error", "timeout", "server_error"].forEach((code) => {
    assert.equal(SyncLogic.shouldRetry(code), true, code);
  });
});
