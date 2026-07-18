# Task 5: Account-Scoped Avatar Storage

## RED

- Added startup wiring tests for the avatar bucket, stable policy names, account-scoped paths, upsert support, and cache-busted public URLs.
- Added browser coverage for photo upload, profile reopen, photo removal, upload failure, and initials removal without storage deletion.
- Confirmed the initial failures: the migration file and the Supabase storage methods did not exist, and photo selection stayed in the unavailable state.

## GREEN

- Added `supabase/avatar_storage_v1.sql` as an idempotent, unapplied migration file.
- Added authenticated `uploadAvatar(blob, accountId)` and `removeAvatar(accountId)` methods with durable-account validation, a stable object path, public URL cache busting, and missing-object removal tolerance.
- Added the browser-test storage facade and byte-serving route. The route returns the stored MIME type, including a WebKit PNG fallback when WebP encoding is unavailable.
- Connected avatar-photo removal to storage deletion only for stored photos. Initials tokens clear the profile without a storage request.
- Bumped the release cache to `0.7.3` / build `73` so installed clients receive the changed application code.

## Security Review

- The `avatars` bucket is public for object retrieval only; no public write or list policy is created.
- SELECT, INSERT, UPDATE, and DELETE policies are restricted to `authenticated` users and the first object path folder must equal the caller's durable account ID.
- The existing `private.current_account_id()` lookup resolves the `auth.uid()` mapping through `public.account_devices` without granting clients direct access to that private account-device table.
- UPDATE carries both `USING` and `WITH CHECK`; upsert therefore has the required INSERT, SELECT, and UPDATE coverage.
- The browser client uses the existing publishable-key client only. No service-role key or privileged credential was added.

## Verification

- Focused avatar browser checks: passed.
- Full unit suite: 80 passed.
- Full WebKit suite: 32 passed.
- `pnpm verify`: passed.
- Syntax checks for browser and service files: passed.
- `git diff --check`: passed.

## Deferred

- `supabase/avatar_storage_v1.sql` was deliberately not applied to the live Supabase project. It awaits the parent review and dashboard migration step.

## Compensation Follow-up

### RED

- Added browser regressions for replacement ordering, staged-upload cleanup after profile failure, profile-clear failure, storage-removal rollback, and the deterministic result when both removal and rollback fail.
- Tightened startup wiring coverage to require two bounded avatar slots and an object-removal method that accepts an explicitly validated path.
- The initial replacement regression proved that the former single-path upsert could overwrite the object still referenced by the durable profile before the profile write had succeeded.

### GREEN

- Replaced the single object path with two bounded account-scoped slots: `avatar-a.webp` and `avatar-b.webp`.
- Replacements now upload to the non-current slot, update the durable profile, commit the local UI only after confirmed profile success, and then remove the old slot on a best-effort basis.
- A failed profile update removes the staged slot and leaves the previous server profile, object, and local avatar untouched.
- Photo removal now clears the durable profile before deleting the referenced object. A storage failure restores the previous profile URL; if that rollback also fails, the local avatar follows the last confirmed server state and an inline partial-failure message remains visible.
- Initials tokens continue to avoid all storage calls.
- The test storage facade now serves both slots and exposes deterministic profile-update and storage-removal failures with ordered operation events.
- Bumped the release cache to `0.7.4` / build `74` so installed clients receive the compensated implementation.

### Security Review

- Every storage path is validated against the active durable account and exactly one of the two permitted filenames. Arbitrary object paths are rejected before authentication or storage mutation.
- The existing SQL remains folder-scoped through `public.account_devices`; no public write/list access, service-role credential, or broader policy was added.
- The migration remains unapplied pending independent review.

### Verification

- Focused startup/storage wiring: 14 passed.
- Focused avatar browser regressions: 8 passed.
- Full unit suite: 80 passed.
- Full WebKit suite: 37 passed.
- `pnpm verify`: passed, including syntax, release-cache wiring, and `git diff --check`.

## Per-Device Slot Hardening

### RED

- Tightened the test storage facade before changing production code so the previous account-global A/B paths were rejected.
- Added one concurrent browser regression with two distinct authenticated device identities mapped to the same durable account.
- Added network-rejection regressions for object removal and profile rollback, in addition to the existing `{ ok: false }` cases.
- Confirmed RED through two startup-policy failures and browser upload failures caused by the rejected legacy slot names.

### GREEN

- Avatar objects now use two bounded slots per authenticated device: `<accountId>/avatar-<authUserId>-a.webp` and `-b.webp`.
- The Supabase service obtains the authenticated user ID from its current session and never accepts it from the caller. A device alternates only its own slots; an avatar owned by another device selects the current device's default A slot.
- Simultaneous device uploads therefore stage distinct objects. The durable profile still follows last confirmed write wins, without either device overwriting the object currently referenced before its own profile update succeeds.
- Object-removal and profile-rollback Promise rejections are handled independently. Account/session identity is rechecked before rollback and before every local avatar mutation.
- The test server enforces current-device filenames for upload while allowing account devices to remove any strictly valid per-device slot in their durable account.
- Bumped the release cache to `0.7.5` / build `75`.

### Security Review

- INSERT and UPDATE policies require both the caller's durable account folder and one of the two filenames derived from `auth.uid()`.
- SELECT and DELETE require the caller's durable account folder plus a strict UUID-shaped per-device avatar filename. DELETE can clean an old device slot but cannot target arbitrary account objects.
- Client and test-server validators mirror the same account folder, UUID, and bounded-slot constraints.
- Current Supabase Storage guidance was rechecked: upsert still requires SELECT, INSERT, and UPDATE policies; no relevant Storage/RLS breaking change was identified.
- No service-role credential or public write/list access was introduced. The migration remains unapplied.

### Verification

- Focused startup/storage wiring: 14 passed.
- Focused avatar and compensation browser regressions: 11 passed.
- Full unit suite: 80 passed.
- Full WebKit suite: 40 passed.
- `pnpm verify`: passed, including syntax checks, release-cache wiring, and `git diff --check`.

## Ambiguous Network Reconciliation

### RED

- Added test-server hooks that commit an avatar object deletion or rollback profile update and then terminate the HTTP response before the client can observe the result.
- Added browser regressions for committed deletion with a lost response, committed rollback with a lost response, and a failed confirmation fetch.
- Confirmed the former client incorrectly inferred failure: it could restore a deleted avatar URL or keep a locally cleared avatar after the rollback had actually committed.

### GREEN

- Reused the existing read-only `get_current_account` RPC through `fetchCurrentAccount()`; no SQL or migration change was required.
- Any rejected profile-clear, storage-removal, or rollback Promise now triggers a confirmed durable-account re-fetch instead of inferring an outcome.
- After account and auth-session identity checks, the confirmed `avatarUrl` is propagated to `currentUser`, local members and items, saved account state, and the visible profile avatar.
- If confirmation also fails, local state is left untouched, the profile editor remains retryable after the existing write lock is released, and the inline message explicitly states that the outcome is still uncertain.
- Bumped the release cache to `0.7.6` / build `76`.

### Verification

- Focused startup/service wiring: 14 passed.
- Focused avatar and reconciliation browser regressions: 12 passed.
- Full unit suite: 80 passed.
- Full WebKit suite: 41 passed.
- `pnpm verify`: passed, including syntax checks, release-cache wiring, and `git diff --check`.
