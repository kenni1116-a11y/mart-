const { test, expect } = require("@playwright/test");

let startTestServer;

test.beforeAll(async () => {
  ({ startTestServer } = await import("./test-server.mjs"));
});

const viewport = { width: 402, height: 874 };

async function createIsolatedPage(browser, server) {
  const context = await browser.newContext({ viewport });
  const adapter = await (await fetch(`${server.origin}/__test__/collaboration.js`)).text();
  await context.route("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.0", (route) => route.fulfill({
    contentType: "application/javascript",
    body: adapter
  }));
  await context.addInitScript(() => {
    navigator.serviceWorker?.getRegistrations?.().then((registrations) => registrations.forEach((registration) => registration.unregister()));
    navigator.serviceWorker.register = () => Promise.resolve({ update: () => Promise.resolve() });
  });
  return { context, page: await context.newPage() };
}

async function waitForReady(page) {
  await expect(page.locator("#authGate")).toHaveClass(/is-hidden/);
  await expect(page.locator("#notesStack [data-empty-add-list]")).toHaveCount(1);
}

async function addManualItem(page, name) {
  const input = page.locator("[data-manual-input]");
  await expect(input).toBeVisible();
  await input.fill(name);
  await input.press("Enter");
}

async function waitForStableElement(page, selector, stableFor = 250) {
  await expect.poll(() => page.locator(selector).evaluate((element, options) => {
    const state = window.__martTestStableElements ??= new Map();
    const previous = state.get(options.selector);
    if (!previous || previous.element !== element) {
      state.set(options.selector, { element, since: performance.now() });
      return 0;
    }
    return performance.now() - previous.since;
  }, { selector, stableFor })).toBeGreaterThanOrEqual(stableFor);
}

async function readStableNoteMetrics(page) {
  let metrics;
  await expect.poll(async () => {
    metrics = await page.locator(".note-card").evaluate((card) => {
      const rect = (element) => element.getBoundingClientRect();
      const overlaps = (left, right) => !(
        left.right <= right.left
        || right.right <= left.left
        || left.bottom <= right.top
        || right.bottom <= left.top
      );
      const cardBox = rect(card);
      const titleBox = rect(card.querySelector(".list-title"));
      const toolsBox = rect(card.querySelector(".list-tools"));
      const membersBox = rect(card.querySelector(".member-strip"));
      const collaborationBox = rect(card.querySelector(".collab-tools"));
      const manualBox = rect(card.querySelector(".manual-add"));
      const footerBox = rect(card.querySelector(".note-footer"));
      const itemRows = [...card.querySelectorAll(".list-item")];
      const controls = [...card.querySelectorAll([
        ".list-activation-button",
        ".edit-note-button",
        ".share-button",
        "button.sync-chip",
        ".manual-add button",
        ".note-delete-button",
        ".list-item input[type=checkbox]",
        ".list-copy-button",
        ".user-badge",
        ".quantity-button",
        ".remove-button"
      ].join(", "))];
      const controlPairs = controls.flatMap((control, index) => (
        controls.slice(index + 1).map((other) => [rect(control), rect(other)])
      ));
      return {
        connected: card.isConnected,
        cardWithinViewport: cardBox.left >= 0 && cardBox.right <= window.innerWidth,
        contentOverflow: card.scrollWidth > card.clientWidth + 1,
        headerOverlap: overlaps(titleBox, toolsBox),
        collaborationOverlap: overlaps(membersBox, collaborationBox),
        controlOverlap: controlPairs.some(([left, right]) => overlaps(left, right)),
        manualHeight: manualBox.height,
        itemHeights: itemRows.map((item) => rect(item).height),
        footerHeight: footerBox.height,
        cardHeight: cardBox.height,
        touchSizes: controls.map((control) => {
          const box = rect(control);
          return {
            label: control.getAttribute("aria-label") || control.textContent.trim(),
            width: box.width,
            height: box.height
          };
        })
      };
    });
    return metrics.connected
      && metrics.touchSizes.length >= 20
      && metrics.touchSizes.every(({ width, height }) => width > 0 && height > 0);
  }).toBe(true);
  return metrics;
}

