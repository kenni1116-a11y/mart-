create or replace function public.request_device_pairing_v3(
  target_pairing_id uuid,
  pairing_token text,
  device_label text default 'Dieses Gerät',
  device_platform text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  current_account_id uuid := private.current_account_id();
  pairing_row public.device_pairings%rowtype;
begin
  if request_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'authentication_required');
  end if;

  select *
  into pairing_row
  from public.device_pairings pairings
  where pairings.id = target_pairing_id
    and pairings.token_hash = private.secret_hash(pairing_token)
  for update;

  if pairing_row.id is null
    or pairing_row.cancelled_at is not null
    or pairing_row.approved_at is not null
    or pairing_row.expires_at <= now() then
    return jsonb_build_object('ok', false, 'error', 'invalid_pairing');
  end if;

  if current_account_id = pairing_row.account_id then
    return jsonb_build_object('ok', false, 'error', 'already_connected');
  end if;

  if pairing_row.pending_auth_user_id is not null
    and pairing_row.pending_auth_user_id <> request_user_id then
    return jsonb_build_object('ok', false, 'error', 'pairing_in_use');
  end if;

  update public.device_pairings
  set pending_auth_user_id = request_user_id,
      pending_device_label = private.clean_device_label(device_label),
      pending_device_platform = private.clean_platform(device_platform),
      requested_at = now()
  where id = target_pairing_id;

  return jsonb_build_object(
    'ok', true,
    'pairingId', target_pairing_id,
    'status', 'pending',
    'confirmationCode', pairing_row.confirmation_code,
    'expiresAt', pairing_row.expires_at
  );
end;
$$;

