# Pinnwand Navigation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved symmetrical header, left options register, full-screen profile, centered new-note action, circular note actions, and integrated active notch.

**Architecture:** Reuse the current static HTML shell, existing modal layer, and account/pairing services. Add presentation-state helpers around the existing UI rather than changing Supabase, list mutation, or account ownership logic.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node test runner, Playwright WebKit.

## Global Constraints

- Do not change Supabase SQL, account identity, list synchronization, invite behavior, or market data.
- Keep the iPhone status bar visible and blend it into the Graphite background.
- All icon-only controls require German accessible names and 44 x 44 px touch targets.
- Respect `prefers-reduced-motion`.

---

### Task 1: Lock the approved shell and register behavior

**Files:**
- Modify: `tests/visual-theme.test.js`
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: existing `showBackgroundOptions()`, `showDataTools()`, `showImprint()`, and `showBugreport()` functions.
- Produces: `setOptionsRegisterOpen(open: boolean)` and direct register controls.

- [ ] **Step 1: Write failing static and WebKit tests**

Assert that `Mehr` is absent, direct option controls exist, menu/profile remain separate, the register opens and closes, direct option routing works, and its material is contained at 393 and 430 px.

- [ ] **Step 2: Run tests and confirm RED**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node --test tests/visual-theme.test.js && PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec playwright test tests/browser/collaboration.spec.js -g "options register"`

Expected: failure because the old three-button `Mehr` menu is still present.

- [ ] **Step 3: Implement the shell and register**

Add direct controls for background, data, imprint, and bugreport; add a dimming scrim and glass-granite close `X`; implement open/close/Escape behavior; remove `moreButton` wiring; and style the transparent-to-Graphite left register.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run the command from Step 2 and expect all selected tests to pass.

### Task 2: Build the full-screen profile using existing services

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `collaborationService.createDevicePairing()`, `listDevices()`, profile persistence, recovery actions, and account deletion.
- Produces: full-screen profile presentation with `[data-profile-page]`, `[data-profile-pairing]`, and `[data-profile-devices]` regions.

- [ ] **Step 1: Write the failing profile browser test**

Open the profile icon and assert a full-screen profile, immediate QR code, visible device list, editable name, recovery controls, and account deletion without passing through `Mehr`.

- [ ] **Step 2: Run the profile test and confirm RED**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec playwright test tests/browser/collaboration.spec.js -g "full-screen profile"`

Expected: failure because the profile currently opens the `Mehr` dialog.

- [ ] **Step 3: Implement profile presentation and hydration**

Open the modal layer in profile-page mode, render identity and loading regions immediately, request pairing and devices independently, retain retryable errors in their regions, and reuse existing event handlers for editing, recovery, devices, and deletion.

- [ ] **Step 4: Run the profile test and confirm GREEN**

Run the command from Step 2 and expect it to pass.

### Task 3: Polish note actions and verify the complete package

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `app.js`
- Modify: `styles.css`
- Modify: `app-version.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing list creation, activation, sharing, deletion, and manual-item handlers.
- Produces: centered add-note group, circular action controls, and active-notch presentation without behavior changes.

- [ ] **Step 1: Write failing layout assertions**

At 393 and 430 px, assert that the new-note group is centered in empty and populated states, icon controls are at least 44 px, action buttons remain within each note, and `Aktiv` occupies the notch bounds.

- [ ] **Step 2: Run the focused browser test and confirm RED**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm exec playwright test tests/browser/collaboration.spec.js -g "Pinnwand controls"`

Expected: failure because the populated new-note action is right-aligned and note actions still use mixed shapes.

- [ ] **Step 3: Implement minimal markup and CSS changes**

Center the add-note group in both states, separate its text label from the circular plus, convert familiar actions to icon-only circles with labels, and size the activation control to the existing notch.

- [ ] **Step 4: Raise release metadata and run full verification**

Set the next build metadata consistently, then run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm verify`.

Expected: all unit, syntax, asset, cache, and WebKit checks pass.
