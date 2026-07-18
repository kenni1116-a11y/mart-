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
