-- Apply after device_accounts_v2.sql and avatar_storage_v1.sql.

create or replace function private.is_account_avatar_path(
  object_name text,
  account_id uuid,
  device_auth_user_id uuid default null
)
returns boolean
language sql
immutable
security invoker
set search_path = ''
as $$
  select case
    when object_name is null or account_id is null then false
    when device_auth_user_id is not null then object_name in (
      account_id::text || '/avatar-' || device_auth_user_id::text || '-a.webp',
      account_id::text || '/avatar-' || device_auth_user_id::text || '-b.webp'
    )
    else object_name ~ (
      '^' || account_id::text
      || '/avatar-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[ab][.]webp$'
    )
  end
$$;

revoke all on function private.is_account_avatar_path(text, uuid, uuid) from public, anon;
grant execute on function private.is_account_avatar_path(text, uuid, uuid) to authenticated;

drop policy if exists "avatars account select" on storage.objects;
drop policy if exists "avatars account insert" on storage.objects;
drop policy if exists "avatars account update" on storage.objects;
drop policy if exists "avatars account delete" on storage.objects;

create policy "avatars account select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and private.is_account_avatar_path(
    name,
    (select private.current_account_id()),
    null
  )
);

create policy "avatars account insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and private.is_account_avatar_path(
    name,
    (select private.current_account_id()),
    (select auth.uid())
  )
);

create policy "avatars account update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and private.is_account_avatar_path(
    name,
    (select private.current_account_id()),
    (select auth.uid())
  )
)
with check (
  bucket_id = 'avatars'
  and private.is_account_avatar_path(
    name,
    (select private.current_account_id()),
    (select auth.uid())
  )
);

create policy "avatars account delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and private.is_account_avatar_path(
    name,
    (select private.current_account_id()),
    null
  )
);

drop function if exists public.update_account_profile(text, text);

create or replace function public.update_account_display_name(display_name text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_account_id uuid := private.current_account_id();
  clean_name text := left(coalesce(nullif(trim(display_name), ''), 'Nutzer'), 24);
begin
  if target_account_id is null then
    raise exception 'account required';
  end if;

  update public.accounts
  set display_name = clean_name,
      updated_at = now()
  where id = target_account_id;

  update public.list_members
  set display_name = clean_name
  where user_id = target_account_id
    and removed_at is null;

  update public.list_items
  set added_by_display_name = clean_name
  where added_by_user_id = target_account_id;

  return private.account_json(target_account_id);
end;
$$;

create or replace function public.update_account_avatar(avatar_url text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_account_id uuid := private.current_account_id();
  clean_avatar text := left(coalesce(trim(avatar_url), ''), 512);
begin
  if target_account_id is null then
    raise exception 'account required';
  end if;

  update public.accounts
  set avatar_url = clean_avatar,
      updated_at = now()
  where id = target_account_id;

  update public.list_members
  set avatar_url = clean_avatar
  where user_id = target_account_id
    and removed_at is null;

  update public.list_items
  set added_by_avatar_url = clean_avatar
  where added_by_user_id = target_account_id;

  return private.account_json(target_account_id);
end;
$$;

revoke all on function public.update_account_display_name(text) from public, anon, authenticated;
revoke all on function public.update_account_avatar(text) from public, anon, authenticated;
grant execute on function public.update_account_display_name(text) to authenticated;
grant execute on function public.update_account_avatar(text) to authenticated;
