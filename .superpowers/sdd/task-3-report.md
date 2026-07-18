# Task 3 Report: Compact Identity Editing And Account Protection

## Scope

Starting commit: `1d2f374 fix: preserve profile pairing context`.

Replaced only the profile register's former always-visible name/avatar form and separate security section. Pairing, device management, recovery, and account deletion retain their existing handlers and flows. The avatar control is rendered but deliberately inert for Task 4.

## RED Evidence

Added browser coverage for compact identity rendering, save by check and Enter/Done, cancel, failed profile synchronization, and the account-protection disclosure before changing production code.

Command:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "compact account|account protection"
```

Result before implementation: exit code `1`; all `3` new tests failed for the expected missing UI.

- The compact-account test expected no `#profileAvatarInput`, but received one legacy avatar-link field.
- The failed-sync case could not reach the missing compact editor.
- The account-protection test could not find `[data-toggle-account-protection]`.

This established that the tests were exercising the legacy full form and separate security section rather than passing against existing behavior.

## Implementation

- Added `profileRegisterMarkup()` as the single renderer for the persistent profile register. It produces the compact 54px avatar button, two-line account identity, 44px pencil control, empty hidden editor host, and border-only account-protection disclosure before the retained pairing, device, and deletion sections.
- Added `setProfileNameEditing(isEditing)`, which creates the 24-character Graphite name input with metallic check and X controls only while editing, and focuses it for direct keyboard entry.
- Added `saveProfileName()`. It sends the proposed user to `collaborationService.upsertProfile` first; only a successful response updates the current user, list member names, and item attribution names. It keeps the profile register open. A failed response leaves the entered text intact and reports `Der Name konnte gerade nicht synchronisiert werden.` through the inline live region.
- Added `setAccountProtectionExpanded(isExpanded)` and preserved the existing recovery action attributes inside its hidden action group. Expanding only toggles `hidden` and `aria-expanded`; recovery dialogs retain their existing `openModal` and return-to-profile paths.
- Added Graphite-specific compact editor styling, a 54px avatar target, 44px metallic controls, transparent border-only protection row, and an explicit `[hidden]` display rule so the disclosure remains closed until selected.
- Updated the existing target-size assertion to assess visible controls, because the approved collapsed disclosure intentionally contains hidden controls. Updated the existing Graphite dialog journey to expand Account Protection before asserting the recovery action.

## GREEN Evidence

Focused task command:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "compact account|account protection"
```

Exit code `0`; `3 passed (4.7s)`.

Required wiring command:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/startup-wiring.test.js
```

Exit code `0`; `11` tests passed.

Target-size regression command:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "44px targets"
```

Exit code `0`; `1 passed (2.6s)`.

Full regression commands:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app-logic.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check sw.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check supabase-config.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit
git diff --check
```

Results: exit code `0`; `74` unit tests passed, all four JavaScript syntax checks passed, `24` WebKit browser tests passed, and `git diff --check` was clean.

During the first full browser run, one existing Graphite dialog assertion failed because it still expected the recovery action to be permanently visible. The test was updated to open the required disclosure; its focused replay passed, then the complete `24`-test browser suite passed.

## Files

- `app.js`
- `styles.css`
- `tests/browser/collaboration.spec.js`
- `tests/startup-wiring.test.js`
- `.superpowers/sdd/task-3-report.md`

## Self-Review

- Confirmed that `#profileAvatarInput` and the legacy full-screen editor are absent until the compact editor is explicitly opened.
- Confirmed that pencil/edit, metallic check, Enter/Done, and X/cancel have separate covered behavior; successful save leaves the register open.
- Confirmed that sync failure does not mutate the displayed current name, preserves the input, re-enables the controls, and uses the inline live region rather than `window.alert`.
- Confirmed that the display-name update still propagates to current list members and item attribution, while avatar data remains unchanged until Task 4.
- Confirmed the protection disclosure starts collapsed, switches `aria-expanded`, exposes the existing recovery action selectors, and does not close the register.
- Confirmed visible profile-register buttons and inputs remain at least `44x44` CSS pixels.
- Confirmed pairing, device, recovery, and deletion flows through the full browser suite; no untracked `.DS_Store`, `.worktrees`, or docs metadata path is staged.

## Concerns

- No known implementation concerns.
- Avatar selection and storage are intentionally deferred to Task 4; its button is present but has no action handler.
