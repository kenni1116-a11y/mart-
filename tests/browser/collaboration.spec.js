const { test, expect } = require("@playwright/test");

let startTestServer;

test.beforeAll(async () => {
  ({ startTestServer } = await import("./test-server.mjs"));
});

const viewport = { width: 402, height: 874 };
const avatarFilenameSource = "avatar-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[ab]\\.webp";

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
  await expect(page.locator("#appShell")).toBeVisible();
  await expect(page.locator(".notes-board")).toBeVisible();
  await expect(page.locator("#notesStack [data-empty-add-list]")).toHaveCount(1);
  await expect(page.locator("#notesStack [data-empty-add-list]")).toBeVisible();
}

async function addManualItem(page, name) {
  const input = page.locator("[data-manual-input]");
  await expect(input).toBeVisible();
  await input.fill(name);
  await input.press("Enter");
}

async function connectVisitorToAccount(server, visitor, accountId) {
  const token = await visitor.page.evaluate(() => localStorage.getItem("__mart_test_session"));
  const session = server.state.sessions.get(token);
  if (!session) throw new Error("Test session missing");
  session.accountId = accountId;
  const device = [...server.state.devices.values()].find((entry) => entry.authUserId === session.user.id);
  if (device) device.accountId = accountId;
  await visitor.page.reload();
  await waitForReady(visitor.page);
  return session.user.id;
}

