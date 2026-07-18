const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const MartRelease = require(path.join(root, "app-version.js"));

test("release metadata exposes one display label for version 0.7.1 build 71", () => {
  assert.equal(MartRelease.version, "0.7.1");
  assert.equal(MartRelease.build, 71);
  assert.equal(MartRelease.label, "Version 0.7.1 · Build 71");
});

test("bug report details contain useful release and device context without account data", () => {
  assert.deepEqual(MartRelease.bugReportLines({
    href: "https://example.test/mart-/",
    userAgent: "Mobile Safari Test",
    language: "de-DE",
    online: false,
    standalone: true,
    viewport: { width: 393, height: 852 }
  }), [
    "App-Version: 0.7.1",
    "Build: 71",
    "Adresse: https://example.test/mart-/",
    "Gerät/Browser: Mobile Safari Test",
    "Ansicht: Installierte Web-App",
    "Bildschirm: 393 × 852",
    "Sprache: de-DE",
    "Verbindung: Offline"
  ]);
});

test("imprint and bugreport consume the central release metadata", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

  assert.match(app, /MartRelease\.label/);
  assert.match(app, /MartRelease\.bugReportLines/);
});
