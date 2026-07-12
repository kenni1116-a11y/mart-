const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

test("browser entrypoint loads the tested app logic before app.js", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const logicIndex = html.indexOf('<script src="./app-logic.js?v=59"></script>');
  const appIndex = html.indexOf('<script src="./app.js?v=59"></script>');

  assert.notEqual(logicIndex, -1);
  assert.notEqual(appIndex, -1);
  assert.ok(logicIndex < appIndex);
  assert.match(html, /styles\.css\?v=59/);
});

test("service worker caches every local runtime asset with cache version 59", () => {
  const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");

  assert.match(serviceWorker, /einkaufszettel-v59/);
  [
    "./index.html",
    "./styles.css",
    "./supabase-config.js",
    "./app-logic.js",
    "./app.js",
    "./manifest.json",
    "./icon.svg"
  ].forEach((asset) => assert.ok(serviceWorker.includes(`"${asset}"`), asset));
});
