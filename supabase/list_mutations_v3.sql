create table if not exists public.list_mutation_receipts (
  operation_id uuid primary key,
  account_id uuid not null references public.accounts(id) on delete cascade,
  list_id text not null,
  mutation_type text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.list_mutation_receipts enable row level security;
revoke all on public.list_mutation_receipts from public, anon, authenticated;

create index if not exists list_mutation_receipts_created_idx
  on public.list_mutation_receipts(created_at);
create index if not exists list_mutation_receipts_account_idx
  on public.list_mutation_receipts(account_id);

create or replace function public.apply_list_mutation_v3(
  operation_id uuid,
  target_list_id text,
  mutation_type text,
  payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  request_account_id uuid;
  requested_operation_id uuid := operation_id;
  requested_list_id text := trim(coalesce(target_list_id, ''));
  requested_type text := lower(trim(coalesce(mutation_type, '')));
  requested_payload jsonb := coalesce(payload, '{}'::jsonb);
  existing_receipt public.list_mutation_receipts%rowtype;
  list_row public.shopping_lists%rowtype;
  member_role text;
  member_removed_at timestamptz;
  actor_display_name text;
  actor_avatar_url text;
  item_id_value text;
  quantity_value integer;
  done_value boolean;
  list_revision_value integer;
  result_value jsonb;
begin
  if request_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'authentication_required');
  end if;
  if requested_operation_id is null
    or requested_list_id = ''
    or requested_type not in (
      'create_list',
      'rename_list',
      'upsert_item',
      'delete_item',
      'delete_list',
      'leave_list'
    )
    or jsonb_typeof(requested_payload) <> 'object' then
    return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(request_user_id::text, 0)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(requested_operation_id::text, 0)
  );

  request_account_id := private.current_account_id();
  if request_account_id is null then
    return jsonb_build_object('ok', false, 'error', 'account_required');
  end if;

  select receipts.*
  into existing_receipt
  from public.list_mutation_receipts receipts
  where receipts.operation_id = requested_operation_id;

  if existing_receipt.operation_id is not null then
    if existing_receipt.account_id <> request_account_id
      or existing_receipt.list_id <> requested_list_id
      or existing_receipt.mutation_type <> requested_type then
      return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
    end if;
    return existing_receipt.result;
  end if;

  select accounts.display_name, accounts.avatar_url
  into actor_display_name, actor_avatar_url
  from public.accounts accounts
  where accounts.id = request_account_id;

  if requested_type = 'create_list' then
    insert into public.shopping_lists (
      id,
      name,
      owner_user_id,
      updated_by_user_id,
      revision
    )
    values (
      requested_list_id,
      left(coalesce(nullif(trim(requested_payload ->> 'name'), ''), 'Dein Zettel'), 120),
      request_account_id,
      request_account_id,
      1
    )
    on conflict (id) do nothing
    returning revision into list_revision_value;

    if list_revision_value is null then
      return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
    end if;

    insert into public.list_members (
      list_id,
      user_id,
      display_name,
      avatar_url,
      role
    )
    values (
      requested_list_id,
      request_account_id,
      coalesce(actor_display_name, 'Gast'),
      coalesce(actor_avatar_url, ''),
      'owner'
    )
    on conflict (list_id, user_id) do update
    set display_name = excluded.display_name,
        avatar_url = excluded.avatar_url,
        role = 'owner',
        removed_at = null,
        removed_by_user_id = null;
  else
    select lists.*
    into list_row
    from public.shopping_lists lists
    where lists.id = requested_list_id
    for update;

    if list_row.id is null or list_row.deleted_at is not null then
      return jsonb_build_object('ok', false, 'error', 'list_deleted');
    end if;

    if list_row.owner_user_id = request_account_id then
      member_role := 'owner';
      member_removed_at := null;
    else
      select members.role, members.removed_at
      into member_role, member_removed_at
      from public.list_members members
      where members.list_id = requested_list_id
        and members.user_id = request_account_id;
    end if;

    if member_role is null or member_removed_at is not null then
      return jsonb_build_object('ok', false, 'error', 'membership_removed');
    end if;

    if requested_type in ('rename_list', 'upsert_item', 'delete_item')
      and member_role not in ('owner', 'editor') then
      return jsonb_build_object('ok', false, 'error', 'forbidden');
    end if;

    if requested_type = 'rename_list' then
      update public.shopping_lists lists
      set name = left(coalesce(nullif(trim(requested_payload ->> 'name'), ''), lists.name), 120),
          updated_at = now(),
          updated_by_user_id = request_account_id,
          revision = lists.revision + 1
      where lists.id = requested_list_id
      returning lists.revision into list_revision_value;

    elsif requested_type = 'upsert_item' then
      item_id_value := trim(coalesce(requested_payload ->> 'itemId', ''));
      if item_id_value = ''
        or (requested_payload ? 'quantity' and coalesce(requested_payload ->> 'quantity', '') !~ '^[0-9]{1,2}$')
        or (requested_payload ? 'done' and requested_payload ->> 'done' not in ('true', 'false')) then
        return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
      end if;

      quantity_value := coalesce((requested_payload ->> 'quantity')::integer, 1);
      if quantity_value < 1 or quantity_value > 99 then
        return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
      end if;
      done_value := coalesce((requested_payload ->> 'done')::boolean, false);

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
      values (
        requested_list_id,
        item_id_value,
        nullif(requested_payload ->> 'productId', ''),
        coalesce(requested_payload ->> 'name', ''),
        coalesce(requested_payload ->> 'shelfId', ''),
        coalesce(requested_payload ->> 'shelfTitle', ''),
        coalesce(requested_payload ->> 'shelfIcon', ''),
        quantity_value,
        done_value,
        coalesce(requested_payload ->> 'note', ''),
        request_account_id,
        coalesce(actor_display_name, 'Gast'),
        coalesce(actor_avatar_url, ''),
        case when done_value then request_account_id else null end,
        case when done_value then now() else null end,
        request_account_id,
        now(),
        null,
        null,
        1
      )
      on conflict (list_id, item_id) do update
      set product_id = excluded.product_id,
          name = excluded.name,
          shelf_id = excluded.shelf_id,
          shelf_title = excluded.shelf_title,
          shelf_icon = excluded.shelf_icon,
          quantity = excluded.quantity,
          done = excluded.done,
          note = excluded.note,
          checked_by_user_id = excluded.checked_by_user_id,
          checked_at = excluded.checked_at,
          updated_by_user_id = request_account_id,
          updated_at = now(),
          deleted_at = null,
          deleted_by_user_id = null,
          revision = public.list_items.revision + 1;

      update public.shopping_lists lists
      set updated_at = now(),
          updated_by_user_id = request_account_id,
          revision = lists.revision + 1
      where lists.id = requested_list_id
      returning lists.revision into list_revision_value;

    elsif requested_type = 'delete_item' then
      item_id_value := trim(coalesce(requested_payload ->> 'itemId', ''));
      if item_id_value = '' then
        return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
      end if;

      update public.list_items items
      set deleted_at = now(),
          deleted_by_user_id = request_account_id,
          updated_by_user_id = request_account_id,
          updated_at = now(),
          revision = items.revision + 1
      where items.list_id = requested_list_id
        and items.item_id = item_id_value
        and items.deleted_at is null;

      if not found then
        return jsonb_build_object('ok', false, 'error', 'invalid_mutation');
      end if;

      update public.shopping_lists lists
      set updated_at = now(),
          updated_by_user_id = request_account_id,
          revision = lists.revision + 1
      where lists.id = requested_list_id
      returning lists.revision into list_revision_value;

    elsif requested_type = 'delete_list' then
      if member_role <> 'owner' or list_row.owner_user_id <> request_account_id then
        return jsonb_build_object('ok', false, 'error', 'forbidden');
      end if;

      update public.shopping_lists lists
      set deleted_at = now(),
          deleted_by_user_id = request_account_id,
          updated_at = now(),
          updated_by_user_id = request_account_id,
          revision = lists.revision + 1
      where lists.id = requested_list_id
      returning lists.revision into list_revision_value;

    elsif requested_type = 'leave_list' then
      if list_row.owner_user_id = request_account_id then
        return jsonb_build_object('ok', false, 'error', 'forbidden');
      end if;

      update public.list_members members
      set removed_at = now(),
          removed_by_user_id = request_account_id
      where members.list_id = requested_list_id
        and members.user_id = request_account_id
        and members.removed_at is null;

      if not found then
        return jsonb_build_object('ok', false, 'error', 'membership_removed');
      end if;

      update public.shopping_lists lists
      set updated_at = now(),
          updated_by_user_id = request_account_id,
          revision = lists.revision + 1
      where lists.id = requested_list_id
      returning lists.revision into list_revision_value;
    end if;
  end if;

  result_value := jsonb_build_object(
    'ok', true,
    'operationId', requested_operation_id,
    'listId', requested_list_id,
    'listRevision', list_revision_value
  );

  insert into public.list_mutation_receipts (
    operation_id,
    account_id,
    list_id,
    mutation_type,
    result
  )
  values (
    requested_operation_id,
    request_account_id,
    requested_list_id,
    requested_type,
    result_value
  );

  return result_value;
end;
$$;

revoke all on function public.apply_list_mutation_v3(uuid, text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.apply_list_mutation_v3(uuid, text, text, jsonb)
  to authenticated;
