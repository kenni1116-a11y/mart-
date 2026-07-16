const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifestPath = path.join(root, "product-icon-assets.js");

const vegetables = [
  "Tomaten", "Gurken", "Paprika", "Zwiebeln", "Kartoffeln", "Karotten", "Brokkoli", "Blumenkohl", "Lauch", "Sellerie",
  "Knoblauch", "Zucchini", "Aubergine", "Spinat", "Salat", "Mais", "Champignons", "Radieschen", "Kohl", "Süßkartoffeln",
  "Ingwer", "Frühlingszwiebeln", "Rosenkohl", "Spargel", "Fenchel", "Chili"
];

const freshCounter = [
  "Eisbergsalat", "Feldsalat", "Rucola", "Kopfsalat", "Fertigsalat",
  "Krautsalat", "Kartoffelsalat", "Nudelsalat", "Coleslaw", "Antipasti"
];

test("icon batch one contains 26 vegetables and 10 fresh-counter products", () => {
  assert.ok(fs.existsSync(manifestPath), "product-icon-assets.js is missing");
  const { productIconAssets } = require(manifestPath);
  const names = Object.keys(productIconAssets);

  assert.equal(names.length, 36);
  assert.deepEqual(names.filter((name) => productIconAssets[name].shelfId === "gemuese"), vegetables);
  assert.deepEqual(names.filter((name) => productIconAssets[name].shelfId === "salat"), freshCounter);
});

test("every batch-one product has one unique, safe and recognizable SVG asset", () => {
  assert.ok(fs.existsSync(manifestPath), "product-icon-assets.js is missing");
  const { productIconAssets } = require(manifestPath);
  const paths = new Set();
  const motifs = new Set();

  for (const name of [...vegetables, ...freshCounter]) {
    const asset = productIconAssets[name];
    assert.ok(asset, `${name} has no asset`);
    assert.equal(asset.shelfId, vegetables.includes(name) ? "gemuese" : "salat");
    assert.match(asset.path, /^\.\/assets\/product-icons\/(01-gemuese|03-salate-frischetheke)\/[a-z0-9-]+\.svg$/);
    assert.match(asset.motif, /^[a-z0-9-]+$/);
    assert.ok(!paths.has(asset.path), `${name} reuses ${asset.path}`);
    assert.ok(!motifs.has(asset.motif), `${name} reuses motif ${asset.motif}`);
    paths.add(asset.path);
    motifs.add(asset.motif);

    const svgPath = path.join(root, asset.path.replace(/^\.\//, ""));
    assert.ok(fs.existsSync(svgPath), `${asset.path} is missing`);
    const svg = fs.readFileSync(svgPath, "utf8");
    assert.match(svg, /viewBox="0 0 64 64"/);
    assert.ok(svg.includes(`data-product-illustration="${asset.motif}"`));
    assert.ok(svg.includes(`<title>${name}</title>`));
    assert.doesNotMatch(svg, /<script|onload=|javascript:/i);
  }
});

test("the browser and service worker use the batch-one icon manifest", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const serviceWorker = fs.readFileSync(path.join(root, "sw.js"), "utf8");

  assert.match(html, /product-icon-assets\.js\?v=/);
  assert.ok(html.indexOf("product-icon-assets.js") < html.indexOf("app.js"));
  assert.match(app, /MartProductIconAssets\.getProductIconAsset/);
  assert.match(serviceWorker, /importScripts\("\.\/product-icon-assets\.js"\)/);
  assert.match(serviceWorker, /MartProductIconAssets\.allProductIconAssetPaths/);
});
