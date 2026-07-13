const assert = require("node:assert/strict");
const test = require("node:test");
const AccountLogic = require("../account-logic.js");

test("pairing payload is validated and returned with a clean URL", () => {
  const parsed = AccountLogic.parsePairingUrl(
    "https://example.test/mart-/#pair=123e4567-e89b-12d3-a456-426614174000&pairToken=" + "a".repeat(48)
  );
  assert.equal(parsed.pairingId, "123e4567-e89b-12d3-a456-426614174000");
  assert.equal(parsed.pairingToken, "a".repeat(48));
  assert.equal(parsed.cleanUrl, "https://example.test/mart-/");
});

test("pending pairing precedes account bootstrap", () => {
  const state = AccountLogic.nextActivationState({ phase: "authenticating" }, { type: "AUTHENTICATED", hasPairing: true });
  assert.deepEqual(state, { phase: "pairing", canRead: false, canWrite: false });
});

test("writes unlock only after the first remote load", () => {
  const loading = AccountLogic.nextActivationState({ phase: "loading" }, { type: "ACCOUNT_RESOLVED" });
  const ready = AccountLogic.nextActivationState(loading, { type: "REMOTE_LOADED" });
  assert.equal(loading.canWrite, false);
  assert.equal(ready.canWrite, true);
});

function createStorage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    get length() {
      return values.size;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}

test("a pairing URL is persisted before it is cleaned and restored after reload", () => {
  const storage = createStorage();
  const cleanedUrls = [];
  const sourceUrl = "https://example.test/mart-/#pair=123e4567-e89b-12d3-a456-426614174000&pairToken=" + "a".repeat(48);

  const captured = AccountLogic.capturePendingDevicePairing(sourceUrl, storage, (cleanUrl) => cleanedUrls.push(cleanUrl));
  const restored = AccountLogic.restorePendingDevicePairing(storage);

  assert.deepEqual(captured, {
    pairingId: "123e4567-e89b-12d3-a456-426614174000",
    pairingToken: "a".repeat(48)
  });
  assert.deepEqual(restored, captured);
  assert.deepEqual(cleanedUrls, ["https://example.test/mart-/"]);
});

test("a pairing URL is not cleaned when session persistence fails", () => {
  const storage = createStorage();
  storage.setItem = () => {
    throw new Error("session storage unavailable");
  };
  const cleanedUrls = [];

  assert.throws(() => AccountLogic.capturePendingDevicePairing(
    "https://example.test/mart-/#pair=123e4567-e89b-12d3-a456-426614174000&pairToken=" + "a".repeat(48),
    storage,
    (cleanUrl) => cleanedUrls.push(cleanUrl)
  ), /session storage unavailable/);
  assert.deepEqual(cleanedUrls, []);
});

test("paired activation requests approval before bootstrap, pull, and writes without publishing", async () => {
  const calls = [];
  await AccountLogic.runActivationSequence({
    pairing: { pairingId: "123e4567-e89b-12d3-a456-426614174000", pairingToken: "a".repeat(48) },
    authenticate: async () => {
      calls.push("authenticate");
      return { id: "123e4567-e89b-12d3-a456-426614174001" };
    },
    requestPairing: async () => {
      calls.push("requestPairing");
      return { ok: true };
    },
    waitForApproval: async () => {
      calls.push("waitForApproval");
      return { ok: true, status: "approved" };
    },
    bootstrap: async () => {
      calls.push("bootstrap");
      return { id: "123e4567-e89b-12d3-a456-426614174002" };
    },
    pull: async () => calls.push("pull"),
    enableWrites: async () => calls.push("enableWrites")
  });

  assert.deepEqual(calls, ["authenticate", "requestPairing", "waitForApproval", "bootstrap", "pull", "enableWrites"]);
  assert.equal(calls.includes("publish"), false);
});

