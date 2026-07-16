begin;

create extension if not exists pgcrypto with schema extensions;

drop function if exists public.join_shopping_list(text, text, text, text);
drop function if exists public.leave_shopping_list(text);
drop function if exists public.delete_shopping_list(text);
drop function if exists public.bootstrap_account(text);
drop function if exists public.get_current_account();
drop function if exists public.update_account_profile(text, text);
drop function if exists public.touch_current_device(text, text);
drop function if exists public.list_account_devices();
drop function if exists public.rename_account_device(uuid, text);
drop function if exists public.remove_account_device(uuid);
drop function if exists public.rotate_recovery_code();
drop function if exists public.recover_account(text, text, text);
drop function if exists public.create_device_pairing();
drop function if exists public.request_device_pairing(uuid, text, text, text);
drop function if exists public.get_device_pairing_status(uuid);
drop function if exists public.approve_device_pairing(uuid);
drop function if exists public.cancel_device_pairing(uuid);

drop schema if exists private cascade;

create schema private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

drop table if exists public.device_pairings cascade;
drop table if exists public.account_recovery_attempts cascade;
drop table if exists public.account_recovery_credentials cascade;
drop table if exists public.list_items cascade;
drop table if exists public.list_members cascade;
drop table if exists public.shopping_lists cascade;
drop table if exists public.account_devices cascade;
drop table if exists public.accounts cascade;
drop table if exists public.profiles cascade;
drop table if exists public.shared_lists cascade;

