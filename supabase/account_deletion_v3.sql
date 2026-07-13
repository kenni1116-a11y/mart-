drop function if exists public.delete_current_account_v3();

create or replace function public.delete_current_account_v3(expected_account_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  deleted_account_id uuid;
  account_auth_user_ids uuid[];
begin
  if request_user_id is null then
    raise exception 'account_required';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(request_user_id::text, 0)
  );

  deleted_account_id := private.current_account_id();
  if deleted_account_id is null then
    raise exception 'account_required';
  end if;
  if expected_account_id is null or deleted_account_id <> expected_account_id then
    raise exception 'account_changed';
  end if;

  perform 1
  from public.accounts accounts
  where accounts.id = deleted_account_id
  for update;
  if not found then
    raise exception 'account_required';
  end if;

  select array_agg(devices.auth_user_id order by devices.auth_user_id)
  into account_auth_user_ids
  from public.account_devices devices
  where devices.account_id = deleted_account_id;

  if account_auth_user_ids is null
    or not request_user_id = any(account_auth_user_ids) then
    raise exception 'account_required';
  end if;

  delete from public.accounts
  where id = deleted_account_id;

  delete from auth.sessions
  where user_id = any(account_auth_user_ids);

  delete from auth.users
  where id = any(account_auth_user_ids);

  return jsonb_build_object(
    'ok', true,
    'deletedAccountId', deleted_account_id
  );
end;
$$;

revoke all on function public.delete_current_account_v3(uuid) from public, anon, authenticated;
grant execute on function public.delete_current_account_v3(uuid) to authenticated;