async function coloredPng(page, color) {
  const base64 = await page.evaluate((fillStyle) => {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 4;
    const context = canvas.getContext("2d");
    context.fillStyle = fillStyle;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png").split(",")[1];
  }, color);
  return Buffer.from(base64, "base64");
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

async function readDialogPresentation(page, selector) {
  return page.locator(selector).evaluate((element) => {
    const parseColor = (value) => {
      const channels = value.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
      return channels.length === 3 ? channels : [255, 255, 255];
    };
    const luminance = ([red, green, blue]) => {
      const channel = (value) => {
        const normalized = value / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
    };
    const contrast = (foreground, background) => {
      const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const text = element.querySelector("h1, h2, h3, p, strong, label, button, a") ?? element;
    const close = document.querySelector("#modalCloseButton");
    const closeBox = close?.getBoundingClientRect();
    return {
      background: parseColor(style.backgroundColor),
      closeHeight: closeBox?.height ?? 0,
      closeWidth: closeBox?.width ?? 0,
      contrast: contrast(parseColor(getComputedStyle(text).color), parseColor(style.backgroundColor)),
      horizontalOverflow: element.scrollWidth > element.clientWidth + 1,
      pageHasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      withinViewport: box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight,
      closeWithinViewport: Boolean(closeBox
        && closeBox.left >= 0
        && closeBox.right <= window.innerWidth
        && closeBox.top >= 0
        && closeBox.bottom <= window.innerHeight)
    };
  });
}

async function expectDialogFitsViewport(page, label) {
  const closeButton = page.locator("#modalCloseButton");
  await expect(closeButton, `${label} close button visible`).toBeVisible();
  const metrics = await readDialogPresentation(page, ".modal-card");
  expect(metrics.withinViewport, `${label} within viewport`).toBe(true);
  expect(metrics.horizontalOverflow, `${label} dialog horizontal overflow`).toBe(false);
  expect(metrics.pageHasHorizontalOverflow, `${label} page horizontal overflow`).toBe(false);
  expect(metrics.closeWithinViewport, `${label} close button within viewport`).toBe(true);
  expect(metrics.closeWidth, `${label} close width`).toBeGreaterThanOrEqual(44);
  expect(metrics.closeHeight, `${label} close height`).toBeGreaterThanOrEqual(44);
}

async function readDialogMaterial(page, selector, textSelector = "strong, span, small, button") {
  return page.locator(selector).first().evaluate((element, textSelector) => {
    const parseColor = (value) => {
      const channels = value.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
      return channels.length === 3 ? channels : [255, 255, 255];
    };
    const luminance = ([red, green, blue]) => {
      const channel = (value) => {
        const normalized = value / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
    };
    const contrast = (foreground, background) => {
      const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const style = getComputedStyle(element);
    const text = element.querySelector(textSelector) ?? element;
    return {
      background: parseColor(style.backgroundColor),
      contrast: contrast(parseColor(getComputedStyle(text).color), parseColor(style.backgroundColor))
    };
  }, textSelector);
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
    const firstSecondRow = cards[4];
    const secondRowStyle = getComputedStyle(firstSecondRow, "::before");
    const overflowingCards = cards.filter((card) => {
      const cardBox = rect(card);
      return [...card.children].some((child) => {
        const childBox = rect(child);
        return childBox.left < cardBox.left - 0.5
          || childBox.right > cardBox.right + 0.5
          || childBox.top < cardBox.top - 0.5
          || childBox.bottom > cardBox.bottom + 0.5;
      });
    });
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
      cardOverflow: overflowingCards.length > 0,
      overflowCards: overflowingCards
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
      secondRowBoardHeight: Number.parseFloat(secondRowStyle.height),
      secondRowBoardBackground: secondRowStyle.backgroundImage,
      cardBackgrounds: cards.map((card) => getComputedStyle(card).backgroundImage),
      actionContained: cards.every((card) => {
        const cardBox = rect(card);
        return [...card.querySelectorAll(".favorite-button, .add-button")].every((button) => {
          const buttonBox = rect(button);
          return buttonBox.left >= cardBox.left && buttonBox.right <= cardBox.right;
        });
      }),
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

test("options register exposes direct tools and keeps profile separate", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);

    const register = visitor.page.locator("#topOptions");
    const closedTranslation = await register.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return transform === "none" ? 0 : new DOMMatrix(transform).m41;
    });
    expect(closedTranslation).toBeLessThanOrEqual(-100);
    await visitor.page.getByRole("button", { name: "Optionen öffnen" }).click();
    await expect(register).toBeVisible();
    await expect(register.getByRole("heading", { name: "Optionen" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Hintergrund anpassen" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Daten hinzufügen" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Impressum" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Bugreport" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Mehr", exact: true })).toHaveCount(0);
    await expect.poll(() => register.evaluate((element) => {
      const transform = getComputedStyle(element).transform;
      return Math.abs(transform === "none" ? 0 : new DOMMatrix(transform).m41);
    })).toBeLessThanOrEqual(1);

    const presentation = await register.evaluate((element) => {
      const style = getComputedStyle(element);
      const close = element.querySelector("#topOptionsCloseButton");
      const closeStyle = getComputedStyle(close);
      const box = element.getBoundingClientRect();
      const closeBox = close.getBoundingClientRect();
      return {
        position: style.position,
        topRightRadius: style.borderTopRightRadius,
        contained: box.left >= 0 && box.right < window.innerWidth,
        closeBorder: closeStyle.borderTopStyle,
        closeFontSize: Number.parseFloat(closeStyle.fontSize),
        closeWidth: closeBox.width,
        closeHeight: closeBox.height,
        scrimBlur: getComputedStyle(document.querySelector("#topOptionsScrim")).backdropFilter,
        openTranslation: style.transform === "none" ? 0 : new DOMMatrix(style.transform).m41,
        borderRightWidth: Number.parseFloat(style.borderRightWidth),
        boxShadow: style.boxShadow,
        edgeMask: style.maskImage || style.webkitMaskImage
      };
    });
    expect(presentation.position).toBe("fixed");
    expect(presentation.topRightRadius).toBe("0px");
    expect(presentation.contained).toBe(true);
    expect(presentation.closeBorder).toBe("none");
    expect(presentation.closeFontSize).toBeGreaterThanOrEqual(43);
    expect(presentation.closeWidth).toBeGreaterThanOrEqual(44);
    expect(presentation.closeHeight).toBeGreaterThanOrEqual(44);
    expect(presentation.scrimBlur).toContain("blur");
    expect(Math.abs(presentation.openTranslation)).toBeLessThanOrEqual(1);
    expect(presentation.borderRightWidth).toBe(0);
    expect(presentation.boxShadow).toBe("none");
    expect(presentation.edgeMask).toContain("linear-gradient");

    await visitor.page.locator("#topOptionsCloseButton").click();
    await expect(register).toBeHidden();
    await visitor.page.getByRole("button", { name: "Optionen öffnen" }).click();
    await visitor.page.getByRole("button", { name: "Hintergrund anpassen" }).click();
    await expect(visitor.page.getByRole("heading", { name: "Hintergrund" })).toBeVisible();
    await expect(register).toBeHidden();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

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
      const rule = Array.from(document.styleSheets)
        .flatMap((sheet) => Array.from(sheet.cssRules ?? []))
        .find((candidate) => candidate.selectorText === ".profile-register");
      return {
        right: Math.abs(window.innerWidth - box.right),
        borderLeft: Number.parseFloat(style.borderLeftWidth),
        shadow: style.boxShadow,
        mask: style.maskImage || style.webkitMaskImage,
        overflowY: style.overflowY,
        padding: rule?.style.getPropertyValue("padding") ?? ""
      };
    });
    expect(material.right).toBeLessThanOrEqual(1);
    expect(material.borderLeft).toBe(0);
    expect(material.shadow).toBe("none");
    expect(material.mask).toContain("linear-gradient");
    expect(material.overflowY).toBe("auto");
    expect(material.padding).toContain("env(safe-area-inset-right");

    await register.locator("#profileRegisterContent").evaluate((content) => {
      content.insertAdjacentHTML("beforeend", '<div style="height: 1400px" data-register-scroll-probe></div>');
    });
    await register.evaluate((element) => { element.scrollTop = 900; });
    await expect.poll(() => register.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("profile register exposes account controls at 44px targets", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();

    const sectionOrder = await visitor.page.locator("#profileRegisterContent").evaluate((root) =>
      [...root.querySelectorAll("[data-profile-section]")].map((section) => section.dataset.profileSection)
    );
    expect(sectionOrder).toEqual(["account", "pairing", "devices", "danger"]);
    await expect(visitor.page.locator("#profileRegister .device-qr")).toBeVisible();
    await expect(visitor.page.locator("#profileRegister [data-pairing-status]")).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Verwalten", exact: true })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Gerät benennen" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Gerät entfernen" })).toBeVisible();
    await expect(visitor.page.getByRole("button", { name: "Account löschen", exact: true })).toBeVisible();

    const undersized = await visitor.page.locator("#profileRegisterContent button, #profileRegisterContent input").evaluateAll((controls) => controls
      .map((control) => {
        const box = control.getBoundingClientRect();
        return {
          label: control.getAttribute("aria-label") || control.textContent.trim() || control.id,
          width: box.width,
          height: box.height,
          visible: control.getClientRects().length > 0
        };
      })
      .filter((control) => control.visible && (control.width < 43.5 || control.height < 43.5)));
    expect(undersized).toEqual([]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("recovery and account deletion dialogs return to the open profile register", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();

    await page.locator("[data-toggle-account-protection]").click();
    await page.locator("[data-open-account-recovery]").click();
    await expect(page.getByRole("heading", { name: "Account wiederherstellen" })).toBeVisible();
    await page.locator("#modalCloseButton").click();
    await expect(page.locator("#profileRegister")).toBeVisible();

    await page.locator("[data-delete-account]").click();
    await expect(page.getByRole("heading", { name: "Account löschen" })).toBeVisible();
    await page.locator("#modalCloseButton").click();
    await expect(page.locator("#profileRegister")).toBeVisible();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("device management returns to the profile register through X and backdrop", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const profile = page.locator("#profileRegister");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();

    await page.getByRole("button", { name: "Verwalten", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Geräte", exact: true })).toBeVisible();
    await page.locator("#modalCloseButton").click();
    await expect(profile).toBeVisible();

    await page.getByRole("button", { name: "Verwalten", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Geräte", exact: true })).toBeVisible();
    await page.locator("#modalLayer").click({ position: { x: 2, y: 2 } });
    await expect(profile).toBeVisible();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("recovery-code result follows its captured profile origin for X backdrop and Finish", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const profile = page.locator("#profileRegister");
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "rotate_recovery_code") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: { recoveryCode: "ZTL-TEST-CODE" }, error: null })
        });
        return;
      }
      await route.continue();
    });
    await page.goto(server.origin);
    await waitForReady(page);

    const openRecoveryResult = async () => {
      await page.locator("[data-toggle-account-protection]").click();
      await page.getByRole("button", { name: /Account sichern|Neuen Wiederherstellungscode erzeugen/ }).click();
      await expect(page.getByRole("heading", { name: "Account gesichert" })).toBeVisible();
    };

    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await openRecoveryResult();
    await page.locator("#modalCloseButton").click();
    await expect(profile).toBeVisible();

    await openRecoveryResult();
    await page.locator("#modalLayer").click({ position: { x: 2, y: 2 } });
    await expect(profile).toBeVisible();

    await openRecoveryResult();
    await page.getByRole("button", { name: "Fertig", exact: true }).click();
    await expect(profile).toBeVisible();

    await page.locator("#profileRegisterCloseButton").click();
    await page.evaluate(() => showRecoveryCodeResult(
      "ZTL-RECOVERED-CODE",
      "Account wiederhergestellt",
      { returnToProfile: false }
    ));
    await page.getByRole("button", { name: "Fertig", exact: true }).click();
    await expect(profile).toBeHidden();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("successful account deletion never reopens the profile register", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const profile = page.locator("#profileRegister");
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "delete_current_account_v3") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: { ok: true, deletedAccountId: payload.args.args?.expected_account_id }, error: null })
        });
        return;
      }
      await route.continue();
    });
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-delete-account]").click();
    await page.getByRole("button", { name: "Ja", exact: true }).click();

    await expect(page.locator("#modalLayer")).toBeHidden();
    await expect(profile).toBeHidden();
    await page.waitForTimeout(500);
    await expect(profile).toBeHidden();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("compact account editor saves with check or Enter and cancels without changing the name", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();

    await expect(page.locator("#profileAvatarInput")).toHaveCount(0);
    await expect(page.locator("#profileNameInput")).toHaveCount(0);
    await expect(page.locator("[data-profile-display-name]")).toHaveText("Test 1");
    await expect(page.locator("[data-profile-username]")).toContainText("test-1");

    await page.locator("[data-edit-profile-name]").click();
    const nameInput = page.locator("#profileNameInput");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Ken Neu");
    await page.locator("[data-save-profile-name]").click();
    await expect(page.locator("[data-profile-display-name]")).toHaveText("Ken Neu");
    await expect(page.locator("#profileRegister")).toBeVisible();

    await page.locator("[data-edit-profile-name]").click();
    await nameInput.fill("Ken Fertig");
    await nameInput.press("Enter");
    await expect(page.locator("[data-profile-display-name]")).toHaveText("Ken Fertig");

    await page.locator("[data-edit-profile-name]").click();
    await nameInput.fill("Nicht speichern");
    await page.locator("[data-cancel-profile-name]").click();
    await expect(page.locator("#profileNameInput")).toBeHidden();
    await expect(page.locator("[data-profile-display-name]")).toHaveText("Ken Fertig");
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("compact account editor retains the input and shows an inline error when sync fails", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: null, error: { message: "sync_failed", code: "server_error" } })
        });
        return;
      }
      await route.continue();
    });
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-profile-name]").click();
    const nameInput = page.locator("#profileNameInput");
    await nameInput.fill("Ken Offline");
    await page.locator("[data-save-profile-name]").click();

    await expect(nameInput).toHaveValue("Ken Offline");
    await expect(nameInput).toBeEnabled();
    await expect(page.locator("[data-profile-name-status]")).toContainText("Der Name konnte gerade nicht synchronisiert werden.");
    await expect(page.locator("[data-profile-display-name]")).toHaveText("Test 1");
    await expect(page.locator("#profileRegister")).toBeVisible();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("compact account editor locks and serializes an unresolved profile name save", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  const profileRequestNames = [];
  const releaseProfileResponses = [];
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        profileRequestNames.push(payload.args.args?.display_name);
        await new Promise((resolve) => { releaseProfileResponses.push(resolve); });
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: null, error: { message: "sync_failed", code: "server_error" } })
        });
        return;
      }
      await route.continue();
    });

    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-profile-name]").click();
    const nameInput = page.locator("#profileNameInput");
    const saveButton = page.locator("[data-save-profile-name]");
    const editButton = page.locator("[data-edit-profile-name]");
    const avatarEditButton = page.locator("[data-edit-avatar]");
    await avatarEditButton.click();
    await page.locator("[data-choose-avatar-initials]").click();
    await page.locator("[data-toggle-account-protection]").click();
    const avatarSwatch = page.locator("[data-avatar-palette]").first();
    const recoveryButton = page.locator("[data-open-account-recovery]");
    const deleteButton = page.locator("#profileRegisterContent [data-delete-account]");
    await nameInput.fill("Ken Akzeptiert");
    await nameInput.evaluate((input) => { input.dataset.saveEditor = "original"; });
    await saveButton.click();
    await expect.poll(() => releaseProfileResponses.length).toBe(1);

    await editButton.dispatchEvent("click");
    await expect(nameInput).toHaveAttribute("data-save-editor", "original");
    await expect(nameInput).toBeDisabled();
    await expect(editButton).toBeDisabled();
    await expect(avatarEditButton).toBeDisabled();
    await expect(avatarSwatch).toBeDisabled();
    await expect(recoveryButton).toBeDisabled();
    await expect(deleteButton).toBeDisabled();
    await recoveryButton.dispatchEvent("click");
    await deleteButton.dispatchEvent("click");
    await expect(page.locator("#modalLayer")).not.toBeVisible();

    await page.locator("#profileRegisterCloseButton").click();
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect(nameInput).toHaveAttribute("data-save-editor", "original");
    await expect(nameInput).toHaveValue("Ken Akzeptiert");
    await expect(nameInput).toBeDisabled();
    await expect(page.locator("[data-profile-name-status]")).toContainText("Name wird gespeichert");
    await expect(recoveryButton).toBeDisabled();
    await expect(deleteButton).toBeDisabled();
    await nameInput.evaluate((input) => {
      input.value = "Ken Veraltet";
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      input.value = "Ken Akzeptiert";
    });
    await saveButton.dispatchEvent("click");
    await avatarSwatch.dispatchEvent("click");
    await page.waitForTimeout(250);

    expect(profileRequestNames).toEqual(["Ken Akzeptiert"]);
    releaseProfileResponses[0]();
    await expect(nameInput).toBeEnabled();
    await expect(nameInput).toHaveValue("Ken Akzeptiert");
    await expect(nameInput).toHaveAttribute("data-save-editor", "original");
    await expect(editButton).toBeEnabled();
    await expect(avatarEditButton).toBeEnabled();
    await expect(avatarSwatch).toBeEnabled();
    await expect(recoveryButton).toBeEnabled();
    await expect(deleteButton).toBeEnabled();
    await expect(page.locator("[data-profile-name-status]")).toContainText("Der Name konnte gerade nicht synchronisiert werden.");
    await expect(page.locator("[data-profile-display-name]")).toHaveText("Test 1");
  } finally {
    releaseProfileResponses.forEach((release) => release());
    await visitor.context.close();
    await server.close();
  }
});

