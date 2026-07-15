# Device Account Reset and Reliable Sync Design

Date: 2026-07-13
Status: Approved in conversation

## Purpose

Restore a clean account state without deleting Maike's valid account, make device pairing work reliably on previously used iPhones, and prevent stale local data from recreating deleted shopping lists. Add regression tests and a deployment gate so the same class of failure cannot silently reach production again.

## Current Findings

- The database currently contains multiple anonymous accounts and historical list records created during earlier pairing and authentication attempts.
- Maike is represented by exactly one account:
  - account ID: `91c32055-3dce-4fcb-86d8-a22a624f921a`
  - username: `user-6074F68`
  - display name: `Maike`
  - one device, one owned active list, and one active membership at the time of inspection
- The current iPhone failure is caused by the ordering of device pairing. The app first bootstraps a permanent temporary account and only then requests pairing. Pairing is rejected when that account already owns or has joined a list.
- Invalid refresh tokens can cause a new anonymous identity to be created. Existing browser data remains on the device and can later be associated with an unintended account.
- Current list persistence can attempt an insert after an update returns no visible row. Under access-policy or identity mismatches this produces repeated duplicate-key errors.
- Full-list snapshot uploads allow stale local state to compete with newer server state.

## Scope

### Included

- Back up existing collaboration data before cleanup.
- Preserve Maike's account and all valid records connected to it.
- Remove all other accounts and their obsolete collaboration data.
- Revoke obsolete authentication sessions and clear obsolete anonymous users.
- Invalidate stale account-scoped browser data with a new data epoch while preserving a verified valid authentication session.
- Process device pairing before creating a permanent account on a new device.
- Replace full-list snapshot synchronization with ordered item-level mutations.
- Make deletion resistant to stale-device resurrection.
- Add automated regression checks and a deployment gate.

### Not included

- New shopping, pricing, market, catalogue, or icon features.
- Changes to normal shared-list invitation links, except regression coverage.
- A redesign of the visual appearance.
- Migration of obsolete accounts into the new primary account.

## Safety Rules

1. The cleanup must abort unless exactly one account matches Maike's protected account ID and its expected identity fields.
2. A local, timestamped export of affected accounts, devices, lists, memberships, items, pairings, and relevant authentication identifiers must exist before deletion begins.
3. The complete schema bootstrap file must not be rerun as a reset mechanism.
4. The cleanup must be a dedicated, reviewed administrative operation. It must never run automatically during deployment or app startup.
5. Maike's account row, device row, owned list, list items, and valid memberships must be counted before and after cleanup. Any difference aborts or rolls back the database portion.
6. No service-role or administrative credential may be added to browser code or committed to the repository.

## Controlled Reset

The reset runs in explicit stages:

1. Inventory and export the current collaboration state.
2. Resolve the authentication user linked to Maike's protected device and place both the account ID and authentication user ID on a protection list.
3. Delete non-protected list items, memberships, lists, pairings, recovery credentials, devices, and accounts in dependency order.
4. Revoke and remove non-protected authentication sessions and anonymous users through an administrative path.
5. Verify that only protected collaboration data remains and that all foreign references are valid.
6. Increase `dataEpoch` in the public configuration. On the next load, each device first verifies its authentication session. It preserves a valid protected session, removes caches belonging to other accounts, and clears authentication only when the session is invalid or belongs to a deleted account.
7. Start a fresh primary account on the Mac. No shopping list is automatically created.
8. Protect the new primary account with the existing recovery mechanism.
9. Pair the iPhone to the new primary account before creating or joining lists on that iPhone.

If no lists exist after activation, the app displays only the centered `Neuer Zettel` action.

## Device Pairing Flow

### New device

