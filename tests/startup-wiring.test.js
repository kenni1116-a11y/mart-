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
  const accountIndex = html.indexOf("./account-logic.js?v=61");
  const helperIndex = html.indexOf("./app-logic.js?v=61");
  const appIndex = html.indexOf("./app.js?v=61");

  assert.notEqual(accountIndex, -1, "index.html must load account-logic.js");
  assert.notEqual(helperIndex, -1, "index.html must load app-logic.js");
  assert.notEqual(appIndex, -1, "index.html must load the current app.js release");
  assert.ok(accountIndex < helperIndex, "account-logic.js must load before app-logic.js");
  assert.ok(helperIndex < appIndex, "app-logic.js must load before app.js");
});

test("the service worker keeps the tested helper available offline", () => {
  const serviceWorker = read("sw.js");

  assert.match(serviceWorker, /const CACHE_NAME = "einkaufszettel-v61"/);
  assert.match(serviceWorker, /"\.\/account-logic\.js"/);
  assert.match(serviceWorker, /"\.\/app-logic\.js"/);
});
