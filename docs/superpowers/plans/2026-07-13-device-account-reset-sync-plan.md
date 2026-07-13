# Reliable Device Accounts and List Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve Maike's account, remove obsolete accounts safely, make iPhone device pairing reliable, and replace stale full-list uploads with durable item-level synchronization guarded by automated release checks.

**Architecture:** Supabase remains the canonical store. Device pairing is handled before permanent account bootstrap, account activation blocks all writes until the first remote load succeeds, and user actions are sent as idempotent server mutations instead of full-list snapshots. The destructive cleanup is a separate, guarded operation performed only after backward-compatible database and client changes are deployed and verified.

**Tech Stack:** Static HTML/CSS/JavaScript, Supabase Auth/Postgres/RLS/Realtime, Node.js 22 built-in test runner, Playwright 1.61.1 with WebKit, GitHub Actions and GitHub Pages.

## Global Constraints

- Protect account ID `91c32055-3dce-4fcb-86d8-a22a624f921a`, username `user-6074F68`, display name `Maike`, and every valid record connected to it.
- Abort cleanup unless exactly one protected account and exactly one protected device are found.
- Export collaboration data locally before deleting anything.
- Never rerun `supabase/device_accounts_v2.sql` as a reset mechanism.
- Never expose or commit a Supabase service-role key, database password, or recovery code.
- Preserve a verified valid authentication session when the data epoch changes.
- Do not add shopping, pricing, market, catalogue, icon, or visual redesign features.
- Shared-list invitations and whole-account device pairing must remain separate flows.
- No local queue or cached list may publish before account activation and the first successful remote pull.
- Realtime is an invalidation signal; correctness must also survive missed realtime events.
- Use Node.js 22 in automation because current Supabase tooling has dropped Node.js 20 support.

## File Map

- Create `account-logic.js`: pure pairing URL, activation-state, and account-cache helpers usable in browser and Node tests.
- Create `sync-logic.js`: pure mutation construction, queue compaction, and replay-decision helpers.
- Modify `app.js`: Supabase I/O, account orchestration, UI actions, mutation replay, deletion behavior.
- Modify `index.html`: load new tested helpers before `app.js` and bump one release version consistently.
- Modify `sw.js`: cache new runtime helpers and use the same release number as `index.html`.
- Modify `supabase-config.js`: introduce the next data epoch only during the controlled-reset task.
- Create `supabase/device_pairing_v3.sql`: non-destructive pairing RPC upgrade.
- Create `supabase/list_mutations_v3.sql`: idempotent item/list mutation RPC and receipt table.
- Create `supabase/account_deletion_v3.sql`: current-account-only destructive RPC with session cleanup.
- Create `supabase/admin/reset_except_maike.sql`: guarded cleanup transaction; never run automatically.
- Create `tests/account-logic.test.js`: account and pairing unit tests.
- Create `tests/sync-logic.test.js`: mutation queue unit tests.
- Create `tests/sql/device_pairing_v3.test.sql`: transactional database pairing test.
- Create `tests/sql/list_mutations_v3.test.sql`: transactional concurrency, idempotency, and tombstone test.
- Create `tests/browser/collaboration.spec.js`: two-context startup, pairing, shared-list, and deletion smoke tests.
- Create `tests/browser/test-server.mjs`: shared in-memory collaboration backend and static server for isolated browser tests.
- Modify `tests/startup-wiring.test.js`: release/version/runtime-asset consistency checks.
- Create `scripts/verify-release.mjs`: one local and CI verification entry point.
- Create `scripts/smoke-production.mjs`: production startup and console-error check.
- Create `package.json` and `pnpm-lock.yaml`: pinned test tooling and commands.
- Create `.github/workflows/verify-and-deploy.yml`: verify before GitHub Pages deployment.
- Modify `.gitignore`: exclude local database backups and test artifacts.

---

## Phase 1: Device Identity and Pairing

### Task 1: Add Pure Account and Pairing Logic

**Files:**
- Create: `account-logic.js`
- Create: `tests/account-logic.test.js`
- Modify: `index.html:120-124`
- Modify: `sw.js:1-12`
- Modify: `tests/startup-wiring.test.js:8-27`

**Interfaces:**
- Consumes: URL strings, storage-like objects, account IDs, and activation events.
- Produces: `MartAccountLogic.parsePairingUrl(url)`, `MartAccountLogic.nextActivationState(state, event)`, `MartAccountLogic.accountStorageKey(base, accountId)`, and `MartAccountLogic.removeForeignAccountCaches(storage, prefixes, keepAccountId)`.

- [ ] **Step 1: Write failing pairing and activation tests**

```js
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
```

- [ ] **Step 2: Run tests and confirm the missing-module failure**

