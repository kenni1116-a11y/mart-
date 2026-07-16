(function exposeProductIconAssets(globalScope) {
  const productIconAssets = Object.freeze({
  "Tomaten": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/01-tomaten.svg",
    "motif": "tomato-pair"
  },
  "Gurken": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/02-gurken.svg",
    "motif": "cucumber-and-slice"
  },
  "Paprika": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/03-paprika.svg",
    "motif": "three-bell-peppers"
  },
  "Zwiebeln": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/04-zwiebeln.svg",
    "motif": "white-onion-brown-skin"
  },
  "Kartoffeln": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/05-kartoffeln.svg",
    "motif": "potato-pile"
  },
  "Karotten": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/06-karotten.svg",
    "motif": "carrot-bunch"
  },
  "Brokkoli": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/07-brokkoli.svg",
    "motif": "broccoli-floret"
  },
  "Blumenkohl": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/08-blumenkohl.svg",
    "motif": "white-cauliflower"
  },
  "Lauch": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/09-lauch.svg",
    "motif": "long-leek"
  },
  "Sellerie": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/10-sellerie.svg",
    "motif": "celery-bunch"
  },
  "Knoblauch": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/11-knoblauch.svg",
    "motif": "three-garlic-bulbs"
  },
  "Zucchini": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/12-zucchini.svg",
    "motif": "two-zucchini"
  },
  "Aubergine": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/13-aubergine.svg",
    "motif": "eggplant"
  },
  "Spinat": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/14-spinat.svg",
    "motif": "spinach-leaf-pile"
  },
  "Salat": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/15-salat.svg",
    "motif": "open-leaf-lettuce"
  },
  "Mais": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/16-mais.svg",
    "motif": "corn-cob"
  },
  "Champignons": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/17-champignons.svg",
    "motif": "three-mushrooms"
  },
  "Radieschen": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/18-radieschen.svg",
    "motif": "radish-bunch"
  },
  "Kohl": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/19-kohl.svg",
    "motif": "round-cabbage"
  },
  "Süßkartoffeln": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/20-suesskartoffeln.svg",
    "motif": "sweet-potato-pair"
  },
  "Ingwer": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/21-ingwer.svg",
    "motif": "branched-ginger"
  },
  "Frühlingszwiebeln": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/22-fruehlingszwiebeln.svg",
    "motif": "spring-onion-bunch"
  },
  "Rosenkohl": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/23-rosenkohl.svg",
    "motif": "five-brussels-sprouts"
  },
  "Spargel": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/24-spargel.svg",
    "motif": "five-white-asparagus-stalks"
  },
  "Fenchel": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/25-fenchel.svg",
    "motif": "fennel-bulb"
  },
  "Chili": {
    "shelfId": "gemuese",
    "path": "./assets/product-icons/01-gemuese/26-chili.svg",
    "motif": "three-chili-peppers"
  },
  "Eisbergsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/01-eisbergsalat.svg",
    "motif": "iceberg-lettuce-head"
  },
  "Feldsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/02-feldsalat.svg",
    "motif": "lambs-lettuce-rosettes"
  },
  "Rucola": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/03-rucola.svg",
    "motif": "rocket-leaf-bundle"
  },
  "Kopfsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/04-kopfsalat.svg",
    "motif": "open-butterhead-lettuce"
  },
  "Fertigsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/05-fertigsalat.svg",
    "motif": "salad-bag"
  },
  "Krautsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/06-krautsalat.svg",
    "motif": "white-cabbage-slaw-bowl"
  },
  "Kartoffelsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/07-kartoffelsalat.svg",
    "motif": "potato-salad-bowl"
  },
  "Nudelsalat": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/08-nudelsalat.svg",
    "motif": "pasta-salad-bowl"
  },
  "Coleslaw": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/09-coleslaw.svg",
    "motif": "colorful-coleslaw-bowl"
  },
  "Antipasti": {
    "shelfId": "salat",
    "path": "./assets/product-icons/03-salate-frischetheke/10-antipasti.svg",
    "motif": "antipasti-platter"
  }
});
  const api = Object.freeze({
    productIconAssets,
    allProductIconAssetPaths: Object.freeze(Object.values(productIconAssets).map((asset) => asset.path)),
    getProductIconAsset(name, shelfId) {
      const asset = productIconAssets[String(name || "")];
      return asset && asset.shelfId === shelfId ? asset : null;
    }
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  globalScope.MartProductIconAssets = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
