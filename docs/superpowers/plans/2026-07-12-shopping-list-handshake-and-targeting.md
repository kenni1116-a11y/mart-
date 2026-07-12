# Shopping List Handshake and Targeting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize Supabase list publishing and add immediate QR joining, explicit shopping-list activation, estimated list value, and manual-item suggestions.

**Architecture:** Keep the static, build-free app and add one UMD-style `app-logic.js` module for deterministic logic that can run in both the browser and Node tests. `app.js` continues to own state, DOM, and Supabase orchestration; the service worker caches the new asset and all browser entrypoints use one new cache/version number.

**Tech Stack:** Vanilla JavaScript, HTML, CSS, Supabase JS 2.110.0, qrcode-generator 1.4.4, Node built-in `node:test`, Playwright/browser QA.

## Global Constraints

- Scanning the shopping-list QR code completes joining immediately; there is no owner approval step.
- Only the explicit activation button changes the target for market products.
- Estimated value is the cheapest known price times quantity; unpriced items are counted but excluded from the sum.
- Manual suggestions combine catalog products and item names from locally available lists, deduplicate names, and show at most five results.
- No Supabase schema change is introduced.
- Preserve existing uncommitted `app.js` and `sw.js` fixes and exclude `.DS_Store` from commits.
- Push the completed branch to `origin` after all checks pass.

---

### Task 1: Add tested deterministic app logic

**Files:**
- Create: `app-logic.js`
- Create: `tests/app-logic.test.js`

**Interfaces:**
- Produces: `window.MartLogic` and `module.exports` with `estimateListValue(items, prices)`, `buildManualSuggestions(query, catalogItems, historyItems, limit)`, `mapWithConcurrency(items, limit, worker)`, `rotateInviteWithRollback(options)`, and `chooseActiveListId(currentId, availableIds, preferredId)`.
- Consumes: plain arrays and injected callbacks only; no DOM or Supabase dependency.

- [ ] **Step 1: Write failing tests for value estimation and suggestions**

Create `tests/app-logic.test.js` using `node:test`. Assert that quantities are multiplied by the cheapest duplicate price, manual items without prices increase `missingItemCount`, accent-insensitive prefix matches outrank substring matches, duplicate names collapse, catalog entries win over historical entries, and results stop at five.

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const logic = require("../app-logic.js");

test("estimateListValue uses the cheapest price and item quantity", () => {
  const result = logic.estimateListValue(
    [{ id: "milk", quantity: 2 }, { id: "manual:1", quantity: 4 }],
    [{ productId: "milk", price: 1.79 }, { productId: "milk", price: 1.49 }]
  );
  assert.deepEqual(result, { total: 2.98, pricedItemCount: 1, missingItemCount: 1, currency: "EUR" });
});

