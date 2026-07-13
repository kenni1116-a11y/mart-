begin;

do $$
declare
  deleted_account_id constant uuid := 'd4e10000-0000-4000-8000-000000000010';
  deleted_auth_user_id_1 constant uuid := 'd4e10000-0000-4000-8000-000000000011';
  deleted_auth_user_id_2 constant uuid := 'd4e10000-0000-4000-8000-000000000012';
  deleted_device_id_1 constant uuid := 'd4e10000-0000-4000-8000-000000000013';
  deleted_device_id_2 constant uuid := 'd4e10000-0000-4000-8000-000000000014';
  deleted_pairing_id constant uuid := 'd4e10000-0000-4000-8000-000000000015';
  unmapped_auth_user_id constant uuid := 'd4e10000-0000-4000-8000-000000000016';
  foreign_account_id constant uuid := 'd4e10000-0000-4000-8000-000000000020';
  foreign_auth_user_id constant uuid := 'd4e10000-0000-4000-8000-000000000021';
  foreign_device_id constant uuid := 'd4e10000-0000-4000-8000-000000000022';
  owned_list_id constant text := 'account-deletion-v3-owned-fixture';
  foreign_list_id constant text := 'account-deletion-v3-foreign-fixture';
  result jsonb;
begin
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values
    (deleted_auth_user_id_1, 'authenticated', 'authenticated', 'account-deletion-v3-device-1@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (deleted_auth_user_id_2, 'authenticated', 'authenticated', 'account-deletion-v3-device-2@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (unmapped_auth_user_id, 'authenticated', 'authenticated', 'account-deletion-v3-unmapped@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (foreign_auth_user_id, 'authenticated', 'authenticated', 'account-deletion-v3-foreign@example.test', '{}'::jsonb, '{}'::jsonb, true);

  insert into auth.sessions (id, user_id)
  values
    ('d4e10000-0000-4000-8000-000000000031', deleted_auth_user_id_1),
    ('d4e10000-0000-4000-8000-000000000032', deleted_auth_user_id_2),
    ('d4e10000-0000-4000-8000-000000000033', foreign_auth_user_id);

  insert into public.accounts (id, username, display_name)
  values
    (deleted_account_id, 'user-D4E1000', 'Delete fixture'),
    (foreign_account_id, 'user-D4E2000', 'Foreign fixture');

  insert into public.account_devices (id, account_id, auth_user_id, label, platform)
  values
    (deleted_device_id_1, deleted_account_id, deleted_auth_user_id_1, 'Delete device 1', 'test'),
    (deleted_device_id_2, deleted_account_id, deleted_auth_user_id_2, 'Delete device 2', 'test'),
    (foreign_device_id, foreign_account_id, foreign_auth_user_id, 'Foreign device', 'test');

  insert into public.account_recovery_credentials (account_id, code_hash)
  values (deleted_account_id, decode('d4e10000000040008000000000000010', 'hex'));

  insert into public.shopping_lists (id, name, owner_user_id)
  values
    (owned_list_id, 'Owned fixture', deleted_account_id),
    (foreign_list_id, 'Foreign fixture', foreign_account_id);

  insert into public.list_members (list_id, user_id, display_name, role)
  values
    (owned_list_id, deleted_account_id, 'Owner fixture', 'owner'),
    (foreign_list_id, deleted_account_id, 'Member fixture', 'editor'),
    (foreign_list_id, foreign_account_id, 'Foreign owner', 'owner');

  insert into public.list_items (list_id, item_id, name, added_by_user_id)
  values (owned_list_id, 'owned-item', 'Owned item fixture', deleted_account_id);

  insert into public.device_pairings (
    id,
    account_id,
    token_hash,
    confirmation_code,
    created_by_device_id
  ) values (
    deleted_pairing_id,
    deleted_account_id,
    decode('d4e10000000040008000000000000015', 'hex'),
    '4015',
    deleted_device_id_1
  );

  perform set_config('request.jwt.claim.sub', deleted_auth_user_id_1::text, true);
  update public.account_devices
  set account_id = foreign_account_id
  where id = deleted_device_id_1;

  begin
    perform public.delete_current_account_v3(deleted_account_id);
    raise exception 'changed account mapping did not raise account_changed';
  exception
    when others then
      if sqlerrm <> 'account_changed' then
        raise;
      end if;
  end;

  if not exists (select 1 from public.accounts where id = foreign_account_id) then
    raise exception 'changed account mapping deleted account B';
  end if;
  if not exists (select 1 from public.account_devices where id = foreign_device_id) then
    raise exception 'changed account mapping deleted account B device';
  end if;
  if not exists (select 1 from public.shopping_lists where id = foreign_list_id) then
    raise exception 'changed account mapping deleted account B list';
  end if;
  if not exists (select 1 from auth.sessions where user_id = foreign_auth_user_id) then
    raise exception 'changed account mapping deleted account B session';
  end if;
  if not exists (select 1 from auth.users where id = foreign_auth_user_id) then
    raise exception 'changed account mapping deleted account B auth user';
  end if;

  update public.account_devices
  set account_id = deleted_account_id
  where id = deleted_device_id_1;

  result := public.delete_current_account_v3(deleted_account_id);

  if result is distinct from jsonb_build_object('ok', true, 'deletedAccountId', deleted_account_id) then
    raise exception 'unexpected delete result: %', result;
  end if;
  if exists (select 1 from public.accounts where id = deleted_account_id) then
    raise exception 'deleted account remains';
  end if;
  if exists (select 1 from public.account_devices where account_id = deleted_account_id) then
    raise exception 'deleted account devices remain';
  end if;
  if exists (select 1 from public.account_recovery_credentials where account_id = deleted_account_id) then
    raise exception 'deleted recovery credentials remain';
  end if;
  if exists (select 1 from public.device_pairings where account_id = deleted_account_id) then
    raise exception 'deleted account pairings remain';
  end if;
  if exists (select 1 from public.shopping_lists where id = owned_list_id) then
    raise exception 'owned list remains';
  end if;
  if exists (select 1 from public.list_items where list_id = owned_list_id) then
    raise exception 'owned list items remain';
  end if;
  if exists (select 1 from public.list_members where user_id = deleted_account_id) then
    raise exception 'deleted account memberships remain';
  end if;
  if exists (
    select 1 from auth.sessions
    where user_id in (deleted_auth_user_id_1, deleted_auth_user_id_2)
  ) then
    raise exception 'deleted account sessions remain';
  end if;
  if exists (
    select 1 from auth.users
    where id in (deleted_auth_user_id_1, deleted_auth_user_id_2)
  ) then
    raise exception 'deleted account auth users remain';
  end if;

  if not exists (select 1 from public.accounts where id = foreign_account_id) then
    raise exception 'foreign account was deleted';
  end if;
  if not exists (select 1 from public.shopping_lists where id = foreign_list_id) then
    raise exception 'foreign list was deleted';
  end if;
  if not exists (select 1 from auth.sessions where user_id = foreign_auth_user_id) then
    raise exception 'foreign auth session was deleted';
  end if;
  if not exists (select 1 from auth.users where id = foreign_auth_user_id) then
    raise exception 'foreign auth user was deleted';
  end if;

  perform set_config('request.jwt.claim.sub', unmapped_auth_user_id::text, true);
  begin
    perform public.delete_current_account_v3(deleted_account_id);
    raise exception 'missing account mapping did not raise account_required';
  exception
    when others then
      if sqlerrm <> 'account_required' then
        raise;
      end if;
  end;

  if not exists (
    select 1
    from pg_proc functions
    join pg_namespace schemas on schemas.oid = functions.pronamespace
    where schemas.nspname = 'public'
      and functions.proname = 'delete_current_account_v3'
      and functions.pronargs = 1
      and functions.proargtypes[0] = 'uuid'::regtype
      and functions.prosecdef
      and functions.proconfig @> array['search_path=""']
  ) then
    raise exception 'delete_current_account_v3 must be security definer with empty search_path';
  end if;
  if exists (
    select 1
    from pg_proc functions
    join pg_namespace schemas on schemas.oid = functions.pronamespace
    where schemas.nspname = 'public'
      and functions.proname = 'delete_current_account_v3'
      and functions.pronargs = 0
  ) then
    raise exception 'unsafe zero-argument delete_current_account_v3 remains';
  end if;
  if has_function_privilege('anon', 'public.delete_current_account_v3(uuid)', 'EXECUTE') then
    raise exception 'anon can execute delete_current_account_v3';
  end if;
  if not has_function_privilege('authenticated', 'public.delete_current_account_v3(uuid)', 'EXECUTE') then
    raise exception 'authenticated cannot execute delete_current_account_v3';
  end if;
end;
$$;

rollback;