Run:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/account-logic.test.js
```

Expected: FAIL with `Cannot find module '../account-logic.js'`.

- [ ] **Step 3: Implement the UMD helper**

```js
(function exposeMartAccountLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MartAccountLogic = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const TOKEN = /^[a-f0-9]{48}$/i;

  function parsePairingUrl(value) {
    const url = new URL(value);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    const pairingId = hash.get("pair") || url.searchParams.get("pair") || "";
    const pairingToken = hash.get("pairToken") || url.searchParams.get("pairToken") || "";
    if (!pairingId && !pairingToken) return null;
    hash.delete("pair");
    hash.delete("pairToken");
    url.searchParams.delete("pair");
    url.searchParams.delete("pairToken");
    url.hash = hash.toString();
    return {
      invalid: !UUID.test(pairingId) || !TOKEN.test(pairingToken),
      pairingId,
      pairingToken,
      cleanUrl: url.href
    };
  }

  function nextActivationState(state, event) {
    if (event.type === "AUTHENTICATED") {
      return { phase: event.hasPairing ? "pairing" : "resolving", canRead: false, canWrite: false };
    }
    if (event.type === "PAIRING_APPROVED") return { phase: "resolving", canRead: false, canWrite: false };
    if (event.type === "ACCOUNT_RESOLVED") return { phase: "loading", canRead: false, canWrite: false };
    if (event.type === "REMOTE_LOADED") return { phase: "ready", canRead: true, canWrite: true };
    if (event.type === "FAILED") return { phase: "error", canRead: false, canWrite: false, error: event.error || "" };
    return state;
  }

  function accountStorageKey(base, accountId) {
    return `${base}:${accountId}`;
  }

  function removeForeignAccountCaches(storage, prefixes, keepAccountId) {
    const removed = [];
    Array.from({ length: storage.length }, (_, index) => storage.key(index))
      .filter(Boolean)
      .forEach((key) => {
        const prefix = prefixes.find((candidate) => key.startsWith(`${candidate}:`));
        if (!prefix || key === `${prefix}:${keepAccountId}`) return;
        storage.removeItem(key);
        removed.push(key);
      });
    return removed;
  }

  return { parsePairingUrl, nextActivationState, accountStorageKey, removeForeignAccountCaches };
});
```

- [ ] **Step 4: Wire the helper into runtime and cache manifests**

Load `./account-logic.js?v=61` immediately before `app-logic.js`, add `./account-logic.js` to `ASSETS`, and update the startup test to require `account-logic.js`, `app-logic.js`, and `app.js` in that order. Keep all local runtime query versions and `CACHE_NAME` at `v61`.

- [ ] **Step 5: Run focused tests and syntax checks**

Run:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/account-logic.test.js tests/startup-wiring.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check account-logic.js
```

Expected: all tests PASS and syntax check exits 0.

- [ ] **Step 6: Commit**

```bash
git add account-logic.js index.html sw.js tests/account-logic.test.js tests/startup-wiring.test.js
git commit -m "test: define account activation contract"
```

### Task 2: Add Backward-Compatible Pairing RPCs

**Files:**
- Create: `supabase/device_pairing_v3.sql`
- Create: `tests/sql/device_pairing_v3.test.sql`

**Interfaces:**
- Consumes: an authenticated anonymous user, pairing ID, 48-character token, device label, and platform.
- Produces: `public.request_device_pairing_v3(uuid,text,text,text)` and `public.approve_device_pairing_v3(uuid)` returning JSON objects with `ok`, `status`, and stable error codes.

- [ ] **Step 1: Write the transactional SQL test**

Create a `begin; ... rollback;` test that inserts two anonymous `auth.users`, uses `set_config('request.jwt.claim.sub', auth_user_id::text, true)`, bootstraps only the owner, creates a pairing, requests it as the second auth user without calling `bootstrap_account`, approves it as owner, and raises an exception unless both auth users resolve to the same account. Include cases proving that requesting never mutates an existing account, approval atomically removes a truly empty one-device transition account, and a non-empty existing account returns `account_in_use` unchanged.

The core assertions are:

```sql
if (request_result->>'status') <> 'pending' then
  raise exception 'expected pending pairing, got %', request_result;
end if;
if private.current_account_id() <> owner_account_id then
  raise exception 'new device was not attached to owner account';
end if;
if exists (select 1 from public.accounts where id = temporary_account_id) then
  raise exception 'empty temporary account still exists after approval';
end if;
```

- [ ] **Step 2: Run the test before installing v3 functions**

