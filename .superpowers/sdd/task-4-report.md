# Task 4 Report: Compact Avatar Editor

## Scope

- Added `avatar-logic.js` with frozen initials, six stable color palettes, and injectable WebP resize logic.
- Added the compact inline avatar editor to the mirrored profile register.
- Wired avatar logic into browser startup, offline cache, Pages assembly, release verification, and build 72.
- Added initials-token rendering, safe remove behavior, and a guarded photo-upload handoff for Task 5.

## RED

`node --test tests/avatar-logic.test.js` failed before implementation because `avatar-logic.js` did not exist.

## GREEN

- Focused pure and release wiring tests passed after the helper and wiring were added.
- Focused WebKit tests passed for initials choices, 44px targets, list rendering, and the unavailable photo-upload state.
- Full unit and WebKit suites passed after the final release-version expectation update.

## Files

- Added: `avatar-logic.js`, `tests/avatar-logic.test.js`
- Updated: `app.js`, `styles.css`, `index.html`, `sw.js`, `app-version.js`
- Updated release wiring: `scripts/assemble-pages-site.mjs`, `scripts/verify-release.mjs`, `tests/assets.test.js`, `tests/release-wiring.test.js`, `tests/startup-wiring.test.js`, `tests/app-version.test.js`
- Updated browser coverage: `tests/browser/collaboration.spec.js`

## Self-review

- Initials colors persist through the existing `upsertProfile()` path as `initials:<palette-id>` and render as initials, never as image URLs.
- Local list members and existing items update only after a successful profile synchronization; the existing server RPC propagates the saved avatar to account, membership, and contributor rows.
- Avatar actions are serialized while saving. Photo decode, compression, upload availability, and profile sync failures stay inline and leave the editor open.
- No data URLs or ad-hoc client storage were added for photos. The future upload hook is isolated at `collaborationService.uploadAvatar`.
- The compact name editor, recovery controls, pairing, devices, and account deletion paths were preserved by the full browser suite.

## Concerns

- Photo selection intentionally does not persist until Task 5 provides authenticated Supabase Storage upload and deletion methods. The current UI explains this clearly and retains the open editor.

## Review Fixes

- Changed the six palette choices to a responsive 3-by-2 grid so every 44px target remains inside the profile register at a 320px viewport.
- Completed the resize quality sequence with `0.58` and retained the smallest generated blob when none of the attempts reaches the 200KB target.
- Required `profileResult?.ok === true` before mutating any local avatar state and aligned the future upload handoff with `{ ok, avatarUrl }`.
- Replaced separate name and avatar save flags with one serialized profile-write guard. While either write is pending, both editors and all related controls remain locked and restore together.
- Made `initials:` token detection case-insensitive. Known palette IDs normalize case-insensitively and unknown IDs use the safe default palette; neither path can become an image URL.

## Review RED Evidence

- The resize test showed attempted qualities `0.86, 0.78, 0.70, 0.62, 0.54`, proving that `0.58` was absent.
- The startup wiring test found the permissive `ok === false` check and the obsolete `uploadResult.url` contract.
- The delayed name-save browser test showed that avatar controls stayed enabled during the unresolved write.
- The 320px browser bounds test showed palette swatches extending beyond the profile register.
- The delayed avatar-save browser test showed that name controls stayed enabled during the unresolved write.

## Review GREEN Evidence

- Focused pure and wiring verification: 15 passed, 0 failed.
- Focused WebKit regression verification: 3 passed, 0 failed.
- Full release verification: 78 unit/release tests and 28 WebKit browser tests passed.
- Syntax checks, cache/release wiring checks, `git diff --check`, and the Pages artifact checks all passed through `pnpm verify`.
