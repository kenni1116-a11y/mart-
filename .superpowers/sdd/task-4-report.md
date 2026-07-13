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

## Implementation

- `Mehr -> Account` ends with a destructive `Account löschen` action.
- The app-owned confirmation uses exactly `Ja` and `Abbrechen`; errors render a
  visible status with `Erneut versuchen` and `Abbrechen`.
- `MartAccountLogic.createAccountDeletionFlow` serializes confirmation so a
  duplicate click cannot issue a second service call.
- `SupabaseRealtimeService.deleteCurrentAccount()` invokes the sole
  `delete_current_account_v3` RPC call site.
- Local activity, account-scoped caches and queues, pending device pairing, and
  the local Supabase session are cleared only after `{ ok: true }`; the app then
  returns to device setup.
- Pairing code does not call the deletion RPC or deletion handler.

## SQL Safety

- `public.delete_current_account_v3()` is `SECURITY DEFINER` with
  `search_path = ''`, uses `auth.uid()` and `private.current_account_id()`, and
  raises `account_required` when no valid mapping exists.
- It records every account device `auth_user_id`, deletes the account, and
  deletes `auth.sessions` and `auth.users` only for that recorded set.
- Execution is revoked from `public` and `anon`, then granted to
  `authenticated`.
- The SQL test is one `begin; ... rollback;` fixture transaction. It uses its
  own `d4e10000-...` UUID namespace, creates two devices plus owned list/item,
  membership, recovery credential, and pairing fixture data, and checks
  complete deletion, foreign-data preservation, `account_required`, security,
  and grants.
- No live DDL or database test was run: this worktree has no explicitly safe
  database connection configuration.

## Verification

- Node test suite: 26 passed, 0 failed.
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
