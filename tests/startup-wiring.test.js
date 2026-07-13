const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("tested app logic loads before the browser entrypoint", () => {
  const html = read("index.html");
  const accountIndex = html.indexOf("./account-logic.js?v=61");
  const helperIndex = html.indexOf("./app-logic.js?v=61");
  const appIndex = html.indexOf("./app.js?v=61");

  assert.notEqual(accountIndex, -1, "index.html must load account-logic.js");
  assert.notEqual(helperIndex, -1, "index.html must load app-logic.js");
  assert.notEqual(appIndex, -1, "index.html must load the current app.js release");
  assert.ok(accountIndex < helperIndex, "account-logic.js must load before app-logic.js");
  assert.ok(helperIndex < appIndex, "app-logic.js must load before app.js");
});

test("the service worker keeps the tested helper available offline", () => {
  const serviceWorker = read("sw.js");

  assert.match(serviceWorker, /const CACHE_NAME = "einkaufszettel-v61"/);
  assert.match(serviceWorker, /"\.\/account-logic\.js"/);
  assert.match(serviceWorker, /"\.\/app-logic\.js"/);
});

test("browser startup routes auth events and pairing status through the tested v3 path", () => {
  const app = read("app.js");
  const authCallback = app.slice(app.indexOf("authSubscription = collaborationService.onAuthStateChange"));

  assert.match(app, /rpc\("get_device_pairing_status_v3"/);
  assert.match(authCallback, /MartAccountLogic\.routeAuthEvent/);
  assert.match(authCallback, /route === "connect" \|\| route === "reconnect"/);
});

test("activation storage cleanup is wired before the authoritative first pull", () => {
  const app = read("app.js");
  const resolveStart = app.indexOf("async function resolveAndLoadAccount");
  const resolveEnd = app.indexOf("async function enableAccountWrites", resolveStart);
  const resolveBody = app.slice(resolveStart, resolveEnd);

  assert.match(resolveBody, /MartAccountLogic\.prepareAccountActivationStorage/);
  assert.ok(resolveBody.indexOf("prepareAccountActivationStorage") < resolveBody.indexOf("return account"));
});

test("the first relational pull is read-only and profile sync starts after writes are enabled", () => {
  const app = read("app.js");
  const fetchStart = app.indexOf("async fetchRelationalLists");
  const fetchEnd = app.indexOf("async publishLists", fetchStart);
  const fetchBody = app.slice(fetchStart, fetchEnd);
  const enableStart = app.indexOf("async function enableAccountWrites");
  const enableEnd = app.indexOf("async function startReadyAccountFeatures", enableStart);
  const enableBody = app.slice(enableStart, enableEnd);

  assert.doesNotMatch(fetchBody, /upsertProfile|update_account_profile/);
  assert.match(enableBody, /collaborationService\.upsertProfile/);
  assert.ok(enableBody.indexOf("outboundSyncEnabled = true") < enableBody.indexOf("collaborationService.upsertProfile"));
});

test("retained pairing failures expose retry and cancel and clear only after Account opens", () => {
  const app = read("app.js");
  const openStart = app.indexOf("async function openExistingAccountForPairing");
  const openEnd = app.indexOf("function showRetainedPairingError", openStart);
  const openBody = app.slice(openStart, openEnd);
  const connectStart = app.indexOf("async function connectDeviceAccount");
  const connectEnd = app.indexOf("function handleRealtimeMessage", connectStart);
  const connectBody = app.slice(connectStart, connectEnd);

  assert.match(app, /data-retry-pending-device-pairing/);
  assert.match(app, /data-cancel-pending-device-pairing/);
  assert.ok(openBody.indexOf("try {") < openBody.indexOf("activateAccount"));
  assert.ok(openBody.indexOf("showMore()") < openBody.indexOf("showProfile()"));
  assert.ok(openBody.indexOf("showProfile()") < openBody.indexOf("clearPendingDevicePairing()"));
  assert.match(connectBody, /catch \(error\) \{[\s\S]*pendingDevicePairing[\s\S]*showRetainedPairingError/);
});

test("account deletion is confirmed, retryable, and isolated from pairing", () => {
  const app = read("app.js");
  const profileStart = app.indexOf("function showProfile");
  const profileEnd = app.indexOf("async function saveProfile", profileStart);
  const profileBody = app.slice(profileStart, profileEnd);
  const confirmationStart = app.indexOf("function showAccountDeletionConfirmation");
  const confirmationEnd = app.indexOf("async function deleteCurrentAccount", confirmationStart);
  const confirmationBody = app.slice(confirmationStart, confirmationEnd);
  const deletionStart = app.indexOf("async function deleteCurrentAccount");
  const deletionEnd = app.indexOf("function accountFlowError", deletionStart);
  const deletionBody = app.slice(deletionStart, deletionEnd);
  const pairingStart = app.indexOf("async function startDevicePairing");
  const pairingEnd = app.indexOf("async function copyBugReport", pairingStart);
  const pairingBody = app.slice(pairingStart, pairingEnd);

  assert.match(profileBody, /class="is-danger"[^>]*data-delete-account[^>]*>Account löschen<\/button>/);
  assert.ok(profileBody.indexOf("data-delete-account") > profileBody.indexOf("data-open-account-recovery"));
  assert.match(confirmationBody, /data-confirm-account-deletion[^>]*>Ja<\/button>/);
  assert.match(confirmationBody, /data-cancel-account-deletion[^>]*>Abbrechen<\/button>/);
  assert.match(confirmationBody, /data-account-deletion-status/);
  assert.match(confirmationBody, /data-retry-account-deletion/);
  assert.match(deletionBody, /createAccountDeletionFlow/);
  assert.match(deletionBody, /clearPendingDevicePairing/);
  assert.match(deletionBody, /collaborationService\.signOut/);
  assert.equal((app.match(/rpc\("delete_current_account_v3"/g) ?? []).length, 1);
  assert.doesNotMatch(pairingBody, /delete_current_account_v3|deleteCurrentAccount|data-delete-account/);
});
