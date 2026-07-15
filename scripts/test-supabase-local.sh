#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
SCHEMA_FILES=(
  "supabase/device_accounts_v2.sql"
  "supabase/device_pairing_v3.sql"
  "supabase/account_deletion_v3.sql"
  "supabase/list_mutations_v3.sql"
  "supabase/list_ownership_v3.sql"
  "supabase/supabase_integrity_v3.sql"
)

cleanup() {
  supabase stop --workdir "$ROOT" --no-backup >/dev/null 2>&1 || true
}
trap cleanup EXIT

command -v supabase >/dev/null
command -v psql >/dev/null

supabase db start --workdir "$ROOT"

for file in "${SCHEMA_FILES[@]}"; do
  psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$ROOT/$file"
done

for file in "$ROOT"/tests/sql/*.test.sql; do
  psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$file"
done
