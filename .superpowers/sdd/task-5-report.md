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
