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
  current_device_id uuid := private.current_device_id();
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

  if current_account_id is not null
    and (
      private.account_has_data(current_account_id)
      or (select count(*) from public.account_devices where account_id = current_account_id) <> 1
    ) then
    return jsonb_build_object('ok', false, 'error', 'account_in_use');
  end if;

  if current_device_id is not null then
    delete from public.account_devices
    where id = current_device_id;

    delete from public.accounts accounts
    where accounts.id = current_account_id
      and not exists (
        select 1
        from public.account_devices devices
        where devices.account_id = accounts.id
      )
      and not private.account_has_data(accounts.id);
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
  current_account_id uuid := private.current_account_id();
  pairing_row public.device_pairings%rowtype;
  pending_account_id uuid;
  paired_device_id uuid;
begin
  if request_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'authentication_required');
  end if;

  select *
  into pairing_row
  from public.device_pairings pairings
  where pairings.id = target_pairing_id
  for update;

  if pairing_row.id is null
    or pairing_row.account_id is distinct from current_account_id
    or pairing_row.pending_auth_user_id is null
    or pairing_row.cancelled_at is not null
    or pairing_row.approved_at is not null
    or pairing_row.expires_at <= now() then
    return jsonb_build_object('ok', false, 'error', 'pairing_not_ready');
  end if;

  select devices.account_id
  into pending_account_id
  from public.account_devices devices
  where devices.auth_user_id = pairing_row.pending_auth_user_id
  for update;

  if pending_account_id is not null
    and pending_account_id <> pairing_row.account_id then
    return jsonb_build_object('ok', false, 'error', 'account_in_use');
  end if;

  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values (
    pairing_row.account_id,
    pairing_row.pending_auth_user_id,
    private.clean_device_label(pairing_row.pending_device_label),
    private.clean_platform(pairing_row.pending_device_platform)
  )
  on conflict (auth_user_id) do update
  set account_id = excluded.account_id,
      label = excluded.label,
      platform = excluded.platform,
      last_seen_at = now()
  returning id into paired_device_id;

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

revoke all on function public.request_device_pairing_v3(uuid, text, text, text) from public, anon;
revoke all on function public.approve_device_pairing_v3(uuid) from public, anon;

grant execute on function public.request_device_pairing_v3(uuid, text, text, text) to authenticated;
grant execute on function public.approve_device_pairing_v3(uuid) to authenticated;