test("avatar choices keep a compact profile surface and render initials tokens everywhere", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.setViewportSize({ width: 320, height: 874 });
    await page.locator("[data-empty-add-list]").click();
    await expect(page.locator(".note-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Profil öffnen" }).click();

    await page.locator("[data-edit-avatar]").click();
    const editor = page.locator("[data-avatar-editor]");
    await expect(editor).toBeVisible();
    await expect(editor.getByRole("button", { name: "Foto auswählen" })).toBeVisible();
    await expect(editor.getByRole("button", { name: "Initialen gestalten" })).toBeVisible();
    await expect(editor.getByRole("button", { name: "Avatar entfernen" })).toBeVisible();
    const targetSizes = await editor.locator("button").evaluateAll((buttons) => buttons
      .map((button) => {
        const box = button.getBoundingClientRect();
        return { width: box.width, height: box.height };
      })
      .filter(({ width, height }) => width > 0 && height > 0));
    expect(targetSizes).toHaveLength(3);
    expect(targetSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);

    await editor.getByRole("button", { name: "Initialen gestalten" }).click();
    const swatches = editor.locator("[data-avatar-palette]");
    await expect(swatches).toHaveCount(6);
    const swatchSizes = await swatches.evaluateAll((buttons) => buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { width: box.width, height: box.height };
    }));
    expect(swatchSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
    const swatchBounds = await swatches.evaluateAll((buttons) => {
      const register = document.querySelector("#profileRegister").getBoundingClientRect();
      return buttons.map((button) => {
        const box = button.getBoundingClientRect();
        return {
          inside: box.left >= register.left && box.right <= register.right,
          left: box.left,
          right: box.right,
          registerLeft: register.left,
          registerRight: register.right
        };
      });
    });
    expect(swatchBounds.every(({ inside }) => inside)).toBe(true);

    const tokenMarkup = await page.evaluate(() => ({
      normalized: memberAvatarMarkup({ displayName: "Ken Beispiel", role: "editor", avatarUrl: "INITIALS:OCEAN" }),
      unknown: memberAvatarMarkup({ displayName: "Ken Beispiel", role: "editor", avatarUrl: "initials:not-a-palette" })
    }));
    expect(tokenMarkup.normalized).not.toContain("<img");
    expect(tokenMarkup.normalized).toContain("#2f7792");
    expect(tokenMarkup.unknown).not.toContain("<img");
    expect(tokenMarkup.unknown).toContain("#4d5d71");
    await swatches.nth(1).click();

    await expect(page.locator("[data-edit-avatar] .member-avatar.is-initials-avatar")).toHaveCount(1);
    await expect(page.locator("[data-edit-avatar] img")).toHaveCount(0);
    await expect(page.locator(".note-card .member-avatar.is-initials-avatar")).toHaveCount(1);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("name and avatar changes share one pending profile write", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  const profileRequests = [];
  const releaseProfileResponses = [];
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        profileRequests.push(payload.args.args);
        await new Promise((resolve) => { releaseProfileResponses.push(resolve); });
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: null, error: { message: "sync_failed", code: "server_error" } })
        });
        return;
      }
      await route.continue();
    });

    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-profile-name]").click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-choose-avatar-initials]").click();
    const nameInput = page.locator("#profileNameInput");
    const nameSave = page.locator("[data-save-profile-name]");
    const nameEdit = page.locator("[data-edit-profile-name]");
    const avatarEdit = page.locator("[data-edit-avatar]");
    const swatch = page.locator("[data-avatar-palette]").first();
    await nameInput.fill("Darf nicht parallel speichern");
    await swatch.click();
    await expect.poll(() => releaseProfileResponses.length).toBe(1);

    await expect(nameInput).toBeDisabled();
    await expect(nameSave).toBeDisabled();
    await expect(nameEdit).toBeDisabled();
    await expect(avatarEdit).toBeDisabled();
    await nameSave.dispatchEvent("click");
    await page.waitForTimeout(200);
    expect(profileRequests).toHaveLength(1);

    releaseProfileResponses[0]();
    await expect(nameInput).toBeEnabled();
    await expect(nameSave).toBeEnabled();
    await expect(nameEdit).toBeEnabled();
    await expect(avatarEdit).toBeEnabled();
    await expect(page.locator("[data-avatar-status]")).toContainText("Der Avatar konnte gerade nicht synchronisiert werden.");
  } finally {
    releaseProfileResponses.forEach((release) => release());
    await visitor.context.close();
    await server.close();
  }
});

test("a delayed name response cannot overwrite a newly active account", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  let releaseProfileResponse;
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        await new Promise((resolve) => { releaseProfileResponse = resolve; });
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: null, error: null })
        });
        return;
      }
      await route.continue();
    });

    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-profile-name]").click();
    await page.locator("#profileNameInput").fill("Alter Account Name");
    await page.locator("[data-save-profile-name]").click();
    await expect.poll(() => Boolean(releaseProfileResponse)).toBe(true);
    await page.evaluate(() => {
      currentUser = {
        ...currentUser,
        userId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        authUserId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        displayName: "Neuer Account"
      };
    });

    releaseProfileResponse();
    await expect.poll(() => page.evaluate(() => currentUser.displayName)).toBe("Neuer Account");
    await expect.poll(() => page.evaluate(() => currentUser.userId)).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    await expect(page.locator("[data-profile-name-status]")).toContainText("Account wurde gewechselt");
  } finally {
    releaseProfileResponse?.();
    await visitor.context.close();
    await server.close();
  }
});

