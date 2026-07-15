begin;

do $$
<<list_mutations_v3>>
declare
  owner_account_id constant uuid := 'e6000000-0000-4000-8000-000000000001';
  editor_account_id constant uuid := 'e6000000-0000-4000-8000-000000000002';
  owner_auth_id constant uuid := 'e6000000-0000-4000-8000-000000000101';
  editor_auth_id constant uuid := 'e6000000-0000-4000-8000-000000000102';
  owner_device_id constant uuid := 'e6000000-0000-4000-8000-000000000201';
  editor_device_id constant uuid := 'e6000000-0000-4000-8000-000000000202';
  list_id constant text := 'mutation-v3-main-fixture';
  created_list_id constant text := 'mutation-v3-created-fixture';
  op_item_a constant uuid := 'e6100000-0000-4000-8000-000000000001';
  op_item_b constant uuid := 'e6100000-0000-4000-8000-000000000002';
  op_item_a_later constant uuid := 'e6100000-0000-4000-8000-000000000003';
  op_item_a_delete constant uuid := 'e6100000-0000-4000-8000-000000000004';
  op_create_list constant uuid := 'e6100000-0000-4000-8000-000000000005';
  op_rename_list constant uuid := 'e6100000-0000-4000-8000-000000000006';
  op_leave_list constant uuid := 'e6100000-0000-4000-8000-000000000007';
  op_removed_edit constant uuid := 'e6100000-0000-4000-8000-000000000008';
  op_delete_list constant uuid := 'e6100000-0000-4000-8000-000000000009';
  op_invalid_quantity constant uuid := 'e6100000-0000-4000-8000-000000000010';
  first_result jsonb;
  replay_result jsonb;
  result jsonb;
  revision_before integer;
  revision_after integer;
