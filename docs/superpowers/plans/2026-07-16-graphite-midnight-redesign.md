# Graphite Midnight Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die bestehende App ohne Aenderung ihrer Fachlogik auf die freigegebene Graphite-Midnight-Oberflaeche mit `Pinnwand | Markt`-Navigation umstellen.

**Architecture:** Die vorhandenen Ansichten, Event-Handler und Datenfluesse bleiben bestehen. Neue CSS-Tokens steuern die Materialsprache; eine kleine Workspace-Navigation fokussiert die bereits horizontal angeordneten Bereiche und spiegelt Wischbewegungen, ohne `activeView` fuer Markt, Produkte und Favoriten zu ersetzen.

**Tech Stack:** Statisches HTML, CSS, Browser-JavaScript, Node-Test-Runner, Playwright WebKit, bestehende PWA- und Service-Worker-Struktur.

## Global Constraints

- Keine Aenderung an Supabase, Realtime, Accounts, Einladungen oder Offline-Mutationen.
- Keine neuen Abhaengigkeiten.
- Sichtbare Hauptnavigation exakt `Pinnwand | Markt`.
- App-Name exakt `zettel`, Avenir Next Light, kleingeschrieben, einheitliche Groesse und geometrisch zentriert.
- Zettelnamen, Regaltitel und Produktnamen verwenden Optima; Bedienung und Metadaten verwenden SF Pro beziehungsweise die Apple-Systemschrift.
- Regalwahl zeigt auf 393 px und 430 px genau drei Spalten.
- Geoeffnete Regale zeigen auf 393 px und 430 px genau vier Produktspalten.
- Persoenliche und geteilte Zettel bleiben als getrennte Flaechen erkennbar.
- Bestehende Produktillustrationen und Produktdaten bleiben unveraendert.
- Touchziele fuer neue Befehle sind mindestens 44 mal 44 CSS-Pixel gross.
- Release erst nach vollstaendiger Umsetzung: Version `0.7.0`, Build `70`.

---

## File Map

- `styles.css`: Design-Tokens, Hintergrund, Kopfbereich, Pinnwand, Regale, Produktkarten, Modale und responsive Regeln.
- `index.html`: dunkle PWA-Farbe, kleingeschriebene Wortmarke, Menue-/Account-Symbole und Workspace-Navigation.
- `app.js`: Menue-Interaktion sowie Tippen/Wischen fuer die Workspace-Navigation; keine fachlichen Datenmutationen.
- `manifest.json`: dunkle Start- und Theme-Farben sowie Produktname `zettel`.
- `app-version.js`: abschliessende Version `0.7.0`, Build `70`.
- `sw.js`: bestehende Cache-Ableitung bleibt bestehen; nur Release-Cache wird ueber Build 70 erneuert.
- `tests/visual-theme.test.js`: statischer Vertrag fuer Tokens, Metadaten, Wortmarke und Navigation.
- `tests/browser/collaboration.spec.js`: visuelle und interaktive Vertraege auf 393 px und 430 px.
- `tests/assets.test.js`: Release-Query-Strings und Browser-Einstiegspunkt.
- `tests/app-version.test.js`: Release-Metadaten und Bugreport.

---

### Task 1: Graphite-Midnight-Grundlage

**Files:**
- Create: `tests/visual-theme.test.js`
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `manifest.json`

**Interfaces:**
- Consumes: bestehende CSS-Variablen und `body[data-background]`.
- Produces: feste Tokens `--gm-bg-top`, `--gm-bg-bottom`, `--gm-glass`, `--gm-paper`, `--gm-shared-paper`, `--gm-titanium` und `--gm-focus` fuer alle folgenden Tasks.