create or replace function public.approve_device_pairing_v3(target_pairing_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  owner_account_id uuid;
  pairing_row public.device_pairings%rowtype;
  pending_account_id uuid;
  paired_device_id uuid;
  pending_device_count integer;
  removed_account_id uuid;
begin
  if request_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'authentication_required');
  end if;

  select *
  into pairing_row
  from public.device_pairings pairings
  where pairings.id = target_pairing_id
  for update;

  owner_account_id := private.current_account_id();

  if pairing_row.id is null
    or pairing_row.account_id is distinct from owner_account_id
    or pairing_row.pending_auth_user_id is null
    or pairing_row.cancelled_at is not null
    or pairing_row.approved_at is not null
    or pairing_row.expires_at <= now() then
    return jsonb_build_object('ok', false, 'error', 'pairing_not_ready');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(pairing_row.pending_auth_user_id::text, 0)
  );

  select devices.account_id, devices.id
  into pending_account_id, paired_device_id
  from public.account_devices devices
  where devices.auth_user_id = pairing_row.pending_auth_user_id
  for update;

  if paired_device_id is null then
    insert into public.account_devices (account_id, auth_user_id, label, platform)
    values (
      pairing_row.account_id,
      pairing_row.pending_auth_user_id,
      private.clean_device_label(pairing_row.pending_device_label),
      private.clean_platform(pairing_row.pending_device_platform)
    )
    on conflict (auth_user_id) do nothing
    returning id into paired_device_id;

    if paired_device_id is not null then
      pending_account_id := pairing_row.account_id;
    else
      select devices.account_id, devices.id
      into pending_account_id, paired_device_id
      from public.account_devices devices
      where devices.auth_user_id = pairing_row.pending_auth_user_id
      for update;
    end if;
  end if;

  if pending_account_id is not null
    and pending_account_id <> pairing_row.account_id then
    perform accounts.id
    from public.accounts accounts
    where accounts.id = pending_account_id
    for update;

    if not found then
      return jsonb_build_object('ok', false, 'error', 'account_in_use');
    end if;

    perform devices.id
    from public.account_devices devices
    where devices.account_id = pending_account_id
    order by devices.id
    for update;

    select devices.account_id, devices.id
    into pending_account_id, paired_device_id
    from public.account_devices devices
    where devices.auth_user_id = pairing_row.pending_auth_user_id
    for update;

    select count(*)::integer
    into pending_device_count
    from public.account_devices devices
    where devices.account_id = pending_account_id;

    if pending_account_id is null
      or pending_account_id = pairing_row.account_id
      or pending_device_count <> 1
      or exists (
        select 1
        from public.account_recovery_credentials recovery
        where recovery.account_id = pending_account_id
      )
      or exists (
        select 1
        from public.device_pairings pairings
        where pairings.account_id = pending_account_id
      )
      or exists (
        select 1
        from public.shopping_lists lists
        where lists.owner_user_id = pending_account_id
          or lists.updated_by_user_id = pending_account_id
          or lists.deleted_by_user_id = pending_account_id
      )
      or exists (
        select 1
        from public.list_members members
        where members.user_id = pending_account_id
          or members.invited_by_user_id = pending_account_id
          or members.removed_by_user_id = pending_account_id
      )
      or exists (
        select 1
        from public.list_items items
        where items.added_by_user_id = pending_account_id
          or items.checked_by_user_id = pending_account_id
          or items.updated_by_user_id = pending_account_id
          or items.deleted_by_user_id = pending_account_id
      ) then
      return jsonb_build_object('ok', false, 'error', 'account_in_use');
    end if;

    update public.account_devices devices
    set account_id = pairing_row.account_id,
        label = private.clean_device_label(pairing_row.pending_device_label),
        platform = private.clean_platform(pairing_row.pending_device_platform),
        last_seen_at = now()
    where devices.id = paired_device_id
      and devices.account_id = pending_account_id
      and devices.auth_user_id = pairing_row.pending_auth_user_id
    returning devices.id into paired_device_id;

    if paired_device_id is null then
      raise exception 'pairing transition device changed during approval';
    end if;

    delete from public.accounts accounts
    where accounts.id = pending_account_id
      and not exists (
        select 1
        from public.account_devices devices
        where devices.account_id = accounts.id
      )
      and not exists (
        select 1
        from public.account_recovery_credentials recovery
        where recovery.account_id = accounts.id
      )
      and not exists (
        select 1
        from public.device_pairings pairings
        where pairings.account_id = accounts.id
      )
      and not exists (
        select 1
        from public.shopping_lists lists
        where lists.owner_user_id = accounts.id
          or lists.updated_by_user_id = accounts.id
          or lists.deleted_by_user_id = accounts.id
      )
      and not exists (
        select 1
        from public.list_members members
        where members.user_id = accounts.id
          or members.invited_by_user_id = accounts.id
          or members.removed_by_user_id = accounts.id
      )
      and not exists (
        select 1
        from public.list_items items
        where items.added_by_user_id = accounts.id
          or items.checked_by_user_id = accounts.id
          or items.updated_by_user_id = accounts.id
          or items.deleted_by_user_id = accounts.id
      )
    returning accounts.id into removed_account_id;

    if removed_account_id is null then
      raise exception 'pairing transition account changed during approval';
    end if;

    pending_account_id := pairing_row.account_id;
  end if;

  update public.account_devices devices
  set label = private.clean_device_label(pairing_row.pending_device_label),
      platform = private.clean_platform(pairing_row.pending_device_platform),
      last_seen_at = now()
  where devices.id = paired_device_id
    and devices.account_id = pairing_row.account_id
    and devices.auth_user_id = pairing_row.pending_auth_user_id
  returning devices.id into paired_device_id;

  if paired_device_id is null then
    return jsonb_build_object('ok', false, 'error', 'account_in_use');
  end if;

  update public.device_pairings
  set approved_at = now()
  where id = target_pairing_id;

  return jsonb_build_object(
    'ok', true,
    'pairingId', target_pairing_id,
    'deviceId', paired_device_id,
    'status', 'approved'
  );
end;
$$;

create or replace function public.approve_device_pairing(target_pairing_id uuid)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select public.approve_device_pairing_v3(target_pairing_id)
$$;

revoke all on function public.request_device_pairing_v3(uuid, text, text, text) from public, anon;
revoke all on function public.approve_device_pairing_v3(uuid) from public, anon;
revoke all on function public.approve_device_pairing(uuid) from public, anon;

grant execute on function public.request_device_pairing_v3(uuid, text, text, text) to authenticated;
grant execute on function public.approve_device_pairing_v3(uuid) to authenticated;
grant execute on function public.approve_device_pairing(uuid) to authenticated;
