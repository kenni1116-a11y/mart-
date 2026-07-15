begin;

create function pg_temp.pairing_v3_account_state(target_account_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'account', (
      select to_jsonb(accounts)
      from public.accounts accounts
      where accounts.id = target_account_id
    ),
    'devices', coalesce((
      select jsonb_agg(to_jsonb(devices) order by devices.id)
      from public.account_devices devices
      where devices.account_id = target_account_id
    ), '[]'::jsonb),
    'recoveryCredentials', coalesce((
      select jsonb_agg(to_jsonb(credentials) order by credentials.account_id)
      from public.account_recovery_credentials credentials
      where credentials.account_id = target_account_id
    ), '[]'::jsonb),
    'ownedPairings', coalesce((
      select jsonb_agg(to_jsonb(pairings) order by pairings.id)
      from public.device_pairings pairings
      where pairings.account_id = target_account_id
    ), '[]'::jsonb),
    'ownedLists', coalesce((
      select jsonb_agg(to_jsonb(lists) order by lists.id)
      from public.shopping_lists lists
      where lists.owner_user_id = target_account_id
    ), '[]'::jsonb),
    'listMembers', coalesce((
      select jsonb_agg(to_jsonb(members) order by members.list_id, members.user_id)
      from public.list_members members
      where members.user_id = target_account_id
        or members.invited_by_user_id = target_account_id
        or members.removed_by_user_id = target_account_id
        or exists (
          select 1
          from public.shopping_lists lists
          where lists.id = members.list_id
            and lists.owner_user_id = target_account_id
        )
    ), '[]'::jsonb),
    'listItems', coalesce((
      select jsonb_agg(to_jsonb(items) order by items.list_id, items.item_id)
      from public.list_items items
      where items.added_by_user_id = target_account_id
        or items.checked_by_user_id = target_account_id
        or items.updated_by_user_id = target_account_id
        or items.deleted_by_user_id = target_account_id
        or exists (
          select 1
          from public.shopping_lists lists
          where lists.id = items.list_id
            and lists.owner_user_id = target_account_id
        )
    ), '[]'::jsonb),
    'attributedLists', coalesce((
      select jsonb_agg(to_jsonb(lists) order by lists.id)
      from public.shopping_lists lists
      where lists.updated_by_user_id = target_account_id
        or lists.deleted_by_user_id = target_account_id
    ), '[]'::jsonb)
  )
$$;

create function pg_temp.assert_pairing_account_in_use(
  case_name text,
  pending_auth_user_id uuid,
  pending_account_id uuid,
  pairing jsonb,
  use_legacy_request boolean default false
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  state_before_request jsonb;
  state_after_request jsonb;
  request_result jsonb;
begin
  state_before_request := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(pending_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (pairing->>'pairingId')::uuid
    )
  );

  perform set_config('request.jwt.claim.sub', pending_auth_user_id::text, true);
  if use_legacy_request then
    request_result := public.request_device_pairing(
      (pairing->>'pairingId')::uuid,
      pairing->>'pairingToken',
      case_name,
      'test'
    );
  else
    request_result := public.request_device_pairing_v3(
      (pairing->>'pairingId')::uuid,
      pairing->>'pairingToken',
      case_name,
      'test'
    );
  end if;

  if request_result->>'error' is distinct from 'account_in_use' then
    raise exception '%: expected immediate account_in_use, got %', case_name, request_result;
  end if;

  state_after_request := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(pending_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (pairing->>'pairingId')::uuid
    )
  );

  if state_before_request is distinct from state_after_request then
    raise exception '%: immediate account_in_use changed account, device, data, or pairing state', case_name;
  end if;
end;
$$;