test("a delayed avatar response cannot overwrite a newly active account", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  let releaseProfileResponse;
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        await new Promise((resolve) => { releaseProfileResponse = resolve; });
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: null, error: null })
        });
        return;
      }
      await route.continue();
    });

    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-choose-avatar-initials]").click();
    await page.locator("[data-avatar-palette='ocean']").click();
    await expect.poll(() => Boolean(releaseProfileResponse)).toBe(true);
    await page.evaluate(() => {
      currentUser = {
        ...currentUser,
        userId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        authUserId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        displayName: "Neuer Account",
        avatarUrl: "initials:violet"
      };
    });

    releaseProfileResponse();
    await expect.poll(() => page.evaluate(() => currentUser.avatarUrl)).toBe("initials:violet");
    await expect.poll(() => page.evaluate(() => currentUser.userId)).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    await expect(page.locator("[data-avatar-status]")).toContainText("Account wurde gewechselt");
  } finally {
    releaseProfileResponse?.();
    await visitor.context.close();
    await server.close();
  }
});

test("avatar photo upload persists through profile reopen and removal restores initials", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();

    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });

    const avatarImage = page.locator("[data-edit-avatar] img");
    await expect(avatarImage).toBeVisible();
    await expect(avatarImage).toHaveAttribute("src", new RegExp(`__test__/avatar/[^/]+/${avatarFilenameSource}\\?v=`, "i"));
    await expect.poll(() => server.state.avatarObjects.size).toBe(1);
    const storedAvatar = [...server.state.avatarObjects.values()][0];
    expect(storedAvatar.contentType).toMatch(/^image\/(webp|png)$/);
    const avatarResponse = await page.request.get(await avatarImage.getAttribute("src"));
    expect(avatarResponse.headers()["content-type"]).toBe(storedAvatar.contentType);

    await page.locator("#profileRegisterCloseButton").click();
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect(page.locator("[data-edit-avatar] img")).toHaveAttribute("src", new RegExp(`__test__/avatar/[^/]+/${avatarFilenameSource}\\?v=`, "i"));

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();
    await expect(page.locator("[data-edit-avatar] img")).toHaveCount(0);
    await expect(page.locator("[data-edit-avatar]")).toContainText("T1");
    await expect.poll(() => server.state.avatarObjects.size).toBe(0);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("avatar replacement switches profile before deleting the old slot", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "first.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    await expect(avatarImage).toBeVisible();
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "second.png", mimeType: "image/png", buffer: png });

    await expect.poll(async () => avatarImage.getAttribute("src")).not.toBe(oldUrl);
    const newUrl = await avatarImage.getAttribute("src");
    const newPath = new URL(newUrl).pathname.replace("/__test__/avatar/", "");
    expect(newPath).not.toBe(oldPath);
    expect(server.state.avatarEvents).toEqual([
      { type: "storage-upload", path: newPath, ok: true },
      { type: "profile-update", avatarUrl: newUrl, ok: true },
      { type: "storage-remove", path: oldPath, ok: true }
    ]);
    expect([...server.state.avatarObjects.keys()]).toEqual([`avatars:${newPath}`]);
    expect([...server.state.accounts.values()][0].avatarUrl).toBe(newUrl);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("two authenticated devices stage distinct avatar slots before last profile write wins", async ({ browser }) => {
  const server = await startTestServer();
  const first = await createIsolatedPage(browser, server);
  const second = await createIsolatedPage(browser, server);
  let releaseFirstProfile;
  let releaseSecondProfile;
  try {
    await first.page.goto(server.origin);
    await waitForReady(first.page);
    await second.page.goto(server.origin);
    await waitForReady(second.page);

    const firstAccountId = await first.page.evaluate(() => currentUser.userId);
    const firstAuthUserId = await first.page.evaluate(() => currentUser.authUserId);
    const secondAuthUserId = await connectVisitorToAccount(server, second, firstAccountId);
    expect(secondAuthUserId).not.toBe(firstAuthUserId);
    await expect.poll(() => second.page.evaluate(() => currentUser.userId)).toBe(firstAccountId);

    const baselinePng = await coloredPng(first.page, "#20a060");
    await first.page.getByRole("button", { name: "Profil öffnen" }).click();
    await first.page.locator("[data-edit-avatar]").click();
    await first.page.locator("[data-avatar-file]").setInputFiles({ name: "baseline.png", mimeType: "image/png", buffer: baselinePng });
    const baselineUrl = await first.page.locator("[data-edit-avatar] img").getAttribute("src");
    const baselinePath = new URL(baselineUrl).pathname.replace("/__test__/avatar/", "");
    const baselineObject = server.state.avatarObjects.get(`avatars:${baselinePath}`);
    expect(baselinePath).toBe(`${firstAccountId}/avatar-${firstAuthUserId}-a.webp`);
    expect(baselineObject).toBeTruthy();

    await second.page.reload();
    await waitForReady(second.page);
    await second.page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect(second.page.locator("[data-edit-avatar] img")).toHaveAttribute("src", baselineUrl);
    server.state.avatarEvents.length = 0;

    await first.page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        await new Promise((resolve) => { releaseFirstProfile = resolve; });
      }
      await route.continue();
    });
    await second.page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "update_account_profile") {
        await new Promise((resolve) => { releaseSecondProfile = resolve; });
      }
      await route.continue();
    });

    const firstPng = await coloredPng(first.page, "#d34242");
    const secondPng = await coloredPng(second.page, "#3268d8");
    await first.page.locator("[data-edit-avatar]").click();
    await second.page.locator("[data-edit-avatar]").click();
    const firstSelection = first.page.locator("[data-avatar-file]").setInputFiles({ name: "first.png", mimeType: "image/png", buffer: firstPng });
    const secondSelection = second.page.locator("[data-avatar-file]").setInputFiles({ name: "second.png", mimeType: "image/png", buffer: secondPng });

    await expect.poll(() => server.state.avatarEvents.filter((event) => event.type === "storage-upload").length).toBe(2);
    await expect.poll(() => Boolean(releaseFirstProfile && releaseSecondProfile)).toBe(true);
    const stagedPaths = server.state.avatarEvents.filter((event) => event.type === "storage-upload").map((event) => event.path);
    const firstPath = `${firstAccountId}/avatar-${firstAuthUserId}-b.webp`;
    const secondPath = `${firstAccountId}/avatar-${secondAuthUserId}-a.webp`;
    expect(new Set(stagedPaths)).toEqual(new Set([firstPath, secondPath]));
    expect(server.state.accounts.get(firstAccountId).avatarUrl).toBe(baselineUrl);
    expect(server.state.avatarObjects.get(`avatars:${baselinePath}`).bytes.equals(baselineObject.bytes)).toBe(true);
    expect(server.state.avatarObjects.get(`avatars:${firstPath}`).bytes.equals(baselineObject.bytes)).toBe(false);
    expect(server.state.avatarObjects.get(`avatars:${secondPath}`).bytes.equals(baselineObject.bytes)).toBe(false);
    const firstStagedBytes = Buffer.from(server.state.avatarObjects.get(`avatars:${firstPath}`).bytes);
    const secondStagedBytes = Buffer.from(server.state.avatarObjects.get(`avatars:${secondPath}`).bytes);
    expect(firstStagedBytes.equals(secondStagedBytes)).toBe(false);

    releaseFirstProfile();
    await firstSelection;
    await expect.poll(() => server.state.accounts.get(firstAccountId).avatarUrl.includes(firstPath)).toBe(true);
    await expect.poll(() => server.state.avatarObjects.has(`avatars:${baselinePath}`)).toBe(false);
    expect(server.state.avatarObjects.has(`avatars:${secondPath}`)).toBe(true);

    releaseSecondProfile();
    await secondSelection;
    await expect.poll(() => server.state.accounts.get(firstAccountId).avatarUrl.includes(secondPath)).toBe(true);
    expect(server.state.avatarObjects.has(`avatars:${firstPath}`)).toBe(true);
    expect(server.state.avatarObjects.has(`avatars:${secondPath}`)).toBe(true);
    expect(server.state.avatarObjects.get(`avatars:${firstPath}`).bytes.equals(firstStagedBytes)).toBe(true);
    expect(server.state.avatarObjects.get(`avatars:${secondPath}`).bytes.equals(secondStagedBytes)).toBe(true);
  } finally {
    releaseFirstProfile?.();
    releaseSecondProfile?.();
    await Promise.all([first.context.close(), second.context.close()]);
    await server.close();
  }
});

