begin;

do $$
declare
  realtime_tables text[];
  required_rpc text;
  owner_guard_rejected boolean := false;
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
    'apply_list_mutation_v3',
    'approve_device_pairing_v3',
    'bootstrap_account',
    'cancel_device_pairing',
    'create_device_pairing',
    'delete_current_account_v3',
    'delete_shopping_list',
    'get_device_pairing_status_v3',
    'join_shopping_list',
    'leave_shopping_list',
    'list_account_devices',
    'recover_account',
    'remove_account_device',
    'rename_account_device',
    'request_device_pairing_v3',
    'rotate_recovery_code',
    'touch_current_device',
    'transfer_list_ownership_v3',
    'update_account_profile'
  ] loop
    if not exists (
      select 1
      from pg_proc functions
      join pg_namespace schemas on schemas.oid = functions.pronamespace
      where schemas.nspname = 'public'
        and functions.proname = required_rpc
        and has_function_privilege('authenticated', functions.oid, 'EXECUTE')
    ) then
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

  insert into public.accounts (id, username, display_name)
  values
    (owner_account_id, 'user-E910001', 'Invariant Owner'),
    (member_account_id, 'user-E910002', 'Invariant Member');

  insert into public.shopping_lists (id, name, owner_user_id)
  values (invariant_list_id, 'Invariant fixture', owner_account_id);

  insert into public.list_members (list_id, user_id, display_name, role)
  values (invariant_list_id, member_account_id, 'Invariant Member', 'editor');

  begin
    update public.list_members
    set role = 'owner'
    where list_id = invariant_list_id
      and user_id = member_account_id;
    set constraints list_members_validate_owner_membership immediate;
  exception
    when check_violation then
      owner_guard_rejected := true;
  end;
  set constraints all deferred;

  if not owner_guard_rejected then
    raise exception 'a second active owner membership was accepted';
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
