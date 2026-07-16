# Optik-Paket 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die bestehende Zettelansicht auf iPhone-Größe kompakter, ruhiger und konsistent bedienbar gestalten, ohne Supabase- oder App-Verhalten zu ändern.

**Architecture:** Die bestehende DOM-Struktur bleibt erhalten. Ein WebKit-Regressionstest misst reale Elementgrenzen bei 402 x 874 Pixeln; die Umsetzung verändert anschließend ausschließlich responsive CSS-Regeln und erhöht danach gemeinsam die Asset-/Cache-Version.

**Tech Stack:** Statisches HTML/CSS/JavaScript, Node-Test-Runner, Playwright WebKit, pnpm.

## Global Constraints

- Keine Änderungen an Supabase, Realtime, Accounts, Einladungen, Berechtigungen oder Datenmodellen.
- Keine neuen Produkt- oder Regalicons und keine Neugestaltung der Marktsimulation.
- Bestehende Texte, Sicherheitsdialoge und Bedienabläufe bleiben unverändert.
- Zielbreite für die visuelle Prüfung: 393 bis 430 Pixel; automatischer Referenz-Viewport: 402 x 874 Pixel.
- Bedienelemente dürfen nicht überlappen oder abgeschnitten werden.

## Verifikationsbedingte Stabilitätskorrektur

Die vollständige Prüfung hat reproduzierbar gezeigt, dass zwei Geräte bei identischem `Date.now()` dieselbe manuelle Artikel-ID erzeugen und sich dadurch gegenseitig überschreiben. Als eng begrenzte Ausnahme zur reinen CSS-Arbeit ersetzt dieses Paket die zeitbasierte ID in `app.js` durch die bereits vorhandene `operationUuid()`-Erzeugung. Datenmodell, Supabase-Schnittstelle und Synchronisationsablauf bleiben unverändert.

---

### Task 1: Kompakte und stabile iPhone-Zettelansicht

**Files:**
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `sw.js`

**Interfaces:**
- Consumes: bestehendes `noteMarkup()` mit `.list-head`, `.collab-row`, `.manual-add`, `.list-item` und `.note-footer`.
- Produces: unveränderte DOM-Schnittstelle mit kompakteren Elementgrenzen und konsistenten Touch-Flächen.

- [ ] **Step 1: Abhängigkeiten installieren und stabilen Ausgangszustand prüfen**

Run:

```bash
pnpm install --frozen-lockfile
pnpm verify
```

Expected: Unit-, Syntax-, Asset- und die zwei vorhandenen WebKit-Tests bestehen ohne Fehler.

- [ ] **Step 2: Fehlenden Layoutschutz als Browser-Test ergänzen**

Erzeuge in `tests/browser/collaboration.spec.js` einen weiteren Test, der einen Zettel mit drei Artikeln anlegt und reale Elementgrenzen ausliest:

```js
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

    const metrics = await owner.page.locator(".note-card").evaluate((card) => {
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
      const controlPairs = controls.flatMap((control, index) => controls.slice(index + 1).map((other) => [rect(control), rect(other)]));
      return {
        cardWithinViewport: cardBox.left >= 0 && cardBox.right <= window.innerWidth,
        headerOverlap: overlaps(titleBox, toolsBox),
        controlOverlap: controlPairs.some(([left, right]) => overlaps(left, right)),
        manualHeight: manualBox.height,
        itemHeights: itemRows.map((item) => rect(item).height),
        footerHeight: footerBox.height,
        cardHeight: cardBox.height,
        touchSizes: controls.map((control) => ({ width: rect(control).width, height: rect(control).height }))
      };
    });

    expect(metrics.cardWithinViewport).toBe(true);
    expect(metrics.headerOverlap).toBe(false);
    expect(metrics.controlOverlap).toBe(false);
    expect(metrics.manualHeight).toBeLessThanOrEqual(48);
    expect(Math.max(...metrics.itemHeights)).toBeLessThanOrEqual(46);
    expect(metrics.footerHeight).toBeLessThanOrEqual(40);
    expect(metrics.cardHeight).toBeLessThanOrEqual(390);
    metrics.touchSizes.forEach(({ width, height }) => {
      expect(width).toBeGreaterThanOrEqual(28);
      expect(height).toBeGreaterThanOrEqual(28);
    });

    await owner.page.screenshot({ path: "test-results/optik-paket-1-iphone.png", fullPage: true });
    await owner.page.setViewportSize({ width: 1280, height: 900 });
    await owner.page.screenshot({ path: "test-results/optik-paket-1-desktop.png", fullPage: true });
  } finally {
    await owner.context.close();
    await server.close();
  }
});
```

Die Messung verwendet `getBoundingClientRect()` und prüft zusätzlich, dass Checkbox, Minus, Plus und Entfernen-Button mindestens `28 x 28` CSS-Pixel große Trefferflächen besitzen:

```js
expect(metrics.cardWithinViewport).toBe(true);
expect(metrics.headerOverlap).toBe(false);
expect(metrics.controlOverlap).toBe(false);
expect(metrics.manualHeight).toBeLessThanOrEqual(48);
expect(Math.max(...metrics.itemHeights)).toBeLessThanOrEqual(46);
expect(metrics.footerHeight).toBeLessThanOrEqual(40);
expect(metrics.cardHeight).toBeLessThanOrEqual(390);
```

