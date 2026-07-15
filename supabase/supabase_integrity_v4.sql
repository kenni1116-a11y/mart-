create or replace function private.ensure_list_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.list_members members
  set role = 'editor'
  where members.list_id = new.id
    and members.user_id <> new.owner_user_id
    and members.role = 'owner'
    and members.removed_at is null;

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
after insert or update of owner_user_id, deleted_at
on public.shopping_lists
for each row
when (new.deleted_at is null)
execute function private.ensure_list_owner_membership();

update public.list_members members
set role = 'editor'
from public.shopping_lists lists
where lists.id = members.list_id
  and lists.deleted_at is null
  and members.user_id <> lists.owner_user_id
  and members.role = 'owner'
  and members.removed_at is null;

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

create or replace function private.require_list_owner_membership(target_list_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  expected_owner_id uuid;
  active_owner_count integer;
  matching_owner_count integer;
begin
  select lists.owner_user_id
  into expected_owner_id
  from public.shopping_lists lists
  where lists.id = target_list_id
    and lists.deleted_at is null;

  if not found then
    return;
  end if;

  select
    count(*) filter (
      where members.role = 'owner'
        and members.removed_at is null
    ),
    count(*) filter (
      where members.user_id = expected_owner_id
        and members.role = 'owner'
        and members.removed_at is null
    )
  into active_owner_count, matching_owner_count
  from public.list_members members
  where members.list_id = target_list_id;

  if active_owner_count <> 1 or matching_owner_count <> 1 then
    raise exception using
      errcode = '23514',
      message = 'active_list_owner_membership_required';
  end if;
end;
$$;

revoke all on function private.require_list_owner_membership(text)
  from public, anon, authenticated;

create or replace function private.validate_list_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'shopping_lists' then
    if tg_op = 'DELETE' then
      perform private.require_list_owner_membership(old.id);
    else
      perform private.require_list_owner_membership(new.id);
    end if;
    if tg_op = 'UPDATE' and old.id is distinct from new.id then
      perform private.require_list_owner_membership(old.id);
    end if;
  else
    if tg_op = 'DELETE' then
      perform private.require_list_owner_membership(old.list_id);
    else
      perform private.require_list_owner_membership(new.list_id);
    end if;
    if tg_op = 'UPDATE' and old.list_id is distinct from new.list_id then
      perform private.require_list_owner_membership(old.list_id);
    end if;
  end if;

  return null;
end;
$$;

revoke all on function private.validate_list_owner_membership()
  from public, anon, authenticated;

drop trigger if exists shopping_lists_validate_owner_membership
  on public.shopping_lists;
create constraint trigger shopping_lists_validate_owner_membership
after insert or update or delete
on public.shopping_lists
deferrable initially deferred
for each row
execute function private.validate_list_owner_membership();

drop trigger if exists list_members_validate_owner_membership
  on public.list_members;
create constraint trigger list_members_validate_owner_membership
after insert or update or delete
on public.list_members
deferrable initially deferred
for each row
execute function private.validate_list_owner_membership();
