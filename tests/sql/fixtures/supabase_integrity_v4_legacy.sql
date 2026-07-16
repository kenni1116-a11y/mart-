insert into public.accounts (id, username, display_name)
values
  ('e9000000-0000-4000-8000-000000000001', 'user-E900001', 'Legacy Owner'),
  ('e9000000-0000-4000-8000-000000000002', 'user-E900002', 'Legacy Member');

insert into public.shopping_lists (id, name, owner_user_id)
values (
  'integrity-v4-backfill-fixture',
  'Integrity backfill fixture',
  'e9000000-0000-4000-8000-000000000001'
);

delete from public.list_members
where list_id = 'integrity-v4-backfill-fixture';

insert into public.list_members (list_id, user_id, display_name, role)
values (
  'integrity-v4-backfill-fixture',
  'e9000000-0000-4000-8000-000000000002',
  'Legacy Member',
  'owner'
);
