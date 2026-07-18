# Navigation Edge And Suggestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a locally testable header, new-note action, sliding soft-edge options register, and readable manual-item suggestions.

**Architecture:** Keep the current static shell and event handlers. Change only presentation state classes, HTML glyph markup, and scoped Graphite CSS; retain the existing suggestion data and item-add flow.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node test runner, Playwright WebKit.

## Global Constraints

- Do not change Supabase, account identity, list mutations, invites, or market data.
- Keep all icon-only controls at least 44 x 44 px with German accessible names.
- Respect `prefers-reduced-motion`.
- Do not publish until the user approves the local preview.

---

### Task 1: Lock the navigation layout and animation

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `setOptionsRegisterOpen(isOpen)` and existing new-list handlers.
- Produces: `.is-open` register state, right-column profile placement, and vertical `.new-note-action` groups.

- [ ] **Step 1: Write failing WebKit assertions**

Assert that the profile button's right edge aligns with the topbar, the new-note action uses a column layout, the plus has no border or filled background, and the register changes from a negative X transform to zero while opening.

- [ ] **Step 2: Run the focused test and verify RED**

Run the navigation-focused Playwright test and expect failure from the current middle-column profile, row action, filled plus, and `display: none` register.

- [ ] **Step 3: Implement the minimal shell and CSS changes**

Pin header controls to columns one and three, replace plus SVG markup with a metallic `+` glyph, stack new-note groups, and change the register to visibility/pointer/transform state with a 32 px right-edge mask and no hard edge.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same Playwright test and expect all assertions to pass at 402 x 874 px.

### Task 2: Restore readable manual suggestions and open the preview

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: existing `renderManualSuggestions(input)` markup.
- Produces: dark `.manual-suggestions` material with readable name and category text.

- [ ] **Step 1: Write the failing suggestions test**

Create a note, type `apf` into `Eigener Artikel`, then assert that `Äpfel` and `Obst` are visible and that the suggestion background is dark with readable name contrast.

- [ ] **Step 2: Run the focused test and verify RED**

Expect failure because the current suggestion background is near-white while the name inherits light Graphite text.

- [ ] **Step 3: Implement the scoped Graphite suggestion styles**

Use a dark translucent background, Graphite border and shadow, primary product-name color, muted category color, and a dark blue selected state.

- [ ] **Step 4: Verify and start the local preview**

Run focused tests, all unit tests, syntax checks, and the complete WebKit suite. Start the local preview server and provide its URL without publishing.
