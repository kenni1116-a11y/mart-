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

const fruitAssets = [
  ["Äpfel", "01-aepfel.svg", "apple-pair"], ["Bananen", "02-bananen.svg", "banana-bunch"],
  ["Orangen", "03-orangen.svg", "orange-and-slice"], ["Zitronen", "04-zitronen.svg", "lemon-pair"],
  ["Limetten", "05-limetten.svg", "lime-and-slice"], ["Erdbeeren", "06-erdbeeren.svg", "strawberry-pair"],
  ["Heidelbeeren", "07-heidelbeeren.svg", "blueberry-cluster"], ["Himbeeren", "08-himbeeren.svg", "raspberry-cluster"],
  ["Trauben", "09-trauben.svg", "grape-bunch"], ["Birnen", "10-birnen.svg", "pear-pair"],
  ["Kiwi", "11-kiwi.svg", "kiwi-and-slice"], ["Mango", "12-mango.svg", "mango-and-slice"],
  ["Ananas", "13-ananas.svg", "pineapple"], ["Wassermelone", "14-wassermelone.svg", "watermelon-slice"],
  ["Honigmelone", "15-honigmelone.svg", "honeydew-melon-slice"], ["Pfirsiche", "16-pfirsiche.svg", "peach-pair"],
  ["Pflaumen", "17-pflaumen.svg", "plum-pair"], ["Kirschen", "18-kirschen.svg", "cherry-pair"],
  ["Grapefruit", "19-grapefruit.svg", "grapefruit-and-slice"], ["Avocado", "20-avocado.svg", "avocado-half"],
  ["Mandarinen", "21-mandarinen.svg", "mandarin-pair"], ["Nektarinen", "22-nektarinen.svg", "nectarine-pair"],
  ["Granatapfel", "23-granatapfel.svg", "pomegranate-half"], ["Aprikosen", "24-aprikosen.svg", "apricot-pair"]
];
const fruit = fruitAssets.map(([name]) => name);
const fruitIconDirectory = path.join(root, "assets/product-icons/02-obst");

test("icon manifest contains 26 vegetables, 24 fruits, and 10 fresh-counter products", () => {
  assert.ok(fs.existsSync(manifestPath), "product-icon-assets.js is missing");
  const { productIconAssets } = require(manifestPath);
  const names = Object.keys(productIconAssets);

  assert.equal(names.length, 60);
  assert.deepEqual(names.filter((name) => productIconAssets[name].shelfId === "gemuese"), vegetables);
  assert.deepEqual(names.filter((name) => productIconAssets[name].shelfId === "obst"), fruit);
  assert.deepEqual(names.filter((name) => productIconAssets[name].shelfId === "salat"), freshCounter);
});

test("every fruit manifest entry matches the approved path and motif contract", () => {
  const { productIconAssets } = require(manifestPath);
  const paths = new Set();
  const motifs = new Set();

  for (const [name, filename, motif] of fruitAssets) {
    const asset = productIconAssets[name];
    assert.ok(asset, `${name} has no asset`);
    assert.deepEqual(asset, {
      shelfId: "obst",
      path: `./assets/product-icons/02-obst/${filename}`,
      motif
    });
    assert.ok(!paths.has(asset.path), `${name} reuses ${asset.path}`);
    assert.ok(!motifs.has(asset.motif), `${name} reuses motif ${asset.motif}`);
    paths.add(asset.path);
    motifs.add(asset.motif);
  }
});

test("the fruit folder contains exactly the 24 manifest SVGs and no extras", () => {
  const expectedFiles = fruitAssets.map(([, filename]) => filename).sort();
  const actualFiles = fs.readdirSync(fruitIconDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name) === ".svg")
    .map((entry) => entry.name)
    .sort();

  assert.equal(actualFiles.length, 24);
  assert.deepEqual(actualFiles, expectedFiles);
});

test("every product manifest entry has one unique, safe and recognizable SVG asset", () => {
  assert.ok(fs.existsSync(manifestPath), "product-icon-assets.js is missing");
  const { productIconAssets } = require(manifestPath);
  const paths = new Set();
  const motifs = new Set();

  for (const name of [...vegetables, ...fruit, ...freshCounter]) {
    const asset = productIconAssets[name];
    assert.ok(asset, `${name} has no asset`);
    const expectedShelfId = vegetables.includes(name) ? "gemuese" : fruit.includes(name) ? "obst" : "salat";
    assert.equal(asset.shelfId, expectedShelfId);
    assert.match(asset.path, /^\.\/assets\/product-icons\/(01-gemuese|02-obst|03-salate-frischetheke)\/[a-z0-9-]+\.svg$/);
    assert.match(asset.motif, /^[a-z0-9-]+$/);
    assert.ok(!paths.has(asset.path), `${name} reuses ${asset.path}`);
    assert.ok(!motifs.has(asset.motif), `${name} reuses motif ${asset.motif}`);
    paths.add(asset.path);
    motifs.add(asset.motif);

    const svgPath = path.join(root, asset.path.replace(/^\.\//, ""));
    assert.ok(fs.existsSync(svgPath), `${asset.path} is missing`);
    const svg = fs.readFileSync(svgPath, "utf8");
    const openingTag = svg.match(/^<svg\b[^>]*>/)?.[0];
    assert.ok(openingTag, `${asset.path} has no SVG root element`);
    assert.equal(openingTag.match(/\bwidth="([^"]*)"/)?.[1], "64");
    assert.equal(openingTag.match(/\bheight="([^"]*)"/)?.[1], "64");
    assert.equal(openingTag.match(/\bviewBox="([^"]*)"/)?.[1], "0 0 64 64");
    assert.match(svg, /<rect\s+width="64"\s+height="64"\s+fill="#fff"\s*\/>/);
    assert.ok(svg.includes(`data-product-illustration="${asset.motif}"`));
    assert.ok(svg.includes(`<title>${name}</title>`));
    assert.doesNotMatch(svg, /<script\b|\son[a-z][a-z0-9:-]*\s*=|javascript\s*:/i);
  }
});

test("the pineapple uses ring geometry instead of a whole-fruit silhouette", () => {
  const svg = fs.readFileSync(path.join(fruitIconDirectory, "13-ananas.svg"), "utf8");
  assert.match(svg, /<circle\b/);
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
