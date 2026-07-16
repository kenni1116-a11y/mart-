# Optik-Paket 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den Kopfbereich normaler und geteilter Zettel auf dem iPhone ruhiger, moderner und kompakter gestalten.

**Architecture:** Die bestehende HTML- und Interaktionsstruktur bleibt unveraendert. Ausschliesslich CSS ordnet Titel, Aktionen, Mitglieder und Warenwert; der bestehende WebKit-Test misst Ueberlaeufe, Abstaende und die neue visuelle Hierarchie.

**Tech Stack:** CSS, statisches HTML/JavaScript, Node-Test-Runner, Playwright WebKit.

## Global Constraints

- Keine Aenderung an Supabase, Accounts, Synchronisierung oder Zettelaktionen.
- Keine neuen Abhaengigkeiten.
- Zielbreiten: 393 px und 430 px.
- Release nach Abschluss: Version 0.6.5, Build 65.

---

### Task 1: Visuellen Vertrag absichern

**Files:**
- Modify: `tests/browser/collaboration.spec.js`

- [x] **Step 1: Messungen fuer Kopfbereich, moderne Aktionsschrift und Warenwert-Zeile ergaenzen**
- [x] **Step 2: Test ausfuehren und das erwartete Scheitern am bisherigen Design bestaetigen**

### Task 2: Zettel-Kopfbereich polieren

**Files:**
- Modify: `styles.css`
- Modify: `app-version.js`
- Modify: `index.html`
- Modify: version-dependent tests

- [x] **Step 1: Titel/Aktionen, Mitgliederzeile und Warenwert ausschliesslich per CSS harmonisieren**
- [x] **Step 2: Version 0.6.5 und Build 65 setzen**
- [x] **Step 3: Browser-Test auf 393 px und 430 px ausfuehren und Screenshots kontrollieren**
- [x] **Step 4: `pnpm verify`, Diff-Pruefung, Commit, Push und Live-Pruefung ausfuehren**
