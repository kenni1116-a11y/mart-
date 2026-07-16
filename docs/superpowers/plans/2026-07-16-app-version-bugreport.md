# App-Version und Bugreport Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App-Version und Build zentral pflegen, im Impressum anzeigen und automatisch in Bugreports aufnehmen.

**Architecture:** Eine kleine browser- und service-worker-kompatible Datei stellt die Release-Daten und eine reine Formatierungsfunktion bereit. `app.js` nutzt diese Daten fuer Impressum und Bugreport; `sw.js` leitet daraus den Cache-Namen ab.

**Tech Stack:** Statisches HTML, JavaScript, Service Worker, Node-Test-Runner, Playwright.

## Global Constraints

- Keine Aenderung an Supabase, Accounts oder gemeinsamer Listenlogik.
- Keine zusaetzlichen Abhaengigkeiten.
- Aktuelles Release: Version 0.6.4, Build 64.

---

### Task 1: Zentrale Release-Daten

**Files:**
- Create: `app-version.js`
- Create: `tests/app-version.test.js`
- Modify: `index.html`
- Modify: `sw.js`
- Modify: `tests/assets.test.js`

**Interfaces:**
- Produces: `MartRelease.version`, `MartRelease.build`, `MartRelease.label`, `MartRelease.bugReportLines(environment)`.

- [x] **Step 1: Write the failing unit and asset tests**
- [x] **Step 2: Run the focused tests and confirm they fail because the release module is absent**
- [x] **Step 3: Implement `app-version.js` and wire it before `app.js` and into the service worker**
- [x] **Step 4: Run the focused tests and confirm they pass**

### Task 2: Impressum und Bugreport

**Files:**
- Modify: `app.js`
- Test: `tests/app-version.test.js`
- Test: `tests/browser/collaboration.spec.js`

**Interfaces:**
- Consumes: `MartRelease.label` and `MartRelease.bugReportLines(environment)`.
- Produces: sichtbare Versionszeile im Impressum und technische Release-/Geraeteangaben im kopierbaren Bugreport.

- [x] **Step 1: Add failing assertions for the display label and privacy-conscious environment output**
- [x] **Step 2: Update the two modal renderers with escaped release data**
- [x] **Step 3: Run unit and browser tests**
- [x] **Step 4: Run `pnpm verify`, inspect the diff, commit, push, and verify Build 64 on GitHub Pages**
