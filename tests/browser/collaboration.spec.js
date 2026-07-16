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

test("isolated contexts converge item mutations, preserve owner/member deletion roles, and show one centered empty action", async ({ browser }) => {
  const server = await startTestServer();
  const owner = await createIsolatedPage(browser, server);
  const member = await createIsolatedPage(browser, server);
  const fixedClientTime = 1_784_218_156_713;
  await Promise.all([
    owner.context.addInitScript((timestamp) => { Date.now = () => timestamp; }, fixedClientTime),
    member.context.addInitScript((timestamp) => { Date.now = () => timestamp; }, fixedClientTime)
  ]);
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

    await waitForStableElement(member.page, "[data-delete-list]");
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

test("compact iPhone note layout keeps controls separated and touchable", async ({ browser }) => {
  const server = await startTestServer();
  const owner = await createIsolatedPage(browser, server);

  try {
    await owner.page.goto(server.origin);
    await waitForReady(owner.page);
    await owner.page.locator("[data-empty-add-list]").click();
    await addManualItem(owner.page, "Milch");
    await addManualItem(owner.page, "Vollkornbrot");
    await addManualItem(owner.page, "Waschmittel");
    await expect(owner.page.locator(".list-item")).toHaveCount(3);
    await owner.page.evaluate(() => document.fonts.ready);
    await owner.page.waitForTimeout(100);

    let metrics;
    await expect.poll(async () => {
      metrics = await owner.page.locator(".note-card").evaluate((card) => {
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
        const manualBox = rect(card.querySelector(".manual-add"));
        const footerBox = rect(card.querySelector(".note-footer"));
        const itemRows = [...card.querySelectorAll(".list-item")];
        const controls = [...card.querySelectorAll(".list-item input[type=checkbox], .quantity-button, .remove-button")];
        const controlPairs = controls.flatMap((control, index) => (
          controls.slice(index + 1).map((other) => [rect(control), rect(other)])
        ));
        return {
          connected: card.isConnected,
          cardWithinViewport: cardBox.left >= 0 && cardBox.right <= window.innerWidth,
          headerOverlap: overlaps(titleBox, toolsBox),
          controlOverlap: controlPairs.some(([left, right]) => overlaps(left, right)),
          manualHeight: manualBox.height,
          itemHeights: itemRows.map((item) => rect(item).height),
          footerHeight: footerBox.height,
          cardHeight: cardBox.height,
          touchSizes: controls.map((control) => {
            const box = rect(control);
            return {
              label: control.getAttribute("aria-label"),
              width: box.width,
              height: box.height
            };
          })
        };
      });
      return metrics.connected
        && metrics.touchSizes.length === 12
        && metrics.touchSizes.every(({ width, height }) => width > 0 && height > 0);
    }).toBe(true);

    await owner.page.screenshot({ path: "test-results/optik-paket-1-iphone.png", fullPage: true });

    expect(metrics.cardWithinViewport).toBe(true);
    expect(metrics.headerOverlap).toBe(false);
    expect(metrics.controlOverlap).toBe(false);
    expect(metrics.manualHeight).toBeLessThanOrEqual(48);
    expect(Math.max(...metrics.itemHeights)).toBeLessThanOrEqual(46);
    expect(metrics.footerHeight).toBeLessThanOrEqual(40);
    expect(metrics.cardHeight).toBeLessThanOrEqual(390);
    metrics.touchSizes.forEach(({ label, width, height }) => {
      expect(width, `${label} width`).toBeGreaterThanOrEqual(28);
      expect(height, `${label} height`).toBeGreaterThanOrEqual(28);
    });

    await owner.page.setViewportSize({ width: 1280, height: 900 });
    await owner.page.screenshot({ path: "test-results/optik-paket-1-desktop.png", fullPage: true });
  } finally {
    await owner.context.close();
    await server.close();
  }
});
