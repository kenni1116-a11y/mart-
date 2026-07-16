# Optik-Paket 3 Produktkarten Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produktkarten in vier Spalten auf dem iPhone lesbarer, gleichmaessiger und fuer neue Produktillustrationen vorbereitet gestalten.

**Architecture:** Produktdaten und Interaktionen bleiben unveraendert. CSS definiert stabile Zeilen fuer Icon, Text/Preis und Aktionen; ein WebKit-Test misst vier Spalten, Ueberlaeufe, Schriftgroessen und Buttonflaechen auf 393 px und 430 px.

**Tech Stack:** CSS, statisches HTML/JavaScript, Node-Test-Runner, Playwright WebKit.

## Global Constraints

- Vier Produktkarten pro Reihe beibehalten.
- Keine Aenderung an Produkt-, Preis-, Favoriten-, Warenkorb- oder Supabase-Logik.
- Keine neuen Produkticons in diesem Paket.
- Zielbreiten: 393 px und 430 px.
- Release nach Abschluss: Version 0.6.6, Build 66.

---

### Task 1: Produktkarten-Vertrag

**Files:**
- Modify: `tests/browser/collaboration.spec.js`

- [x] **Step 1: Browser-Test fuer vier Spalten, Textueberlauf und Aktionsflaechen ergaenzen**
- [x] **Step 2: Test am bisherigen Layout ausfuehren und erwartetes Scheitern bestaetigen**

### Task 2: Produktkarten gestalten

**Files:**
- Modify: `styles.css`
- Modify: `app-version.js`
- Modify: `index.html`
- Modify: version-dependent tests

- [x] **Step 1: Stabile Icon-, Text-/Preis- und Aktionszeilen per CSS umsetzen**
- [x] **Step 2: Lange Produktnamen und Preistext lesbar innerhalb der Karte halten**
- [x] **Step 3: Version 0.6.6 und Build 66 setzen**
- [x] **Step 4: Screenshots, `pnpm verify`, Diff, Push und Live-Version pruefen**
