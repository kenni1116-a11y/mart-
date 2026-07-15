# Supabase Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make database integrity and release verification deterministic without exposing the production database password or testing against user data.

**Architecture:** Keep the existing Supabase account and collaboration model. Add one database-owned invariant for active-list owner membership, remove obsolete legacy RPCs, and run the existing transactional SQL suite against an ephemeral local Supabase Postgres instance in GitHub Actions.

**Tech Stack:** PostgreSQL 17, Supabase CLI 2.109.1, GitHub Actions, pnpm 11.7.0, Node.js 22, Playwright WebKit.

## Global Constraints

- Do not delete accounts, devices, lists, members, or items.
- Do not reset the production database password.
- Do not expose database, service-role, recovery, pairing, or session secrets.
- Preserve the current browser client APIs and Realtime table set.
- Apply schema changes only after a failing SQL regression test demonstrates the issue.

---

### Task 1: Define Supabase integrity regression coverage

**Files:**
- Create: `tests/sql/supabase_integrity_v3.test.sql`

**Interfaces:**
- Consumes: current production schema and the SQL scripts under `supabase/`
- Produces: a transactional test that rejects missing owner memberships, stale legacy RPCs, unsafe function grants, missing RLS, and incorrect Realtime publication membership

- [ ] **Step 1: Add a transactional SQL test for the live invariants**

  The test must start with `begin;`, raise on every failed invariant, and end with `rollback;` so it cannot retain fixtures or modify production data.

- [ ] **Step 2: Run the new test against production before the migration**

  Run the SQL through the authenticated Supabase SQL tool.

  Expected: FAIL because one active legacy list has no owner membership and the obsolete `shared_list_*` functions still exist.

- [ ] **Step 3: Commit the failing regression test**

  ```bash
  git add tests/sql/supabase_integrity_v3.test.sql
  git commit -m "test: define Supabase integrity invariants"
  ```

### Task 2: Enforce owner membership and retire legacy RPCs

**Files:**
- Create: `supabase/supabase_integrity_v3.sql`
- Test: `tests/sql/supabase_integrity_v3.test.sql`

**Interfaces:**
- Consumes: `public.shopping_lists`, `public.list_members`, `public.accounts`
- Produces: `private.ensure_list_owner_membership()` and trigger `shopping_lists_ensure_owner_membership`

- [ ] **Step 1: Add the owner-membership trigger and non-destructive backfill**

  The trigger runs after list insertion or owner change, upserts the current owner as an active `owner` member, and uses the account display name/avatar. The one-time backfill performs the same upsert for all non-deleted lists.

- [ ] **Step 2: Drop only obsolete pre-v2 shared-list functions**

  Remove `join_shared_list`, `leave_shared_list`, `shared_list_has_member`, and `shared_list_has_removed_member`. Do not change the active `*_shopping_list` or v3 RPCs used by `app.js`.

- [ ] **Step 3: Apply one reviewed production migration**

  Apply `supabase/supabase_integrity_v3.sql` as migration `enforce_supabase_integrity_v3` through Supabase MCP.

- [ ] **Step 4: Rerun all five SQL tests**

  Expected: every file under `tests/sql/*.test.sql` completes and rolls back; the integrity query reports zero active lists without exactly one owner membership.

- [ ] **Step 5: Commit the migration**

  ```bash
  git add supabase/supabase_integrity_v3.sql
  git commit -m "fix: enforce Supabase list integrity"
  ```

### Task 3: Move release SQL tests off production

**Files:**
- Create: `supabase/config.toml`
- Create: `scripts/test-supabase-local.sh`
- Modify: `package.json`
- Modify: `.github/workflows/verify-and-deploy.yml`
- Modify: `tests/release-wiring.test.js`

**Interfaces:**
- Consumes: ordered schema scripts and every `tests/sql/*.test.sql` file
- Produces: `pnpm test:sql:local`, which starts local Postgres 17, applies the same production schema sequence, and runs the transactional suite

- [ ] **Step 1: Add a failing release-wiring assertion**

  Require the workflow to install Supabase CLI `2.109.1`, run `pnpm test:sql:local`, and not reference `SUPABASE_DB_URL`.

- [ ] **Step 2: Run the release-wiring test**

  ```bash
  node --test tests/release-wiring.test.js
  ```

  Expected: FAIL until the workflow is changed.

- [ ] **Step 3: Add the local Supabase test runner**

  Start `supabase db start`, apply schema files in this exact order, then execute all SQL tests with `ON_ERROR_STOP=1`:

  1. `device_accounts_v2.sql`
  2. `device_pairing_v3.sql`
  3. `account_deletion_v3.sql`
  4. `list_mutations_v3.sql`
  5. `list_ownership_v3.sql`
  6. `supabase_integrity_v3.sql`

- [ ] **Step 4: Wire GitHub Actions to the local database**

  Use `supabase/setup-cli@v1` with version `2.109.1`. Run the local SQL suite after `pnpm verify` for both pull requests and `main` pushes. Keep deployment dependent on successful verification.

- [ ] **Step 5: Run local checks that do not require Docker**

  ```bash
  pnpm verify
  bash -n scripts/test-supabase-local.sh
  git diff --check
  ```

  Expected: all checks pass. The full local database command is verified by GitHub Actions because Docker is unavailable in the desktop shell.

- [ ] **Step 6: Commit CI hardening**

  ```bash
  git add supabase/config.toml scripts/test-supabase-local.sh package.json .github/workflows/verify-and-deploy.yml tests/release-wiring.test.js
  git commit -m "ci: test Supabase without production credentials"
  ```

### Task 4: Release verification

**Files:**
- Modify if required by findings only: files from Tasks 1-3

**Interfaces:**
- Consumes: completed branch and production Supabase project
- Produces: a green pull-request workflow and a deployable `main`

- [ ] **Step 1: Recheck live migration state, RLS, grants, Realtime publication, and relational integrity**

- [ ] **Step 2: Run `pnpm verify`, syntax checks, and `git diff --check` locally**

- [ ] **Step 3: Push the branch and open a pull request**

- [ ] **Step 4: Require the GitHub verification job to pass, including local Supabase SQL tests**

- [ ] **Step 5: Merge only after all checks pass, then run the production smoke test**

