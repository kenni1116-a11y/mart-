# Mirrored Profile Register Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the full-screen profile page with a right-side Graphite Glass register containing compact account editing, avatar selection, account protection, pairing, device management, and account deletion.

**Architecture:** Add a persistent profile register beside the existing options register and reuse the current account handlers by rendering their content into that surface. Keep image manipulation in a small `avatar-logic.js` browser helper and keep Supabase Storage calls behind collaboration-service methods. Add one focused storage migration while preserving the existing `avatar_url` account field.

**Tech Stack:** Static HTML/CSS/JavaScript PWA, Supabase JS 2.110, PostgreSQL/Supabase Storage policies, Node test runner, Playwright WebKit.

## Global Constraints

- Preserve the current Graphite Midnight design and the approved navigation-edge changes already present in the working tree.
- The profile register opens from the right and fades to transparent across its leftmost 32 pixels without a border, shadow, or rounded edge.
- The profile register remains vertically scrollable and respects iPhone safe areas.
- Controls retain a minimum 44 by 44 pixel touch target.
- Do not change account, pairing, recovery, device, list, or item data models.
- Keep existing pairing polling, recovery flows, device actions, account deletion confirmation, and offline-safe fallbacks working.
- Selected photos are at most 512 by 512 pixels, target less than 200 KB, and use WebP when the browser supports it.
- Only one side register may be open at a time.

---

### Task 1: Preserve The Approved Navigation Baseline

**Files:**
- Modify: none
- Verify: `app.js`, `index.html`, `styles.css`, `tests/browser/collaboration.spec.js`

**Interfaces:**
- Consumes: current uncommitted navigation-edge and manual-suggestion changes.
- Produces: a clean commit that the profile work can build on without mixing unrelated edits.

- [ ] **Step 1: Review only the intended baseline files**

Run:

```bash
git diff -- app.js index.html styles.css tests/browser/collaboration.spec.js
git diff --check
```

Expected: only the approved mirrored header positions, centered metallic add control, animated options register, and dark manual suggestions appear; `git diff --check` prints nothing.

- [ ] **Step 2: Re-run the baseline checks**

Run:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test --project=webkit
```

Expected: 73 unit tests and 16 WebKit browser tests pass.

- [ ] **Step 3: Commit only the approved baseline**

```bash
git add app.js index.html styles.css tests/browser/collaboration.spec.js
git commit -m "feat: refine navigation edge interactions"
```

Expected: the four intended files are committed; unrelated `.DS_Store` and `.worktrees` paths remain untouched.

---

### Task 2: Add The Mirrored Profile Register Shell

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`
- Test: `tests/browser/collaboration.spec.js`

**Interfaces:**
- Consumes: `setOptionsRegisterOpen(isOpen)` and existing `showProfile()` content generation.
- Produces: `setProfileRegisterOpen(isOpen)`, `closeSideRegisters()`, `#profileRegister`, `#profileRegisterScrim`, and `#profileRegisterContent`.

- [ ] **Step 1: Replace the full-screen profile expectation with a failing register test**

Add a browser test that opens `#accountButton` and measures the new surface:

```js
test("profile opens as a mirrored right register", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    const register = visitor.page.locator("#profileRegister");
    const closedX = await register.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m41);
    expect(closedX).toBeGreaterThanOrEqual(100);
    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect(register).toBeVisible();
    await expect.poll(() => register.evaluate((element) => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m41))).toBeLessThanOrEqual(1);
    const material = await register.evaluate((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return {
        right: Math.abs(window.innerWidth - box.right),
        borderLeft: Number.parseFloat(style.borderLeftWidth),
        shadow: style.boxShadow,
        mask: style.maskImage || style.webkitMaskImage
      };
    });
    expect(material.right).toBeLessThanOrEqual(1);
    expect(material.borderLeft).toBe(0);
    expect(material.shadow).toBe("none");
    expect(material.mask).toContain("linear-gradient");
  } finally {
    await visitor.context.close();
    await server.close();
  }
});
```

- [ ] **Step 2: Run the new test and confirm RED**

Run:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "mirrored right register"
```

Expected: FAIL because `#profileRegister` does not exist.

