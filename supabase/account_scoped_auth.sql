comment on table public.shared_lists is
  'Archived legacy snapshot table. Kept for recovery only and no longer exposed to app clients.';

revoke all on public.shared_lists from anon, authenticated;

do $$
begin
  if exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shared_lists'
  ) then
    execute 'alter publication supabase_realtime drop table public.shared_lists';
  end if;
end;
$$;

drop policy if exists "permanent accounts only" on public.profiles;
create policy "permanent accounts only"
on public.profiles
as restrictive
for all
to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);

drop policy if exists "permanent accounts only" on public.shopping_lists;
create policy "permanent accounts only"
on public.shopping_lists
as restrictive
for all
to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);

drop policy if exists "permanent accounts only" on public.list_members;
create policy "permanent accounts only"
on public.list_members
as restrictive
for all
to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);

drop policy if exists "permanent accounts only" on public.list_items;
create policy "permanent accounts only"
on public.list_items
as restrictive
for all
to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);
