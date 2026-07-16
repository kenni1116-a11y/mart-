const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("Graphite Midnight exposes one dark token set and matching PWA colors", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const html = fs.readFileSync("index.html", "utf8");
  const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

  ["--gm-bg-top", "--gm-bg-bottom", "--gm-glass", "--gm-paper", "--gm-shared-paper", "--gm-titanium", "--gm-focus"]
    .forEach((token) => assert.ok(css.includes(token), token));
  assert.match(html, /<meta name="theme-color" content="#11161d">/);
  assert.equal(manifest.background_color, "#11161d");
  assert.equal(manifest.theme_color, "#11161d");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
