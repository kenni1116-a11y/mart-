begin;

do $$
declare
  owner_auth_user_id uuid := gen_random_uuid();
  temporary_auth_user_id uuid := gen_random_uuid();
  occupied_auth_user_id uuid := gen_random_uuid();
  owner_account_id uuid;
  temporary_account_id uuid := gen_random_uuid();
  occupied_account_id uuid := gen_random_uuid();
  temporary_device_id uuid;
  occupied_device_id uuid;
  first_pairing jsonb;
  second_pairing jsonb;
  request_result jsonb;
  approval_result jsonb;
begin
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values
    (owner_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-owner-' || owner_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (temporary_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-temporary-' || temporary_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (occupied_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-occupied-' || occupied_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true);

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  owner_account_id := (public.bootstrap_account('Owner device', 'test')->>'id')::uuid;
  first_pairing := public.create_device_pairing();

  insert into public.accounts (id, username, display_name)
  values (
    temporary_account_id,
    'user-' || upper(substr(replace(temporary_account_id::text, '-', ''), 1, 7)),
    'Temporary'
  );

  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (temporary_account_id, temporary_auth_user_id, 'Temporary device', 'test')
  returning id into temporary_device_id;

  perform set_config('request.jwt.claim.sub', temporary_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (first_pairing->>'pairingId')::uuid,
    first_pairing->>'pairingToken',
    'Paired device',
    'test'
  );

  if (request_result->>'status') <> 'pending' then
    raise exception 'expected pending pairing, got %', request_result;
  end if;
  if exists (select 1 from public.accounts where id = temporary_account_id) then
    raise exception 'empty temporary account still exists';
  end if;
  if exists (select 1 from public.account_devices where id = temporary_device_id) then
    raise exception 'empty temporary device still exists';
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((first_pairing->>'pairingId')::uuid);

  if (approval_result->>'status') <> 'approved' then
    raise exception 'expected approved pairing, got %', approval_result;
  end if;

  perform set_config('request.jwt.claim.sub', temporary_auth_user_id::text, true);
  if private.current_account_id() <> owner_account_id then
    raise exception 'new device was not attached to owner account';
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  second_pairing := public.create_device_pairing();

  insert into public.accounts (id, username, display_name)
  values (
    occupied_account_id,
    'user-' || upper(substr(replace(occupied_account_id::text, '-', ''), 1, 7)),
    'Occupied'
  );

  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (occupied_account_id, occupied_auth_user_id, 'Occupied device', 'test')
  returning id into occupied_device_id;

  insert into public.shopping_lists (id, name, owner_user_id)
  values ('pairing-v3-' || replace(occupied_account_id::text, '-', ''), 'Occupied list', occupied_account_id);

  perform set_config('request.jwt.claim.sub', occupied_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (second_pairing->>'pairingId')::uuid,
    second_pairing->>'pairingToken',
    'Occupied device',
    'test'
  );

  if request_result->>'error' <> 'account_in_use' then
    raise exception 'expected account_in_use, got %', request_result;
  end if;
  if not exists (select 1 from public.accounts where id = occupied_account_id) then
    raise exception 'non-empty account was deleted';
  end if;
  if not exists (
    select 1
    from public.account_devices
    where id = occupied_device_id
      and account_id = occupied_account_id
      and auth_user_id = occupied_auth_user_id
  ) then
    raise exception 'non-empty account device was detached';
  end if;
  if not exists (
    select 1
    from public.shopping_lists
    where owner_user_id = occupied_account_id
      and deleted_at is null
  ) then
    raise exception 'non-empty account data was modified';
  end if;
  if exists (
    select 1
    from public.device_pairings
    where id = (second_pairing->>'pairingId')::uuid
      and pending_auth_user_id is not null
  ) then
    raise exception 'account_in_use request changed the pairing';
  end if;
end;
$$;

rollback;
