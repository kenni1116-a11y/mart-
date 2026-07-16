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

  function createItemPayload(item = {}) {
    const itemId = cleanRequiredText(item.id, "itemId");
    const quantity = Math.max(1, Math.min(99, Math.round(Number(item.quantity) || 1)));
    return {
      itemId,
      productId: itemId.startsWith("manual:") ? "" : itemId,
      name: typeof item.name === "string" ? item.name.trim().slice(0, 80) : "",
      shelfId: typeof item.shelfId === "string" ? item.shelfId : "",
      shelfTitle: typeof item.shelfTitle === "string" ? item.shelfTitle : "",
      shelfIcon: typeof item.shelfIcon === "string" ? item.shelfIcon : "",
      quantity,
      done: Boolean(item.done),
      note: typeof item.note === "string" ? item.note.trim().slice(0, 48) : ""
    };
  }

  function shouldRetainMissingList(queue, listId) {
    return Array.isArray(queue) && queue.some((mutation) => (
      mutation?.type === "create_list"
      && mutation.listId === listId
    ));
  }

  async function applyMutationWithClient(client, mutation) {
    if (!client?.rpc) return { ok: false, error: "network_error", offline: true };
    try {
      const { data, error } = await client.rpc("apply_list_mutation_v3", {
        operation_id: mutation.operationId,
        target_list_id: mutation.listId,
        mutation_type: mutation.type,
        payload: mutation.payload
      });
      if (error) {
        return {
          ok: false,
          error: typeof error.code === "string" && error.code ? error.code : "server_error",
          message: typeof error.message === "string" ? error.message : ""
        };
      }
      if (data && typeof data === "object" && !Array.isArray(data)) return data;
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        error: "network_error",
        message: typeof error?.message === "string" ? error.message : ""
      };
    }
  }

  function resolveReplay(queue, operation, result, attemptedAt = new Date().toISOString()) {
    const currentQueue = Array.isArray(queue) ? queue : [];
    const response = result && typeof result === "object"
      ? result
      : { ok: false, error: "network_error" };
    if (!operation?.operationId) return { action: "idle", queue: currentQueue, result: response };
    if (response.ok === true) {
      return {
        action: "applied",
        queue: currentQueue.filter((entry) => entry?.operationId !== operation.operationId),
        operation,
        result: response
      };
    }
    if (!shouldRetry(response.error)) {
      return {
        action: "refresh",
        queue: currentQueue.filter((entry) => entry?.listId !== operation.listId),
        operation,
        result: response
      };
    }
    return {
      action: "retry",
      queue: currentQueue.map((entry) => entry?.operationId === operation.operationId
        ? {
            ...entry,
            attempts: Number(entry.attempts || 0) + 1,
            attemptedAt,
            lastError: response.error || "server_error"
          }
        : entry),
      operation,
      result: response
    };
  }

  async function replayNext(queue, applyMutation, attemptedAt = new Date().toISOString()) {
    const currentQueue = Array.isArray(queue) ? queue : [];
    const operation = currentQueue[0];
    if (!operation) return { action: "idle", queue: currentQueue, result: null };
    let result;
    try {
      result = await applyMutation(operation);
    } catch (error) {
      result = {
        ok: false,
        error: "network_error",
        message: typeof error?.message === "string" ? error.message : ""
      };
    }
    return resolveReplay(currentQueue, operation, result, attemptedAt);
  }

  return {
    createMutation,
    createItemPayload,
    shouldRetainMissingList,
    compactQueue,
    shouldRetry,
    applyMutationWithClient,
    resolveReplay,
    replayNext
  };
});