- [ ] **Step 1: Statischen Vertrag fuer Farben und PWA-Metadaten schreiben**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("Graphite Midnight exposes one dark token set and matching PWA colors", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const html = fs.readFileSync("index.html", "utf8");
  const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

  ["--gm-bg-top", "--gm-bg-bottom", "--gm-glass", "--gm-paper", "--gm-shared-paper", "--gm-titanium", "--gm-focus"]
    .forEach((token) => assert.ok(css.includes(token), token));
  assert.match(html, /<meta name="theme-color" content="#11161d">/);
  assert.equal(manifest.background_color, "#11161d");
  assert.equal(manifest.theme_color, "#11161d");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
```

- [ ] **Step 2: Test ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:unit`

Expected: FAIL, weil die `--gm-*`-Tokens und `#11161d` noch fehlen.

- [ ] **Step 3: Tokens, Grundverlauf und PWA-Farben umsetzen**

In `styles.css` den bestehenden `:root`-Block um diese Werte ergaenzen und die bisherige helle Body-Flaeche ersetzen:

```css
:root {
  --gm-bg-top: #252a31;
  --gm-bg-middle: #171c23;
  --gm-bg-bottom: #0b121d;
  --gm-glass: rgba(126, 151, 178, 0.1);
  --gm-glass-strong: rgba(151, 176, 204, 0.16);
  --gm-line: rgba(190, 210, 231, 0.13);
  --gm-paper: linear-gradient(145deg, #383e46 0%, #292f37 61%, #222831 100%);
  --gm-shared-paper: linear-gradient(145deg, #493a40 0%, #392f35 58%, #302a31 100%);
  --gm-titanium: linear-gradient(180deg, #edf0f2, #969da4);
  --gm-focus: #77aee4;
  --gm-text: #f1f4f7;
  --gm-muted: #9eafc0;
}

body {
  color: var(--gm-text);
  background: linear-gradient(145deg, var(--gm-bg-top) 0%, var(--gm-bg-middle) 48%, var(--gm-bg-bottom) 100%);
  background-attachment: fixed;
}
```

In `index.html` `theme-color` auf `#11161d` setzen. In `manifest.json` `background_color` und `theme_color` auf `#11161d` setzen sowie `name` und `short_name` auf `zettel` vereinheitlichen.

Die vorhandenen Selektoren `body[data-background="linen"]` und `body[data-background="clean"]` bleiben erhalten, werden aber auf dunkle, kompatible Graphitvarianten umgestellt. Dadurch erhalten auch Bestandsnutzer mit gespeichertem Hintergrund sofort die neue Oberflaeche, ohne ihre lokale Einstellung zu loeschen.

Bewegungsreduktion zentral absichern:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 4: Test und bestehenden Browserstart pruefen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:unit`

Expected: PASS fuer den neuen Farbvertrag und alle bestehenden Unit-Tests.

- [ ] **Step 5: Commit erstellen**

```bash
git add tests/visual-theme.test.js styles.css index.html manifest.json
git commit -m "style: add graphite midnight foundation"
```

---

### Task 2: Kopfbereich und Pinnwand-Markt-Navigation

**Files:**
- Modify: `tests/visual-theme.test.js`
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

**Interfaces:**
- Consumes: bestehende `.layout`, `.notes-board`, `.market-panel`, `showImprint()`, `showBugreport()` und `showMore()`.
- Produces: `setWorkspace(workspace, options)`, `updateWorkspaceTabs(workspace)` und sichtbare Buttons `[data-workspace="pinnwand"]` sowie `[data-workspace="market"]`.

- [ ] **Step 1: Statischen Wortmarken- und Navigationsvertrag ergaenzen**

```js
test("the shell exposes the centered lowercase brand and Pinnwand workspace", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /<h1>zettel<\/h1>/);
  assert.match(html, /data-workspace="pinnwand"[^>]*>\s*Pinnwand\s*</);
  assert.match(html, /data-workspace="market"[^>]*>\s*Markt\s*</);
  assert.doesNotMatch(html, /data-workspace="pinnwand"[^>]*>\s*Einkaufszettel\s*</);
});
```

- [ ] **Step 2: Browsertest fuer Tippen und Wischen schreiben**

In `tests/browser/collaboration.spec.js` einen Test `Graphite Midnight workspace follows taps and horizontal swipes` ergaenzen. Der Test muss:

```js
await visitor.page.goto(server.origin);
await waitForReady(visitor.page);
await expect(visitor.page.locator("h1")).toHaveText("zettel");
await expect(visitor.page.getByRole("button", { name: "Pinnwand", exact: true })).toHaveAttribute("aria-current", "page");
await visitor.page.getByRole("button", { name: "Markt", exact: true }).click();
await expect(visitor.page.locator(".market-panel")).toBeInViewport();
await expect(visitor.page.getByRole("button", { name: "Markt", exact: true })).toHaveAttribute("aria-current", "page");
await visitor.page.locator(".layout").evaluate((layout) => layout.scrollTo({ left: 0, behavior: "auto" }));
await expect(visitor.page.getByRole("button", { name: "Pinnwand", exact: true })).toHaveAttribute("aria-current", "page");
```

- [ ] **Step 3: Tests ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:unit && PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight workspace"`