begin
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, is_anonymous)
  values
    (owner_auth_id, 'authenticated', 'authenticated', 'mutation-v3-owner@example.test', '{}'::jsonb, '{}'::jsonb, true),
    (editor_auth_id, 'authenticated', 'authenticated', 'mutation-v3-editor@example.test', '{}'::jsonb, '{}'::jsonb, true);

  insert into public.accounts (id, username, display_name)
  values
    (owner_account_id, 'user-E600001', 'Mutation Owner'),
    (editor_account_id, 'user-E600002', 'Mutation Editor');

  insert into public.account_devices (id, account_id, auth_user_id, label, platform)
  values
    (owner_device_id, owner_account_id, owner_auth_id, 'Owner fixture', 'test'),
    (editor_device_id, editor_account_id, editor_auth_id, 'Editor fixture', 'test');

  insert into public.shopping_lists (id, name, owner_user_id)
  values (list_id, 'Mutation fixture', owner_account_id);

  insert into public.list_members (list_id, user_id, display_name, role)
  values
    (list_id, owner_account_id, 'Mutation Owner', 'owner'),
    (list_id, editor_account_id, 'Mutation Editor', 'editor');

  perform set_config('request.jwt.claim.sub', owner_auth_id::text, true);

  first_result := public.apply_list_mutation_v3(
    op_item_a,
    list_id,
    'upsert_item',
    '{"itemId":"item-a","productId":"milk","name":"Milch","shelfId":"milchprodukte","shelfTitle":"Milchprodukte","shelfIcon":"milk","quantity":2,"done":false,"note":""}'::jsonb
  );
  result := public.apply_list_mutation_v3(
    op_item_b,
    list_id,
    'upsert_item',
    '{"itemId":"item-b","productId":"bread","name":"Brot","shelfId":"backwaren","shelfTitle":"Backwaren","shelfIcon":"bread","quantity":1,"done":false,"note":""}'::jsonb
  );

  if first_result ->> 'ok' <> 'true' or result ->> 'ok' <> 'true' then
    raise exception 'different item mutations failed: %, %', first_result, result;
  end if;
  if (
    select count(*)
    from public.list_items items
    where items.list_id = list_mutations_v3.list_id
      and items.deleted_at is null
  ) <> 2 then
    raise exception 'different item mutations did not both survive';
  end if;

  select revision into revision_before from public.shopping_lists where id = list_id;
  replay_result := public.apply_list_mutation_v3(
    op_item_a,
    list_id,
    'upsert_item',
    '{"itemId":"item-a","name":"Should not replace","quantity":99}'::jsonb
  );
  select revision into revision_after from public.shopping_lists where id = list_id;

  if replay_result is distinct from first_result then
    raise exception 'operation replay did not return the original result';
  end if;
  if revision_after <> revision_before then
    raise exception 'operation replay incremented list revision';
  end if;
  if (
    select items.quantity
    from public.list_items items
    where items.list_id = list_mutations_v3.list_id
      and items.item_id = 'item-a'
  ) <> 2 then
    raise exception 'operation replay changed absolute item state';
  end if;

  result := public.apply_list_mutation_v3(
    op_item_a_later,
    list_id,
    'upsert_item',
    '{"itemId":"item-a","productId":"milk","name":"Milch","shelfId":"milchprodukte","shelfTitle":"Milchprodukte","shelfIcon":"milk","quantity":4,"done":true,"note":"Bio"}'::jsonb
  );
  if result ->> 'ok' <> 'true'
    or (
      select items.quantity
      from public.list_items items
      where items.list_id = list_mutations_v3.list_id
        and items.item_id = 'item-a'
    ) <> 4
    or not (
      select items.done
      from public.list_items items
      where items.list_id = list_mutations_v3.list_id
        and items.item_id = 'item-a'
    ) then
    raise exception 'later same-item mutation did not win';
  end if;

  result := public.apply_list_mutation_v3(
    op_item_a_delete,
    list_id,
    'delete_item',
    '{"itemId":"item-a"}'::jsonb
  );
  if result ->> 'ok' <> 'true'
    or (
      select items.deleted_at
      from public.list_items items
      where items.list_id = list_mutations_v3.list_id
        and items.item_id = 'item-a'
    ) is null then
    raise exception 'item deletion did not create a tombstone';
  end if;

  replay_result := public.apply_list_mutation_v3(
    op_item_a_later,
    list_id,
    'upsert_item',
    '{"itemId":"item-a","name":"Stale replay","quantity":8}'::jsonb
  );
  if replay_result ->> 'ok' <> 'true'
    or (
      select items.deleted_at
      from public.list_items items
      where items.list_id = list_mutations_v3.list_id
        and items.item_id = 'item-a'
    ) is null then
    raise exception 'stale replay cleared an item tombstone';
  end if;

  result := public.apply_list_mutation_v3(
    op_invalid_quantity,
    list_id,
    'upsert_item',
    '{"itemId":"invalid-quantity","name":"Ungültig","quantity":999999999999999999999}'::jsonb
  );
  if result ->> 'error' <> 'invalid_mutation' then
    raise exception 'oversized quantity did not return invalid_mutation: %', result;
  end if;
  if exists (
    select 1
    from public.list_mutation_receipts receipts
    where receipts.operation_id = op_invalid_quantity
  ) then
    raise exception 'invalid quantity created a receipt';
  end if;

  result := public.apply_list_mutation_v3(
    op_create_list,
    created_list_id,
    'create_list',
    '{"name":"Neu"}'::jsonb
  );
  if result ->> 'ok' <> 'true'
    or not exists (
      select 1 from public.shopping_lists
      where id = created_list_id and owner_user_id = owner_account_id and name = 'Neu'
    ) then
    raise exception 'create_list failed: %', result;
  end if;

  result := public.apply_list_mutation_v3(
    op_rename_list,
    created_list_id,
    'rename_list',
    '{"name":"Umbenannt"}'::jsonb
  );
  if result ->> 'ok' <> 'true'
    or (select name from public.shopping_lists where id = created_list_id) <> 'Umbenannt' then
    raise exception 'rename_list failed: %', result;
  end if;

  perform set_config('request.jwt.claim.sub', editor_auth_id::text, true);
  result := public.apply_list_mutation_v3(op_leave_list, list_id, 'leave_list', '{}'::jsonb);
  if result ->> 'ok' <> 'true'
    or (
      select members.removed_at
      from public.list_members members
      where members.list_id = list_mutations_v3.list_id
        and members.user_id = editor_account_id
    ) is null then
    raise exception 'leave_list failed: %', result;
  end if;

  result := public.apply_list_mutation_v3(
    op_removed_edit,
    list_id,
    'upsert_item',
    '{"itemId":"removed-edit","name":"Nicht erlaubt","quantity":1}'::jsonb
  );
  if result ->> 'error' <> 'membership_removed' then
    raise exception 'removed member did not receive membership_removed: %', result;
  end if;
  if exists (select 1 from public.list_mutation_receipts where operation_id = op_removed_edit) then
    raise exception 'rejected mutation created a receipt';
  end if;

  perform set_config('request.jwt.claim.sub', owner_auth_id::text, true);
  result := public.apply_list_mutation_v3(op_delete_list, created_list_id, 'delete_list', '{}'::jsonb);
  if result ->> 'ok' <> 'true'
    or (select deleted_at from public.shopping_lists where id = created_list_id) is null then
    raise exception 'delete_list failed: %', result;
  end if;

  if (select count(*) from public.list_mutation_receipts where account_id = owner_account_id) <> 7 then
    raise exception 'unexpected owner receipt count';
  end if;

  if has_table_privilege('anon', 'public.list_mutation_receipts', 'SELECT')
    or has_table_privilege('authenticated', 'public.list_mutation_receipts', 'SELECT') then
    raise exception 'mutation receipts are directly readable';
  end if;
  if has_function_privilege('anon', 'public.apply_list_mutation_v3(uuid,text,text,jsonb)', 'EXECUTE') then
    raise exception 'anon can execute apply_list_mutation_v3';
  end if;
  if not has_function_privilege('authenticated', 'public.apply_list_mutation_v3(uuid,text,text,jsonb)', 'EXECUTE') then
    raise exception 'authenticated cannot execute apply_list_mutation_v3';
  end if;
end list_mutations_v3;
$$;

rollback;
