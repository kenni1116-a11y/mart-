drop function if exists public.join_shared_list(text, text, text, text);
drop function if exists public.leave_shared_list(text);
drop function if exists public.shared_list_has_member(jsonb, uuid);
drop function if exists public.shared_list_has_removed_member(jsonb, uuid);

create or replace function private.ensure_list_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.list_members (
    list_id,
    user_id,
    display_name,
    avatar_url,
    role,
    joined_at,
    removed_at,
    removed_by_user_id
  )
  select
    new.id,
    new.owner_user_id,
    coalesce(accounts.display_name, accounts.username, 'Owner'),
    coalesce(accounts.avatar_url, ''),
    'owner',
    now(),
    null,
    null
  from public.accounts accounts
  where accounts.id = new.owner_user_id
  on conflict (list_id, user_id) do update
  set display_name = excluded.display_name,
      avatar_url = excluded.avatar_url,
      role = 'owner',
      removed_at = null,
      removed_by_user_id = null;

  return new;
end;
$$;

revoke all on function private.ensure_list_owner_membership()
  from public, anon, authenticated;

drop trigger if exists shopping_lists_ensure_owner_membership
  on public.shopping_lists;
create trigger shopping_lists_ensure_owner_membership
after insert or update of owner_user_id
on public.shopping_lists
for each row
when (new.deleted_at is null)
execute function private.ensure_list_owner_membership();

insert into public.list_members (
  list_id,
  user_id,
  display_name,
  avatar_url,
  role,
  joined_at,
  removed_at,
  removed_by_user_id
)
select
  lists.id,
  lists.owner_user_id,
  coalesce(accounts.display_name, accounts.username, 'Owner'),
  coalesce(accounts.avatar_url, ''),
  'owner',
  coalesce(lists.created_at, now()),
  null,
  null
from public.shopping_lists lists
join public.accounts accounts on accounts.id = lists.owner_user_id
where lists.deleted_at is null
on conflict (list_id, user_id) do update
set display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    role = 'owner',
    removed_at = null,
    removed_by_user_id = null;
