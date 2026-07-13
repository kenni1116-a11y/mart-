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

test("ordinary activation bootstraps and pulls before enabling writes", async () => {
  const calls = [];
  const result = await AccountLogic.runActivationSequence({
    authenticate: async () => {
      calls.push("authenticate");
      return { id: "123e4567-e89b-12d3-a456-426614174001" };
    },
    bootstrap: async () => {
      calls.push("bootstrap");
      return { id: "123e4567-e89b-12d3-a456-426614174002" };
    },
    pull: async () => {
      calls.push("pull");
      return true;
    },
    enableWrites: async () => calls.push("enableWrites")
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls, ["authenticate", "bootstrap", "pull", "enableWrites"]);
});

test("a failed initial pull never enables writes and returns the authenticated user", async () => {
  const authUser = { id: "123e4567-e89b-12d3-a456-426614174001" };
  const calls = [];
  const result = await AccountLogic.runActivationSequence({
    authenticate: async () => authUser,
    bootstrap: async () => ({ id: "123e4567-e89b-12d3-a456-426614174002" }),
    pull: async () => {
      calls.push("pull");
      return false;
    },
    enableWrites: async () => calls.push("enableWrites")
  });

  assert.equal(result.status, "initial_load_failed");
  assert.equal(result.authUser, authUser);
  assert.deepEqual(calls, ["pull"]);
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
  assert.equal(result.authUser.id, "123e4567-e89b-12d3-a456-426614174001");
  assert.deepEqual(calls, ["authenticate", "requestPairing"]);
});

test("every post-auth activation failure returns the authenticated user", async () => {
  const authUser = { id: "123e4567-e89b-12d3-a456-426614174001" };
  const pairing = { pairingId: "123e4567-e89b-12d3-a456-426614174000", pairingToken: "a".repeat(48) };
  const cases = [
    {
      name: "request",
      options: {
        pairing,
        requestPairing: async () => ({ ok: false, error: "request_failed" }),
        waitForApproval: async () => ({ ok: true, status: "approved" }),
        bootstrap: async () => ({ id: "account" }),
        pull: async () => true
      }
    },
    {
      name: "status",
      options: {
        pairing,
        requestPairing: async () => ({ ok: true }),
        waitForApproval: async () => ({ ok: false, error: "status_failed" }),
        bootstrap: async () => ({ id: "account" }),
        pull: async () => true
      }
    },
    {
      name: "bootstrap",
      options: {
        bootstrap: async () => null,
        pull: async () => true
      }
    },
    {
      name: "pull",
      options: {
        bootstrap: async () => ({ id: "account" }),
        pull: async () => false
      }
    }
  ];

  for (const failureCase of cases) {
    const result = await AccountLogic.runActivationSequence({
      authenticate: async () => authUser,
      enableWrites: async () => assert.fail(`${failureCase.name} failure enabled writes`),
      ...failureCase.options
    });
    assert.equal(result.ok, false, failureCase.name);
    assert.equal(result.authUser, authUser, failureCase.name);
  }
});

test("auth events route pending pairing and signed-out state through connection", () => {
  assert.equal(AccountLogic.routeAuthEvent({
    event: "SIGNED_IN",
    hasAuthUser: true,
    isDeviceUser: true,
    hasPendingPairing: true,
    accountReady: true
  }), "connect");
  assert.equal(AccountLogic.routeAuthEvent({
    event: "SIGNED_OUT",
    hasAuthUser: false,
    isDeviceUser: false,
    hasPendingPairing: false,
    accountReady: true
  }), "reconnect");
  assert.equal(AccountLogic.routeAuthEvent({
    event: "TOKEN_REFRESHED",
    hasAuthUser: true,
    isDeviceUser: true,
    hasPendingPairing: false,
    accountReady: true
  }), "activate");
});

test("pairing and data-epoch activation discard target and unscoped snapshot queues", () => {
  const storage = createStorage({
    "shopping-list-app.sync-write-queue": "unscoped queue",
    "shopping-list-app.sync-outbox": "unscoped outbox",
    "shopping-list-app.sync-write-queue:target-account": "target queue",
    "shopping-list-app.sync-outbox:target-account": "target outbox",
    "shopping-list-app.sync-write-queue:old-account": "old queue",
    "shopping-list-app.lists:target-account": "target lists"
  });

  AccountLogic.prepareAccountActivationStorage(storage, {
    accountId: "target-account",
    prefixes: ["shopping-list-app.lists", "shopping-list-app.sync-write-queue", "shopping-list-app.sync-outbox"],
    queueKeys: ["shopping-list-app.sync-write-queue", "shopping-list-app.sync-outbox"],
    discardStaleQueues: true
  });

  assert.equal(storage.getItem("shopping-list-app.sync-write-queue"), null);
  assert.equal(storage.getItem("shopping-list-app.sync-outbox"), null);
  assert.equal(storage.getItem("shopping-list-app.sync-write-queue:target-account"), null);
  assert.equal(storage.getItem("shopping-list-app.sync-outbox:target-account"), null);
  assert.equal(storage.getItem("shopping-list-app.sync-write-queue:old-account"), null);
  assert.equal(storage.getItem("shopping-list-app.lists:target-account"), "target lists");
});

test("ordinary activation preserves the current account snapshot queue", () => {
  const storage = createStorage({
    "shopping-list-app.sync-write-queue:target-account": "target queue",
    "shopping-list-app.sync-outbox:target-account": "target outbox"
  });

  AccountLogic.prepareAccountActivationStorage(storage, {
    accountId: "target-account",
    prefixes: ["shopping-list-app.sync-write-queue", "shopping-list-app.sync-outbox"],
    queueKeys: ["shopping-list-app.sync-write-queue", "shopping-list-app.sync-outbox"],
    discardStaleQueues: false
  });

  assert.equal(storage.getItem("shopping-list-app.sync-write-queue:target-account"), "target queue");
  assert.equal(storage.getItem("shopping-list-app.sync-outbox:target-account"), "target outbox");
});

test("pairing retention distinguishes terminal, account, and transient results", () => {
  for (const terminal of ["invalid_pairing", "expired", "cancelled", "pairing_cancelled"]) {
    assert.equal(AccountLogic.pairingRetentionAction({ error: terminal }), "clear", terminal);
  }
  assert.equal(AccountLogic.pairingRetentionAction({ error: "account_in_use" }), "open-account");
  assert.equal(AccountLogic.pairingRetentionAction({ error: "Failed to fetch" }), "retain");
  assert.equal(AccountLogic.pairingRetentionAction({ error: "pairing_not_found" }), "retain");
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
