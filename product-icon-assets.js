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
  "Äpfel": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/01-aepfel.svg",
    "motif": "apple-pair"
  },
  "Bananen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/02-bananen.svg",
    "motif": "banana-bunch"
  },
  "Orangen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/03-orangen.svg",
    "motif": "orange-and-slice"
  },
  "Zitronen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/04-zitronen.svg",
    "motif": "lemon-pair"
  },
  "Limetten": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/05-limetten.svg",
    "motif": "lime-and-slice"
  },
  "Erdbeeren": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/06-erdbeeren.svg",
    "motif": "strawberry-pair"
  },
  "Heidelbeeren": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/07-heidelbeeren.svg",
    "motif": "blueberry-cluster"
  },
  "Himbeeren": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/08-himbeeren.svg",
    "motif": "raspberry-cluster"
  },
  "Trauben": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/09-trauben.svg",
    "motif": "grape-bunch"
  },
  "Birnen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/10-birnen.svg",
    "motif": "pear-pair"
  },
  "Kiwi": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/11-kiwi.svg",
    "motif": "kiwi-and-slice"
  },
  "Mango": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/12-mango.svg",
    "motif": "mango-and-slice"
  },
  "Ananas": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/13-ananas.svg",
    "motif": "pineapple"
  },
  "Wassermelone": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/14-wassermelone.svg",
    "motif": "watermelon-slice"
  },
  "Honigmelone": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/15-honigmelone.svg",
    "motif": "honeydew-melon-slice"
  },
  "Pfirsiche": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/16-pfirsiche.svg",
    "motif": "peach-pair"
  },
  "Pflaumen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/17-pflaumen.svg",
    "motif": "plum-pair"
  },
  "Kirschen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/18-kirschen.svg",
    "motif": "cherry-pair"
  },
  "Grapefruit": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/19-grapefruit.svg",
    "motif": "grapefruit-and-slice"
  },
  "Avocado": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/20-avocado.svg",
    "motif": "avocado-half"
  },
  "Mandarinen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/21-mandarinen.svg",
    "motif": "mandarin-pair"
  },
  "Nektarinen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/22-nektarinen.svg",
    "motif": "nectarine-pair"
  },
  "Granatapfel": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/23-granatapfel.svg",
    "motif": "pomegranate-half"
  },
  "Aprikosen": {
    "shelfId": "obst",
    "path": "./assets/product-icons/02-obst/24-aprikosen.svg",
    "motif": "apricot-pair"
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
