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
  const release = read("sw.js").match(/einkaufszettel-v(\d+)/)?.[1];
  const accountIndex = html.indexOf(`./account-logic.js?v=${release}`);
  const syncIndex = html.indexOf(`./sync-logic.js?v=${release}`);
  const helperIndex = html.indexOf(`./app-logic.js?v=${release}`);
  const appIndex = html.indexOf(`./app.js?v=${release}`);

  assert.notEqual(accountIndex, -1, "index.html must load account-logic.js");
  assert.notEqual(syncIndex, -1, "index.html must load sync-logic.js");
  assert.notEqual(helperIndex, -1, "index.html must load app-logic.js");
  assert.notEqual(appIndex, -1, "index.html must load the current app.js release");
  assert.ok(accountIndex < syncIndex, "account-logic.js must load before sync-logic.js");
  assert.ok(syncIndex < helperIndex, "sync-logic.js must load before app-logic.js");
  assert.ok(helperIndex < appIndex, "app-logic.js must load before app.js");
});

test("the service worker keeps the tested helper available offline", () => {
  const serviceWorker = read("sw.js");

  assert.match(serviceWorker, /const CACHE_NAME = "einkaufszettel-v\d+"/);
  assert.match(serviceWorker, /"\.\/account-logic\.js"/);
  assert.match(serviceWorker, /"\.\/sync-logic\.js"/);
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
  const fetchEnd = app.indexOf("async fetchSharedLists", fetchStart);
  const fetchBody = app.slice(fetchStart, fetchEnd);
  const enableStart = app.indexOf("async function enableAccountWrites");
  const enableEnd = app.indexOf("async function startReadyAccountFeatures", enableStart);
  const enableBody = app.slice(enableStart, enableEnd);

  assert.doesNotMatch(fetchBody, /upsertProfile|update_account_profile/);
  assert.match(enableBody, /collaborationService\.upsertProfile/);
  assert.ok(enableBody.indexOf("outboundSyncEnabled = true") < enableBody.indexOf("collaborationService.upsertProfile"));
});

test("browser writes use account-bound item mutations instead of list snapshots", () => {
  const app = read("app.js");
  const saveStart = app.indexOf("function save(options = {})");
  const saveEnd = app.indexOf("function applyBackgroundTheme", saveStart);
  const saveBody = app.slice(saveStart, saveEnd);
  const actionNames = [
    "addToList",
    "updateQuantity",
    "toggleDone",
    "removeItem",
    "clearDone",
    "addList",
    "saveRenamedList",
    "saveItemNote",
    "clearItemNote"
  ];

  assert.match(app, /syncMutations: "shopping-list-app\.sync-mutations"/);
  assert.match(app, /async applyMutation\(mutation\)/);
  assert.match(app, /collaborationService\.applyMutation\(operation\)/);
  assert.doesNotMatch(app, /persistOwnedListRow|publishRelationalLists|publishListSnapshot/);
  assert.doesNotMatch(saveBody, /publishLists|applyMutation|queueMutation|commitMutation/);
  actionNames.forEach((name) => {
    const start = app.indexOf(`function ${name}`);
    const end = app.indexOf("\nfunction ", start + 10);
    assert.notEqual(start, -1, `${name} must exist`);
    assert.match(app.slice(start, end), /commitMutation/, `${name} must commit a mutation`);
  });
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
  assert.match(confirmationBody, /currentUser\.userId/);
  assert.match(deletionBody, /accountDeletionExpectedAccountId/);
  assert.match(deletionBody, /clearPendingDevicePairing/);
  assert.match(deletionBody, /collaborationService\.signOut/);
  assert.match(app, /async deleteCurrentAccount\(expectedAccountId\)/);
  assert.match(app, /rpc\("delete_current_account_v3", \{\s*expected_account_id: expectedAccountId\s*\}\)/);
  assert.equal((app.match(/rpc\("delete_current_account_v3"/g) ?? []).length, 1);
  assert.doesNotMatch(pairingBody, /delete_current_account_v3|deleteCurrentAccount|data-delete-account/);
});

test("list deletion and the zero-list state cannot resurrect cached notes", () => {
  const app = read("app.js");
  const styles = read("styles.css");
  const mergeStart = app.indexOf("function mergeRemoteLists");
  const mergeEnd = app.indexOf("async function pullRemoteLists", mergeStart);
  const mergeBody = app.slice(mergeStart, mergeEnd);
  const deleteStart = app.indexOf("async function deleteList");
  const deleteEnd = app.indexOf("function renameList", deleteStart);
  const deleteBody = app.slice(deleteStart, deleteEnd);
  const emptyStart = app.indexOf("function emptyNotesMarkup");
  const emptyEnd = app.indexOf("function renderNotes", emptyStart);
  const emptyBody = app.slice(emptyStart, emptyEnd);

  assert.match(app, /function discardMutationsForList\(listId\)/);
  assert.match(mergeBody, /remoteList\.deletedAt[\s\S]*discardMutationsForList\(remoteList\.id\)/);
  assert.match(mergeBody, /!hasAccess[\s\S]*discardMutationsForList\(remoteList\.id\)/);
  assert.match(deleteBody, /ownerId !== currentUser\.userId[\s\S]*leaveSharedList/);
  assert.match(deleteBody, /window\.confirm[\s\S]*createListMutation\("delete_list"/);
  assert.equal((emptyBody.match(/data-empty-add-list/g) ?? []).length, 1);
  assert.match(styles, /\.notes-board\.is-empty[\s\S]*align-content:\s*center/);
  assert.match(styles, /\.empty-notes-state[\s\S]*place-items:\s*center/);
});

test("the mutation queue never truncates writes and ownership transfer is server-first", () => {
  const app = read("app.js");
  const storeStart = app.indexOf("function storeMutationQueue");
  const storeEnd = app.indexOf("function discardMutationsForList", storeStart);
  const storeBody = app.slice(storeStart, storeEnd);
  const transferStart = app.indexOf("async function transferOwnership");
  const transferEnd = app.indexOf("async function regenerateInvite", transferStart);
  const transferBody = app.slice(transferStart, transferEnd);

  assert.doesNotMatch(storeBody, /\.slice\(/);
  assert.match(app, /async transferListOwnership\(listId, userId\)/);
  assert.match(transferBody, /await collaborationService\.transferListOwnership/);
  assert.ok(transferBody.indexOf("await collaborationService.transferListOwnership") < transferBody.indexOf("listData.ownerId ="));
});