Expected: FAIL, weil Wortmarke, Workspace-Buttons und Scroll-Synchronisierung fehlen.

- [ ] **Step 4: Kopfbereich und Navigation in HTML anlegen**

Den sichtbaren Kopfbereich in `index.html` auf diese Struktur umstellen; die drei vorhandenen Aktionsbuttons bleiben erhalten:

```html
<header class="topbar">
  <button class="topbar-icon" id="topMenuButton" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="topOptions">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>
  </button>
  <div class="brand-zone"><h1>zettel</h1></div>
  <button class="topbar-icon" id="accountButton" type="button" aria-label="Account öffnen">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6"/></svg>
  </button>
  <nav class="top-options is-hidden" id="topOptions" aria-label="Optionen">
    <button id="imprintButton" type="button">Impressum</button>
    <button id="bugreportButton" type="button">Bugreport</button>
    <button id="moreButton" type="button">Mehr</button>
  </nav>
</header>
<nav class="workspace-tabs" aria-label="Hauptbereich">
  <button class="workspace-tab is-active" type="button" data-workspace="pinnwand" aria-current="page">Pinnwand</button>
  <button class="workspace-tab" type="button" data-workspace="market">Markt</button>
</nav>
```

- [ ] **Step 5: Bestehende horizontale Ansicht mit den Buttons verbinden**

In `app.js` die Elemente ergaenzen und ausschliesslich UI-Zustand steuern:

```js
workspaceTabs: document.querySelectorAll("[data-workspace]"),
layout: document.querySelector(".layout"),
marketPanel: document.querySelector(".market-panel"),
topMenuButton: document.querySelector("#topMenuButton"),
topOptions: document.querySelector("#topOptions"),
accountButton: document.querySelector("#accountButton"),
```

```js
function updateWorkspaceTabs(workspace) {
  elements.workspaceTabs.forEach((button) => {
    const active = button.dataset.workspace === workspace;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function setWorkspace(workspace, { smooth = true } = {}) {
  const target = workspace === "market" ? elements.marketPanel : elements.notesBoard;
  const left = target.offsetLeft - elements.layout.offsetLeft;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.layout.scrollTo({ left, behavior: smooth && !reducedMotion ? "smooth" : "auto" });
  updateWorkspaceTabs(workspace);
}

let workspaceScrollFrame = 0;
function syncWorkspaceFromScroll() {
  if (workspaceScrollFrame) cancelAnimationFrame(workspaceScrollFrame);
  workspaceScrollFrame = requestAnimationFrame(() => {
    workspaceScrollFrame = 0;
    const marketDistance = Math.abs(elements.marketPanel.offsetLeft - elements.layout.offsetLeft - elements.layout.scrollLeft);
    const noteDistance = Math.abs(elements.notesBoard.offsetLeft - elements.layout.offsetLeft - elements.layout.scrollLeft);
    updateWorkspaceTabs(marketDistance < noteDistance ? "market" : "pinnwand");
  });
}
```

