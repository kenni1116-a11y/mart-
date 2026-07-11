create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Gast',
  avatar_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.shopping_lists (
  id text primary key,
  name text not null default 'Dein Zettel',
  owner_user_id uuid references auth.users(id) on delete set null,
  invite_code text not null default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by_user_id uuid references auth.users(id) on delete set null,
  deleted_at timestamptz,
  deleted_by_user_id uuid references auth.users(id) on delete set null,
  revision integer not null default 1
);

create table if not exists public.list_members (
  list_id text not null references public.shopping_lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null default 'Gast',
  avatar_url text not null default '',
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  invited_by_user_id uuid references auth.users(id) on delete set null,
  joined_at timestamptz not null default now(),
  removed_at timestamptz,
  removed_by_user_id uuid references auth.users(id) on delete set null,
  primary key (list_id, user_id)
);

create table if not exists public.list_items (
  list_id text not null references public.shopping_lists(id) on delete cascade,
  item_id text not null,
  product_id text,
  name text not null default '',
  shelf_id text not null default '',
  shelf_title text not null default '',
  shelf_icon text not null default '',
  quantity integer not null default 1 check (quantity >= 1 and quantity <= 99),
  done boolean not null default false,
  note text not null default '',
  added_by_user_id uuid references auth.users(id) on delete set null,
  added_by_display_name text not null default 'Gast',
  added_by_avatar_url text not null default '',
  checked_by_user_id uuid references auth.users(id) on delete set null,
  checked_at timestamptz,
  updated_by_user_id uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by_user_id uuid references auth.users(id) on delete set null,
  revision integer not null default 1,
  primary key (list_id, item_id)
);

comment on table public.shopping_lists is
  'Canonical collaborative Einkaufszettel lists. One row per list; items and members live in separate realtime tables.';
comment on table public.list_members is
  'Participants and roles for collaborative Einkaufszettel lists.';
comment on table public.list_items is
  'Canonical item rows for collaborative Einkaufszettel lists. Deleted items are retained as tombstones.';

create index if not exists shopping_lists_owner_user_id_idx on public.shopping_lists(owner_user_id);
create index if not exists shopping_lists_invite_code_idx on public.shopping_lists(invite_code);
create index if not exists shopping_lists_updated_at_idx on public.shopping_lists(updated_at desc);
create index if not exists list_members_user_id_idx on public.list_members(user_id);
create index if not exists list_items_list_updated_idx on public.list_items(list_id, updated_at desc);

alter table public.profiles enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.list_members enable row level security;
alter table public.list_items enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.shopping_lists to authenticated;
grant select, insert, update, delete on public.list_members to authenticated;
grant select, insert, update, delete on public.list_items to authenticated;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.list_owner_id(target_list_id text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select lists.owner_user_id
  from public.shopping_lists lists
  where lists.id = target_list_id
    and lists.deleted_at is null
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) is false
    and (
      lists.owner_user_id = auth.uid()
      or exists (
        select 1
        from public.list_members members
        where members.list_id = lists.id
          and members.user_id = auth.uid()
          and members.removed_at is null
      )
      or lists.invite_code = nullif(current_setting('request.mart_invite_code', true), '')
    )
$$;

create or replace function private.list_invite_matches(target_list_id text, target_invite_code text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists
    where id = target_list_id
      and invite_code = target_invite_code
      and deleted_at is null
      and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) is false
      and target_invite_code = nullif(current_setting('request.mart_invite_code', true), '')
  )
$$;

create or replace function private.is_active_list_member(target_list_id text, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists lists
    left join public.list_members members
      on members.list_id = lists.id
      and members.user_id = target_user_id
      and members.removed_at is null
    where lists.id = target_list_id
      and lists.deleted_at is null
      and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) is false
      and target_user_id = auth.uid()
      and (
        lists.owner_user_id = target_user_id
        or members.user_id = target_user_id
      )
  )
$$;

create or replace function private.can_edit_list(target_list_id text, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists lists
    left join public.list_members members
      on members.list_id = lists.id
      and members.user_id = target_user_id
      and members.removed_at is null
    where lists.id = target_list_id
      and lists.deleted_at is null
      and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) is false
      and target_user_id = auth.uid()
      and (
        lists.owner_user_id = target_user_id
        or members.role in ('owner', 'editor')
      )
  )
