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
      const valueElement = card.querySelector(".list-value-summary");
      const valueBox = rect(valueElement);
      const shareElement = card.querySelector(".share-button");
      const countElement = card.querySelector(".list-tools > span");
      const valueStyle = getComputedStyle(valueElement);
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
        valueHeight: valueBox.height,
        valueBorderTopStyle: valueStyle.borderTopStyle,
        valueBorderRightWidth: Number.parseFloat(valueStyle.borderRightWidth),
        shareFontFamily: getComputedStyle(shareElement).fontFamily,
        countFontFamily: getComputedStyle(countElement).fontFamily,
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

async function readProductGridMetrics(page) {
  return page.locator("#productGrid").evaluate((grid) => {
    const rect = (element) => element.getBoundingClientRect();
    const cards = [...grid.querySelectorAll(".product-card")];
    const cardBoxes = cards.map(rect);
    const controlSizes = cards.flatMap((card) => (
      [...card.querySelectorAll(".favorite-button, .add-button")].map((control) => {
        const box = rect(control);
        return { width: box.width, height: box.height };
      })
    ));
    const textInsideCards = cards.every((card) => {
      const cardBox = rect(card);
      return [...card.querySelectorAll(".product-name, .product-shelf, .product-price")].every((element) => {
        const box = rect(element);
        return box.left >= cardBox.left - 0.5
          && box.right <= cardBox.right + 0.5
          && box.top >= cardBox.top - 0.5
          && box.bottom <= cardBox.bottom + 0.5;
      });
    });
    return {
      columns: getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length,
      gridWithinViewport: rect(grid).left >= 0 && rect(grid).right <= window.innerWidth,
      cardOverflow: cards.some((card) => card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1),
      overflowCards: cards
        .filter((card) => card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1)
        .map((card) => ({
          name: card.querySelector(".product-name")?.textContent,
          clientWidth: card.clientWidth,
          scrollWidth: card.scrollWidth,
          clientHeight: card.clientHeight,
          scrollHeight: card.scrollHeight
        })),
      textInsideCards,
      cardHeights: cardBoxes.map((box) => box.height),
      cardWidths: cardBoxes.map((box) => box.width),
      controlSizes,
      nameFontSizes: cards.map((card) => Number.parseFloat(getComputedStyle(card.querySelector(".product-name")).fontSize)),
      priceFontSizes: cards.map((card) => Number.parseFloat(getComputedStyle(card.querySelector(".product-price")).fontSize)),
      iconSizes: cards.map((card) => {
        const box = rect(card.querySelector(".product-icon-button"));
        return { width: box.width, height: box.height };
      })
    };
  });
}

async function readShelfGridMetrics(page) {
  return page.locator("#shelfGrid").evaluate((grid) => {
    const rect = (element) => element.getBoundingClientRect();
    const cards = [...grid.querySelectorAll(".shelf-card")];
    const boards = [...grid.querySelectorAll(".shelf-board")];
    const lightness = (color) => {
      const channels = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
      return channels.length === 3
        ? Math.round((Math.max(...channels) + Math.min(...channels)) / 2)
        : 0;
    };

    return {
      columns: getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length,
      gridWithinViewport: rect(grid).left >= 0 && rect(grid).right <= window.innerWidth,
      cards: cards.map((card) => ({
        overflow: card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1,
        height: rect(card).height,
        width: rect(card).width,
        titleFontFamily: getComputedStyle(card.querySelector(".shelf-title")).fontFamily
      })),
      boards: boards.map((board) => ({
        height: rect(board).height,
        lightness: lightness(getComputedStyle(board).stroke)
      }))
    };
  });
}

async function readProductAssetMetrics(page) {
  return page.locator("#productGrid").evaluate((grid) => {
    const assets = [...grid.querySelectorAll(".product-asset")];
    const images = assets.map((asset) => asset.querySelector("img"));
    const containmentFailures = images.flatMap((image) => {
      const iconBox = image.parentElement.getBoundingClientRect();
      const imageBox = image.getBoundingClientRect();
      const contained = imageBox.left >= iconBox.left - 0.5
        && imageBox.right <= iconBox.right + 0.5
        && imageBox.top >= iconBox.top - 0.5
        && imageBox.bottom <= iconBox.bottom + 0.5;
      return contained ? [] : [{ iconBox: { x: iconBox.x, y: iconBox.y, width: iconBox.width, height: iconBox.height }, imageBox: { x: imageBox.x, y: imageBox.y, width: imageBox.width, height: imageBox.height } }];
    });
    return {
      count: assets.length,
      uniqueMotifs: new Set(assets.map((asset) => asset.dataset.iconMotif)).size,
      allLoaded: images.every((image) => image?.complete && image.naturalWidth === 64 && image.naturalHeight === 64),
      allContained: containmentFailures.length === 0,
      containmentFailures
    };
  });
}