- [ ] **Step 3: Den neuen Test ausführen und den erwarteten Fehlschlag bestätigen**

Run:

```bash
pnpm exec playwright test tests/browser/collaboration.spec.js --grep "compact iPhone note layout"
```

Expected: FAIL an mindestens einer Verdichtungsgrenze der bisherigen Zettelgestaltung, nicht wegen Start, Anmeldung oder Synchronisierung.

- [ ] **Step 4: Responsive Zettel-CSS minimal verdichten**

Ändere in `styles.css` nur die Zettelansicht und ihre responsive Regeln:

```css
@media (max-width: 620px) {
  .list-panel { /* geringere obere/seitliche Innenabstände */ }
  .list-head { /* stabile Titel-/Aktionsausrichtung */ }
  .collab-row { /* einzeilige niedrige Statusleiste */ }
  .manual-add-wrap,
  .manual-add { /* geringere vertikale Abstände, weiterhin fingerfreundlich */ }
  .list-panel .list-item { /* kompaktere Zeilen */ }
  .quantity-button,
  .remove-button { /* mindestens 28 x 28 Pixel Trefferfläche */ }
  .note-footer,
  .note-delete-button { /* niedriger, ruhiger Abschluss */ }
}
```

Setze konkrete Werte so, dass der Browser-Test besteht. Verändere keine Selektoren der Markt-, Regal-, Produkt-, Account- oder Supabase-Oberfläche.

- [ ] **Step 5: Asset-Version gemeinsam erhöhen**

Erhöhe alle lokalen `?v=`-Versionen in `index.html` sowie `CACHE_NAME` in `sw.js` von `62` auf `63`, damit installierte iPhones die neue CSS-Datei zuverlässig erhalten. Die lokale Asset-Liste des Service Workers bleibt vollständig.

- [ ] **Step 6: Layouttest und vollständige Freigabeprüfung ausführen**

Run:

```bash
pnpm exec playwright test tests/browser/collaboration.spec.js --grep "compact iPhone note layout"
pnpm verify
```

Expected: Der neue Layouttest und alle bestehenden Prüfungen bestehen ohne Fehler.

- [ ] **Step 7: Diff auf unbeabsichtigte Funktionsänderungen prüfen**

Run:

```bash
git diff --check
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- app.js app-logic.js account-logic.js sync-logic.js supabase/
```

Expected: Keine Whitespace-Fehler; der Funktions-Diff ist leer; geändert sind nur Spezifikation, Plan, Browser-Test, CSS und Asset-Versionierung.

- [ ] **Step 8: Implementierung committen**

Run:

```bash
git add tests/browser/collaboration.spec.js styles.css index.html sw.js
git commit -m "style: compact shopping notes on iPhone"
```

Expected: Ein fokussierter Implementierungscommit ohne Supabase- oder App-Logikdateien.

### Task 2: Visuelle Kontrolle und Veröffentlichung

**Files:**
- No production file changes expected.
- Create locally only: `test-results/optik-paket-1-iphone.png`
- Create locally only: `test-results/optik-paket-1-desktop.png`

**Interfaces:**
- Consumes: die in Task 1 geprüfte Zettelansicht.
- Produces: visuelle Nachweise und einen veröffentlichbaren Git-Zweig.

- [ ] **Step 1: Lokale Testseite starten und iPhone-Screenshot prüfen**

Run:

```bash
pnpm exec playwright test tests/browser/collaboration.spec.js --grep "compact iPhone note layout"
```

Der Test speichert einen Screenshot nach `test-results/optik-paket-1-iphone.png`. Öffne ihn mit dem lokalen Bildbetrachter und prüfe, dass Titel, Status, Eingabe, Artikel und Löschaktion nicht überlappen und der Zettel nicht unnötig hoch wirkt.

- [ ] **Step 2: Desktop-Screenshot prüfen**

Der Test wechselt nach der iPhone-Messung auf `1280 x 900` und speichert `test-results/optik-paket-1-desktop.png`. Öffne ihn mit dem lokalen Bildbetrachter und prüfe, dass die vorhandene maximale Inhaltsbreite, Swipe-Spalten und Zettelabstände erhalten bleiben.

- [ ] **Step 3: Abschließende vollständige Prüfung ausführen**

Run:

```bash
pnpm verify
git status --short
git diff --check origin/main...HEAD
```

Expected: Alle Prüfungen bestehen; im Arbeitsbaum liegen nur bewusst nicht versionierte Screenshot-Artefakte oder gar keine offenen Änderungen.

- [ ] **Step 4: Zweig veröffentlichen und Pull Request erstellen**

Run:

```bash
git push -u origin codex/optik-paket-1
gh pr create --base main --head codex/optik-paket-1 --title "Optik-Paket 1: kompaktere Zettelansicht" --body $'## Zusammenfassung\n- verdichtet die Zettelansicht auf iPhone-Größe\n- sichert Abstände und Trefferflächen per WebKit-Test ab\n- lässt Supabase- und App-Logik unverändert\n\n## Prüfung\n- pnpm verify'
```

Expected: Der Pull Request zeigt erfolgreiche Prüfungen und enthält ausschließlich das freigegebene Optik-Paket.