test("failed profile sync removes the staged slot and preserves the old avatar", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "first.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;
    server.state.avatarFailures.profileUpdate.push("profile_sync_failed");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "second.png", mimeType: "image/png", buffer: png });

    await expect(page.locator("[data-avatar-status]")).toContainText("Der Avatar konnte gerade nicht synchronisiert werden.");
    await expect(avatarImage).toHaveAttribute("src", oldUrl);
    expect([...server.state.avatarObjects.keys()]).toEqual([`avatars:${oldPath}`]);
    expect([...server.state.accounts.values()][0].avatarUrl).toBe(oldUrl);
    expect(server.state.avatarEvents.map(({ type, ok }) => ({ type, ok }))).toEqual([
      { type: "storage-upload", ok: true },
      { type: "profile-update", ok: false },
      { type: "storage-remove", ok: true }
    ]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("failed profile clear leaves the stored avatar untouched", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;
    server.state.avatarFailures.profileUpdate.push("profile_sync_failed");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-avatar-status]")).toContainText("Der Avatar konnte gerade nicht synchronisiert werden.");
    await expect(avatarImage).toHaveAttribute("src", oldUrl);
    expect([...server.state.avatarObjects.keys()]).toEqual([`avatars:${oldPath}`]);
    expect([...server.state.accounts.values()][0].avatarUrl).toBe(oldUrl);
    expect(server.state.avatarEvents).toEqual([{ type: "profile-update", avatarUrl: "", ok: false }]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("failed avatar object removal restores the old server profile", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;
    server.state.avatarFailures.storageRemove.push("storage_remove_failed");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-avatar-status]")).toContainText("Der Avatar konnte gerade nicht synchronisiert werden.");
    await expect(avatarImage).toHaveAttribute("src", oldUrl);
    expect([...server.state.avatarObjects.keys()]).toEqual([`avatars:${oldPath}`]);
    expect([...server.state.accounts.values()][0].avatarUrl).toBe(oldUrl);
    expect(server.state.avatarEvents).toEqual([
      { type: "profile-update", avatarUrl: "", ok: true },
      { type: "storage-remove", path: oldPath, ok: false },
      { type: "profile-update", avatarUrl: oldUrl, ok: true }
    ]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("committed avatar removal with a rejected response reconciles to the cleared server profile", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;
    server.state.avatarFailures.storageRemoveResponse.push("reject_after_commit");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-avatar-status]")).toContainText("Serverstand wurde geprüft");
    await expect(avatarImage).toHaveCount(0);
    expect(server.state.accounts.values().next().value.avatarUrl).toBe("");
    expect(server.state.avatarObjects.has(`avatars:${oldPath}`)).toBe(false);
    await expect.poll(() => page.evaluate(() => currentUser.avatarUrl)).toBe("");
    expect(server.state.avatarEvents).toEqual([
      { type: "profile-update", avatarUrl: "", ok: true },
      { type: "storage-remove", path: oldPath, ok: true },
      { type: "profile-fetch", avatarUrl: "", ok: true }
    ]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("failed removal rollback keeps local avatar aligned with the cleared server profile", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;
    server.state.avatarFailures.profileUpdate.push(null, "rollback_failed");
    server.state.avatarFailures.storageRemove.push("storage_remove_failed");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-avatar-status]")).toContainText("nicht vollständig gelöscht");
    await expect(avatarImage).toHaveCount(0);
    expect([...server.state.avatarObjects.keys()]).toEqual([`avatars:${oldPath}`]);
    expect([...server.state.accounts.values()][0].avatarUrl).toBe("");
    await expect.poll(() => page.evaluate(() => currentUser.avatarUrl)).toBe("");
    expect(server.state.avatarEvents).toEqual([
      { type: "profile-update", avatarUrl: "", ok: true },
      { type: "storage-remove", path: oldPath, ok: false },
      { type: "profile-update", avatarUrl: oldUrl, ok: false }
    ]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("committed rollback with a rejected response reconciles to the restored server profile", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    const oldPath = new URL(oldUrl).pathname.replace("/__test__/avatar/", "");
    server.state.avatarEvents.length = 0;
    server.state.avatarFailures.storageRemove.push("storage_remove_failed");
    server.state.avatarFailures.profileUpdateResponse.push(null, "reject_after_commit");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-avatar-status]")).toContainText("Serverstand wurde geprüft");
    await expect(avatarImage).toHaveAttribute("src", oldUrl);
    expect(server.state.accounts.values().next().value.avatarUrl).toBe(oldUrl);
    expect(server.state.avatarObjects.has(`avatars:${oldPath}`)).toBe(true);
    await expect.poll(() => page.evaluate(() => currentUser.avatarUrl)).toBe(oldUrl);
    expect(server.state.avatarEvents).toEqual([
      { type: "profile-update", avatarUrl: "", ok: true },
      { type: "storage-remove", path: oldPath, ok: false },
      { type: "profile-update", avatarUrl: oldUrl, ok: true },
      { type: "profile-fetch", avatarUrl: oldUrl, ok: true }
    ]);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("ambiguous avatar removal keeps an uncertain retry state when confirmation also fails", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    const oldUrl = await avatarImage.getAttribute("src");
    server.state.avatarFailures.storageRemoveResponse.push("reject_after_commit");
    server.state.avatarFailures.accountFetch.push("account_fetch_failed");

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-avatar-status]")).toContainText("Ausgang ist noch unklar");
    await expect(avatarImage).toHaveAttribute("src", oldUrl);
    await expect.poll(() => page.evaluate(() => currentUser.avatarUrl)).toBe(oldUrl);
    await expect(page.locator("[data-remove-avatar]")).toBeEnabled();
    expect(server.state.accounts.values().next().value.avatarUrl).toBe("");
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("avatar upload failure keeps the previous avatar and shows an inline error", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL7dgAAAABJRU5ErkJggg==", "base64");
    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });
    const avatarImage = page.locator("[data-edit-avatar] img");
    await expect(avatarImage).toBeVisible();
    const previousAvatarUrl = await avatarImage.getAttribute("src");

    await page.locator("[data-edit-avatar]").click();

    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "storage-upload") {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: null, error: { message: "storage_failed", code: "storage_error" } })
        });
        return;
      }
      await route.continue();
    });

    await page.locator("[data-avatar-file]").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: png });

    await expect(page.locator("[data-avatar-status]")).toContainText("Der Avatar konnte gerade nicht synchronisiert werden.");
    await expect(avatarImage).toHaveAttribute("src", previousAvatarUrl);
    await expect.poll(() => server.state.avatarObjects.size).toBe(1);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("removing initials does not call avatar storage", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  let storageRemovals = 0;
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();
    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-choose-avatar-initials]").click();
    await page.locator("[data-avatar-palette='ocean']").click();
    await expect(page.locator("[data-edit-avatar] .member-avatar.is-initials-avatar")).toHaveCount(1);
    await page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "storage-remove") storageRemovals += 1;
      await route.continue();
    });

    await page.locator("[data-edit-avatar]").click();
    await page.locator("[data-remove-avatar]").click();

    await expect(page.locator("[data-edit-avatar] img")).toHaveCount(0);
    await expect(page.locator("[data-edit-avatar]")).toContainText("T1");
    expect(storageRemovals).toBe(0);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("account protection expands recovery actions without closing the profile register", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);
    await page.getByRole("button", { name: "Profil öffnen" }).click();

    const toggle = page.locator("[data-toggle-account-protection]");
    const actions = page.locator("[data-account-protection-actions]");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(actions).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(actions).toBeVisible();
    await expect(actions.locator("[data-create-recovery-code]")).toBeVisible();
    await expect(actions.locator("[data-open-account-recovery]")).toBeVisible();
    await expect(page.locator("#profileRegister")).toBeVisible();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("profile and options registers remain exclusive and close on every register path", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    const profile = visitor.page.locator("#profileRegister");
    const options = visitor.page.locator("#topOptions");

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect(profile).toBeVisible();
    await visitor.page.locator("#topMenuButton").dispatchEvent("click");
    await expect(options).toBeVisible();
    await expect(profile).toBeHidden();

    await visitor.page.locator("#accountButton").dispatchEvent("click");
    await expect(profile).toBeVisible();
    await expect(options).toBeHidden();
    await visitor.page.locator("#profileRegisterCloseButton").click();

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect(profile).toBeVisible();
    await visitor.page.locator("#profileRegisterCloseButton").click();
    await expect(profile).toBeHidden();

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await visitor.page.locator("#profileRegisterScrim").click({ position: { x: 2, y: 2 } });
    await expect(profile).toBeHidden();

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await visitor.page.keyboard.press("Escape");
    await expect(profile).toBeHidden();

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await visitor.page.getByRole("button", { name: "Verwalten", exact: true }).click();
    await expect(visitor.page.getByRole("heading", { name: "Geräte" })).toBeVisible();
    await expect(profile).toBeHidden();
    await visitor.page.getByRole("button", { name: "Gerät hinzufügen", exact: true }).click();
    await expect(visitor.page.getByRole("heading", { name: "Gerät hinzufügen" })).toBeVisible();
    await expect(visitor.page.locator("#modalContent [data-device-pairing]")).toBeVisible();
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("modal pairing copy action copies its modal link instead of the hidden profile link", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  try {
    await visitor.page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (value) => { window.__copiedPairingLink = value; } }
      });
    });
    visitor.page.on("dialog", (dialog) => dialog.accept());
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    const profilePanel = visitor.page.locator("#profileRegisterContent [data-pairing-url]");
    await expect(profilePanel).toBeVisible();
    const profileLink = await profilePanel.getAttribute("data-pairing-url");

    await visitor.page.getByRole("button", { name: "Verwalten", exact: true }).click();
    await visitor.page.getByRole("button", { name: "Gerät hinzufügen", exact: true }).click();
    const modalPanel = visitor.page.locator("#modalContent [data-pairing-url]");
    await expect(modalPanel).toBeVisible();
    const modalLink = await modalPanel.getAttribute("data-pairing-url");
    expect(modalLink).not.toBe(profileLink);

    await modalPanel.getByRole("button", { name: "Link kopieren", exact: true }).click();
    await expect.poll(() => visitor.page.evaluate(() => window.__copiedPairingLink)).toBe(modalLink);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("closing profile during delayed approval prevents rendering and polling restart", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  let releaseApproval;
  let approvalReleased = false;
  let pairingStatusRequestsAfterClose = 0;
  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await visitor.page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      const rpcName = payload.action === "rpc" ? payload.args?.name : "";
      if (rpcName === "approve_device_pairing_v3") {
        await new Promise((resolve) => { releaseApproval = resolve; });
        const pairingId = payload.args?.args?.target_pairing_id;
        const pairing = server.state.pairingRequests.get(pairingId);
        if (pairing) pairing.status = "approved";
        approvalReleased = true;
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({ data: { ok: true, status: "approved" }, error: null })
        });
        return;
      }
      if (rpcName === "get_device_pairing_status_v3" && approvalReleased) pairingStatusRequestsAfterClose += 1;
      await route.continue();
    });

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    const approveButton = visitor.page.locator("#profileRegisterContent [data-approve-device-pairing]");
    await expect(approveButton).toBeVisible();
    await approveButton.click();
    await expect.poll(() => Boolean(releaseApproval)).toBe(true);

    await visitor.page.locator("#profileRegisterCloseButton").click();
    await expect(visitor.page.locator("#profileRegister")).toBeHidden();
    releaseApproval();

    await visitor.page.waitForTimeout(1800);
    await expect(visitor.page.locator("#profileRegisterContent").getByText("Gerät verbunden.", { exact: true })).toHaveCount(0);
    expect(pairingStatusRequestsAfterClose).toBe(0);
  } finally {
    releaseApproval?.();
    await visitor.context.close();
    await server.close();
  }
});