- [ ] **Step 3: Add persistent profile-register markup**

Add beside `#topOptions` in `index.html`:

```html
<button class="profile-register-scrim" id="profileRegisterScrim" type="button" aria-label="Profil schließen" tabindex="-1" aria-hidden="true"></button>
<aside class="profile-register" id="profileRegister" aria-label="Profil" aria-hidden="true">
  <button class="profile-register-close" id="profileRegisterCloseButton" type="button" aria-label="Profil schließen">&times;</button>
  <h2>Profil</h2>
  <div class="profile-register-content" id="profileRegisterContent"></div>
</aside>
```

Add matching references to `elements` and add these state functions to `app.js`:

```js
function closeSideRegisters() {
  setOptionsRegisterOpen(false);
  setProfileRegisterOpen(false);
}

function setProfileRegisterOpen(isOpen) {
  if (isOpen) setOptionsRegisterOpen(false);
  elements.profileRegister.classList.toggle("is-open", isOpen);
  elements.profileRegisterScrim.classList.toggle("is-open", isOpen);
  elements.profileRegister.setAttribute("aria-hidden", String(!isOpen));
  elements.profileRegisterScrim.setAttribute("aria-hidden", String(!isOpen));
  elements.accountButton.setAttribute("aria-expanded", String(isOpen));
  elements.body.classList.toggle("has-open-profile", isOpen);
  if (!isOpen) stopProfilePairing();
}
```

`stopProfilePairing()` clears `devicePairingPollTimer` and sets it to zero. Change the account-button listener to render and open the register; wire close button, scrim, and Escape.

- [ ] **Step 4: Add mirrored register material**

Define `.profile-register` with `inset: 0 0 0 auto`, `transform: translateX(calc(100% + 12px))`, the same transition as `.top-options`, and:

```css
-webkit-mask-image: linear-gradient(to right, transparent 0%, #000 32px, #000 100%);
mask-image: linear-gradient(to right, transparent 0%, #000 32px, #000 100%);
border: 0;
border-radius: 0;
box-shadow: none;
```

Its open state uses `transform: translateX(0)`. Mirror the scrim behavior, safe-area padding, strong backdrop blur, metallic close control, and reduced-motion support from `.top-options`.

- [ ] **Step 5: Run the focused test and commit**

Run the command from Step 2. Expected: PASS.

```bash
git add index.html styles.css app.js tests/browser/collaboration.spec.js
git commit -m "feat: add mirrored profile register"
```

---

### Task 3: Build Compact Identity Editing And Account Protection

**Files:**
- Modify: `app.js`
- Modify: `styles.css`
- Test: `tests/browser/collaboration.spec.js`
- Test: `tests/startup-wiring.test.js`

**Interfaces:**
- Consumes: `#profileRegisterContent`, `cleanDisplayName`, `collaborationService.upsertProfile`, and existing recovery handlers.
- Produces: `profileRegisterMarkup()`, `setProfileNameEditing(isEditing)`, `saveProfileName()`, and `setAccountProtectionExpanded(isExpanded)`.

- [ ] **Step 1: Write failing tests for the compact account row**

Replace the old full-screen assertions with checks that:

```js
await expect(page.locator("#profileAvatarInput")).toHaveCount(0);
await expect(page.locator("#profileNameInput")).toHaveCount(0);
await expect(page.locator("[data-profile-display-name]")).toHaveText("Test 1");
await expect(page.locator("[data-profile-username]")).toContainText("test-1");
await page.locator("[data-edit-profile-name]").click();
await expect(page.locator("#profileNameInput")).toBeVisible();
await page.locator("#profileNameInput").fill("Ken Neu");
await page.locator("[data-save-profile-name]").click();
await expect(page.locator("[data-profile-display-name]")).toHaveText("Ken Neu");
```

Add a second assertion sequence that opens `[data-toggle-account-protection]`, verifies `aria-expanded="true"`, and finds the existing recovery action buttons inside `[data-account-protection-actions]`.

- [ ] **Step 2: Run and confirm RED**