Workspace-Buttons rufen `setWorkspace(button.dataset.workspace)` auf. `.layout` hoert passiv auf `scroll`. Der Menuebutton blendet `#topOptions` ein beziehungsweise aus; `accountButton` ruft die bestehende Funktion `showMore()` auf.

- [ ] **Step 6: Kopfbereich und Navigation gestalten**

In `styles.css` die Wortmarke absolut auf `left: 50%` positionieren, `font-family: "Avenir Next", Avenir, -apple-system, sans-serif`, `font-size: 30px`, `font-weight: 300` und `transform: translate(-50%, -50%)` verwenden. `.workspace-tabs` erhaelt dunkles Glas; die aktive Flaeche verwendet `var(--gm-titanium)` und dunklen Text. Jeder `.topbar-icon` und `.workspace-tab` erhaelt mindestens 44 px Hoehe.

- [ ] **Step 7: Tests und Kerninteraktionen pruefen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:unit && PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight workspace|isolated contexts"`

Expected: PASS; Zettel erstellen, Tippen, Wischen und bestehende Live-Listen funktionieren.

- [ ] **Step 8: Commit erstellen**

```bash
git add tests/visual-theme.test.js tests/browser/collaboration.spec.js index.html styles.css app.js
git commit -m "feat: add pinnwand market workspace navigation"
```

---

### Task 3: Pinnwand und getrennte Zettel

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: vorhandenes `.notes-board`, `.notes-stack`, `.note-card`, `.note-card.is-shared`, `.list-item` und alle bestehenden Datenattribute.
- Produces: ausschliesslich neue Darstellung; keine neue JavaScript-Schnittstelle.

- [ ] **Step 1: Browservertrag fuer zwei getrennte Zettel schreiben**

Der Test erstellt zwei Listen, misst bei 393 px und 430 px beide `.note-card`-Boxen und prueft:

```js
expect(cards.length).toBe(2);
expect(cards[1].top - cards[0].bottom).toBeGreaterThanOrEqual(14);
expect(boardBackground).toBe("rgba(0, 0, 0, 0)");
expect(personalBackground).not.toBe(sharedBackground);
expect(personalOverflow).toBe(false);
expect(sharedOverflow).toBe(false);
```

Zusaetzlich werden `fontFamily` fuer `.list-title`, `.list-name` und `.list-tools` gemessen: Titel und Artikel muessen `Optima` enthalten, Werkzeuge duerfen es nicht enthalten.

- [ ] **Step 2: Test ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight notes"`

Expected: FAIL an Papierfarbe, Typografie oder Zettelabstand.

- [ ] **Step 3: Pinnwand und Papiermaterial gestalten**

In `styles.css`:

```css
.notes-board {
  border: 0;
  background: transparent;
  box-shadow: none;
}

.notes-stack { gap: 16px; }

.note-card {
  color: var(--gm-text);
  background: var(--gm-paper);
  border: 1px solid var(--gm-line);
  border-radius: 17px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.31), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.note-card.is-shared {
  background: var(--gm-shared-paper);
  border-color: rgba(222, 188, 190, 0.15);
}

.list-title,
.list-name {
  font-family: Optima, Candara, "Noto Sans", sans-serif;
  letter-spacing: 0;
}

.list-tools,
.collab-row,
.manual-add,
.list-shelf,
.note-footer {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
}
```

Die obere Lasche bleibt per bestehendem Pseudoelement erhalten und wird auf `rgba(218, 228, 238, 0.1)` umgefaerbt. Eingabe, Zeilen und Footer erhalten nur feine helle Trennlinien; alle Datenattribute und Controls bleiben bestehen.

- [ ] **Step 4: Zettel- und Texteingabe-Regression pruefen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight notes|compact shared iPhone note|isolated contexts"`

Expected: PASS; insbesondere darf die Eingabe in `Eigenen Artikel` beim Tippen nicht ersetzt werden.