test("closing the profile register prevents a delayed pairing from rendering or polling", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);
  let releasePairing;
  let pairingStatusRequests = 0;
  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await visitor.page.route("**/__test__/collaboration-api", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.action === "rpc" && payload.args?.name === "create_device_pairing") {
        await new Promise((resolve) => { releasePairing = resolve; });
      }
      if (payload.action === "rpc" && payload.args?.name === "get_device_pairing_status_v3") pairingStatusRequests += 1;
      await route.continue();
    });

    await visitor.page.getByRole("button", { name: "Profil öffnen" }).click();
    await expect.poll(() => Boolean(releasePairing)).toBe(true);
    await visitor.page.locator("#profileRegisterCloseButton").click();
    await expect(visitor.page.locator("#profileRegister")).toBeHidden();
    releasePairing();

    await visitor.page.waitForTimeout(1800);
    await expect(visitor.page.locator("#profileRegister [data-device-pairing]")).toHaveCount(0);
    expect(pairingStatusRequests).toBe(0);
  } finally {
    releasePairing?.();
    await visitor.context.close();
    await server.close();
  }
});

test("Pinnwand controls center add actions and integrate the active notch", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  const expectCentered = async (selector) => {
    const offset = await visitor.page.locator(selector).evaluate((action) => {
      const actionBox = action.getBoundingClientRect();
      const boardBox = document.querySelector(".notes-board").getBoundingClientRect();
      return Math.abs((actionBox.left + actionBox.width / 2) - (boardBox.left + boardBox.width / 2));
    });
    expect(offset).toBeLessThanOrEqual(3);
  };

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    const shell = await visitor.page.locator(".topbar").evaluate((topbar) => {
      const topbarBox = topbar.getBoundingClientRect();
      const menuBox = topbar.querySelector("#topMenuButton").getBoundingClientRect();
      const profileBox = topbar.querySelector("#accountButton").getBoundingClientRect();
      return {
        menuOffset: Math.abs(menuBox.left - topbarBox.left),
        profileOffset: Math.abs(profileBox.right - topbarBox.right)
      };
    });
    expect(shell.menuOffset).toBeLessThanOrEqual(1);
    expect(shell.profileOffset).toBeLessThanOrEqual(1);
    await expectCentered(".empty-notes-state .new-note-action");
    const emptyAction = await visitor.page.locator(".empty-notes-state .new-note-action").evaluate((action) => {
      const button = action.querySelector(".add-note-button");
      const style = getComputedStyle(button);
      return {
        direction: getComputedStyle(action).flexDirection,
        glyph: button.textContent.trim(),
        border: style.borderTopStyle,
        backgroundClip: style.backgroundClip || style.webkitBackgroundClip,
        width: button.getBoundingClientRect().width,
        height: button.getBoundingClientRect().height
      };
    });
    expect(emptyAction.direction).toBe("column");
    expect(emptyAction.glyph).toBe("+");
    expect(emptyAction.border).toBe("none");
    expect(emptyAction.backgroundClip).toContain("text");
    expect(emptyAction.width).toBeGreaterThanOrEqual(44);
    expect(emptyAction.height).toBeGreaterThanOrEqual(44);
    await visitor.page.locator("[data-empty-add-list]").click();
    await expect(visitor.page.locator(".note-card")).toHaveCount(1);
    await expect(visitor.page.locator(".note-card")).toBeVisible();
    await waitForStableElement(visitor.page, ".note-card");
    await expectCentered(".notes-board-actions .new-note-action");

    const metrics = await visitor.page.locator(".note-card").evaluate((card) => {
      const rect = (element) => element.getBoundingClientRect();
      const activation = card.querySelector(".list-activation-button");
      const cardBox = rect(card);
      const activationBox = rect(activation);
      const controls = [
        card.querySelector(".edit-note-button"),
        card.querySelector(".share-button"),
        card.querySelector(".manual-add button"),
        card.querySelector(".note-delete-button")
      ];
      return {
        activeText: activation.textContent.trim(),
        notchTopOffset: Math.abs(activationBox.top - cardBox.top),
        notchWidth: activationBox.width,
        notchHeight: activationBox.height,
        shareText: card.querySelector(".share-button").textContent.trim(),
        controls: controls.map((control) => ({
          width: rect(control).width,
          height: rect(control).height,
          radius: getComputedStyle(control).borderRadius
        }))
      };
    });
    expect(metrics.activeText).toBe("Aktiv");
    expect(metrics.notchTopOffset).toBeLessThanOrEqual(1);
    expect(metrics.notchWidth).toBeGreaterThanOrEqual(120);
    expect(metrics.notchHeight).toBeGreaterThanOrEqual(42);
    expect(metrics.shareText).toBe("");
    for (const control of metrics.controls) {
      expect(control.width).toBeGreaterThanOrEqual(44);
      expect(control.height).toBeGreaterThanOrEqual(44);
      expect(Number.parseFloat(control.radius)).toBeGreaterThanOrEqual(20);
    }
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("manual item suggestions show product names on dark Graphite material", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);
    await visitor.page.locator("[data-empty-add-list]").click();
    const input = visitor.page.locator("[data-manual-input]");
    await input.fill("apf");

    const suggestions = visitor.page.locator("[data-manual-suggestions]");
    await expect(suggestions).toBeVisible();
    await expect(suggestions.getByText("Äpfel", { exact: true })).toBeVisible();
    await expect(suggestions.getByRole("option", { name: "Äpfel Obst" })).toBeVisible();

    const material = await suggestions.evaluate((container) => {
      const parseColor = (value) => value.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [255, 255, 255];
      const luminance = (channels) => channels
        .map((channel) => {
          const value = channel / 255;
          return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        })
        .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const background = parseColor(getComputedStyle(container).backgroundColor);
      const name = container.querySelector("button span");
      const foreground = parseColor(getComputedStyle(name).color);
      const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
      return {
        background,
        contrast: (lighter + 0.05) / (darker + 0.05)
      };
    });
    expect(Math.max(...material.background)).toBeLessThanOrEqual(45);
    expect(material.contrast).toBeGreaterThanOrEqual(4.5);
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("Graphite Midnight dialogs keep auth, support, sharing, market, and prices readable", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  const expectModalPresentation = async (heading) => {
    await expect(visitor.page.getByRole("heading", { name: heading })).toBeVisible();
    const metrics = await readDialogPresentation(visitor.page, ".modal-card");
    expect(metrics.withinViewport, `${heading} within viewport`).toBe(true);
    expect(metrics.horizontalOverflow, `${heading} horizontal overflow`).toBe(false);
    expect(Math.max(...metrics.background), `${heading} graphite card`).toBeLessThanOrEqual(38);
    expect(metrics.contrast, `${heading} text contrast`).toBeGreaterThanOrEqual(4.5);
    expect(metrics.closeWidth, `${heading} close width`).toBeGreaterThanOrEqual(44);
    expect(metrics.closeHeight, `${heading} close height`).toBeGreaterThanOrEqual(44);
  };

  try {
    await visitor.page.goto(server.origin);
    await waitForReady(visitor.page);

    await visitor.page.locator("#authGate").evaluate((gate) => gate.classList.remove("is-hidden"));
    const authMetrics = await readDialogPresentation(visitor.page, ".auth-sheet");
    expect(authMetrics.withinViewport, "auth gate within viewport").toBe(true);
    expect(authMetrics.horizontalOverflow, "auth gate horizontal overflow").toBe(false);
    expect(Math.max(...authMetrics.background), "auth gate graphite glass").toBeLessThanOrEqual(38);
    expect(authMetrics.contrast, "auth gate text contrast").toBeGreaterThanOrEqual(4.5);
    await visitor.page.locator("#authGate").evaluate((gate) => gate.classList.add("is-hidden"));

    await visitor.page.locator("[data-empty-add-list]").click();
    await expect(visitor.page.locator("[data-share-list]")).toBeVisible();

    await visitor.page.getByRole("button", { name: "Optionen öffnen" }).click();
    await visitor.page.locator("#imprintButton").click();
    await expectModalPresentation("Impressum");
    await visitor.page.locator("#modalCloseButton").click();

    await visitor.page.getByRole("button", { name: "Optionen öffnen" }).click();
    await visitor.page.locator("#bugreportButton").click();
    await expectModalPresentation("Bugreport");
    const bugInput = visitor.page.locator("#bugReportText");
    await bugInput.focus();
    const bugInputStyles = await bugInput.evaluate((input) => {
      const style = getComputedStyle(input);
      return { background: style.backgroundColor, border: style.borderColor, boxShadow: style.boxShadow };
    });
    expect(bugInputStyles.background).toBe("rgb(12, 17, 23)");
    expect(bugInputStyles.border).toBe("rgb(119, 174, 228)");
    expect(bugInputStyles.boxShadow).not.toBe("none");
    expect(await bugInput.inputValue()).toContain("Bugreport für Zettel");
    await visitor.page.locator("#modalCloseButton").click();

    await visitor.page.locator("#accountButton").click();
    await expect(visitor.page.getByRole("heading", { name: "Profil" })).toBeVisible();
    await visitor.page.locator("[data-toggle-account-protection]").click();
    await expect(visitor.page.getByRole("button", { name: /Account sichern|Neuen Wiederherstellungscode erzeugen/ })).toBeVisible();
    const deleteButton = visitor.page.getByRole("button", { name: "Account löschen", exact: true });
    await expect(deleteButton).toBeVisible();
    expect(await deleteButton.evaluate((button) => getComputedStyle(button).backgroundColor)).toBe("rgb(157, 87, 88)");
    await visitor.page.locator("#profileRegisterCloseButton").click();

    for (const width of [393, 430, 1280]) {
      const marketVisitor = await createIsolatedPage(browser, server);
      const page = marketVisitor.page;
      try {
        await page.goto(server.origin);
        await page.setViewportSize({ width, height: width === 1280 ? 900 : 874 });
        await waitForReady(page);
        await page.locator("[data-empty-add-list]").click();
        await expect(page.locator("[data-share-list]")).toBeVisible();

        await page.locator("[data-share-list]").click();
        await expect(page.getByRole("heading", { name: "Zettel teilen" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Link kopieren", exact: true })).toBeVisible();
        const inviteCode = await readDialogMaterial(page, ".invite-card");
        expect(Math.max(...inviteCode.background), `${width}px invitation code material`).toBeLessThanOrEqual(55);
        expect(inviteCode.contrast, `${width}px invitation code contrast`).toBeGreaterThanOrEqual(4.5);
        await page.locator("#modalCloseButton").click();

        const shelfCard = page.locator(".shelf-card").first();
        await shelfCard.scrollIntoViewIfNeeded();
        await shelfCard.click();
        const productPriceButton = page.locator("[data-product-prices]").first();
        await expect(productPriceButton).toBeVisible();
        await productPriceButton.scrollIntoViewIfNeeded();
        await productPriceButton.click();
        await expect(page.locator(".product-price-panel")).toBeVisible();
        const priceMarketIcon = await readDialogMaterial(page, ".market-mini-icon", "svg");
        expect(Math.max(...priceMarketIcon.background), `${width}px price market icon material`).toBeLessThanOrEqual(55);
        expect(priceMarketIcon.contrast, `${width}px price market icon contrast`).toBeGreaterThanOrEqual(4.5);

        await page.locator(".market-price-main").first().click();
        await expect(page.locator(".market-detail-panel")).toBeVisible();
        const detailMarketIcon = await readDialogMaterial(page, ".market-detail-icon", "svg");
        expect(Math.max(...detailMarketIcon.background), `${width}px detail market icon material`).toBeLessThanOrEqual(55);
        expect(detailMarketIcon.contrast, `${width}px detail market icon contrast`).toBeGreaterThanOrEqual(4.5);
        await page.locator("#modalCloseButton").click();
        await productPriceButton.scrollIntoViewIfNeeded();
        await productPriceButton.click();

        await page.getByRole("button", { name: "Weitere Märkte hinzufügen", exact: true }).click();
        await expect(page.getByRole("heading", { name: "Märkte suchen" })).toBeVisible();
        const searchMarketIcon = await readDialogMaterial(page, ".market-mini-icon", "svg");
        expect(Math.max(...searchMarketIcon.background), `${width}px search market icon material`).toBeLessThanOrEqual(55);
        expect(searchMarketIcon.contrast, `${width}px search market icon contrast`).toBeGreaterThanOrEqual(4.5);
        const savePreview = page.locator(".market-preview-add");
        await expect(savePreview).toBeVisible();
        await savePreview.click();
        const savedPreview = await readDialogMaterial(page, ".market-preview-add.is-added", "svg");
        expect(Math.max(...savedPreview.background), `${width}px saved preview material`).toBeLessThanOrEqual(55);
        expect(savedPreview.contrast, `${width}px saved preview contrast`).toBeGreaterThanOrEqual(4.5);
      } finally {
        await marketVisitor.context.close();
      }
    }
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("market and price searches show a graphite focus ring when focused", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  const expectSearchFocus = async (input) => {
    await input.focus();
    await expect(input).toBeFocused();
    const styles = await input.evaluate((field) => {
      const inputStyle = getComputedStyle(field);
      const rowStyle = getComputedStyle(field.parentElement);
      return {
        borderColor: rowStyle.borderColor,
        boxShadow: rowStyle.boxShadow,
        outlineColor: inputStyle.outlineColor,
        outlineStyle: inputStyle.outlineStyle
      };
    });
    expect(styles.borderColor).toBe("rgb(119, 174, 228)");
    expect(styles.boxShadow).not.toBe("none");
    expect(styles.outlineColor).toBe("rgb(119, 174, 228)");
    expect(styles.outlineStyle).toBe("solid");
  };

  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);

    const shelfCard = page.locator(".shelf-card").first();
    await shelfCard.scrollIntoViewIfNeeded();
    await shelfCard.click();
    const productPriceButton = page.locator("[data-product-prices]").first();
    await productPriceButton.scrollIntoViewIfNeeded();
    await productPriceButton.click();
    await expectSearchFocus(page.locator("#priceMarketSearchInput"));

    await page.getByRole("button", { name: "Weitere Märkte hinzufügen", exact: true }).click();
    await expectSearchFocus(page.locator("#marketSearchInput"));
  } finally {
    await visitor.context.close();
    await server.close();
  }
});

test("share and market dialogs stay contained at mobile and desktop widths", async ({ browser }) => {
  const server = await startTestServer();

  try {
    for (const width of [393, 430, 1280]) {
      const visitor = await createIsolatedPage(browser, server);
      const page = visitor.page;
      try {
        await page.goto(server.origin);
        await page.setViewportSize({ width, height: width === 1280 ? 900 : 874 });
        await waitForReady(page);
        await page.locator("[data-empty-add-list]").click();

        await page.locator("[data-share-list]").click();
        await expect(page.getByRole("heading", { name: "Zettel teilen" })).toBeVisible();
        await expectDialogFitsViewport(page, `${width}px sharing`);
        await page.locator("#modalCloseButton").click();

        const shelfCard = page.locator(".shelf-card").first();
        await shelfCard.scrollIntoViewIfNeeded();
        await shelfCard.click();
        const productPriceButton = page.locator("[data-product-prices]").first();
        await productPriceButton.scrollIntoViewIfNeeded();
        await productPriceButton.click();
        await expect(page.locator(".product-price-panel")).toBeVisible();
        await expectDialogFitsViewport(page, `${width}px product prices`);

        const marketPrice = page.locator(".market-price-main").first();
        await marketPrice.scrollIntoViewIfNeeded();
        await marketPrice.click();
        await expect(page.locator(".market-detail-panel")).toBeVisible();
        await expectDialogFitsViewport(page, `${width}px market detail`);
        await page.locator("#modalCloseButton").click();

        await productPriceButton.scrollIntoViewIfNeeded();
        await productPriceButton.click();
        await page.getByRole("button", { name: "Weitere Märkte hinzufügen", exact: true }).click();
        await expect(page.getByRole("heading", { name: "Märkte suchen" })).toBeVisible();
        await expectDialogFitsViewport(page, `${width}px market search`);
      } finally {
        await visitor.context.close();
      }
    }
  } finally {
    await server.close();
  }
});

test("market price journey opens shelves and prices through Playwright clicks", async ({ browser }) => {
  const server = await startTestServer();
  const visitor = await createIsolatedPage(browser, server);

  try {
    const page = visitor.page;
    await page.goto(server.origin);
    await waitForReady(page);

    const shelfCard = page.locator(".shelf-card").first();
    await shelfCard.scrollIntoViewIfNeeded();
    await shelfCard.click();
    await expect(page.locator("#productGrid")).toBeVisible();

    const productPriceButton = page.locator("[data-product-prices]").first();
    await productPriceButton.scrollIntoViewIfNeeded();
    await productPriceButton.click();
    await expect(page.locator(".product-price-panel")).toBeVisible();

    const marketPrice = page.locator(".market-price-main").first();
    await marketPrice.scrollIntoViewIfNeeded();
    await marketPrice.click();
    await expect(page.locator(".market-detail-panel")).toBeVisible();
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
    await expect(owner.page.locator(".notes-board.is-empty")).toBeVisible();
    await waitForStableElement(owner.page, ".notes-board.is-empty");
    await waitForStableElement(owner.page, ".empty-notes-state .new-note-action");
    const emptyState = await owner.page.locator(".notes-board.is-empty").evaluate((board) => {
      const action = board.querySelector(".empty-notes-state .new-note-action");
      const boardBox = board.getBoundingClientRect();
      const actionBox = action.getBoundingClientRect();
      return {
        count: board.querySelectorAll("[data-empty-add-list]").length,
        horizontalOffset: Math.abs((actionBox.left + actionBox.width / 2) - (boardBox.left + boardBox.width / 2)),
        verticalOffset: Math.abs((actionBox.top + actionBox.height / 2) - (boardBox.top + boardBox.height / 2))
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
      expect(metrics.manualHeight, `${width}px manual input`).toBeLessThanOrEqual(56);
      expect(Math.max(...metrics.itemHeights), `${width}px item rows`).toBeLessThanOrEqual(46);
      expect(metrics.valueHeight, `${width}px value row`).toBeLessThanOrEqual(34);
      expect(metrics.valueBorderTopStyle, `${width}px value separator`).toBe("solid");
      expect(metrics.valueBorderRightWidth, `${width}px value box`).toBe(0);
      expect(metrics.shareFontFamily, `${width}px share font`).not.toMatch(/Noteworthy|Bradley|Chancery/i);
      expect(metrics.countFontFamily, `${width}px count font`).not.toMatch(/Noteworthy|Bradley|Chancery/i);
      expect(metrics.footerHeight, `${width}px footer`).toBeLessThanOrEqual(56);
      expect(metrics.cardHeight, `${width}px card height`).toBeLessThanOrEqual(420);
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

    await visitor.page.getByRole("button", { name: "Optionen öffnen" }).click();
    await expect(visitor.page.getByRole("button", { name: "Optionen öffnen" })).toHaveAttribute("aria-expanded", "true");
    await visitor.page.locator("#imprintButton").click();
    await expect(visitor.page.getByRole("heading", { name: "Impressum" })).toBeVisible();
    await expect(visitor.page.getByText("Version 0.7.6 · Build 76", { exact: true })).toBeVisible();

    await visitor.page.locator("#modalCloseButton").click();
    await visitor.page.getByRole("button", { name: "Optionen öffnen" }).click();
    await visitor.page.locator("#bugreportButton").click();
    const report = await visitor.page.locator("#bugReportText").inputValue();
    expect(report).toContain("App-Version: 0.7.6");
    expect(report).toContain("Build: 76");
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
      expect(metrics.actionContained, `${width}px action containment`).toBe(true);
      expect(metrics.secondRowBoardHeight, `${width}px second row board height`).toBeGreaterThanOrEqual(4);
      expect(metrics.secondRowBoardBackground, `${width}px second row titanium board`).toContain("linear-gradient");
      expect(metrics.cardBackgrounds.every((background) => background.includes("linear-gradient")), `${width}px dark glass cards`).toBe(true);
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
      await visitor.page.locator("#productGrid").screenshot({ path: `test-results/graphite-products-${width}.png` });
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