Run the file through Supabase MCP `execute_sql` or:

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f tests/sql/device_pairing_v3.test.sql
```

Expected: FAIL because `request_device_pairing_v3` does not exist. The final `rollback` guarantees no fixture survives.

- [ ] **Step 3: Implement the non-destructive migration**

The migration must not drop tables or users. It creates new v3 functions alongside current RPCs. `request_device_pairing_v3` must authenticate the caller, validate and lock the pairing, reject `already_connected`, and record only the pending identity and cleaned device metadata. It must never delete, detach, reassign, or otherwise mutate the requesting identity's current account or device.

```sql
create function public.request_device_pairing_v3(
  target_pairing_id uuid,
  pairing_token text,
  device_label text default 'Dieses Gerät',
  device_platform text default ''
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  request_user_id uuid := auth.uid();
  current_account_id uuid := private.current_account_id();
  pairing_row public.device_pairings%rowtype;
begin
  if request_user_id is null then return jsonb_build_object('ok', false, 'error', 'authentication_required'); end if;
  select * into pairing_row from public.device_pairings p
  where p.id = target_pairing_id and p.token_hash = private.secret_hash(pairing_token) for update;
  if pairing_row.id is null or pairing_row.cancelled_at is not null or pairing_row.approved_at is not null or pairing_row.expires_at <= now() then
    return jsonb_build_object('ok', false, 'error', 'invalid_pairing');
  end if;
  if current_account_id = pairing_row.account_id then return jsonb_build_object('ok', false, 'error', 'already_connected'); end if;
  update public.device_pairings set
    pending_auth_user_id = request_user_id,
    pending_device_label = private.clean_device_label(device_label),
    pending_device_platform = private.clean_platform(device_platform),
    requested_at = now()
  where id = target_pairing_id;
  return jsonb_build_object('ok', true, 'pairingId', target_pairing_id, 'status', 'pending',
    'confirmationCode', pairing_row.confirmation_code, 'expiresAt', pairing_row.expires_at);
end;
$$;
```

`approve_device_pairing_v3` is the only finalization point. It must lock the pairing, require the owner account and a pending auth user, serialize approvals for that identity, and re-read its current device/account after acquiring the lock. If there is no current account, attach the identity directly to the target account. If there is a current account, lock it and its device rows and treat it as in use when it has more than one device, any recovery credential, any owned shopping list including soft-deleted rows, or any list membership including removed rows. In that case return `account_in_use` without changing the existing account, device, or pairing approval state. Otherwise reassign the single empty transition device to the target account and remove the now-orphaned transition account within the same transaction. Only after the final mapping is verified may the function mark the pairing approved and return `status = approved`. Preserve the legacy `approve_device_pairing(uuid)` signature as a narrow delegate to this v3 finalizer so stale cached clients cannot bypass the safety checks. Revoke execution from `public` and `anon`; grant only to `authenticated`.

- [ ] **Step 4: Inspect security and test the migration**

Run Supabase database advisors, inspect every v3 function for explicit `auth.uid()` authorization, then execute `tests/sql/device_pairing_v3.test.sql`. The test must cover a two-device account, recovery credential, soft-deleted owned list, removed membership, competing approvals, a mixed v3-request/legacy-approval path, and complete before/after snapshots for every `account_in_use` case.

Expected: no security advisor error introduced by the migration; SQL test completes and rolls back.

- [ ] **Step 5: Commit**

```bash
git add supabase/device_pairing_v3.sql tests/sql/device_pairing_v3.test.sql
git commit -m "feat: pair devices before account bootstrap"
```

### Task 3: Enforce Pairing Before Bootstrap in the Client

**Files:**
- Modify: `app.js:1266-1320`
- Modify: `app.js:1488-1530`
- Modify: `app.js:2390-2585`
- Modify: `app.js:4594-4790`
- Modify: `app.js:6083-6115`
- Modify: `tests/account-logic.test.js`

**Interfaces:**
- Consumes: `MartAccountLogic`, v3 pairing RPCs, `sessionStorage`, and verified Supabase Auth sessions.
- Produces: `connectDeviceIdentity()`, `finishPendingDevicePairing()`, `resolveAndLoadAccount()`, and an `outboundSyncEnabled` barrier.

- [ ] **Step 1: Add failing orchestration tests using a fake collaboration service**

Test these exact call sequences:

```js
assert.deepEqual(calls, ["authenticate", "requestPairing", "waitForApproval", "bootstrap", "pull", "enableWrites"]);
assert.equal(calls.includes("publish"), false);
```

Also test invalid refresh-token handling preserves foreign list caches until authentication is known invalid, then removes them without copying them to the new account.

- [ ] **Step 2: Run focused tests and confirm failure**

Run `node --test tests/account-logic.test.js`; expected FAIL because orchestration helpers and the write barrier are absent.

- [ ] **Step 3: Replace eager data-epoch reset with deferred cleanup**

Change startup so `dataEpoch` mismatch sets `pendingDataEpochReset = true` but does not remove the Supabase auth token. After `getUser()` verifies a valid session and `bootstrap_account` resolves the account, call:

```js
MartAccountLogic.removeForeignAccountCaches(localStorage, accountStoragePrefixes, account.id);
localStorage.setItem(storageKeys.dataEpoch, targetEpoch);
```

If `getUser()` returns an invalid-refresh-token error, sign out locally, remove account-scoped caches and queues, and then call `signInAnonymously()`. Never assign old cached lists to the newly created account.

- [ ] **Step 4: Persist pairing payload until terminal status**

Store validated payload in `sessionStorage` under `shopping-list-app.pending-device-pairing`. Clean the visible URL only after storage succeeds. Clear that key only for `approved`, `cancelled`, `expired`, or explicit user cancellation.

- [ ] **Step 5: Split activation into the required order**

Set `outboundSyncEnabled = false` before authentication. If a pairing payload exists, call `request_device_pairing_v3` before `bootstrap_account`. If it returns `account_in_use`, stop pairing and direct the user to `Mehr` -> `Account`; never delete or detach the non-empty account from the pairing flow. After approval, bootstrap the target account, clear foreign caches, pull remote lists with pruning enabled, then set `outboundSyncEnabled = true` and start timers/realtime.

- [ ] **Step 6: Guard every write entry point**

Make `save`, queue flushing, focus/visibility refresh callbacks, realtime callbacks, and UI mutation functions return without publishing when `outboundSyncEnabled` is false. Editing controls remain disabled until activation phase is `ready`.

- [ ] **Step 7: Verify locally**

Run all Node tests and syntax checks. Start a local server and use two isolated browser contexts to confirm a pairing link reaches `pending` without a new permanent account being created.

- [ ] **Step 8: Commit**

```bash
git add app.js tests/account-logic.test.js
git commit -m "fix: activate paired account before loading lists"
```

### Task 4: Add Explicit Account Deletion

**Files:**
- Create: `supabase/account_deletion_v3.sql`
- Create: `tests/sql/account_deletion_v3.test.sql`
- Modify: `app.js`
- Modify: `tests/account-logic.test.js`

**Interfaces:**
- Consumes: the current authenticated device and a user-confirmed `Ja` action.
- Produces: `public.delete_current_account_v3()` plus the `Account löschen` settings action.

- [ ] **Step 1: Write failing SQL and UI tests**

The SQL test creates an account with two auth devices, one owned list, one item, one membership, and recovery credentials. It calls `delete_current_account_v3()` as one device and asserts that the account data, both auth sessions, and both auth users are gone before rolling back. A second fixture calls the RPC without an account mapping and expects `account_required`.

The browser/unit test asserts `Abbrechen` makes no service call and `Ja` calls account deletion exactly once. A failed RPC keeps local authentication and displays a retryable error.

- [ ] **Step 2: Run tests and confirm missing behavior**

Expected: SQL fails because `delete_current_account_v3` is absent; UI test fails because the settings action is absent.

- [ ] **Step 3: Implement the current-account-only RPC**

Create a `security definer` function with `set search_path = ''`. Capture `auth.uid()`, resolve `private.current_account_id()`, collect every `account_devices.auth_user_id` for that account, and reject a missing mapping. Delete the account row so owned lists, items, memberships, recovery credentials, and devices cascade. Then delete `auth.sessions` and `auth.users` only for the captured IDs. Return `{ok: true, deletedAccountId}`. Revoke execution from `public` and `anon`; grant only to `authenticated`.

- [ ] **Step 4: Add the settings action and confirmation**

Add a destructive `Account löschen` button at the bottom of `Mehr` -> `Account`. On click use a `Ja`/`Abbrechen` confirmation. `Abbrechen` closes without changes. On `Ja`, call the RPC; only after success clear this account's local caches, queues, and auth session, then return to clean device setup. On failure leave all local state intact and show a retryable error.

- [ ] **Step 5: Run advisors, SQL rollback tests, unit tests, and syntax checks**

Expected: a user can delete only the account linked to their own auth device; no administrative credential is exposed; all tests pass.

- [ ] **Step 6: Commit**

```bash
git add supabase/account_deletion_v3.sql tests/sql/account_deletion_v3.test.sql app.js tests/account-logic.test.js
git commit -m "feat: add confirmed account deletion"
```

---

## Phase 2: Item-Level Synchronization and Deletion

### Task 5: Define the Client Mutation Queue

**Files:**
- Create: `sync-logic.js`
- Create: `tests/sync-logic.test.js`
- Modify: `index.html:120-126`
- Modify: `sw.js:1-14`
- Modify: `tests/startup-wiring.test.js`

**Interfaces:**
- Consumes: mutation type, list ID, optional item ID, absolute payload, operation UUID, and timestamp.
- Produces: `MartSyncLogic.createMutation(input)`, `MartSyncLogic.compactQueue(queue, mutation)`, and `MartSyncLogic.shouldRetry(errorCode)`.

- [ ] **Step 1: Write failing queue tests**

```js
test("replayed operations retain one stable operation ID", () => {
  const mutation = SyncLogic.createMutation({ operationId: OP_ID, type: "upsert_item", listId: "list-1", itemId: "milk", payload: { quantity: 2 } });
  assert.equal(mutation.operationId, OP_ID);
  assert.deepEqual(SyncLogic.compactQueue([mutation], mutation), [mutation]);
});

test("later absolute item state replaces older queued state for the same item", () => {
  const queue = SyncLogic.compactQueue([oldMutation], newMutation);
  assert.deepEqual(queue, [newMutation]);
});

test("authorization and deletion conflicts stop replay", () => {
  assert.equal(SyncLogic.shouldRetry("membership_removed"), false);
  assert.equal(SyncLogic.shouldRetry("network_error"), true);
});
```

- [ ] **Step 2: Run tests and confirm missing-module failure**

Run `node --test tests/sync-logic.test.js`; expected FAIL because `sync-logic.js` does not exist.

- [ ] **Step 3: Implement pure queue behavior**

`createMutation` validates UUID operation IDs, supported types (`create_list`, `rename_list`, `upsert_item`, `delete_item`, `delete_list`, `leave_list`), non-empty list IDs, and JSON-safe payloads. `compactQueue` deduplicates by operation ID and replaces an older queued `upsert_item` for the same account/list/item only when neither mutation has been attempted. `shouldRetry` returns false for `membership_removed`, `list_deleted`, `forbidden`, and `invalid_mutation`; it returns true for network and transient server failures.

- [ ] **Step 4: Wire runtime and release assets**

Load `sync-logic.js` after `account-logic.js` and before `app.js`, add it to `sw.js`, and keep every local asset and cache version at `v61` until the final release bump.

- [ ] **Step 5: Run tests and commit**

```bash
node --test tests/sync-logic.test.js tests/startup-wiring.test.js
git add sync-logic.js index.html sw.js tests/sync-logic.test.js tests/startup-wiring.test.js
git commit -m "test: define idempotent sync queue"
```

### Task 6: Add Idempotent Server Mutations

**Files:**
- Create: `supabase/list_mutations_v3.sql`
- Create: `tests/sql/list_mutations_v3.test.sql`

**Interfaces:**
- Consumes: `operation_id uuid`, `target_list_id text`, `mutation_type text`, and `payload jsonb`.
- Produces: `public.apply_list_mutation_v3(uuid,text,text,jsonb)` with stable JSON results and a private `list_mutation_receipts` idempotency table.

- [ ] **Step 1: Write a rollback-only integration test**

The test creates two authenticated fixtures, one account and list, then asserts:

1. two different item mutations both survive;
2. replaying one operation ID returns the same result without increasing revision;
3. a same-item later mutation wins;
4. deleting an item creates a tombstone;
5. a stale replay cannot clear the tombstone;
6. a removed member receives `membership_removed`.

Every assertion uses `raise exception` and the file ends with `rollback;`.

- [ ] **Step 2: Run the test and confirm the missing-RPC failure**

Run `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f tests/sql/list_mutations_v3.test.sql`; expected FAIL for missing `apply_list_mutation_v3`.

- [ ] **Step 3: Add receipt storage with no Data API access**

```sql
create table if not exists public.list_mutation_receipts (
  operation_id uuid primary key,
  account_id uuid not null references public.accounts(id) on delete cascade,
  list_id text not null,
  mutation_type text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.list_mutation_receipts enable row level security;
revoke all on public.list_mutation_receipts from public, anon, authenticated;
create index if not exists list_mutation_receipts_created_idx on public.list_mutation_receipts(created_at);
```

- [ ] **Step 4: Implement one atomic mutation RPC**

The function must acquire `pg_advisory_xact_lock(hashtextextended(operation_id::text, 0))`, resolve `private.current_account_id()`, return an existing receipt before changing data, and handle all six mutation types. It uses absolute item state, never increments quantity from a queued delta. For item upsert, conflict update must include:

```sql
quantity = excluded.quantity,
done = excluded.done,
note = excluded.note,
checked_by_user_id = excluded.checked_by_user_id,
checked_at = excluded.checked_at,
updated_by_user_id = request_account_id,
updated_at = now(),
deleted_at = null,
deleted_by_user_id = null,
revision = public.list_items.revision + 1
```

For `delete_item`, update `deleted_at`, `deleted_by_user_id`, `updated_at`, and revision without deleting the row. For `delete_list`, require ownership and set the list tombstone. For `leave_list`, require non-ownership and set membership removal fields. Every accepted mutation atomically increments `shopping_lists.revision`, inserts one receipt, and returns `{ok, operationId, listId, listRevision}`.

Revoke the function from `public` and `anon`; grant execution only to `authenticated`. Keep the receipt table inaccessible directly.

- [ ] **Step 5: Run advisors and transactional SQL tests**

Expected: no exposed receipt table, no unauthenticated function access, all SQL assertions pass, and fixture data is absent after rollback.

- [ ] **Step 6: Commit**

```bash
git add supabase/list_mutations_v3.sql tests/sql/list_mutations_v3.test.sql
git commit -m "feat: apply list changes as idempotent mutations"
```

### Task 7: Replace Snapshot Publishing in the Browser

**Files:**
- Modify: `app.js:1700-1815`
- Modify: `app.js:2888-3020`
- Modify: `app.js:3611-3705`
- Modify: `app.js:4830-5025`
- Modify: `app.js:5240-5405`
- Modify: `tests/sync-logic.test.js`

**Interfaces:**
- Consumes: `MartSyncLogic` mutations and `public.apply_list_mutation_v3`.
- Produces: `collaborationService.applyMutation(mutation)`, `queueMutation(mutation)`, `flushMutationQueue()`, and `commitMutation(mutation)`.

- [ ] **Step 1: Add failing service and replay tests**

Use a fake Supabase client to assert one item edit calls only `apply_list_mutation_v3`, never `publishRelationalLists`, and a missed realtime event is corrected by the post-write pull. Assert queue replay stops and refreshes when the service returns `list_deleted`.

- [ ] **Step 2: Run tests and confirm they fail against snapshot publishing**

Expected: tests show `save()` calls the full-list publisher or the new service method is missing.

- [ ] **Step 3: Implement `applyMutation` and mutation queue storage**

Call:

```js
this.client.rpc("apply_list_mutation_v3", {
  operation_id: mutation.operationId,
  target_list_id: mutation.listId,
  mutation_type: mutation.type,
  payload: mutation.payload
});
```

Store queue entries only under `shopping-list-app.sync-mutations:<accountId>`. Remove snapshot queue reads/writes. `save()` continues to cache rendered lists locally but never starts a full-list publication.

- [ ] **Step 4: Emit one mutation from every list action**

Update `addList`, `renameList`, `addToList`, quantity changes, `toggleDone`, note save/clear, item removal, owner list deletion, and member leave. Each action creates one stable operation UUID before optimistic local rendering and sends absolute post-action state.

- [ ] **Step 5: Make replay sequential and account-bound**

Replay one operation at a time. On success remove only that operation. On retryable failure keep it with incremented attempts and backoff. On authorization/deletion conflict stop, discard operations for the inaccessible list, pull server state, and render the authoritative result. Never replay a queue whose key does not match `currentUser.userId`.

- [ ] **Step 6: Keep realtime as invalidation plus fallback pulls**

Retain Postgres Changes for the three public tables. Pull after every successful write, when returning online, on focus/visibility, and every 30 seconds while visible. Do not show `online` or `waiting` labels.

- [ ] **Step 7: Delete obsolete snapshot paths**

Remove `persistOwnedListRow`, `publishRelationalLists`, `publishListSnapshot`, and snapshot-shaped queue processing after all actions use mutations. Keep read conversion functions and invite/join RPC behavior.

- [ ] **Step 8: Run unit tests, syntax checks, and a two-context manual test**

Expected: different-item simultaneous edits converge; same-item last accepted state wins; no `shopping_lists_pkey` duplicate error appears in Supabase logs.

- [ ] **Step 9: Commit**

```bash
git add app.js tests/sync-logic.test.js
git commit -m "fix: sync lists with item-level mutations"
```

### Task 8: Finalize Deletion and Empty-State Behavior

**Files:**
- Modify: `app.js:5240-5305`
- Modify: `app.js:5590-5735`
- Modify: `styles.css`
- Modify: `tests/sync-logic.test.js`
- Create: `tests/browser/collaboration.spec.js`
- Create: `tests/browser/test-server.mjs`

**Interfaces:**
- Consumes: authoritative tombstones and current user's owner/member role.
- Produces: owner-confirmed deletion, invited-member leave, tombstone-first merge, and centered zero-list action.

- [ ] **Step 1: Write failing deletion and empty-state tests**

Cover owner confirmation, member leave without owner deletion, server tombstone outranking cached data, and zero lists rendering exactly one `Neuer Zettel` action centered in the notes area.

`test-server.mjs` must keep accounts, devices, lists, items, tombstones, and pairing requests in one Node process shared by both isolated WebKit contexts. It serves the repository files and a test-only collaboration adapter at `/__test__/collaboration.js`; the browser test intercepts the Supabase CDN script and fulfills it with that adapter. The adapter exposes the same auth, RPC, table-read, and realtime methods used by `app.js`, so the test exercises the production orchestration without touching the live Supabase project.

- [ ] **Step 2: Run tests and capture failures**

Expected: at least the tombstone replay and browser empty-state checks fail before implementation.

- [ ] **Step 3: Implement role-specific deletion**

Owners confirm and send `delete_list`; members send `leave_list` without the owner warning. Remove local state only after the server accepts or after an offline mutation is durably queued. A server tombstone always removes the local list and queued mutations for it.

- [ ] **Step 4: Enforce zero-list UI**

Do not call `createList()` from startup or remote merge. When `lists.length === 0`, render only the existing large add button inside `.empty-notes-state` and use `.notes-board.is-empty` to center it vertically and horizontally.

- [ ] **Step 5: Run unit and WebKit tests at iPhone 16 Pro dimensions**

Use viewport `402x874`. Expected: no phantom list appears after reload, delete/leave copy is correct, and the empty action is visible without overlap.

- [ ] **Step 6: Commit**

```bash
git add app.js styles.css tests/sync-logic.test.js tests/browser/collaboration.spec.js
git commit -m "fix: keep deleted lists deleted"
```

---

## Phase 3: Verification, Deployment, and Protected Reset

### Task 9: Create One Release Verification Command

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `scripts/verify-release.mjs`
- Create: `scripts/smoke-production.mjs`
- Modify: `.gitignore`
- Modify: `tests/startup-wiring.test.js`

**Interfaces:**
- Consumes: repository files and optional `SUPABASE_DB_URL`.
- Produces: `pnpm verify`, `pnpm test:sql`, `pnpm test:browser`, and `pnpm smoke:production`.

- [ ] **Step 1: Add pinned tooling and scripts**

```json
{
  "name": "mart-zettel",
  "private": true,
  "packageManager": "pnpm@11.7.0",
  "scripts": {
    "test:unit": "node --test tests/*.test.js",
    "test:sql": "test -n \"$SUPABASE_DB_URL\" || { echo 'SUPABASE_DB_URL fehlt'; exit 1; }; for f in tests/sql/*.test.sql; do psql \"$SUPABASE_DB_URL\" -v ON_ERROR_STOP=1 -f \"$f\"; done",
    "test:browser": "playwright test",
    "verify": "node scripts/verify-release.mjs",
    "smoke:production": "node scripts/smoke-production.mjs"
  },
  "devDependencies": {
    "@playwright/test": "1.61.1"
  }
}
```

Generate and commit the lockfile with the bundled `pnpm` executable.

- [ ] **Step 2: Implement release-file consistency checks**

`verify-release.mjs` runs unit tests, syntax checks for every runtime JavaScript file, `git diff --check`, and Playwright. Before running subprocesses it reads `index.html` and `sw.js` and fails unless all local runtime query strings and `CACHE_NAME` share one release number and every local runtime asset appears in `ASSETS`.

- [ ] **Step 3: Implement production smoke check**

Open `https://kenni1116-a11y.github.io/mart-/` in WebKit while routing `**/auth/v1/**` and `**/rest/v1/**` to an intentional offline response. Assert the app reaches its retryable account-server error state without an uncaught page error or console error and verify the page title is `Zettel`. This exercises production assets without creating a new anonymous production account.

- [ ] **Step 4: Exclude private artifacts**

Add `backups/`, `test-results/`, `playwright-report/`, and `.env*` to `.gitignore`, while allowing `.env.example` if later needed.

- [ ] **Step 5: Run the complete command**

Run `pnpm install --frozen-lockfile`, `pnpm exec playwright install webkit`, then `pnpm verify`. Expected: all mandatory local checks pass. Run SQL tests separately only with the protected database connection secret.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml scripts .gitignore tests/startup-wiring.test.js
git commit -m "ci: add release verification gate"
```

### Task 10: Gate GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/verify-and-deploy.yml`

**Interfaces:**
- Consumes: pushes to `main`, pinned lockfile, and repository secret `SUPABASE_DB_URL`.
- Produces: a verified GitHub Pages deployment and production smoke result.

- [ ] **Step 1: Add the verification job**

Use `actions/checkout@v4`, `pnpm/action-setup@v4` with pnpm 11.7.0, and `actions/setup-node@v4` with Node 22 and pnpm cache. Install dependencies with `--frozen-lockfile`, install WebKit, run `pnpm test:unit`, syntax/version checks through `pnpm verify`, and SQL transaction tests with `SUPABASE_DB_URL` from GitHub Secrets.

- [ ] **Step 2: Add the Pages deployment job**

The deploy job needs `verification`, uses `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` with path `.`, and `actions/deploy-pages@v4`. Grant only `contents: read`, `pages: write`, and `id-token: write`; use environment `github-pages`.

- [ ] **Step 3: Add the post-deploy smoke job**

Run `pnpm smoke:production` against the URL returned by `deploy-pages`. After success, retain the run's `github-pages` artifact as the last good release. On failure, a rollback job uses `gh run list --workflow verify-and-deploy.yml --status success --limit 1` to locate the previous successful run, downloads its `github-pages` artifact with `gh run download`, uploads that artifact in the current run, and invokes `actions/deploy-pages@v4` again. Grant the rollback job `actions: read` and `pages: write`; do not mark the failed release as last good.

- [ ] **Step 4: Configure GitHub Pages once**

Change the repository Pages source from branch publication to GitHub Actions. Add the protected `SUPABASE_DB_URL` repository secret. Do not place its value in workflow YAML, logs, issues, or commits.

- [ ] **Step 5: Verify workflow syntax and run on the feature branch**

Push the branch, inspect Actions, and require all verification jobs to pass before merging. Confirm a deliberately failing startup-version test prevents the deployment job, then restore the test and rerun successfully.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/verify-and-deploy.yml
git commit -m "ci: deploy only verified releases"
```

### Task 11: Back Up and Reset All Accounts Except Maike

**Files:**
- Create: `supabase/admin/reset_except_maike.sql`
- Modify: `supabase-config.js`
- Modify: `index.html`
- Modify: `sw.js`
- Create locally, never commit: `backups/collaboration-<UTC timestamp>.json`

**Interfaces:**
- Consumes: protected account ID, resolved protected auth user ID, current database inventory, and explicit operator confirmation.
- Produces: one preserved Maike account, no other pre-reset accounts, a new client data epoch, and a fresh primary account ready for iPhone pairing.

- [ ] **Step 1: Re-read and verify the protected identity**

Run a read-only query that returns account, device, owned active list, active membership, and item counts for `91c32055-3dce-4fcb-86d8-a22a624f921a`. Abort unless username is `user-6074F68`, display name is `Maike`, account count is 1, and device count is 1.

- [ ] **Step 2: Export all collaboration data locally**

Query `accounts`, `account_devices`, `account_recovery_credentials` metadata without hashes, `device_pairings`, `shopping_lists`, `list_members`, `list_items`, and the IDs/status fields needed from `auth.users`. Save the exact JSON response to a timestamped file under `backups/`. Verify the file is non-empty and parseable. Never commit it.

- [ ] **Step 3: Write the guarded reset transaction**

The SQL file begins with `begin;`, stores the protected account and auth user IDs in a temporary table, and uses `do $$ ... $$` assertions before and after deletion. Delete non-protected records in dependency order, delete non-protected `auth.sessions`, then delete non-protected anonymous `auth.users`. The final assertions verify Maike's exact pre-reset counts and zero non-protected accounts. End the reviewed file with `commit;`; during rehearsal replace it with `rollback;`.

The protection predicate must always be explicit:

```sql
where account_id <> '91c32055-3dce-4fcb-86d8-a22a624f921a'::uuid
```

and auth deletion must exclude the auth user selected from Maike's protected `account_devices` row.

- [ ] **Step 4: Rehearse with rollback**

Run the transaction with `rollback`, repeat the protected counts, and inspect database logs. Expected: no protected-count change, no foreign-key failure, and the production database remains unchanged.

- [ ] **Step 5: Deploy database and client fixes before cleanup**

Apply `device_pairing_v3.sql` and `list_mutations_v3.sql`, run advisors and SQL tests, publish the verified client, and confirm Maike can still open her list. Stop if any step fails.

- [ ] **Step 6: Execute the confirmed reset once**

Run the reviewed committed transaction through the administrative Supabase connection. Immediately query post-reset counts and compare Maike's protected account, device, list, membership, and item counts to the backup inventory.

- [ ] **Step 7: Bump data epoch and release version**

Set `dataEpoch` to `device-accounts-v3-reset-2026-07-13`. Bump all local runtime query strings and `CACHE_NAME` together from `v61` to `v62`. The deferred cleanup preserves Maike's verified valid session and removes only foreign/invalid account caches.

- [ ] **Step 8: Create and protect the new primary account**

Reload on the Mac, verify no list is auto-created, create the intended primary account through normal startup, and rotate/store its recovery code privately. Confirm the database now contains Maike plus exactly one new primary account.

- [ ] **Step 9: Pair the iPhone before creating or joining lists**

Create a five-minute device QR on the Mac, scan it with the iPhone, compare the four-digit code, approve on the Mac, and verify both devices show the same account ID and device list. Confirm no additional permanent account was created.

- [ ] **Step 10: Perform the two-device acceptance test**

Create one list, add different items concurrently, edit the same item's note in sequence, check an item, delete an item, delete or leave a test shared list, background and reopen both devices, and verify convergence. Inspect Supabase logs for refresh-token, duplicate-key, authorization, and realtime errors.

- [ ] **Step 11: Commit the operational files and release bump**

```bash
git add supabase/admin/reset_except_maike.sql supabase-config.js index.html sw.js
git commit -m "ops: complete protected account reset"
```

### Task 12: Final Verification and Production Handoff

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the completed v3 behavior and verification commands.
- Produces: concise recovery, device pairing, test, and deployment instructions.

- [ ] **Step 1: Update operator documentation**

Document `pnpm verify`, the optional SQL test command, the difference between list invitations and device pairing, recovery-code handling, and the rule that `device_accounts_v2.sql` is historical bootstrap material rather than a reset script.

- [ ] **Step 2: Run all checks from a clean checkout**

Run unit tests, SQL rollback tests, JavaScript syntax checks, Playwright WebKit tests, `git diff --check`, local startup smoke, and production smoke. Expected: all pass.

- [ ] **Step 3: Audit final database state**

Confirm exactly two intended accounts after the new primary account is created: Maike and the new primary account. Confirm device counts, no active stale pairings, no orphan list/member/item rows, and no repeated duplicate-key errors.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md
git commit -m "docs: document reliable account operations"
```

- [ ] **Step 5: Request final code review, merge, and monitor**

Use `superpowers:requesting-code-review`, address findings, merge only when required checks pass, then monitor production logs during the first real Mac/iPhone collaboration session.

## Supabase References Checked for This Plan

- Anonymous users are real authenticated users, cannot recover access after local data is cleared unless the app provides its own account-linking mechanism, and are not cleaned up automatically: <https://supabase.com/docs/guides/auth/auth-anonymous>
- Refresh tokens are single-use with bounded reuse exceptions; an invalid refresh token can terminate the session and must not cause cached data to be assigned to a new identity: <https://supabase.com/docs/guides/auth/sessions>
- Postgres Changes honors readable rows under RLS and is suitable as an invalidation signal, while the client still needs explicit refresh paths for correctness: <https://supabase.com/docs/guides/realtime/postgres-changes>
- The July 2026 changelog contains no hosted Auth or Postgres Changes breaking change that alters the planned APIs; Node.js 20 support has ended for current Supabase tooling: <https://supabase.com/changelog>
