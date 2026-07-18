-- Run after supabase/device_accounts_v2.sql. This file intentionally does not
-- apply itself: the dashboard migration step remains a deliberate release action.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 204800, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars account select" on storage.objects;
drop policy if exists "avatars account insert" on storage.objects;
drop policy if exists "avatars account update" on storage.objects;
drop policy if exists "avatars account delete" on storage.objects;

-- private.current_account_id() is the existing security-definer lookup of the
-- durable account mapping in public.account_devices for auth.uid(). Keeping that
-- lookup private avoids granting authenticated users access to account_devices.
create policy "avatars account select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select private.current_account_id()::text)
  and storage.filename(name) ~ '^avatar-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[ab][.]webp$'
);

create policy "avatars account insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select private.current_account_id()::text)
  and storage.filename(name) in (
    'avatar-' || (select auth.uid())::text || '-a.webp',
    'avatar-' || (select auth.uid())::text || '-b.webp'
  )
);

create policy "avatars account update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select private.current_account_id()::text)
  and storage.filename(name) in (
    'avatar-' || (select auth.uid())::text || '-a.webp',
    'avatar-' || (select auth.uid())::text || '-b.webp'
  )
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select private.current_account_id()::text)
  and storage.filename(name) in (
    'avatar-' || (select auth.uid())::text || '-a.webp',
    'avatar-' || (select auth.uid())::text || '-b.webp'
  )
);

create policy "avatars account delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select private.current_account_id()::text)
  and storage.filename(name) ~ '^avatar-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[ab][.]webp$'
);
