# Release 0.7.8 und Obst-Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Impressum bereinigen, einen sicheren Build-78-Cachewechsel ausrollen und alle 24 Obstprodukte mit individuellen Pop-Art-SVGs ausstatten.

**Architecture:** Die bestehende Release-Datei bleibt die einzige Quelle fuer Version und Build. Obst-Assets werden wie der erste Icon-Batch ueber `product-icon-assets.js` an die vorhandene Produktkarten-Darstellung angeschlossen; App- und Supabase-Logik bleiben unveraendert.

**Tech Stack:** Statisches HTML/CSS/JavaScript, SVG, Node-Test-Runner, Playwright WebKit, GitHub Pages

## Global Constraints

- Release ist exakt Version `0.7.8`, Build `78`.
- Das Obstregal enthaelt exakt 24 individuelle SVG-Assets.
- Alle SVGs verwenden `viewBox="0 0 64 64"` und einen weissen Hintergrund.
- Keine Aenderung an Produkt-, Preis-, Warenkorb-, Favoriten- oder Supabase-Logik.

---

### Task 1: Impressum und Release 0.7.8

**Files:**
- Modify: `tests/app-version.test.js`
- Modify: `tests/assets.test.js`
- Modify: `tests/browser/collaboration.spec.js`
- Modify: `app.js`
- Modify: `app-version.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `MartRelease.version`, `MartRelease.build`, `MartRelease.label`
- Produces: Build-78-Cache- und Anzeigewerte

- [ ] **Step 1: Tests auf Build 78 und das bereinigte Impressum umstellen**
- [ ] **Step 2: Die betroffenen Tests ausfuehren und den erwarteten Fehlschlag bestaetigen**
- [ ] **Step 3: Betreiber-Satz entfernen, Release-Metadaten und Asset-Queries aktualisieren**
- [ ] **Step 4: Release- und Asset-Tests erneut ausfuehren**

### Task 2: Obst-Asset-Vertrag

**Files:**
- Modify: `tests/product-icon-assets.test.js`
- Modify: `product-icon-assets.js`

**Interfaces:**
- Consumes: `MartProductIconAssets.getProductIconAsset(name, shelfId)`
- Produces: 24 Manifest-Eintraege mit `shelfId: "obst"`

- [ ] **Step 1: Den Test um die 24 Obstprodukte in Katalogreihenfolge erweitern**
- [ ] **Step 2: Den Test ausfuehren und den erwarteten Fehlschlag bestaetigen**
- [ ] **Step 3: Die 24 eindeutigen Obst-Eintraege im Manifest ergaenzen**
- [ ] **Step 4: Den Manifest-Test erneut ausfuehren; die bestehende Dateipruefung bleibt in diesem Task auf Batch eins begrenzt**

### Task 3: Individuelle Obst-SVGs

**Files:**
- Modify: `tests/product-icon-assets.test.js`
- Create: `assets/product-icons/02-obst/01-aepfel.svg`
- Create: `assets/product-icons/02-obst/02-bananen.svg`
- Create: `assets/product-icons/02-obst/03-orangen.svg`
- Create: `assets/product-icons/02-obst/04-zitronen.svg`
- Create: `assets/product-icons/02-obst/05-limetten.svg`
- Create: `assets/product-icons/02-obst/06-erdbeeren.svg`
- Create: `assets/product-icons/02-obst/07-heidelbeeren.svg`
- Create: `assets/product-icons/02-obst/08-himbeeren.svg`
- Create: `assets/product-icons/02-obst/09-trauben.svg`
- Create: `assets/product-icons/02-obst/10-birnen.svg`
- Create: `assets/product-icons/02-obst/11-kiwi.svg`
- Create: `assets/product-icons/02-obst/12-mango.svg`
- Create: `assets/product-icons/02-obst/13-ananas.svg`
- Create: `assets/product-icons/02-obst/14-wassermelone.svg`
- Create: `assets/product-icons/02-obst/15-honigmelone.svg`
- Create: `assets/product-icons/02-obst/16-pfirsiche.svg`
- Create: `assets/product-icons/02-obst/17-pflaumen.svg`
- Create: `assets/product-icons/02-obst/18-kirschen.svg`
- Create: `assets/product-icons/02-obst/19-grapefruit.svg`
- Create: `assets/product-icons/02-obst/20-avocado.svg`
- Create: `assets/product-icons/02-obst/21-mandarinen.svg`
- Create: `assets/product-icons/02-obst/22-nektarinen.svg`
- Create: `assets/product-icons/02-obst/23-granatapfel.svg`
- Create: `assets/product-icons/02-obst/24-aprikosen.svg`

**Interfaces:**
- Consumes: Pfade und Motive aus `product-icon-assets.js`
- Produces: sichere, erkennbare `64 x 64`-SVG-Dateien

- [ ] **Step 1: Die Dateipruefung testgetrieben auf Gemuese, Frischetheke und Obst erweitern und den erwarteten Fehlschlag bestaetigen**
- [ ] **Step 2: Alle 24 SVGs mit Titel, Motivkennung, weissem Hintergrund und Pop-Art-Konturen erstellen**
- [ ] **Step 3: Asset-Test ausfuehren und alle Manifest-/Dateivertraege bestaetigen**

### Task 4: Gesamtpruefung und Auslieferung

**Files:**
- Verify: gesamter Release-Diff

**Interfaces:**
- Consumes: Build-78-App und vollstaendigen Obst-Batch
- Produces: geprueften GitHub-Pages-Release

- [ ] **Step 1: Unit-, Syntax-, Diff- und vollstaendige Release-Pruefung ausfuehren**
- [ ] **Step 2: Obstregal in WebKit auf iPhone-Breite visuell kontrollieren**
- [ ] **Step 3: Nur die beabsichtigten Dateien committen und auf `main` pushen**
- [ ] **Step 4: GitHub Actions und die produktiv ausgelieferten Build-78-Dateien pruefen**