test("Graphite Midnight workspace follows taps and horizontal swipes", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await expect(visitor.page.locator("h1")).toHaveText("zettel");
    await expect(visitor.page.getByRole("button", { name: "Pinnwand", exact: true })).toHaveAttribute("aria-current", "page");
    await visitor.page.getByRole("button", { name: "Markt", exact: true }).click();
    await expect(visitor.page.locator(".market-panel")).toBeInViewport();
    await expect(visitor.page.getByRole("button", { name: "Markt", exact: true })).toHaveAttribute("aria-current", "page");
    await visitor.page.locator(".layout").evaluate((layout) => layout.scrollTo({ left: 0, behavior: "auto" }));
    await expect(visitor.page.getByRole("button", { name: "Pinnwand", exact: true })).toHaveAttribute("aria-current", "page");
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("Graphite Midnight shelves keep three contained titanium columns and reorder", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await visitor.page.evaluate(() => document.fonts.ready);

    for (const width of [393, 430]) {
      await visitor.page.setViewportSize({ width, height: 874 });
      await visitor.page.getByRole("button", { name: "Markt", exact: true }).click();
      await expect(visitor.page.locator(".market-panel")).toBeInViewport();
      await expect.poll(() => visitor.page.locator(".layout").evaluate((layout) => {
        const market = layout.querySelector(".market-panel");
        return Math.abs(layout.scrollLeft - (market.offsetLeft - layout.offsetLeft)) <= 1;
      })).toBe(true);
      await expect(visitor.page.locator(".shelf-card").first()).toBeVisible();
      const metrics = await readShelfGridMetrics(visitor.page);
      expect(metrics.columns, `${width}px columns`).toBe(3);
      expect(metrics.gridWithinViewport, `${width}px grid`).toBe(true);
      expect(metrics.cards.every((card) => !card.overflow), `${width}px cards`).toBe(true);
      expect(Math.max(...metrics.cards.map((card) => card.height)) - Math.min(...metrics.cards.map((card) => card.height)), `${width}px equal card heights`).toBeLessThanOrEqual(0.5);
      expect(metrics.boards.every((board) => board.height >= 4), `${width}px board height`).toBe(true);
      expect(metrics.boards.every((board) => board.lightness >= 145), `${width}px titanium board lightness`).toBe(true);
      expect(metrics.cards.every((card) => card.titleFontFamily.includes("Optima")), `${width}px shelf names`).toBe(true);
      await visitor.page.screenshot({ path: `test-results/graphite-shelves-${width}.png`, fullPage: true });
    }

    const firstShelf = visitor.page.locator(".shelf-card").first();
    await firstShelf.dispatchEvent("pointerdown", { pointerId: 1, pointerType: "touch" });
    await expect(visitor.page.locator(".shelf-card.is-wiggling").first()).toBeVisible({ timeout: 1200 });
    await expect(visitor.page.getByRole("button", { name: "Fertig", exact: true })).toBeVisible();
    await visitor.page.getByRole("button", { name: "Fertig", exact: true }).click();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("Graphite Midnight notes keep separate graphite and shared wine-red papers", async ({ browser }) => {
  const server = await startTestServer();
  const owner = await createIsolatedPage(browser, server);
  const member = await createIsolatedPage(browser, server);

  try {
    await owner.page.goto(server.origin);
    await waitForReady(owner.page);
    await owner.page.locator("[data-empty-add-list]").click();
    await expect.poll(() => server.state.lists.size).toBe(1);

    const sharedList = [...server.state.lists.values()][0];
    const invite = Buffer.from(JSON.stringify({ id: sharedList.id, inviteCode: sharedList.invite_code })).toString("base64url");
    await member.page.goto(`${server.origin}/?invite=${encodeURIComponent(invite)}`);
    await expect(owner.page.locator(".note-card.is-shared")).toHaveCount(1);

    await owner.page.locator("#addListButton").click();
    await expect.poll(() => server.state.lists.size).toBe(2);
    await expect(owner.page.locator(".note-card")).toHaveCount(2);

    const manualInput = owner.page.locator("[data-manual-input]").last();
    await manualInput.fill("Hafermilch");
    await addManualItem(member.page, "Brot");
    await expect(manualInput).toBeFocused();
    await expect(manualInput).toHaveValue("Hafermilch");
    await manualInput.press("Enter");
    await expect(owner.page.locator(".note-card:not(.is-shared) .list-name")).toHaveText("Hafermilch");

    for (const width of [393, 430, 1280]) {
      await owner.page.setViewportSize({ width, height: width === 1280 ? 900 : 874 });
      const metrics = await owner.page.locator(".notes-board").evaluate((board) => {
        const cards = [...board.querySelectorAll(".note-card")];
        const rect = (element) => element.getBoundingClientRect();
        const personal = cards.find((card) => !card.classList.contains("is-shared"));
        const shared = cards.find((card) => card.classList.contains("is-shared"));
        return {
          cards: cards.map(rect),
          boardBackground: getComputedStyle(board).backgroundColor,
          personalBackground: getComputedStyle(personal).backgroundImage,
          sharedBackground: getComputedStyle(shared).backgroundImage,
          personalOverflow: personal.scrollWidth > personal.clientWidth + 1,
          sharedOverflow: shared.scrollWidth > shared.clientWidth + 1,
          titleFontFamily: getComputedStyle(personal.querySelector(".list-title")).fontFamily,
          nameFontFamily: getComputedStyle(personal.querySelector(".list-name")).fontFamily,
          toolsFontFamily: getComputedStyle(personal.querySelector(".list-tools")).fontFamily
        };
      });

      expect(metrics.cards).toHaveLength(2);
      expect(metrics.cards[1].top - metrics.cards[0].bottom, `${width}px card gap`).toBeGreaterThanOrEqual(14);
      expect(metrics.boardBackground).toBe("rgba(0, 0, 0, 0)");
      expect(metrics.personalBackground).not.toBe(metrics.sharedBackground);
      expect(metrics.personalOverflow, `${width}px personal overflow`).toBe(false);
      expect(metrics.sharedOverflow, `${width}px shared overflow`).toBe(false);
      expect(metrics.titleFontFamily).toContain("Optima");
      expect(metrics.nameFontFamily).toContain("Optima");
      expect(metrics.toolsFontFamily).not.toContain("Optima");
    }

    await owner.page.setViewportSize({ width: 393, height: 874 });
    await owner.page.screenshot({ path: "test-results/graphite-notes-393.png", fullPage: true });
    await owner.page.setViewportSize({ width: 430, height: 874 });
    await owner.page.screenshot({ path: "test-results/graphite-notes-430.png", fullPage: true });
    await owner.page.setViewportSize({ width: 1280, height: 900 });
    await owner.page.screenshot({ path: "test-results/graphite-notes-desktop.png", fullPage: true });
  } finally {
    await Promise.all([owner.context.close(), member.context.close()]);
    await server.close();
  }
});

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
      expect(metrics.valueHeight, `${width}px value row`).toBeLessThanOrEqual(34);
      expect(metrics.valueBorderTopStyle, `${width}px value separator`).toBe("solid");
      expect(metrics.valueBorderRightWidth, `${width}px value box`).toBe(0);
      expect(metrics.shareFontFamily, `${width}px share font`).not.toMatch(/Noteworthy|Bradley|Chancery/i);
      expect(metrics.countFontFamily, `${width}px count font`).not.toMatch(/Noteworthy|Bradley|Chancery/i);
      expect(metrics.footerHeight, `${width}px footer`).toBeLessThanOrEqual(40);
      expect(metrics.cardHeight, `${width}px card height`).toBeLessThanOrEqual(390);
      metrics.touchSizes.forEach(({ label, width: controlWidth, height }) => {
        expect(controlWidth, `${width}px ${label} width`).toBeGreaterThanOrEqual(28);
        expect(height, `${width}px ${label} height`).toBeGreaterThanOrEqual(28);
      });
    }

    await owner.page.setViewportSize({ width: 393, height: 874 });
    await owner.page.screenshot({ path: "test-results/optik-paket-2-iphone.png", fullPage: true });

    await owner.page.setViewportSize({ width: 1280, height: 900 });
    await owner.page.screenshot({ path: "test-results/optik-paket-2-desktop.png", fullPage: true });
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

    await visitor.page.getByRole("button", { name: "Menü öffnen" }).click();
    await expect(visitor.page.getByRole("button", { name: "Menü öffnen" })).toHaveAttribute("aria-expanded", "true");
    await visitor.page.locator("#imprintButton").click();
    await expect(visitor.page.getByRole("heading", { name: "Impressum" })).toBeVisible();
    await expect(visitor.page.getByText("Version 0.6.7 · Build 67", { exact: true })).toBeVisible();

    await visitor.page.locator("#modalCloseButton").click();
    await visitor.page.locator("#bugreportButton").click();
    const report = await visitor.page.locator("#bugReportText").inputValue();
    expect(report).toContain("App-Version: 0.6.7");
    expect(report).toContain("Build: 67");
    expect(report).toContain("Gerät/Browser:");
    expect(report).toContain("Bildschirm: 402 × 874");

    await visitor.page.screenshot({ path: "test-results/app-version-bugreport.png", fullPage: true });
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("product cards keep four readable columns with contained text and aligned actions", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await visitor.page.locator("[data-empty-add-list]").click();
    await visitor.page.getByRole("button", { name: /Gemüse 26 Artikel/ }).click();
    await expect(visitor.page.locator(".product-card")).toHaveCount(26);
    await expect(visitor.page.locator(".product-asset img")).toHaveCount(26);
    await visitor.page.evaluate(() => document.fonts.ready);

    for (const width of [393, 430]) {
      await visitor.page.setViewportSize({ width, height: 874 });
      const metrics = await readProductGridMetrics(visitor.page);
      const assetMetrics = await readProductAssetMetrics(visitor.page);
      expect(metrics.columns, `${width}px columns`).toBe(4);
      expect(metrics.gridWithinViewport, `${width}px grid`).toBe(true);
      expect(metrics.cardOverflow, `${width}px card overflow ${JSON.stringify(metrics.overflowCards)}`).toBe(false);
      expect(metrics.textInsideCards, `${width}px text containment`).toBe(true);
      expect(Math.max(...metrics.cardWidths) - Math.min(...metrics.cardWidths), `${width}px equal widths`).toBeLessThanOrEqual(0.5);
      expect(Math.min(...metrics.cardHeights), `${width}px card height`).toBeGreaterThanOrEqual(164);
      expect(Math.max(...metrics.cardHeights), `${width}px card height`).toBeLessThanOrEqual(176);
      expect(Math.min(...metrics.nameFontSizes), `${width}px product name`).toBeGreaterThanOrEqual(10);
      expect(Math.min(...metrics.priceFontSizes), `${width}px product price`).toBeGreaterThanOrEqual(8.5);
      metrics.controlSizes.forEach(({ width: controlWidth, height }) => {
        expect(controlWidth, `${width}px action width`).toBeGreaterThanOrEqual(30);
        expect(height, `${width}px action height`).toBeGreaterThanOrEqual(30);
      });
      metrics.iconSizes.forEach(({ width: iconWidth, height }) => {
        expect(iconWidth, `${width}px icon width`).toBeGreaterThanOrEqual(52);
        expect(height, `${width}px icon height`).toBeGreaterThanOrEqual(50);
      });
      expect(assetMetrics.count, `${width}px individual icons`).toBe(26);
      expect(assetMetrics.uniqueMotifs, `${width}px unique motifs`).toBe(26);
      expect(assetMetrics.allLoaded, `${width}px loaded icons`).toBe(true);
      expect(assetMetrics.allContained, `${width}px contained icons ${JSON.stringify(assetMetrics.containmentFailures)}`).toBe(true);
      await visitor.page.screenshot({ path: `test-results/icon-batch-1-gemuese-${width}.png`, fullPage: true });
    }

    await visitor.page.locator("#backButton").click();
    await visitor.page.getByRole("button", { name: /Salate & Frischetheke 19 Artikel/ }).click();
    await expect(visitor.page.locator(".product-card")).toHaveCount(19);
    await expect.poll(() => visitor.page.locator(".product-card").evaluateAll((cards) => (
      cards.slice(0, 10).filter((card) => card.querySelector(".product-asset img")).length
    ))).toBe(10);
    await visitor.page.setViewportSize({ width: 393, height: 874 });
    await visitor.page.screenshot({ path: "test-results/icon-batch-1-frische-393.png", fullPage: true });
  } finally {
    await visitor.context.close();
    await server.close();
  }
});
