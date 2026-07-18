import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const MartRelease = require(path.join(root, "app-version.js"));

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", stdio: "inherit" });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runPackageScript(script) {
  const packageManager = process.env.npm_execpath;
  if (packageManager && fs.existsSync(packageManager)) {
    run(process.execPath, [packageManager, script]);
    return;
  }
  run(process.platform === "win32" ? "pnpm.cmd" : "pnpm", [script]);
}

function verifyReleaseAssets() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
  const localAssets = Array.from(html.matchAll(/(?:src|href)="(\.\/[^"?]+)\?v=(\d+)"/g));
  if (!localAssets.length) fail("Keine versionierten lokalen Laufzeitdateien in index.html gefunden.");
  const versions = new Set(localAssets.map((match) => match[2]));
  const expectedBuild = String(MartRelease.build);
  if (versions.size !== 1 || !versions.has(expectedBuild)) {
    fail("Die Versionsnummern in index.html und sw.js stimmen nicht überein.");
  }
  if (!serviceWorker.includes("einkaufszettel-v${MartRelease.build}")) {
    fail("Der Service-Worker verwendet nicht die zentrale Build-Nummer.");
  }
  localAssets.forEach((match) => {
    if (!serviceWorker.includes(`"${match[1]}"`)) {
      fail(`${match[1]} fehlt im Service-Worker-Cache.`);
    }
  });
}

verifyReleaseAssets();
const unitPattern = "tests/*.test.js";
const unitTests = fs.readdirSync(path.join(root, "tests"))
  .filter((file) => file.endsWith(".test.js"))
  .map((file) => path.join("tests", file));
const browserDirectory = path.join(root, "tests", "browser");
const browserTests = fs.readdirSync(browserDirectory)
  .filter((file) => file.endsWith(".spec.js"));
if (!unitTests.length) fail(`Keine Unit-Tests für ${unitPattern} gefunden.`);
if (!browserTests.length) fail("Keine Browser-Tests gefunden.");
run(process.execPath, ["--test", ...unitTests]);
[
  "app-version.js",
  "account-logic.js",
  "sync-logic.js",
  "app-logic.js",
  "avatar-logic.js",
  "app.js",
  "supabase-config.js",
  "sw.js"
].forEach((file) => run(process.execPath, ["--check", file]));
run("git", ["diff", "--check"]);
runPackageScript("test:browser");
