begin;

do $$
declare
  account_id constant uuid := 'a8100000-0000-4000-8000-000000000001';
  auth_user_id constant uuid := 'a8100000-0000-4000-8000-000000000002';
begin
  if not private.is_account_avatar_path(
    account_id::text || '/avatar-' || auth_user_id::text || '-a.webp',
    account_id,
    auth_user_id
  ) then
    raise exception 'the exact current-device avatar path was rejected';
  end if;

  if private.is_account_avatar_path(
    account_id::text || '/nested/avatar-' || auth_user_id::text || '-a.webp',
    account_id,
    auth_user_id
  ) then
    raise exception 'a nested avatar path bypassed the exact-path policy';
  end if;

  if private.is_account_avatar_path(
    account_id::text || '/avatar-' || 'a8100000-0000-4000-8000-000000000003' || '-b.webp',
    account_id,
    auth_user_id
  ) then
    raise exception 'an upload path for another device was accepted';
  end if;

  if not private.is_account_avatar_path(
    account_id::text || '/avatar-' || 'a8100000-0000-4000-8000-000000000003' || '-b.webp',
    account_id,
    null
  ) then
    raise exception 'account-wide cleanup cannot address another valid device slot';
  end if;

  if to_regprocedure('public.update_account_profile(text,text)') is not null then
    raise exception 'the unsafe combined profile RPC remains installed';
  end if;
  if to_regprocedure('public.update_account_display_name(text)') is null
    or not has_function_privilege('authenticated', 'public.update_account_display_name(text)', 'EXECUTE') then
    raise exception 'the atomic display-name RPC is missing';
  end if;
  if to_regprocedure('public.update_account_avatar(text)') is null
    or not has_function_privilege('authenticated', 'public.update_account_avatar(text)', 'EXECUTE') then
    raise exception 'the atomic avatar RPC is missing';
  end if;
end;
$$;

rollback;
