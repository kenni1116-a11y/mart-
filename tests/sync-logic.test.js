const assert = require("node:assert/strict");
const test = require("node:test");

const SyncLogic = require("../sync-logic.js");

const ACCOUNT_ID = "10000000-0000-4000-8000-000000000001";
const OPERATION_ID_1 = "20000000-0000-4000-8000-000000000001";
const OPERATION_ID_2 = "20000000-0000-4000-8000-000000000002";
const OPERATION_ID_3 = "20000000-0000-4000-8000-000000000003";
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

test("one mutation calls only the idempotent Supabase RPC", async () => {
  const calls = [];
  const client = {
    rpc: async (name, parameters) => {
      calls.push({ name, parameters });
      return { data: { ok: true, operationId: OPERATION_ID_1 }, error: null };
    }
  };
  const mutation = itemMutation();

  const result = await SyncLogic.applyMutationWithClient(client, mutation);

  assert.deepEqual(result, { ok: true, operationId: OPERATION_ID_1 });
  assert.deepEqual(calls, [{
    name: "apply_list_mutation_v3",
    parameters: {
      operation_id: OPERATION_ID_1,
      target_list_id: "list-1",
      mutation_type: "upsert_item",
      payload: { quantity: 2, done: false }
    }
  }]);
});

test("successful replay removes only the accepted operation", async () => {
  const first = itemMutation();
  const second = itemMutation({
    operationId: OPERATION_ID_2,
    listId: "list-2",
    itemId: "bread"
  });

  const replay = await SyncLogic.replayNext([first, second], async () => ({ ok: true }));

  assert.equal(replay.action, "applied");
  assert.deepEqual(replay.queue, [second]);
});

test("deleted-list replay discards only operations for that inaccessible list", async () => {
  const first = itemMutation();
  const sameList = itemMutation({
    operationId: OPERATION_ID_2,
    itemId: "bread"
  });
  const otherList = itemMutation({
    operationId: OPERATION_ID_3,
    listId: "list-2",
    itemId: "water"
  });

  const replay = await SyncLogic.replayNext(
    [first, sameList, otherList],
    async () => ({ ok: false, error: "list_deleted" }),
    "2026-07-15T08:05:00.000Z"
  );

  assert.equal(replay.action, "refresh");
  assert.deepEqual(replay.queue, [otherList]);
});

test("transient replay failure retains the operation with one more attempt", async () => {
  const mutation = itemMutation();

  const replay = await SyncLogic.replayNext(
    [mutation],
    async () => ({ ok: false, error: "network_error" }),
    "2026-07-15T08:06:00.000Z"
  );

  assert.equal(replay.action, "retry");
  assert.equal(replay.queue[0].attempts, 1);
  assert.equal(replay.queue[0].attemptedAt, "2026-07-15T08:06:00.000Z");
  assert.equal(replay.queue[0].lastError, "network_error");
  assert.equal(replay.queue[0].operationId, OPERATION_ID_1);
});

test("a missing service response never removes a queued mutation", async () => {
  const mutation = itemMutation();

  const replay = await SyncLogic.replayNext([mutation], async () => undefined, "2026-07-15T08:07:00.000Z");

  assert.equal(replay.action, "retry");
  assert.equal(replay.queue[0].operationId, OPERATION_ID_1);
  assert.equal(replay.queue[0].attempts, 1);
});

test("item payloads always clamp quantity to the server range", () => {
  const baseItem = {
    id: "milk",
    name: "Milch",
    shelfId: "dairy",
    shelfTitle: "Milchprodukte",
    quantity: 100,
    done: false
  };

  assert.equal(SyncLogic.createItemPayload(baseItem).quantity, 99);
  assert.equal(SyncLogic.createItemPayload({ ...baseItem, quantity: -4 }).quantity, 1);
});

test("only an unconfirmed list creation protects a server-missing list from pruning", () => {
  const create = SyncLogic.createMutation({
    operationId: OPERATION_ID_1,
    accountId: ACCOUNT_ID,
    type: "create_list",
    listId: "list-new",
    payload: { name: "Neu" },
    createdAt: CREATED_AT
  });
  const edit = itemMutation({ operationId: OPERATION_ID_2, listId: "list-old" });

  assert.equal(SyncLogic.shouldRetainMissingList([create, edit], "list-new"), true);
  assert.equal(SyncLogic.shouldRetainMissingList([create, edit], "list-old"), false);
  assert.equal(SyncLogic.shouldRetainMissingList([], "list-new"), false);
});
