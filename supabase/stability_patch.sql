-- Apply this once to an existing Zettel Supabase project after device_accounts_v2.sql.
-- It keeps tombstones readable for synchronization and prevents stale writes from
-- overwriting newer changes that arrived from another device.

begin;

create or replace function private.can_access_list(target_list_id text)
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

drop trigger if exists shopping_lists_keep_newest_change on public.shopping_lists;
create trigger shopping_lists_keep_newest_change
before update on public.shopping_lists
for each row execute function private.keep_newest_list_change();

drop trigger if exists list_items_keep_newest_change on public.list_items;
create trigger list_items_keep_newest_change
before update on public.list_items
for each row execute function private.keep_newest_list_change();

alter table public.shopping_lists replica identity full;
alter table public.list_members replica identity full;
alter table public.list_items replica identity full;

commit;
