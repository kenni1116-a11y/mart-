begin;

do $$
declare
  realtime_tables text[];
  required_rpc text;
  second_owner_rejected boolean := false;
  owner_demotion_rejected boolean := false;
  owner_removal_rejected boolean := false;
  owner_delete_rejected boolean := false;
  owner_account_id constant uuid := 'e9100000-0000-4000-8000-000000000001';
  member_account_id constant uuid := 'e9100000-0000-4000-8000-000000000002';
  invariant_list_id constant text := 'integrity-v4-constraint-fixture';
begin
  if exists (
    select 1
    from pg_class relations
    join pg_namespace schemas on schemas.oid = relations.relnamespace
    where schemas.nspname = 'public'
      and relations.relkind = 'r'
      and not relations.relrowsecurity
  ) then
    raise exception 'every public table must have RLS enabled';
  end if;

  select array_agg(publication.tablename order by publication.tablename)
  into realtime_tables
  from pg_publication_tables publication
  where publication.pubname = 'supabase_realtime'
    and publication.schemaname = 'public';

  if realtime_tables is distinct from array['list_items', 'list_members', 'shopping_lists']::text[] then
    raise exception 'unexpected realtime publication tables: %', realtime_tables;
  end if;

  if exists (
    select 1
    from pg_proc functions
    join pg_namespace schemas on schemas.oid = functions.pronamespace
    where schemas.nspname in ('public', 'private')
      and functions.prosecdef
      and not coalesce(functions.proconfig, '{}'::text[]) @> array['search_path=""']
  ) then
    raise exception 'every security definer function must use an empty search_path';
  end if;

  if exists (
    select 1
    from pg_proc functions
    join pg_namespace schemas on schemas.oid = functions.pronamespace
    where schemas.nspname = 'public'
      and (
        has_function_privilege('anon', functions.oid, 'EXECUTE')
        or exists (
          select 1
          from aclexplode(coalesce(functions.proacl, acldefault('f', functions.proowner))) grants
          where grants.grantee = 0
            and grants.privilege_type = 'EXECUTE'
        )
      )
  ) then
    raise exception 'public RPC functions must not be executable by anon or PUBLIC';
  end if;

  if to_regprocedure('public.join_shared_list(text,text,text,text)') is not null
    or to_regprocedure('public.leave_shared_list(text)') is not null
    or to_regprocedure('public.shared_list_has_member(jsonb,uuid)') is not null
    or to_regprocedure('public.shared_list_has_removed_member(jsonb,uuid)') is not null then
    raise exception 'obsolete shared-list RPC functions remain installed';
  end if;

  foreach required_rpc in array array[
    'public.apply_list_mutation_v3(uuid,text,text,jsonb)',
    'public.approve_device_pairing_v3(uuid)',
    'public.bootstrap_account(text,text)',
    'public.cancel_device_pairing(uuid)',
    'public.create_device_pairing()',
    'public.delete_current_account_v3(uuid)',
    'public.delete_shopping_list(text)',
    'public.get_device_pairing_status_v3(uuid)',
    'public.join_shopping_list(text,text,text,text)',
    'public.leave_shopping_list(text)',
    'public.list_account_devices()',
    'public.recover_account(text,text,text)',
    'public.remove_account_device(uuid)',
    'public.rename_account_device(uuid,text)',
    'public.request_device_pairing_v3(uuid,text,text,text)',
    'public.rotate_recovery_code()',
    'public.touch_current_device(text,text)',
    'public.transfer_list_ownership_v3(text,uuid)',
    'public.update_account_avatar(text)',
    'public.update_account_display_name(text)'
  ] loop
    if to_regprocedure(required_rpc) is null
      or not has_function_privilege('authenticated', required_rpc, 'EXECUTE') then
      raise exception 'client RPC is missing or not executable by authenticated: %', required_rpc;
    end if;
  end loop;

  if not exists (
    select 1
    from pg_trigger triggers
    join pg_class relations on relations.oid = triggers.tgrelid
    join pg_namespace schemas on schemas.oid = relations.relnamespace
    where schemas.nspname = 'public'
      and relations.relname = 'shopping_lists'
      and triggers.tgname = 'shopping_lists_ensure_owner_membership'
      and not triggers.tgisinternal
  ) then
    raise exception 'shopping list owner membership trigger is missing';
  end if;

  if not exists (
    select 1
    from pg_trigger triggers
    join pg_class relations on relations.oid = triggers.tgrelid
    join pg_namespace schemas on schemas.oid = relations.relnamespace
    where schemas.nspname = 'public'
      and relations.relname = 'list_members'
      and triggers.tgname = 'list_members_validate_owner_membership'
      and triggers.tgdeferrable
      and triggers.tginitdeferred
      and not triggers.tgisinternal
  ) then
    raise exception 'deferred list member owner invariant trigger is missing';
  end if;

  if exists (
    select 1
    from public.shopping_lists lists
    where lists.deleted_at is null
      and (
        1 <> (
          select count(*)
          from public.list_members members
          where members.list_id = lists.id
            and members.role = 'owner'
            and members.removed_at is null
        )
        or not exists (
          select 1
          from public.list_members members
          where members.list_id = lists.id
            and members.user_id = lists.owner_user_id
            and members.role = 'owner'
            and members.removed_at is null
        )
      )
  ) then
    raise exception 'an active shopping list does not have exactly one active owner membership';
  end if;

  if exists (
    select 1
    from public.shopping_lists lists
    where lists.id = 'integrity-v4-backfill-fixture'
  ) and not exists (
    select 1
    from public.list_members members
    where members.list_id = 'integrity-v4-backfill-fixture'
      and members.user_id = 'e9000000-0000-4000-8000-000000000002'
      and members.role = 'editor'
      and members.removed_at is null
  ) then
    raise exception 'legacy owner membership was deleted instead of preserved and demoted';
  end if;

  insert into public.accounts (id, username, display_name)
  values
    (owner_account_id, 'user-E910001', 'Invariant Owner'),
    (member_account_id, 'user-E910002', 'Invariant Member');

  insert into public.shopping_lists (id, name, owner_user_id)
  values (invariant_list_id, 'Invariant fixture', owner_account_id);

  insert into public.list_members (list_id, user_id, display_name, role)
  values (invariant_list_id, member_account_id, 'Invariant Member', 'editor');

  set constraints all immediate;
  set constraints all deferred;

  begin
    update public.list_members
    set role = 'owner'
    where list_id = invariant_list_id
      and user_id = member_account_id;
    set constraints list_members_validate_owner_membership immediate;
  exception
    when check_violation then
      second_owner_rejected := true;
  end;
  set constraints all deferred;

  if not second_owner_rejected then
    raise exception 'a second active owner membership was accepted';
  end if;

  begin
    update public.list_members
    set role = 'editor'
    where list_id = invariant_list_id
      and user_id = owner_account_id;
    set constraints list_members_validate_owner_membership immediate;
  exception
    when check_violation then
      owner_demotion_rejected := true;
  end;
  set constraints all deferred;

  if not owner_demotion_rejected then
    raise exception 'canonical owner demotion was accepted';
  end if;

  begin
    update public.list_members
    set removed_at = now()
    where list_id = invariant_list_id
      and user_id = owner_account_id;
    set constraints list_members_validate_owner_membership immediate;
  exception
    when check_violation then
      owner_removal_rejected := true;
  end;
  set constraints all deferred;

  if not owner_removal_rejected then
    raise exception 'canonical owner removal was accepted';
  end if;

  begin
    delete from public.list_members
    where list_id = invariant_list_id
      and user_id = owner_account_id;
    set constraints list_members_validate_owner_membership immediate;
  exception
    when check_violation then
      owner_delete_rejected := true;
  end;
  set constraints all deferred;

  if not owner_delete_rejected then
    raise exception 'canonical owner deletion was accepted';
  end if;

  if exists (
    select 1
    from public.list_items items
    where items.quantity < 1 or items.quantity > 99
  ) then
    raise exception 'list item quantity is outside the supported range';
  end if;
end;
$$;

rollback;
