const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("tested app logic loads before the browser entrypoint", () => {
  const html = read("index.html");
  const helperIndex = html.indexOf("./app-logic.js?v=60");
  const appIndex = html.indexOf("./app.js?v=60");

  assert.notEqual(helperIndex, -1, "index.html must load app-logic.js");
  assert.notEqual(appIndex, -1, "index.html must load the current app.js release");
  assert.ok(helperIndex < appIndex, "app-logic.js must load before app.js");
});

test("the service worker keeps the tested helper available offline", () => {
  const serviceWorker = read("sw.js");

  assert.match(serviceWorker, /const CACHE_NAME = "einkaufszettel-v60"/);
  assert.match(serviceWorker, /"\.\/app-logic\.js"/);
});
