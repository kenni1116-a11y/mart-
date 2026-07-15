begin;

do $$
<<list_ownership_v3>>
declare
  owner_account_id constant uuid := 'e7000000-0000-4000-8000-000000000001';
  target_account_id constant uuid := 'e7000000-0000-4000-8000-000000000002';
  outsider_account_id constant uuid := 'e7000000-0000-4000-8000-000000000003';
  owner_auth_id constant uuid := 'e7000000-0000-4000-8000-000000000101';
  target_auth_id constant uuid := 'e7000000-0000-4000-8000-000000000102';
  outsider_auth_id constant uuid := 'e7000000-0000-4000-8000-000000000103';
  list_id constant text := 'ownership-v3-fixture';
  result jsonb;
begin
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values
    (owner_auth_id, 'authenticated', 'authenticated', 'ownership-owner@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (target_auth_id, 'authenticated', 'authenticated', 'ownership-target@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (outsider_auth_id, 'authenticated', 'authenticated', 'ownership-outsider@example.test', '{}'::jsonb, '{}'::jsonb, true);

  insert into public.accounts (id, username, display_name)
  values
    (owner_account_id, 'user-E700001', 'Ownership Owner'),
    (target_account_id, 'user-E700002', 'Ownership Target'),
    (outsider_account_id, 'user-E700003', 'Ownership Outsider');

  insert into public.account_devices (account_id, auth_user_id, label, platform)
  values
    (owner_account_id, owner_auth_id, 'Owner fixture', 'test'),
    (target_account_id, target_auth_id, 'Target fixture', 'test'),
    (outsider_account_id, outsider_auth_id, 'Outsider fixture', 'test');

  insert into public.shopping_lists (id, name, owner_user_id)
  values (list_id, 'Ownership fixture', owner_account_id);

  insert into public.list_members (list_id, user_id, display_name, role)
  values (list_id, target_account_id, 'Ownership Target', 'editor');

  perform set_config('request.jwt.claim.sub', outsider_auth_id::text, true);
  result := public.transfer_list_ownership_v3(list_id, target_account_id);
  if result ->> 'error' <> 'forbidden' then
    raise exception 'outsider transfer was not rejected: %', result;
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_id::text, true);
  result := public.transfer_list_ownership_v3(list_id, target_account_id);
  if result ->> 'ok' <> 'true' or result ->> 'ownerId' <> target_account_id::text then
    raise exception 'owner transfer failed: %', result;
  end if;
  if (select owner_user_id from public.shopping_lists where id = list_ownership_v3.list_id) <> target_account_id then
    raise exception 'shopping list owner was not updated';
  end if;
  if (select members.role from public.list_members members where members.list_id = list_ownership_v3.list_id and members.user_id = owner_account_id) <> 'editor' then
    raise exception 'previous owner was not demoted to editor';
  end if;
  if (select members.role from public.list_members members where members.list_id = list_ownership_v3.list_id and members.user_id = target_account_id) <> 'owner' then
    raise exception 'target member was not promoted to owner';
  end if;

  result := public.transfer_list_ownership_v3(list_id, outsider_account_id);
  if result ->> 'error' <> 'forbidden' then
    raise exception 'former owner retained transfer authority: %', result;
  end if;
end;
$$;

rollback;