do $$
declare
  owner_auth_user_id uuid := gen_random_uuid();
  unbootstrapped_auth_user_id uuid := gen_random_uuid();
  transition_auth_user_id uuid := gen_random_uuid();
  two_device_auth_user_id uuid := gen_random_uuid();
  two_device_second_auth_user_id uuid := gen_random_uuid();
  recovery_auth_user_id uuid := gen_random_uuid();
  soft_deleted_list_auth_user_id uuid := gen_random_uuid();
  removed_membership_auth_user_id uuid := gen_random_uuid();
  pairing_history_auth_user_id uuid := gen_random_uuid();
  status_race_auth_user_id uuid := gen_random_uuid();
  competing_owner_auth_user_id uuid := gen_random_uuid();
  contested_auth_user_id uuid := gen_random_uuid();
  owner_account_id uuid;
  transition_account_id uuid := gen_random_uuid();
  two_device_account_id uuid := gen_random_uuid();
  recovery_account_id uuid := gen_random_uuid();
  soft_deleted_list_account_id uuid := gen_random_uuid();
  removed_membership_account_id uuid := gen_random_uuid();
  pairing_history_account_id uuid := gen_random_uuid();
  status_race_account_id uuid := gen_random_uuid();
  competing_owner_account_id uuid;
  transition_device_id uuid;
  pairing_history_device_id uuid;
  unbootstrapped_pairing jsonb;
  transition_pairing jsonb;
  two_device_pairing jsonb;
  two_device_second_pairing jsonb;
  recovery_pairing jsonb;
  soft_deleted_list_pairing jsonb;
  removed_membership_pairing jsonb;
  pairing_history_pairing jsonb;
  status_race_pairing jsonb;
  first_owner_pairing jsonb;
  second_owner_pairing jsonb;
  reference_pairing jsonb;
  request_result jsonb;
  approval_result jsonb;
  status_result jsonb;
  account_state_before_request jsonb;
  account_state_after_request jsonb;
  two_device_state_before jsonb;
  two_device_state_after jsonb;
  competing_state_before jsonb;
  competing_state_after jsonb;
  status_race_state_before jsonb;
  status_race_state_after jsonb;
  approval_definition text;
  initial_mapping_read text;
  foreign_account_lock_position integer;
  foreign_devices_lock_position integer;
  foreign_mapping_reread_position integer;
  legacy_approval_definition text;
  legacy_request_definition text;
  legacy_status_definition text;
  request_definition text;
  status_definition text;
  helper_definition text;
  durable_reference record;
  reference_auth_user_id uuid;
  reference_account_id uuid;
  reference_id text;