test("buildManualSuggestions prefers catalog prefixes and removes duplicate names", () => {
  const result = logic.buildManualSuggestions(
    "apf",
    [{ id: "fruit:apple", name: "Äpfel", shelfTitle: "Obst" }],
    [{ id: "manual:old", name: "Äpfel" }, { id: "manual:juice", name: "Apfelsaft" }],
    5
  );
  assert.deepEqual(result.map((entry) => [entry.name, entry.source]), [["Äpfel", "catalog"], ["Apfelsaft", "history"]]);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/app-logic.test.js
```

Expected: failure because `app-logic.js` does not exist.

- [ ] **Step 3: Add failing tests for concurrency, rollback, and active-list choice**

Add tests that record the maximum number of simultaneous workers, verify results preserve input order, verify worker errors reject with the original message, verify a failed invite persist restores `inviteCode`, `updatedAt`, `updatedByUserId`, and `revision`, and verify a valid current active ID is retained while an empty/removed active ID falls back deterministically.

```js
test("mapWithConcurrency never exceeds its worker limit", async () => {
  let active = 0;
  let maximum = 0;
  const result = await logic.mapWithConcurrency([1, 2, 3, 4], 2, async (value) => {
    active += 1;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return value * 2;
  });
  assert.equal(maximum, 2);
  assert.deepEqual(result, [2, 4, 6, 8]);
});

test("mapWithConcurrency propagates worker errors", async () => {
  await assert.rejects(
    logic.mapWithConcurrency([1, 2], 2, async (value) => {
      if (value === 2) throw new Error("write failed");
      return value;
    }),
    /write failed/
  );
});

test("rotateInviteWithRollback restores list metadata after a failed persist", async () => {
  const list = { inviteCode: "old", updatedAt: "before", updatedByUserId: "owner", revision: 4 };
  const success = await logic.rotateInviteWithRollback({
    target: list,
    nextCode: "new",
    mutate(target, code) {
      Object.assign(target, { inviteCode: code, updatedAt: "after", updatedByUserId: "device", revision: 5 });
    },
    persist: async () => false,
    rollback: () => {}
  });
  assert.equal(success, false);
  assert.deepEqual(list, { inviteCode: "old", updatedAt: "before", updatedByUserId: "owner", revision: 4 });
});

test("chooseActiveListId keeps a valid target and only uses preferred when none is valid", () => {
  assert.equal(logic.chooseActiveListId("a", ["a", "b"], "b"), "a");
  assert.equal(logic.chooseActiveListId("", ["a", "b"], "b"), "b");
  assert.equal(logic.chooseActiveListId("missing", ["a", "b"]), "a");
});
```

- [ ] **Step 4: Implement the minimal UMD module**

Implement `app-logic.js` with no browser-only globals inside the factory. Normalize search strings with `normalize("NFD")` and removal of combining marks, choose the minimum finite non-negative price per product, score prefix matches before substring matches, use a shared cursor across `Math.min(limit, items.length)` async runners, snapshot the four invitation fields before mutation, and restore them plus call `rollback` whenever `persist` returns false or throws.

Use this complete implementation shape:

```js
(function exposeMartLogic(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MartLogic = api;
})(typeof globalThis === "object" ? globalThis : this, () => {
  function normalizedSearchValue(value) {
    return String(value ?? "")
      .trim()
      .toLocaleLowerCase("de")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll("ß", "ss");
  }

  function estimateListValue(items = [], prices = []) {
    const cheapestByProduct = new Map();
    prices.forEach((entry) => {
      const amount = Number(entry?.price);
      if (!entry?.productId || !Number.isFinite(amount) || amount < 0) return;
      const current = cheapestByProduct.get(entry.productId);
      if (!current || amount < current.price) {
        cheapestByProduct.set(entry.productId, {
          price: amount,
          currency: typeof entry.currency === "string" && entry.currency ? entry.currency : "EUR"
        });
      }
    });
    let total = 0;
    let pricedItemCount = 0;
    let missingItemCount = 0;
    let currency = "EUR";
    items.forEach((item) => {
      const price = cheapestByProduct.get(item?.id);
      if (!price) {
        missingItemCount += 1;
        return;
      }
      total += price.price * Math.max(1, Number(item.quantity) || 1);
      pricedItemCount += 1;
      currency = price.currency;
    });
    return {
      total: Number(total.toFixed(2)),
      pricedItemCount,
      missingItemCount,
      currency
    };
  }

  function buildManualSuggestions(query, catalogItems = [], historyItems = [], limit = 5) {
    const needle = normalizedSearchValue(query);
    if (!needle) return [];
    const byName = new Map();
    [[catalogItems, "catalog"], [historyItems, "history"]].forEach(([items, source]) => {
      items.forEach((item) => {
        const nameKey = normalizedSearchValue(item?.name);
        if (!nameKey || byName.has(nameKey)) return;
        byName.set(nameKey, { ...item, source, nameKey });
      });
    });
    return Array.from(byName.values())
      .filter((item) => item.nameKey.includes(needle))
      .sort((first, second) => {
        const prefixDifference = Number(!first.nameKey.startsWith(needle)) - Number(!second.nameKey.startsWith(needle));
        if (prefixDifference) return prefixDifference;
        const sourceDifference = Number(first.source !== "catalog") - Number(second.source !== "catalog");
        return sourceDifference || first.name.localeCompare(second.name, "de");
      })
      .slice(0, Math.max(0, Number(limit) || 0))
      .map(({ nameKey, ...item }) => item);
  }

  async function mapWithConcurrency(items = [], limit = 1, worker) {
    const source = Array.isArray(items) ? items : [];
    if (!source.length) return [];
    const results = new Array(source.length);
    let cursor = 0;
    async function runNext() {
      while (cursor < source.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(source[index], index);
      }
    }
    const runnerCount = Math.min(source.length, Math.max(1, Math.floor(Number(limit) || 1)));
    await Promise.all(Array.from({ length: runnerCount }, () => runNext()));
    return results;
  }

  async function rotateInviteWithRollback({ target, nextCode, mutate, persist, rollback }) {
    const snapshot = {
      inviteCode: target.inviteCode,
      updatedAt: target.updatedAt,
      updatedByUserId: target.updatedByUserId,
      revision: target.revision
    };
    try {
      mutate(target, nextCode);
      if (await persist(target)) return true;
    } catch {
      // The caller presents the connection error after state is restored.
    }
    Object.assign(target, snapshot);
    await rollback?.(target);
    return false;
  }

  function chooseActiveListId(currentId, availableIds = [], preferredId = "") {
    const ids = availableIds.filter((id) => typeof id === "string" && id);
    if (ids.includes(currentId)) return currentId;
    if (ids.includes(preferredId)) return preferredId;
    return ids[0] ?? "";
  }

  return {
    estimateListValue,
    buildManualSuggestions,
    mapWithConcurrency,
    rotateInviteWithRollback,
    chooseActiveListId
  };
});
```

- [ ] **Step 5: Run the tests and commit**

Run the Node test command and expect all Task 1 tests to pass. Commit only `app-logic.js` and `tests/app-logic.test.js` with message `Add tested shopping list logic`.

---

### Task 2: Fix list publishing and invitation rollback

**Files:**
- Modify: `app.js:1700-1765`
- Modify: `app.js:2926-2945`
- Modify: `app.js:3802-3842`
- Modify: `app.js:3913-3921`
- Test: `tests/app-logic.test.js`

**Interfaces:**
- Consumes: `MartLogic.mapWithConcurrency` and `MartLogic.rotateInviteWithRollback` from Task 1.
- Produces: bounded list-row persistence and an invitation modal renderer that is called only after a confirmed online write.

- [ ] **Step 1: Re-run the concurrency regression tests before integration**

Run the `mapWithConcurrency` tests with `--test-name-pattern mapWithConcurrency` and confirm that bounded execution, input-order preservation, and original error propagation are green before wiring the helper into Supabase publishing.

- [ ] **Step 2: Replace serial owned-list persistence**

Replace the `for (const row of ownedListRows)` loop with:

```js
const listResults = await MartLogic.mapWithConcurrency(
  ownedListRows,
  3,
  (row) => this.persistOwnedListRow(row)
);
const failedListResult = listResults.find((result) => !result.ok);
if (failedListResult) return failedListResult;
```

Keep member and item writes after this block so their parent list rows exist first.

- [ ] **Step 3: Separate rendering from publishing**

Extract `openShareListModal(listData)` from the successful half of `shareList`. It creates the URL, QR data, invitation code, and modal markup but performs no mutation or network request. Change the normal share publish call to:

```js
const published = await publishListSnapshot([listData], "share", { queueOnFail: false });
```

On failure, retain the existing alert and do not enqueue a latent invitation write.

- [ ] **Step 4: Make invitation regeneration transactional**

Make `regenerateInvite` async and call `MartLogic.rotateInviteWithRollback` with injected `touchList`, `save({ broadcast: false })`, and `publishListSnapshot([listData], "share", { queueOnFail: false })`. The rollback callback saves the restored list locally without broadcast. On success call `openShareListModal(listData)`; on failure show the same connection alert.

- [ ] **Step 5: Verify and commit**

Run all Node tests, `node --check app.js`, and `git diff --check`. Commit `app.js` plus the Task 2 test update with message `Stabilize list and invite publishing`.

---

### Task 3: Add explicit active-list targeting

**Files:**
- Modify: `app.js:2401-2404`
- Modify: `app.js:3731-3763`
- Modify: `app.js:4805-4848`
- Modify: `app.js:5132-5155`
- Modify: `app.js:5507-5647`
- Modify: `styles.css:470-555`
- Test: `tests/app-logic.test.js`

**Interfaces:**
- Consumes: `MartLogic.chooseActiveListId`.
- Produces: `activateList(id)` as the only user action that changes a valid active target; `addToList(product, listId = activeListId)` for explicit routing.

- [ ] **Step 1: Add active-target regression assertions**

Extend the active-list test with deletion and creation cases: removing the active ID chooses the first remaining list; adding a preferred new ID does not replace a valid current ID; an empty set returns an empty string. Run and verify RED for any missing case.

- [ ] **Step 2: Route additions explicitly**

Change `addToList(product)` to `addToList(product, listId = activeListId)` and resolve with `listById(listId)` without changing `activeListId`. Change `addManualItem` to call `addToList(manualProduct, listId)` and remove `activeListId = listId`. Market and favorite buttons continue calling `addToList(product)` and therefore use only the active target.

- [ ] **Step 3: Preserve activation across creation and joining**

Use `chooseActiveListId` in `loadAccountActiveListId`, after adding a list, after joining an invited list, and after local removal. A valid current target must survive creation and joining; a new/joined list becomes active only when no valid active target exists.

- [ ] **Step 4: Replace implicit card selection with an explicit button**

Rename `selectList` to `activateList`. Add a button at the beginning of each card:

```html
<button class="list-activation-button ${isActive ? "is-active" : ""}"
        type="button"
        aria-pressed="${isActive}"
        data-activate-list="LIST_ID">
  ${isActive ? "Aktiv" : "Für Einkäufe aktivieren"}
</button>
```

Remove the card background click listener that called `selectList`. Bind only `[data-activate-list]` to `activateList`.

- [ ] **Step 5: Style activation and commit**

Give the active card a light-blue/white border and soft shadow, position the elongated button centered over the top edge, provide visible keyboard focus and a minimum 40px touch height, and retain the shared-list color treatment. Run tests, syntax, and diff checks. Commit `app.js`, `styles.css`, and tests with message `Add explicit shopping list activation`.

---

### Task 4: Render list value and manual-item suggestions

**Files:**
- Modify: `app.js:3131-3165`
- Modify: `app.js:4805-4848`
- Modify: `app.js:5472-5647`
- Modify: `styles.css:599-689`
- Modify: `styles.css:1369-1554`
- Test: `tests/app-logic.test.js`

**Interfaces:**
- Consumes: `estimateListValue` and `buildManualSuggestions`.
- Produces: `listValueMarkup(listData)`, `manualSuggestionsFor(query)`, `renderManualSuggestions(input)`, and `addManualSuggestion(listId, suggestion)`.

- [ ] **Step 1: Add empty and currency estimation tests**

Assert an empty list returns total `0`, zero priced/missing counts, and `EUR`; assert invalid/negative prices are ignored; assert an item with three price rows uses the cheapest valid row. Run and verify RED for the invalid-price case.

- [ ] **Step 2: Add the value summary below the item list**

Build `listValueMarkup` from `MartLogic.estimateListValue(listData.items, productPrices)`. Format a positive total with existing `formatPrice`. Render `Noch kein Warenwert verfügbar` when `pricedItemCount` is zero and append singular/plural unpriced copy when needed. In `noteMarkup`, order children as shopping list, value summary, manual form, footer.

- [ ] **Step 3: Add suggestions and selection routing**

Build historical candidates from `lists.flatMap(listData => listData.items)`. Render up to five buttons under the manual input with `role="listbox"`; serialize only stable identifiers in `data-` attributes and resolve the chosen suggestion again from the current computed list. Catalog selections pass the original catalog product to `addToList(product, listId)`. Historical selections create a fresh `manual:${Date.now()}:...` ID and preserve the name/shelf metadata.

- [ ] **Step 4: Add keyboard and focus behavior**

On input, update the suggestion list without rerendering all notes. ArrowDown/ArrowUp change `aria-activedescendant`, Enter selects the highlighted suggestion before normal form submission, Escape closes the list, and blur closes after the click event can run. Clear `manualDrafts[listId]` after selection.

- [ ] **Step 5: Style, verify, and commit**

Style the summary as a subdued receipt-like row and the suggestion list as an anchored, scroll-safe panel inside the card with touch-friendly rows and focus/hover states. Run all tests, JavaScript syntax checks, and `git diff --check`. Commit `app.js`, `styles.css`, and tests with message `Add list values and item suggestions`.

---

### Task 5: Add QR joining UI and refresh browser assets

**Files:**
- Modify: `app.js:3802-3842`
- Modify: `styles.css:1616-1697`
- Modify: `index.html:119-122`
- Modify: `sw.js:1-12`
- Create: `.gitignore`

**Interfaces:**
- Consumes: existing `qrSvgMarkup`, invite URL encoder, `importSharedListFromUrl`, and Supabase `join_shopping_list` RPC.
- Produces: QR presentation in the sharing modal; no database schema changes.

- [ ] **Step 1: Render the invitation QR**

In `openShareListModal`, call `qrSvgMarkup(url.href)` and render a `.share-qr` block before the invitation-code card. Include visible copy `Scannen und direkt beitreten`; if QR generation fails, render the link icon and keep copy/share controls available.

- [ ] **Step 2: Style accessible QR presentation**

Center the SVG inside a high-contrast white square, constrain it to `min(240px, 70vw)`, ensure the SVG scales to 100%, and add explanatory text. Reuse the device-pairing visual language without pairing status or approval controls.

- [ ] **Step 3: Register the new logic asset and cache version**

Load `./app-logic.js?v=59` before `app.js`, change `app.js` to `?v=59`, bump `CACHE_NAME` to `einkaufszettel-v59`, and add `./app-logic.js` to `ASSETS`. Keep the pinned Supabase and QR dependency versions unchanged.

- [ ] **Step 4: Exclude platform junk and verify assets**

Create `.gitignore` containing `.DS_Store`. Verify every local script/stylesheet referenced by `index.html` is present in the service-worker asset list where appropriate. Run syntax checks for `app-logic.js`, `app.js`, and `sw.js` plus all Node tests and `git diff --check`.

- [ ] **Step 5: Commit**

Commit `.gitignore`, `app-logic.js`, `app.js`, `styles.css`, `index.html`, and `sw.js` with message `Add QR shopping list handshake`.

---

### Task 6: Browser QA, full verification, and GitHub push

**Files:**
- Verify: all changed files
- Update only if QA exposes a reproducible defect: matching production file plus its failing regression test

**Interfaces:**
- Consumes: completed Tasks 1-5.
- Produces: verified branch on `origin/codex/pop-art-product-icons`.

- [ ] **Step 1: Start a local static server**

Run the bundled Python interpreter with `-m http.server 4173 --bind 127.0.0.1` from the repository and keep the session available for browser checks.

- [ ] **Step 2: Perform browser QA**

Use the browser-control skill or bundled Playwright to open `http://127.0.0.1:4173`. Verify no console/page errors, the signed-out/device setup remains usable, and—using an isolated browser state with stubbed Supabase only when required—the active border/button, market routing, manual suggestions, value summary, and share QR render correctly at desktop and mobile widths.

- [ ] **Step 3: Run the complete verification suite**

Run:

```bash
NODE=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
"$NODE" --test tests/*.test.js
"$NODE" --check app-logic.js
"$NODE" --check app.js
"$NODE" --check sw.js
git diff --check
git status --short
```

Expected: all tests pass, syntax commands exit 0, diff check has no output, and `.DS_Store` is ignored.

- [ ] **Step 4: Review scope and commit remaining QA fixes**

Inspect `git diff HEAD`, confirm every changed file belongs to the approved feature/fix scope, and commit any verified QA fix with a terse targeted message. Do not stage unrelated files.

- [ ] **Step 5: Push the branch**

Run `git push -u origin codex/pop-art-product-icons`. Confirm the remote tracking branch advances to the final local commit. Do not create a pull request unless the user asks for one.
