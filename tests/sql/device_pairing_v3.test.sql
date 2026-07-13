begin;

do $$
declare
  owner_auth_user_id uuid := gen_random_uuid();
  unbootstrapped_auth_user_id uuid := gen_random_uuid();
  technical_auth_user_id uuid := gen_random_uuid();
  occupied_auth_user_id uuid := gen_random_uuid();
  recovery_auth_user_id uuid := gen_random_uuid();
  competing_owner_auth_user_id uuid := gen_random_uuid();
  contested_auth_user_id uuid := gen_random_uuid();
  owner_account_id uuid;
  technical_account_id uuid := gen_random_uuid();
  occupied_account_id uuid := gen_random_uuid();
  recovery_account_id uuid := gen_random_uuid();
  competing_owner_account_id uuid;
  technical_device_id uuid;
  unbootstrapped_pairing jsonb;
  technical_pairing jsonb;
  occupied_pairing jsonb;
  recovery_pairing jsonb;
  first_owner_pairing jsonb;
  second_owner_pairing jsonb;
  request_result jsonb;
  approval_result jsonb;
  occupied_state_before jsonb;
  occupied_state_after jsonb;
  recovery_state_before jsonb;
  recovery_state_after jsonb;
begin
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values
    (owner_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-owner-' || owner_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (unbootstrapped_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-unbootstrapped-' || unbootstrapped_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (technical_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-technical-' || technical_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (occupied_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-occupied-' || occupied_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (recovery_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-recovery-' || recovery_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (competing_owner_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-competing-owner-' || competing_owner_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (contested_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-contested-' || contested_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true);

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  owner_account_id := (public.bootstrap_account('Owner device', 'test')->>'id')::uuid;

  -- A newly authenticated device has no account or device mapping before pairing.
  unbootstrapped_pairing := public.create_device_pairing();
  perform set_config('request.jwt.claim.sub', unbootstrapped_auth_user_id::text, true);
  if private.current_account_id() is not null
    or private.current_device_id() is not null
    or exists (
      select 1
      from public.account_devices devices
      where devices.auth_user_id = unbootstrapped_auth_user_id
    ) then
    raise exception 'unbootstrapped user unexpectedly has an account device';
  end if;

  request_result := public.request_device_pairing_v3(
    (unbootstrapped_pairing->>'pairingId')::uuid,
    unbootstrapped_pairing->>'pairingToken',
    'Unbootstrapped device',
    'test'
  );

  if (request_result->>'status') <> 'pending' then
    raise exception 'expected unbootstrapped request to be pending, got %', request_result;
  end if;
  if exists (
    select 1
    from public.account_devices devices
    where devices.auth_user_id = unbootstrapped_auth_user_id
  ) then
    raise exception 'unbootstrapped request created an account device before approval';
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((unbootstrapped_pairing->>'pairingId')::uuid);
  if (approval_result->>'status') <> 'approved' then
    raise exception 'expected unbootstrapped approval, got %', approval_result;
  end if;

  perform set_config('request.jwt.claim.sub', unbootstrapped_auth_user_id::text, true);
  if private.current_account_id() <> owner_account_id then
    raise exception 'unbootstrapped device was not attached to owner account';
  end if;

  -- A one-device, data-free transition account may be removed during pairing.
  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  technical_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    technical_account_id,
    'user-' || upper(substr(replace(technical_account_id::text, '-', ''), 1, 7)),
    'Technical'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (technical_account_id, technical_auth_user_id, 'Technical device', 'test')
  returning id into technical_device_id;

  perform set_config('request.jwt.claim.sub', technical_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (technical_pairing->>'pairingId')::uuid,
    technical_pairing->>'pairingToken',
    'Paired technical device',
    'test'
  );
  if (request_result->>'status') <> 'pending' then
    raise exception 'expected technical request to be pending, got %', request_result;
  end if;
  if exists (select 1 from public.accounts where id = technical_account_id) then
    raise exception 'empty technical account still exists';
  end if;
  if exists (select 1 from public.account_devices where id = technical_device_id) then
    raise exception 'empty technical device still exists';
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((technical_pairing->>'pairingId')::uuid);
  if (approval_result->>'status') <> 'approved' then
    raise exception 'expected technical approval, got %', approval_result;
  end if;

  -- A recovery credential alone makes a one-device account non-empty.
  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  recovery_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    recovery_account_id,
    'user-' || upper(substr(replace(recovery_account_id::text, '-', ''), 1, 7)),
    'Recovery enabled'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (recovery_account_id, recovery_auth_user_id, 'Recovery device', 'test');
  insert into public.account_recovery_credentials (account_id, code_hash)
  values (recovery_account_id, private.secret_hash('recovery-v3-' || recovery_account_id::text));

  select jsonb_build_object(
    'account', (select to_jsonb(accounts) from public.accounts accounts where accounts.id = recovery_account_id),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(devices) order by devices.id)
      from public.account_devices devices
      where devices.account_id = recovery_account_id
    ), '[]'::jsonb),
    'recoveryCredentials', coalesce((
      select jsonb_agg(to_jsonb(credentials) order by credentials.account_id)
      from public.account_recovery_credentials credentials
      where credentials.account_id = recovery_account_id
    ), '[]'::jsonb),
    'pairing', (select to_jsonb(pairings) from public.device_pairings pairings where pairings.id = (recovery_pairing->>'pairingId')::uuid)
  ) into recovery_state_before;

  perform set_config('request.jwt.claim.sub', recovery_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (recovery_pairing->>'pairingId')::uuid,
    recovery_pairing->>'pairingToken',
    'Recovery device',
    'test'
  );
  if request_result->>'error' is distinct from 'account_in_use' then
    raise exception 'expected recovery-enabled account_in_use, got %', request_result;
  end if;

  select jsonb_build_object(
    'account', (select to_jsonb(accounts) from public.accounts accounts where accounts.id = recovery_account_id),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(devices) order by devices.id)
      from public.account_devices devices
      where devices.account_id = recovery_account_id
    ), '[]'::jsonb),
    'recoveryCredentials', coalesce((
      select jsonb_agg(to_jsonb(credentials) order by credentials.account_id)
      from public.account_recovery_credentials credentials
      where credentials.account_id = recovery_account_id
    ), '[]'::jsonb),
    'pairing', (select to_jsonb(pairings) from public.device_pairings pairings where pairings.id = (recovery_pairing->>'pairingId')::uuid)
  ) into recovery_state_after;

  if recovery_state_before is distinct from recovery_state_after then
    raise exception 'recovery-enabled account_in_use changed account, device, credential, or pairing state';
  end if;

  -- Sequential approvals from two owners cannot move one pending identity.
  perform set_config('request.jwt.claim.sub', competing_owner_auth_user_id::text, true);
  competing_owner_account_id := (public.bootstrap_account('Competing owner', 'test')->>'id')::uuid;
  first_owner_pairing := public.create_device_pairing();
  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  second_owner_pairing := public.create_device_pairing();

  perform set_config('request.jwt.claim.sub', contested_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (first_owner_pairing->>'pairingId')::uuid,
    first_owner_pairing->>'pairingToken',
    'Contested device',
    'test'
  );
  if (request_result->>'status') <> 'pending' then
    raise exception 'expected first contested request to be pending, got %', request_result;
  end if;
  request_result := public.request_device_pairing_v3(
    (second_owner_pairing->>'pairingId')::uuid,
    second_owner_pairing->>'pairingToken',
    'Contested device',
    'test'
  );
  if (request_result->>'status') <> 'pending' then
    raise exception 'expected second contested request to be pending, got %', request_result;
  end if;

  perform set_config('request.jwt.claim.sub', competing_owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((first_owner_pairing->>'pairingId')::uuid);
  if (approval_result->>'status') <> 'approved' then
    raise exception 'expected first contested approval, got %', approval_result;
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((second_owner_pairing->>'pairingId')::uuid);
  if approval_result->>'error' is distinct from 'account_in_use' then
    raise exception 'expected second owner account_in_use, got %', approval_result;
  end if;
  if not exists (
    select 1
    from public.account_devices devices
    where devices.auth_user_id = contested_auth_user_id
      and devices.account_id = competing_owner_account_id
  ) then
    raise exception 'second owner moved the contested device';
  end if;
  if exists (
    select 1
    from public.account_devices devices
    where devices.auth_user_id = contested_auth_user_id
      and devices.account_id = owner_account_id
  ) then
    raise exception 'contested device was attached to the second owner';
  end if;

  if position('pg_advisory_xact_lock' in pg_get_functiondef('public.approve_device_pairing_v3(uuid)'::regprocedure)) = 0 then
    raise exception 'approve_device_pairing_v3 is missing pending identity advisory locking';
  end if;

  -- A non-empty account must be returned intact, including every relevant row.
  occupied_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    occupied_account_id,
    'user-' || upper(substr(replace(occupied_account_id::text, '-', ''), 1, 7)),
    'Occupied'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (occupied_account_id, occupied_auth_user_id, 'Occupied device', 'test');
  insert into public.shopping_lists (id, name, owner_user_id)
  values ('pairing-v3-' || replace(occupied_account_id::text, '-', ''), 'Occupied list', occupied_account_id);
  insert into public.list_members (list_id, user_id, display_name, role)
  values ('pairing-v3-' || replace(occupied_account_id::text, '-', ''), occupied_account_id, 'Occupied', 'owner');
  insert into public.list_items (list_id, item_id, name, added_by_user_id, updated_by_user_id)
  values ('pairing-v3-' || replace(occupied_account_id::text, '-', ''), 'occupied-item', 'Occupied item', occupied_account_id, occupied_account_id);

  select jsonb_build_object(
    'account', (select to_jsonb(accounts) from public.accounts accounts where accounts.id = occupied_account_id),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(devices) order by devices.id)
      from public.account_devices devices
      where devices.account_id = occupied_account_id
    ), '[]'::jsonb),
    'lists', coalesce((
      select jsonb_agg(to_jsonb(lists) order by lists.id)
      from public.shopping_lists lists
      where lists.owner_user_id = occupied_account_id
    ), '[]'::jsonb),
    'listMembers', coalesce((
      select jsonb_agg(to_jsonb(members) order by members.list_id, members.user_id)
      from public.list_members members
      join public.shopping_lists lists on lists.id = members.list_id
      where lists.owner_user_id = occupied_account_id
    ), '[]'::jsonb),
    'listItems', coalesce((
      select jsonb_agg(to_jsonb(items) order by items.list_id, items.item_id)
      from public.list_items items
      join public.shopping_lists lists on lists.id = items.list_id
      where lists.owner_user_id = occupied_account_id
    ), '[]'::jsonb),
    'pairing', (select to_jsonb(pairings) from public.device_pairings pairings where pairings.id = (occupied_pairing->>'pairingId')::uuid)
  ) into occupied_state_before;

  perform set_config('request.jwt.claim.sub', occupied_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (occupied_pairing->>'pairingId')::uuid,
    occupied_pairing->>'pairingToken',
    'Occupied device',
    'test'
  );
  if request_result->>'error' <> 'account_in_use' then
    raise exception 'expected account_in_use, got %', request_result;
  end if;

  select jsonb_build_object(
    'account', (select to_jsonb(accounts) from public.accounts accounts where accounts.id = occupied_account_id),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(devices) order by devices.id)
      from public.account_devices devices
      where devices.account_id = occupied_account_id
    ), '[]'::jsonb),
    'lists', coalesce((
      select jsonb_agg(to_jsonb(lists) order by lists.id)
      from public.shopping_lists lists
      where lists.owner_user_id = occupied_account_id
    ), '[]'::jsonb),
    'listMembers', coalesce((
      select jsonb_agg(to_jsonb(members) order by members.list_id, members.user_id)
      from public.list_members members
      join public.shopping_lists lists on lists.id = members.list_id
      where lists.owner_user_id = occupied_account_id
    ), '[]'::jsonb),
    'listItems', coalesce((
      select jsonb_agg(to_jsonb(items) order by items.list_id, items.item_id)
      from public.list_items items
      join public.shopping_lists lists on lists.id = items.list_id
      where lists.owner_user_id = occupied_account_id
    ), '[]'::jsonb),
    'pairing', (select to_jsonb(pairings) from public.device_pairings pairings where pairings.id = (occupied_pairing->>'pairingId')::uuid)
  ) into occupied_state_after;

  if occupied_state_before is distinct from occupied_state_after then
    raise exception 'account_in_use request changed account, device, list, or pairing state';
  end if;
end;
$$;

rollback;