1. The app reads and validates the pairing ID and secret from the URL before normal account activation.
2. The pairing payload remains available until success, cancellation, or expiry. It is not discarded immediately after parsing.
3. Supabase creates or restores only the anonymous authentication session required to identify the physical browser installation.
4. The app requests pairing without bootstrapping a permanent account and without loading or publishing local lists.
5. The existing device displays the new device label and comparison code.
6. The owner approves the request.
7. The pairing request performs a read-only safety preflight. It returns `account_in_use` immediately for a known non-empty requester account; otherwise it records only the pending request and never deletes, detaches, or reassigns account data.
8. The owner's approval is the single atomic finalization point. It locks the pairing and pending identity, rechecks the complete current-account state, and only then either attaches an unbootstrapped identity, reassigns a truly empty one-device transition account, or returns `account_in_use` without changing that account.
9. An account is not empty when it has another device, a recovery credential, any owned list including soft-deleted history, or any membership including removed history.
10. The new device activates the target account, clears data belonging to any previous account, loads the server state, and only then enables editing and publishing.

### Previously used device

- Account-scoped caches that do not belong to the approved account are quarantined and removed.
- A verified valid authentication session is never removed merely because the local data epoch changed.
- Existing non-empty accounts are neither deleted nor silently merged by device pairing.
- If such an account is encountered, pairing stops and directs the user to the account settings. The user may keep the account or delete it there before starting pairing again.
- Retrying an expired or interrupted pairing must not create another permanent account.
- Requesting a pairing never mutates the requesting device's existing account. Empty-transition cleanup and attachment either complete together during approval or neither change is committed.
- The legacy `approve_device_pairing(uuid)` entry point remains available for cached clients but delegates to the v3 finalizer, so mixed old/new app versions cannot bypass the atomic safety checks.
- A v3 pairing-status endpoint repeats the same read-only safety check for the pending identity, so data created between request and approval is reported to the requesting device as `account_in_use` instead of leaving it waiting until expiry.

### Shared-list invitations

Shared-list invitations remain separate from device pairing. A list invite grants membership to one list; a device pairing grants access to the whole account. The URL parsers and user-facing labels must keep these operations distinct.

## Account Activation Barrier

Account activation has a strict state sequence:

1. authenticate device
2. finish pending device pairing, if present
3. resolve account
4. load remote lists and memberships
5. replace or prune local account state
6. enable edits
7. enable outbound synchronization

No timer, offline queue, focus handler, realtime handler, or UI action may publish data before step 6. A failed initial load keeps the app in a retryable read-only startup state instead of publishing cached data.

## Synchronization Model

The server is authoritative for account membership and the set of accessible lists. Client storage is a cache and an offline action queue only.

### Mutations

The client sends one explicit mutation for each user action:

- create list
- rename list
- add item
- edit item or note
- change quantity
- check or uncheck item
- delete item
- delete owned list
- leave joined list

Each server mutation:

- verifies account membership and role;
- updates exactly one logical entity;
- records the acting account and timestamp;
- atomically increments the list revision;
- returns the accepted server state or new revision.

The client no longer uploads a complete local list snapshot after every edit. This prevents an older device from replacing unrelated newer changes.

### Concurrent changes

- Mutations to different items are independent and both survive.
- When two users change the same field of the same item, the last mutation accepted by the server wins.
- A stale base revision does not overwrite the whole list. The server applies or rejects only the targeted mutation.
- After every accepted mutation, realtime invalidates the local list and triggers a fresh server read.

### Offline behavior

- Offline actions are stored as ordered, account-scoped mutation records with stable operation IDs.
- Replaying the same operation ID is idempotent and cannot duplicate an item or apply a quantity change twice.
- Replay stops on an authorization or deletion conflict and refreshes the server state before continuing.
- Queues from a different or obsolete account are never replayed after account activation or pairing.
- During device pairing or a data-epoch transition, snapshot queues and outboxes for the resolved target account are also discarded before the authoritative pull; ordinary no-pairing startup keeps the current account's queue.

### Realtime fallback

Realtime events trigger refreshes but are not the sole source of correctness. The app also refreshes after a successful write, when returning to the foreground, after connectivity returns, and at a restrained fallback interval while visible.

## Deletion Semantics

- Owners delete a list only after a confirmation prompt.
- A list deletion creates a server tombstone and invalidates all active memberships.
- Invited members use `Zettel verlassen`; this removes their membership without deleting the owner's list and does not require the owner's deletion warning.
- Item deletion also creates a tombstone or equivalent durable deletion record.
- Remote tombstones always outrank cached entities and queued stale snapshots.
- Deleted lists are pruned from local storage after refresh and cannot be republished.
- With zero accessible lists, the centered `Neuer Zettel` action is displayed and no replacement list is generated automatically.

