begin;

do $$
declare
  realtime_tables text[];
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

  if exists (
    select 1
    from public.shopping_lists lists
    where lists.deleted_at is null
      and 1 <> (
        select count(*)
        from public.list_members members
        where members.list_id = lists.id
          and members.user_id = lists.owner_user_id
          and members.role = 'owner'
          and members.removed_at is null
      )
  ) then
    raise exception 'an active shopping list does not have exactly one active owner membership';
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
