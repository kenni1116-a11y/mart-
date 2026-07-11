create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

do $$
begin
  if to_regprocedure('public.list_owner_id(text)') is not null then
    alter function public.list_owner_id(text) set schema private;
  end if;
  if to_regprocedure('public.list_invite_matches(text,text)') is not null then
    alter function public.list_invite_matches(text, text) set schema private;
  end if;
  if to_regprocedure('public.is_active_list_member(text,uuid)') is not null then
    alter function public.is_active_list_member(text, uuid) set schema private;
  end if;
  if to_regprocedure('public.can_edit_list(text,uuid)') is not null then
    alter function public.can_edit_list(text, uuid) set schema private;
  end if;
end;
$$;

revoke all on function private.list_owner_id(text) from public, anon;
revoke all on function private.list_invite_matches(text, text) from public, anon;
revoke all on function private.is_active_list_member(text, uuid) from public, anon;
revoke all on function private.can_edit_list(text, uuid) from public, anon;
grant execute on function private.list_owner_id(text) to authenticated;
grant execute on function private.list_invite_matches(text, text) to authenticated;
grant execute on function private.is_active_list_member(text, uuid) to authenticated;
grant execute on function private.can_edit_list(text, uuid) to authenticated;

create or replace function public.join_shopping_list(
  target_list_id text,
  target_invite_code text,
  display_name text default 'Gast',
  avatar_url text default ''
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  clean_name text := left(coalesce(nullif(trim(display_name), ''), 'Gast'), 24);
  clean_avatar text := left(coalesce(avatar_url, ''), 512);
begin
  if request_user_id is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'permanent account required';
  end if;

  perform set_config('request.mart_invite_code', target_invite_code, true);

  if not private.list_invite_matches(target_list_id, target_invite_code) then
    raise exception 'invalid invite';
  end if;

  insert into public.list_members (
    list_id,
    user_id,
    display_name,
    avatar_url,
    role,
    invited_by_user_id,
    joined_at,
    removed_at,
    removed_by_user_id
  )
  values (
    target_list_id,
    request_user_id,
    clean_name,
    clean_avatar,
    'editor',
    private.list_owner_id(target_list_id),
    now(),
    null,
    null
  )
  on conflict (list_id, user_id) do update
  set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    role = case
      when public.list_members.role = 'owner' then 'owner'
      else 'editor'
    end,
    removed_at = null,
    removed_by_user_id = null;

  update public.shopping_lists
  set updated_at = now(), updated_by_user_id = request_user_id, revision = revision + 1
  where id = target_list_id;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

create or replace function public.leave_shopping_list(target_list_id text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
begin
  if request_user_id is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'permanent account required';
  end if;

  if private.list_owner_id(target_list_id) = request_user_id then
    raise exception 'owner cannot leave list';
  end if;

  update public.shopping_lists
  set updated_at = now(), updated_by_user_id = request_user_id, revision = revision + 1
  where id = target_list_id;

  update public.list_members
  set removed_at = now(), removed_by_user_id = request_user_id
  where list_id = target_list_id
    and user_id = request_user_id;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

create or replace function public.delete_shopping_list(target_list_id text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
begin
  if request_user_id is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'permanent account required';
  end if;

  update public.shopping_lists
  set deleted_at = now(),
      deleted_by_user_id = request_user_id,
      updated_at = now(),
      updated_by_user_id = request_user_id,
      revision = revision + 1
  where id = target_list_id
    and owner_user_id = request_user_id;

  if not found then
    raise exception 'not list owner';
  end if;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

revoke all on function public.join_shopping_list(text, text, text, text) from public, anon;
revoke all on function public.leave_shopping_list(text) from public, anon;
revoke all on function public.delete_shopping_list(text) from public, anon;
grant execute on function public.join_shopping_list(text, text, text, text) to authenticated;
grant execute on function public.leave_shopping_list(text) to authenticated;
grant execute on function public.delete_shopping_list(text) to authenticated;