test("isolated contexts converge item mutations, preserve owner/member deletion roles, and show one centered empty action", async ({ browser }) => {
  const server = await startTestServer();
  const owner = await createIsolatedPage(browser, server);
  const member = await createIsolatedPage(browser, server);
  const ownerDialogs = [];
  owner.page.on("dialog", async (dialog) => {
    ownerDialogs.push(dialog.message());
    await dialog.accept();
  });

  try {
    await owner.page.goto(server.origin);
    await waitForReady(owner.page);
    await owner.page.locator("[data-empty-add-list]").click();
    await expect.poll(() => server.state.lists.size).toBe(1);

    const list = [...server.state.lists.values()][0];
    const invite = Buffer.from(JSON.stringify({ id: list.id, inviteCode: list.invite_code })).toString("base64url");
    await member.page.goto(`${server.origin}/?invite=${encodeURIComponent(invite)}`);
    await expect(member.page.locator("[data-delete-list]")).toBeVisible();

    await Promise.all([
      addManualItem(owner.page, "Milch"),
      (async () => {
        await member.page.waitForTimeout(25);
        await addManualItem(member.page, "Brot");
      })()
    ]);
    await expect.poll(() => [...server.state.items.values()].filter((item) => !item.deleted_at).map((item) => item.name).sort()).toEqual(["Brot", "Milch"]);
    await expect(owner.page.getByText("Milch", { exact: true })).toBeVisible();
    await expect(owner.page.getByText("Brot", { exact: true })).toBeVisible();
    await expect(member.page.getByText("Milch", { exact: true })).toBeVisible();
    await expect(member.page.getByText("Brot", { exact: true })).toBeVisible();

    await member.page.locator("[data-delete-list]").click();
    await expect(member.page.locator("[data-empty-add-list]")).toHaveCount(1);
    await expect(owner.page.getByText("Milch", { exact: true })).toBeVisible();
    expect(server.state.tombstones.size).toBe(0);

    await owner.page.locator("[data-delete-list]").click();
    await expect.poll(() => server.state.tombstones.size).toBe(1);
    expect(ownerDialogs).toEqual([`"${list.name}" wirklich vollständig löschen?`]);

    await owner.page.reload();
    await waitForReady(owner.page);
    await expect(owner.page.locator("[data-empty-add-list]")).toHaveCount(1);
    await expect(owner.page.getByRole("button", { name: "Neuer Zettel" })).toHaveCount(1);
    const emptyState = await owner.page.locator(".notes-board.is-empty").evaluate((board) => {
      const button = board.querySelector("[data-empty-add-list]");
      const boardBox = board.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      return {
        count: board.querySelectorAll("[data-empty-add-list]").length,
        horizontalOffset: Math.abs((buttonBox.left + buttonBox.width / 2) - (boardBox.left + boardBox.width / 2)),
        verticalOffset: Math.abs((buttonBox.top + buttonBox.height / 2) - (boardBox.top + boardBox.height / 2))
      };
    });
    expect(emptyState.count).toBe(1);
    expect(emptyState.horizontalOffset).toBeLessThanOrEqual(4);
    expect(emptyState.verticalOffset).toBeLessThanOrEqual(4);
  } finally {
    await Promise.all([owner.context.close(), member.context.close()]);
    await server.close();
  }
});

test("ownership transfer reaches the atomic RPC before changing the owner shown by the server", async ({ browser }) => {
  const server = await startTestServer();
  const owner = await createIsolatedPage(browser, server);
  const member = await createIsolatedPage(browser, server);
  owner.page.on("dialog", (dialog) => dialog.accept());

  try {
    await owner.page.goto(server.origin);
    await waitForReady(owner.page);
    await owner.page.locator("[data-empty-add-list]").click();
    await expect.poll(() => server.state.lists.size).toBe(1);

    const list = [...server.state.lists.values()][0];
    const invite = Buffer.from(JSON.stringify({ id: list.id, inviteCode: list.invite_code })).toString("base64url");
    await member.page.goto(`${server.origin}/?invite=${encodeURIComponent(invite)}`);
    await expect(member.page.locator("[data-delete-list]")).toBeVisible();
    await expect(owner.page.locator(".member-avatar")).toHaveCount(2);
    const nextOwner = [...server.state.members.values()].find((entry) => entry.list_id === list.id && entry.user_id !== list.owner_user_id);

    await owner.page.locator(`[data-members-list="${list.id}"]`).click();
    await owner.page.locator(`[data-transfer-owner="${nextOwner.user_id}"]`).click();

    await expect.poll(() => server.state.lists.get(list.id)?.owner_user_id).toBe(nextOwner.user_id);
    expect(server.state.members.get(`${list.id}:${nextOwner.user_id}`)?.role).toBe("owner");
  } finally {
    await Promise.all([owner.context.close(), member.context.close()]);
    await server.close();
  }
});