begin
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values
    (owner_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-owner-' || owner_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (unbootstrapped_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-unbootstrapped-' || unbootstrapped_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (transition_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-transition-' || transition_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (two_device_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-two-device-' || two_device_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (two_device_second_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-two-device-second-' || two_device_second_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (recovery_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-recovery-' || recovery_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (soft_deleted_list_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-soft-deleted-' || soft_deleted_list_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (removed_membership_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-removed-member-' || removed_membership_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (pairing_history_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-pairing-history-' || pairing_history_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (status_race_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-status-race-' || status_race_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (competing_owner_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-competing-owner-' || competing_owner_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (contested_auth_user_id, 'authenticated', 'authenticated', 'pairing-v3-contested-' || contested_auth_user_id || '@example.test', '{}'::jsonb, '{}'::jsonb, true);

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  owner_account_id := (public.bootstrap_account('Owner device', 'test')->>'id')::uuid;

  -- An unbootstrapped identity is attached only when the owner approves.
  unbootstrapped_pairing := public.create_device_pairing();
  perform set_config('request.jwt.claim.sub', unbootstrapped_auth_user_id::text, true);
  if private.current_account_id() is not null or private.current_device_id() is not null then
    raise exception 'unbootstrapped identity unexpectedly has an account or device';
  end if;

  request_result := public.request_device_pairing(
    (unbootstrapped_pairing->>'pairingId')::uuid,
    unbootstrapped_pairing->>'pairingToken',
    'Unbootstrapped device',
    'test'
  );
  if request_result->>'status' is distinct from 'pending' then
    raise exception 'expected unbootstrapped request pending, got %', request_result;
  end if;
  if private.current_account_id() is not null or private.current_device_id() is not null then
    raise exception 'unbootstrapped request created an account or device before approval';
  end if;
  status_result := public.get_device_pairing_status_v3((unbootstrapped_pairing->>'pairingId')::uuid);
  if status_result->>'status' is distinct from 'pending' then
    raise exception 'expected v3 pending status for unbootstrapped request, got %', status_result;
  end if;
  status_result := public.get_device_pairing_status((unbootstrapped_pairing->>'pairingId')::uuid);
  if status_result->>'status' is distinct from 'pending' then
    raise exception 'expected legacy pending status for unbootstrapped request, got %', status_result;
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((unbootstrapped_pairing->>'pairingId')::uuid);
  if approval_result->>'status' is distinct from 'approved' then
    raise exception 'expected unbootstrapped approval, got %', approval_result;
  end if;

  perform set_config('request.jwt.claim.sub', unbootstrapped_auth_user_id::text, true);
  if private.current_account_id() is distinct from owner_account_id then
    raise exception 'unbootstrapped identity was not attached to owner account';
  end if;
  status_result := public.get_device_pairing_status_v3((unbootstrapped_pairing->>'pairingId')::uuid);
  if status_result->>'status' is distinct from 'approved' then
    raise exception 'approved status did not take precedence over target account data, got %', status_result;
  end if;
  status_result := public.get_device_pairing_status((unbootstrapped_pairing->>'pairingId')::uuid);
  if status_result->>'status' is distinct from 'approved' then
    raise exception 'legacy approved status did not delegate to v3, got %', status_result;
  end if;

  -- Requesting is non-mutating; empty transition cleanup happens during approval.
  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  transition_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    transition_account_id,
    'user-' || upper(substr(replace(transition_account_id::text, '-', ''), 1, 7)),
    'Transition'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (transition_account_id, transition_auth_user_id, 'Transition device', 'old-platform')
  returning id into transition_device_id;

  account_state_before_request := pg_temp.pairing_v3_account_state(transition_account_id);
  perform set_config('request.jwt.claim.sub', transition_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (transition_pairing->>'pairingId')::uuid,
    transition_pairing->>'pairingToken',
    'Paired transition device',
    'new-platform'
  );
  if request_result->>'status' is distinct from 'pending' then
    raise exception 'expected transition request pending, got %', request_result;
  end if;

  account_state_after_request := pg_temp.pairing_v3_account_state(transition_account_id);
  if account_state_before_request is distinct from account_state_after_request then
    raise exception 'request mutated the empty transition account or device';
  end if;
  if not exists (
    select 1
    from public.account_devices devices
    where devices.id = transition_device_id
      and devices.account_id = transition_account_id
      and devices.auth_user_id = transition_auth_user_id
      and devices.label = 'Transition device'
      and devices.platform = 'old-platform'
  ) then
    raise exception 'request detached, reassigned, or relabeled the transition device';
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing((transition_pairing->>'pairingId')::uuid);
  if approval_result->>'status' is distinct from 'approved' then
    raise exception 'expected transition approval, got %', approval_result;
  end if;
  if exists (select 1 from public.accounts where id = transition_account_id) then
    raise exception 'empty transition account still exists after approval';
  end if;
  if not exists (
    select 1
    from public.account_devices devices
    where devices.id = transition_device_id
      and devices.account_id = owner_account_id
      and devices.auth_user_id = transition_auth_user_id
      and devices.label = 'Paired transition device'
      and devices.platform = 'new-platform'
  ) then
    raise exception 'transition device was not atomically moved to owner account';
  end if;

  -- More than one device makes the pending account durable.
  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  two_device_pairing := public.create_device_pairing();
  perform set_config('request.jwt.claim.sub', competing_owner_auth_user_id::text, true);
  competing_owner_account_id := (public.bootstrap_account('Competing owner', 'test')->>'id')::uuid;
  two_device_second_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    two_device_account_id,
    'user-' || upper(substr(replace(two_device_account_id::text, '-', ''), 1, 7)),
    'Two devices'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values
    (two_device_account_id, two_device_auth_user_id, 'Pending device', 'test'),
    (two_device_account_id, two_device_second_auth_user_id, 'Other device', 'test');

  two_device_state_before := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(two_device_account_id),
    'pairings', (
      select jsonb_agg(to_jsonb(pairings) order by pairings.id)
      from public.device_pairings pairings
      where pairings.id in (
        (two_device_pairing->>'pairingId')::uuid,
        (two_device_second_pairing->>'pairingId')::uuid
      )
    )
  );

  perform set_config('request.jwt.claim.sub', two_device_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (two_device_pairing->>'pairingId')::uuid,
    two_device_pairing->>'pairingToken',
    'First pending device',
    'test'
  );
  if request_result->>'error' is distinct from 'account_in_use' then
    raise exception 'expected first two-device request account_in_use, got %', request_result;
  end if;

  two_device_state_after := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(two_device_account_id),
    'pairings', (
      select jsonb_agg(to_jsonb(pairings) order by pairings.id)
      from public.device_pairings pairings
      where pairings.id in (
        (two_device_pairing->>'pairingId')::uuid,
        (two_device_second_pairing->>'pairingId')::uuid
      )
    )
  );
  if two_device_state_before is distinct from two_device_state_after then
    raise exception 'first two-device preflight changed account, devices, or pairings';
  end if;

  perform set_config('request.jwt.claim.sub', two_device_second_auth_user_id::text, true);
  request_result := public.request_device_pairing(
    (two_device_second_pairing->>'pairingId')::uuid,
    two_device_second_pairing->>'pairingToken',
    'Second pending device',
    'test'
  );
  if request_result->>'error' is distinct from 'account_in_use' then
    raise exception 'expected legacy two-device request account_in_use, got %', request_result;
  end if;

  two_device_state_after := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(two_device_account_id),
    'pairings', (
      select jsonb_agg(to_jsonb(pairings) order by pairings.id)
      from public.device_pairings pairings
      where pairings.id in (
        (two_device_pairing->>'pairingId')::uuid,
        (two_device_second_pairing->>'pairingId')::uuid
      )
    )
  );
  if two_device_state_before is distinct from two_device_state_after then
    raise exception 'legacy two-device preflight changed account, devices, or pairings';
  end if;

  -- A recovery credential makes a one-device account durable.
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
  insert into public.shopping_lists (id, name, owner_user_id, deleted_at, deleted_by_user_id)
  values (
    'pairing-v3-recovery-history-' || replace(recovery_account_id::text, '-', ''),
    'Recovery history',
    recovery_account_id,
    now(),
    recovery_account_id
  );
  perform pg_temp.assert_pairing_account_in_use(
    'legacy request with recovery and history', recovery_auth_user_id,
    recovery_account_id, recovery_pairing, true
  );

  -- A requester that becomes durable after requesting sees account_in_use through status.
  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  status_race_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    status_race_account_id,
    'user-' || upper(substr(replace(status_race_account_id::text, '-', ''), 1, 7)),
    'Status race'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (status_race_account_id, status_race_auth_user_id, 'Status race device', 'test');

  perform set_config('request.jwt.claim.sub', status_race_auth_user_id::text, true);
  request_result := public.request_device_pairing_v3(
    (status_race_pairing->>'pairingId')::uuid,
    status_race_pairing->>'pairingToken',
    'Status race device',
    'test'
  );
  if request_result->>'status' is distinct from 'pending' then
    raise exception 'expected status-race request pending, got %', request_result;
  end if;

  insert into public.account_recovery_credentials (account_id, code_hash)
  values (status_race_account_id, private.secret_hash('status-race-' || status_race_account_id::text));
  status_race_state_before := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(status_race_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (status_race_pairing->>'pairingId')::uuid
    )
  );

  status_result := public.get_device_pairing_status_v3((status_race_pairing->>'pairingId')::uuid);
  if status_result->>'error' is distinct from 'account_in_use' then
    raise exception 'expected requester-visible status account_in_use, got %', status_result;
  end if;
  status_race_state_after := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(status_race_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (status_race_pairing->>'pairingId')::uuid
    )
  );
  if status_race_state_before is distinct from status_race_state_after then
    raise exception 'v3 status account_in_use mutated account, device, durable data, or pairing';
  end if;

  status_result := public.get_device_pairing_status((status_race_pairing->>'pairingId')::uuid);
  if status_result->>'error' is distinct from 'account_in_use' then
    raise exception 'legacy status did not expose account_in_use, got %', status_result;
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing((status_race_pairing->>'pairingId')::uuid);
  if approval_result->>'error' is distinct from 'account_in_use' then
    raise exception 'legacy approval did not preserve approval-time account_in_use, got %', approval_result;
  end if;
  status_race_state_after := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(status_race_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (status_race_pairing->>'pairingId')::uuid
    )
  );
  if status_race_state_before is distinct from status_race_state_after then
    raise exception 'approval-time account_in_use mutated account, device, durable data, or pairing';
  end if;

  update public.device_pairings
  set expires_at = now() - interval '1 second'
  where id = (status_race_pairing->>'pairingId')::uuid;
  perform set_config('request.jwt.claim.sub', status_race_auth_user_id::text, true);
  status_result := public.get_device_pairing_status_v3((status_race_pairing->>'pairingId')::uuid);
  if status_result->>'status' is distinct from 'expired' then
    raise exception 'expired status did not take precedence over account_in_use, got %', status_result;
  end if;

  update public.device_pairings
  set cancelled_at = now()
  where id = (status_race_pairing->>'pairingId')::uuid;
  status_result := public.get_device_pairing_status((status_race_pairing->>'pairingId')::uuid);
  if status_result->>'status' is distinct from 'cancelled' then
    raise exception 'cancelled status did not take precedence through legacy status, got %', status_result;
  end if;

  -- Soft-deleted owned lists remain durable history.
  soft_deleted_list_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    soft_deleted_list_account_id,
    'user-' || upper(substr(replace(soft_deleted_list_account_id::text, '-', ''), 1, 7)),
    'Soft deleted owner'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (soft_deleted_list_account_id, soft_deleted_list_auth_user_id, 'Soft deleted owner device', 'test');
  insert into public.shopping_lists (id, name, owner_user_id, deleted_at, deleted_by_user_id)
  values (
    'pairing-v3-soft-deleted-' || replace(soft_deleted_list_account_id::text, '-', ''),
    'Soft-deleted list',
    soft_deleted_list_account_id,
    now(),
    soft_deleted_list_account_id
  );
  perform pg_temp.assert_pairing_account_in_use(
    'soft-deleted owned list', soft_deleted_list_auth_user_id,
    soft_deleted_list_account_id, soft_deleted_list_pairing
  );

  -- Removed memberships remain durable history.
  removed_membership_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    removed_membership_account_id,
    'user-' || upper(substr(replace(removed_membership_account_id::text, '-', ''), 1, 7)),
    'Removed member'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (removed_membership_account_id, removed_membership_auth_user_id, 'Removed member device', 'test');
  reference_id := 'pairing-v3-member-host-' || replace(removed_membership_account_id::text, '-', '');
  insert into public.shopping_lists (id, name, owner_user_id)
  values (reference_id, 'Membership host', owner_account_id);
  insert into public.list_members (
    list_id, user_id, display_name, role, invited_by_user_id, removed_at, removed_by_user_id
  ) values (
    reference_id, removed_membership_account_id, 'Removed member', 'editor',
    owner_account_id, now(), owner_account_id
  );
  perform pg_temp.assert_pairing_account_in_use(
    'removed membership', removed_membership_auth_user_id,
    removed_membership_account_id, removed_membership_pairing
  );

  -- Pairing history would cascade on account deletion and must block cleanup.
  pairing_history_pairing := public.create_device_pairing();
  insert into public.accounts (id, username, display_name)
  values (
    pairing_history_account_id,
    'user-' || upper(substr(replace(pairing_history_account_id::text, '-', ''), 1, 7)),
    'Pairing history'
  );
  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (pairing_history_account_id, pairing_history_auth_user_id, 'Pairing history device', 'test')
  returning id into pairing_history_device_id;
  insert into public.device_pairings (
    account_id, token_hash, confirmation_code, created_by_device_id, expires_at, cancelled_at
  ) values (
    pairing_history_account_id,
    private.secret_hash('pairing-history-' || pairing_history_account_id::text),
    '0001',
    pairing_history_device_id,
    now() + interval '5 minutes',
    now()
  );
  perform pg_temp.assert_pairing_account_in_use(
    'device pairing history', pairing_history_auth_user_id,
    pairing_history_account_id, pairing_history_pairing
  );

  -- Every SET NULL attribution FK is meaningful history and blocks cleanup.
  for durable_reference in
    select refs.table_name, refs.column_name
    from (values
      ('shopping_lists', 'updated_by_user_id'),
      ('shopping_lists', 'deleted_by_user_id'),
      ('list_members', 'invited_by_user_id'),
      ('list_members', 'removed_by_user_id'),
      ('list_items', 'added_by_user_id'),
      ('list_items', 'checked_by_user_id'),
      ('list_items', 'updated_by_user_id'),
      ('list_items', 'deleted_by_user_id')
    ) as refs(table_name, column_name)
  loop
    reference_auth_user_id := gen_random_uuid();
    reference_account_id := gen_random_uuid();
    reference_id := 'pairing-v3-ref-' || replace(reference_account_id::text, '-', '');

    insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
    values (
      reference_auth_user_id,
      'authenticated',
      'authenticated',
      'pairing-v3-reference-' || reference_auth_user_id || '@example.test',
      '{}'::jsonb,
      '{}'::jsonb,
      true
    );
    insert into public.accounts (id, username, display_name)
    values (
      reference_account_id,
      'user-' || upper(substr(replace(reference_account_id::text, '-', ''), 1, 7)),
      'Durable reference'
    );
    insert into public.account_devices (account_id, auth_user_id, label, platform)
    values (reference_account_id, reference_auth_user_id, durable_reference.column_name, 'test');

    perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
    reference_pairing := public.create_device_pairing();

    if durable_reference.table_name = 'shopping_lists' then
      insert into public.shopping_lists (id, name, owner_user_id)
      values (reference_id, durable_reference.column_name, owner_account_id);
      execute format(
        'update public.shopping_lists set %I = $1 where id = $2',
        durable_reference.column_name
      ) using reference_account_id, reference_id;
    elsif durable_reference.table_name = 'list_members' then
      insert into public.shopping_lists (id, name, owner_user_id)
      values (reference_id, durable_reference.column_name, owner_account_id);
      update public.list_members
      set removed_at = now()
      where list_id = reference_id
        and user_id = owner_account_id;
      execute format(
        'update public.list_members set %I = $1 where list_id = $2 and user_id = $3',
        durable_reference.column_name
      ) using reference_account_id, reference_id, owner_account_id;
    else
      insert into public.shopping_lists (id, name, owner_user_id)
      values (reference_id, durable_reference.column_name, owner_account_id);
      insert into public.list_items (list_id, item_id, name)
      values (reference_id, durable_reference.column_name, durable_reference.column_name);
      execute format(
        'update public.list_items set %I = $1 where list_id = $2 and item_id = $3',
        durable_reference.column_name
      ) using reference_account_id, reference_id, durable_reference.column_name;
    end if;

    perform pg_temp.assert_pairing_account_in_use(
      durable_reference.table_name || '.' || durable_reference.column_name,
      reference_auth_user_id,
      reference_account_id,
      reference_pairing
    );
  end loop;

  -- Sequential competing approvals are the strongest single-session race evidence.
  perform set_config('request.jwt.claim.sub', competing_owner_auth_user_id::text, true);
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
  if request_result->>'status' is distinct from 'pending' then
    raise exception 'expected first contested request pending, got %', request_result;
  end if;
  request_result := public.request_device_pairing_v3(
    (second_owner_pairing->>'pairingId')::uuid,
    second_owner_pairing->>'pairingToken',
    'Contested device',
    'test'
  );
  if request_result->>'status' is distinct from 'pending' then
    raise exception 'expected second contested request pending, got %', request_result;
  end if;

  perform set_config('request.jwt.claim.sub', competing_owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((first_owner_pairing->>'pairingId')::uuid);
  if approval_result->>'status' is distinct from 'approved' then
    raise exception 'expected first contested approval, got %', approval_result;
  end if;

  competing_state_before := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(competing_owner_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (second_owner_pairing->>'pairingId')::uuid
    )
  );

  perform set_config('request.jwt.claim.sub', owner_auth_user_id::text, true);
  approval_result := public.approve_device_pairing_v3((second_owner_pairing->>'pairingId')::uuid);
  if approval_result->>'error' is distinct from 'account_in_use' then
    raise exception 'expected competing approval account_in_use, got %', approval_result;
  end if;

  competing_state_after := jsonb_build_object(
    'accountState', pg_temp.pairing_v3_account_state(competing_owner_account_id),
    'pairing', (
      select to_jsonb(pairings)
      from public.device_pairings pairings
      where pairings.id = (second_owner_pairing->>'pairingId')::uuid
    )
  );

  if competing_state_before is distinct from competing_state_after then
    raise exception 'competing approval changed the winning account, device, data, or rejected pairing';
  end if;
  if not exists (
    select 1
    from public.account_devices devices
    where devices.auth_user_id = contested_auth_user_id
      and devices.account_id = competing_owner_account_id
  ) then
    raise exception 'competing approval moved the contested identity';
  end if;

  approval_definition := lower(regexp_replace(
    pg_get_functiondef('public.approve_device_pairing_v3(uuid)'::regprocedure),
    '[[:space:]]+',
    ' ',
    'g'
  ));
  legacy_approval_definition := pg_get_functiondef(
    'public.approve_device_pairing(uuid)'::regprocedure
  );
  legacy_request_definition := pg_get_functiondef(
    'public.request_device_pairing(uuid,text,text,text)'::regprocedure
  );
  legacy_status_definition := pg_get_functiondef(
    'public.get_device_pairing_status(uuid)'::regprocedure
  );
  request_definition := pg_get_functiondef(
    'public.request_device_pairing_v3(uuid,text,text,text)'::regprocedure
  );
  status_definition := pg_get_functiondef(
    'public.get_device_pairing_status_v3(uuid)'::regprocedure
  );
  helper_definition := pg_get_functiondef(
    'private.device_pairing_account_blocked(uuid)'::regprocedure
  );

  if position('public.approve_device_pairing_v3' in legacy_approval_definition) = 0 then
    raise exception 'legacy approve_device_pairing does not delegate to v3';
  end if;
  if position('public.request_device_pairing_v3' in legacy_request_definition) = 0 then
    raise exception 'legacy request_device_pairing does not delegate to v3';
  end if;
  if position('public.get_device_pairing_status_v3' in legacy_status_definition) = 0 then
    raise exception 'legacy get_device_pairing_status does not delegate to v3';
  end if;
  if position('auth.uid()' in request_definition) = 0
    or position('auth.uid()' in status_definition) = 0
    or position('auth.uid()' in approval_definition) = 0 then
    raise exception 'v3 endpoints must contain explicit auth.uid() checks';
  end if;
  if position('private.device_pairing_account_blocked' in request_definition) = 0
    or position('private.device_pairing_account_blocked' in status_definition) = 0
    or position('private.device_pairing_account_blocked' in approval_definition) = 0 then
    raise exception 'request, status, and approval must share the durable-account helper';
  end if;
  if lower(helper_definition) similar to '%(insert|update|delete)[[:space:]]+%' then
    raise exception 'durable-account helper is not read-only';
  end if;
  if has_function_privilege('anon', 'private.device_pairing_account_blocked(uuid)', 'execute')
    or has_function_privilege('authenticated', 'private.device_pairing_account_blocked(uuid)', 'execute') then
    raise exception 'durable-account helper is directly executable by API roles';
  end if;
  if has_function_privilege('anon', 'public.request_device_pairing_v3(uuid,text,text,text)', 'execute')
    or has_function_privilege('anon', 'public.get_device_pairing_status_v3(uuid)', 'execute')
    or not has_function_privilege('authenticated', 'public.request_device_pairing_v3(uuid,text,text,text)', 'execute')
    or not has_function_privilege('authenticated', 'public.get_device_pairing_status_v3(uuid)', 'execute') then
    raise exception 'v3 request/status ACLs are not authenticated-only';
  end if;
  if position('pg_advisory_xact_lock' in approval_definition) = 0 then
    raise exception 'approve_device_pairing_v3 is missing pending identity serialization';
  end if;
  if position('pg_advisory_xact_lock' in approval_definition)
    > position('from public.account_devices' in approval_definition) then
    raise exception 'approve_device_pairing_v3 locks the mapping before serializing the identity';
  end if;
  initial_mapping_read := 'select devices.account_id, devices.id '
    || 'into pending_account_id, paired_device_id '
    || 'from public.account_devices devices '
    || 'where devices.auth_user_id = pairing_row.pending_auth_user_id';
  if cardinality(string_to_array(approval_definition, initial_mapping_read)) - 1 <> 2 then
    raise exception 'approve_device_pairing_v3 must have two unlocked initial mapping reads';
  end if;
  if position(initial_mapping_read || ' for update' in approval_definition) > 0 then
    raise exception 'approve_device_pairing_v3 takes a device lock during an initial mapping read';
  end if;

  foreign_account_lock_position := position(
    'from public.accounts accounts '
    || 'where accounts.id = expected_pending_account_id for update'
    in approval_definition
  );
  foreign_devices_lock_position := position(
    'from public.account_devices devices '
    || 'where devices.account_id = expected_pending_account_id '
    || 'order by devices.id for update'
    in approval_definition
  );
  foreign_mapping_reread_position := position(
    'select devices.account_id, devices.id '
    || 'into locked_pending_account_id, locked_paired_device_id '
    || 'from public.account_devices devices '
    || 'where devices.auth_user_id = pairing_row.pending_auth_user_id'
    in approval_definition
  );
  if foreign_account_lock_position = 0
    or foreign_devices_lock_position = 0
    or foreign_mapping_reread_position = 0
    or foreign_account_lock_position >= foreign_devices_lock_position
    or foreign_devices_lock_position >= foreign_mapping_reread_position then
    raise exception 'approve_device_pairing_v3 does not lock foreign account then devices before re-read';
  end if;
  if position('delete from public.account_devices' in request_definition) > 0
    or position('delete from public.accounts' in request_definition) > 0
    or position('update public.account_devices' in request_definition) > 0
    or position('update public.accounts' in request_definition) > 0
    or position('insert into public.account_devices' in request_definition) > 0
    or position('insert into public.accounts' in request_definition) > 0 then
    raise exception 'request_device_pairing_v3 contains requester account/device mutation';
  end if;
end;
$$;

rollback;
