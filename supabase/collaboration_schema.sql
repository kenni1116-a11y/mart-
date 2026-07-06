create table if not exists public.shared_lists (
  id text primary key,
  owner_user_id uuid references auth.users(id) on delete set null,
  invite_code text not null default replace(gen_random_uuid()::text, '-', ''),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.shared_lists is
  'Realtime snapshot storage for shared Einkaufszettel lists. The JSON payload contains members, permissions, items, and per-item user metadata.';

comment on column public.shared_lists.payload is
  'Collaborative list payload: listId, listName, ownerId, members, permissions, createdAt, updatedAt, deletedItems, removedMembers, and items.';

alter table public.shared_lists enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.shared_lists to authenticated;

create or replace function public.shared_list_has_member(list_payload jsonb, user_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
    from pg_catalog.jsonb_array_elements(coalesce(list_payload -> 'members', '[]'::jsonb)) as member
    where member ->> 'userId' = user_id::text
  );
$$;

create or replace function public.shared_list_has_removed_member(list_payload jsonb, user_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
    from pg_catalog.jsonb_array_elements(coalesce(list_payload -> 'removedMembers', '[]'::jsonb)) as member
    where member ->> 'userId' = user_id::text
  );
$$;

grant execute on function public.shared_list_has_removed_member(jsonb, uuid) to authenticated;

create index if not exists shared_lists_owner_user_id_idx
on public.shared_lists(owner_user_id);

create unique index if not exists shared_lists_invite_code_idx
on public.shared_lists(invite_code);

create or replace function public.join_shared_list(
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
  joined_at text := to_jsonb(now()) #>> '{}';
  clean_name text := left(coalesce(nullif(trim(display_name), ''), 'Gast'), 24);
  clean_avatar text := left(coalesce(avatar_url, ''), 512);
  member_payload jsonb;
  next_payload jsonb;
begin
  if request_user_id is null then
    raise exception 'authentication required';
  end if;

  member_payload := jsonb_build_object(
    'userId', request_user_id::text,
    'displayName', clean_name,
    'avatarUrl', clean_avatar,
    'role', 'editor',
    'joinedAt', joined_at
  );

  perform set_config('request.mart_invite_code', target_invite_code, true);

  update public.shared_lists
  set
    payload = case
      when public.shared_list_has_member(payload, request_user_id) then payload
      else jsonb_set(
        payload,
        '{members}',
        coalesce(payload -> 'members', '[]'::jsonb) || member_payload,
        true
      )
    end,
    updated_at = now()
  where id = target_list_id
    and invite_code = target_invite_code
  returning payload into next_payload;

  if next_payload is null then
    raise exception 'invalid invite';
  end if;

  return next_payload;
end;
$$;

revoke all on function public.join_shared_list(text, text, text, text) from public;
revoke all on function public.join_shared_list(text, text, text, text) from anon;
grant execute on function public.join_shared_list(text, text, text, text) to authenticated;

create or replace function public.leave_shared_list(target_list_id text)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  left_at text := to_jsonb(now()) #>> '{}';
  next_payload jsonb;
begin
  if request_user_id is null then
    raise exception 'authentication required';
  end if;

  perform set_config('request.mart_leave_user_id', request_user_id::text, true);

  update public.shared_lists
  set
    payload = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            payload,
            '{members}',
            coalesce((
              select jsonb_agg(member)
              from pg_catalog.jsonb_array_elements(coalesce(payload -> 'members', '[]'::jsonb)) as member
              where member ->> 'userId' <> request_user_id::text
            ), '[]'::jsonb),
            true
          ),
          '{removedMembers}',
          coalesce(payload -> 'removedMembers', '[]'::jsonb) || jsonb_build_object(
            'userId', request_user_id::text,
            'removedByUserId', request_user_id::text,
            'removedAt', left_at
          ),
          true
        ),
        '{updatedByUserId}',
        to_jsonb(request_user_id::text),
        true
      ),
      '{updatedAt}',
      to_jsonb(left_at),
      true
    ),
    updated_at = now()
  where id = target_list_id
    and payload ->> 'ownerId' <> request_user_id::text
    and public.shared_list_has_member(payload, request_user_id)
  returning payload into next_payload;

  if next_payload is null then
    raise exception 'not a removable member';
  end if;

  return next_payload;
end;
$$;

revoke all on function public.leave_shared_list(text) from public;
revoke all on function public.leave_shared_list(text) from anon;
grant execute on function public.leave_shared_list(text) to authenticated;

drop policy if exists "members can read shared lists" on public.shared_lists;
drop policy if exists "members and invitees can read shared lists" on public.shared_lists;
create policy "members and invitees can read shared lists"
on public.shared_lists
for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  or public.shared_list_has_member(payload, (select auth.uid()))
  or invite_code = (select current_setting('request.mart_invite_code', true))
  or exists (
    select 1
    from pg_catalog.jsonb_array_elements(coalesce(payload -> 'removedMembers', '[]'::jsonb)) as removed_member
    where removed_member ->> 'userId' = (select current_setting('request.mart_leave_user_id', true))
  )
);

drop policy if exists "members can insert shared lists" on public.shared_lists;
create policy "members can insert shared lists"
on public.shared_lists
for insert
to authenticated
with check (
  owner_user_id = (select auth.uid())
  or public.shared_list_has_member(payload, (select auth.uid()))
);

drop policy if exists "members can update shared lists" on public.shared_lists;
drop policy if exists "invitees can join shared lists" on public.shared_lists;
create policy "members and invitees can update shared lists"
on public.shared_lists
for update
to authenticated
using (
  owner_user_id = (select auth.uid())
  or public.shared_list_has_member(payload, (select auth.uid()))
  or invite_code = (select current_setting('request.mart_invite_code', true))
)
with check (
  owner_user_id = (select auth.uid())
  or public.shared_list_has_member(payload, (select auth.uid()))
  or exists (
    select 1
    from pg_catalog.jsonb_array_elements(coalesce(payload -> 'removedMembers', '[]'::jsonb)) as removed_member
    where removed_member ->> 'userId' = (select auth.uid())::text
  )
  or (
    invite_code = (select current_setting('request.mart_invite_code', true))
    and public.shared_list_has_member(payload, (select auth.uid()))
  )
);

drop policy if exists "owners can delete shared lists" on public.shared_lists;
create policy "owners can delete shared lists"
on public.shared_lists
for delete
to authenticated
using (
  owner_user_id = (select auth.uid())
  or payload ->> 'ownerId' = (select auth.uid())::text
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shared_lists'
  ) then
    alter publication supabase_realtime add table public.shared_lists;
  end if;
end $$;
