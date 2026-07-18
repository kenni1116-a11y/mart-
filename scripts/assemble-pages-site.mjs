import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.resolve(process.argv[2] || path.join(root, "_site"));
const files = [
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
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(output, file));
}

await cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
await writeFile(path.join(output, ".nojekyll"), "", "utf8");

console.log(`Prepared ${files.length} startup files and product assets in ${output}`);