Run:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "compact account|account protection"
```

Expected: FAIL because the full-screen form and separate security section still exist.

- [ ] **Step 3: Render the approved account markup**

Make `profileRegisterMarkup()` return the approved order. The identity block must contain:

```html
<section class="profile-section profile-account" aria-labelledby="profileIdentityTitle">
  <h3 id="profileIdentityTitle">Dein Account</h3>
  <div class="profile-identity-row">
    <button class="profile-avatar-button" type="button" data-edit-avatar aria-label="Avatar ändern">...</button>
    <span class="profile-identity-copy">
      <strong data-profile-display-name>...</strong>
      <small data-profile-username>...</small>
    </span>
    <button class="profile-metal-action" type="button" data-edit-profile-name aria-label="Anzeigename ändern">...</button>
  </div>
  <div data-profile-name-editor hidden></div>
  <button class="account-protection-row" type="button" data-toggle-account-protection aria-expanded="false">...</button>
  <div class="account-protection-actions" data-account-protection-actions hidden>...</div>
</section>
```

The name editor inserts a 24-character text input, metallic save check, metallic cancel control, and `[data-profile-name-status]` live region. `saveProfileName()` keeps the register open, updates list member/item display names as the old `saveProfile()` did, calls `upsertProfile`, and retains the input plus inline error on failure.

- [ ] **Step 4: Rewire recovery actions without navigation**

Reuse the existing `[data-create-recovery-code]` and `[data-open-account-recovery]` handlers. The disclosure only toggles `hidden` and `aria-expanded`; recovery confirmation dialogs continue to use `openModal`, and closing them returns to the still-open profile register.

- [ ] **Step 5: Style and verify the compact account block**

Use the approved mockup: 54-pixel avatar, two-line identity copy, 44-pixel metallic pencil/check/cancel targets, transparent Graphite input, and a border-only disclosure row. Run the focused tests and the startup wiring tests.

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/startup-wiring.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "compact account|account protection"
git add app.js styles.css tests/browser/collaboration.spec.js tests/startup-wiring.test.js
git commit -m "feat: compact profile identity and protection"
```

Expected: both commands pass.

---

### Task 4: Add Avatar Choice And Image Processing

**Files:**
- Create: `avatar-logic.js`
- Modify: `index.html`
- Modify: `sw.js`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `tests/avatar-logic.test.js`
- Test: `tests/release-wiring.test.js`
- Test: `tests/browser/collaboration.spec.js`

**Interfaces:**
- Produces: `window.MartAvatarLogic.initialsFor(name)`, `avatarColorChoices`, and `resizeAvatarFile(file, options)` returning `Promise<Blob>`.
- Consumes: browser `createImageBitmap`, canvas `toBlob`, and the upload methods added in Task 5.

- [ ] **Step 1: Write failing pure-logic tests**

Create `tests/avatar-logic.test.js` to load `avatar-logic.js` in a VM and assert:

```js
assert.equal(MartAvatarLogic.initialsFor("Ken Beispiel"), "KB");
assert.equal(MartAvatarLogic.initialsFor("  Ken  "), "K");
assert.equal(MartAvatarLogic.avatarColorChoices.length, 6);
assert.ok(MartAvatarLogic.avatarColorChoices.every((choice) => /^#[0-9a-f]{6}$/i.test(choice.color)));
```

Test `resizeAvatarFile` with injected `decodeImage`, `createCanvas`, and `encodeCanvas` fakes so a 1200 by 800 source produces a 512 by 341 target and requests `image/webp` below `200 * 1024` bytes.