$$;

revoke all on function private.list_owner_id(text) from public, anon;
revoke all on function private.list_invite_matches(text, text) from public, anon;
revoke all on function private.is_active_list_member(text, uuid) from public, anon;
revoke all on function private.can_edit_list(text, uuid) from public, anon;
grant execute on function private.list_owner_id(text) to authenticated;
grant execute on function private.list_invite_matches(text, text) to authenticated;
grant execute on function private.is_active_list_member(text, uuid) to authenticated;
grant execute on function private.can_edit_list(text, uuid) to authenticated;

drop policy if exists "profiles are readable" on public.profiles;
create policy "profiles are readable"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles
for insert
to authenticated
with check (id = (select auth.uid()));

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "members and invitees read lists" on public.shopping_lists;
create policy "members and invitees read lists"
on public.shopping_lists
for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  or private.is_active_list_member(id, (select auth.uid()))
  or invite_code = (select current_setting('request.mart_invite_code', true))
);

drop policy if exists "owners insert lists" on public.shopping_lists;
create policy "owners insert lists"
on public.shopping_lists
for insert
to authenticated
with check (owner_user_id = (select auth.uid()));

drop policy if exists "editors update lists without stealing ownership" on public.shopping_lists;
create policy "editors update lists without stealing ownership"
on public.shopping_lists
for update
to authenticated
using (private.can_edit_list(id, (select auth.uid())))
with check (
  private.can_edit_list(id, (select auth.uid()))
  and (
    owner_user_id = private.list_owner_id(id)
    or private.list_owner_id(id) = (select auth.uid())
  )
);

drop policy if exists "owners delete lists" on public.shopping_lists;
create policy "owners delete lists"
on public.shopping_lists
for delete
to authenticated
using (owner_user_id = (select auth.uid()));

drop policy if exists "members read members" on public.list_members;
create policy "members read members"
on public.list_members
for select
to authenticated
using (
  private.is_active_list_member(list_id, (select auth.uid()))
  or private.list_invite_matches(list_id, (select current_setting('request.mart_invite_code', true)))
);

drop policy if exists "owners and invitees insert members" on public.list_members;
create policy "owners and invitees insert members"
on public.list_members
for insert
to authenticated
with check (
  private.list_owner_id(list_id) = (select auth.uid())
  or (
    user_id = (select auth.uid())
    and private.list_invite_matches(list_id, (select current_setting('request.mart_invite_code', true)))
  )
);

drop policy if exists "owners or self update members" on public.list_members;
create policy "owners or self update members"
on public.list_members
for update
to authenticated
using (
  private.list_owner_id(list_id) = (select auth.uid())
  or user_id = (select auth.uid())
)
with check (
  private.list_owner_id(list_id) = (select auth.uid())
  or (
    user_id = (select auth.uid())
    and removed_at is not null
  )
);

drop policy if exists "owners delete members" on public.list_members;
create policy "owners delete members"
on public.list_members
for delete
to authenticated
using (private.list_owner_id(list_id) = (select auth.uid()));

drop policy if exists "members read items" on public.list_items;
create policy "members read items"
on public.list_items
for select
to authenticated
using (private.is_active_list_member(list_id, (select auth.uid())));

drop policy if exists "editors insert items" on public.list_items;
create policy "editors insert items"
on public.list_items
for insert
to authenticated
with check (private.can_edit_list(list_id, (select auth.uid())));

drop policy if exists "editors update items" on public.list_items;
create policy "editors update items"
on public.list_items
for update
to authenticated
using (private.can_edit_list(list_id, (select auth.uid())))
with check (private.can_edit_list(list_id, (select auth.uid())));

drop policy if exists "editors delete items" on public.list_items;
create policy "editors delete items"
on public.list_items
for delete
to authenticated
using (private.can_edit_list(list_id, (select auth.uid())));