delete from auth.users;

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username ~ '^user-[A-F0-9]{7}$'),
  display_name text not null check (char_length(display_name) between 1 and 24),
  avatar_url text not null default '' check (char_length(avatar_url) <= 512),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.account_devices (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  label text not null default 'Dieses Gerät' check (char_length(label) between 1 and 40),
  platform text not null default '' check (char_length(platform) <= 40),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table public.account_recovery_credentials (
  account_id uuid primary key references public.accounts(id) on delete cascade,
  code_hash bytea not null unique,
  created_at timestamptz not null default now(),
  rotated_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table public.account_recovery_attempts (
  id bigint generated always as identity primary key,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now(),
  succeeded boolean not null default false
);

create table public.device_pairings (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  token_hash bytea not null unique,
  confirmation_code text not null check (confirmation_code ~ '^[0-9]{4}$'),
  created_by_device_id uuid not null references public.account_devices(id) on delete cascade,
  pending_auth_user_id uuid references auth.users(id) on delete set null,
  pending_device_label text not null default '',
  pending_device_platform text not null default '',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  requested_at timestamptz,
  approved_at timestamptz,
  cancelled_at timestamptz
);

create table public.shopping_lists (
  id text primary key,
  name text not null default 'Dein Zettel',
  owner_user_id uuid not null references public.accounts(id) on delete cascade,
  invite_code text not null default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by_user_id uuid references public.accounts(id) on delete set null,
  deleted_at timestamptz,
  deleted_by_user_id uuid references public.accounts(id) on delete set null,
  revision integer not null default 1
);

create table public.list_members (
  list_id text not null references public.shopping_lists(id) on delete cascade,
  user_id uuid not null references public.accounts(id) on delete cascade,
  display_name text not null default 'Gast',
  avatar_url text not null default '',
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  invited_by_user_id uuid references public.accounts(id) on delete set null,
  joined_at timestamptz not null default now(),
  removed_at timestamptz,
  removed_by_user_id uuid references public.accounts(id) on delete set null,
  primary key (list_id, user_id)
);

create table public.list_items (
  list_id text not null references public.shopping_lists(id) on delete cascade,
  item_id text not null,
  product_id text,
  name text not null default '',
  shelf_id text not null default '',
  shelf_title text not null default '',
  shelf_icon text not null default '',
  quantity integer not null default 1 check (quantity between 1 and 99),
  done boolean not null default false,
  note text not null default '',
  added_by_user_id uuid references public.accounts(id) on delete set null,
  added_by_display_name text not null default 'Gast',
  added_by_avatar_url text not null default '',
  checked_by_user_id uuid references public.accounts(id) on delete set null,
  checked_at timestamptz,
  updated_by_user_id uuid references public.accounts(id) on delete set null,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by_user_id uuid references public.accounts(id) on delete set null,
  revision integer not null default 1,
  primary key (list_id, item_id)
);

comment on table public.accounts is 'Durable Zettel accounts. Authentication devices are mapped through account_devices.';
comment on table public.account_devices is 'Anonymous Supabase Auth identities authorized for one durable Zettel account.';
comment on table public.account_recovery_credentials is 'Single-use recovery secrets stored only as SHA-256 hashes.';
comment on table public.device_pairings is 'Five-minute, single-use pairing sessions for adding a device by QR code.';
comment on table public.shopping_lists is 'Canonical collaborative shopping lists owned by durable account IDs.';

create index account_devices_account_active_idx on public.account_devices(account_id, last_seen_at desc);
create index account_recovery_attempts_user_time_idx on public.account_recovery_attempts(auth_user_id, attempted_at desc);
create index device_pairings_account_time_idx on public.device_pairings(account_id, created_at desc);
create index device_pairings_created_by_device_idx on public.device_pairings(created_by_device_id);
create index device_pairings_pending_user_idx on public.device_pairings(pending_auth_user_id) where pending_auth_user_id is not null;
create index shopping_lists_owner_user_id_idx on public.shopping_lists(owner_user_id);
create index shopping_lists_updated_by_user_id_idx on public.shopping_lists(updated_by_user_id) where updated_by_user_id is not null;
create index shopping_lists_deleted_by_user_id_idx on public.shopping_lists(deleted_by_user_id) where deleted_by_user_id is not null;
create unique index shopping_lists_invite_code_idx on public.shopping_lists(invite_code);
create index shopping_lists_updated_at_idx on public.shopping_lists(updated_at desc);
create index list_members_user_id_idx on public.list_members(user_id);
create index list_members_invited_by_user_id_idx on public.list_members(invited_by_user_id) where invited_by_user_id is not null;
create index list_members_removed_by_user_id_idx on public.list_members(removed_by_user_id) where removed_by_user_id is not null;
create index list_items_list_updated_idx on public.list_items(list_id, updated_at desc);
create index list_items_added_by_user_id_idx on public.list_items(added_by_user_id) where added_by_user_id is not null;
create index list_items_checked_by_user_id_idx on public.list_items(checked_by_user_id) where checked_by_user_id is not null;
create index list_items_updated_by_user_id_idx on public.list_items(updated_by_user_id) where updated_by_user_id is not null;
create index list_items_deleted_by_user_id_idx on public.list_items(deleted_by_user_id) where deleted_by_user_id is not null;

create or replace function private.keep_newest_list_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.updated_at > new.updated_at then
    return old;
  end if;
  return new;
end;
$$;

create trigger shopping_lists_keep_newest_change
before update on public.shopping_lists
for each row execute function private.keep_newest_list_change();

create trigger list_items_keep_newest_change
before update on public.list_items
for each row execute function private.keep_newest_list_change();

alter table public.shopping_lists replica identity full;
alter table public.list_members replica identity full;
alter table public.list_items replica identity full;

alter table public.accounts enable row level security;
alter table public.account_devices enable row level security;
alter table public.account_recovery_credentials enable row level security;
alter table public.account_recovery_attempts enable row level security;
alter table public.device_pairings enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.list_members enable row level security;
alter table public.list_items enable row level security;

create function private.clean_device_label(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select left(coalesce(nullif(trim(value), ''), 'Dieses Gerät'), 40)
$$;

create function private.clean_platform(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select left(coalesce(trim(value), ''), 40)
$$;

create function private.secret_hash(value text)
returns bytea
language sql
immutable
set search_path = ''
as $$
  select extensions.digest(
    upper(regexp_replace(coalesce(value, ''), '[^a-zA-Z0-9]', '', 'g')),
    'sha256'
  )
$$;

create function private.new_username()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  candidate text;
begin
  loop
    candidate := 'user-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 7));
    exit when not exists (select 1 from public.accounts where username = candidate);
  end loop;
  return candidate;
end;
$$;

create function private.new_recovery_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  raw_code text := upper(encode(extensions.gen_random_bytes(16), 'hex'));
begin
  return 'ZTL-'
    || substr(raw_code, 1, 4) || '-'
    || substr(raw_code, 5, 4) || '-'
    || substr(raw_code, 9, 4) || '-'
    || substr(raw_code, 13, 4) || '-'
    || substr(raw_code, 17, 4) || '-'
    || substr(raw_code, 21, 4) || '-'
    || substr(raw_code, 25, 4) || '-'
    || substr(raw_code, 29, 4);
end;
$$;

create function private.new_pairing_token()
returns text
language sql
volatile
set search_path = ''
as $$
  select encode(extensions.gen_random_bytes(24), 'hex')
$$;

create function private.new_confirmation_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  bytes bytea := extensions.gen_random_bytes(2);
  number_value integer;
begin
  number_value := (get_byte(bytes, 0) * 256 + get_byte(bytes, 1)) % 10000;
  return lpad(number_value::text, 4, '0');
end;
$$;

create function private.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select devices.account_id
  from public.account_devices devices
  where devices.auth_user_id = auth.uid()
$$;

create function private.current_device_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select devices.id
  from public.account_devices devices
  where devices.auth_user_id = auth.uid()
$$;

create function private.account_has_data(target_account_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists lists
    where lists.owner_user_id = target_account_id
      and lists.deleted_at is null
  ) or exists (
    select 1
    from public.list_members members
    where members.user_id = target_account_id
      and members.removed_at is null
  )
$$;

create function private.account_json(target_account_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', accounts.id,
    'username', accounts.username,
    'displayName', accounts.display_name,
    'avatarUrl', accounts.avatar_url,
    'createdAt', accounts.created_at,
    'updatedAt', accounts.updated_at,
    'recoveryReady', exists (
      select 1
      from public.account_recovery_credentials recovery
      where recovery.account_id = accounts.id
    )
  )
  from public.accounts accounts
  where accounts.id = target_account_id
$$;

create function private.can_access_list(target_list_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists lists
    where lists.id = target_list_id
      and (
        lists.owner_user_id = private.current_account_id()
        or exists (
          select 1
          from public.list_members members
          where members.list_id = lists.id
            and members.user_id = private.current_account_id()
            and members.removed_at is null
        )
      )
  )
$$;

create function private.can_edit_list(target_list_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists lists
    left join public.list_members members
      on members.list_id = lists.id
      and members.user_id = private.current_account_id()
      and members.removed_at is null
    where lists.id = target_list_id
      and lists.deleted_at is null
      and (
        lists.owner_user_id = private.current_account_id()
        or members.role in ('owner', 'editor')
      )
  )
$$;

create function private.list_owner_id(target_list_id text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select lists.owner_user_id
  from public.shopping_lists lists
  where lists.id = target_list_id
    and lists.deleted_at is null
    and private.can_access_list(target_list_id)
$$;

revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.current_account_id() to authenticated;
grant execute on function private.current_device_id() to authenticated;
grant execute on function private.can_access_list(text) to authenticated;
grant execute on function private.can_edit_list(text) to authenticated;
grant execute on function private.list_owner_id(text) to authenticated;

create function public.bootstrap_account(device_label text default 'Dieses Gerät', device_platform text default '')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  target_account_id uuid;
  target_device_id uuid;
  generated_username text;
  clean_label text := private.clean_device_label(device_label);
  clean_platform text := private.clean_platform(device_platform);
begin
  if request_user_id is null then
    raise exception 'authentication required';
  end if;

  select devices.account_id, devices.id
  into target_account_id, target_device_id
  from public.account_devices devices
  where devices.auth_user_id = request_user_id;

  if target_account_id is null then
    loop
      generated_username := private.new_username();
      begin
        insert into public.accounts (username, display_name)
        values (generated_username, generated_username)
        returning id into target_account_id;
        exit;
      exception when unique_violation then
        null;
      end;
    end loop;

    insert into public.account_devices (account_id, auth_user_id, label, platform)
    values (target_account_id, request_user_id, clean_label, clean_platform)
    returning id into target_device_id;
  else
    update public.account_devices
    set label = clean_label,
        platform = case when clean_platform = '' then platform else clean_platform end,
        last_seen_at = now()
    where id = target_device_id;
  end if;

  return private.account_json(target_account_id) || jsonb_build_object(
    'authUserId', request_user_id,
    'deviceId', target_device_id,
    'deviceLabel', clean_label
  );
end;
$$;

create function public.get_current_account()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_account_id uuid := private.current_account_id();
  target_device_id uuid := private.current_device_id();
begin
  if target_account_id is null then
    return null;
  end if;
  return private.account_json(target_account_id) || jsonb_build_object(
    'authUserId', auth.uid(),
    'deviceId', target_device_id
  );
end;
$$;

create function public.update_account_profile(display_name text, avatar_url text default '')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_account_id uuid := private.current_account_id();
  clean_name text := left(coalesce(nullif(trim(display_name), ''), 'Nutzer'), 24);
  clean_avatar text := left(coalesce(trim(avatar_url), ''), 512);
begin
  if target_account_id is null then
    raise exception 'account required';
  end if;

  update public.accounts
  set display_name = clean_name,
      avatar_url = clean_avatar,
      updated_at = now()
  where id = target_account_id;

  update public.list_members
  set display_name = clean_name,
      avatar_url = clean_avatar
  where user_id = target_account_id
    and removed_at is null;

  update public.list_items
  set added_by_display_name = clean_name,
      added_by_avatar_url = clean_avatar
  where added_by_user_id = target_account_id;

  return private.account_json(target_account_id);
end;
$$;

create function public.touch_current_device(device_label text default null, device_platform text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_device_id uuid := private.current_device_id();
begin
  if target_device_id is null then
    raise exception 'device required';
  end if;

  update public.account_devices
  set label = case when device_label is null then label else private.clean_device_label(device_label) end,
      platform = case when device_platform is null then platform else private.clean_platform(device_platform) end,
      last_seen_at = now()
  where id = target_device_id;

  return jsonb_build_object('ok', true, 'deviceId', target_device_id);
end;
$$;

create function public.list_account_devices()
returns table (
  device_id uuid,
  label text,
  platform text,
  created_at timestamptz,
  last_seen_at timestamptz,
  is_current boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    devices.id,
    devices.label,
    devices.platform,
    devices.created_at,
    devices.last_seen_at,
    devices.auth_user_id = auth.uid()
  from public.account_devices devices
  where devices.account_id = private.current_account_id()
  order by (devices.auth_user_id = auth.uid()) desc, devices.last_seen_at desc
$$;

create function public.rename_account_device(target_device_id uuid, device_label text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.account_devices
  set label = private.clean_device_label(device_label),
      last_seen_at = case when auth_user_id = auth.uid() then now() else last_seen_at end
  where id = target_device_id
    and account_id = private.current_account_id();

  if not found then
    raise exception 'device not found';
  end if;
  return jsonb_build_object('ok', true, 'deviceId', target_device_id);
end;
$$;

create function public.remove_account_device(target_device_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_auth_user_id uuid;
begin
  select devices.auth_user_id
  into target_auth_user_id
  from public.account_devices devices
  where devices.id = target_device_id
    and devices.account_id = private.current_account_id();

  if target_auth_user_id is null then
    raise exception 'device not found';
  end if;
  if target_auth_user_id = auth.uid() then
    raise exception 'current device cannot be removed here';
  end if;

  delete from public.account_devices where id = target_device_id;
  delete from auth.users where id = target_auth_user_id;
  return jsonb_build_object('ok', true, 'deviceId', target_device_id);
end;
$$;

create function public.rotate_recovery_code()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_account_id uuid := private.current_account_id();
  recovery_code text := private.new_recovery_code();
begin
  if target_account_id is null then
    raise exception 'account required';
  end if;

  insert into public.account_recovery_credentials (account_id, code_hash)
  values (target_account_id, private.secret_hash(recovery_code))
  on conflict (account_id) do update
  set code_hash = excluded.code_hash,
      rotated_at = now(),
      last_used_at = null;

  return private.account_json(target_account_id) || jsonb_build_object('recoveryCode', recovery_code);
end;
$$;

create function public.recover_account(recovery_code text, device_label text default 'Dieses Gerät', device_platform text default '')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  current_account_id uuid := private.current_account_id();
  target_account_id uuid;
  current_device_id uuid := private.current_device_id();
  replacement_code text;
  recent_attempts integer;
begin
  if request_user_id is null or current_account_id is null or current_device_id is null then
    return jsonb_build_object('ok', false, 'error', 'device_required');
  end if;

  delete from public.account_recovery_attempts
  where attempted_at < now() - interval '24 hours';

  select count(*)::integer
  into recent_attempts
  from public.account_recovery_attempts
  where auth_user_id = request_user_id
    and attempted_at > now() - interval '1 hour';

  if recent_attempts >= 8 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  insert into public.account_recovery_attempts (auth_user_id)
  values (request_user_id);

  select credentials.account_id
  into target_account_id
  from public.account_recovery_credentials credentials
  where credentials.code_hash = private.secret_hash(recovery_code)
  for update;

  if target_account_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_code');
  end if;

  if current_account_id <> target_account_id then
    if private.account_has_data(current_account_id) then
      return jsonb_build_object('ok', false, 'error', 'current_account_not_empty');
    end if;
    if (select count(*) from public.account_devices where account_id = current_account_id) <> 1 then
      return jsonb_build_object('ok', false, 'error', 'current_account_not_empty');
    end if;

    update public.account_devices
    set account_id = target_account_id,
        label = private.clean_device_label(device_label),
        platform = private.clean_platform(device_platform),
        last_seen_at = now()
    where id = current_device_id;

    delete from public.accounts where id = current_account_id;
  end if;

  replacement_code := private.new_recovery_code();
  update public.account_recovery_credentials
  set code_hash = private.secret_hash(replacement_code),
      rotated_at = now(),
      last_used_at = now()
  where account_id = target_account_id;

  update public.account_recovery_attempts
  set succeeded = true
  where id = (
    select attempts.id
    from public.account_recovery_attempts attempts
    where attempts.auth_user_id = request_user_id
    order by attempts.id desc
    limit 1
  );

  return jsonb_build_object('ok', true)
    || private.account_json(target_account_id)
    || jsonb_build_object('recoveryCode', replacement_code);
end;
$$;

create function public.create_device_pairing()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_account_id uuid := private.current_account_id();
  target_device_id uuid := private.current_device_id();
  pairing_id uuid;
  pairing_token text := private.new_pairing_token();
  confirmation_code text := private.new_confirmation_code();
  expiry timestamptz := now() + interval '5 minutes';
begin
  if target_account_id is null or target_device_id is null then
    raise exception 'device required';
  end if;

  update public.device_pairings
  set cancelled_at = now()
  where created_by_device_id = target_device_id
    and approved_at is null
    and cancelled_at is null
    and expires_at > now();

  insert into public.device_pairings (
    account_id,
    token_hash,
    confirmation_code,
    created_by_device_id,
    expires_at
  )
  values (
    target_account_id,
    private.secret_hash(pairing_token),
    confirmation_code,
    target_device_id,
    expiry
  )
  returning id into pairing_id;

  return jsonb_build_object(
    'ok', true,
    'pairingId', pairing_id,
    'pairingToken', pairing_token,
    'confirmationCode', confirmation_code,
    'expiresAt', expiry
  );
end;
$$;

create function public.request_device_pairing(
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
  if request_user_id is null or current_account_id is null then
    return jsonb_build_object('ok', false, 'error', 'device_required');
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

  if pairing_row.account_id = current_account_id then
    return jsonb_build_object('ok', false, 'error', 'already_connected');
  end if;
  if private.account_has_data(current_account_id)
    or (select count(*) from public.account_devices where account_id = current_account_id) <> 1 then
    return jsonb_build_object('ok', false, 'error', 'current_account_not_empty');
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

create function public.get_device_pairing_status(target_pairing_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  pairing_row public.device_pairings%rowtype;
  status_value text;
begin
  select *
  into pairing_row
  from public.device_pairings pairings
  where pairings.id = target_pairing_id;

  if pairing_row.id is null then
    return jsonb_build_object('ok', false, 'error', 'pairing_not_found');
  end if;
  if private.current_account_id() <> pairing_row.account_id
    and auth.uid() is distinct from pairing_row.pending_auth_user_id then
    return jsonb_build_object('ok', false, 'error', 'pairing_not_found');
  end if;

  status_value := case
    when pairing_row.cancelled_at is not null then 'cancelled'
    when pairing_row.approved_at is not null then 'approved'
    when pairing_row.expires_at <= now() then 'expired'
    when pairing_row.pending_auth_user_id is not null then 'pending'
    else 'waiting'
  end;

  return jsonb_build_object(
    'ok', true,
    'pairingId', pairing_row.id,
    'status', status_value,
    'confirmationCode', pairing_row.confirmation_code,
    'pendingDeviceLabel', pairing_row.pending_device_label,
    'expiresAt', pairing_row.expires_at
  );
end;
$$;

create function public.approve_device_pairing(target_pairing_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  pairing_row public.device_pairings%rowtype;
  pending_account_id uuid;
  pending_device_id uuid;
begin
  select *
  into pairing_row
  from public.device_pairings pairings
  where pairings.id = target_pairing_id
  for update;

  if pairing_row.id is null
    or pairing_row.account_id <> private.current_account_id()
    or pairing_row.pending_auth_user_id is null
    or pairing_row.cancelled_at is not null
    or pairing_row.approved_at is not null
    or pairing_row.expires_at <= now() then
    return jsonb_build_object('ok', false, 'error', 'pairing_not_ready');
  end if;

  select devices.account_id, devices.id
  into pending_account_id, pending_device_id
  from public.account_devices devices
  where devices.auth_user_id = pairing_row.pending_auth_user_id
  for update;

  if pending_account_id is null
    or private.account_has_data(pending_account_id)
    or (select count(*) from public.account_devices where account_id = pending_account_id) <> 1 then
    return jsonb_build_object('ok', false, 'error', 'pending_account_not_empty');
  end if;

  update public.account_devices
  set account_id = pairing_row.account_id,
      label = private.clean_device_label(pairing_row.pending_device_label),
      platform = private.clean_platform(pairing_row.pending_device_platform),
      last_seen_at = now()
  where id = pending_device_id;

  delete from public.accounts where id = pending_account_id;

  update public.device_pairings
  set approved_at = now()
  where id = target_pairing_id;

  return jsonb_build_object('ok', true, 'pairingId', target_pairing_id, 'status', 'approved');
end;
$$;

create function public.cancel_device_pairing(target_pairing_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.device_pairings
  set cancelled_at = now()
  where id = target_pairing_id
    and account_id = private.current_account_id()
    and approved_at is null;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'pairing_not_found');
  end if;
  return jsonb_build_object('ok', true, 'pairingId', target_pairing_id, 'status', 'cancelled');
end;
$$;

create function public.join_shopping_list(
  target_list_id text,
  target_invite_code text,
  display_name text default 'Gast',
  avatar_url text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_account_id uuid := private.current_account_id();
  owner_account_id uuid;
  clean_name text := left(coalesce(nullif(trim(display_name), ''), 'Gast'), 24);
  clean_avatar text := left(coalesce(avatar_url, ''), 512);
begin
  if request_account_id is null then
    raise exception 'account required';
  end if;

  select lists.owner_user_id
  into owner_account_id
  from public.shopping_lists lists
  where lists.id = target_list_id
    and lists.invite_code = target_invite_code
    and lists.deleted_at is null;

  if owner_account_id is null then
    raise exception 'invalid invite';
  end if;

  insert into public.list_members (
    list_id, user_id, display_name, avatar_url, role,
    invited_by_user_id, joined_at, removed_at, removed_by_user_id
  )
  values (
    target_list_id, request_account_id, clean_name, clean_avatar, 'editor',
    owner_account_id, now(), null, null
  )
  on conflict (list_id, user_id) do update
  set display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      role = case when public.list_members.role = 'owner' then 'owner' else 'editor' end,
      removed_at = null,
      removed_by_user_id = null;

  update public.shopping_lists
  set updated_at = now(), updated_by_user_id = request_account_id, revision = revision + 1
  where id = target_list_id;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

create function public.leave_shopping_list(target_list_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_account_id uuid := private.current_account_id();
begin
  if request_account_id is null then
    raise exception 'account required';
  end if;
  if (select owner_user_id from public.shopping_lists where id = target_list_id) = request_account_id then
    raise exception 'owner cannot leave list';
  end if;

  update public.list_members
  set removed_at = now(), removed_by_user_id = request_account_id
  where list_id = target_list_id
    and user_id = request_account_id
    and removed_at is null;

  if not found then
    raise exception 'membership not found';
  end if;

  update public.shopping_lists
  set updated_at = now(), updated_by_user_id = request_account_id, revision = revision + 1
  where id = target_list_id;
  return jsonb_build_object('listId', target_list_id);
end;
$$;

create function public.delete_shopping_list(target_list_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_account_id uuid := private.current_account_id();
begin
  update public.shopping_lists
  set deleted_at = now(),
      deleted_by_user_id = request_account_id,
      updated_at = now(),
      updated_by_user_id = request_account_id,
      revision = revision + 1
  where id = target_list_id
    and owner_user_id = request_account_id
    and deleted_at is null;

  if not found then
    raise exception 'not list owner';
  end if;
  return jsonb_build_object('listId', target_list_id);
end;
$$;

revoke all on function public.bootstrap_account(text, text) from public, anon;
revoke all on function public.get_current_account() from public, anon;
revoke all on function public.update_account_profile(text, text) from public, anon;
revoke all on function public.touch_current_device(text, text) from public, anon;
revoke all on function public.list_account_devices() from public, anon;
revoke all on function public.rename_account_device(uuid, text) from public, anon;
revoke all on function public.remove_account_device(uuid) from public, anon;
revoke all on function public.rotate_recovery_code() from public, anon;
revoke all on function public.recover_account(text, text, text) from public, anon;
revoke all on function public.create_device_pairing() from public, anon;
revoke all on function public.request_device_pairing(uuid, text, text, text) from public, anon;
revoke all on function public.get_device_pairing_status(uuid) from public, anon;
revoke all on function public.approve_device_pairing(uuid) from public, anon;
revoke all on function public.cancel_device_pairing(uuid) from public, anon;
revoke all on function public.join_shopping_list(text, text, text, text) from public, anon;
revoke all on function public.leave_shopping_list(text) from public, anon;
revoke all on function public.delete_shopping_list(text) from public, anon;

grant execute on function public.bootstrap_account(text, text) to authenticated;
grant execute on function public.get_current_account() to authenticated;
grant execute on function public.update_account_profile(text, text) to authenticated;
grant execute on function public.touch_current_device(text, text) to authenticated;
grant execute on function public.list_account_devices() to authenticated;
grant execute on function public.rename_account_device(uuid, text) to authenticated;
grant execute on function public.remove_account_device(uuid) to authenticated;
grant execute on function public.rotate_recovery_code() to authenticated;
grant execute on function public.recover_account(text, text, text) to authenticated;
grant execute on function public.create_device_pairing() to authenticated;
grant execute on function public.request_device_pairing(uuid, text, text, text) to authenticated;
grant execute on function public.get_device_pairing_status(uuid) to authenticated;
grant execute on function public.approve_device_pairing(uuid) to authenticated;
grant execute on function public.cancel_device_pairing(uuid) to authenticated;
grant execute on function public.join_shopping_list(text, text, text, text) to authenticated;
grant execute on function public.leave_shopping_list(text) to authenticated;
grant execute on function public.delete_shopping_list(text) to authenticated;

grant usage on schema public to authenticated;
revoke all on public.accounts from public, anon, authenticated;
revoke all on public.account_devices from public, anon, authenticated;
grant select, insert, update, delete on public.shopping_lists to authenticated;
grant select, insert, update, delete on public.list_members to authenticated;
grant select, insert, update, delete on public.list_items to authenticated;
revoke all on public.account_recovery_credentials from public, anon, authenticated;
revoke all on public.account_recovery_attempts from public, anon, authenticated;
revoke all on public.device_pairings from public, anon, authenticated;

create policy "accounts read their lists"
on public.shopping_lists
for select
to authenticated
using (private.can_access_list(id));

create policy "accounts create owned lists"
on public.shopping_lists
for insert
to authenticated
with check (owner_user_id = (select private.current_account_id()));

create policy "editors update lists"
on public.shopping_lists
for update
to authenticated
using (private.can_edit_list(id))
with check (
  private.can_edit_list(id)
  and owner_user_id = private.list_owner_id(id)
);

create policy "owners delete lists"
on public.shopping_lists
for delete
to authenticated
using (owner_user_id = (select private.current_account_id()));

create policy "members read list members"
on public.list_members
for select
to authenticated
using (private.can_access_list(list_id));

create policy "owners add list members"
on public.list_members
for insert
to authenticated
with check (
  private.list_owner_id(list_id) = (select private.current_account_id())
  and (role <> 'owner' or user_id = private.list_owner_id(list_id))
);

create policy "owners update list members"
on public.list_members
for update
to authenticated
using (private.list_owner_id(list_id) = (select private.current_account_id()))
with check (
  private.list_owner_id(list_id) = (select private.current_account_id())
  and (role <> 'owner' or user_id = private.list_owner_id(list_id))
);

create policy "owners remove list members"
on public.list_members
for delete
to authenticated
using (private.list_owner_id(list_id) = (select private.current_account_id()));

create policy "members read list items"
on public.list_items
for select
to authenticated
using (private.can_access_list(list_id));

create policy "editors add list items"
on public.list_items
for insert
to authenticated
with check (private.can_edit_list(list_id));

create policy "editors update list items"
on public.list_items
for update
to authenticated
using (private.can_edit_list(list_id))
with check (private.can_edit_list(list_id));

create policy "editors delete list items"
on public.list_items
for delete
to authenticated
using (private.can_edit_list(list_id));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shopping_lists'
  ) then
    alter publication supabase_realtime add table public.shopping_lists;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'list_members'
  ) then
    alter publication supabase_realtime add table public.list_members;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'list_items'
  ) then
    alter publication supabase_realtime add table public.list_items;
  end if;
end;
$$;

commit;
