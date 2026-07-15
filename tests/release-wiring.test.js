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
  assert.match(verifyScript, /CACHE_NAME/);
  ["backups/", "node_modules/", "test-results/", "playwright-report/", ".env*"].forEach((entry) => {
    assert.match(gitignore, new RegExp(`^${entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "m"));
  });
});

test("GitHub Pages deploys only after verification and retains a rollback path", () => {
  const workflow = read(".github/workflows/verify-and-deploy.yml");

  assert.match(workflow, /pnpm\/action-setup@v4/);
  assert.match(workflow, /actions\/setup-node@v4/);
  assert.match(workflow, /pnpm verify/);
  assert.match(workflow, /SUPABASE_DB_URL:[\s\S]*secrets\.SUPABASE_DB_URL/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /pnpm smoke:production/);
  assert.match(workflow, /gh run list[\s\S]*--status success/);
  assert.match(workflow, /artifact_name: github-pages-rollback/);
});