test("compact shared iPhone note layout stays readable and touchable at both width bounds", async ({ browser }) => {
  const server = await startTestServer();
  const owner = await createIsolatedPage(browser, server);
  const member = await createIsolatedPage(browser, server);

  try {
    await owner.page.goto(server.origin);
    await waitForReady(owner.page);
    await owner.page.locator("[data-empty-add-list]").click();
    await expect.poll(() => server.state.lists.size).toBe(1);

    const list = [...server.state.lists.values()][0];
    const invite = Buffer.from(JSON.stringify({ id: list.id, inviteCode: list.invite_code })).toString("base64url");
    await member.page.goto(`${server.origin}/?invite=${encodeURIComponent(invite)}`);
    await expect(member.page.locator("[data-delete-list]")).toBeVisible();
    await expect(owner.page.locator(".member-avatar")).toHaveCount(2);

    await waitForStableElement(owner.page, "[data-rename-list]");
    await owner.page.locator("[data-rename-list]").click();
    await owner.page.locator("#renameListInput").fill("Familien-Wocheneinkauf");
    await owner.page.locator("[data-save-rename]").click();
    await expect.poll(() => server.state.lists.get(list.id)?.name).toBe("Familien-Wocheneinkauf");

    await addManualItem(owner.page, "Milch");
    await addManualItem(member.page, "Vollkornbrot");
    await addManualItem(owner.page, "Waschmittel");
    await expect.poll(() => [...server.state.items.values()].filter((item) => !item.deleted_at).length).toBe(3);
    await expect(owner.page.locator(".list-item")).toHaveCount(3);
    await expect(member.page.getByLabel("Milch erledigt")).toBeVisible();
    await member.page.getByLabel("Milch erledigt").check();
    await expect.poll(() => [...server.state.items.values()].find((item) => item.name === "Milch")?.done).toBe(true);
    await expect(owner.page.getByLabel("Milch erledigt")).toBeChecked();
    await owner.page.evaluate(() => document.fonts.ready);
    await owner.page.waitForTimeout(100);

    for (const width of [393, 430]) {
      await owner.page.setViewportSize({ width, height: 874 });
      const metrics = await readStableNoteMetrics(owner.page);
      expect(metrics.cardWithinViewport, `${width}px card`).toBe(true);
      expect(metrics.contentOverflow, `${width}px content`).toBe(false);
      expect(metrics.headerOverlap, `${width}px header`).toBe(false);
      expect(metrics.collaborationOverlap, `${width}px collaboration`).toBe(false);
      expect(metrics.controlOverlap, `${width}px controls`).toBe(false);
      expect(metrics.manualHeight, `${width}px manual input`).toBeLessThanOrEqual(48);
      expect(Math.max(...metrics.itemHeights), `${width}px item rows`).toBeLessThanOrEqual(46);
      expect(metrics.footerHeight, `${width}px footer`).toBeLessThanOrEqual(40);
      expect(metrics.cardHeight, `${width}px card height`).toBeLessThanOrEqual(390);
      metrics.touchSizes.forEach(({ label, width: controlWidth, height }) => {
        expect(controlWidth, `${width}px ${label} width`).toBeGreaterThanOrEqual(28);
        expect(height, `${width}px ${label} height`).toBeGreaterThanOrEqual(28);
      });
    }

    await owner.page.setViewportSize({ width: 393, height: 874 });
    await owner.page.screenshot({ path: "test-results/optik-paket-1-iphone.png", fullPage: true });

    await owner.page.setViewportSize({ width: 1280, height: 900 });
    await owner.page.screenshot({ path: "test-results/optik-paket-1-desktop.png", fullPage: true });
  } finally {
    await Promise.all([owner.context.close(), member.context.close()]);
    await server.close();
  }
});

test("imprint and bugreport show the central app version and device context", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);

    await visitor.page.locator("#imprintButton").click();
    await expect(visitor.page.getByRole("heading", { name: "Impressum" })).toBeVisible();
    await expect(visitor.page.getByText("Version 0.6.4 · Build 64", { exact: true })).toBeVisible();

    await visitor.page.locator("#modalCloseButton").click();
    await visitor.page.locator("#bugreportButton").click();
    const report = await visitor.page.locator("#bugReportText").inputValue();
    expect(report).toContain("App-Version: 0.6.4");
    expect(report).toContain("Build: 64");
    expect(report).toContain("Gerät/Browser:");
    expect(report).toContain("Bildschirm: 402 × 874");

    await visitor.page.screenshot({ path: "test-results/app-version-bugreport.png", fullPage: true });
  } finally {
    await visitor.context.close();
    await server.close();
  }
});
