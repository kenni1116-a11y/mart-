(function exposeMartSyncLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MartSyncLogic = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const mutationTypes = new Set([
    "create_list",
    "rename_list",
    "upsert_item",
    "delete_item",
    "delete_list",
    "leave_list"
  ]);
  const itemMutationTypes = new Set(["upsert_item", "delete_item"]);
  const nonRetryableErrors = new Set([
    "membership_removed",
    "list_deleted",
    "forbidden",
    "invalid_mutation"
  ]);

  function cleanRequiredText(value, field) {
    const cleaned = typeof value === "string" ? value.trim() : "";
    if (!cleaned) throw new TypeError(`${field} is required`);
    return cleaned;
  }

  function assertJsonValue(value, seen = new Set()) {
    if (value === null || typeof value === "string" || typeof value === "boolean") return;
    if (typeof value === "number" && Number.isFinite(value)) return;
    if (typeof value !== "object") throw new TypeError("payload must be JSON-safe");
    if (seen.has(value)) throw new TypeError("payload must be JSON-safe");
    seen.add(value);
    if (Array.isArray(value)) {
      value.forEach((entry) => assertJsonValue(entry, seen));
    } else {
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== Object.prototype && prototype !== null) {
        throw new TypeError("payload must be JSON-safe");
      }
      Object.values(value).forEach((entry) => assertJsonValue(entry, seen));
    }
    seen.delete(value);
  }

  function jsonPayloadCopy(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new TypeError("payload must be a JSON object");
    }
    assertJsonValue(payload);
    return JSON.parse(JSON.stringify(payload));
  }

  function createMutation(input = {}) {
    if (!UUID.test(input.operationId ?? "")) throw new TypeError("operationId must be a UUID");
    if (!UUID.test(input.accountId ?? "")) throw new TypeError("accountId must be a UUID");
    if (!mutationTypes.has(input.type)) throw new TypeError("type is not supported");

    const listId = cleanRequiredText(input.listId, "listId");
    const itemId = typeof input.itemId === "string" ? input.itemId.trim() : "";
    if (itemMutationTypes.has(input.type) && !itemId) throw new TypeError("itemId is required");

    const createdDate = input.createdAt ? new Date(input.createdAt) : new Date();
    if (Number.isNaN(createdDate.getTime())) throw new TypeError("createdAt must be a valid date");

    const attempts = input.attempts ?? 0;
    if (!Number.isInteger(attempts) || attempts < 0) {
      throw new TypeError("attempts must be a non-negative integer");
    }

    return {
      operationId: input.operationId,
      accountId: input.accountId,
      type: input.type,
      listId,
      itemId,
      payload: jsonPayloadCopy(input.payload ?? {}),
      createdAt: createdDate.toISOString(),
      attempts
    };
  }

  function wasAttempted(mutation) {
    return Number(mutation?.attempts ?? 0) > 0 || Boolean(mutation?.attemptedAt);
  }

  function compactQueue(queue, mutation) {
    const currentQueue = Array.isArray(queue) ? [...queue] : [];
    if (currentQueue.some((entry) => entry?.operationId === mutation?.operationId)) {
      return currentQueue;
    }

    if (mutation?.type === "upsert_item" && !wasAttempted(mutation)) {
      const replaceIndex = currentQueue.findIndex((entry) => (
        entry?.type === "upsert_item"
        && !wasAttempted(entry)
        && entry.accountId === mutation.accountId
        && entry.listId === mutation.listId
        && entry.itemId === mutation.itemId
      ));
      if (replaceIndex >= 0) {
        currentQueue[replaceIndex] = mutation;
        return currentQueue;
      }
    }

    return [...currentQueue, mutation];
  }

  function shouldRetry(errorCode) {
    const code = typeof errorCode === "string"
      ? errorCode
      : (errorCode?.error ?? errorCode?.code ?? "");
    return !nonRetryableErrors.has(code);
  }

  return {
    createMutation,
    compactQueue,
    shouldRetry
  };
});