test("account_in_use stops paired activation without bootstrap or cache cleanup", async () => {
  const calls = [];
  const result = await AccountLogic.runActivationSequence({
    pairing: { pairingId: "123e4567-e89b-12d3-a456-426614174000", pairingToken: "a".repeat(48) },
    authenticate: async () => {
      calls.push("authenticate");
      return { id: "123e4567-e89b-12d3-a456-426614174001" };
    },
    requestPairing: async () => {
      calls.push("requestPairing");
      return { ok: false, error: "account_in_use" };
    },
    waitForApproval: async () => calls.push("waitForApproval"),
    bootstrap: async () => calls.push("bootstrap"),
    pull: async () => calls.push("pull"),
    enableWrites: async () => calls.push("enableWrites")
  });

  assert.equal(result.status, "account_in_use");
  assert.deepEqual(calls, ["authenticate", "requestPairing"]);
});

test("an invalid refresh token keeps foreign caches until verification, then clears them before anonymous sign-in", async () => {
  const storage = createStorage({
    "shopping-list-app.lists:old-account": "[\"old list\"]",
    "shopping-list-app.sync-write-queue:old-account": "[\"old queue\"]",
    "shopping-list-app.mock-realtime": "old realtime state"
  });
  const calls = [];
  const result = await AccountLogic.authenticateDeviceIdentity({
    getSession: async () => {
      calls.push("getSession");
      assert.notEqual(storage.getItem("shopping-list-app.lists:old-account"), null);
      return { user: { id: "123e4567-e89b-12d3-a456-426614174001", is_anonymous: true } };
    },
    getUser: async () => {
      calls.push("getUser");
      assert.notEqual(storage.getItem("shopping-list-app.lists:old-account"), null);
      return { user: null, error: new Error("Invalid Refresh Token: Refresh Token Not Found") };
    },
    signOutLocal: async () => calls.push("signOut"),
    clearInvalidSessionData: () => {
      calls.push("cleanup");
      AccountLogic.removeForeignAccountCaches(storage, [
        "shopping-list-app.lists",
        "shopping-list-app.sync-write-queue",
        "shopping-list-app.mock-realtime"
      ], "");
    },
    signInAnonymously: async () => {
      calls.push("signInAnonymously");
      assert.equal(storage.getItem("shopping-list-app.lists:old-account"), null);
      assert.equal(storage.getItem("shopping-list-app.sync-write-queue:old-account"), null);
      assert.equal(storage.getItem("shopping-list-app.mock-realtime"), null);
      return { id: "123e4567-e89b-12d3-a456-426614174002", is_anonymous: true };
    },
    isDeviceAuthUser: (user) => user?.is_anonymous === true
  });

  assert.equal(result.invalidSession, true);
  assert.equal(result.user.id, "123e4567-e89b-12d3-a456-426614174002");
  assert.deepEqual(calls, ["getSession", "getUser", "signOut", "cleanup", "signInAnonymously"]);
  assert.equal(storage.getItem("shopping-list-app.lists:123e4567-e89b-12d3-a456-426614174002"), null);
});

test("an invalid refresh token reported by session lookup also starts a clean anonymous identity", async () => {
  const calls = [];
  const result = await AccountLogic.authenticateDeviceIdentity({
    getSession: async () => {
      calls.push("getSession");
      return { user: null, error: new Error("Invalid Refresh Token") };
    },
    getUser: async () => {
      calls.push("getUser");
      return { user: null, error: null };
    },
    signOutLocal: async () => calls.push("signOut"),
    clearInvalidSessionData: () => calls.push("cleanup"),
    signInAnonymously: async () => {
      calls.push("signInAnonymously");
      return { id: "123e4567-e89b-12d3-a456-426614174003", is_anonymous: true };
    },
    isDeviceAuthUser: (user) => user?.is_anonymous === true
  });

  assert.equal(result.invalidSession, true);
  assert.deepEqual(calls, ["getSession", "signOut", "cleanup", "signInAnonymously"]);
});
