# Task 2 Report: Mirrored Profile Register Shell

## Scope

Starting commit: `b111e28 feat: refine navigation edge interactions`.

Implemented only the persistent right-side profile register shell and its state transitions. Existing profile/account content remains intact and is rendered into the new register; compact editing and avatar work were not added.

## Implementation

- Added persistent `#profileRegisterScrim`, `#profileRegister`, and `#profileRegisterContent` markup beside the options register in `index.html`.
- Added the mirrored fixed right-side material in `styles.css`: right-edge placement, `translateX(calc(100% + 12px))` closed state, zero border and shadow, gradient mask, strong backdrop blur, safe-area padding, and metallic close control. The existing global reduced-motion support applies to the new transition.
- Added `setProfileRegisterOpen(isOpen)`, `closeSideRegisters()`, and `stopProfilePairing()` in `app.js`.
- Made the profile and options registers mutually exclusive. Opening a modal also closes side registers. The close button, scrim, and Escape close the profile register.
- Moved `showProfile()` output into `#profileRegisterContent`, retained pairing/device loading and profile-save behavior, and added register-level event delegation for existing profile actions.
- Updated pairing-panel lookup so the existing pairing flow works from either the profile register or a modal.
- Replaced the obsolete full-screen-profile browser expectation with the requested mirrored-register test. Updated one existing close assertion to target `#profileRegisterCloseButton`, since the required scrim shares the same accessible label.

## RED Evidence

Command:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "mirrored right register"
```

Result before implementation: exit code `1`, one failed test. The `#profileRegister` locator did not exist and Playwright waited until the test timeout, which is the expected missing-feature failure for this locator-based test.

## GREEN Evidence

The same focused command after implementation: exit code `0`, `1 passed (2.2s)`.

Final full verification command:

```bash
PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm verify
```

Result: exit code `0`; `73` unit tests passed and `16` WebKit browser tests passed. This also ran syntax checks for the browser/runtime files and `git diff --check`.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `tests/browser/collaboration.spec.js`
- `.superpowers/sdd/task-2-report.md`

## Self-Review

- Confirmed the register is fixed to the right edge with no border or shadow and the required right-edge mask.
- Confirmed opening the profile closes options, opening options closes the profile, and modal launches close both side registers.
- Confirmed profile pairing, device, security, recovery, and deletion actions keep their existing render paths and account actions.
- Confirmed the profile polling timeout is cleared when the profile register closes.
- Confirmed the staged scope excludes untracked `.DS_Store`, `.worktrees`, and docs metadata paths.

## Concerns

- No known implementation concerns.
- SQL integration tests were not run locally; they are a separately configured CI database job and no local database URL was supplied.

## Review Findings Fixes (2026-07-18)

### RED Evidence

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "mirrored right register"
```

Exit code `1`. The browser assertion expected `env(safe-area-inset-right` in the profile register padding but received `calc(env(safe-area-inset-top, 0px) + 58px) 22px calc(env(safe-area-inset-bottom, 0px) + 28px) 54px`.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "44px targets"
```

Exit code `1`. The browser measured undersized controls in the register: `Speichern` and recovery actions at `38px`, `Verwalten` and pairing approval at `36px`, and device rename/remove at `30px`.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "delayed pairing"
```

Exit code `1`. After closing the register and releasing the delayed `create_device_pairing` RPC, `[data-device-pairing]` was rendered in the closed register (expected count `0`, received `1`).

### GREEN Evidence

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "mirrored right register"
```

Exit code `0`; `1 passed (3.0s)`.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "44px targets"
```

Exit code `0`; `1 passed (1.7s)`.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "delayed pairing"
```

Exit code `0`; `1 passed (5.4s)`.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "remain exclusive"
```

Exit code `0`; `1 passed (7.3s)`. This also verifies the existing modal pairing flow remains available.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit
```

Playwright recorded `{"status":"passed","failedTests":[]}` in `test-results/.last-run.json` after all `19` browser tests completed.

```bash
PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm verify
```

The first full-suite attempt passed all `73` unit tests but hit a timing-sensitive failure in the existing multi-context test `isolated contexts converge item mutations, preserve owner/member deletion roles, and show one centered empty action` at `tests/browser/collaboration.spec.js:1089`. Its exact focused replay was green:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "isolated contexts converge item mutations"
```

Exit code `0`; `1 passed (3.5s)`.

The final full-verification retry exited `0`. Output: `73` unit tests passed; syntax checks and `git diff --check` completed before the browser phase; Playwright completed all `19` WebKit browser tests with `{"status":"passed","failedTests":[]}`.

### Files Changed

- `app.js`
- `styles.css`
- `tests/browser/collaboration.spec.js`
- `.superpowers/sdd/task-2-report.md`

### Self-Review

- The right register now includes `env(safe-area-inset-right)` in its right padding; the existing 32px left mask fade is unchanged, and browser coverage verifies scrolling behavior.
- All buttons and inputs rendered inside `#profileRegisterContent` measure at least `44x44` CSS pixels. The device-row grid override is scoped to the profile register, leaving compact controls in other surfaces unchanged.
- Closing or superseding the profile register increments a session version. Profile pairing checks that version and open state after each await before rendering or scheduling another poll. The modal pairing path uses its existing unguarded modal behavior and is exercised by browser coverage.
- Browser coverage verifies QR, device rename/remove, and account deletion visibility; register exclusivity; close button, scrim, Escape, and modal transitions; safe-area/scrolling; target dimensions; and the delayed pairing-close race.
