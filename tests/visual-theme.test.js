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

test("auth surface keeps readable contrast on the dark foundation", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const authSheet = css.match(/\.auth-sheet\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.match(authSheet, /background:\s*var\(--gm-paper\)/);
  assert.match(authSheet, /color:\s*var\(--gm-text\)/);
});

test("auth inputs use the light Graphite focus token and transparent ring", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const focus = css.match(/\.auth-form input:focus\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.match(focus, /border-color:\s*var\(--gm-focus\)/);
  assert.match(focus, /box-shadow:\s*0 0 0 3px rgba\(119, 174, 228, 0\.24\)/);
});

test("auth status states use light readable Graphite colors", () => {
  const css = fs.readFileSync("styles.css", "utf8");
  const error = css.match(/\.auth-status\[data-state="error"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const success = css.match(/\.auth-status\[data-state="success"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.match(error, /color:\s*#f0a6a0/);
  assert.match(success, /color:\s*#a8d8b8/);
});

test("stored linen and clean backgrounds keep dark Graphite variants", () => {
  const css = fs.readFileSync("styles.css", "utf8");

  for (const background of ["linen", "clean"]) {
    const variant = css.match(new RegExp(`body\\[data-background="${background}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
    assert.match(variant, /--gm-bg-top:\s*#[0-9a-f]{6}/i, background);
    assert.match(variant, /--gm-bg-middle:\s*#[0-9a-f]{6}/i, background);
    assert.match(variant, /--gm-bg-bottom:\s*#[0-9a-f]{6}/i, background);
    assert.match(variant, /background:\s*linear-gradient\(/, background);
  }
});