- [ ] **Step 5: Screenshots kontrollieren**

Screenshots bei 393 px, 430 px und 1280 px nach `test-results/graphite-notes-393.png`, `graphite-notes-430.png` und `graphite-notes-desktop.png` schreiben. Pruefen: sichtbarer Hintergrund zwischen Zetteln, keine Ueberlagerung, geteilte Zettel nicht grell.

- [ ] **Step 6: Commit erstellen**

```bash
git add tests/browser/collaboration.spec.js styles.css
git commit -m "style: redesign graphite shopping notes"
```

---

### Task 4: Regalwahl als dunkle Marktflaeche

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: vorhandene `.shelf-grid`, `.shelf-card`, `.shelf-illustration`, `.shelf-board`, Reorder-Klassen und Long-Press-Handler.
- Produces: drei stabile Regalspalten mit Titanbrettern; keine neue JavaScript-Schnittstelle.

- [ ] **Step 1: Browservertrag fuer Regalspalten und Bretter schreiben**

Der Test oeffnet `Markt`, misst bei 393 px und 430 px:

```js
expect(columns).toBe(3);
expect(gridWithinViewport).toBe(true);
expect(cards.every((card) => !card.overflow)).toBe(true);
expect(boards.every((board) => board.height >= 4)).toBe(true);
expect(boards.every((board) => board.lightness >= 145)).toBe(true);
```

Danach startet er per `pointerdown` den bestehenden Reorder-Modus und erwartet weiterhin `.is-wiggling` sowie einen sichtbaren `Fertig`-Button.

- [ ] **Step 2: Test ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight shelves"`

Expected: FAIL an Materialfarben oder Brettern; bestehende drei Spalten duerfen bereits bestehen.

- [ ] **Step 3: Marktpanel, Regalflaechen und Bretter gestalten**

In `styles.css` `.market-panel` auf dunkles Glas umstellen, `.shelf-card` mit `linear-gradient(155deg, rgba(107, 131, 156, 0.17), rgba(24, 35, 48, 0.34))` und `var(--gm-line)` gestalten. `.shelf-board` verwendet `var(--gm-titanium)`. `.shelf-title` verwendet Optima; `.shelf-meta` und Suchfeld verwenden SF Pro. Die bestehenden Groessen fuer drei Spalten, Wackeln und Dragging bleiben unveraendert.

- [ ] **Step 4: Regaltest und Reorder-Regression pruefen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight shelves"`

Expected: PASS auf beiden Zielbreiten.

- [ ] **Step 5: Screenshots kontrollieren**

Screenshots `test-results/graphite-shelves-393.png` und `test-results/graphite-shelves-430.png` erstellen. Pruefen: drei gleich hohe Karten, klare Regalbretter, lesbare Namen, keine helle Gesamtflaeche.

- [ ] **Step 6: Commit erstellen**

```bash
git add tests/browser/collaboration.spec.js styles.css
git commit -m "style: rebuild graphite market shelves"
```

---

### Task 5: Produktkarten und Regalreihen

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: vorhandene `.product-grid`, `.product-card`, `.product-icon-button`, `.favorite-button`, `.add-button` und Icon-Assets.
- Produces: vier stabile Produktspalten mit optischen Titan-Regalbrettern ueber `.product-card:nth-child(n + 5)::before` an jedem neuen Reihenanfang.

- [ ] **Step 1: Bestehenden Produktvertrag um Material und Reihenabstand erweitern**

Im vorhandenen Test `product cards keep four readable columns` zusaetzlich messen:

```js
const firstSecondRow = cards[4];
const secondRowStyle = getComputedStyle(firstSecondRow, "::before");
return {
  ...existingMetrics,
  secondRowBoardHeight: Number.parseFloat(secondRowStyle.height),
  secondRowBoardBackground: secondRowStyle.backgroundImage,
  cardBackgrounds: cards.map((card) => getComputedStyle(card).backgroundImage),
  actionContained: cards.every((card) => [...card.querySelectorAll(".favorite-button, .add-button")]
    .every((button) => rect(button).left >= rect(card).left && rect(button).right <= rect(card).right))
};
```