- [ ] **Step 2: Run and confirm RED**

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/avatar-logic.test.js
```

Expected: FAIL because `avatar-logic.js` does not exist.

- [ ] **Step 3: Implement the helper and load it before `app.js`**

Expose a frozen `MartAvatarLogic` object. `resizeAvatarFile` calculates:

```js
const scale = Math.min(1, maxDimension / Math.max(width, height));
const targetWidth = Math.max(1, Math.round(width * scale));
const targetHeight = Math.max(1, Math.round(height * scale));
```

It attempts WebP quality from `0.86` down to `0.58` in `0.08` steps until the blob is below `targetBytes`, then returns the smallest valid blob. Add `avatar-logic.js` to `index.html` before `app.js` and to the service-worker asset list.

- [ ] **Step 4: Add the avatar choice surface**

`[data-edit-avatar]` toggles a compact inline surface containing:

```html
<input type="file" accept="image/*" data-avatar-file hidden>
<button type="button" data-choose-avatar-photo>Foto auswählen</button>
<button type="button" data-choose-avatar-initials>Initialen gestalten</button>
<button type="button" data-remove-avatar>Avatar entfernen</button>
```

The initials action reveals six swatches from `avatarColorChoices`. Store the selected palette ID in the existing `avatarUrl` value as `initials:<palette-id>`. Update `memberAvatarMarkup()` to render that token as colored initials and never as an image URL. Persist it through the existing `upsertProfile()` path so every connected device receives the same color. Add graceful inline errors for unsupported image decoding, failed compression, and offline upload.

- [ ] **Step 5: Verify helper wiring and interaction shell**

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/avatar-logic.test.js tests/release-wiring.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "avatar choices"
git add avatar-logic.js index.html sw.js app.js styles.css tests/avatar-logic.test.js tests/release-wiring.test.js tests/browser/collaboration.spec.js
git commit -m "feat: add compact avatar editor"
```

Expected: helper, cache wiring, and browser interaction tests pass.

---

### Task 5: Add Account-Scoped Supabase Avatar Storage

**Files:**
- Create: `supabase/avatar_storage_v1.sql`
- Modify: `app.js`
- Modify: `tests/browser/test-server.mjs`
- Test: `tests/startup-wiring.test.js`
- Test: `tests/browser/collaboration.spec.js`

**Interfaces:**
- Produces: `collaborationService.uploadAvatar(blob, accountId)` returning `{ ok, avatarUrl?, error? }` and `removeAvatar(accountId)` returning `{ ok, error? }`.
- Consumes: `MartAvatarLogic.resizeAvatarFile`, authenticated Supabase client, `currentUser.userId`, and existing `upsertProfile`.

- [ ] **Step 1: Write failing adapter and browser tests**

Extend the browser test adapter with an in-memory `storage` object and assert that selecting a small image:

```js
await page.locator("[data-choose-avatar-photo]").click();
await page.locator("[data-avatar-file]").setInputFiles({
  name: "avatar.png",
  mimeType: "image/png",
  buffer: smallPngBuffer
});
await expect(page.locator("[data-profile-avatar] img")).toBeVisible();
await expect(page.locator("#profileAvatarInput")).toHaveCount(0);
```

Then click `[data-remove-avatar]` and assert the image disappears and initials return.

- [ ] **Step 2: Run and confirm RED**

Run the avatar browser test. Expected: FAIL because the collaboration service has no storage methods.

- [ ] **Step 3: Create idempotent storage SQL**

`supabase/avatar_storage_v1.sql` must:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 204800, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
```

Add `select`, `insert`, `update`, and `delete` policies. Write policies compare the first object-path folder to the account ID belonging to `auth.uid()` in `public.account_devices`. Public select is allowed only for bucket `avatars`.

- [ ] **Step 4: Implement the collaboration-service storage methods**

Use one stable object path and cache-bust the public URL:

```js
const path = `${accountId}/avatar.webp`;
const bucket = this.client.storage.from("avatars");
const { error } = await bucket.upload(path, blob, { contentType: blob.type || "image/webp", upsert: true });
if (error) return { ok: false, error: error.message };
const { data } = bucket.getPublicUrl(path);
return { ok: true, avatarUrl: `${data.publicUrl}?v=${Date.now()}` };
```

Removal calls `bucket.remove([path])`; a missing object is treated as success. After upload/removal, update `currentUser.avatarUrl`, propagate it to local members/items exactly as current `saveProfile()` does, call `upsertProfile`, save, render, and leave the register open.

- [ ] **Step 5: Implement the test-server storage adapter**

Add `avatarObjects` to test state and a `storage` facade with `upload`, `remove`, and `getPublicUrl`. Expose uploaded objects through `/__test__/avatar/<account-id>/avatar.webp` so Playwright can render the image.

- [ ] **Step 6: Verify and commit**

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/startup-wiring.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "avatar"
git add supabase/avatar_storage_v1.sql app.js tests/browser/test-server.mjs tests/startup-wiring.test.js tests/browser/collaboration.spec.js
git commit -m "feat: persist account avatars"
```