create or replace function public.join_shopping_list(
  target_list_id text,
  target_invite_code text,
  display_name text default 'Gast',
  avatar_url text default ''
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  clean_name text := left(coalesce(nullif(trim(display_name), ''), 'Gast'), 24);
  clean_avatar text := left(coalesce(avatar_url, ''), 512);
begin
  if request_user_id is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'permanent account required';
  end if;

  perform set_config('request.mart_invite_code', target_invite_code, true);

  if not private.list_invite_matches(target_list_id, target_invite_code) then
    raise exception 'invalid invite';
  end if;

  insert into public.list_members (
    list_id,
    user_id,
    display_name,
    avatar_url,
    role,
    invited_by_user_id,
    joined_at,
    removed_at,
    removed_by_user_id
  )
  values (
    target_list_id,
    request_user_id,
    clean_name,
    clean_avatar,
    'editor',
    private.list_owner_id(target_list_id),
    now(),
    null,
    null
  )
  on conflict (list_id, user_id) do update
  set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    role = case
      when public.list_members.role = 'owner' then 'owner'
      else 'editor'
    end,
    removed_at = null,
    removed_by_user_id = null;

  update public.shopping_lists
  set updated_at = now(), updated_by_user_id = request_user_id, revision = revision + 1
  where id = target_list_id;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

create or replace function public.leave_shopping_list(target_list_id text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
begin
  if request_user_id is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'permanent account required';
  end if;

  if private.list_owner_id(target_list_id) = request_user_id then
    raise exception 'owner cannot leave list';
  end if;

  update public.shopping_lists
  set updated_at = now(), updated_by_user_id = request_user_id, revision = revision + 1
  where id = target_list_id;

  update public.list_members
  set removed_at = now(), removed_by_user_id = request_user_id
  where list_id = target_list_id
    and user_id = request_user_id;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

create or replace function public.delete_shopping_list(target_list_id text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
begin
  if request_user_id is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, true) then
    raise exception 'permanent account required';
  end if;

  update public.shopping_lists
  set deleted_at = now(),
      deleted_by_user_id = request_user_id,
      updated_at = now(),
      updated_by_user_id = request_user_id,
      revision = revision + 1
  where id = target_list_id
    and owner_user_id = request_user_id;

  if not found then
    raise exception 'not list owner';
  end if;

  return jsonb_build_object('listId', target_list_id);
end;
$$;

revoke all on function public.join_shopping_list(text, text, text, text) from public, anon;
revoke all on function public.leave_shopping_list(text) from public, anon;
revoke all on function public.delete_shopping_list(text) from public, anon;
grant execute on function public.join_shopping_list(text, text, text, text) to authenticated;
grant execute on function public.leave_shopping_list(text) to authenticated;
grant execute on function public.delete_shopping_list(text) to authenticated;

insert into public.shopping_lists (
  id,
  name,
  owner_user_id,
  invite_code,
  created_at,
  updated_at,
  updated_by_user_id,
  deleted_at,
  deleted_by_user_id,
  revision
)
select
  payload ->> 'listId',
  coalesce(payload ->> 'listName', 'Dein Zettel'),
  case when payload ->> 'ownerId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (payload ->> 'ownerId')::uuid else null end,
  coalesce(payload ->> 'inviteCode', invite_code),
  coalesce(nullif(payload ->> 'createdAt', '')::timestamptz, created_at),
  coalesce(nullif(payload ->> 'updatedAt', '')::timestamptz, updated_at),
  case when payload ->> 'updatedByUserId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (payload ->> 'updatedByUserId')::uuid else null end,
  nullif(payload ->> 'deletedAt', '')::timestamptz,
  case when payload ->> 'deletedByUserId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (payload ->> 'deletedByUserId')::uuid else null end,
  coalesce(nullif(payload ->> 'revision', '')::integer, 1)
from public.shared_lists
where payload ? 'listId'
on conflict (id) do nothing;

insert into public.list_members (
  list_id,
  user_id,
  display_name,
  avatar_url,
  role,
  invited_by_user_id,
  joined_at,
  removed_at,
  removed_by_user_id
)
select
  lists.id,
  (member ->> 'userId')::uuid,
  left(coalesce(nullif(member ->> 'displayName', ''), 'Gast'), 24),
  coalesce(member ->> 'avatarUrl', ''),
  case when member ->> 'userId' = lists.owner_user_id::text then 'owner' else coalesce(nullif(member ->> 'role', ''), 'editor') end,
  lists.owner_user_id,
  coalesce(nullif(member ->> 'joinedAt', '')::timestamptz, lists.created_at),
  null,
  null
from public.shared_lists legacy
join public.shopping_lists lists on lists.id = legacy.payload ->> 'listId'
cross join lateral jsonb_array_elements(coalesce(legacy.payload -> 'members', '[]'::jsonb)) as member
where member ->> 'userId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
on conflict (list_id, user_id) do nothing;

insert into public.list_members (
  list_id,
  user_id,
  display_name,
  avatar_url,
  role,
  invited_by_user_id,
  joined_at,
  removed_at,
  removed_by_user_id
)
select
  lists.id,
  (removed ->> 'userId')::uuid,
  'Gast',
  '',
  'editor',
  lists.owner_user_id,
  lists.created_at,
  coalesce(nullif(removed ->> 'removedAt', '')::timestamptz, lists.updated_at),
  case when removed ->> 'removedByUserId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (removed ->> 'removedByUserId')::uuid else null end
from public.shared_lists legacy
join public.shopping_lists lists on lists.id = legacy.payload ->> 'listId'
cross join lateral jsonb_array_elements(coalesce(legacy.payload -> 'removedMembers', '[]'::jsonb)) as removed
where removed ->> 'userId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
on conflict (list_id, user_id) do update
set removed_at = excluded.removed_at,
    removed_by_user_id = excluded.removed_by_user_id;

insert into public.list_items (
  list_id,
  item_id,
  product_id,
  name,
  shelf_id,
  shelf_title,
  shelf_icon,
  quantity,
  done,
  note,
  added_by_user_id,
  added_by_display_name,
  added_by_avatar_url,
  checked_by_user_id,
  checked_at,
  updated_by_user_id,
  updated_at,
  deleted_at,
  deleted_by_user_id,
  revision
)
select
  lists.id,
  item ->> 'id',
  case when left(item ->> 'id', 7) = 'manual:' then null else item ->> 'id' end,
  coalesce(item ->> 'name', ''),
  coalesce(item ->> 'shelfId', ''),
  coalesce(item ->> 'shelfTitle', ''),
  coalesce(item ->> 'shelfIcon', ''),
  greatest(1, least(99, coalesce(nullif(item ->> 'quantity', '')::integer, 1))),
  coalesce(nullif(item ->> 'done', '')::boolean, false),
  coalesce(item ->> 'note', ''),
  case when item ->> 'addedByUserId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (item ->> 'addedByUserId')::uuid else null end,
  left(coalesce(nullif(item ->> 'addedByDisplayName', ''), 'Gast'), 24),
  coalesce(item ->> 'addedByAvatarUrl', ''),
  case when item ->> 'checkedByUserId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (item ->> 'checkedByUserId')::uuid else null end,
  nullif(item ->> 'checkedAt', '')::timestamptz,
  case when item ->> 'updatedByUserId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then (item ->> 'updatedByUserId')::uuid else null end,
  coalesce(nullif(item ->> 'updatedAt', '')::timestamptz, lists.updated_at),
  null,
  null,
  coalesce(nullif(item ->> 'revision', '')::integer, 1)
from public.shared_lists legacy
join public.shopping_lists lists on lists.id = legacy.payload ->> 'listId'
cross join lateral jsonb_array_elements(coalesce(legacy.payload -> 'items', '[]'::jsonb)) as item
where coalesce(item ->> 'id', '') <> ''
on conflict (list_id, item_id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shopping_lists'
  ) then
    alter publication supabase_realtime add table public.shopping_lists;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'list_members'
  ) then
    alter publication supabase_realtime add table public.list_members;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'list_items'
  ) then
    alter publication supabase_realtime add table public.list_items;
  end if;
end $$;

comment on table public.shared_lists is
  'Archived legacy snapshot table. Kept for recovery only and no longer exposed to app clients.';
revoke all on public.shared_lists from anon, authenticated;

do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shared_lists'
  ) then
    execute 'alter publication supabase_realtime drop table public.shared_lists';
  end if;
end $$;

drop policy if exists "permanent accounts only" on public.profiles;
create policy "permanent accounts only"
on public.profiles as restrictive for all to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);

drop policy if exists "permanent accounts only" on public.shopping_lists;
create policy "permanent accounts only"
on public.shopping_lists as restrictive for all to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);

drop policy if exists "permanent accounts only" on public.list_members;
create policy "permanent accounts only"
on public.list_members as restrictive for all to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);

drop policy if exists "permanent accounts only" on public.list_items;
create policy "permanent accounts only"
on public.list_items as restrictive for all to authenticated
using (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false)
with check (coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, true) is false);
