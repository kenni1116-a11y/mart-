const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

test("browser entrypoint loads the tested app logic before app.js", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const releaseIndex = html.indexOf('<script src="./app-version.js?v=71"></script>');
  const logicIndex = html.indexOf('<script src="./app-logic.js?v=71"></script>');
  const appIndex = html.indexOf('<script src="./app.js?v=71"></script>');

  assert.notEqual(releaseIndex, -1);
  assert.notEqual(logicIndex, -1);
  assert.notEqual(appIndex, -1);
  assert.ok(releaseIndex < appIndex);
  assert.ok(logicIndex < appIndex);
  assert.match(html, /styles\.css\?v=71/);
});

test("service worker derives its cache version from the central release metadata", () => {
  const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");

  assert.match(serviceWorker, /importScripts\("\.\/app-version\.js"\)/);
  assert.match(serviceWorker, /einkaufszettel-v\$\{MartRelease\.build\}/);
  [
    "./index.html",
    "./styles.css",
    "./supabase-config.js",
    "./app-version.js",
    "./app-logic.js",
    "./app.js",
    "./manifest.json",
    "./icon.svg"
  ].forEach((asset) => assert.ok(serviceWorker.includes(`"${asset}"`), asset));
});