### Account deletion

- `Mehr` -> `Account` contains a visually destructive `Account löschen` button.
- Pressing it opens a simple confirmation with `Ja` and `Abbrechen`.
- `Abbrechen` changes nothing.
- `Ja` permanently removes the current account, its owned lists and items, its memberships, recovery credentials, devices, and authentication sessions.
- Every device attached to the deleted account is signed out and returns to clean device setup.
- Device pairing never invokes account deletion. Account deletion is always a separate user action.
- A network or server failure keeps the account and local session intact and presents a retryable error.

## Error Handling

- Invalid or expired pairing: retain no permanent temporary account; offer a clean retry.
- Pairing already used: refresh account state and determine whether the device is already attached before reporting failure.
- Initial remote load failure: keep editing disabled and present retry; do not publish cache.
- Invalid refresh token: clear only the invalid authentication session, quarantine old account caches, and start a clean device-auth flow.
- Authorization failure during a mutation: discard no server data, refresh membership, and explain whether the user was removed or the list was deleted.
- Duplicate operation: return the previously accepted result through operation idempotency.
- Missing display name, avatar, network, or realtime connection must not crash startup or list rendering.

## Automated Tests

### Unit tests

- Pairing URL parsing and retention.
- Account activation state transitions and publication barrier.
- Account-scoped cache and queue isolation.
- Server-wins handling for tombstones.
- Ordered and idempotent offline mutation replay.
- Zero-list active selection and centered empty state.

### Database integration tests

- Pair a fresh anonymous auth user without creating a temporary account.
- Pair a previously used but empty device.
- Reject unsafe merging of a non-empty foreign account without deleting its data.
- Preserve Maike's protected records during a reset dry run.
- Apply simultaneous mutations to different items without data loss.
- Resolve same-item changes deterministically.
- Prevent replayed operation IDs from duplicating changes.
- Prevent a removed member from reading or mutating a list.
- Prevent a deleted list or item from being recreated by a stale client.

### Browser tests

- Start from a clean browser and create one account only.
- Start with obsolete iPhone-like local storage and verify that no old lists appear.
- Complete device pairing between two isolated browser contexts.
- Verify list invitations still work independently.
- Add, edit, check, and delete across both contexts and observe convergence.
- Verify owner deletion and invited-member leave behavior.
- Verify startup and core list functionality on an iPhone 16 Pro viewport.

## Deployment Gate

A validation command becomes the single pre-deployment entry point. It runs:

1. unit and integration tests available in the repository;
2. JavaScript syntax checks;
3. startup wiring checks;
4. service-worker cache and asset-version consistency checks;
5. browser smoke tests against a local server;
6. diff whitespace validation.

GitHub Actions runs the same command for proposed changes and before production publication. Production deployment proceeds only from the verified main branch. After publication, a smoke check loads the real GitHub Pages URL, verifies startup, and checks for browser-console errors. A failed check leaves the previous production version unchanged.

Database changes are deployed and verified separately before browser code that depends on them. The rollout order is:

1. create and test backward-compatible database functions;
2. deploy the client that uses them;
3. run the protected reset and data-epoch change in a controlled maintenance step;
4. verify Maike's account and the new primary account;
5. pair the iPhone and run a two-device acceptance test;
6. remove obsolete compatibility paths only in a later change.

## Acceptance Criteria

- Maike has the same account, device, active list, items, and valid memberships after cleanup.
- All other pre-reset accounts and obsolete collaboration records are gone.
- Reloading the app on the iPhone does not recreate or display old lists.
- Pairing the iPhone adds it to the intended account without creating a permanent extra account.
- A list change made on one device appears on the other and survives simultaneous unrelated changes.
- Deleted lists and items stay deleted after reload, offline replay, and reconnect.
- A user with no lists sees only the centered `Neuer Zettel` action.
- All automated checks pass before publication, and the production smoke test passes afterward.