Erwartungen: vier Spalten, `secondRowBoardHeight >= 4`, Titan-Verlauf vorhanden, alle Aktionen enthalten.

- [ ] **Step 2: Test ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "product cards keep four"`

Expected: FAIL an neuem Regalbrett oder dunkler Produktoberflaeche.

- [ ] **Step 3: Produktkarten und Reihenbrett umsetzen**

In `styles.css` `.product-card` mit dunklem Glas und feiner Kontur gestalten. `.product-name` verwendet Optima; `.product-shelf`, `.product-price` und Buttons verwenden SF Pro. `.add-button` bekommt `var(--gm-titanium)` und dunklen Text; `.favorite-button` bleibt transparentes Glas. Das Regalbrett wird nur am Beginn jeder weiteren Viererreihe erzeugt:

```css
.product-card:nth-child(4n + 5)::before {
  content: "";
  position: absolute;
  z-index: 2;
  top: -9px;
  left: 0;
  width: calc(400% + 18px);
  height: 5px;
  border-radius: 4px;
  background: var(--gm-titanium);
  box-shadow: 0 5px 9px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
```

Falls der bestehende Grid-Gap auf 393 px nicht exakt 6 px ist, den Breitenwert aus vier Karten plus drei Gaps als CSS-Variable `--product-row-width` auf `.product-grid` setzen und fuer das Pseudoelement verwenden. Kein JavaScript fuer das Brett einfuehren.

- [ ] **Step 4: Vier-Spalten-, Icon- und Feedbacktests pruefen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "product cards keep four|individual icons"`

Expected: PASS; alle vorhandenen individuellen Icons laden, Favorit und Hinzufuegen bleiben bedienbar.

- [ ] **Step 5: Screenshots kontrollieren**

Screenshots `test-results/graphite-products-393.png` und `test-results/graphite-products-430.png` erstellen. Pruefen: vier Karten, helle Bretter zwischen Reihen, kein Text- oder Buttonueberlauf.

- [ ] **Step 6: Commit erstellen**

```bash
git add tests/browser/collaboration.spec.js styles.css
git commit -m "style: refine graphite product cards"
```

---

### Task 6: Modale, Account und Support angleichen

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: bestehende `.modal-layer`, `.modal-card`, Account-, Teilen-, Bugreport-, Markt- und Preisdialoge.
- Produces: einheitliche dunkle Dialogoberflaeche; keine neue Dialoglogik.

- [ ] **Step 1: Browsertest fuer zentrale Dialoge schreiben**

Der Test prueft zuerst den Auth-Gate und oeffnet danach nacheinander Impressum, Bugreport, Mehr/Account und Teilen. Fuer Auth-Gate und jede `.modal-card` prueft er: innerhalb des Viewports, kein horizontaler Overflow, dunkler Hintergrund, lesbarer Textkontrast und sichtbarer 44-px-Schliessen-Button. Der Bugreport-Inhalt und Accountaktionen werden weiterhin gegen bestehende Texte geprueft.

- [ ] **Step 2: Test ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight dialogs"`

Expected: FAIL an den bisherigen hellen Dialogmaterialien.

- [ ] **Step 3: Dialogmaterialien zentral gestalten**

In `styles.css` `.auth-gate` und `.auth-sheet` zuerst auf dieselbe Graphite-Midnight-Grundflaeche umstellen. `.modal-layer` mit `rgba(3, 6, 10, 0.72)` und Blur gestalten. `.modal-card`, `.market-search-panel`, `.market-detail-panel`, Account- und Teilenflaechen verwenden eine gemeinsame dunkle Glasflaeche, `var(--gm-line)`, `var(--gm-text)` und `var(--gm-muted)`. Gefahrenaktionen behalten ein entsaettigtes Rot; normale Primaeraktionen verwenden Titan. Textareas und Inputs erhalten dunkle Eingabeflaechen und sichtbaren Fokus mit `var(--gm-focus)`.

- [ ] **Step 4: Dialog- und Accountregression pruefen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "Graphite Midnight dialogs|imprint and bugreport|ownership transfer"`

Expected: PASS; Dialoge sehen neu aus, bestehende Aktionen funktionieren unveraendert.

- [ ] **Step 5: Commit erstellen**

```bash
git add tests/browser/collaboration.spec.js styles.css
git commit -m "style: align dialogs with graphite midnight"
```

---

### Task 7: Release 0.7.0 und Gesamtverifikation

**Files:**
- Modify: `app-version.js`
- Modify: `index.html`
- Modify: `tests/app-version.test.js`
- Modify: `tests/assets.test.js`
- Modify: `tests/browser/collaboration.spec.js`

**Interfaces:**
- Consumes: vollstaendig verifizierte Tasks 1 bis 6.
- Produces: Release `0.7.0`, Build `70`, aktualisierte Asset-Query-Strings und neuen Service-Worker-Cache.

- [ ] **Step 1: Release-Tests zuerst auf 0.7.0/70 umstellen**

In `tests/app-version.test.js` alle Erwartungen auf `0.7.0`, Build `70` und `Version 0.7.0 · Build 70` setzen. In `tests/assets.test.js` alle Query-Strings von `v=67` auf `v=70` setzen. Den Browsertest fuer Impressum und Bugreport ebenfalls auf Version 0.7.0 und Build 70 stellen.

- [ ] **Step 2: Tests ausfuehren und erwartetes Scheitern bestaetigen**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:unit && PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test:browser --grep "imprint and bugreport"`

Expected: FAIL, weil App und Query-Strings noch Version 0.6.7/67 enthalten.

- [ ] **Step 3: Release-Metadaten und Query-Strings anheben**

In `app-version.js`:

```js
const version = "0.7.0";
const build = 70;
```

In `index.html` alle lokalen `?v=67` auf `?v=70` setzen. `sw.js` bleibt strukturell unveraendert und erzeugt automatisch `einkaufszettel-v70`.

- [ ] **Step 4: Vollstaendige lokale Verifikation ausfuehren**

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm verify`

Expected: alle Unit-, Syntax-, Asset- und WebKit-Tests PASS.

- [ ] **Step 5: Screenshots und Pixelkontrolle abschliessen**

WebKit-Screenshots fuer 393 px, 430 px und 1280 px pruefen. Zusaetzlich in jedem Screenshot kontrollieren: nichtleere Hintergrundpixel, keine abgeschnittenen Wortmarken, keine Ueberlagerung von Zetteln, drei Regalspalten, vier Produktspalten und sichtbare Fokus-/Aktionsflaechen.

- [ ] **Step 6: Diff und unbeabsichtigte Funktionsaenderungen pruefen**

Run: `git diff --check && git diff --stat origin/main...HEAD && git status --short`

Expected: nur dokumentierte UI-, Test- und Release-Dateien; keine Supabase-SQL-, Account- oder Sync-Dateien.

- [ ] **Step 7: Release-Commit erstellen**

```bash
git add app-version.js index.html tests/app-version.test.js tests/assets.test.js tests/browser/collaboration.spec.js
git commit -m "chore: release graphite midnight redesign"
```

- [ ] **Step 8: Push, GitHub-Pruefung und Live-Smoke**

Branch pushen, den `Verify and deploy`-Lauf bis `verification`, `deploy` und `smoke` erfolgreich sind beobachten. Danach ausfuehren:

Run: `PATH=/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH PRODUCTION_URL=https://kenni1116-a11y.github.io/mart-/ pnpm smoke:production`

Expected: Produktions-Smoke erfolgreich; Live-App liefert `app-version.js`, `styles.css`, `product-icon-assets.js` und vorhandene Icon-Assets mit HTTP 200.
