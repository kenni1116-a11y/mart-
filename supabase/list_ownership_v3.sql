create or replace function public.transfer_list_ownership_v3(
  target_list_id text,
  target_user_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_user_id uuid := auth.uid();
  request_account_id uuid;
  list_row public.shopping_lists%rowtype;
  target_member public.list_members%rowtype;
begin
  if request_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'authentication_required');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(request_user_id::text, 0)
  );
  request_account_id := private.current_account_id();
  if request_account_id is null then
    return jsonb_build_object('ok', false, 'error', 'account_required');
  end if;

  select lists.*
  into list_row
  from public.shopping_lists lists
  where lists.id = target_list_id
  for update;

  if list_row.id is null or list_row.deleted_at is not null then
    return jsonb_build_object('ok', false, 'error', 'list_deleted');
  end if;
  if list_row.owner_user_id <> request_account_id then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if target_user_id is null or target_user_id = request_account_id then
    return jsonb_build_object('ok', false, 'error', 'invalid_member');
  end if;

  select members.*
  into target_member
  from public.list_members members
  where members.list_id = target_list_id
    and members.user_id = target_user_id
    and members.removed_at is null
  for update;

  if target_member.user_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_member');
  end if;

  update public.list_members members
  set role = case
    when members.user_id = target_user_id then 'owner'
    when members.user_id = request_account_id then 'editor'
    else members.role
  end
  where members.list_id = target_list_id
    and members.user_id in (request_account_id, target_user_id);

  update public.shopping_lists lists
  set owner_user_id = target_user_id,
      updated_at = now(),
      updated_by_user_id = request_account_id,
      revision = lists.revision + 1
  where lists.id = target_list_id;

  return jsonb_build_object(
    'ok', true,
    'listId', target_list_id,
    'ownerId', target_user_id,
    'previousOwnerId', request_account_id
  );
end;
$$;

revoke all on function public.transfer_list_ownership_v3(text, uuid)
  from public, anon, authenticated;
grant execute on function public.transfer_list_ownership_v3(text, uuid)
  to authenticated;