Expected: storage policies are wired, upload/removal browser tests pass, and no URL input returns.

---

### Task 6: Preserve Pairing, Devices, Recovery, And Deletion In The Register

**Files:**
- Modify: `app.js`
- Modify: `styles.css`
- Test: `tests/browser/collaboration.spec.js`
- Test: `tests/startup-wiring.test.js`

**Interfaces:**
- Consumes: existing `loadProfilePairing`, `loadProfileDevices`, recovery handlers, device handlers, and `showAccountDeletionConfirmation`.
- Produces: the final ordered, scrollable profile register with all existing behaviors.

- [ ] **Step 1: Write failing regression tests for final order and behavior**

Assert the register content headings occur in this DOM order:

```js
const order = await page.locator("#profileRegisterContent").evaluate((root) =>
  [...root.querySelectorAll("[data-profile-section]")].map((section) => section.dataset.profileSection)
);
expect(order).toEqual(["account", "pairing", "devices", "danger"]);
```

Verify QR SVG, comparison status, one current device, device-management action, bottom danger action, and a 44-pixel minimum for all interactive controls. Verify options opening closes profile and profile opening closes options.

- [ ] **Step 2: Run and confirm RED**

Run the focused profile tests. Expected: FAIL until all legacy sections are moved and exclusivity is wired.

- [ ] **Step 3: Move existing content without changing service behavior**

Render pairing and devices after the account section and danger last. Change `loadProfilePairing()` and `loadProfileDevices()` to query `elements.profileRegisterContent`. Keep retry, copy link, comparison code, polling, rename, and remove handlers unchanged except for their container reference.

Before opening a recovery or account-deletion modal, keep the profile register state in memory. Closing the modal restores the register unless account deletion completes. Account deletion success closes all surfaces and returns to the account bootstrap flow.

- [ ] **Step 4: Remove the full-screen profile presentation**

Delete `presentation: "profile"`, `.modal-layer.is-profile-page`, `.profile-page`, `.profile-page-header`, `.profile-back-button`, and their obsolete event branch. Keep generic modal styles for confirmations, recovery, and other app dialogs.

- [ ] **Step 5: Verify and commit**

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/startup-wiring.test.js
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test tests/browser/collaboration.spec.js --project=webkit -g "profile|pairing|device|deletion"
git add app.js styles.css tests/browser/collaboration.spec.js tests/startup-wiring.test.js
git commit -m "feat: complete profile register workflows"
```

Expected: focused profile and account regressions pass with no full-screen profile styles or markup.

---

### Task 7: Final Verification And Local Preview

**Files:**
- Modify only if a failing check reveals a profile-register regression.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a verified local preview ready for user approval before versioning or upload.

- [ ] **Step 1: Run all unit and syntax checks**

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.js
for file in app-version.js account-logic.js sync-logic.js app-logic.js avatar-logic.js app.js supabase-config.js sw.js; do /Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check "$file"; done
```

Expected: every unit test and syntax check passes.

- [ ] **Step 2: Run the complete WebKit suite**

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/@playwright/test/cli.js test --project=webkit
```

Expected: all discovered browser tests pass, including account synchronization and list collaboration.

- [ ] **Step 3: Inspect mobile visuals at both supported widths**

Capture 393 by 874 and 430 by 932 screenshots with the register closed, open, security expanded, name editing, avatar choices, QR loaded, and danger area scrolled into view. Confirm no horizontal overflow, overlap, hard left edge, unreadable text, or clipped action.

- [ ] **Step 4: Check the final diff**

```bash
git diff --check
git status --short --branch
git diff HEAD~6 --stat
```

Expected: no whitespace errors; only planned app, test, storage, helper, and documentation files changed.

- [ ] **Step 5: Start a fresh local preview**

Use a new localhost port to avoid an old service-worker cache. Show the preview in the in-app browser. Do not bump the app version or push until the user approves the completed profile register.
