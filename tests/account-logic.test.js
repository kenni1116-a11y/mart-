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
