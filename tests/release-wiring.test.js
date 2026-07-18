const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("one pinned release command verifies unit, syntax, cache, diff, and discovered browser behavior", () => {
  const packageJson = JSON.parse(read("package.json"));
  const verifyScript = read("scripts/verify-release.mjs");
  const gitignore = read(".gitignore");

  assert.equal(packageJson.packageManager, "pnpm@11.7.0");
  assert.equal(packageJson.devDependencies["@playwright/test"], "1.61.1");
  assert.equal(packageJson.scripts.verify, "node scripts/verify-release.mjs");
  assert.match(verifyScript, /tests\/\*\.test\.js/);
  assert.match(verifyScript, /readdirSync\(browserDirectory\)/);
  assert.match(verifyScript, /git[\s\S]*diff[\s\S]*--check/);
  assert.match(verifyScript, /app-version\.js/);
  assert.match(verifyScript, /avatar-logic\.js/);
  assert.match(verifyScript, /MartRelease\.build/);
  ["backups/", "node_modules/", "test-results/", "playwright-report/", ".env*"].forEach((entry) => {
    assert.match(gitignore, new RegExp(`^${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
  });
});

test("GitHub Pages deploys only after verification and retains a rollback path", () => {
  const workflow = read(".github/workflows/verify-and-deploy.yml");
  const packageJson = JSON.parse(read("package.json"));

  assert.match(workflow, /pnpm\/action-setup@v4/);
  assert.match(workflow, /actions\/setup-node@v4/);
  assert.match(workflow, /pnpm verify/);
  assert.match(workflow, /supabase\/setup-cli@v1/);
  assert.match(workflow, /version: 2\.109\.1/);
  assert.match(workflow, /pnpm test:sql:local/);
  assert.doesNotMatch(workflow, /SUPABASE_DB_URL|secrets\.SUPABASE_DB_URL/);
  assert.equal(packageJson.scripts["test:sql:local"], "bash scripts/test-supabase-local.sh");
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pnpm smoke:production/);
  assert.match(workflow, /gh run list[\s\S]*--status success/);
  assert.match(workflow, /artifact_name: github-pages-rollback/);
});

test("the verified Pages artifact contains every local startup and product-icon asset", () => {
  const workflow = read(".github/workflows/verify-and-deploy.yml");
  const assemblerPath = path.join(root, "scripts", "assemble-pages-site.mjs");

  assert.ok(fs.existsSync(assemblerPath), "scripts/assemble-pages-site.mjs is missing");
  const assembler = fs.readFileSync(assemblerPath, "utf8");

  assert.match(workflow, /node scripts\/assemble-pages-site\.mjs/);
  [
    "index.html",
    "styles.css",
    "supabase-config.js",
    "app-version.js",
    "account-logic.js",
    "sync-logic.js",
    "app-logic.js",
    "avatar-logic.js",
    "product-icon-assets.js",
    "app.js",
    "sw.js",
    "manifest.json",
    "icon.svg"
  ].forEach((asset) => assert.ok(assembler.includes(`"${asset}"`), asset));
  assert.match(assembler, /cp\([^\n]*"assets"[^\n]*recursive: true/);
});
