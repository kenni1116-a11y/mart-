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
