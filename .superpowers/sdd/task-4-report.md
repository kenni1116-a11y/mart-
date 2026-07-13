# Task 4 Report: Confirmed Account Deletion

## Scope

- `supabase/account_deletion_v3.sql`
- `tests/sql/account_deletion_v3.test.sql`
- `app.js`
- `account-logic.js`
- `tests/account-logic.test.js`
- `tests/startup-wiring.test.js`
- `styles.css`

## TDD Evidence

Task-4 source and test changes were already present and uncommitted when this
worktree was received. They were kept intact as required. To obtain a real RED
without reverting or editing those concurrent changes, the deletion-flow
contract was evaluated against `HEAD:account-logic.js` in an isolated Node VM.

Expected RED command:

```text
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e '<load HEAD:account-logic.js and assert createAccountDeletionFlow is exported>'
```

Observed RED:

```text
AssertionError [ERR_ASSERTION]: account deletion flow must be exported
actual: 'undefined'
expected: 'function'
```

The focused deletion-flow tests then passed in the working tree. They cover
cancel with zero service or cleanup calls, one in-flight delete despite a
duplicate confirmation, cleanup only after a successful response, and retry
after a failed response.

## Review Fixes

The Task-4 review added two JavaScript regressions before the production code
changed. The focused Node run first failed because the flow discarded the
successful deletion result when cleanup threw, and because the deletion UI did
not capture `currentUser.userId` or pass it to the RPC. After the fixes, the
focused run passed 27 tests.

- Opening the confirmation now captures `currentUser.userId` in
  `accountDeletionExpectedAccountId`; retries retain that immutable expected
  account ID, and `SupabaseRealtimeService.deleteCurrentAccount` sends it as
  `expected_account_id`.
- `createAccountDeletionFlow` stores the successful server response as
  committed. A cleanup failure returns `committed: true` and
  `deletionCommitted: true`; a retry runs only `completeDeletion`, never the
  deletion RPC again. A post-commit cancel cannot return to the deleted
  profile. `signOut()` returning `{ ok: false }` now produces a cleanup error
  rather than being treated as success.
- `public.delete_current_account_v3(expected_account_id uuid)` explicitly
  drops the old zero-argument signature. It validates `auth.uid()`, takes the
  same request-user advisory transaction lock as pairing approval, then reads
  the current mapping and rejects a changed or missing account before locking
  and deleting the account row.
- The SQL fixture changes the requester mapping from account A to account B
  before deleting with expected A, asserts `account_changed`, and proves that
  account B, its device, list, session, and auth user remain. It also checks
  the UUID signature, `proconfig @> array['search_path=""']`, the removed
  zero-argument endpoint, and authenticated-only execute access.

## Implementation

- `Mehr -> Account` ends with a destructive `Account löschen` action.
- The app-owned confirmation uses exactly `Ja` and `Abbrechen`; errors render a
  visible status with `Erneut versuchen` and `Abbrechen`.
- `MartAccountLogic.createAccountDeletionFlow` serializes confirmation so a
  duplicate click cannot issue a second service call.
- `SupabaseRealtimeService.deleteCurrentAccount(expectedAccountId)` invokes
  the sole `delete_current_account_v3(expected_account_id)` RPC call site.
- Local activity, account-scoped caches and queues, pending device pairing, and
  the local Supabase session are cleared only after `{ ok: true }`; the app then
  returns to device setup.
- Pairing code does not call the deletion RPC or deletion handler.

## SQL Safety

- `public.delete_current_account_v3(expected_account_id uuid)` is
  `SECURITY DEFINER` with `search_path = ''`. It uses `auth.uid()`, serializes
  against pairing approval with the request-user advisory lock, then checks
  `private.current_account_id()` against the expected account ID before the
  account-row lock. Missing mappings raise `account_required`; changed
  mappings raise `account_changed`.
- It records every account device `auth_user_id`, deletes the account, and
  deletes `auth.sessions` and `auth.users` only for that recorded set.
- The old zero-argument function is explicitly dropped. Execution on the UUID
  signature is revoked from `public`, `anon`, and `authenticated`, then granted
  only to `authenticated`.
- The SQL test is one `begin; ... rollback;` fixture transaction. It uses its
  own `d4e10000-...` UUID namespace, creates two devices plus owned list/item,
  membership, recovery credential, and pairing fixture data, and checks
  complete deletion, foreign-data preservation, `account_required`, security,
  and grants.
- No live DDL or database test was run: this worktree has no explicitly safe
  database connection configuration.

## Verification

- Focused TDD run: 27 passed, 0 failed after observing the two intended RED
  failures.
- Node test suite: 27 passed, 0 failed.
- JavaScript syntax checks: `app.js`, `account-logic.js`, `sw.js`, and
  `supabase-config.js`.
- Static SQL inspection verifies the required authorization, deletion order,
  and grants. The SQL fixture and deletion sources do not contain Maike's
  account ID.
- `git diff --check` passes.

## Residual Risk

The database transaction test was intentionally not executed because no safe
database URL was available. It should run in an isolated Supabase test project
after applying the migration there, never against production data.
