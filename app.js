const shelves = [
  {
    id: "gemuese",
    title: "Gemüse",
    emoji: "🥦",
    color: "#5d8a45",
    icon: "leaf",
    products: [
      "Tomaten", "Gurken", "Paprika", "Zwiebeln", "Kartoffeln", "Karotten", "Brokkoli", "Blumenkohl", "Lauch", "Sellerie",
      "Knoblauch", "Zucchini", "Aubergine", "Spinat", "Salat", "Mais", "Champignons", "Radieschen", "Kohl", "Süßkartoffeln",
      "Ingwer", "Frühlingszwiebeln", "Rosenkohl", "Spargel", "Fenchel", "Chili"
    ]
  },
  {
    id: "obst",
    title: "Obst",
    emoji: "🍎",
    color: "#c66b3d",
    icon: "apple",
    products: [
      "Äpfel", "Bananen", "Orangen", "Zitronen", "Limetten", "Erdbeeren", "Heidelbeeren", "Himbeeren", "Trauben", "Birnen",
      "Kiwi", "Mango", "Ananas", "Wassermelone", "Honigmelone", "Pfirsiche", "Pflaumen", "Kirschen", "Grapefruit", "Avocado",
      "Mandarinen", "Nektarinen", "Granatapfel", "Aprikosen"
    ]
  },
  {
    id: "salat",
    title: "Salate & Frischetheke",
    emoji: "🥗",
    color: "#147c72",
    icon: "salad",
    products: [
      "Eisbergsalat", "Feldsalat", "Rucola", "Kopfsalat", "Fertigsalat", "Krautsalat", "Kartoffelsalat", "Nudelsalat", "Coleslaw", "Antipasti",
      "Oliven", "Frischkäsecreme", "Hummus", "Guacamole", "Kräuterbutter", "Tzatziki", "Obazda", "Fleischsalat", "Eiersalat"
    ]
  },
  {
    id: "kaese",
    title: "Käsetheke",
    emoji: "🧀",
    color: "#c79b2f",
    icon: "cheese",
    products: [
      "Gouda", "Edamer", "Mozzarella", "Parmesan", "Camembert", "Brie", "Feta", "Frischkäse", "Scheibenkäse", "Reibekäse",
      "Cheddar", "Ziegenkäse", "Blauschimmelkäse", "Raclettekäse", "Grillkäse", "Emmentaler", "Butterkäse", "Hüttenkäse", "Mascarpone"
    ]
  },
  {
    id: "milch",
    title: "Milchprodukte",
    emoji: "🥛",
    color: "#4c7fa8",
    icon: "milk",
    products: [
      "Milch", "Hafermilch", "Mandelmilch", "Joghurt", "Quark", "Skyr", "Sahne", "Butter", "Margarine", "Kefir",
      "Pudding", "Desserts", "Buttermilch", "Kondensmilch", "Milchreis", "Schmand", "Crème fraîche", "Saure Sahne", "Reibekäse"
    ]
  },
  {
    id: "backwaren",
    title: "Backwaren",
    emoji: "🍞",
    color: "#b26b36",
    icon: "bread",
    products: [
      "Toastbrot", "Mischbrot", "Vollkornbrot", "Brötchen", "Croissants", "Baguette", "Knäckebrot", "Laugenbrezel", "Kuchen", "Muffins",
      "Wraps", "Tortillas", "Burgerbrötchen", "Hotdogbrötchen", "Zwieback", "Toasties", "Ciabatta", "Pita", "Bagels"
    ]
  },
  {
    id: "kaffee-tee-fruehstueck",
    title: "Kaffee, Tee & Frühstück",
    emoji: "☕",
    color: "#8a623d",
    icon: "cup",
    products: [
      "Kaffee", "Espressobohnen", "Kaffeepads", "Filterkaffee", "Schwarztee", "Grüntee", "Kräutertee", "Kakao", "Müsli", "Cornflakes",
      "Haferflocken", "Chiasamen", "Honig", "Marmelade", "Nutella", "Erdnussbutter", "Zucker", "Süßstoff", "Kaffeefilter",
      "Milchpulver", "Agavendicksaft", "Ahornsirup"
    ]
  },
  {
    id: "nudeln-reis-konserven",
    title: "Nudeln, Reis & Konserven",
    emoji: "🍝",
    color: "#a26642",
    icon: "jar",
    products: [
      "Spaghetti", "Penne", "Fusilli", "Reis", "Couscous", "Bulgur", "Kartoffelpüree", "Ravioli", "Dosentomaten", "Kidneybohnen",
      "Maisdose", "Erbsen", "Thunfischdose", "Kokosmilch", "Suppen", "Instantnudeln", "Linsen", "Kichererbsen", "Passierte Tomaten",
      "Tomatenmark", "Sauerkraut", "Gewürzgurken"
    ]
  },
  {
    id: "fleisch-wurst",
    title: "Fleisch & Wurst",
    emoji: "🥩",
    color: "#9b4542",
    icon: "steak",
    products: [
      "Hähnchenbrust", "Hackfleisch", "Rindersteak", "Schweinefilet", "Würstchen", "Salami", "Schinken", "Mortadella", "Aufschnitt", "Bacon",
      "Frikadellen", "Leberwurst", "Hähnchenaufschnitt", "Wiener Würstchen", "Gyros"
    ]
  },
  {
    id: "fisch",
    title: "Fisch",
    emoji: "🐟",
    color: "#397da1",
    icon: "fish",
    products: [
      "Lachs", "Thunfisch", "Fischstäbchen", "Garnelen", "Forelle", "Matjes", "Räucherlachs", "Backfisch", "Calamari", "Krabben"
    ]
  },
  {
    id: "tiefkuehl",
    title: "Tiefkühl",
    emoji: "❄️",
    color: "#4d90b8",
    icon: "sparkle",
    products: [
      "Tiefkühlpizza", "Pommes", "Eiscreme", "Tiefkühlgemüse", "Tiefkühlobst", "Chicken Nuggets", "Lasagne", "Fischstäbchen", "Kroketten", "Spinat",
      "Fertiggerichte", "Tiefkühlbrötchen", "Kräuter", "Wokmischung", "Mozzarellasticks", "Beerenmix", "Rahmspinat", "Baguettes", "Gemüsepfanne"
    ]
  },
  {
    id: "getraenke",
    title: "Getränke",
    emoji: "🥤",
    color: "#2878a8",
    icon: "bottle",
    products: [
      "Wasser", "Cola", "Limonade", "Eistee", "Orangensaft", "Apfelsaft", "Multivitaminsaft", "Energy Drink", "Spezi", "Tonic Water",
      "Ginger Ale", "Mineralwasser", "Smoothies", "Eiskaffee", "Sportgetränke"
    ]
  },
  {
    id: "alkohol",
    title: "Alkohol",
    emoji: "🍺",
    color: "#7a4d85",
    icon: "glass",
    products: [
      "Bier", "Weißwein", "Rotwein", "Rosé", "Sekt", "Prosecco", "Vodka", "Gin", "Rum", "Whiskey",
      "Likör", "Aperol", "Jägermeister", "Cocktails", "Cider"
    ]
  },
  {
    id: "suessigkeiten-snacks",
    title: "Süßigkeiten & Snacks",
    emoji: "🍫",
    color: "#8c5b70",
    icon: "sparkle",
    products: [
      "Chips", "Salzstangen", "Schokolade", "Gummibärchen", "Kekse", "Nüsse", "Studentenfutter", "Popcorn", "Cracker", "Müsliriegel",
      "Proteinriegel", "Kaugummi", "Bonbons", "Pralinen", "Eis"
    ]
  },
  {
    id: "koerperpflege",
    title: "Körperpflege",
    emoji: "🧴",
    color: "#b75e70",
    icon: "sparkle",
    products: [
      "Shampoo", "Conditioner", "Duschgel", "Seife", "Zahnpasta", "Zahnbürsten", "Mundspülung", "Deodorant", "Rasierer", "Rasierschaum",
      "Wattepads", "Toilettenpapier", "Taschentücher", "Feuchttücher", "Gesichtscreme", "Sonnencreme", "Damenhygiene", "Haarfarbe"
    ]
  },
  {
    id: "haushalt",
    title: "Haushalt",
    emoji: "🧽",
    color: "#6d6f75",
    icon: "clean",
    products: [
      "Glasreiniger", "Badreiniger", "Kloreiniger", "Kalkentferner", "Schimmelentferner", "Allzweckreiniger", "Küchenrolle", "Müllbeutel", "Spülschwämme", "Mikrofasertücher",
      "Lappen", "Alufolie", "Frischhaltefolie", "Backpapier", "Waschmittel Pulver", "Waschmittel Flüssig", "Weichspüler", "Geschirrspültabs", "Batterien", "Kerzen",
      "Feuerzeug", "Spülmittel", "WC-Steine", "Entkalker", "Gummihandschuhe", "Staubsaugerbeutel"
    ]
  },
  {
    id: "tierbedarf",
    title: "Tierbedarf",
    emoji: "🐶",
    color: "#7a684c",
    icon: "paw",
    products: [
      "Hundefutter", "Katzenfutter", "Leckerlis", "Katzenstreu", "Vogelfutter", "Hundekotbeutel", "Kauspielzeug", "Tierstreu", "Aquariumfutter", "Heu"
    ]
  },
  {
    id: "gesundheit-apotheke",
    title: "Gesundheit & Apotheke",
    emoji: "💊",
    color: "#4f8b77",
    icon: "pill",
    products: [
      "Schmerztabletten", "Pflaster", "Vitamine", "Magnesium", "Taschentücher", "Nasenspray", "Hustensaft", "Fieberthermometer", "Desinfektionsmittel", "Kondome"
    ]
  },
  {
    id: "eier-feinkost",
    title: "Eier & Feinkost",
    emoji: "🥚",
    color: "#8c826f",
    icon: "salad",
    products: [
      "Eier", "Mayonnaise", "Remoulade", "Senf", "Ketchup", "BBQ-Sauce", "Pesto", "Meerrettich"
    ]
  },
  {
    id: "gewuerze-backzutaten",
    title: "Gewürze & Backzutaten",
    emoji: "🧂",
    color: "#7f766a",
    icon: "spice",
    products: [
      "Salz", "Pfeffer", "Paprika", "Curry", "Zimt", "Mehl", "Backpulver", "Vanillezucker", "Hefe"
    ]
  },
  {
    id: "oel-essig-saucen",
    title: "Öl, Essig & Saucen",
    emoji: "🫙",
    color: "#6f7466",
    icon: "bottle",
    products: [
      "Olivenöl", "Sonnenblumenöl", "Balsamico", "Apfelessig", "Sojasauce", "Tabasco", "Worcestersauce"
    ]
  },
  {
    id: "babypflege",
    title: "Babypflege",
    emoji: "🍼",
    color: "#7a7f88",
    icon: "milk",
    products: [
      "Windeln", "Feuchttücher", "Babynahrung", "Gläschen", "Babybrei", "Schnuller"
    ]
  },
  {
    id: "buero-sonstiges",
    title: "Büro & Sonstiges",
    emoji: "✏️",
    color: "#6f7175",
    icon: "pencil",
    products: [
      "Klebeband", "Stifte", "Briefumschläge", "Geschenkpapier", "Kleber"
    ]
  }
];

const defaultMarkets = [
  {
    id: "market:rewe",
    name: "Rewe",
    kategorie: "Supermarkt",
    adresse: "Musterstraße 12",
    plz: "50667",
    ort: "Köln",
    latitude: 50.9384,
    longitude: 6.9599,
    entfernung: 0.4,
    websiteUrl: "https://www.rewe.de",
    prospectUrl: "https://www.rewe.de/angebote/",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:aldi",
    name: "Aldi",
    kategorie: "Discounter",
    adresse: "Marktallee 4",
    plz: "50668",
    ort: "Köln",
    latitude: 50.9445,
    longitude: 6.9558,
    entfernung: 0.7,
    websiteUrl: "https://www.aldi-sued.de",
    prospectUrl: "https://www.aldi-sued.de/de/angebote.html",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:lidl",
    name: "Lidl",
    kategorie: "Discounter",
    adresse: "Einkaufsring 9",
    plz: "50670",
    ort: "Köln",
    latitude: 50.9512,
    longitude: 6.9617,
    entfernung: 0.9,
    websiteUrl: "https://www.lidl.de",
    prospectUrl: "https://www.lidl.de/c/angebote",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:penny",
    name: "Penny",
    kategorie: "Discounter",
    adresse: "Kassenweg 17",
    plz: "50672",
    ort: "Köln",
    latitude: 50.9367,
    longitude: 6.9408,
    entfernung: 1.7,
    websiteUrl: "https://www.penny.de",
    prospectUrl: "https://www.penny.de/angebote",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:netto",
    name: "Netto",
    kategorie: "Discounter",
    adresse: "Sparstraße 3",
    plz: "50674",
    ort: "Köln",
    latitude: 50.9298,
    longitude: 6.9432,
    entfernung: 2.0,
    websiteUrl: "https://www.netto-online.de",
    prospectUrl: "https://www.netto-online.de/angebote",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:norma",
    name: "Norma",
    kategorie: "Discounter",
    adresse: "Regalplatz 6",
    plz: "50676",
    ort: "Köln",
    latitude: 50.9329,
    longitude: 6.9685,
    entfernung: 2.2,
    websiteUrl: "https://www.norma-online.de",
    prospectUrl: "https://www.norma-online.de/de/angebote",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:dm",
    name: "DM",
    kategorie: "Drogerie",
    adresse: "Pflegepassage 2",
    plz: "50667",
    ort: "Köln",
    latitude: 50.9418,
    longitude: 6.9524,
    entfernung: 1.2,
    websiteUrl: "https://www.dm.de",
    prospectUrl: "https://www.dm.de/angebote",
    logoUrl: "",
    icon: "sparkle",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:rossmann",
    name: "Rossmann",
    kategorie: "Drogerie",
    adresse: "Seifenstraße 22",
    plz: "50670",
    ort: "Köln",
    latitude: 50.9469,
    longitude: 6.9497,
    entfernung: 1.6,
    websiteUrl: "https://www.rossmann.de",
    prospectUrl: "https://www.rossmann.de/de/angebote",
    logoUrl: "",
    icon: "sparkle",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:shell",
    name: "Shell",
    kategorie: "Tankstelle",
    adresse: "Tankstelle 1",
    plz: "50679",
    ort: "Köln",
    latitude: 50.9345,
    longitude: 6.9817,
    entfernung: 2.6,
    websiteUrl: "https://www.shell.de",
    prospectUrl: "https://www.shell.de/tankstellen.html",
    logoUrl: "",
    icon: "bottle",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:aral",
    name: "Aral",
    kategorie: "Tankstelle",
    adresse: "Zapfweg 8",
    plz: "50679",
    ort: "Köln",
    latitude: 50.9303,
    longitude: 6.9764,
    entfernung: 2.8,
    websiteUrl: "https://www.aral.de",
    prospectUrl: "https://www.aral.de",
    logoUrl: "",
    icon: "bottle",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:hit",
    name: "Hit",
    kategorie: "Supermarkt",
    adresse: "Frischemarkt 5",
    plz: "50823",
    ort: "Köln",
    latitude: 50.9536,
    longitude: 6.9187,
    entfernung: 3.4,
    websiteUrl: "https://www.hit.de",
    prospectUrl: "https://www.hit.de/angebote",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:globus",
    name: "Globus",
    kategorie: "SB-Warenhaus",
    adresse: "Großmarktstraße 11",
    plz: "51149",
    ort: "Köln",
    latitude: 50.8995,
    longitude: 7.0467,
    entfernung: 7.8,
    websiteUrl: "https://www.globus.de",
    prospectUrl: "https://www.globus.de/angebote.php",
    logoUrl: "",
    icon: "store",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:bauhaus",
    name: "Bauhaus",
    kategorie: "Baumarkt",
    adresse: "Werkzeugdamm 14",
    plz: "50829",
    ort: "Köln",
    latitude: 50.9737,
    longitude: 6.8819,
    entfernung: 8.5,
    websiteUrl: "https://www.bauhaus.info",
    prospectUrl: "https://www.bauhaus.info/angebote",
    logoUrl: "",
    icon: "home",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:obi",
    name: "OBI",
    kategorie: "Baumarkt",
    adresse: "Heimwerkerweg 7",
    plz: "50825",
    ort: "Köln",
    latitude: 50.9511,
    longitude: 6.8998,
    entfernung: 5.1,
    websiteUrl: "https://www.obi.de",
    prospectUrl: "https://www.obi.de/angebote",
    logoUrl: "",
    icon: "home",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:mueller",
    name: "Müller",
    kategorie: "Drogerie",
    adresse: "Sortimentsgasse 10",
    plz: "50667",
    ort: "Köln",
    latitude: 50.9398,
    longitude: 6.9582,
    entfernung: 1.5,
    websiteUrl: "https://www.mueller.de",
    prospectUrl: "https://www.mueller.de/angebote/",
    logoUrl: "",
    icon: "sparkle",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:kleins",
    name: "Kleins",
    kategorie: "Bäckerei",
    adresse: "Backstubenweg 1",
    plz: "50667",
    ort: "Köln",
    latitude: 50.9376,
    longitude: 6.9529,
    entfernung: 1.8,
    websiteUrl: "https://www.baeckerei-kleins.de",
    prospectUrl: "https://www.baeckerei-kleins.de",
    logoUrl: "",
    icon: "bread",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:merzenich",
    name: "Merzenich Bäckerei",
    kategorie: "Bäckerei",
    adresse: "Brötchenplatz 3",
    plz: "50667",
    ort: "Köln",
    latitude: 50.9369,
    longitude: 6.9571,
    entfernung: 2.0,
    websiteUrl: "https://www.merzenich.de",
    prospectUrl: "https://www.merzenich.de",
    logoUrl: "",
    icon: "bread",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:ikea",
    name: "IKEA",
    kategorie: "Einrichtung",
    adresse: "Möbelallee 1",
    plz: "50829",
    ort: "Köln",
    latitude: 50.9822,
    longitude: 6.8785,
    entfernung: 9.0,
    websiteUrl: "https://www.ikea.com/de/de/",
    prospectUrl: "https://www.ikea.com/de/de/offers/",
    logoUrl: "",
    icon: "home",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:poco",
    name: "Poco",
    kategorie: "Einrichtung",
    adresse: "Wohnmarkt 19",
    plz: "50829",
    ort: "Köln",
    latitude: 50.9724,
    longitude: 6.8904,
    entfernung: 8.0,
    websiteUrl: "https://www.poco.de",
    prospectUrl: "https://www.poco.de/angebote",
    logoUrl: "",
    icon: "home",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  },
  {
    id: "market:hoeffner",
    name: "Höffner",
    kategorie: "Einrichtung",
    adresse: "Möbelring 23",
    plz: "50858",
    ort: "Köln",
    latitude: 50.9278,
    longitude: 6.8399,
    entfernung: 10.7,
    websiteUrl: "https://www.hoeffner.de",
    prospectUrl: "https://www.hoeffner.de/angebote",
    logoUrl: "",
    icon: "home",
    source: "Platzhalterdaten",
    isDefaultMarket: true,
    isUserAdded: false
  }
];

const externalMarketSeeds = [
  {
    id: "osm:node-244914835",
    name: "REWE",
    kategorie: "Supermarkt",
    adresse: "Deutzer Freiheit 84",
    plz: "50679",
    ort: "Köln",
    latitude: 50.936709,
    longitude: 6.974785,
    entfernung: 1.2,
    websiteUrl: "https://www.rewe-rahmati.de/index.php/maerkte/deutzer-freiheit",
    prospectUrl: "https://www.rewe.de/angebote/",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-348474184",
    name: "REWE To Go",
    kategorie: "Convenience",
    adresse: "Innenstadt",
    plz: "50667",
    ort: "Köln",
    latitude: 50.936698,
    longitude: 6.956157,
    entfernung: 0.3,
    websiteUrl: "https://www.rewe.de",
    prospectUrl: "https://www.rewe.de/angebote/",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-360389419",
    name: "REWE City",
    kategorie: "Supermarkt",
    adresse: "Innenstadt",
    plz: "50667",
    ort: "Köln",
    latitude: 50.935505,
    longitude: 6.9567,
    entfernung: 0.4,
    websiteUrl: "https://www.rewe.de",
    prospectUrl: "https://www.rewe.de/angebote/",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-257808770",
    name: "REWE City",
    kategorie: "Supermarkt",
    adresse: "Neusser Straße 292-294",
    plz: "50733",
    ort: "Köln",
    latitude: 50.965414,
    longitude: 6.953752,
    entfernung: 3.1,
    websiteUrl: "https://www.rewe.de/marktseite/rewe-city-markt-k%C3%B6ln-neusser-stra%C3%9Fe-292-294",
    prospectUrl: "https://www.rewe.de/angebote/",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-256665876",
    name: "Aldi Süd",
    kategorie: "Discounter",
    adresse: "Neusser Straße 216",
    plz: "50733",
    ort: "Köln",
    latitude: 50.96177,
    longitude: 6.954578,
    entfernung: 2.7,
    websiteUrl: "https://www.aldi-sued.de/filialen/l/koeln/neusser-strasse-216/b331",
    prospectUrl: "https://www.aldi-sued.de/de/angebote.html",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-338448083",
    name: "Aldi Süd",
    kategorie: "Discounter",
    adresse: "Venloer Straße 377",
    plz: "50825",
    ort: "Köln",
    latitude: 50.950199,
    longitude: 6.916348,
    entfernung: 3.4,
    websiteUrl: "https://www.aldi-sued.de/filialen/l/koeln/venloer-strasse-377/b371",
    prospectUrl: "https://www.aldi-sued.de/de/angebote.html",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-242515981",
    name: "Netto City",
    kategorie: "Discounter",
    adresse: "Severinstraße 83",
    plz: "50678",
    ort: "Köln",
    latitude: 50.925526,
    longitude: 6.958147,
    entfernung: 1.5,
    websiteUrl: "https://www.netto-online.de/filialen/koeln/severinstr-83/6979",
    prospectUrl: "https://www.netto-online.de/angebote",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-232289350",
    name: "Netto Marken-Discount",
    kategorie: "Discounter",
    adresse: "Merheimer Straße 54",
    plz: "50733",
    ort: "Köln",
    latitude: 50.958592,
    longitude: 6.9498,
    entfernung: 2.3,
    websiteUrl: "https://www.netto-online.de/filialen/koeln/merheimer-str-54/6797",
    prospectUrl: "https://www.netto-online.de/angebote",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-266567766",
    name: "NORMA",
    kategorie: "Discounter",
    adresse: "Mülheim",
    plz: "51063",
    ort: "Köln",
    latitude: 50.968977,
    longitude: 6.97456,
    entfernung: 3.6,
    websiteUrl: "https://www.norma-online.de",
    prospectUrl: "https://www.norma-online.de/de/angebote",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-366964662",
    name: "PENNY",
    kategorie: "Discounter",
    adresse: "Zollstockgürtel 37",
    plz: "50969",
    ort: "Köln",
    latitude: 50.90559,
    longitude: 6.938672,
    entfernung: 4.0,
    websiteUrl: "https://www.penny.de/",
    prospectUrl: "https://www.penny.de/angebote",
    logoUrl: "",
    icon: "store",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  },
  {
    id: "osm:node-252043800",
    name: "Merzenich",
    kategorie: "Bäckerei",
    adresse: "Nippes",
    plz: "50733",
    ort: "Köln",
    latitude: 50.963525,
    longitude: 6.95415,
    entfernung: 2.9,
    websiteUrl: "https://www.merzenich.de",
    prospectUrl: "https://www.merzenich.de",
    logoUrl: "",
    icon: "bread",
    source: "OpenStreetMap/Overpass, Abruf 2026-07-06",
    isDefaultMarket: false,
    isUserAdded: false
  }
];

const marketBaseCatalog = [...defaultMarkets, ...externalMarketSeeds];

const storageKeys = {
  dataEpoch: "shopping-list-app.data-epoch",
  lists: "shopping-list-app.lists",
  activeList: "shopping-list-app.active-list",
  favorites: "shopping-list-app.favorites",
  shelfOrder: "shopping-list-app.shelf-order",
  background: "shopping-list-app.background",
  currentUser: "shopping-list-app.current-user",
  realtime: "shopping-list-app.mock-realtime",
  presence: "shopping-list-app.mock-presence",
  outbox: "shopping-list-app.sync-outbox",
  syncQueue: "shopping-list-app.sync-write-queue",
  markets: "shopping-list-app.markets",
  productPrices: "shopping-list-app.product-prices",
  priceSync: "shopping-list-app.price-sync"
};

function applyDataEpochReset() {
  const config = window.MART_SUPABASE_CONFIG ?? {};
  const targetEpoch = String(config.dataEpoch || "1");
  if (localStorage.getItem(storageKeys.dataEpoch) === targetEpoch) return false;

  const accountStoragePrefixes = [
    "shopping-list-app.items",
    storageKeys.lists,
    storageKeys.activeList,
    storageKeys.currentUser,
    "shopping-list-app.legacy-migration-complete",
    storageKeys.realtime,
    storageKeys.presence,
    storageKeys.outbox,
    storageKeys.syncQueue
  ];
  Object.keys(localStorage).forEach((key) => {
    if (accountStoragePrefixes.some((prefix) => key === prefix || key.startsWith(`${prefix}:`))) {
      localStorage.removeItem(key);
    }
  });

  try {
    const projectRef = new URL(config.url).hostname.split(".")[0];
    const authPrefix = projectRef ? `sb-${projectRef}-auth-token` : "";
    if (authPrefix) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(authPrefix)) localStorage.removeItem(key);
      });
    }
  } catch {
    // A missing project URL must not block the local reset.
  }

  localStorage.setItem(storageKeys.dataEpoch, targetEpoch);
  return true;
}

applyDataEpochReset();

const iconPaths = {
  leaf: '<path d="M5 21c8 0 14-6 14-14V3h-4C7 3 3 7 3 15c0 2 1 4 2 6Zm0 0c2-6 6-10 12-12"/>',
  apple: '<path d="M12 6c-2-3-5-2-6 1-3 0-4 3-3 7 1 5 4 7 7 5 1-1 3-1 4 0 3 2 6 0 7-5 1-4 0-7-3-7-2-3-5-4-6-1Zm0 0c1-2 2-3 4-3"/>',
  salad: '<path d="M4 11h16l-2 8H6l-2-8Zm2-3c2-2 4-2 6 0 2-2 4-2 6 0M8 14h8"/>',
  cheese: '<path d="M4 18h16V9L9 5 4 10v8Zm5-7h.01M14 14h.01M8 16h.01"/>',
  sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 12 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',
  home: '<path d="M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6"/>',
  milk: '<path d="M8 2h8v5l2 3v12H6V10l2-3V2Zm0 5h8M6 14h12"/>',
  cup: '<path d="M5 8h12v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Zm12 2h2a3 3 0 0 1 0 6h-2M8 3v2M12 3v2M16 3v2"/>',
  bottle: '<path d="M10 2h4v5l2 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10l2-3V2Zm-1 10h6"/>',
  glass: '<path d="M8 3h8l-1 9a3 3 0 0 1-6 0L8 3Zm4 12v6M9 21h6M9 8h6"/>',
  bread: '<path d="M5 12c0-4 3-7 7-7s7 3 7 7v7H5v-7Zm3-1h.01M12 9h.01M16 12h.01"/>',
  jar: '<path d="M9 2h6v4l2 3v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9l2-3V2Zm0 4h6M8 12h8"/>',
  steak: '<path d="M5 13c0-5 5-9 10-7 4 1 6 5 4 9-2 5-8 7-12 5-2-1-2-4-2-7Zm6 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"/>',
  fish: '<path d="M3 12s4-6 10-6 8 6 8 6-2 6-8 6-10-6-10-6Zm0 0 4 4m-4-4 4-4m10 4h.01"/>',
  clean: '<path d="M7 3h10l-1 7H8L7 3Zm1 7h8l2 11H6l2-11Zm1 5h6"/>',
  paw: '<path d="M8 10c-2 0-3 2-3 4m11-4c2 0 3 2 3 4M9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-7 6c3 0 5 2 5 5 0 2-2 3-5 3s-5-1-5-3c0-3 2-5 5-5Z"/>',
  pill: '<path d="M10 21 4 15a4 4 0 0 1 0-6l5-5a4 4 0 0 1 6 6l-5 5m-3-3 5 5m3-10 5 5"/>',
  spice: '<path d="M8 3h8v5H8V3Zm1 5h6l2 13H7L9 8Zm2 4h2m-3 4h4"/>',
  pencil: '<path d="m4 20 4-1 11-11a2 2 0 0 0-3-3L5 16l-1 4Zm11-14 3 3"/>',
  tomato: '<path d="M12 7c4 0 7 3 7 7 0 5-4 8-7 8s-7-3-7-8c0-4 3-7 7-7Zm0 0c-1-2 0-4 2-5m-2 5c1-2 3-2 5-1m-5 1c-2-2-4-2-5-1"/>',
  cucumber: '<path d="M5 15c3-6 8-10 14-10 2 5-1 11-7 15-3 2-7-1-7-5Zm5-1h.01m4-4h.01"/>',
  pepper: '<path d="M8 8c-3 4-1 12 4 12s7-8 4-12c-1-2-2-3-4-3s-3 1-4 3Zm4-3V2m-3 8h6"/>',
  onion: '<path d="M12 3s6 5 6 11a6 6 0 0 1-12 0c0-6 6-11 6-11Zm0 5v11m-3-6h6"/>',
  carrot: '<path d="M7 20 17 8l-4-4L5 18l2 2Zm10-12 3-5m-5 3 4-3m-3 5 5-1"/>',
  potato: '<path d="M6 14c0-5 3-9 8-8 5 1 7 5 5 10-2 4-7 6-11 4-2-1-2-3-2-6Zm5-2h.01m4 3h.01M13 8h.01"/>',
  broccoli: '<path d="M8 11a4 4 0 0 1 4-6 4 4 0 0 1 7 3 4 4 0 0 1-1 8H8a4 4 0 0 1 0-5Zm4 5v5m4-5v5M9 21h9"/>',
  corn: '<path d="M12 3c4 4 4 12 0 18-4-6-4-14 0-18Zm-4 6 4 3 4-3M8 14l4 3 4-3"/>',
  mushroom: '<path d="M4 11c1-5 5-8 8-8s7 3 8 8H4Zm5 0h6l1 9H8l1-9Zm1 4h4"/>',
  banana: '<path d="M6 5c1 8 6 13 14 13-4 4-15 1-16-13h2Zm1-2 2 2m12 12 1 2"/>',
  citrus: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0v18M5 12h14m-3-6L8 18M8 6l8 12"/>',
  berry: '<path d="M12 7c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7Zm0 0 2-4m-2 4-3-3m4 8h.01M10 15h.01M14 16h.01"/>',
  grapes: '<path d="M12 5c3 0 5 2 5 5 0 5-5 10-5 10S7 15 7 10c0-3 2-5 5-5Zm0 0 2-3M9 10h.01M12 13h.01M15 10h.01"/>',
  pear: '<path d="M12 5c3 3 6 6 6 11a6 6 0 0 1-12 0c0-5 3-8 6-11Zm0 0c0-2 1-3 3-4"/>',
  pineapple: '<path d="M12 8c4 3 5 9 0 14-5-5-4-11 0-14Zm-4-6 4 6 4-6m-7 5 3-4 3 4m-6 8h6m-5 4h4"/>',
  melon: '<path d="M4 12c6-6 14-6 18 2-6 6-16 6-18-2Zm4 0c3 2 7 2 11 0M8 15h.01m4 1h.01m4-1h.01"/>',
  avocado: '<path d="M12 3c5 4 7 10 4 15a5 5 0 0 1-8 0C5 13 7 7 12 3Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>',
  egg: '<path d="M12 3c4 4 6 8 6 12a6 6 0 0 1-12 0c0-4 2-8 6-12Z"/>',
  pasta: '<path d="M5 7c4 0 4 10 8 10s4-10 8-10M5 12c4 0 4 8 8 8s4-8 8-8M6 4h12"/>',
  rice: '<path d="M5 10h14l-2 10H7L5 10Zm3-4c2-2 6-2 8 0m-8 8h.01m4 2h.01m4-2h.01"/>',
  can: '<path d="M7 4c0-1 2-2 5-2s5 1 5 2v16c0 1-2 2-5 2s-5-1-5-2V4Zm0 0c0 1 2 2 5 2s5-1 5-2M7 12h10"/>',
  sausage: '<path d="M5 15c4-6 9-9 14-10 1 5-2 10-8 14-3 2-6 0-6-4Zm0 0-2 2m16-12 2-2"/>',
  shrimp: '<path d="M18 8c-5-4-12-1-12 5 0 5 7 7 11 2m-5-6h.01M6 13H3m13 2 3 3"/>',
  pizza: '<path d="M5 20 19 4c2 5 1 12-2 16H5Zm6-6h.01m4-3h.01m-3 6h.01"/>',
  fries: '<path d="M7 10h10l-1 11H8L7 10Zm2-1V4m4 5V3m4 6V5M6 14h12"/>',
  icecream: '<path d="M12 14 8 5a4 4 0 0 1 8 0l-4 9Zm0 0 4 7H8l4-7Z"/>',
  chocolate: '<path d="M5 5h14v16H5V5Zm0 5h14M5 15h14M10 5v16M15 5v16"/>',
  chips: '<path d="M7 3h10l2 19H5L7 3Zm2 5h6m-5 5h4m-2 3h.01"/>',
  toothbrush: '<path d="M4 20 18 6m-2-2 4 4m-9 5 4 4M5 19l3 3"/>',
  soap: '<path d="M6 12c0-3 3-5 6-5s6 2 6 5-3 5-6 5-6-2-6-5Zm3-7h.01M15 3h.01M18 7h.01"/>',
  razor: '<path d="M5 5h14v4H5V5Zm7 4v12m-4-2h8"/>',
  toilet: '<path d="M7 4h10v8a5 5 0 0 1-10 0V4Zm3 16h4m-6-8h8"/>',
  tissue: '<path d="M5 9h14v12H5V9Zm3 0c1-4 7-4 8 0M8 14h8"/>',
  battery: '<path d="M7 7h10v12H7V7Zm3-3h4v3m-4 6h4"/>',
  candle: '<path d="M9 10h6v12H9V10Zm3-7s3 3 0 6c-3-3 0-6 0-6Z"/>',
  cleaner: '<path d="M10 2h4v5l3 4v10H7V11l3-4V2Zm-1 11h6m-3-8h2"/>',
  radish: '<path d="M12 8c4 1 6 4 5 8-1 3-4 5-7 3-3-1-4-5-2-8 1-2 2-3 4-3Zm0 0c-1-2 0-4 2-5m-2 5c-2-1-4-1-6 1m6-1c2-1 4-1 6 0"/>',
  celery: '<path d="M8 21c1-6 1-11-2-17m6 17c0-7 0-12 0-18m4 18c-1-6-1-11 2-17M7 8c3 1 6 1 10 0M7 14c3 1 6 1 10 0"/>',
  eggplant: '<path d="M16 7c4 4 2 11-3 14-5-3-7-10-3-14 2-2 4-2 6 0Zm0 0c1-2 3-2 4-1m-4 1c0-2-1-3-3-4"/>',
  ginger: '<path d="M5 15c1-4 5-7 9-6 3 1 5 4 4 7-2 4-7 6-11 4-2-1-3-2-2-5Zm4-4c-1-2 1-4 3-4m4 4c1-2 3-2 4-1M10 16h.01m4-2h.01"/>',
  asparagus: '<path d="M8 21V9c0-2 1-4 4-6 3 2 4 4 4 6v12M8 10h8M10 6h4M12 3v18"/>',
  fennel: '<path d="M8 20c0-4 2-7 4-9 2 2 4 5 4 9H8Zm4-9V3m0 0L8 7m4-4 4 4M6 10c2 0 4 1 6 3 2-2 4-3 6-3"/>',
  stonefruit: '<path d="M12 5c4 0 7 3 7 8s-3 8-7 8-7-3-7-8 3-8 7-8Zm0 0c0-2 1-3 3-4m-3 7v10"/>',
  olive: '<path d="M6 13c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Zm8-6c2-1 4-1 6 1m-9 5h.01"/>',
  yogurt: '<path d="M7 5h10l-1 16H8L7 5Zm1-3h8v3H8V2Zm1 9h6"/>',
  butter: '<path d="M5 10h14v9H5v-9Zm3-4h8l3 4H5l3-4Zm2 8h4"/>',
  honey: '<path d="M9 3h6v4l2 3v10H7V10l2-3V3Zm0 4h6M8 13h8m-6 4h4"/>',
  cookie: '<path d="M12 4a8 8 0 1 0 8 8c-3 1-6-1-6-4-2 0-3-2-2-4Zm-3 8h.01m4 4h.01m-5 3h.01"/>',
  nuts: '<path d="M8 12c-2-3-1-6 2-8 4 1 6 5 4 9-2 3-5 4-6 1v-2Zm8 1c3 1 5 3 4 6-3 2-7 1-8-2-1-2 1-4 4-4Z"/>',
  candy: '<path d="M8 10c2-2 6-2 8 0v4c-2 2-6 2-8 0v-4Zm0 0L3 8l2 4-2 4 5-2m8-4 5-2-2 4 2 4-5-2"/>',
  bar: '<path d="M5 9h14v10H5V9Zm2-4h10l2 4H5l2-4Zm2 8h6"/>',
  sponge: '<path d="M5 8h14v10H5V8Zm2 3h.01M11 11h.01M15 11h.01M9 15h.01M14 15h.01"/>',
  roll: '<path d="M6 6h9a4 4 0 0 1 0 8H6V6Zm0 0c-2 0-3 2-3 4s1 4 3 4m9-4h6m-6 4h6"/>',
  trashbag: '<path d="M7 8c1-3 3-5 5-5s4 2 5 5l1 13H6L7 8Zm2 0h6m-3-4c-1 2-2 3-4 4m4-4c1 2 2 3 4 4"/>',
  bandage: '<path d="m4 15 11-11a4 4 0 0 1 6 6L10 21a4 4 0 0 1-6-6Zm6-6 5 5m-4-2h.01m3-3h.01"/>',
  thermometer: '<path d="M10 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Zm3-9v11m-2 0h4"/>',
  diaper: '<path d="M5 7h14v7c0 4-3 7-7 7s-7-3-7-7V7Zm0 0c2 2 4 3 7 3s5-1 7-3M8 14h.01M16 14h.01"/>',
  warning: '<path d="M12 3 2 21h20L12 3Zm0 6v5m0 4h.01"/>',
  phone: '<path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 3h4m-3 14h2"/>',
  copy: '<path d="M9 9h11v11H9V9Zm-5 6H3V4h11v1"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1m3 6a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  note: '<path d="M7 3h8l4 4v14H7V3Zm8 0v5h4M10 12h6M10 16h5"/>',
  cart: '<path d="M3 4h2l2 12h10l3-8H6M9 20h.01M17 20h.01"/>',
  store: '<path d="M4 10h16l-1-5H5l-1 5Zm1 0v10h14V10M8 20v-6h8v6M4 10c0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0"/>',
  mapPin: '<path d="M12 21s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>',
  external: '<path d="M14 4h6v6m0-6-9 9M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/>',
  tag: '<path d="M20 12 12 20 4 12V4h8l8 8Zm-12-4h.01"/>',
  refresh: '<path d="M20 12a8 8 0 0 1-14 5M4 12a8 8 0 0 1 14-5M18 3v4h-4M6 21v-4h4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
  logout: '<path d="M10 5H5v14h5m4-4 4-3-4-3m4 3H9"/>',
  database: '<path d="M4 6c0-2 4-3 8-3s8 1 8 3-4 3-8 3-8-1-8-3Zm0 0v6c0 2 4 3 8 3s8-1 8-3V6M4 12v6c0 2 4 3 8 3s8-1 8-3v-6"/>'
};

const sketchRules = [
  [["tomat", "ketchup"], "tomato"], [["gurk", "zucchini"], "cucumber"], [["paprika", "chili"], "pepper"], [["zwiebel", "knoblauch", "lauch"], "onion"],
  [["karotte"], "carrot"], [["kartoffel", "süßkartoffel", "kartoffelpüree"], "potato"], [["brokkoli", "blumenkohl", "kohl", "rosenkohl"], "broccoli"],
  [["sellerie"], "celery"], [["aubergine"], "eggplant"], [["ingwer"], "ginger"], [["spargel"], "asparagus"], [["fenchel"], "fennel"],
  [["spinat", "salat", "rucola", "kraut"], "salad"], [["mais"], "corn"], [["champignon"], "mushroom"], [["radies"], "radish"], [["apfel"], "apple"], [["banan"], "banana"],
  [["orange", "zitrone", "limette", "mandarine", "grapefruit", "kiwi"], "citrus"],
  [["erdbe", "heidelbe", "himbe", "kirsche", "beeren", "granatapfel"], "berry"], [["traube"], "grapes"], [["birne"], "pear"], [["mango", "pfirsich", "pflaume", "nektarine", "aprikose"], "stonefruit"], [["ananas"], "pineapple"],
  [["melone"], "melon"], [["avocado", "guacamole"], "avocado"], [["eier", "eiersalat"], "egg"], [["käse", "gouda", "edamer", "mozzarella", "parmesan", "camembert", "brie", "feta", "cheddar", "mascarpone", "obazda"], "cheese"],
  [["brot", "brötchen", "baguette", "toast", "croissant", "brezel", "muffin", "wrap", "tortilla", "zwieback", "bagel"], "bread"],
  [["milch", "sahne", "kefir", "buttermilch", "milchreis"], "milk"], [["joghurt", "quark", "skyr", "pudding", "dessert", "schmand"], "yogurt"], [["butter", "margarine", "kräuterbutter"], "butter"],
  [["kaffee", "espresso", "filter"], "cup"], [["tee", "kakao"], "cup"], [["müsli", "cornflakes", "haferflocken", "chia", "nüsse", "studentenfutter"], "jar"],
  [["honig", "marmelade", "erdnussbutter", "ahornsirup", "agavendicksaft"], "honey"],
  [["spaghetti", "penne", "fusilli", "nudel", "ravioli"], "pasta"], [["reis", "couscous", "bulgur"], "rice"], [["dose", "bohnen", "erbsen", "linsen", "kichererbsen", "suppe", "tomatenmark", "sauerkraut"], "can"],
  [["fleisch", "steak", "hack", "filet", "gyros", "frikadelle"], "steak"], [["wurst", "salami", "schinken", "bacon", "mortadella", "aufschnitt"], "sausage"],
  [["lachs", "thunfisch", "forelle", "matjes", "fisch"], "fish"], [["garnele", "krabbe", "calamari"], "shrimp"],
  [["pizza", "lasagne"], "pizza"], [["pommes", "kroketten"], "fries"], [["eiscreme"], "icecream"], [["schokolade", "praline", "nutella"], "chocolate"], [["chips", "salzstangen", "cracker"], "chips"],
  [["keks"], "cookie"], [["popcorn"], "chips"], [["gummibärchen", "bonbons", "kaugummi"], "candy"], [["riegel"], "bar"],
  [["wasser", "cola", "limonade", "eistee", "saft", "drink", "spezi", "tonic", "ginger", "smoothie", "eiskaffee", "bier", "wein", "sekt", "vodka", "gin", "rum", "whiskey", "likör", "aperol", "cider"], "bottle"],
  [["olive", "antipasti"], "olive"], [["hummus", "tzatziki", "creme", "mayonnaise", "remoulade", "senf", "pesto", "meerrettich"], "jar"],
  [["shampoo", "conditioner", "duschgel", "seife", "deo", "creme", "sonnencreme", "haarfarbe"], "soap"], [["zahn", "mundspülung"], "toothbrush"], [["rasierer", "rasierschaum"], "razor"], [["toilettenpapier"], "toilet"], [["taschentücher", "feuchttücher", "watte", "damenhygiene"], "tissue"],
  [["reiniger", "kalk", "schimmel", "spülmittel", "waschmittel", "weichspüler", "entkalker", "wc-stein"], "cleaner"], [["schwamm"], "sponge"], [["rolle", "folie", "backpapier"], "roll"], [["müllbeutel"], "trashbag"], [["batterie"], "battery"], [["kerze", "feuerzeug"], "candle"],
  [["hundefutter", "katzenfutter", "leckerlis", "streu", "vogelfutter", "tier", "heu"], "paw"], [["pflaster", "tabletten", "vitamine", "magnesium", "nasenspray", "hustensaft", "thermometer", "desinfektion", "kondome"], "pill"],
  [["pflaster"], "bandage"], [["thermometer"], "thermometer"],
  [["salz", "pfeffer", "paprika", "curry", "zimt"], "spice"], [["mehl", "backpulver", "vanille", "hefe"], "bread"], [["öl", "essig", "sauce", "tabasco", "balsamico"], "bottle"],
  [["windel"], "diaper"], [["baby", "schnuller"], "milk"], [["stifte", "brief", "papier", "kleber", "klebeband"], "pencil"]
];

const productIconPalettes = {
  tomato: ["#f0442e", "#ff9a1f", "#1fb65b", "#7c1c14"],
  cucumber: ["#34bf59", "#a7f05a", "#18874c", "#134f32"],
  pepper: ["#f0442e", "#ffcc24", "#29b84d", "#7c1c14"],
  onion: ["#d7a7ff", "#ffe0a8", "#7c58b8", "#5c3d75"],
  carrot: ["#ff7a1f", "#ffd21f", "#32ad4e", "#8b3b12"],
  potato: ["#c58b48", "#ffe0a3", "#8c6330", "#6d3f1f"],
  broccoli: ["#32b85b", "#99e34f", "#177747", "#0e5132"],
  celery: ["#6ccd52", "#d6f15c", "#2e8a43", "#236231"],
  eggplant: ["#6d43c7", "#ff7fb4", "#35a857", "#3c286f"],
  corn: ["#ffd233", "#ff8f1f", "#3bb44a", "#8b6a08"],
  mushroom: ["#d9b48f", "#fff0c4", "#8d5b39", "#5a3824"],
  radish: ["#f04375", "#ffffff", "#6ecf46", "#8a1639"],
  ginger: ["#d89a45", "#ffe08a", "#a56228", "#704018"],
  asparagus: ["#3cab5e", "#e0ef66", "#1f7d41", "#15542e"],
  fennel: ["#9bd861", "#f4ffbf", "#43a35c", "#285d37"],
  apple: ["#e94334", "#ffb22a", "#35a857", "#7c1c14"],
  banana: ["#ffd52d", "#ff9b2f", "#8f6b14", "#76510c"],
  citrus: ["#ff9b24", "#ffe534", "#44b94f", "#9d4b10"],
  berry: ["#e9325c", "#ff9ec1", "#7a2fbc", "#76162e"],
  grapes: ["#8d55d6", "#ff7fb4", "#56c74f", "#4b2b7f"],
  pear: ["#9ed44a", "#ffe76d", "#38a54f", "#566d18"],
  pineapple: ["#ffd32a", "#ff7d22", "#36b45c", "#7d5f0c"],
  melon: ["#ff6f6a", "#b5ef56", "#40b35b", "#8a2732"],
  avocado: ["#74b947", "#ffe485", "#2d7a43", "#31521f"],
  stonefruit: ["#ff8a3d", "#ffd66a", "#f04d76", "#91421f"],
  olive: ["#6f9a37", "#d4e86a", "#3b6824", "#314315"],
  salad: ["#40bb62", "#f4ef71", "#22a2a0", "#1f663a"],
  cheese: ["#ffd449", "#ff8b1f", "#f04d34", "#8d5c0c"],
  milk: ["#6ab7ff", "#ffffff", "#245db3", "#1b4775"],
  yogurt: ["#80c8ff", "#ffe2f1", "#ff6e9d", "#315f8a"],
  butter: ["#ffd95a", "#fff1a8", "#d98b1b", "#8b5c10"],
  bread: ["#d59044", "#ffe0a0", "#8b4f20", "#6b3514"],
  cup: ["#8b5a35", "#ffcf7a", "#2e7bd8", "#49301f"],
  jar: ["#35a8d8", "#fff3a1", "#ff7d39", "#245f7c"],
  honey: ["#ffbc24", "#fff064", "#a46416", "#70410e"],
  pasta: ["#ffd66a", "#ff9d30", "#d36a20", "#7e3d12"],
  rice: ["#f7f2df", "#8ed5ff", "#d7b75f", "#6d5b34"],
  can: ["#67c9e8", "#ff6d54", "#2d73b7", "#274a67"],
  steak: ["#d94a47", "#ff9d69", "#7b211f", "#5b1413"],
  sausage: ["#d84d40", "#ffb14f", "#7d281e", "#5d1b15"],
  fish: ["#48b5e5", "#b6efff", "#236aa7", "#17496f"],
  shrimp: ["#ff7b54", "#ffd08f", "#db3d3d", "#8a2c22"],
  pizza: ["#ffbf37", "#e94b36", "#4caf42", "#8a3f14"],
  fries: ["#ffd63d", "#ff8e24", "#d1452e", "#8a5b0b"],
  icecream: ["#ff8ac2", "#fff0a6", "#6ec7ff", "#7d3d66"],
  chocolate: ["#7a4328", "#ffcf7a", "#d94b3c", "#4f2a18"],
  chips: ["#ffd044", "#ff7a2b", "#d9462c", "#815b0c"],
  cookie: ["#c98a42", "#ffe0a3", "#6b3e24", "#5f351d"],
  nuts: ["#b9783a", "#f4cc6c", "#7c4a22", "#4f2f19"],
  candy: ["#ff4f8b", "#52d4ff", "#ffd641", "#8c1f48"],
  bar: ["#6b3a24", "#ffcf55", "#df553f", "#422315"],
  bottle: ["#2f86df", "#69d6ff", "#ff8d28", "#164d83"],
  glass: ["#79d6ff", "#ffd84a", "#8d67d6", "#285d7a"],
  soap: ["#ff81b3", "#90e7ff", "#7b57d0", "#85405d"],
  toothbrush: ["#39b8e5", "#ff7aa8", "#ffffff", "#1d6283"],
  razor: ["#bfc6cc", "#ff8f35", "#555b63", "#31363b"],
  toilet: ["#ffffff", "#9ad9ff", "#6a7782", "#343c44"],
  tissue: ["#ffffff", "#8bcfff", "#d7a2ff", "#596776"],
  cleaner: ["#36b8e8", "#ffdf40", "#1f7bb2", "#195170"],
  clean: ["#68c7e8", "#f0f0f0", "#6f7b86", "#37424b"],
  sponge: ["#ffd33f", "#69d66d", "#db7226", "#7f5b13"],
  roll: ["#ffffff", "#c7d4df", "#ff9345", "#5c6670"],
  trashbag: ["#45494d", "#8b9298", "#1f2328", "#141719"],
  battery: ["#36b858", "#ffd53b", "#2d343b", "#172016"],
  candle: ["#fff2aa", "#ff8d27", "#d64935", "#7a3d12"],
  paw: ["#bf7a3e", "#ffd27b", "#6e4529", "#4a2d1c"],
  pill: ["#ff5f78", "#ffffff", "#45b9ff", "#80303d"],
  bandage: ["#f0bd84", "#fff0d0", "#dc664c", "#835235"],
  thermometer: ["#ffffff", "#ff4a57", "#52b8ff", "#7d2e36"],
  spice: ["#d9462e", "#ffd44a", "#7f4128", "#59301e"],
  egg: ["#fff1c7", "#ffbf4a", "#d8a25c", "#7b5c34"],
  diaper: ["#ffffff", "#7fd6ff", "#ff9ed1", "#596c7a"],
  pencil: ["#ffd24d", "#ff8740", "#2c7bd3", "#815615"],
  sparkle: ["#ffe55b", "#ff70ad", "#5cc7ff", "#8a6d0c"],
  cart: ["#2d2d2d", "#e7e1d2", "#8e8a80", "#1b1a18"]
};

const productMarkerShapes = [
  "M8 18c12-8 31-9 47-2l-5 35c-14 8-32 7-43-3Z",
  "M11 12c16 1 31 4 44 13L48 55c-17 2-31-1-43-10Z",
  "M7 28c8-14 26-20 47-17l3 28c-12 10-31 14-48 8Z",
  "M13 10c14 7 29 8 42 4l-3 36c-13 6-28 5-43 0Z"
];

const productHighlightPaths = [
  "M22 20c5-4 13-5 20-3",
  "M18 25c7-5 16-6 26-4",
  "M21 18c4-3 10-4 17-3",
  "M25 23c5-3 11-4 17-2"
];

const productHatchPaths = [
  "M35 42l7-5m-3 10 8-6m-16 2 7-5",
  "M20 43l8-6m-4 10 9-7m9-1 6-5",
  "M38 34l8-5m-5 10 8-6m-18 8 8-6",
  "M18 35l6-4m-2 9 8-6m13 6 7-5"
];

const collaborationRoles = Object.freeze({
  owner: "owner",
  editor: "editor",
  viewer: "viewer"
});

const roleLabels = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer"
};

const defaultListPermissions = {
  owner: ["invite", "remove", "add", "edit", "check", "delete", "view"],
  editor: ["add", "edit", "check", "delete", "view"],
  viewer: ["view"]
};

class MockRealtimeService {
  constructor({ channelName, storageKey, presenceKey, outboxKey }) {
    this.channelName = channelName;
    this.storageKey = storageKey;
    this.presenceKey = presenceKey;
    this.outboxKey = outboxKey;
    this.clientId = `client:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    this.listeners = new Set();
    this.channel = null;

    if ("BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(channelName);
      this.channel.addEventListener("message", (event) => this.handleMessage(event.data));
    }

    window.addEventListener("storage", (event) => {
      if (event.key !== this.storageKey && event.key !== this.presenceKey) return;
      try {
        this.handleMessage(JSON.parse(event.newValue));
      } catch {
        // Broken external storage writes should not affect the app.
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(message) {
    this.listeners.forEach((listener) => listener(message));
  }

  handleMessage(message) {
    if (!message || message.sourceId === this.clientId) return;
    if (message.type !== "lists" && message.type !== "presence") return;
    this.notify(message);
  }

  async publishLists(nextLists) {
    const message = {
      type: "lists",
      sourceId: this.clientId,
      sentAt: isoNow(),
      lists: nextLists.map(exportCollaborativeList)
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(message));
      this.channel?.postMessage(message);
    } catch {
      this.queueOffline({ type: "lists", createdAt: isoNow(), lists: message.lists });
      return { ok: false, offline: true };
    }
    return { ok: true, local: true };
  }

  async fetchSharedLists() {
    return [];
  }

  async leaveSharedList(listData) {
    await this.publishLists([listData]);
    return exportCollaborativeList(listData);
  }

  heartbeat(listData, user) {
    const members = this.presenceFor(listData.id);
    const now = isoNow();
    const nextMembers = members
      .filter((member) => member.userId !== user.userId)
      .filter((member) => Date.parse(member.lastSeenAt ?? member.joinedAt ?? 0) > Date.now() - 120000);
    nextMembers.push({
      userId: user.userId,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: memberRole(listData, user.userId),
      joinedAt: memberFor(listData, user.userId)?.joinedAt ?? now,
      lastSeenAt: now
    });
    const message = {
      type: "presence",
      sourceId: this.clientId,
      sentAt: now,
      listId: listData.id,
      members: nextMembers
    };
    try {
      const allPresence = load(this.presenceKey, {});
      allPresence[listData.id] = nextMembers;
      localStorage.setItem(this.presenceKey, JSON.stringify(allPresence));
      this.channel?.postMessage(message);
    } catch {
      this.queueOffline({ type: "presence", createdAt: now, listId: listData.id, userId: user.userId });
    }
    return nextMembers;
  }

  presenceFor(listId) {
    const allPresence = load(this.presenceKey, {});
    const members = Array.isArray(allPresence[listId]) ? allPresence[listId] : [];
    return members.filter((member) => Date.parse(member.lastSeenAt ?? member.joinedAt ?? 0) > Date.now() - 120000);
  }

  queueOffline(operation) {
    const outbox = load(this.outboxKey, []);
    outbox.push(operation);
    try {
      localStorage.setItem(this.outboxKey, JSON.stringify(outbox.slice(-50)));
    } catch {
      // Offline sync is best-effort in the mock adapter.
    }
  }
}

class SupabaseRealtimeService {
  constructor({ config, fallback }) {
    this.config = config ?? {};
    this.fallback = fallback;
    this.listeners = new Set();
    this.listChannel = null;
    this.presenceChannels = new Map();
    this.clientId = fallback.clientId;
    this.listTable = this.config.listsTable || "shopping_lists";
    this.memberTable = this.config.membersTable || "list_members";
    this.itemTable = this.config.itemsTable || "list_items";
    this.url = this.config.url || this.config.projectUrl || "";
    this.publishableKey = this.config.publishableKey || this.config.anonKey || "";
    this.authUserId = "";
    this.profileSignature = "";
    this.profileSyncedAt = 0;
    this.profileSyncPromise = null;
    this.profileSyncSignature = "";
    this.writeQueue = Promise.resolve();
    this.client = this.createClient();
  }

  createClient() {
    if (!this.config.enabled || !this.url || !this.publishableKey || !window.supabase?.createClient) {
      return null;
    }
    try {
      return window.supabase.createClient(this.url, this.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        },
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch {
      return null;
    }
  }

  async initializeUser() {
    if (!this.client) return null;
    try {
      const { data: sessionData, error: sessionError } = await this.client.auth.getSession();
      if (sessionError) throw sessionError;
      let authUser = sessionData?.session?.user ?? null;
      if (authUser && !isDeviceAuthUser(authUser)) {
        await this.client.auth.signOut({ scope: "local" });
        authUser = null;
      }
      if (!authUser) {
        const { data: anonymousData, error: anonymousError } = await this.client.auth.signInAnonymously({
          options: {
            data: {
              deviceLabel: defaultDeviceLabel(),
              devicePlatform: devicePlatform()
            }
          }
        });
        if (anonymousError) throw anonymousError;
        authUser = anonymousData?.user ?? null;
      }
      this.authUserId = authUser?.id ?? "";
      return authUser;
    } catch (error) {
      this.queueOffline({ type: "auth", createdAt: isoNow(), error: error?.message ?? "Supabase Auth nicht erreichbar" });
      throw error;
    }
  }

  async ensureAuthenticated() {
    if (!this.client) return null;
    try {
      const { data: sessionData } = await this.client.auth.getSession();
      const authUser = sessionData?.session?.user ?? null;
      if (!isDeviceAuthUser(authUser)) return null;
      this.authUserId = authUser?.id ?? "";
      return authUser;
    } catch (error) {
      this.queueOffline({ type: "auth", createdAt: isoNow(), error: error?.message ?? "Supabase Auth nicht erreichbar" });
      return null;
    }
  }

  async bootstrapAccount(label = defaultDeviceLabel(), platform = devicePlatform()) {
    if (!this.client) return null;
    const authUser = await this.ensureAuthenticated();
    if (!authUser) return null;
    const { data, error } = await this.client.rpc("bootstrap_account", {
      device_label: label,
      device_platform: platform
    });
    if (error) throw error;
    return data;
  }

  onAuthStateChange(listener) {
    if (!this.client) return () => {};
    const { data } = this.client.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => listener(event, session?.user ?? null), 0);
    });
    return () => data?.subscription?.unsubscribe?.();
  }

  async signOut() {
    if (!this.client) return { ok: true };
    const { error } = await this.client.auth.signOut({ scope: "local" });
    this.authUserId = "";
    this.profileSignature = "";
    this.profileSyncedAt = 0;
    this.profileSyncPromise = null;
    this.profileSyncSignature = "";
    if (this.listChannel) {
      this.client.removeChannel?.(this.listChannel);
      this.listChannel = null;
    }
    this.presenceChannels.forEach((channel) => this.client.removeChannel?.(channel));
    this.presenceChannels.clear();
    return error ? { ok: false, error: error.message } : { ok: true };
  }

  subscribe(listener) {
    const unsubscribeFallback = this.client ? null : this.fallback.subscribe(listener);
    this.listeners.add(listener);
    this.openListChannel();
    return () => {
      unsubscribeFallback?.();
      this.listeners.delete(listener);
    };
  }

  notify(message) {
    this.listeners.forEach((listener) => listener(message));
  }

  openListChannel() {
    if (!this.client || this.listChannel) return;
    const notifyRemoteChange = (payload) => {
      const row = payload.new ?? payload.old ?? {};
      this.notify({
        type: "remote-changed",
        sourceId: "supabase",
        sentAt: isoNow(),
        listId: row.list_id ?? row.id ?? ""
      });
    };
    const channel = this.client
      .channel("mart-collaboration-tables")
      .on("postgres_changes", { event: "*", schema: "public", table: this.listTable }, notifyRemoteChange)
      .on("postgres_changes", { event: "*", schema: "public", table: this.memberTable }, notifyRemoteChange)
      .on("postgres_changes", { event: "*", schema: "public", table: this.itemTable }, notifyRemoteChange)
      .subscribe((status, error) => {
        this.notify({
          type: "sync-status",
          sourceId: "supabase",
          sentAt: isoNow(),
          status,
          error: error?.message ?? error?.name ?? ""
        });
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          const failedChannel = this.listChannel;
          this.listChannel = null;
          if (failedChannel) this.client.removeChannel?.(failedChannel);
          window.setTimeout(() => this.openListChannel(), 3500);
        }
      });
    this.listChannel = channel;
  }

  userIdValue(value) {
    return isUuid(value) ? value : null;
  }

  async upsertProfile(user) {
    if (!this.client) return { ok: false, offline: true };
    const authUser = await this.ensureAuthenticated();
    if (!authUser?.id) return { ok: false, error: "Keine Nutzerkennung" };
    const displayName = cleanDisplayName(user.displayName, "Gast");
    const avatarUrl = typeof user.avatarUrl === "string" ? user.avatarUrl : "";
    const signature = JSON.stringify([user.userId, displayName, avatarUrl]);
    if (signature === this.profileSignature && Date.now() - this.profileSyncedAt < 60000) {
      return { ok: true, userId: user.userId, cached: true };
    }
    if (signature === this.profileSyncSignature && this.profileSyncPromise) {
      return this.profileSyncPromise;
    }
    const request = (async () => {
      const { data, error } = await this.client.rpc("update_account_profile", {
        display_name: displayName,
        avatar_url: avatarUrl
      });
      if (error) return { ok: false, error: error.message, rawError: error };
      this.profileSignature = signature;
      this.profileSyncedAt = Date.now();
      return { ok: true, userId: user.userId, account: data };
    })();
    this.profileSyncSignature = signature;
    this.profileSyncPromise = request;
    try {
      return await request;
    } finally {
      if (this.profileSyncPromise === request) {
        this.profileSyncPromise = null;
        this.profileSyncSignature = "";
      }
    }
  }

  async touchDevice(label = null, platform = null) {
    if (!this.client || !(await this.ensureAuthenticated())) return { ok: false, offline: true };
    const { data, error } = await this.client.rpc("touch_current_device", {
      device_label: label,
      device_platform: platform
    });
    return error ? { ok: false, error: error.message } : (data ?? { ok: true });
  }

  async listDevices() {
    if (!this.client || !await this.ensureAuthenticated()) return [];
    const { data, error } = await this.client.rpc("list_account_devices");
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  async renameDevice(deviceId, label) {
    const { data, error } = await this.client.rpc("rename_account_device", {
      target_device_id: deviceId,
      device_label: label
    });
    return error ? { ok: false, error: error.message } : data;
  }

  async removeDevice(deviceId) {
    const { data, error } = await this.client.rpc("remove_account_device", {
      target_device_id: deviceId
    });
    return error ? { ok: false, error: error.message } : data;
  }

  async rotateRecoveryCode() {
    const { data, error } = await this.client.rpc("rotate_recovery_code");
    return error ? { ok: false, error: error.message } : { ok: true, ...data };
  }

  async recoverAccount(code, label = defaultDeviceLabel(), platform = devicePlatform()) {
    const { data, error } = await this.client.rpc("recover_account", {
      recovery_code: code,
      device_label: label,
      device_platform: platform
    });
    return error ? { ok: false, error: error.message } : data;
  }

  async createDevicePairing() {
    const { data, error } = await this.client.rpc("create_device_pairing");
    return error ? { ok: false, error: error.message } : data;
  }

  async requestDevicePairing(pairingId, token, label = defaultDeviceLabel(), platform = devicePlatform()) {
    const { data, error } = await this.client.rpc("request_device_pairing", {
      target_pairing_id: pairingId,
      pairing_token: token,
      device_label: label,
      device_platform: platform
    });
    return error ? { ok: false, error: error.message } : data;
  }

  async devicePairingStatus(pairingId) {
    const { data, error } = await this.client.rpc("get_device_pairing_status", {
      target_pairing_id: pairingId
    });
    return error ? { ok: false, error: error.message } : data;
  }

  async approveDevicePairing(pairingId) {
    const { data, error } = await this.client.rpc("approve_device_pairing", {
      target_pairing_id: pairingId
    });
    return error ? { ok: false, error: error.message } : data;
  }

  async cancelDevicePairing(pairingId) {
    const { data, error } = await this.client.rpc("cancel_device_pairing", {
      target_pairing_id: pairingId
    });
    return error ? { ok: false, error: error.message } : data;
  }

  listRowFromList(listData) {
    const payload = exportCollaborativeList(listData);
    return {
      id: payload.listId,
      name: payload.listName,
      owner_user_id: this.userIdValue(payload.ownerId),
      invite_code: payload.inviteCode,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
      updated_by_user_id: this.userIdValue(payload.updatedByUserId),
      deleted_at: payload.deletedAt || null,
      deleted_by_user_id: this.userIdValue(payload.deletedByUserId),
      revision: Number(payload.revision || 0)
    };
  }

  memberRowsFromList(listData) {
    const normalized = normalizeListData(listData);
    const rowsByUser = new Map();
    normalized.members.forEach((member) => {
      if (!this.userIdValue(member.userId)) return;
      rowsByUser.set(member.userId, {
        list_id: normalized.id,
        user_id: member.userId,
        display_name: cleanDisplayName(member.displayName, "Gast"),
        avatar_url: typeof member.avatarUrl === "string" ? member.avatarUrl : "",
        role: normalizeRole(member.role),
        invited_by_user_id: this.userIdValue(normalized.ownerId),
        joined_at: safeDate(member.joinedAt, normalized.createdAt),
        removed_at: null,
        removed_by_user_id: null
      });
    });
    normalized.removedMembers.forEach((entry) => {
      if (!this.userIdValue(entry.userId)) return;
      const existing = rowsByUser.get(entry.userId);
      rowsByUser.set(entry.userId, {
        list_id: normalized.id,
        user_id: entry.userId,
        display_name: existing?.display_name ?? "Gast",
        avatar_url: existing?.avatar_url ?? "",
        role: existing?.role ?? collaborationRoles.editor,
        invited_by_user_id: existing?.invited_by_user_id ?? this.userIdValue(normalized.ownerId),
        joined_at: existing?.joined_at ?? normalized.createdAt,
        removed_at: safeDate(entry.removedAt, normalized.updatedAt),
        removed_by_user_id: this.userIdValue(entry.removedByUserId)
      });
    });
    return Array.from(rowsByUser.values());
  }

  itemRowsFromList(listData) {
    const normalized = normalizeListData(listData);
    const rowsByItem = new Map();
    normalized.items.forEach((item) => {
      rowsByItem.set(item.id, {
        list_id: normalized.id,
        item_id: item.id,
        product_id: item.id.startsWith("manual:") ? null : item.id,
        name: item.name,
        shelf_id: item.shelfId,
        shelf_title: item.shelfTitle,
        shelf_icon: item.shelfIcon ?? "",
        quantity: item.quantity,
        done: item.done,
        note: item.note ?? "",
        added_by_user_id: this.userIdValue(item.addedByUserId),
        added_by_display_name: cleanDisplayName(item.addedByDisplayName, "Gast"),
        added_by_avatar_url: typeof item.addedByAvatarUrl === "string" ? item.addedByAvatarUrl : "",
        checked_by_user_id: this.userIdValue(item.checkedByUserId),
        checked_at: item.checkedAt || null,
        updated_by_user_id: this.userIdValue(item.updatedByUserId),
        updated_at: item.updatedAt,
        deleted_at: null,
        deleted_by_user_id: null,
        revision: Number(item.revision || 0)
      });
    });
    normalized.deletedItems.forEach((entry) => {
      if (!entry?.id) return;
      const existing = rowsByItem.get(entry.id);
      rowsByItem.set(entry.id, {
        ...(existing ?? {
          list_id: normalized.id,
          item_id: entry.id,
          product_id: null,
          name: "",
          shelf_id: "",
          shelf_title: "",
          shelf_icon: "",
          quantity: 1,
          done: false,
          note: "",
          added_by_user_id: null,
          added_by_display_name: "Gast",
          added_by_avatar_url: "",
          checked_by_user_id: null,
          checked_at: null,
          updated_by_user_id: null,
          updated_at: safeDate(entry.deletedAt, normalized.updatedAt),
          revision: 0
        }),
        deleted_at: safeDate(entry.deletedAt, normalized.updatedAt),
        deleted_by_user_id: this.userIdValue(entry.deletedByUserId)
      });
    });
    return Array.from(rowsByItem.values());
  }

  listFromRelationalRows(listRow, memberRows, itemRows) {
    const members = memberRows
      .filter((row) => row.list_id === listRow.id && !row.removed_at)
      .map((row) => ({
        userId: row.user_id,
        displayName: cleanDisplayName(row.display_name, row.user_id === listRow.owner_user_id ? "Owner" : "Gast"),
        avatarUrl: typeof row.avatar_url === "string" ? row.avatar_url : "",
        role: row.user_id === listRow.owner_user_id ? collaborationRoles.owner : normalizeRole(row.role),
        joinedAt: safeDate(row.joined_at, listRow.created_at)
      }));
    const removedMembers = memberRows
      .filter((row) => row.list_id === listRow.id && row.removed_at)
      .map((row) => ({
        userId: row.user_id,
        removedByUserId: row.removed_by_user_id ?? "",
        removedAt: safeDate(row.removed_at, listRow.updated_at)
      }));
    const listItems = itemRows.filter((row) => row.list_id === listRow.id);
    const deletedItems = listItems
      .filter((row) => row.deleted_at)
      .map((row) => ({
        id: row.item_id,
        deletedByUserId: row.deleted_by_user_id ?? "",
        deletedAt: safeDate(row.deleted_at, row.updated_at)
      }));
    const items = listItems
      .filter((row) => !row.deleted_at)
      .map((row, index) => normalizeShoppingItem({
        id: row.item_id,
        name: row.name,
        shelfId: row.shelf_id,
        shelfTitle: row.shelf_title,
        shelfIcon: row.shelf_icon,
        quantity: row.quantity,
        done: row.done,
        note: row.note,
        addedByUserId: row.added_by_user_id,
        addedByDisplayName: row.added_by_display_name,
        addedByAvatarUrl: row.added_by_avatar_url,
        checkedByUserId: row.checked_by_user_id,
        checkedAt: row.checked_at,
        updatedByUserId: row.updated_by_user_id,
        updatedAt: row.updated_at,
        revision: row.revision
      }, index))
      .filter(Boolean);
    return normalizeListData({
      id: listRow.id,
      listId: listRow.id,
      title: listRow.name,
      listName: listRow.name,
      ownerId: listRow.owner_user_id,
      inviteCode: listRow.invite_code,
      members,
      permissions: defaultListPermissions,
      createdAt: listRow.created_at,
      updatedAt: listRow.updated_at,
      updatedByUserId: listRow.updated_by_user_id,
      deletedAt: listRow.deleted_at,
      deletedByUserId: listRow.deleted_by_user_id,
      revision: listRow.revision,
      deletedItems,
      removedMembers,
      items
    });
  }

  async persistOwnedListRow(row) {
    const updateRow = async () => this.client
      .from(this.listTable)
      .update(row)
      .eq("id", row.id)
      .select("id");

    const initialUpdate = await updateRow();
    if (initialUpdate.error) {
      return { ok: false, error: initialUpdate.error.message, rawError: initialUpdate.error };
    }
    if (initialUpdate.data?.length) return { ok: true, created: false };

    const { error: insertError } = await this.client.from(this.listTable).insert(row);
    if (!insertError) return { ok: true, created: true };
    if (insertError.code !== "23505") {
      return { ok: false, error: insertError.message, rawError: insertError };
    }

    // A second device may have created the same local list after our first check.
    const retryUpdate = await updateRow();
    if (retryUpdate.error || !retryUpdate.data?.length) {
      const retryError = retryUpdate.error ?? insertError;
      return { ok: false, error: retryError.message, rawError: retryError };
    }
    return { ok: true, created: false };
  }

  async publishRelationalLists(nextLists, user = currentUser) {
    const profileResult = await this.upsertProfile(user);
    if (profileResult.ok === false) return profileResult;
    const normalizedLists = nextLists.map(normalizeListData);
    const listRows = normalizedLists.map((listData) => this.listRowFromList(listData));
    const ownedListRows = listRows.filter((row) => row.owner_user_id === user.userId);
    const joinedListRows = listRows.filter((row) => row.owner_user_id !== user.userId);
    const memberRows = normalizedLists.flatMap((listData) => {
      const rows = this.memberRowsFromList(listData);
      return listData.ownerId === user.userId ? rows : [];
    });
    const itemRows = normalizedLists.flatMap((listData) => this.itemRowsFromList(listData));

    const listResults = await MartLogic.mapWithConcurrency(
      ownedListRows,
      3,
      (row) => this.persistOwnedListRow(row)
    );
    const failedListResult = listResults.find((result) => !result.ok);
    if (failedListResult) return failedListResult;
    for (const row of joinedListRows) {
      const { error } = await this.client
        .from(this.listTable)
        .update({
          name: row.name,
          updated_at: row.updated_at,
          updated_by_user_id: this.userIdValue(user.userId),
          revision: row.revision
        })
        .eq("id", row.id);
      if (error) return { ok: false, error: error.message, rawError: error };
    }
    if (memberRows.length) {
      const { error } = await this.client.from(this.memberTable).upsert(memberRows, { onConflict: "list_id,user_id" });
      if (error) return { ok: false, error: error.message, rawError: error };
    }
    if (itemRows.length) {
      const { error } = await this.client.from(this.itemTable).upsert(itemRows, { onConflict: "list_id,item_id" });
      if (error) return { ok: false, error: error.message, rawError: error };
    }
    return { ok: true, relational: true };
  }

  async fetchRelationalLists(user) {
    const profileResult = await this.upsertProfile(user);
    if (profileResult.ok === false) return profileResult;
    const { data: listRows, error: listError } = await this.client
      .from(this.listTable)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(500);
    if (listError) return { ok: false, error: listError.message, rawError: listError };
    const listIds = (Array.isArray(listRows) ? listRows : []).map((row) => row.id);
    if (!listIds.length) return { ok: true, lists: [] };

    const [{ data: memberRows, error: memberError }, { data: itemRows, error: itemError }] = await Promise.all([
      this.client.from(this.memberTable).select("*").in("list_id", listIds),
      this.client.from(this.itemTable).select("*").in("list_id", listIds)
    ]);
    if (memberError) return { ok: false, error: memberError.message, rawError: memberError };
    if (itemError) return { ok: false, error: itemError.message, rawError: itemError };
    return {
      ok: true,
      lists: listRows.map((listRow) => this.listFromRelationalRows(listRow, memberRows ?? [], itemRows ?? []))
    };
  }

  async publishLists(nextLists, options = {}) {
    const write = async () => {
      if (!this.client) {
        if (options.queueOnFail !== false) {
          this.queueOffline({ type: "lists", createdAt: isoNow(), lists: nextLists.map(exportCollaborativeList) });
        }
        return { ok: false, offline: true };
      }

      return this.publishRelationalLists(nextLists, currentUser);
    };
    const result = this.writeQueue.then(write, write);
    this.writeQueue = result.catch(() => undefined);
    return result;
  }

  async fetchSharedLists(user) {
    if (!this.client) {
      this.queueOffline({
        type: "pull",
        createdAt: isoNow(),
        error: "Supabase Client nicht verfügbar"
      });
      return null;
    }
    const authUser = await this.ensureAuthenticated();
    if (!authUser) return null;
    const relationalResult = await this.fetchRelationalLists(user);
    if (relationalResult.ok) return relationalResult.lists;
    this.queueOffline({ type: "pull", createdAt: isoNow(), error: relationalResult.error });
    return null;
  }

  async joinSharedList(listData, user) {
    if (!this.client || !listData?.inviteCode) return null;
    const authUser = await this.ensureAuthenticated();
    if (!authUser) return null;
    const relationalJoin = await this.client.rpc("join_shopping_list", {
      target_list_id: listData.id,
      target_invite_code: listData.inviteCode,
      display_name: user.displayName,
      avatar_url: user.avatarUrl
    });
    if (!relationalJoin.error) {
      const remoteLists = await this.fetchSharedLists(user);
      return remoteLists?.find((remoteList) => (remoteList.listId ?? remoteList.id) === listData.id) ?? null;
    }
    this.queueOffline({
      type: "join",
      createdAt: isoNow(),
      listId: listData.id,
      inviteCode: listData.inviteCode,
      error: relationalJoin.error.message
    });
    return null;
  }

  async leaveSharedList(listData, user) {
    if (!listData?.id) return null;
    if (!this.client) return null;
    const authUser = await this.ensureAuthenticated();
    if (!authUser) return null;
    const relationalLeave = await this.client.rpc("leave_shopping_list", {
      target_list_id: listData.id
    });
    if (!relationalLeave.error) return relationalLeave.data ?? { listId: listData.id };
    this.queueOffline({
      type: "leave",
      createdAt: isoNow(),
      listId: listData.id,
      error: relationalLeave.error.message
    });
    return null;
  }

  async deleteSharedList(listData, user) {
    if (!listData?.id) return null;
    if (!this.client) return null;
    const authUser = await this.ensureAuthenticated();
    if (!authUser) return null;
    const relationalDelete = await this.client.rpc("delete_shopping_list", {
      target_list_id: listData.id
    });
    if (!relationalDelete.error) return relationalDelete.data ?? { listId: listData.id };
    this.queueOffline({
      type: "delete",
      createdAt: isoNow(),
      listId: listData.id,
      error: relationalDelete.error.message
    });
    return null;
  }

  heartbeat(listData, user) {
    this.trackPresence(listData, user);
    return Array.isArray(listData.members) ? listData.members : [];
  }

  trackPresence(listData, user) {
    if (!this.client) return;
    const now = isoNow();
    const presencePayload = {
      userId: user.userId,
      deviceId: this.authUserId || this.clientId,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: memberRole(listData, user.userId),
      joinedAt: memberFor(listData, user.userId)?.joinedAt ?? now,
      lastSeenAt: now
    };

    let channel = this.presenceChannels.get(listData.id);
    if (!channel) {
      channel = this.client.channel(`mart-presence:${listData.id}`, {
        config: { presence: { key: `${user.userId}:${this.authUserId || this.clientId}` } }
      });
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const membersByUser = new Map();
        Object.values(state).flat().forEach((entry) => {
          if (!entry?.userId) return;
          const member = {
            userId: entry.userId,
            displayName: cleanDisplayName(entry.displayName, "Gast"),
            avatarUrl: typeof entry.avatarUrl === "string" ? entry.avatarUrl : "",
            role: normalizeRole(entry.role),
            joinedAt: safeDate(entry.joinedAt),
            lastSeenAt: safeDate(entry.lastSeenAt)
          };
          const existing = membersByUser.get(member.userId);
          if (!existing || newerDate(member.lastSeenAt, existing.lastSeenAt)) {
            membersByUser.set(member.userId, member);
          }
        });
        const members = Array.from(membersByUser.values());
        this.notify({
          type: "presence",
          sourceId: "supabase",
          sentAt: isoNow(),
          listId: listData.id,
          members
        });
      });
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track(presencePayload).catch(() => {
            this.queueOffline({ type: "presence", createdAt: now, listId: listData.id, userId: user.userId });
          });
        }
      });
      this.presenceChannels.set(listData.id, channel);
      return;
    }

    channel.track(presencePayload).catch(() => {
      this.queueOffline({ type: "presence", createdAt: now, listId: listData.id, userId: user.userId });
    });
  }

  presenceFor(listId) {
    return activeMembersByList[listId] ?? [];
  }

  queueOffline(operation) {
    if (!isAuthenticatedAccount()) return;
    try {
      const key = accountStorageKey(storageKeys.outbox);
      const outbox = load(key, []);
      outbox.push(operation);
      localStorage.setItem(key, JSON.stringify(outbox.slice(-50)));
    } catch {
      // Account data stays in memory if local storage is unavailable.
    }
  }
}

const shelfPriceBase = {
  gemuese: 1.39,
  obst: 1.79,
  salat: 2.49,
  kaese: 2.99,
  milch: 1.69,
  backwaren: 1.89,
  "kaffee-tee-fruehstueck": 3.49,
  "nudeln-reis-konserven": 1.59,
  "fleisch-wurst": 4.99,
  fisch: 5.49,
  tiefkuehl: 3.19,
  getraenke: 1.29,
  alkohol: 5.99,
  "suessigkeiten-snacks": 1.99,
  koerperpflege: 2.79,
  haushalt: 3.49,
  tierbedarf: 4.29,
  "gesundheit-apotheke": 4.99,
  "eier-feinkost": 2.19,
  "gewuerze-backzutaten": 1.49,
  "oel-essig-saucen": 2.79,
  babypflege: 4.49,
  "buero-sonstiges": 2.29
};

const marketShelfCoverage = {
  drogerie: new Set(["koerperpflege", "haushalt", "babypflege", "gesundheit-apotheke", "suessigkeiten-snacks", "getraenke", "buero-sonstiges"]),
  tankstelle: new Set(["getraenke", "suessigkeiten-snacks", "kaffee-tee-fruehstueck", "backwaren"]),
  baeckerei: new Set(["backwaren", "kaffee-tee-fruehstueck", "suessigkeiten-snacks"]),
  baumarkt: new Set(["haushalt", "buero-sonstiges"]),
  einrichtung: new Set(["haushalt", "buero-sonstiges"])
};

class MockMarketService {
  constructor(catalog) {
    this.catalog = catalog.map((market, index) => normalizeMarket(market, index));
    this.dynamicMarkets = new Map();
  }

  searchMarkets(query = "") {
    const cleanQuery = normalize(query);
    const matches = this.catalog.filter((market) => marketMatches(market, query));
    if (matches.length || !postalCodeFromQuery(query)) {
      return matches.sort(sortMarketsByDistance).slice(0, cleanQuery ? 20 : 12);
    }
    return this.marketsForPostalCode(query).slice(0, 20);
  }

  marketsForPostalCode(query) {
    const postalCode = postalCodeFromQuery(query);
    const tokens = marketSearchTokens(query).filter((token) => token !== postalCode);
    const sourceMarkets = this.catalog.filter((market) => {
      if (!tokens.length) return true;
      const text = marketSearchText(market);
      return tokens.every((token) => text.includes(token));
    });
    const fallbackMarkets = sourceMarkets.length ? sourceMarkets : this.catalog;
    const seed = Math.abs(hashString(postalCode));
    return fallbackMarkets.slice(0, 12).map((market, index) => {
      const distance = 0.4 + ((seed + index * 7) % 36) / 10;
      const generatedMarket = normalizeMarket({
        ...market,
        id: `market:${marketSlug(market.name)}:${postalCode}`,
        adresse: `${market.name} Standort ${index + 1}`,
        plz: postalCode,
        ort: `Suchgebiet ${postalCode}`,
        latitude: numericValue(market.latitude, 50.94) + (((seed + index) % 9) - 4) / 1000,
        longitude: numericValue(market.longitude, 6.95) + (((seed >> 2) + index) % 9 - 4) / 1000,
        entfernung: Number(distance.toFixed(1)),
        source: "PLZ-Platzhalterdaten",
        isDefaultMarket: false,
        isUserAdded: false
      }, index);
      this.dynamicMarkets.set(generatedMarket.id, generatedMarket);
      return generatedMarket;
    });
  }

  nearestMarkets(marketList, limit = 3) {
    return marketList
      .filter(Boolean)
      .map((market) => normalizeMarket(market))
      .sort(sortMarketsByDistance)
      .slice(0, limit);
  }

  marketById(id) {
    return this.catalog.find((market) => market.id === id) ?? this.dynamicMarkets.get(id) ?? null;
  }
}

class MockPriceService {
  async fetchDailyPrices({ products, markets }) {
    const lastUpdated = isoNow();
    return products.flatMap((product) =>
      markets.map((market) => mockPriceForProduct(product, market, lastUpdated)).filter(Boolean)
    );
  }
}

let activeView = "market";
let selectedShelfId = null;
let currentUser = signedOutUser();
let lists = [];
let activeListId = "";
let favorites = load(storageKeys.favorites, []);
let shelfOrder = load(storageKeys.shelfOrder, []);
let markets = loadMarkets();
let productPrices = loadProductPrices();
let priceSyncState = loadPriceSyncState();
let shelfReorderMode = false;
let draggedShelfId = null;
let backgroundTheme = localStorage.getItem(storageKeys.background) || "paper";
let pendingRenameListId = null;
let pendingItemNoteEdit = null;
let activeMembersByList = {};
let marketSearchState = { query: "", selectedMarketId: "" };
let productPriceState = { productId: "", query: "" };
let manualDrafts = {};
let syncState = {
  status: navigator.onLine ? "idle" : "offline",
  lastSyncedAt: "",
  lastAttemptAt: "",
  lastError: "",
  realtimeStatus: "",
  pendingWrites: 0
};
let remoteSyncPromise = null;
let syncRenderTimer = 0;
let pendingNotesRender = false;
let pendingFullRender = false;
let syncFlushTimer = 0;
let isFlushingSyncQueue = false;
let activeWriteCount = 0;
let localMutationVersion = 0;
let mainSearchRenderTimer = 0;
let modalSearchRenderTimer = 0;
let authSubscription = null;
let realtimeSubscription = null;
let presenceTimer = 0;
let refreshTimer = 0;
let deviceHeartbeatTimer = 0;
let devicePairingPollTimer = 0;
let accountSetupPromise = null;
let currentAuthUser = null;
let pendingDevicePairing = null;
let accountSessionVersion = 0;
let authState = {
  status: "loading",
  displayName: "",
  activatingUserId: "",
  accountReady: false
};

const collaborationService = createCollaborationService();
const marketService = new MockMarketService(marketBaseCatalog);
const priceService = new MockPriceService();

const elements = {
  body: document.body,
  authGate: document.querySelector("#authGate"),
  authDeviceLoader: document.querySelector(".auth-device-loader"),
  authRetryButton: document.querySelector("#authRetryButton"),
  authStatus: document.querySelector("#authStatus"),
  appShell: document.querySelector("#appShell"),
  tabs: document.querySelectorAll(".tab"),
  imprintButton: document.querySelector("#imprintButton"),
  bugreportButton: document.querySelector("#bugreportButton"),
  moreButton: document.querySelector("#moreButton"),
  searchInput: document.querySelector("#searchInput"),
  marketView: document.querySelector("#marketView"),
  productsView: document.querySelector("#productsView"),
  favoritesView: document.querySelector("#favoritesView"),
  shelfGrid: document.querySelector("#shelfGrid"),
  productGrid: document.querySelector("#productGrid"),
  favoriteGrid: document.querySelector("#favoriteGrid"),
  currentShelfTitle: document.querySelector("#currentShelfTitle"),
  shelfCount: document.querySelector("#shelfCount"),
  reorderDoneButton: document.querySelector("#reorderDoneButton"),
  favoriteCount: document.querySelector("#favoriteCount"),
  backButton: document.querySelector("#backButton"),
  notesBoard: document.querySelector(".notes-board"),
  notesStack: document.querySelector("#notesStack"),
  addListButton: document.querySelector("#addListButton"),
  modalLayer: document.querySelector("#modalLayer"),
  modalContent: document.querySelector("#modalContent"),
  modalCloseButton: document.querySelector("#modalCloseButton")
};

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function isoNow() {
  return new Date().toISOString();
}

function safeDate(value, fallback = isoNow()) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : fallback;
}

function cleanText(value, fallback = "", maxLength = 120) {
  const text = typeof value === "string" ? value.trim().slice(0, maxLength) : "";
  return text || fallback;
}

function numericValue(value, fallback = 0) {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : fallback;
}

function marketSlug(name, fallback = "markt") {
  return normalize(name || fallback)
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || fallback;
}

function normalizeMarket(market, index = 0) {
  const fallback = defaultMarkets[index] ?? defaultMarkets[0] ?? {};
  const name = cleanText(market?.name, fallback.name ?? "Markt", 48);
  return {
    id: cleanText(market?.id, `market:${marketSlug(name)}:${index}`, 80),
    name,
    kategorie: cleanText(market?.kategorie, fallback.kategorie ?? "Markt", 40),
    adresse: cleanText(market?.adresse, fallback.adresse ?? "Adresse folgt", 90),
    plz: cleanText(market?.plz, fallback.plz ?? "", 12),
    ort: cleanText(market?.ort, fallback.ort ?? "", 48),
    latitude: numericValue(market?.latitude, numericValue(fallback.latitude, 0)),
    longitude: numericValue(market?.longitude, numericValue(fallback.longitude, 0)),
    entfernung: Math.max(0, numericValue(market?.entfernung, numericValue(fallback.entfernung, 0))),
    websiteUrl: cleanText(market?.websiteUrl, fallback.websiteUrl ?? "", 240),
    prospectUrl: cleanText(market?.prospectUrl, fallback.prospectUrl ?? "", 240),
    logoUrl: cleanText(market?.logoUrl, fallback.logoUrl ?? "", 240),
    icon: cleanText(market?.icon, fallback.icon ?? "store", 24),
    source: cleanText(market?.source, fallback.source ?? "Platzhalterdaten", 48),
    isDefaultMarket: Boolean(market?.isDefaultMarket ?? fallback.isDefaultMarket),
    isUserAdded: Boolean(market?.isUserAdded)
  };
}

function sortMarketsByDistance(first, second) {
  return numericValue(first.entfernung, 999) - numericValue(second.entfernung, 999)
    || first.name.localeCompare(second.name, "de");
}

function mergeMarkets(defaultItems, storedItems) {
  const byId = new Map(defaultItems.map((market, index) => {
    const normalized = normalizeMarket(market, index);
    return [normalized.id, normalized];
  }));
  if (Array.isArray(storedItems)) {
    storedItems.forEach((market, index) => {
      const normalized = normalizeMarket(market, index);
      const existing = byId.get(normalized.id);
      if (existing?.isDefaultMarket) {
        byId.set(normalized.id, {
          ...existing,
          isUserAdded: Boolean(existing.isUserAdded || normalized.isUserAdded)
        });
        return;
      }
      byId.set(normalized.id, {
        ...normalized,
        isDefaultMarket: Boolean(normalized.isDefaultMarket),
        isUserAdded: Boolean(normalized.isUserAdded)
      });
    });
  }
  return Array.from(byId.values()).sort(sortMarketsByDistance);
}

function loadMarkets() {
  return mergeMarkets(marketBaseCatalog, load(storageKeys.markets, []));
}

function normalizeProductPrice(price) {
  if (!price?.productId || !price?.marketId) return null;
  const amount = Number(price.price);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return {
    productId: String(price.productId),
    marketId: String(price.marketId),
    price: Number(amount.toFixed(2)),
    currency: cleanText(price.currency, "EUR", 3).toUpperCase(),
    lastUpdated: safeDate(price.lastUpdated),
    sourceUrl: cleanText(price.sourceUrl, "", 240)
  };
}

function loadProductPrices() {
  const prices = load(storageKeys.productPrices, []);
  return Array.isArray(prices) ? prices.map(normalizeProductPrice).filter(Boolean) : [];
}

function loadPriceSyncState() {
  const state = load(storageKeys.priceSync, {});
  return {
    lastUpdated: state?.lastUpdated ? safeDate(state.lastUpdated, "") : "",
    source: cleanText(state?.source, "mock", 40),
    marketIds: Array.isArray(state?.marketIds) ? state.marketIds.filter((id) => typeof id === "string") : []
  };
}

function saveMarketData() {
  localStorage.setItem(storageKeys.markets, JSON.stringify(markets));
  localStorage.setItem(storageKeys.productPrices, JSON.stringify(productPrices));
  localStorage.setItem(storageKeys.priceSync, JSON.stringify(priceSyncState));
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function generateInviteCode() {
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(9);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 18);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`.slice(0, 18);
}

function createCollaborationService() {
  const mockService = new MockRealtimeService({
    channelName: "mart-collaboration",
    storageKey: storageKeys.realtime,
    presenceKey: storageKeys.presence,
    outboxKey: storageKeys.outbox
  });
  const config = window.MART_SUPABASE_CONFIG ?? {};
  if (!config.enabled) return mockService;
  return new SupabaseRealtimeService({ config, fallback: mockService });
}

function normalizeRole(role) {
  return Object.values(collaborationRoles).includes(role) ? role : collaborationRoles.editor;
}

function cleanDisplayName(value, fallback = "Ken") {
  const name = typeof value === "string" ? value.trim().slice(0, 24) : "";
  return name || fallback;
}

function devicePlatform() {
  const userAgent = navigator.userAgent || "";
  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Macintosh/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows";
  return "Web-App";
}

function defaultDeviceLabel() {
  const platform = devicePlatform();
  const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || navigator.standalone === true;
  return standalone ? `${platform} App` : platform;
}

function userInitials(user) {
  const name = cleanDisplayName(user?.displayName, "K");
  const words = name.split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? `${words[0][0]}${words[1][0]}` : name.slice(0, 1);
  return initials.toUpperCase();
}

function signedOutUser() {
  return {
    userId: "",
    authUserId: "",
    username: "",
    displayName: "",
    avatarUrl: "",
    deviceId: "",
    deviceLabel: "",
    recoveryReady: false,
    role: collaborationRoles.viewer,
    joinedAt: ""
  };
}

function accountStorageKey(baseKey, userId = currentUser.userId) {
  return userId ? `${baseKey}:${userId}` : "";
}

function isDeviceAuthUser(user) {
  return Boolean(user?.id && isUuid(user.id) && user.is_anonymous === true);
}

function isAuthenticatedAccount() {
  return authState.accountReady && isUuid(currentUser.userId) && isUuid(currentUser.authUserId);
}

function accountUserFromAuth(authUser, account) {
  const accountId = account?.id ?? "";
  const cachedUser = load(accountStorageKey(storageKeys.currentUser, accountId), null);
  const username = typeof account?.username === "string" ? account.username : "user-UNKNOWN";
  return {
    userId: accountId,
    authUserId: authUser.id,
    username,
    displayName: cleanDisplayName(account?.displayName ?? cachedUser?.displayName, username),
    avatarUrl: typeof account?.avatarUrl === "string"
      ? account.avatarUrl
      : (typeof cachedUser?.avatarUrl === "string" ? cachedUser.avatarUrl : ""),
    deviceId: typeof account?.deviceId === "string" ? account.deviceId : "",
    deviceLabel: cleanText(account?.deviceLabel, defaultDeviceLabel(), 40),
    recoveryReady: Boolean(account?.recoveryReady),
    role: collaborationRoles.owner,
    joinedAt: safeDate(account?.createdAt ?? cachedUser?.joinedAt)
  };
}

function saveCurrentUser() {
  if (!isUuid(currentUser.userId)) return;
  localStorage.setItem(accountStorageKey(storageKeys.currentUser), JSON.stringify(currentUser));
}

function loadAccountLists(userId) {
  const storedLists = load(accountStorageKey(storageKeys.lists, userId), []);
  if (!Array.isArray(storedLists)) return [];
  return storedLists
    .map(normalizeListData)
    .filter((listData) => !listData.deletedAt)
    .filter((listData) => listData.ownerId === userId || (memberFor(listData, userId) && !isMemberRemoved(listData, userId)));
}

function loadAccountActiveListId(userId, accountLists = lists) {
  const storedId = localStorage.getItem(accountStorageKey(storageKeys.activeList, userId)) || "";
  return MartLogic.chooseActiveListId(storedId, accountLists.map((listData) => listData.id));
}

function authErrorMessage(error) {
  const message = typeof error === "string" ? error : (error?.message ?? "");
  const normalizedMessage = message.toLowerCase();
  if (normalizedMessage.includes("rate limit")) return "Zu viele Versuche. Bitte warte kurz und versuche es erneut.";
  if (normalizedMessage.includes("anonymous sign-ins are disabled")) return "Geräte-Accounts sind serverseitig noch nicht aktiviert.";
  if (normalizedMessage.includes("network") || normalizedMessage.includes("fetch")) return "Keine Verbindung zum Account-Server.";
  return message || "Der Geräte-Account ist gerade nicht erreichbar.";
}

function setAuthStatus(message = "", state = "") {
  if (!elements.authStatus) return;
  elements.authStatus.textContent = message;
  if (state) elements.authStatus.dataset.state = state;
  else delete elements.authStatus.dataset.state;
}

function setAuthBusy(isBusy) {
  if (elements.authRetryButton) elements.authRetryButton.disabled = isBusy;
}

function showDeviceSetup(message = "Dein Geräte-Account wird vorbereitet.", canRetry = false) {
  authState.status = canRetry ? "error" : "loading";
  authState.accountReady = false;
  elements.appShell?.classList.add("is-hidden");
  elements.authGate?.classList.remove("is-hidden");
  elements.authDeviceLoader?.classList.toggle("is-hidden", canRetry);
  elements.authRetryButton?.classList.toggle("is-hidden", !canRetry);
  setAuthBusy(false);
  setAuthStatus(message);
}

async function connectDeviceAccount() {
  if (accountSetupPromise) return accountSetupPromise;
  showDeviceSetup();
  setAuthBusy(true);
  accountSetupPromise = (async () => {
    try {
      const authUser = await collaborationService.initializeUser?.();
      if (!isDeviceAuthUser(authUser)) throw new Error("Keine Gerätekennung erhalten");
      return await activateAccount(authUser, { force: true });
    } catch (error) {
      showDeviceSetup(authErrorMessage(error), true);
      return false;
    } finally {
      setAuthBusy(false);
      accountSetupPromise = null;
    }
  })();
  return accountSetupPromise;
}

function handleRealtimeMessage(message) {
  if (!isAuthenticatedAccount()) return;
  if (message.type === "lists") {
    markSyncSuccess();
    mergeRemoteLists(message.lists);
    return;
  }
  if (message.type === "sync-status") {
    syncState.realtimeStatus = message.status || "";
    if (message.status === "SUBSCRIBED") markSyncSuccess();
    if (message.status === "CHANNEL_ERROR" || message.status === "TIMED_OUT" || message.status === "CLOSED") {
      markSyncError(message.error || message.status);
      pullRemoteListsSoon("realtime-error", 1200);
    }
    return;
  }
  if (message.type === "remote-changed") {
    pullRemoteListsSoon("remote-change", 250);
    return;
  }
  if (message.type === "presence" && message.listId) {
    activeMembersByList[message.listId] = message.members;
    renderNotes({ background: true });
    if (message.members.some((member) => member.userId !== currentUser.userId)) {
      pullRemoteListsSoon("presence", 700);
    }
  }
}

function stopAccountActivity() {
  realtimeSubscription?.();
  realtimeSubscription = null;
  if (presenceTimer) window.clearInterval(presenceTimer);
  if (refreshTimer) window.clearInterval(refreshTimer);
  if (deviceHeartbeatTimer) window.clearInterval(deviceHeartbeatTimer);
  presenceTimer = 0;
  refreshTimer = 0;
  deviceHeartbeatTimer = 0;
  activeMembersByList = {};
}

function startAccountActivity() {
  stopAccountActivity();
  realtimeSubscription = collaborationService.subscribe(handleRealtimeMessage);
  presenceTimer = window.setInterval(updatePresence, 15000);
  refreshTimer = window.setInterval(() => refreshRealtimeNow("interval"), 12000);
  collaborationService.touchDevice?.(null, devicePlatform());
  deviceHeartbeatTimer = window.setInterval(() => {
    collaborationService.touchDevice?.(null, devicePlatform());
  }, 60000);
}

async function activateAccount(authUser, options = {}) {
  if (!isDeviceAuthUser(authUser)) {
    showDeviceSetup("Der Geräte-Account konnte nicht verbunden werden.", true);
    return false;
  }
  if (!options.force && authState.accountReady && currentUser.authUserId === authUser.id) return true;
  if (authState.status === "loading-account" && authState.activatingUserId === authUser.id) return false;

  authState = { ...authState, status: "loading-account", activatingUserId: authUser.id };
  let account;
  try {
    account = await collaborationService.bootstrapAccount?.(defaultDeviceLabel(), devicePlatform());
  } catch (error) {
    showDeviceSetup(authErrorMessage(error), true);
    return false;
  }
  if (!account?.id) {
    showDeviceSetup("Der Account konnte nicht vorbereitet werden.", true);
    return false;
  }

  if (currentUser.userId !== account.id) {
    stopAccountActivity();
    accountSessionVersion += 1;
    remoteSyncPromise = null;
    if (syncFlushTimer) window.clearTimeout(syncFlushTimer);
    syncFlushTimer = 0;
  }

  currentAuthUser = authUser;
  currentUser = accountUserFromAuth(authUser, account);
  authState = {
    ...authState,
    status: "signed-in",
    displayName: currentUser.displayName,
    activatingUserId: "",
    accountReady: true
  };
  lists = loadAccountLists(currentUser.userId);
  activeListId = loadAccountActiveListId(currentUser.userId, lists);
  localMutationVersion = 0;
  syncState.pendingWrites = syncQueueLength();
  saveCurrentUser();

  elements.authGate?.classList.add("is-hidden");
  elements.appShell?.classList.remove("is-hidden");
  setAuthBusy(false);
  closeModal();
  startAccountActivity();
  render();
  await pullRemoteLists("account-boot");
  await importSharedListFromUrl();
  await refreshPricesIfStale();
  scheduleSyncFlush(900);
  updatePresence();
  render();
  if (pendingDevicePairing && options.handlePairing !== false) {
    window.setTimeout(() => requestPendingDevicePairing(), 0);
  }
  return true;
}

async function deactivateAccount(message = "") {
  stopAccountActivity();
  authState = { status: "signed-out", displayName: "", activatingUserId: "", accountReady: false };
  currentAuthUser = null;
  currentUser = signedOutUser();
  lists = [];
  activeListId = "";
  localMutationVersion = 0;
  manualDrafts = {};
  syncState = {
    status: navigator.onLine ? "idle" : "offline",
    lastSyncedAt: "",
    lastAttemptAt: "",
    lastError: "",
    realtimeStatus: "",
    pendingWrites: 0
  };
  closeModal();
  showDeviceSetup(message || "Der Geräte-Account wird neu verbunden.", true);
}

function createMember(user = currentUser, role = collaborationRoles.editor, joinedAt = isoNow()) {
  return {
    userId: typeof user?.userId === "string" && user.userId ? user.userId : `user:${Date.now()}`,
    displayName: cleanDisplayName(user?.displayName, "Gast"),
    avatarUrl: typeof user?.avatarUrl === "string" ? user.avatarUrl : "",
    role: normalizeRole(role),
    joinedAt: safeDate(joinedAt)
  };
}

function normalizePermissions(permissions = {}) {
  return Object.fromEntries(Object.entries(defaultListPermissions).map(([role, actions]) => {
    const customActions = Array.isArray(permissions?.[role]) ? permissions[role] : actions;
    return [role, [...new Set(customActions.filter((action) => typeof action === "string"))]];
  }));
}

function memberFor(listData, userId = currentUser.userId) {
  return listData.members?.find((member) => member.userId === userId) ?? null;
}

function memberRole(listData, userId = currentUser.userId) {
  if (listData.ownerId === userId) return collaborationRoles.owner;
  const member = memberFor(listData, userId);
  return member ? normalizeRole(member.role) : collaborationRoles.viewer;
}

function canPerform(listData, action, userId = currentUser.userId) {
  const role = memberRole(listData, userId);
  const permissions = normalizePermissions(listData.permissions);
  return permissions[role]?.includes(action) ?? false;
}

function canEditList(listData) {
  return ["add", "edit", "check", "delete"].some((action) => canPerform(listData, action));
}

function canManageMembers(listData) {
  return canPerform(listData, "invite") || canPerform(listData, "remove");
}

function isMemberRemoved(listData, userId = currentUser.userId) {
  const removedAt = removedMemberAt(listData.removedMembers, userId);
  if (!removedAt || listData.ownerId === userId) return false;
  const member = memberFor(listData, userId);
  return !member || newerDate(removedAt, member.joinedAt);
}

function normalizeMember(member, ownerId) {
  const normalized = createMember(member, member?.userId === ownerId ? collaborationRoles.owner : member?.role, member?.joinedAt);
  if (normalized.userId === ownerId) normalized.role = collaborationRoles.owner;
  return normalized;
}

function normalizeShoppingItem(item, index = 0) {
  if (!item || typeof item.name !== "string" || !item.name.trim()) return null;
  const now = isoNow();
  const name = item.name.trim().slice(0, 80);
  const knownProduct = allProducts().find((product) => normalize(product.name) === normalize(name));
  const addedByUserId = typeof item.addedByUserId === "string" && item.addedByUserId ? item.addedByUserId : currentUser.userId;
  const addedByDisplayName = cleanDisplayName(item.addedByDisplayName, addedByUserId === currentUser.userId ? currentUser.displayName : "Gast");
  const checkedAt = item.checkedAt ? safeDate(item.checkedAt, "") : "";

  return {
    id: typeof item.id === "string" && item.id ? item.id : knownProduct?.id ?? `geteilt:${Date.now()}:${index}`,
    name,
    shelfId: typeof item.shelfId === "string" ? item.shelfId : knownProduct?.shelfId ?? "geteilt",
    shelfTitle: typeof item.shelfTitle === "string" ? item.shelfTitle : knownProduct?.shelfTitle ?? "Geteilter Zettel",
    shelfIcon: typeof item.shelfIcon === "string" ? item.shelfIcon : knownProduct?.shelfIcon,
    quantity: Math.max(1, Math.min(99, Math.round(Number(item.quantity) || 1))),
    done: Boolean(item.done),
    note: typeof item.note === "string" ? item.note.trim().slice(0, 48) : "",
    addedByUserId,
    addedByDisplayName,
    addedByAvatarUrl: typeof item.addedByAvatarUrl === "string" ? item.addedByAvatarUrl : "",
    checkedByUserId: typeof item.checkedByUserId === "string" ? item.checkedByUserId : "",
    checkedAt,
    updatedByUserId: typeof item.updatedByUserId === "string" && item.updatedByUserId ? item.updatedByUserId : addedByUserId,
    updatedAt: safeDate(item.updatedAt ?? item.checkedAt ?? now),
    revision: Math.max(0, Math.round(Number(item.revision) || 0)),
    conflict: normalizeItemConflict(item.conflict)
  };
}

function normalizeItemConflict(conflict) {
  if (!conflict || typeof conflict !== "object") return null;
  return {
    detectedAt: conflict.detectedAt ? safeDate(conflict.detectedAt, "") : isoNow(),
    localByUserId: typeof conflict.localByUserId === "string" ? conflict.localByUserId : "",
    remoteByUserId: typeof conflict.remoteByUserId === "string" ? conflict.remoteByUserId : "",
    message: cleanText(conflict.message, "Gleichzeitige Änderung erkannt", 120)
  };
}

function touchList(listData, userId = currentUser.userId) {
  const now = isoNow();
  listData.updatedAt = now;
  listData.updatedByUserId = userId;
  listData.listName = listData.title;
  listData.revision = Math.max(0, Math.round(Number(listData.revision) || 0)) + 1;
  return now;
}

function touchItem(item, listData, user = currentUser) {
  const now = touchList(listData, user.userId);
  item.updatedAt = now;
  item.updatedByUserId = user.userId;
  item.revision = Math.max(0, Math.round(Number(item.revision) || 0)) + 1;
  item.conflict = null;
  return now;
}

function normalizeListData(listData, index = 0) {
  const now = isoNow();
  const id = typeof listData?.id === "string" && listData.id ? listData.id : (typeof listData?.listId === "string" && listData.listId ? listData.listId : `zettel:${index + 1}`);
  const title = typeof listData?.title === "string" && listData.title.trim()
    ? listData.title.trim().slice(0, 24)
    : (typeof listData?.listName === "string" && listData.listName.trim() ? listData.listName.trim().slice(0, 24) : (index === 0 ? "Dein Zettel" : `Zettel ${index + 1}`));
  const ownerId = typeof listData?.ownerId === "string" && listData.ownerId ? listData.ownerId : currentUser.userId;
  const inviteCode = typeof listData?.inviteCode === "string" && listData.inviteCode ? listData.inviteCode : generateInviteCode();
  const members = Array.isArray(listData?.members) ? listData.members.map((member) => normalizeMember(member, ownerId)) : [];
  const normalizedList = {
    id,
    listId: id,
    title,
    listName: title,
    ownerId,
    inviteCode,
    members,
    permissions: normalizePermissions(listData?.permissions),
    createdAt: safeDate(listData?.createdAt ?? now),
    updatedAt: safeDate(listData?.updatedAt ?? now),
    updatedByUserId: typeof listData?.updatedByUserId === "string" ? listData.updatedByUserId : ownerId,
    deletedAt: listData?.deletedAt ? safeDate(listData.deletedAt, "") : "",
    deletedByUserId: typeof listData?.deletedByUserId === "string" ? listData.deletedByUserId : "",
    revision: Math.max(0, Math.round(Number(listData?.revision) || 0)),
    deletedItems: Array.isArray(listData?.deletedItems) ? listData.deletedItems : [],
    removedMembers: Array.isArray(listData?.removedMembers) ? listData.removedMembers : [],
    items: Array.isArray(listData?.items) ? listData.items.map(normalizeShoppingItem).filter(Boolean) : []
  };
  normalizedList.members = mergeMembers(normalizedList.members, [], ownerId, normalizedList.removedMembers);
  if (!normalizedList.members.some((member) => member.userId === ownerId)) {
    normalizedList.members.unshift(createMember({ userId: ownerId, displayName: ownerId === currentUser.userId ? currentUser.displayName : "Owner", avatarUrl: "" }, collaborationRoles.owner, normalizedList.createdAt));
  }
  return normalizedList;
}

function createList(title = "Dein Zettel", items = [], id = null) {
  const now = isoNow();
  const listId = id ?? `zettel:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  return normalizeListData({
    id: listId,
    listId,
    title,
    listName: title,
    ownerId: currentUser.userId,
    inviteCode: generateInviteCode(),
    members: [createMember(currentUser, collaborationRoles.owner, now)],
    permissions: defaultListPermissions,
    createdAt: now,
    updatedAt: now,
    updatedByUserId: currentUser.userId,
    deletedAt: "",
    deletedByUserId: "",
    revision: 1,
    deletedItems: [],
    removedMembers: [],
    items: Array.isArray(items) ? items : []
  });
}

function activeList() {
  let currentList = lists.find((item) => item.id === activeListId);
  if (!currentList) {
    currentList = lists[0] ?? null;
    activeListId = currentList?.id ?? "";
  }
  return currentList;
}

function activeItems() {
  return activeList()?.items ?? [];
}

function captureScrollState() {
  return {
    windowX: window.scrollX,
    windowY: window.scrollY,
    layoutLeft: document.querySelector(".layout")?.scrollLeft ?? 0,
    modalTop: elements.modalLayer.classList.contains("is-hidden") ? 0 : (elements.modalLayer.querySelector(".modal-card")?.scrollTop ?? 0)
  };
}

function restoreScrollState(snapshot) {
  window.requestAnimationFrame(() => {
    window.scrollTo(snapshot.windowX, snapshot.windowY);
    const layout = document.querySelector(".layout");
    if (layout) layout.scrollLeft = snapshot.layoutLeft;
    const modalCard = elements.modalLayer.querySelector(".modal-card");
    if (modalCard && !elements.modalLayer.classList.contains("is-hidden")) modalCard.scrollTop = snapshot.modalTop;
  });
}

function withScrollPreserved(callback) {
  const snapshot = captureScrollState();
  callback();
  restoreScrollState(snapshot);
}

function isModalOpen() {
  return !elements.modalLayer.classList.contains("is-hidden");
}

function focusedEditableElement() {
  const activeElement = document.activeElement;
  if (!activeElement || activeElement === document.body) return null;
  return activeElement.matches?.("input:not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']")
    ? activeElement
    : null;
}

function uiIsBusy() {
  return Boolean(focusedEditableElement()) || isModalOpen();
}

function renderNotesSoon(options = {}) {
  if (!elements?.notesStack || syncRenderTimer) return;
  syncRenderTimer = window.setTimeout(() => {
    syncRenderTimer = 0;
    renderNotes(options);
  }, 0);
}

function focusedManualInput() {
  const activeElement = document.activeElement;
  return activeElement?.matches?.("[data-manual-input]") ? activeElement : null;
}

function shouldHoldNotesRender(options = {}) {
  return options.background && !options.force && uiIsBusy();
}

function shouldHoldFullRender(options = {}) {
  return options.background && !options.force && uiIsBusy();
}

function flushPendingNotesRender(delay = 180) {
  if (!pendingNotesRender && !pendingFullRender) return;
  window.setTimeout(() => {
    if (uiIsBusy()) return;
    if (pendingFullRender) {
      render({ force: true });
      return;
    }
    renderNotes({ force: true });
  }, delay);
}

function setSyncState(status, details = {}) {
  syncState = {
    ...syncState,
    pendingWrites: syncQueueLength(),
    status,
    ...details
  };
  renderNotesSoon({ background: true });
}

function markSyncAttempt() {
  setSyncState(navigator.onLine ? "syncing" : "offline", {
    lastAttemptAt: isoNow(),
    lastError: navigator.onLine ? "" : "offline"
  });
}

function markSyncSuccess() {
  setSyncState("online", {
    lastSyncedAt: isoNow(),
    lastAttemptAt: syncState.lastAttemptAt || isoNow(),
    lastError: ""
  });
}

function markSyncError(error) {
  setSyncState(navigator.onLine ? "error" : "offline", {
    lastAttemptAt: syncState.lastAttemptAt || isoNow(),
    lastError: typeof error === "string" ? error : (error?.message ?? "Sync nicht erreichbar")
  });
}

function syncQueue() {
  if (!isAuthenticatedAccount()) return [];
  const queue = load(accountStorageKey(storageKeys.syncQueue), []);
  return Array.isArray(queue) ? queue.filter((operation) => operation?.type === "lists" && Array.isArray(operation.lists)) : [];
}

function syncQueueLength() {
  return syncQueue().length;
}

function storeSyncQueue(queue) {
  if (!isAuthenticatedAccount()) return;
  const nextQueue = queue.slice(-30);
  localStorage.setItem(accountStorageKey(storageKeys.syncQueue), JSON.stringify(nextQueue));
  syncState.pendingWrites = nextQueue.length;
}

function syncSnapshot(sourceLists = lists) {
  return sourceLists.map(exportCollaborativeList);
}

function queueSyncWrite(sourceLists = lists, reason = "save", error = "") {
  const payload = syncSnapshot(sourceLists);
  const signature = JSON.stringify(payload.map((listData) => [listData.listId, listData.updatedAt, listData.items?.length ?? 0]));
  const queue = syncQueue().filter((operation) => operation.signature !== signature);
  queue.push({
    id: `sync:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    type: "lists",
    reason,
    signature,
    createdAt: isoNow(),
    lastAttemptAt: "",
    attempts: 0,
    error: typeof error === "string" ? error : (error?.message ?? ""),
    lists: payload
  });
  storeSyncQueue(queue);
  scheduleSyncFlush(2500);
}

function listsFromSyncOperation(operation) {
  return operation.lists.map(importedListFromValue).filter(Boolean);
}

async function publishListSnapshot(sourceLists = lists, reason = "save", options = {}) {
  if (!isAuthenticatedAccount()) return false;
  activeWriteCount += 1;
  markSyncAttempt();
  try {
    const result = await collaborationService.publishLists(sourceLists, { queueOnFail: false });
    if (result?.ok === false) {
      if (options.queueOnFail !== false) queueSyncWrite(sourceLists, reason, result.error || "Änderungen warten auf Verbindung");
      markSyncError(result.error || "Änderungen warten auf Verbindung");
      return false;
    }
    markSyncSuccess();
    if (syncQueueLength()) scheduleSyncFlush(400);
    pullRemoteListsSoon("after-write", 900);
    return true;
  } catch (error) {
    if (options.queueOnFail !== false) queueSyncWrite(sourceLists, reason, error);
    markSyncError(error);
    return false;
  } finally {
    activeWriteCount = Math.max(0, activeWriteCount - 1);
  }
}

function scheduleSyncFlush(delay = 1200) {
  if (syncFlushTimer) window.clearTimeout(syncFlushTimer);
  syncFlushTimer = window.setTimeout(() => {
    syncFlushTimer = 0;
    flushSyncQueue();
  }, delay);
}

async function flushSyncQueue() {
  if (isFlushingSyncQueue || !navigator.onLine) return false;
  let queue = syncQueue();
  if (!queue.length) {
    storeSyncQueue([]);
    return true;
  }
  isFlushingSyncQueue = true;
  markSyncAttempt();
  try {
    for (let index = 0; index < queue.length; index += 1) {
      const operation = queue[index];
      const sourceLists = listsFromSyncOperation(operation);
      if (!sourceLists.length) continue;
      const result = await collaborationService.publishLists(sourceLists, { queueOnFail: false });
      if (result?.ok === false) {
        const failedOperation = {
          ...operation,
          attempts: Number(operation.attempts || 0) + 1,
          lastAttemptAt: isoNow(),
          error: result.error || "Sync wartet auf Verbindung"
        };
        storeSyncQueue([failedOperation, ...queue.slice(index + 1)].slice(-30));
        markSyncError(failedOperation.error);
        scheduleSyncFlush(8000);
        return false;
      }
    }
    storeSyncQueue([]);
    markSyncSuccess();
    pullRemoteListsSoon("outbox-flushed", 900);
    return true;
  } catch (error) {
    markSyncError(error);
    scheduleSyncFlush(8000);
    return false;
  } finally {
    isFlushingSyncQueue = false;
  }
}

function save(options = {}) {
  if (options.source !== "remote") localMutationVersion += 1;
  lists = lists.map(normalizeListData);
  if (isAuthenticatedAccount()) {
    localStorage.setItem(accountStorageKey(storageKeys.lists), JSON.stringify(lists));
    localStorage.setItem(accountStorageKey(storageKeys.activeList), activeListId);
  }
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  localStorage.setItem(storageKeys.shelfOrder, JSON.stringify(shelfOrder));
  localStorage.setItem(storageKeys.background, backgroundTheme);
  if (isAuthenticatedAccount() && options.broadcast !== false) {
    publishListSnapshot(lists, options.reason || "save");
  }
}

function applyBackgroundTheme() {
  elements.body.dataset.background = backgroundTheme;
}

function favoritesShelf() {
  return {
    id: "eigenes-regal",
    title: "Eigenes Regal",
    emoji: "★",
    color: "#6f6a5d",
    icon: "sparkle",
    products: favoriteProducts()
  };
}

function marketShelves() {
  const shelfItems = [...shelves, favoritesShelf()];
  const knownIds = new Set(shelfItems.map((shelf) => shelf.id));
  const orderedIds = shelfOrder.filter((id) => knownIds.has(id));
  const missingIds = shelfItems.map((shelf) => shelf.id).filter((id) => !orderedIds.includes(id));
  const nextOrder = [...orderedIds, ...missingIds];
  if (nextOrder.join("|") !== shelfOrder.join("|")) {
    shelfOrder = nextOrder;
    save();
  }
  return nextOrder.map((id) => shelfItems.find((shelf) => shelf.id === id)).filter(Boolean);
}

function getShelfProducts(shelf) {
  return shelf.id === "eigenes-regal" ? favoriteProducts() : shelf.products.map((name) => {
    const product = allProducts().find((item) => item.id === productId(shelf.id, name));
    return product;
  }).filter(Boolean);
}

function favoriteProducts() {
  return allProducts().filter((product) => favorites.includes(product.id));
}

function productId(shelfId, name) {
  return `${shelfId}:${name.toLowerCase()}`;
}

function allProducts() {
  return shelves.flatMap((shelf) =>
    shelf.products.map((name) => ({
      id: productId(shelf.id, name),
      name,
      shelfId: shelf.id,
      shelfTitle: shelf.title,
      shelfIcon: shelf.icon
    }))
  );
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeMarketSearchValue(value) {
  return normalize(value)
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

function marketSearchTokens(query) {
  return normalizeMarketSearchValue(query).split(/[\s,;]+/).filter(Boolean);
}

function marketSearchText(market) {
  return [
    market.name,
    market.kategorie,
    market.adresse,
    market.plz,
    market.ort
  ].map(normalizeMarketSearchValue).join(" ");
}

function postalCodeFromQuery(query) {
  return String(query ?? "").match(/\b\d{5}\b/)?.[0] ?? "";
}

function marketMatches(market, query) {
  const tokens = marketSearchTokens(query);
  if (!tokens.length) return true;
  const text = marketSearchText(market);
  return tokens.every((token) => text.includes(token));
}

function marketById(id) {
  return markets.find((market) => market.id === id)
    ?? marketService?.marketById?.(id)
    ?? null;
}

function userAddedMarkets() {
  return markets.filter((market) => market.isUserAdded).sort(sortMarketsByDistance);
}

function marketsForPriceLookup() {
  return markets
    .filter((market) => market.isDefaultMarket || market.isUserAdded)
    .sort(sortMarketsByDistance);
}

function topNearbyMarkets(limit = 3) {
  return marketService.nearestMarkets(marketsForPriceLookup(), limit);
}

function formatDistance(distance) {
  const value = numericValue(distance, 0);
  return value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(1).replace(".", ",")} km`;
}

function formatPrice(price, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency || "EUR"
  }).format(Number(price) || 0);
}

function formatDateTime(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Noch nie";
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

function productPricesFor(productId) {
  return productPrices
    .filter((price) => price.productId === productId)
    .map((price) => ({
      ...price,
      market: marketById(price.marketId)
    }))
    .filter((price) => price.market)
    .sort((first, second) => first.price - second.price || sortMarketsByDistance(first.market, second.market));
}

function bestPriceForProduct(productId) {
  return productPricesFor(productId)[0] ?? null;
}

function priceSummaryForProduct(product) {
  const bestPrice = bestPriceForProduct(product.id);
  if (!bestPrice) return "Noch kein Preis verfügbar";
  return `Günstigster Preis: ${formatPrice(bestPrice.price, bestPrice.currency)} bei ${bestPrice.market.name}`;
}

function marketSupportsProduct(market, product) {
  const category = marketSlug(market.kategorie);
  if (category.includes("supermarkt") || category.includes("discounter") || category.includes("warenhaus")) return true;
  const coverage = Object.entries(marketShelfCoverage).find(([key]) => category.includes(key))?.[1];
  return coverage ? coverage.has(product.shelfId) : true;
}

function mockPriceForProduct(product, market, lastUpdated) {
  if (!marketSupportsProduct(market, product)) return null;
  const hash = Math.abs(hashString(`${product.id}:${market.id}`));
  if (hash % 9 === 0) return null;
  const shelfBase = shelfPriceBase[product.shelfId] ?? 2.49;
  const marketFactor = ((hash % 45) - 18) / 100;
  const productFactor = (((hash >> 3) % 140) - 40) / 100;
  const price = Math.max(0.39, shelfBase + productFactor + marketFactor);
  return normalizeProductPrice({
    productId: product.id,
    marketId: market.id,
    price,
    currency: "EUR",
    lastUpdated,
    sourceUrl: market.websiteUrl
  });
}

function mergeProductPrices(existingPrices, nextPrices) {
  const byKey = new Map();
  [...existingPrices, ...nextPrices].forEach((price) => {
    const normalized = normalizeProductPrice(price);
    if (!normalized) return;
    byKey.set(`${normalized.productId}:${normalized.marketId}`, normalized);
  });
  return Array.from(byKey.values());
}

function pricesNeedDailyRefresh() {
  const lastUpdated = Date.parse(priceSyncState.lastUpdated || 0);
  return priceSyncState.source !== "mock-v3" || !Number.isFinite(lastUpdated) || Date.now() - lastUpdated > 24 * 60 * 60 * 1000;
}

async function refreshPrices({ manual = false } = {}) {
  const lookupMarkets = topNearbyMarkets(3);
  if (!lookupMarkets.length) {
    if (manual) window.alert("Es sind noch keine Märkte für Preise vorhanden.");
    return [];
  }
  const nextPrices = await priceService.fetchDailyPrices({
    products: allProducts(),
    markets: lookupMarkets
  });
  const refreshedMarketIds = new Set(lookupMarkets.map((market) => market.id));
  const keepExistingPrices = priceSyncState.source === "mock-v3"
    ? productPrices.filter((price) => !refreshedMarketIds.has(price.marketId))
    : [];
  productPrices = mergeProductPrices(keepExistingPrices, nextPrices);
  priceSyncState = {
    lastUpdated: isoNow(),
    source: "mock-v3",
    marketIds: lookupMarkets.map((market) => market.id)
  };
  saveMarketData();
  render();
  if (manual) showPriceFetch("Preise wurden aktualisiert.");
  return nextPrices;
}

async function refreshPricesIfStale() {
  if (!pricesNeedDailyRefresh()) return;
  await refreshPrices({ manual: false });
}

function addMarketToPersonalList(marketId) {
  const sourceMarket = marketById(marketId);
  if (!sourceMarket) return null;
  const index = markets.findIndex((market) => market.id === marketId);
  const nextMarket = {
    ...normalizeMarket(sourceMarket),
    isUserAdded: true
  };
  if (index === -1) {
    markets.push(nextMarket);
  } else {
    markets[index] = {
      ...markets[index],
      ...nextMarket,
      isUserAdded: true
    };
  }
  markets = markets.map(normalizeMarket).sort(sortMarketsByDistance);
  saveMarketData();
  return nextMarket;
}

function openProspect(marketId) {
  const market = marketById(marketId);
  const url = market?.prospectUrl || market?.websiteUrl;
  if (!url) {
    window.alert("Für diesen Markt ist noch kein Werbekatalog hinterlegt.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function openProductProspect(productId) {
  const bestPrice = bestPriceForProduct(productId);
  const fallbackMarket = topNearbyMarkets(1)[0];
  const market = bestPrice?.market ?? fallbackMarket;
  if (!market) {
    showMarketSearch();
    return;
  }
  openProspect(market.id);
}

function marketAddressLine(market) {
  return [market.adresse, [market.plz, market.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

function marketMapStyle(market) {
  const allLatitudes = marketBaseCatalog.map((item) => numericValue(item.latitude, 0));
  const allLongitudes = marketBaseCatalog.map((item) => numericValue(item.longitude, 0));
  const minLat = Math.min(...allLatitudes);
  const maxLat = Math.max(...allLatitudes);
  const minLon = Math.min(...allLongitudes);
  const maxLon = Math.max(...allLongitudes);
  const x = ((market.longitude - minLon) / Math.max(0.001, maxLon - minLon)) * 78 + 11;
  const y = (1 - ((market.latitude - minLat) / Math.max(0.001, maxLat - minLat))) * 70 + 14;
  return `--x: ${Math.max(8, Math.min(92, x)).toFixed(1)}%; --y: ${Math.max(10, Math.min(88, y)).toFixed(1)}%;`;
}

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] ?? iconPaths.cart}</svg>`;
}

function sketchIconFor(product) {
  const name = normalize(product.name);

  if (name === "eis") return "icecream";
  if (name === "reis") return "rice";
  if (name === "eier" || name === "eiersalat") return "egg";
  if (product.shelfId === "gewuerze-backzutaten" && name === "paprika") return "spice";
  if (name === "pflaster") return "bandage";
  if (name === "fieberthermometer") return "thermometer";
  if (name === "nüsse") return "nuts";

  const rule = sketchRules.find(([needles]) => needles.some((needle) => name.includes(needle)));
  return rule?.[1] ?? product.shelfIcon ?? "cart";
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hashString(value) {
  return Array.from(String(value)).reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }, 0);
}

function productIconPalette(product, iconKey) {
  const palette = productIconPalettes[iconKey] ?? productIconPalettes.cart;
  const hash = Math.abs(hashString(`${product.id}:${product.name}`));
  const markerIndex = hash % productMarkerShapes.length;
  const tilt = (hash % 9) - 4;

  return {
    fill: palette[0],
    accent: palette[1],
    marker: palette[2],
    shadow: palette[3],
    markerShape: productMarkerShapes[markerIndex],
    highlightPath: productHighlightPaths[hash % productHighlightPaths.length],
    hatchPath: productHatchPaths[(hash >> 2) % productHatchPaths.length],
    tilt
  };
}

function productIconSvg(product) {
  const iconKey = sketchIconFor(product);
  const palette = productIconPalette(product, iconKey);
  const shape = iconPaths[iconKey] ?? iconPaths.cart;
  const label = escapeText(product.name);

  return `
    <svg class="product-pop-icon" viewBox="0 0 64 64" aria-hidden="true" style="--product-fill: ${palette.fill}; --product-accent: ${palette.accent}; --product-marker: ${palette.marker}; --product-shadow: ${palette.shadow}; --product-tilt: ${palette.tilt}deg;">
      <title>${label}</title>
      <path class="product-marker product-marker-one" d="${palette.markerShape}"></path>
      <path class="product-marker product-marker-two" d="M16 18c9-4 22-5 34-1l-3 27c-11 6-23 5-33-2Z"></path>
      <g class="product-symbol-shadow" transform="translate(10 11) scale(1.84)">${shape}</g>
      <g class="product-symbol-color" transform="translate(8 8) scale(1.86)">${shape}</g>
      <g class="product-symbol-ink" transform="translate(8 8) scale(1.86)">${shape}</g>
      <path class="product-highlight" d="${palette.highlightPath}"></path>
      <path class="product-hatch" d="${palette.hatchPath}"></path>
    </svg>
  `;
}

function productIconMarkup(product) {
  return `<span class="product-icon product-sketch">${productIconSvg(product)}</span>`;
}

function shelfIllustrationMarkup(shelf) {
  const hash = Math.abs(hashString(shelf.id));
  const colors = [
    shelf.color,
    productIconPalettes[shelf.icon]?.[0] ?? "#f2c94c",
    productIconPalettes[shelf.icon]?.[1] ?? "#67c9e8"
  ];
  const productShapes = Array.from({ length: 7 }).map((_, index) => {
    const x = 12 + (index % 4) * 10 + ((hash + index) % 3);
    const y = index < 4 ? 21 + ((hash + index) % 3) : 38 + ((hash + index) % 3);
    const color = colors[(index + hash) % colors.length];
    const rotate = ((hash >> index) % 9) - 4;
    return `<path class="shelf-good" style="--good-color: ${color}; --good-rotate: ${rotate}deg;" d="M${x} ${y}c4-5 10-4 12 1 2 6-3 11-8 10-6-1-8-7-4-11Z"/>`;
  }).join("");

  return `
    <span class="shelf-illustration" style="--shelf-color: ${shelf.color};">
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <path class="shelf-marker" d="M8 12c14-7 38-8 55 1l-5 48c-15 7-35 6-50-2Z"></path>
        <path class="shelf-frame" d="M12 16h48v43H12V16Z"></path>
        <path class="shelf-board" d="M14 31h44M14 48h44"></path>
        ${productShapes}
        <path class="shelf-sign" d="M24 10h24l3 10H21l3-10Z"></path>
        <g class="shelf-symbol" transform="translate(24 9) scale(1.02)">${iconPaths[shelf.icon] ?? iconPaths.sparkle}</g>
      </svg>
    </span>
  `;
}

function encodeShareValue(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function decodeShareValue(value) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function exportCollaborativeList(listData) {
  const normalizedList = normalizeListData(listData);
  return {
    listId: normalizedList.id,
    listName: normalizedList.title,
    ownerId: normalizedList.ownerId,
    inviteCode: normalizedList.inviteCode,
    members: normalizedList.members,
    permissions: normalizedList.permissions,
    createdAt: normalizedList.createdAt,
    updatedAt: normalizedList.updatedAt,
    updatedByUserId: normalizedList.updatedByUserId,
    deletedAt: normalizedList.deletedAt,
    deletedByUserId: normalizedList.deletedByUserId,
    revision: normalizedList.revision,
    deletedItems: normalizedList.deletedItems,
    removedMembers: normalizedList.removedMembers,
    items: normalizedList.items
  };
}

function importedListFromValue(value) {
  if (Array.isArray(value)) {
    return createList("Geteilter Zettel", sanitizeSharedList(value), `geteilt:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`);
  }
  if (!value || typeof value !== "object") return null;
  return normalizeListData({
    id: value.id ?? value.listId,
    listId: value.listId ?? value.id,
    title: value.title ?? value.listName,
    listName: value.listName ?? value.title,
    ownerId: value.ownerId,
    inviteCode: value.inviteCode,
    members: value.members,
    permissions: value.permissions,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    updatedByUserId: value.updatedByUserId,
    deletedAt: value.deletedAt,
    deletedByUserId: value.deletedByUserId,
    revision: value.revision,
    deletedItems: value.deletedItems,
    removedMembers: value.removedMembers,
    items: value.items
  });
}

function newerDate(first, second) {
  return Date.parse(first ?? 0) >= Date.parse(second ?? 0);
}

function mergeRemovedMembers(localRemoved = [], remoteRemoved = []) {
  const byId = new Map();
  [...localRemoved, ...remoteRemoved].forEach((entry) => {
    if (!entry?.userId || !entry?.removedAt) return;
    const existing = byId.get(entry.userId);
    if (!existing || newerDate(entry.removedAt, existing.removedAt)) {
      byId.set(entry.userId, {
        userId: entry.userId,
        removedByUserId: typeof entry.removedByUserId === "string" ? entry.removedByUserId : "",
        removedAt: safeDate(entry.removedAt)
      });
    }
  });
  return Array.from(byId.values()).slice(-100);
}

function removedMemberAt(removedMembers = [], userId) {
  return removedMembers
    .filter((entry) => entry?.userId === userId)
    .map((entry) => entry.removedAt)
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? "";
}

function mergeMembers(localMembers = [], remoteMembers = [], ownerId = currentUser.userId, removedMembers = []) {
  const byId = new Map();
  [...localMembers, ...remoteMembers].forEach((member) => {
    const normalized = normalizeMember(member, ownerId);
    const removedAt = removedMemberAt(removedMembers, normalized.userId);
    if (normalized.userId !== ownerId && removedAt && newerDate(removedAt, normalized.joinedAt)) return;
    const existing = byId.get(normalized.userId);
    if (!existing || newerDate(normalized.joinedAt, existing.joinedAt)) {
      byId.set(normalized.userId, normalized);
    }
  });
  return Array.from(byId.values()).sort((a, b) => {
    if (a.userId === ownerId) return -1;
    if (b.userId === ownerId) return 1;
    return a.displayName.localeCompare(b.displayName, "de");
  });
}

function latestDeletedAt(deletedItems = [], itemId) {
  return deletedItems
    .filter((entry) => entry?.id === itemId)
    .map((entry) => entry.deletedAt)
    .filter(Boolean)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? "";
}

function mergeDeletedItems(localDeleted = [], remoteDeleted = []) {
  const byId = new Map();
  [...localDeleted, ...remoteDeleted].forEach((entry) => {
    if (!entry?.id || !entry?.deletedAt) return;
    const existing = byId.get(entry.id);
    if (!existing || newerDate(entry.deletedAt, existing.deletedAt)) {
      byId.set(entry.id, {
        id: entry.id,
        deletedByUserId: typeof entry.deletedByUserId === "string" ? entry.deletedByUserId : "",
        deletedAt: safeDate(entry.deletedAt)
      });
    }
  });
  return Array.from(byId.values()).slice(-200);
}

function itemsDiffer(first, second) {
  if (!first || !second) return false;
  return first.name !== second.name
    || first.note !== second.note
    || first.quantity !== second.quantity
    || first.done !== second.done;
}

function onlyQuantityDiffers(first, second) {
  if (!first || !second) return false;
  return first.name === second.name
    && first.note === second.note
    && first.done === second.done
    && first.quantity !== second.quantity;
}

function shouldMarkItemConflict(localItem, remoteItem) {
  if (!localItem || !remoteItem) return false;
  if (localItem.updatedByUserId === remoteItem.updatedByUserId) return false;
  if (!itemsDiffer(localItem, remoteItem)) return false;
  const localUpdatedAt = Date.parse(localItem.updatedAt ?? 0);
  const remoteUpdatedAt = Date.parse(remoteItem.updatedAt ?? 0);
  if (!Number.isFinite(localUpdatedAt) || !Number.isFinite(remoteUpdatedAt)) return false;
  return Math.abs(localUpdatedAt - remoteUpdatedAt) < 20000;
}

function itemConflict(localItem, remoteItem) {
  return {
    detectedAt: isoNow(),
    localByUserId: localItem?.updatedByUserId ?? "",
    remoteByUserId: remoteItem?.updatedByUserId ?? "",
    message: "Zwei Geräte haben diesen Artikel fast gleichzeitig geändert. Die neueste Version wurde übernommen."
  };
}

function mergeList(localList, remoteList) {
  const local = normalizeListData(localList);
  const remote = normalizeListData(remoteList);
  if (remote.deletedAt) return remote;
  const deletedItems = mergeDeletedItems(local.deletedItems, remote.deletedItems);
  const removedMembers = mergeRemovedMembers(local.removedMembers, remote.removedMembers);
  const itemIds = new Set([...local.items.map((item) => item.id), ...remote.items.map((item) => item.id)]);
  const items = Array.from(itemIds).map((itemId) => {
    const localItem = local.items.find((item) => item.id === itemId);
    const remoteItem = remote.items.find((item) => item.id === itemId);
    const deletedAt = latestDeletedAt(deletedItems, itemId);
    const newestItem = !localItem ? remoteItem : (!remoteItem ? localItem : (newerDate(remoteItem.updatedAt, localItem.updatedAt) ? remoteItem : localItem));
    if (deletedAt && (!newestItem || newerDate(deletedAt, newestItem.updatedAt))) return null;
    return newestItem ? { ...newestItem, conflict: null } : null;
  }).filter(Boolean);

  const metadataSource = newerDate(remote.updatedAt, local.updatedAt) ? remote : local;
  const merged = {
    ...local,
    ...metadataSource,
    id: local.id,
    listId: local.id,
    ownerId: local.ownerId || remote.ownerId,
    inviteCode: local.inviteCode || remote.inviteCode,
    members: mergeMembers(local.members, remote.members, local.ownerId || remote.ownerId, removedMembers),
    permissions: normalizePermissions({ ...remote.permissions, ...local.permissions }),
    deletedAt: metadataSource.deletedAt,
    deletedByUserId: metadataSource.deletedByUserId,
    revision: Math.max(Number(local.revision || 0), Number(remote.revision || 0)),
    deletedItems,
    removedMembers,
    items
  };
  return normalizeListData(merged);
}

function mergeRemoteLists(remoteLists, options = {}) {
  if (!Array.isArray(remoteLists)) return false;
  let didChange = false;
  const accessibleRemoteIds = new Set();
  remoteLists.forEach((remoteListData) => {
    const remoteList = importedListFromValue(remoteListData);
    if (!remoteList) return;
    const index = lists.findIndex((listData) => listData.id === remoteList.id);
    if (remoteList.deletedAt) {
      if (index !== -1) {
        removeLocalList(remoteList.id, index);
        didChange = true;
      }
      return;
    }
    const hasAccess = remoteList.ownerId === currentUser.userId
      || (Boolean(memberFor(remoteList, currentUser.userId)) && !isMemberRemoved(remoteList, currentUser.userId));
    if (!hasAccess) {
      if (index !== -1) {
        removeLocalList(remoteList.id, index);
        didChange = true;
      }
      return;
    }
    accessibleRemoteIds.add(remoteList.id);
    if (index === -1) {
      lists.push(remoteList);
      didChange = true;
      return;
    }
    const mergedList = mergeList(lists[index], remoteList);
    if (JSON.stringify(mergedList) !== JSON.stringify(lists[index])) {
      lists[index] = mergedList;
      didChange = true;
    }
  });
  // An empty response can be a transient server/API state. Never delete local
  // data based on that response; deleted lists arrive as tombstones instead.
  const hasAuthoritativeSnapshot = remoteLists.length > 0 || lists.length === 0;
  const canPrune = options.pruneMissing
    && hasAuthoritativeSnapshot
    && activeWriteCount === 0
    && syncQueueLength() === 0;
  if (canPrune) {
    const retainedLists = lists.filter((listData) => accessibleRemoteIds.has(listData.id));
    if (retainedLists.length !== lists.length) {
      lists = retainedLists;
      activeListId = lists.some((listData) => listData.id === activeListId) ? activeListId : (lists[0]?.id ?? "");
      didChange = true;
    }
  }
  if (!didChange) return false;
  save({ broadcast: false, source: "remote" });
  render({ background: true });
  return true;
}

async function pullRemoteLists(reason = "auto") {
  if (!collaborationService.fetchSharedLists) return false;
  if (remoteSyncPromise) return remoteSyncPromise;
  const accountIdAtStart = currentUser.userId;
  const accountSessionAtStart = accountSessionVersion;
  const userAtStart = { ...currentUser };
  const mutationVersionAtStart = localMutationVersion;
  markSyncAttempt();
  const request = (async () => {
    try {
      const remoteLists = await collaborationService.fetchSharedLists(userAtStart);
      if (accountSessionAtStart !== accountSessionVersion || accountIdAtStart !== currentUser.userId) {
        return false;
      }
      if (!remoteLists) {
        markSyncError("Serverstand konnte nicht geladen werden");
        return false;
      }
      const didChange = mergeRemoteLists(remoteLists, {
        pruneMissing: mutationVersionAtStart === localMutationVersion
      });
      markSyncSuccess();
      if (!didChange && reason === "manual") renderNotes({ force: true });
      return true;
    } catch (error) {
      markSyncError(error);
      return false;
    }
  })();
  remoteSyncPromise = request;
  return remoteSyncPromise.finally(() => {
    if (remoteSyncPromise === request) remoteSyncPromise = null;
  });
}

function pullRemoteListsSoon(reason = "auto", delay = 450) {
  window.setTimeout(() => {
    pullRemoteLists(reason);
  }, delay);
}

function sanitizeSharedList(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (!item || typeof item.name !== "string" || !item.name.trim()) return null;
      const name = item.name.trim().slice(0, 80);
      const knownProduct = allProducts().find((product) => normalize(product.name) === normalize(name));
      const quantity = Math.max(1, Math.min(99, Math.round(Number(item.quantity) || 1)));

      return normalizeShoppingItem({
        id: typeof item.id === "string" ? item.id : knownProduct?.id ?? `geteilt:${Date.now()}:${index}`,
        name,
        shelfId: typeof item.shelfId === "string" ? item.shelfId : knownProduct?.shelfId ?? "geteilt",
        shelfTitle: typeof item.shelfTitle === "string" ? item.shelfTitle : knownProduct?.shelfTitle ?? "Geteilter Zettel",
        shelfIcon: typeof item.shelfIcon === "string" ? item.shelfIcon : knownProduct?.shelfIcon,
        quantity,
        done: Boolean(item.done),
        note: typeof item.note === "string" ? item.note.trim().slice(0, 48) : "",
        addedByUserId: item.addedByUserId,
        addedByDisplayName: item.addedByDisplayName,
        addedByAvatarUrl: item.addedByAvatarUrl,
        checkedByUserId: item.checkedByUserId,
        checkedAt: item.checkedAt,
        updatedByUserId: item.updatedByUserId,
        updatedAt: item.updatedAt
      }, index);
    })
    .filter(Boolean);
}

async function importSharedListFromUrl() {
  const url = new URL(window.location.href);
  const payload = url.searchParams.get("invite") ?? url.searchParams.get("zettel");
  if (!payload) return;
  if (!isAuthenticatedAccount()) return;

  try {
    const decoded = decodeShareValue(payload);
    const inviteList = importedListFromValue(decoded);
    if (!inviteList?.id || !inviteList.inviteCode) throw new Error("empty shared list");
    const remotePayload = await collaborationService.joinSharedList?.(inviteList, currentUser);
    const importedList = remotePayload ? importedListFromValue(remotePayload) : null;
    const hasAccess = importedList && (
      importedList.ownerId === currentUser.userId
      || (memberFor(importedList, currentUser.userId) && !isMemberRemoved(importedList, currentUser.userId))
    );
    if (!hasAccess) throw new Error("join failed");
    const existingIndex = lists.findIndex((listData) => listData.id === importedList.id);
    if (existingIndex === -1) {
      lists.push(importedList);
    } else {
      lists[existingIndex] = mergeList(lists[existingIndex], importedList);
    }
    activeListId = MartLogic.chooseActiveListId(
      activeListId,
      lists.map((listData) => listData.id),
      importedList.id
    );
    save({ broadcast: false });
  } catch {
    window.alert("Der geteilte Zettel konnte nicht verbunden werden. Bitte lass dir eine neue Einladung senden.");
  } finally {
    url.searchParams.delete("invite");
    url.searchParams.delete("zettel");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

function shareMemberRowsMarkup(listData) {
  const canRemove = canPerform(listData, "remove");
  return `
    <div class="share-members">
      ${listData.members.map((member) => `
        <div class="share-member-row">
          ${memberAvatarMarkup(member, member.userId === currentUser.userId ? "is-current" : "")}
          <span>${escapeText(cleanDisplayName(member.displayName, "Gast"))}</span>
          <small>${escapeText(roleLabels[member.role] ?? "Editor")}</small>
          ${canRemove && member.userId !== listData.ownerId ? `<button type="button" aria-label="${escapeText(member.displayName)} entfernen" data-remove-member="${escapeText(member.userId)}" data-list-id="${escapeText(listData.id)}">${icon("minus")}</button>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function shareBaseUrl() {
  const configuredUrl = window.MART_SUPABASE_CONFIG?.publicUrl;
  const isLocalPage = window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const sourceUrl = isLocalPage && typeof configuredUrl === "string" && configuredUrl.trim()
    ? configuredUrl
    : window.location.href;

  try {
    const url = new URL(sourceUrl, window.location.href);
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    return url;
  }
}

function openShareListModal(listData) {
  const url = shareBaseUrl();
  url.searchParams.set("invite", encodeShareValue({
    listId: listData.id,
    listName: listData.title,
    ownerId: listData.ownerId,
    inviteCode: listData.inviteCode
  }));
  const inviteCode = listData.inviteCode.slice(0, 8).toUpperCase();
  const qrMarkup = qrSvgMarkup(url.href);
  openModal(`
    <h2 id="modalTitle">Zettel teilen</h2>
    <div class="share-panel" data-invite-url="${escapeText(url.href)}" data-invite-title="${escapeText(listData.title)}">
      <div class="share-qr">
        <strong>Scannen und direkt beitreten</strong>
        <div class="share-qr-code" role="img" aria-label="QR-Code zum Beitritt in ${escapeText(listData.title)}">
          ${qrMarkup || icon("link")}
        </div>
        <small>Mit der Kamera des zweiten Geräts scannen. Der Zettel wird nach dem Öffnen sofort verbunden.</small>
      </div>
      <div class="invite-card">
        <span>Einladungscode</span>
        <strong>${escapeText(inviteCode)}</strong>
        <small>Wer den Link öffnet, tritt diesem Zettel bei.</small>
      </div>
      <label class="invite-link-field">
        <span>Einladungslink</span>
        <textarea readonly rows="4">${escapeText(url.href)}</textarea>
      </label>
      <div class="modal-actions">
        <button type="button" data-native-share>Teilen</button>
        <button type="button" data-copy-invite>Link kopieren</button>
        <button class="is-muted" type="button" data-regenerate-invite="${escapeText(listData.id)}">Link erneuern</button>
      </div>
      ${shareMemberRowsMarkup(listData)}
    </div>
  `);
}

async function shareList(listId = activeListId) {
  const listData = lists.find((item) => item.id === listId) ?? activeList();
  if (!listData || !canPerform(listData, "invite")) return;
  listData.inviteCode = listData.inviteCode || generateInviteCode();
  touchList(listData);
  save({ broadcast: false });
  const published = await publishListSnapshot([listData], "share", { queueOnFail: false });
  if (!published) {
    window.alert("Der Zettel konnte noch nicht online gespeichert werden. Es wurde kein Einladungslink erstellt. Bitte prüfe die Verbindung und versuche es erneut.");
    return;
  }
  openShareListModal(listData);
}

async function nativeShareInvite() {
  const panel = elements.modalContent.querySelector(".share-panel");
  const url = panel?.dataset.inviteUrl;
  if (!url) return;
  if (!navigator.share) {
    await copyInviteLink();
    return;
  }
  try {
    await navigator.share({ title: "Zettel", text: panel.dataset.inviteTitle ?? "Zettel", url });
  } catch (error) {
    if (error.name !== "AbortError") await copyInviteLink();
  }
}

async function copyInviteLink() {
  const panel = elements.modalContent.querySelector(".share-panel");
  const textarea = panel?.querySelector("textarea");
  const url = panel?.dataset.inviteUrl ?? textarea?.value;
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    window.alert("Link kopiert.");
  } catch {
    textarea?.select();
    document.execCommand("copy");
    window.alert("Link kopiert.");
  }
}

function removeMember(listId, userId) {
  const listData = listById(listId);
  if (!listData) return;
  if (!canPerform(listData, "remove") || userId === listData.ownerId) return;
  markMemberRemoved(listData, userId);
  touchList(listData);
  save();
  renderNotes();
}

function setMemberRole(listId, userId, role) {
  const listData = listById(listId);
  if (!listData) return;
  if (!canManageMembers(listData) || userId === listData.ownerId) return;
  const member = memberFor(listData, userId);
  if (!member) return;
  member.role = normalizeRole(role);
  touchList(listData);
  save();
  showMembers(listId);
}

function transferOwnership(listId, userId) {
  const listData = listById(listId);
  if (!listData) return;
  if (listData.ownerId !== currentUser.userId || userId === listData.ownerId) return;
  const nextOwner = memberFor(listData, userId);
  if (!nextOwner) return;
  if (!window.confirm(`${cleanDisplayName(nextOwner.displayName, "Gast")} wirklich zum Owner machen?`)) return;
  listData.ownerId = nextOwner.userId;
  listData.members = listData.members.map((member) => ({
    ...member,
    role: member.userId === nextOwner.userId ? collaborationRoles.owner : (member.userId === currentUser.userId ? collaborationRoles.editor : normalizeRole(member.role))
  }));
  touchList(listData);
  save();
  showMembers(listId);
}

async function regenerateInvite(listId) {
  const listData = listById(listId);
  if (!listData) return;
  if (!canPerform(listData, "invite")) return;
  const published = await MartLogic.rotateInviteWithRollback({
    target: listData,
    nextCode: generateInviteCode(),
    mutate(target, nextCode) {
      target.inviteCode = nextCode;
      touchList(target);
      save({ broadcast: false });
    },
    persist: () => publishListSnapshot([listData], "share", { queueOnFail: false }),
    rollback: () => save({ broadcast: false })
  });
  if (!published) {
    window.alert("Der Einladungslink konnte nicht erneuert werden. Der bisherige Link bleibt gültig. Bitte prüfe die Verbindung und versuche es erneut.");
    return;
  }
  openShareListModal(listData);
}

function markMemberRemoved(listData, userId, removedByUserId = currentUser.userId) {
  listData.removedMembers = mergeRemovedMembers(listData.removedMembers, [{
    userId,
    removedByUserId,
    removedAt: isoNow()
  }]);
  listData.members = listData.members.filter((member) => member.userId !== userId);
}

function showMembers(listId = activeListId) {
  const listData = listById(listId);
  if (!listData) return;
  const members = activeMembersFor(listData);
  const canRemove = canPerform(listData, "remove");
  const canTransferOwner = listData.ownerId === currentUser.userId;
  openModal(`
    <h2 id="modalTitle">Aktive Nutzer</h2>
    <div class="members-panel">
      <p>${escapeText(listData.title)}</p>
      <div class="share-members">
        ${members.map((member) => `
          <div class="share-member-row">
            ${memberAvatarMarkup(member, member.userId === currentUser.userId ? "is-current" : "")}
            <span>${escapeText(cleanDisplayName(member.displayName, "Gast"))}</span>
            <small>${escapeText(roleLabels[member.role] ?? "Editor")}</small>
            ${canRemove && member.userId !== listData.ownerId ? `
              <div class="member-actions">
                <button class="${member.role === collaborationRoles.editor ? "is-active" : ""}" type="button" data-member-role="editor" data-member-id="${escapeText(member.userId)}" data-list-id="${escapeText(listData.id)}">Bearbeiten</button>
                <button class="${member.role === collaborationRoles.viewer ? "is-active" : ""}" type="button" data-member-role="viewer" data-member-id="${escapeText(member.userId)}" data-list-id="${escapeText(listData.id)}">Lesen</button>
                ${canTransferOwner ? `<button type="button" data-transfer-owner="${escapeText(member.userId)}" data-list-id="${escapeText(listData.id)}">Owner</button>` : ""}
                <button class="is-danger" type="button" aria-label="${escapeText(member.displayName)} entfernen" data-remove-member="${escapeText(member.userId)}" data-list-id="${escapeText(listData.id)}" data-after-remove="members">${icon("minus")}</button>
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `);
}

async function leaveSharedList(listData, index) {
  if (listData.ownerId === currentUser.userId) {
    window.alert("Als Owner kannst du diesen geteilten Zettel nicht verlassen. Entferne zuerst die anderen Nutzer.");
    return;
  }
  const remotePayload = await collaborationService.leaveSharedList?.(listData, currentUser);
  if (!remotePayload) {
    window.alert("Der geteilte Zettel konnte gerade nicht verlassen werden.");
    return;
  }
  removeLocalList(listData.id, index);
  save({ broadcast: false });
  renderNotes();
}

function openModal(content) {
  elements.modalContent.innerHTML = content;
  elements.modalLayer.classList.remove("is-hidden");
  elements.modalLayer.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (modalSearchRenderTimer) {
    window.clearTimeout(modalSearchRenderTimer);
    modalSearchRenderTimer = 0;
  }
  if (devicePairingPollTimer) {
    window.clearTimeout(devicePairingPollTimer);
    devicePairingPollTimer = 0;
  }
  elements.modalLayer.classList.add("is-hidden");
  elements.modalLayer.setAttribute("aria-hidden", "true");
  elements.modalContent.innerHTML = "";
  flushPendingNotesRender();
}

function showImprint() {
  openModal(`
    <h2 id="modalTitle">Impressum</h2>
    <div class="modal-copy">
      <p><strong>Zettel</strong></p>
      <p>Angaben zum Betreiber werden hier ergänzt.</p>
      <p>Kontakt: bitte noch eintragen</p>
      <p>Verantwortlich für den Inhalt: bitte noch eintragen</p>
    </div>
  `);
}

function bugReportText() {
  return [
    "Bugreport für Zettel",
    "",
    `Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
    `Adresse: ${window.location.href}`,
    `Gerät/Browser: ${navigator.userAgent}`,
    "",
    "Was ist passiert?",
    ""
  ].join("\n");
}

function showBugreport() {
  openModal(`
    <h2 id="modalTitle">Bugreport</h2>
    <div class="bug-form">
      <textarea id="bugReportText" rows="9">${escapeText(bugReportText())}</textarea>
      <div class="modal-actions">
        <button type="button" data-copy-bug>Bericht kopieren</button>
        <a class="modal-link" href="https://github.com/kenni1116-a11y/mart-/issues/new" target="_blank" rel="noreferrer">GitHub öffnen</a>
      </div>
    </div>
  `);
}

function showBackgroundOptions() {
  openModal(`
    <h2 id="modalTitle">Hintergrund</h2>
    <div class="background-options">
      <button class="background-choice ${backgroundTheme === "paper" ? "is-active" : ""}" type="button" data-background="paper">
        <span class="background-swatch background-swatch-paper"></span>
        Papier
      </button>
      <button class="background-choice ${backgroundTheme === "linen" ? "is-active" : ""}" type="button" data-background="linen">
        <span class="background-swatch background-swatch-linen"></span>
        Leinen
      </button>
      <button class="background-choice ${backgroundTheme === "clean" ? "is-active" : ""}" type="button" data-background="clean">
        <span class="background-swatch background-swatch-clean"></span>
        Hell
      </button>
    </div>
  `);
}

function showDataTools() {
  openModal(`
    <h2 id="modalTitle">Daten hinzufügen</h2>
    <div class="data-tools">
      <button class="data-tool-button" type="button" data-open-price-fetch>
        ${icon("refresh")}
        <span>
          <strong>Preise abrufen</strong>
          <small>Täglich aktualisierbare Mock-Preise für die nächsten Märkte.</small>
        </span>
      </button>
      <button class="data-tool-button" type="button" data-open-market-search>
        ${icon("mapPin")}
        <span>
          <strong>Märkte suchen</strong>
          <small>PLZ, Ort, Marktname oder Adresse suchen und Märkte speichern.</small>
        </span>
      </button>
    </div>
  `);
}

function priceFetchMarketRows() {
  const nearest = topNearbyMarkets(3);
  if (!nearest.length) return '<p class="empty-state">Noch keine Märkte vorhanden.</p>';
  return `
    <div class="market-mini-list">
      ${nearest.map((market) => `
        <button class="market-mini-row" type="button" data-market-detail="${escapeText(market.id)}">
          <span class="market-mini-icon">${icon(market.icon)}</span>
          <span>
            <strong>${escapeText(market.name)}</strong>
            <small>${escapeText(market.kategorie)} · ${escapeText(formatDistance(market.entfernung))}</small>
          </span>
        </button>
      `).join("")}
    </div>
  `;
}

function showPriceFetch(statusText = "") {
  openModal(`
    <h2 id="modalTitle">Preise abrufen</h2>
    <div class="price-fetch-panel">
      <div class="price-sync-card">
        <span>${icon("database")}</span>
        <div>
          <strong>Letzte Aktualisierung</strong>
          <small>${escapeText(formatDateTime(priceSyncState.lastUpdated))} · Quelle: ${escapeText(priceSyncState.source || "mock")}</small>
        </div>
      </div>
      ${statusText ? `<p class="status-note">${escapeText(statusText)}</p>` : ""}
      <div>
        <h3>Nächste 3 Märkte</h3>
        ${priceFetchMarketRows()}
      </div>
      <div class="modal-actions">
        <button type="button" data-refresh-prices>${icon("refresh")} Jetzt Preise abrufen</button>
        <button type="button" data-open-market-search>${icon("mapPin")} Märkte suchen</button>
      </div>
    </div>
  `);
}

function marketPreviewMarkup(market) {
  if (!market) return "";
  const isAdded = Boolean(market.isUserAdded);
  return `
    <aside class="market-preview">
      <button class="market-preview-add ${isAdded ? "is-added" : ""}" type="button" data-add-market="${escapeText(market.id)}" aria-label="${escapeText(market.name)} speichern">
        ${icon(isAdded ? "check" : "store")}
        ${isAdded ? "" : icon("plus")}
      </button>
      <div class="market-preview-copy">
        <strong>${escapeText(market.name)}</strong>
        <span>${escapeText(market.kategorie)} · ${escapeText(formatDistance(market.entfernung))}</span>
        <small>${escapeText(marketAddressLine(market))}</small>
        <small>${escapeText(market.websiteUrl || "Website folgt")}</small>
      </div>
      <div class="market-preview-actions">
        <button type="button" data-market-detail="${escapeText(market.id)}">Details</button>
        <button type="button" data-open-prospect="${escapeText(market.id)}">${icon("external")} Prospekt</button>
      </div>
    </aside>
  `;
}

function marketResultRowsMarkup(matches, selectedMarketId) {
  if (!matches.length) return '<p class="empty-state">Kein Markt gefunden.</p>';
  return `
    <div class="market-result-list">
      ${matches.map((market) => `
        <button class="market-result-row ${market.id === selectedMarketId ? "is-selected" : ""}" type="button" data-select-market="${escapeText(market.id)}">
          <span class="market-mini-icon">${icon(market.icon)}</span>
          <span>
            <strong>${escapeText(market.name)}</strong>
            <small>${escapeText(marketAddressLine(market))}</small>
          </span>
          <em>${escapeText(formatDistance(market.entfernung))}</em>
        </button>
      `).join("")}
    </div>
  `;
}

function renderMarketSearchResults(query = marketSearchState.query, selectedMarketId = marketSearchState.selectedMarketId) {
  const container = elements.modalContent.querySelector("#marketSearchResults");
  if (!container) return;
  const matches = marketService.searchMarkets(query).map((market) => marketById(market.id) ?? market);
  const selected = matches.find((market) => market.id === selectedMarketId) ?? matches[0] ?? null;
  marketSearchState = {
    query,
    selectedMarketId: selected?.id ?? ""
  };
  container.innerHTML = `
    <div class="mock-map" aria-label="Kartenansicht">
      ${matches.slice(0, 12).map((market) => `
        <button class="map-marker ${market.id === selected?.id ? "is-active" : ""}" type="button" style="${marketMapStyle(market)}" data-select-market="${escapeText(market.id)}" aria-label="${escapeText(market.name)}">
          ${icon("mapPin")}
        </button>
      `).join("")}
    </div>
    ${marketPreviewMarkup(selected)}
    ${marketResultRowsMarkup(matches, selected?.id ?? "")}
  `;
}

function showMarketSearch(initialQuery = "") {
  marketSearchState = { query: initialQuery, selectedMarketId: "" };
  openModal(`
    <h2 id="modalTitle">Märkte suchen</h2>
    <div class="market-search-panel">
      <div class="search-row modal-search-row">
        ${icon("mapPin")}
        <input id="marketSearchInput" type="search" placeholder="PLZ, Ort, Marktname oder Adresse" value="${escapeText(initialQuery)}" data-market-search-input>
      </div>
      <div id="marketSearchResults"></div>
    </div>
  `);
  renderMarketSearchResults(initialQuery);
  window.setTimeout(() => elements.modalContent.querySelector("#marketSearchInput")?.focus(), 0);
}

function showMarketDetail(marketId) {
  const market = marketById(marketId);
  if (!market) return;
  openModal(`
    <h2 id="modalTitle">${escapeText(market.name)}</h2>
    <div class="market-detail-panel">
      <div class="market-detail-head">
        <span class="market-detail-icon">${icon(market.icon)}</span>
        <div>
          <strong>${escapeText(market.kategorie)}</strong>
          <small>${escapeText(formatDistance(market.entfernung))} entfernt · ${escapeText(market.source)}</small>
        </div>
      </div>
      <div class="market-detail-grid">
        <span>Adresse</span>
        <strong>${escapeText(marketAddressLine(market))}</strong>
        <span>Website</span>
        <strong>${escapeText(market.websiteUrl || "Noch nicht hinterlegt")}</strong>
        <span>Prospekt</span>
        <strong>${escapeText(market.prospectUrl || "Noch nicht hinterlegt")}</strong>
      </div>
      <div class="modal-actions">
        <button type="button" data-open-prospect="${escapeText(market.id)}">${icon("external")} Werbekatalog öffnen</button>
        <button type="button" data-add-market="${escapeText(market.id)}">${icon(market.isUserAdded ? "check" : "plus")} ${market.isUserAdded ? "Gespeichert" : "Zu meinen Märkten"}</button>
      </div>
    </div>
  `);
}

function marketPriceRowsMarkup(product, query = "") {
  const cleanQuery = normalize(query);
  const nearest = topNearbyMarkets(3);
  const searchedMarkets = markets
    .filter((market) => marketMatches(market, cleanQuery))
    .sort(sortMarketsByDistance)
    .slice(0, cleanQuery ? 20 : 12);
  const seen = new Set();
  const sections = [
    ["Die 3 nächsten Märkte", nearest],
    ["Weitere Märkte", searchedMarkets]
  ];
  return sections.map(([title, items]) => {
    const rows = items.filter((market) => {
      const key = `${title}:${market.id}`;
      if (title !== "Die 3 nächsten Märkte" && seen.has(market.id)) return false;
      seen.add(market.id);
      return !seen.has(key);
    });
    if (!rows.length) return "";
    return `
      <section class="market-price-section">
        <h3>${escapeText(title)}</h3>
        <div class="market-price-list">
          ${rows.map((market) => {
            const price = productPrices.find((entry) => entry.productId === product.id && entry.marketId === market.id);
            return `
              <article class="market-price-row">
                <button class="market-price-main" type="button" data-market-detail="${escapeText(market.id)}">
                  <span class="market-mini-icon">${icon(market.icon)}</span>
                  <span>
                    <strong>${escapeText(market.name)}</strong>
                    <small>${escapeText(marketAddressLine(market))}</small>
                  </span>
                </button>
                <div class="market-price-value">
                  <strong>${price ? escapeText(formatPrice(price.price, price.currency)) : "Kein Preis"}</strong>
                  <small>${price ? escapeText(formatDateTime(price.lastUpdated)) : "Noch keine Daten"}</small>
                </div>
                <div class="market-price-actions">
                  <button type="button" data-open-prospect="${escapeText(market.id)}" title="Werbekatalog öffnen" aria-label="Werbekatalog öffnen">${icon("external")}</button>
                  <button type="button" data-add-market="${escapeText(market.id)}" title="Markt speichern" aria-label="Markt speichern">${icon(market.isUserAdded ? "check" : "plus")}</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("") || '<p class="empty-state">Keine Märkte gefunden.</p>';
}

function renderProductPriceRows(query = productPriceState.query) {
  const rows = elements.modalContent.querySelector("#productPriceRows");
  if (!rows) return;
  const product = allProducts().find((item) => item.id === productPriceState.productId);
  if (!product) return;
  productPriceState.query = query;
  rows.innerHTML = marketPriceRowsMarkup(product, query);
}

function showProductMarketPrices(productId) {
  const product = allProducts().find((item) => item.id === productId);
  if (!product) return;
  productPriceState = { productId, query: "" };
  openModal(`
    <h2 id="modalTitle">${escapeText(product.name)}</h2>
    <div class="product-price-panel">
      <p class="product-price-summary">${escapeText(priceSummaryForProduct(product))}</p>
      <div class="modal-actions">
        <button type="button" data-check-prospect="${escapeText(product.id)}">${icon("tag")} Angebote im Prospekt prüfen</button>
        <button type="button" data-open-market-search>${icon("mapPin")} Weitere Märkte hinzufügen</button>
      </div>
      <div class="search-row modal-search-row">
        ${icon("mapPin")}
        <input id="priceMarketSearchInput" type="search" placeholder="Marktname oder Adresse" data-price-market-search>
      </div>
      <div id="productPriceRows"></div>
    </div>
  `);
  renderProductPriceRows("");
  window.setTimeout(() => elements.modalContent.querySelector("#priceMarketSearchInput")?.focus(), 0);
}

function showMore() {
  openModal(`
    <h2 id="modalTitle">Mehr</h2>
    <div class="modal-actions modal-actions-stack">
      <button type="button" data-open-profile>Account</button>
      <button type="button" data-open-background>Hintergrund anpassen</button>
      <button type="button" data-open-data-tools>Daten hinzufügen</button>
    </div>
  `);
}

function showProfile() {
  openModal(`
    <h2 id="modalTitle">Account</h2>
    <div class="profile-form account-panel">
      <div class="profile-preview account-identity">
        ${memberAvatarMarkup(currentUser, "is-current")}
        <span>
          <strong>${escapeText(currentUser.displayName)}</strong>
          <small>${escapeText(currentUser.username)}</small>
        </span>
      </div>
      <label class="account-field" for="profileNameInput">
        <span>Anzeigename</span>
        <input id="profileNameInput" type="text" maxlength="24" value="${escapeText(currentUser.displayName)}" placeholder="Name">
      </label>
      <label class="account-field" for="profileAvatarInput">
        <span>Avatar-Link</span>
        <input id="profileAvatarInput" type="url" maxlength="240" value="${escapeText(currentUser.avatarUrl)}" placeholder="Optional">
      </label>
      <div class="modal-actions">
        <button type="button" data-save-profile>Speichern</button>
        <button type="button" data-open-devices>Geräte</button>
      </div>
      <div class="account-security-row ${currentUser.recoveryReady ? "is-secured" : ""}">
        <span>${currentUser.recoveryReady ? icon("check") : icon("warning")}</span>
        <div>
          <strong>${currentUser.recoveryReady ? "Account gesichert" : "Noch nicht gesichert"}</strong>
          <small>${currentUser.recoveryReady ? "Ein Wiederherstellungscode ist aktiv." : "Ohne Code ist der Account nach einer Neuinstallation nicht wiederherstellbar."}</small>
        </div>
      </div>
      <div class="modal-actions modal-actions-stack account-secondary-actions">
        <button type="button" data-create-recovery-code>${currentUser.recoveryReady ? "Neuen Wiederherstellungscode erzeugen" : "Account sichern"}</button>
        <button type="button" class="is-muted" data-open-account-recovery>Account wiederherstellen</button>
      </div>
    </div>
  `);
}

async function saveProfile() {
  const nameInput = elements.modalContent.querySelector("#profileNameInput");
  const avatarInput = elements.modalContent.querySelector("#profileAvatarInput");
  if (!nameInput) return;
  currentUser = {
    ...currentUser,
    displayName: cleanDisplayName(nameInput.value),
    avatarUrl: typeof avatarInput?.value === "string" ? avatarInput.value.trim().slice(0, 240) : ""
  };
  saveCurrentUser();
  lists.forEach((listData) => {
    const member = memberFor(listData, currentUser.userId);
    if (member) {
      member.displayName = currentUser.displayName;
      member.avatarUrl = currentUser.avatarUrl;
    }
    listData.items.forEach((item) => {
      if (item.addedByUserId === currentUser.userId) {
        item.addedByDisplayName = currentUser.displayName;
        item.addedByAvatarUrl = currentUser.avatarUrl;
      }
    });
  });
  const profileResult = await collaborationService.upsertProfile?.(currentUser);
  if (profileResult?.ok === false) {
    window.alert("Der Name konnte gerade nicht mit dem Account synchronisiert werden.");
  }
  save();
  updatePresence();
  closeModal();
  render();
}

function accountFlowError(error) {
  const value = typeof error === "string" ? error : (error?.error ?? error?.message ?? "");
  const messages = {
    invalid_code: "Der Wiederherstellungscode ist ungültig.",
    rate_limited: "Zu viele Versuche. Bitte warte eine Stunde.",
    current_account_not_empty: "Auf diesem Gerät wurden bereits Zettel erstellt. Die Wiederherstellung ist nur in einem leeren, neuen Account möglich.",
    invalid_pairing: "Dieser QR-Code ist ungültig oder abgelaufen.",
    pairing_in_use: "Dieser QR-Code wird bereits von einem anderen Gerät verwendet.",
    already_connected: "Dieses Gerät gehört bereits zum Account.",
    pairing_not_ready: "Das neue Gerät wartet noch nicht auf Freigabe.",
    pending_account_not_empty: "Das neue Gerät enthält bereits eigene Zettel.",
    pairing_not_found: "Die Geräteverbindung wurde nicht gefunden.",
    device_required: "Der Geräte-Account ist nicht verbunden."
  };
  return messages[value] ?? authErrorMessage(value);
}

function clearLocalAccountCache(accountId) {
  if (!accountId) return;
  [storageKeys.currentUser, storageKeys.lists, storageKeys.activeList, storageKeys.outbox, storageKeys.syncQueue]
    .forEach((key) => localStorage.removeItem(accountStorageKey(key, accountId)));
}

async function showDevices() {
  openModal(`
    <h2 id="modalTitle">Geräte</h2>
    <div class="account-devices-panel" data-account-devices>
      <p class="account-loading">Geräte werden geladen …</p>
    </div>
  `);
  try {
    const devices = await collaborationService.listDevices?.();
    const panel = elements.modalContent.querySelector("[data-account-devices]");
    if (!panel) return;
    panel.innerHTML = `
      <div class="account-device-list">
        ${devices.map((device) => `
          <div class="account-device-row ${device.is_current ? "is-current" : ""}">
            <span class="account-device-icon">${icon("phone")}</span>
            <span class="account-device-copy">
              <strong>${escapeText(device.label || "Gerät")}${device.is_current ? " · dieses Gerät" : ""}</strong>
              <small>${escapeText(device.platform || "Web-App")} · zuletzt ${escapeText(formatDateTime(device.last_seen_at))}</small>
            </span>
            <button type="button" title="Gerät benennen" aria-label="Gerät benennen" data-rename-account-device="${escapeText(device.device_id)}" data-device-label="${escapeText(device.label || "Gerät")}">${icon("pencil")}</button>
            ${device.is_current ? "" : `<button class="is-danger" type="button" title="Gerät entfernen" aria-label="Gerät entfernen" data-remove-account-device="${escapeText(device.device_id)}">${icon("trash")}</button>`}
          </div>
        `).join("") || '<p class="empty-state">Keine Geräte gefunden.</p>'}
      </div>
      <div class="modal-actions">
        <button type="button" data-add-account-device>${icon("plus")} Gerät hinzufügen</button>
        <button type="button" class="is-muted" data-open-profile>Zurück zum Account</button>
      </div>
    `;
  } catch (error) {
    const panel = elements.modalContent.querySelector("[data-account-devices]");
    if (panel) panel.innerHTML = `<p class="empty-state">${escapeText(accountFlowError(error))}</p>`;
  }
}

function showRenameDevice(deviceId, label) {
  openModal(`
    <h2 id="modalTitle">Gerät benennen</h2>
    <div class="rename-form" data-device-id="${escapeText(deviceId)}">
      <input id="deviceNameInput" type="text" maxlength="40" value="${escapeText(label)}" placeholder="Gerätename">
      <div class="modal-actions">
        <button type="button" data-save-device-name>Speichern</button>
        <button type="button" class="is-muted" data-open-devices>Abbrechen</button>
      </div>
    </div>
  `);
  window.setTimeout(() => elements.modalContent.querySelector("#deviceNameInput")?.select(), 0);
}

async function saveDeviceName() {
  const form = elements.modalContent.querySelector("[data-device-id]");
  const input = elements.modalContent.querySelector("#deviceNameInput");
  if (!form || !input) return;
  const label = cleanText(input.value, "Gerät", 40);
  const result = await collaborationService.renameDevice?.(form.dataset.deviceId, label);
  if (result?.ok === false) {
    window.alert(accountFlowError(result));
    return;
  }
  if (form.dataset.deviceId === currentUser.deviceId) {
    currentUser.deviceLabel = label;
    saveCurrentUser();
  }
  showDevices();
}

async function removeAccountDevice(deviceId) {
  if (!window.confirm("Dieses Gerät wirklich vom Account entfernen?")) return;
  const result = await collaborationService.removeDevice?.(deviceId);
  if (result?.ok === false) {
    window.alert(accountFlowError(result));
    return;
  }
  showDevices();
}

function showRecoveryCodeResult(code, title = "Account gesichert") {
  openModal(`
    <h2 id="modalTitle">${escapeText(title)}</h2>
    <div class="recovery-code-panel" data-recovery-code="${escapeText(code)}">
      <p>Bewahre diesen Code sicher auf. Er wird nur jetzt vollständig angezeigt.</p>
      <code>${escapeText(code)}</code>
      <div class="modal-actions">
        <button type="button" data-copy-recovery-code>${icon("copy")} Code kopieren</button>
        <button type="button" class="is-muted" data-open-profile>Fertig</button>
      </div>
    </div>
  `);
}

async function createRecoveryCode() {
  const result = await collaborationService.rotateRecoveryCode?.();
  if (!result?.ok || !result.recoveryCode) {
    window.alert(accountFlowError(result));
    return;
  }
  currentUser.recoveryReady = true;
  saveCurrentUser();
  showRecoveryCodeResult(result.recoveryCode);
}

async function copyRecoveryCode() {
  const panel = elements.modalContent.querySelector("[data-recovery-code]");
  const code = panel?.dataset.recoveryCode;
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code);
    window.alert("Wiederherstellungscode kopiert.");
  } catch {
    window.prompt("Wiederherstellungscode kopieren:", code);
  }
}

function showAccountRecovery() {
  openModal(`
    <h2 id="modalTitle">Account wiederherstellen</h2>
    <div class="recovery-form">
      <p>Der aktuelle Geräte-Account muss noch leer sein. Der verwendete Code wird anschließend automatisch ersetzt.</p>
      <input id="recoveryCodeInput" type="text" maxlength="48" autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="ZTL-XXXX-XXXX-…">
      <p class="form-status" id="recoveryStatus" role="status"></p>
      <div class="modal-actions">
        <button type="button" data-submit-account-recovery>Wiederherstellen</button>
        <button type="button" class="is-muted" data-open-profile>Abbrechen</button>
      </div>
    </div>
  `);
  window.setTimeout(() => elements.modalContent.querySelector("#recoveryCodeInput")?.focus(), 0);
}

async function restoreAccountFromCode() {
  const input = elements.modalContent.querySelector("#recoveryCodeInput");
  const status = elements.modalContent.querySelector("#recoveryStatus");
  const code = input?.value.trim() ?? "";
  if (!code) return;
  if (status) status.textContent = "Account wird verbunden …";
  const previousAccountId = currentUser.userId;
  const result = await collaborationService.recoverAccount?.(code, defaultDeviceLabel(), devicePlatform());
  if (!result?.ok) {
    if (status) status.textContent = accountFlowError(result);
    return;
  }
  clearLocalAccountCache(previousAccountId);
  await activateAccount(currentAuthUser, { force: true, handlePairing: false });
  showRecoveryCodeResult(result.recoveryCode, "Account wiederhergestellt");
}

function pairingPayloadFromUrl() {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  const pairingId = hashParams.get("pair") ?? url.searchParams.get("pair") ?? "";
  const pairingToken = hashParams.get("pairToken") ?? url.searchParams.get("pairToken") ?? "";
  if (!pairingId && !pairingToken) return null;
  hashParams.delete("pair");
  hashParams.delete("pairToken");
  url.searchParams.delete("pair");
  url.searchParams.delete("pairToken");
  url.hash = hashParams.toString();
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  if (!isUuid(pairingId) || !/^[a-f0-9]{48}$/i.test(pairingToken)) return { invalid: true };
  return { pairingId, pairingToken };
}

function devicePairingUrl(pairing) {
  const url = shareBaseUrl();
  url.hash = new URLSearchParams({
    pair: pairing.pairingId,
    pairToken: pairing.pairingToken
  }).toString();
  return url.href;
}

function qrSvgMarkup(value) {
  try {
    if (typeof window.qrcode !== "function") return "";
    const qr = window.qrcode(0, "M");
    qr.addData(value);
    qr.make();
    return qr.createSvgTag({ cellSize: 5, margin: 0, scalable: true });
  } catch {
    return "";
  }
}

async function startDevicePairing() {
  const result = await collaborationService.createDevicePairing?.();
  if (!result?.ok) {
    window.alert(accountFlowError(result));
    return;
  }
  const pairingUrl = devicePairingUrl(result);
  const qrMarkup = qrSvgMarkup(pairingUrl);
  openModal(`
    <h2 id="modalTitle">Gerät hinzufügen</h2>
    <div class="device-pairing-panel" data-device-pairing="${escapeText(result.pairingId)}" data-pairing-url="${escapeText(pairingUrl)}">
      <p>Scanne den QR-Code mit dem neuen Gerät. Er ist fünf Minuten gültig.</p>
      <div class="device-qr">${qrMarkup || icon("link")}</div>
      <div class="pairing-compare-code">
        <span>Vergleichscode</span>
        <strong>${escapeText(result.confirmationCode)}</strong>
      </div>
      <div class="pairing-status" data-pairing-status>Warte auf das neue Gerät …</div>
      <div class="modal-actions">
        <button type="button" data-copy-pairing-link>${icon("copy")} Link kopieren</button>
        <button type="button" class="is-muted" data-cancel-device-pairing="${escapeText(result.pairingId)}">Abbrechen</button>
      </div>
    </div>
  `);
  pollOwnerPairing(result.pairingId);
}

async function copyPairingLink() {
  const panel = elements.modalContent.querySelector("[data-pairing-url]");
  const url = panel?.dataset.pairingUrl;
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    window.alert("Gerätelink kopiert.");
  } catch {
    window.prompt("Gerätelink kopieren:", url);
  }
}

function schedulePairingPoll(callback) {
  if (devicePairingPollTimer) window.clearTimeout(devicePairingPollTimer);
  devicePairingPollTimer = window.setTimeout(callback, 1600);
}

async function pollOwnerPairing(pairingId) {
  const panel = elements.modalContent.querySelector(`[data-device-pairing="${pairingId}"]`);
  if (!panel) return;
  const statusElement = panel.querySelector("[data-pairing-status]");
  const result = await collaborationService.devicePairingStatus?.(pairingId);
  if (!result?.ok) {
    if (statusElement) statusElement.textContent = accountFlowError(result);
    return;
  }
  if (result.status === "pending") {
    if (statusElement) {
      statusElement.innerHTML = `
        <strong>${escapeText(result.pendingDeviceLabel || "Neues Gerät")}</strong>
        <span>möchte verbunden werden.</span>
        <button type="button" data-approve-device-pairing="${escapeText(pairingId)}">Gerät bestätigen</button>
      `;
    }
    schedulePairingPoll(() => pollOwnerPairing(pairingId));
    return;
  }
  if (result.status === "approved") {
    if (statusElement) statusElement.innerHTML = `<strong>Gerät verbunden.</strong><button type="button" data-open-devices>Geräte anzeigen</button>`;
    return;
  }
  if (result.status === "expired" || result.status === "cancelled") {
    if (statusElement) statusElement.textContent = result.status === "expired" ? "Der QR-Code ist abgelaufen." : "Verbindung abgebrochen.";
    return;
  }
  schedulePairingPoll(() => pollOwnerPairing(pairingId));
}

async function approveDevicePairing(pairingId) {
  const result = await collaborationService.approveDevicePairing?.(pairingId);
  if (!result?.ok) {
    window.alert(accountFlowError(result));
    return;
  }
  pollOwnerPairing(pairingId);
}

async function cancelDevicePairing(pairingId) {
  await collaborationService.cancelDevicePairing?.(pairingId);
  showDevices();
}

async function requestPendingDevicePairing() {
  const pairing = pendingDevicePairing;
  if (!pairing) return;
  if (pairing.invalid) {
    pendingDevicePairing = null;
    window.alert("Der QR-Code ist ungültig.");
    return;
  }
  const result = await collaborationService.requestDevicePairing?.(
    pairing.pairingId,
    pairing.pairingToken,
    defaultDeviceLabel(),
    devicePlatform()
  );
  if (!result?.ok) {
    pendingDevicePairing = null;
    window.alert(accountFlowError(result));
    return;
  }
  pendingDevicePairing = { ...pairing, requested: true };
  openModal(`
    <h2 id="modalTitle">Gerät verbinden</h2>
    <div class="device-pairing-wait" data-pending-device-pairing="${escapeText(pairing.pairingId)}">
      <p>Bestätige auf dem bereits verbundenen Gerät denselben Vergleichscode:</p>
      <strong>${escapeText(result.confirmationCode)}</strong>
      <span data-pending-pairing-status>Warte auf Bestätigung …</span>
    </div>
  `);
  pollPendingPairing(pairing.pairingId);
}

async function pollPendingPairing(pairingId) {
  const panel = elements.modalContent.querySelector(`[data-pending-device-pairing="${pairingId}"]`);
  if (!panel) return;
  const statusElement = panel.querySelector("[data-pending-pairing-status]");
  const result = await collaborationService.devicePairingStatus?.(pairingId);
  if (!result?.ok) {
    if (statusElement) statusElement.textContent = accountFlowError(result);
    return;
  }
  if (result.status === "approved") {
    const previousAccountId = currentUser.userId;
    pendingDevicePairing = null;
    clearLocalAccountCache(previousAccountId);
    await activateAccount(currentAuthUser, { force: true, handlePairing: false });
    openModal(`
      <h2 id="modalTitle">Gerät verbunden</h2>
      <div class="modal-copy"><p>Dieser Account ist jetzt auch auf diesem Gerät verfügbar.</p></div>
      <div class="modal-actions"><button type="button" data-open-devices>Geräte anzeigen</button></div>
    `);
    return;
  }
  if (result.status === "expired" || result.status === "cancelled") {
    pendingDevicePairing = null;
    if (statusElement) statusElement.textContent = result.status === "expired" ? "Der QR-Code ist abgelaufen." : "Die Verbindung wurde abgebrochen.";
    return;
  }
  schedulePairingPoll(() => pollPendingPairing(pairingId));
}

async function copyBugReport() {
  const textarea = elements.modalContent.querySelector("#bugReportText");
  if (!textarea) return;
  try {
    await navigator.clipboard.writeText(textarea.value);
    window.alert("Bugreport kopiert.");
  } catch {
    textarea.select();
    document.execCommand("copy");
    window.alert("Bugreport kopiert.");
  }
}

function setView(view) {
  activeView = view;
  selectedShelfId = view === "market" ? selectedShelfId : null;
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  render();
}

function openShelf(id) {
  selectedShelfId = id;
  activeView = "products";
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", false));
  render();
}

function backToShelves() {
  selectedShelfId = null;
  activeView = "market";
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === "market"));
  render();
}

function triggerHapticFeedback() {
  if (!navigator.vibrate) return;
  navigator.vibrate(28);
}

function showAddFeedback(button) {
  button.classList.add("is-added");
  button.innerHTML = icon("check");
  button.setAttribute("aria-label", "Hinzugefügt");
  button.setAttribute("title", "Hinzugefügt");

  window.setTimeout(() => {
    if (!button.isConnected) return;
    button.classList.remove("is-added");
    button.innerHTML = icon("cart");
    button.setAttribute("aria-label", "Auf den Zettel");
    button.setAttribute("title", "Auf den Zettel");
  }, 720);
}

function addToList(product, listId = activeListId) {
  const currentList = lists.find((listData) => listData.id === listId) ?? activeList();
  if (!currentList) return false;
  if (!canPerform(currentList, "add")) return false;
  triggerHapticFeedback();
  const items = currentList.items;
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
    touchItem(existing, currentList);
  } else {
    const item = normalizeShoppingItem({
      ...product,
      quantity: 1,
      done: false,
      addedByUserId: currentUser.userId,
      addedByDisplayName: currentUser.displayName,
      addedByAvatarUrl: currentUser.avatarUrl,
      updatedByUserId: currentUser.userId,
      updatedAt: isoNow()
    });
    items.push(item);
    touchList(currentList);
  }
  save();
  renderNotes();
  return true;
}

function addManualItem(listId, input) {
  if (!input) return false;
  const name = (input.value || manualDrafts[listId] || "").trim();
  if (!name) return false;
  manualDrafts[listId] = "";
  input.value = "";
  const added = addToList({
    id: `manual:${Date.now()}`,
    name,
    shelfId: "manual",
    shelfTitle: "Eigener Artikel"
  }, listId);
  if (!added) {
    manualDrafts[listId] = name;
    input.value = name;
    return false;
  }
  return true;
}

function manualSuggestionsFor(query) {
  return MartLogic.buildManualSuggestions(
    query,
    allProducts(),
    lists.flatMap((listData) => listData.items),
    5
  );
}

function manualSuggestionContainer(input) {
  return input?.closest(".manual-add-wrap")?.querySelector("[data-manual-suggestions]") ?? null;
}

function hideManualSuggestions(input) {
  const container = manualSuggestionContainer(input);
  if (container) {
    container.hidden = true;
    container.innerHTML = "";
  }
  input?.setAttribute("aria-expanded", "false");
  input?.removeAttribute("aria-activedescendant");
  if (input?.dataset) input.dataset.activeSuggestion = "-1";
}

function renderManualSuggestions(input) {
  const container = manualSuggestionContainer(input);
  if (!container) return;
  const suggestions = manualSuggestionsFor(input.value);
  input.dataset.activeSuggestion = "-1";
  input.removeAttribute("aria-activedescendant");
  input.setAttribute("aria-expanded", String(Boolean(suggestions.length)));
  container.hidden = !suggestions.length;
  container.innerHTML = suggestions.map((suggestion, index) => `
    <button id="manual-suggestion-${escapeText(input.dataset.manualInput)}-${index}" type="button" role="option" aria-selected="false" data-manual-suggestion="${index}">
      <span>${escapeText(suggestion.name)}</span>
      <small>${escapeText(suggestion.source === "catalog" ? (suggestion.shelfTitle || "Sortiment") : "Bereits verwendet")}</small>
    </button>
  `).join("");

  container.querySelectorAll("[data-manual-suggestion]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => event.preventDefault());
    button.addEventListener("click", () => {
      selectManualSuggestion(input, Number(button.dataset.manualSuggestion));
    });
  });
}

function selectManualSuggestion(input, index) {
  const suggestion = manualSuggestionsFor(input?.value)[index];
  const listId = input?.dataset.manualInput;
  if (!suggestion || !listId) return false;
  const product = suggestion.source === "catalog"
    ? allProducts().find((entry) => entry.id === suggestion.id)
    : {
        id: `manual:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`,
        name: suggestion.name,
        shelfId: suggestion.shelfId || "manual",
        shelfTitle: suggestion.shelfTitle || "Eigener Artikel",
        shelfIcon: suggestion.shelfIcon || ""
      };
  if (!product) return false;
  manualDrafts[listId] = "";
  input.value = "";
  hideManualSuggestions(input);
  return addToList(product, listId);
}

function moveManualSuggestionSelection(input, delta) {
  const container = manualSuggestionContainer(input);
  const buttons = Array.from(container?.querySelectorAll("[data-manual-suggestion]") ?? []);
  if (!buttons.length) return false;
  const current = Number(input.dataset.activeSuggestion ?? -1);
  const next = (current + delta + buttons.length) % buttons.length;
  input.dataset.activeSuggestion = String(next);
  buttons.forEach((button, index) => {
    const selected = index === next;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  input.setAttribute("aria-activedescendant", buttons[next].id);
  buttons[next].scrollIntoView({ block: "nearest" });
  return true;
}

function toggleFavorite(product) {
  if (favorites.includes(product.id)) {
    favorites = favorites.filter((id) => id !== product.id);
  } else {
    favorites.push(product.id);
  }
  save();
  render();
}

function listById(id) {
  return lists.find((listData) => listData.id === id) ?? activeList();
}

function updateQuantity(id, delta, listId = activeListId) {
  const currentList = listById(listId);
  if (!currentList) return;
  if (!canPerform(currentList, "edit")) return;
  const removedItems = [];
  currentList.items = currentList.items
    .map((item) => {
      if (item.id !== id) return item;
      const nextItem = { ...item, quantity: item.quantity + delta };
      touchItem(nextItem, currentList);
      if (nextItem.quantity <= 0) {
        removedItems.push({ id: item.id, deletedByUserId: currentUser.userId, deletedAt: isoNow() });
      }
      return nextItem;
    })
    .filter((item) => item.quantity > 0);
  if (removedItems.length) {
    currentList.deletedItems = mergeDeletedItems(currentList.deletedItems, removedItems);
  }
  save();
  renderNotes();
}

function toggleDone(id, listId = activeListId) {
  const currentList = listById(listId);
  if (!currentList) return;
  if (!canPerform(currentList, "check")) return;
  currentList.items = currentList.items.map((item) => {
    if (item.id !== id) return item;
    const done = !item.done;
    const nextItem = {
      ...item,
      done,
      checkedByUserId: done ? currentUser.userId : "",
      checkedAt: done ? isoNow() : ""
    };
    touchItem(nextItem, currentList);
    return nextItem;
  });
  save();
  renderNotes();
}

function removeItem(id, listId = activeListId) {
  const currentList = listById(listId);
  if (!currentList) return;
  if (!canPerform(currentList, "delete")) return;
  currentList.deletedItems = mergeDeletedItems(currentList.deletedItems, [{
    id,
    deletedByUserId: currentUser.userId,
    deletedAt: isoNow()
  }]);
  currentList.items = currentList.items.filter((item) => item.id !== id);
  touchList(currentList);
  save();
  renderNotes();
}

function clearDone(listId = activeListId) {
  const currentList = listById(listId);
  if (!currentList) return;
  if (!canPerform(currentList, "delete")) return;
  const now = isoNow();
  const deletedItems = currentList.items
    .filter((item) => item.done)
    .map((item) => ({ id: item.id, deletedByUserId: currentUser.userId, deletedAt: now }));
  currentList.deletedItems = mergeDeletedItems(currentList.deletedItems, deletedItems);
  currentList.items = currentList.items.filter((item) => !item.done);
  touchList(currentList);
  save();
  renderNotes();
}

function renderShelves() {
  const query = normalize(elements.searchInput.value);
  const matchingShelves = marketShelves().filter((shelf) => {
    if (!query) return true;
    const products = getShelfProducts(shelf);
    return shelf.title.toLowerCase().includes(query) || products.some((product) => product.name.toLowerCase().includes(query));
  });

  elements.shelfCount.textContent = `${matchingShelves.length} Regale`;
  elements.shelfGrid.classList.toggle("is-reordering", shelfReorderMode);
  elements.reorderDoneButton.classList.toggle("is-hidden", !shelfReorderMode);
  elements.shelfGrid.innerHTML = matchingShelves.map((shelf) => `
    <button class="shelf-card ${shelfReorderMode ? "is-wiggling" : ""}" type="button" data-shelf="${escapeText(shelf.id)}">
      ${shelfIllustrationMarkup(shelf)}
      <span class="shelf-title">${escapeText(shelf.title)}</span>
      <span class="shelf-meta">${getShelfProducts(shelf).length} Artikel</span>
    </button>
  `).join("");

  elements.shelfGrid.querySelectorAll("[data-shelf]").forEach((button) => {
    attachShelfCardEvents(button);
  });
}

function renderProductGrid(container, products) {
  if (!products.length) {
    container.innerHTML = '<p class="empty-state">Keine Artikel gefunden.</p>';
    return;
  }

  const currentList = activeList();
  const canAdd = Boolean(currentList) && canPerform(currentList, "add");
  container.innerHTML = products.map((product) => {
    const isFavorite = favorites.includes(product.id);
    const priceSummary = priceSummaryForProduct(product);
    return `
      <article class="product-card">
        <button class="product-icon-button" type="button" title="Preise und Märkte" aria-label="Preise und Märkte für ${escapeText(product.name)}" data-product-prices="${escapeText(product.id)}">
          ${productIconMarkup(product)}
        </button>
        <div class="product-copy">
          <p class="product-name">${escapeText(product.name)}</p>
          <p class="product-shelf">${escapeText(product.shelfTitle)}</p>
          <p class="product-price ${bestPriceForProduct(product.id) ? "" : "is-empty"}">${escapeText(priceSummary)}</p>
        </div>
        <div class="product-actions">
          <button class="favorite-button ${isFavorite ? "is-active" : ""}" type="button" title="Favorit" aria-label="Favorit" data-favorite="${escapeText(product.id)}">
            ${icon("sparkle")}
          </button>
          <button class="add-button" type="button" ${canAdd ? "" : "disabled"} title="Auf den Zettel" aria-label="Auf den Zettel" data-add="${escapeText(product.id)}">
            ${icon("cart")}
          </button>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = allProducts().find((item) => item.id === button.dataset.add);
      if (!product) return;
      addToList(product);
      showAddFeedback(button);
    });
  });
  container.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", () => toggleFavorite(allProducts().find((product) => product.id === button.dataset.favorite)));
  });
  container.querySelectorAll("[data-product-prices]").forEach((button) => {
    button.addEventListener("click", () => showProductMarketPrices(button.dataset.productPrices));
  });
}

function renderProducts() {
  const query = normalize(elements.searchInput.value);
  const shelf = marketShelves().find((item) => item.id === selectedShelfId);
  if (!shelf) return;

  elements.currentShelfTitle.textContent = shelf.title;
  const products = getShelfProducts(shelf).filter((product) => {
    const matchesQuery = !query || product.name.toLowerCase().includes(query);
    return matchesQuery;
  });
  renderProductGrid(elements.productGrid, products);
}

function renderFavorites() {
  const query = normalize(elements.searchInput.value);
  const products = favoriteProducts().filter((product) => {
    const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.shelfTitle.toLowerCase().includes(query);
    return matchesQuery;
  });

  elements.favoriteCount.textContent = `${products.length} Artikel`;
  renderProductGrid(elements.favoriteGrid, products);
}

function enterShelfReorderMode() {
  shelfReorderMode = true;
  renderShelves();
}

function exitShelfReorderMode() {
  shelfReorderMode = false;
  draggedShelfId = null;
  renderShelves();
}

function reorderShelf(draggedId, targetId) {
  if (!draggedId || !targetId || draggedId === targetId) return;
  const order = marketShelves().map((shelf) => shelf.id);
  const draggedIndex = order.indexOf(draggedId);
  const targetIndex = order.indexOf(targetId);
  if (draggedIndex === -1 || targetIndex === -1) return;
  order.splice(draggedIndex, 1);
  order.splice(targetIndex, 0, draggedId);
  shelfOrder = order;
  save();
}

function attachShelfCardEvents(button) {
  let longPressTimer = 0;
  let didLongPress = false;
  let dropTargetId = null;

  const clearTimer = () => {
    if (!longPressTimer) return;
    window.clearTimeout(longPressTimer);
    longPressTimer = 0;
  };

  button.addEventListener("pointerdown", (event) => {
    didLongPress = false;
    dropTargetId = null;
    clearTimer();

    if (shelfReorderMode) {
      draggedShelfId = button.dataset.shelf;
      button.classList.add("is-dragging");
      button.setPointerCapture?.(event.pointerId);
      return;
    }

    longPressTimer = window.setTimeout(() => {
      didLongPress = true;
      clearTimer();
      enterShelfReorderMode();
    }, 620);
  });

  button.addEventListener("pointermove", (event) => {
    if (!shelfReorderMode || !draggedShelfId) {
      if (Math.abs(event.movementX) > 5 || Math.abs(event.movementY) > 5) clearTimer();
      return;
    }

    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-shelf]");
    dropTargetId = target?.dataset.shelf ?? dropTargetId;
  });

  button.addEventListener("pointerleave", () => {
    if (!shelfReorderMode) clearTimer();
  });

  ["pointerup", "pointercancel"].forEach((eventName) => {
    button.addEventListener(eventName, () => {
      clearTimer();
      button.classList.remove("is-dragging");
      if (shelfReorderMode && draggedShelfId) {
        reorderShelf(draggedShelfId, dropTargetId);
        draggedShelfId = null;
        renderShelves();
      }
    });
  });

  button.addEventListener("click", (event) => {
    if (didLongPress || shelfReorderMode) {
      event.preventDefault();
      return;
    }
    openShelf(button.dataset.shelf);
  });
}

function nextListTitle() {
  if (!lists.length) return "Dein Zettel";
  const highestNumber = lists.reduce((highest, listData) => {
    const match = listData.title.match(/^Zettel\s+(\d+)$/i);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 1);
  return `Zettel ${highestNumber + 1}`;
}

function addList() {
  if (!isAuthenticatedAccount()) return;
  const newList = createList(nextListTitle());
  lists.push(newList);
  activeListId = MartLogic.chooseActiveListId(
    activeListId,
    lists.map((listData) => listData.id),
    newList.id
  );
  save();
  renderNotes();
}

function activateList(id) {
  if (!lists.some((listData) => listData.id === id)) return;
  if (activeListId === id) return;
  activeListId = id;
  save({ broadcast: false });
  renderNotes();
}

function removeLocalList(id, index = lists.findIndex((listData) => listData.id === id)) {
  if (index === -1) return;
  lists = lists.filter((listData) => listData.id !== id);
  const preferredId = lists[Math.max(0, index - 1)]?.id ?? lists[0]?.id ?? "";
  activeListId = MartLogic.chooseActiveListId(
    activeListId,
    lists.map((listData) => listData.id),
    preferredId
  );
}

async function deleteList(id) {
  const index = lists.findIndex((listData) => listData.id === id);
  if (index === -1) return;

  const listToDelete = lists[index];
  if (listToDelete.ownerId !== currentUser.userId) {
    await leaveSharedList(listToDelete, index);
    return;
  }

  if (!window.confirm(`"${listToDelete.title}" wirklich vollständig löschen?`)) return;
  const remoteResult = await collaborationService.deleteSharedList?.(listToDelete, currentUser);
  if (!remoteResult) {
    window.alert("Der Zettel konnte gerade nicht gelöscht werden. Bitte prüfe deine Verbindung.");
    return;
  }
  removeLocalList(id, index);
  save({ broadcast: false });
  renderNotes();
}

function renameList(id) {
  const listData = listById(id);
  if (!listData) return;
  pendingRenameListId = listData.id;
  openModal(`
    <h2 id="modalTitle">Zettel benennen</h2>
    <div class="rename-form">
      <input id="renameListInput" type="text" maxlength="24" value="${escapeText(listData.title)}">
      <div class="modal-actions">
        <button type="button" data-save-rename>Speichern</button>
      </div>
    </div>
  `);
  window.setTimeout(() => {
    const input = elements.modalContent.querySelector("#renameListInput");
    input?.focus();
    input?.select();
  }, 0);
}

function saveRenamedList() {
  if (!pendingRenameListId) return;
  const input = elements.modalContent.querySelector("#renameListInput");
  if (!input) return;
  const listData = listById(pendingRenameListId);
  if (!listData) return;
  if (!canPerform(listData, "edit")) return;
  const nextTitle = input.value;
  const cleanTitle = nextTitle.trim().slice(0, 24);
  if (!cleanTitle) return;
  listData.title = cleanTitle;
  listData.listName = cleanTitle;
  touchList(listData);
  pendingRenameListId = null;
  save();
  closeModal();
  renderNotes();
}

function itemById(listId, itemId) {
  return listById(listId)?.items.find((item) => item.id === itemId) ?? null;
}

function editItemNote(listId, itemId) {
  const item = itemById(listId, itemId);
  if (!item) return;
  pendingItemNoteEdit = { listId, itemId };
  openModal(`
    <h2 id="modalTitle">Notiz zu ${escapeText(item.name)}</h2>
    <div class="item-note-form">
      <input id="itemNoteInput" type="text" maxlength="48" placeholder="z.B. Braeburn" value="${escapeText(item.note ?? "")}">
      <div class="modal-actions">
        <button type="button" data-save-item-note>Speichern</button>
        <button class="is-muted" type="button" data-clear-item-note>Notiz entfernen</button>
      </div>
    </div>
  `);
  window.setTimeout(() => {
    const input = elements.modalContent.querySelector("#itemNoteInput");
    input?.focus();
    input?.select();
  }, 0);
}

function saveItemNote() {
  if (!pendingItemNoteEdit) return;
  const input = elements.modalContent.querySelector("#itemNoteInput");
  if (!input) return;
  const listData = listById(pendingItemNoteEdit.listId);
  if (!listData) return;
  if (!canPerform(listData, "edit")) return;
  const item = itemById(pendingItemNoteEdit.listId, pendingItemNoteEdit.itemId);
  if (!item) return;
  const cleanNote = input.value.trim().slice(0, 48);
  if (cleanNote) {
    item.note = cleanNote;
  } else {
    delete item.note;
  }
  touchItem(item, listData);
  pendingItemNoteEdit = null;
  save();
  closeModal();
  renderNotes();
}

function clearItemNote() {
  if (!pendingItemNoteEdit) return;
  const listData = listById(pendingItemNoteEdit.listId);
  if (!listData) return;
  if (!canPerform(listData, "edit")) return;
  const item = itemById(pendingItemNoteEdit.listId, pendingItemNoteEdit.itemId);
  if (!item) return;
  delete item.note;
  touchItem(item, listData);
  pendingItemNoteEdit = null;
  save();
  closeModal();
  renderNotes();
}

function attachNoteLongPress(element, listId) {
  let longPressTimer = 0;
  let didLongPress = false;
  let startX = 0;
  let startY = 0;

  const clearTimer = () => {
    if (!longPressTimer) return;
    window.clearTimeout(longPressTimer);
    longPressTimer = 0;
  };

  element.addEventListener("pointerdown", (event) => {
    didLongPress = false;
    startX = event.clientX;
    startY = event.clientY;
    clearTimer();
    longPressTimer = window.setTimeout(() => {
      didLongPress = true;
      clearTimer();
      deleteList(listId);
    }, 650);
  });

  element.addEventListener("pointermove", (event) => {
    const distanceX = Math.abs(event.clientX - startX);
    const distanceY = Math.abs(event.clientY - startY);
    if (distanceX > 10 || distanceY > 10) clearTimer();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    element.addEventListener(eventName, clearTimer);
  });

  element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (didLongPress) return;
    didLongPress = true;
    clearTimer();
    deleteList(listId);
  });

  element.addEventListener("click", (event) => {
    if (didLongPress) {
      event.preventDefault();
      event.stopPropagation();
      window.setTimeout(() => {
        didLongPress = false;
      }, 0);
      return;
    }
  });
}

function activeMembersFor(listData) {
  const presenceMembers = activeMembersByList[listData.id] ?? collaborationService.presenceFor(listData.id);
  return mergeMembers(listData.members, presenceMembers, listData.ownerId, listData.removedMembers);
}

function isSharedList(listData) {
  const knownMembers = Array.isArray(listData.members) ? listData.members : [];
  const visibleMembers = activeMembersFor(listData);
  return listData.ownerId !== currentUser.userId
    || knownMembers.some((member) => member.userId !== currentUser.userId)
    || visibleMembers.some((member) => member.userId !== currentUser.userId);
}

function memberBadgeLabel(member) {
  return escapeText(userInitials(member));
}

function memberAvatarMarkup(member, extraClass = "") {
  const label = memberBadgeLabel(member);
  const title = escapeText(`${cleanDisplayName(member?.displayName, "Gast")} · ${roleLabels[member?.role] ?? "Editor"}`);
  if (member?.avatarUrl) {
    return `<span class="member-avatar ${extraClass}" title="${title}"><img src="${escapeText(member.avatarUrl)}" alt="${title}"></span>`;
  }
  return `<span class="member-avatar ${extraClass}" title="${title}">${label}</span>`;
}

function membersMarkup(listData) {
  const members = activeMembersFor(listData).slice(0, 5);
  const overflow = Math.max(0, activeMembersFor(listData).length - members.length);
  return `
    <div class="member-strip" aria-label="Beteiligte Nutzer">
      ${members.map((member) => memberAvatarMarkup(member, member.userId === currentUser.userId ? "is-current" : "")).join("")}
      ${overflow ? `<span class="member-avatar is-overflow">+${overflow}</span>` : ""}
    </div>
  `;
}

function relativeSyncTime(value) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "";
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 10) return "gerade";
  if (seconds < 60) return `vor ${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `vor ${minutes}m`;
  return `vor ${Math.round(minutes / 60)}h`;
}

function syncStatusLabel() {
  if (syncState.pendingWrites > 0 && syncState.status === "syncing") return "sendet";
  if (syncState.pendingWrites > 0) return `wartet · ${syncState.pendingWrites}`;
  if (syncState.status === "syncing") return "sync";
  if (syncState.status === "offline") return "offline";
  if (syncState.status === "error") return "prüfen";
  const time = relativeSyncTime(syncState.lastSyncedAt);
  return time ? `live · ${time}` : "live";
}

function syncStatusTitle() {
  if (syncState.pendingWrites > 0) return `${syncState.pendingWrites} Änderung${syncState.pendingWrites === 1 ? "" : "en"} warten auf Synchronisierung.`;
  if (syncState.status === "syncing") return "Synchronisierung läuft.";
  if (syncState.status === "offline") return "Offline. Änderungen werden lokal behalten und später erneut gesendet.";
  if (syncState.status === "error") return `Sync prüfen: ${syncState.lastError || "unbekannter Fehler"}`;
  return `Zuletzt synchronisiert: ${syncState.lastSyncedAt ? formatDateTime(syncState.lastSyncedAt) : "noch nicht"}`;
}

function syncStatusMarkup(listData) {
  return "";
}

function itemUserBadgeMarkup(item, listData) {
  const addedName = cleanDisplayName(item.addedByDisplayName, "Gast");
  const checkedMember = item.checkedByUserId ? (memberFor(listData, item.checkedByUserId) ?? { displayName: item.checkedByUserId }) : null;
  const checkedName = checkedMember ? cleanDisplayName(checkedMember.displayName, "Gast") : "";
  return `
    <span class="item-badges">
      ${item.conflict ? `
        <button class="user-badge is-conflict" type="button" title="Gleichzeitige Änderung erkannt" aria-label="Gleichzeitige Änderung erkannt" data-conflict-badge="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">
          ${icon("warning")}
        </button>
      ` : ""}
      <button class="user-badge" type="button" title="Hinzugefügt von ${escapeText(addedName)}" aria-label="Hinzugefügt von ${escapeText(addedName)}" data-user-badge="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">
        ${escapeText(userInitials({ displayName: addedName }))}
      </button>
      ${item.done && checkedName ? `
        <button class="user-badge is-checker" type="button" title="Abgehakt von ${escapeText(checkedName)}" aria-label="Abgehakt von ${escapeText(checkedName)}" data-user-badge="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">
          ${icon("check")} ${escapeText(userInitials({ displayName: checkedName }))}
        </button>
      ` : ""}
    </span>
  `;
}

function displayNameForUser(listData, userId, fallback = "Gast") {
  if (!userId) return fallback;
  if (userId === currentUser.userId) return cleanDisplayName(currentUser.displayName, fallback);
  const member = memberFor(listData, userId);
  return cleanDisplayName(member?.displayName, fallback);
}

function showItemContributor(listId, itemId) {
  const listData = listById(listId);
  const item = itemById(listId, itemId);
  if (!listData || !item) return;
  const addedName = cleanDisplayName(item.addedByDisplayName, "Gast");
  const updatedMember = item.updatedByUserId ? (memberFor(listData, item.updatedByUserId) ?? { displayName: item.updatedByUserId }) : null;
  const checkedMember = item.checkedByUserId ? (memberFor(listData, item.checkedByUserId) ?? { displayName: item.checkedByUserId }) : null;
  openModal(`
    <h2 id="modalTitle">${escapeText(item.name)}</h2>
    <div class="modal-copy">
      <p>Hinzugefügt von <strong>${escapeText(addedName)}</strong></p>
      ${updatedMember ? `<p>Bearbeitet von <strong>${escapeText(cleanDisplayName(updatedMember.displayName, "Gast"))}</strong></p>` : ""}
      ${checkedMember && item.checkedAt ? `<p>Abgehakt von <strong>${escapeText(cleanDisplayName(checkedMember.displayName, "Gast"))}</strong></p>` : ""}
      ${item.conflict ? `<p><strong>Hinweis:</strong> ${escapeText(item.conflict.message)}</p>` : ""}
    </div>
  `);
}

function showItemConflict(listId, itemId) {
  const listData = listById(listId);
  const item = itemById(listId, itemId);
  const conflict = normalizeItemConflict(item?.conflict);
  if (!listData || !item || !conflict) return;
  openModal(`
    <h2 id="modalTitle">Gleichzeitig geändert</h2>
    <div class="modal-copy">
      <p><strong>${escapeText(item.name)}</strong></p>
      <p>${escapeText(conflict.message)}</p>
      <p>Lokal: ${escapeText(displayNameForUser(listData, conflict.localByUserId, "unbekannt"))}</p>
      <p>Remote: ${escapeText(displayNameForUser(listData, conflict.remoteByUserId, "unbekannt"))}</p>
      <p>Erkannt: ${escapeText(formatDateTime(conflict.detectedAt))}</p>
    </div>
  `);
}

function noteItemsMarkup(listData) {
  const items = listData.items;
  if (!items.length) {
    return '<li class="empty-state">Noch nichts auf dem Zettel.</li>';
  }

  const canEdit = canPerform(listData, "edit");
  const canCheck = canPerform(listData, "check");
  const canDelete = canPerform(listData, "delete");
  return items.map((item) => {
    const itemNote = typeof item.note === "string" ? item.note.trim() : "";
    const itemDetail = itemNote || item.shelfTitle;
    return `
    <li class="list-item ${item.done ? "is-done" : ""}">
      <input type="checkbox" ${item.done ? "checked" : ""} ${canCheck ? "" : "disabled"} aria-label="${escapeText(item.name)} erledigt" data-done="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">
      <div class="list-copy-block">
        <button class="list-copy-button" type="button" ${canEdit ? "" : "disabled"} aria-label="Notiz zu ${escapeText(item.name)} bearbeiten" data-edit-item-note="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">
          <p class="list-name">${escapeText(item.name)}</p>
          <p class="list-shelf ${itemNote ? "is-note" : ""}">${escapeText(itemDetail)}</p>
        </button>
        ${itemUserBadgeMarkup(item, listData)}
      </div>
      <div class="quantity">
        <button class="quantity-button" type="button" ${canEdit ? "" : "disabled"} title="Weniger" aria-label="Weniger" data-minus="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">${icon("minus")}</button>
        <span>${item.quantity}</span>
        <button class="quantity-button" type="button" ${canEdit ? "" : "disabled"} title="Mehr" aria-label="Mehr" data-plus="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">${icon("plus")}</button>
        <button class="remove-button" type="button" ${canDelete ? "" : "disabled"} title="Entfernen" aria-label="Entfernen" data-remove="${escapeText(item.id)}" data-list-id="${escapeText(listData.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </li>
  `;
  }).join("");
}

function listValueMarkup(listData) {
  const estimate = MartLogic.estimateListValue(listData.items, productPrices);
  const valueText = estimate.pricedItemCount
    ? `Geschätzter Warenwert: ${formatPrice(estimate.total, estimate.currency)}`
    : "Noch kein Warenwert verfügbar";
  const missingText = estimate.missingItemCount
    ? `${estimate.missingItemCount} Artikel ohne Preis`
    : "";
  return `
    <div class="list-value-summary" aria-label="${escapeText([valueText, missingText].filter(Boolean).join(", "))}">
      <strong>${escapeText(valueText)}</strong>
      ${missingText ? `<small>${escapeText(missingText)}</small>` : ""}
    </div>
  `;
}

function noteMarkup(listData) {
  const member = memberFor(listData, currentUser.userId)
    ?? (listData.ownerId === currentUser.userId ? createMember(currentUser, collaborationRoles.owner, listData.createdAt) : null);
  const count = listData.items.reduce((sum, item) => sum + item.quantity, 0);
  const canAdd = Boolean(member) && canPerform(listData, "add");
  const sharedClass = isSharedList(listData) ? "is-shared" : "";
  const manualDraft = manualDrafts[listData.id] ?? "";
  const isActive = listData.id === activeListId;
  const suggestionListId = `manual-suggestions-${listData.id}`;
  return `
    <article class="list-panel note-card ${sharedClass} ${isActive ? "is-active" : ""}" data-note="${escapeText(listData.id)}">
      <button class="list-activation-button ${isActive ? "is-active" : ""}" type="button" aria-pressed="${isActive}" data-activate-list="${escapeText(listData.id)}">
        ${isActive ? "Aktiv" : "Für Einkäufe aktivieren"}
      </button>
      <div class="section-head list-head note-grip" data-note-grip="${escapeText(listData.id)}">
        <h2 class="list-title">
          <svg class="list-title-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7V3Zm8 0v5h4M10 12h6M10 16h5"/></svg>
          <span>${escapeText(listData.title)}</span>
          <button class="edit-note-button" type="button" title="Namen ändern" aria-label="Namen ändern" data-rename-list="${escapeText(listData.id)}">
            ${icon("pencil")}
          </button>
        </h2>
        <div class="list-tools">
          <span>${count} Artikel</span>
          <button class="share-button" type="button" data-share-list="${escapeText(listData.id)}">Teilen</button>
        </div>
      </div>
      <div class="collab-row">
        ${membersMarkup(listData)}
        <div class="collab-tools">
          ${syncStatusMarkup(listData)}
          ${canManageMembers(listData)
            ? `<button class="sync-chip" type="button" data-members-list="${escapeText(listData.id)}">Owner</button>`
            : `<span class="sync-chip">${escapeText(roleLabels[memberRole(listData)] ?? "Viewer")}</span>`}
        </div>
      </div>
      <ul class="shopping-list">
        ${noteItemsMarkup(listData)}
      </ul>
      ${listValueMarkup(listData)}
      <div class="manual-add-wrap">
        <form class="manual-add" data-manual-form="${escapeText(listData.id)}">
          <input type="text" placeholder="Eigener Artikel" autocomplete="off" enterkeyhint="done" value="${escapeText(manualDraft)}" ${canAdd ? "" : "disabled"} role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${escapeText(suggestionListId)}" data-manual-input="${escapeText(listData.id)}">
          <button type="submit" ${canAdd ? "" : "disabled"} title="Hinzufügen" aria-label="Hinzufügen">
            ${icon("plus")}
          </button>
        </form>
        <div class="manual-suggestions" id="${escapeText(suggestionListId)}" role="listbox" data-manual-suggestions hidden></div>
      </div>
      <footer class="note-footer">
        <button class="note-delete-button" type="button" data-delete-list="${escapeText(listData.id)}">
          ${icon(listData.ownerId === currentUser.userId ? "trash" : "logout")}
          <span>${listData.ownerId === currentUser.userId ? "Zettel löschen" : "Zettel verlassen"}</span>
        </button>
      </footer>
    </article>
  `;
}

function emptyNotesMarkup() {
  return `
    <div class="empty-notes-state">
      <button class="add-note-button add-note-button-large" type="button" data-empty-add-list>
        ${icon("plus")}
        Neuer Zettel
      </button>
    </div>
  `;
}

function renderNotes(options = {}) {
  const activeManualInput = focusedManualInput();
  if (activeManualInput) {
    manualDrafts[activeManualInput.dataset.manualInput] = activeManualInput.value;
  }
  if (shouldHoldNotesRender(options)) {
    pendingNotesRender = true;
    return;
  }
  pendingNotesRender = false;
  withScrollPreserved(() => {
    elements.notesBoard?.classList.toggle("is-empty", !lists.length);
    elements.notesStack.innerHTML = lists.length ? lists.map(noteMarkup).join("") : emptyNotesMarkup();

  elements.notesStack.querySelectorAll("[data-empty-add-list]").forEach((button) => {
    button.addEventListener("click", addList);
  });

  elements.notesStack.querySelectorAll("[data-activate-list]").forEach((button) => {
    button.addEventListener("click", () => activateList(button.dataset.activateList));
  });
  elements.notesStack.querySelectorAll("[data-note-grip]").forEach((grip) => {
    attachNoteLongPress(grip, grip.dataset.noteGrip);
  });
  elements.notesStack.querySelectorAll("[data-rename-list]").forEach((button) => {
    button.addEventListener("click", () => renameList(button.dataset.renameList));
  });
  elements.notesStack.querySelectorAll("[data-share-list]").forEach((button) => {
    button.addEventListener("click", () => shareList(button.dataset.shareList));
  });
  elements.notesStack.querySelectorAll("[data-members-list]").forEach((button) => {
    button.addEventListener("click", () => showMembers(button.dataset.membersList));
  });
  elements.notesStack.querySelectorAll("[data-sync-now]").forEach((button) => {
    button.addEventListener("click", () => pullRemoteLists("manual"));
  });
  elements.notesStack.querySelectorAll("[data-edit-item-note]").forEach((button) => {
    button.addEventListener("click", () => editItemNote(button.dataset.listId, button.dataset.editItemNote));
  });
  elements.notesStack.querySelectorAll("[data-user-badge]").forEach((button) => {
    button.addEventListener("click", () => showItemContributor(button.dataset.listId, button.dataset.userBadge));
  });
  elements.notesStack.querySelectorAll("[data-conflict-badge]").forEach((button) => {
    button.addEventListener("click", () => showItemConflict(button.dataset.listId, button.dataset.conflictBadge));
  });
  elements.notesStack.querySelectorAll("[data-manual-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("[data-manual-input]");
      addManualItem(form.dataset.manualForm, input);
    });
  });
  elements.notesStack.querySelectorAll("[data-manual-input]").forEach((input) => {
    input.addEventListener("input", () => {
      manualDrafts[input.dataset.manualInput] = input.value;
      renderManualSuggestions(input);
    });
    input.addEventListener("focus", () => {
      renderManualSuggestions(input);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (manualSuggestionContainer(input)?.hidden) renderManualSuggestions(input);
        if (moveManualSuggestionSelection(input, event.key === "ArrowDown" ? 1 : -1)) event.preventDefault();
        return;
      }
      if (event.key === "Enter" && Number(input.dataset.activeSuggestion ?? -1) >= 0) {
        event.preventDefault();
        selectManualSuggestion(input, Number(input.dataset.activeSuggestion));
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        hideManualSuggestions(input);
      }
    });
    input.addEventListener("blur", () => {
      manualDrafts[input.dataset.manualInput] = input.value;
      window.setTimeout(() => hideManualSuggestions(input), 80);
      flushPendingNotesRender();
    });
  });
  elements.notesStack.querySelectorAll("[data-done]").forEach((input) => {
    input.addEventListener("change", () => toggleDone(input.dataset.done, input.dataset.listId));
  });
  elements.notesStack.querySelectorAll("[data-minus]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.minus, -1, button.dataset.listId));
  });
  elements.notesStack.querySelectorAll("[data-plus]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.plus, 1, button.dataset.listId));
  });
  elements.notesStack.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeItem(button.dataset.remove, button.dataset.listId));
  });
  elements.notesStack.querySelectorAll("[data-delete-list]").forEach((button) => {
    button.addEventListener("click", () => deleteList(button.dataset.deleteList));
  });
  });
}

function render(options = {}) {
  if (shouldHoldFullRender(options)) {
    pendingFullRender = true;
    return;
  }
  pendingFullRender = false;
  withScrollPreserved(() => {
  elements.marketView.classList.toggle("is-hidden", activeView !== "market");
  elements.productsView.classList.toggle("is-hidden", activeView !== "products");
  elements.favoritesView.classList.toggle("is-hidden", activeView !== "favorites");

  if (activeView === "market") renderShelves();
  if (activeView === "products") renderProducts();
  if (activeView === "favorites") renderFavorites();
  renderNotes({ force: options.force });
  });
}

function scheduleMainSearchRender() {
  if (mainSearchRenderTimer) window.clearTimeout(mainSearchRenderTimer);
  mainSearchRenderTimer = window.setTimeout(() => {
    mainSearchRenderTimer = 0;
    render({ force: true });
  }, 120);
}

function scheduleMarketSearchRender(query, selectedMarketId) {
  if (modalSearchRenderTimer) window.clearTimeout(modalSearchRenderTimer);
  modalSearchRenderTimer = window.setTimeout(() => {
    modalSearchRenderTimer = 0;
    renderMarketSearchResults(query, selectedMarketId);
  }, 140);
}

function schedulePriceSearchRender(query) {
  if (modalSearchRenderTimer) window.clearTimeout(modalSearchRenderTimer);
  modalSearchRenderTimer = window.setTimeout(() => {
    modalSearchRenderTimer = 0;
    renderProductPriceRows(query);
  }, 140);
}

elements.authRetryButton?.addEventListener("click", connectDeviceAccount);
elements.tabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
elements.searchInput.addEventListener("input", scheduleMainSearchRender);
elements.backButton.addEventListener("click", backToShelves);
elements.addListButton.addEventListener("click", addList);
elements.reorderDoneButton.addEventListener("click", exitShelfReorderMode);
elements.imprintButton.addEventListener("click", showImprint);
elements.bugreportButton.addEventListener("click", showBugreport);
elements.moreButton.addEventListener("click", showMore);
elements.modalCloseButton.addEventListener("click", closeModal);
elements.modalLayer.addEventListener("click", (event) => {
  if (event.target === elements.modalLayer) closeModal();
});
elements.modalContent.addEventListener("click", (event) => {
  const backgroundButton = event.target.closest(".background-choice[data-background]");
  if (backgroundButton) {
    backgroundTheme = backgroundButton.dataset.background;
    save();
    applyBackgroundTheme();
    showBackgroundOptions();
    return;
  }
  if (event.target.closest("[data-open-background]")) {
    showBackgroundOptions();
    return;
  }
  if (event.target.closest("[data-open-data-tools]")) {
    showDataTools();
    return;
  }
  if (event.target.closest("[data-open-price-fetch]")) {
    showPriceFetch();
    return;
  }
  if (event.target.closest("[data-open-market-search]")) {
    showMarketSearch();
    return;
  }
  if (event.target.closest("[data-refresh-prices]")) {
    refreshPrices({ manual: true });
    return;
  }
  const selectedMarketButton = event.target.closest("[data-select-market]");
  if (selectedMarketButton) {
    renderMarketSearchResults(marketSearchState.query, selectedMarketButton.dataset.selectMarket);
    return;
  }
  const marketDetailButton = event.target.closest("[data-market-detail]");
  if (marketDetailButton) {
    showMarketDetail(marketDetailButton.dataset.marketDetail);
    return;
  }
  const openProspectButton = event.target.closest("[data-open-prospect]");
  if (openProspectButton) {
    openProspect(openProspectButton.dataset.openProspect);
    return;
  }
  const checkProspectButton = event.target.closest("[data-check-prospect]");
  if (checkProspectButton) {
    openProductProspect(checkProspectButton.dataset.checkProspect);
    return;
  }
  const addMarketButton = event.target.closest("[data-add-market]");
  if (addMarketButton) {
    const addedMarket = addMarketToPersonalList(addMarketButton.dataset.addMarket);
    if (!addedMarket) return;
    if (elements.modalContent.querySelector("#productPriceRows")) {
      renderProductPriceRows(productPriceState.query);
      return;
    }
    if (elements.modalContent.querySelector("#marketSearchResults")) {
      renderMarketSearchResults(marketSearchState.query, marketSearchState.selectedMarketId || addedMarket.id);
      return;
    }
    if (elements.modalContent.querySelector(".market-detail-panel")) {
      showMarketDetail(addedMarket.id);
    }
    return;
  }
  if (event.target.closest("[data-open-profile]")) {
    showProfile();
    return;
  }
  if (event.target.closest("[data-open-devices]")) {
    showDevices();
    return;
  }
  if (event.target.closest("[data-create-recovery-code]")) {
    createRecoveryCode();
    return;
  }
  if (event.target.closest("[data-copy-recovery-code]")) {
    copyRecoveryCode();
    return;
  }
  if (event.target.closest("[data-open-account-recovery]")) {
    showAccountRecovery();
    return;
  }
  if (event.target.closest("[data-submit-account-recovery]")) {
    restoreAccountFromCode();
    return;
  }
  const renameDeviceButton = event.target.closest("[data-rename-account-device]");
  if (renameDeviceButton) {
    showRenameDevice(renameDeviceButton.dataset.renameAccountDevice, renameDeviceButton.dataset.deviceLabel);
    return;
  }
  if (event.target.closest("[data-save-device-name]")) {
    saveDeviceName();
    return;
  }
  const removeDeviceButton = event.target.closest("[data-remove-account-device]");
  if (removeDeviceButton) {
    removeAccountDevice(removeDeviceButton.dataset.removeAccountDevice);
    return;
  }
  if (event.target.closest("[data-add-account-device]")) {
    startDevicePairing();
    return;
  }
  if (event.target.closest("[data-copy-pairing-link]")) {
    copyPairingLink();
    return;
  }
  const cancelPairingButton = event.target.closest("[data-cancel-device-pairing]");
  if (cancelPairingButton) {
    cancelDevicePairing(cancelPairingButton.dataset.cancelDevicePairing);
    return;
  }
  const approvePairingButton = event.target.closest("[data-approve-device-pairing]");
  if (approvePairingButton) {
    approveDevicePairing(approvePairingButton.dataset.approveDevicePairing);
    return;
  }
  if (event.target.closest("[data-copy-bug]")) {
    copyBugReport();
    return;
  }
  if (event.target.closest("[data-native-share]")) {
    nativeShareInvite();
    return;
  }
  if (event.target.closest("[data-copy-invite]")) {
    copyInviteLink();
    return;
  }
  const regenerateInviteButton = event.target.closest("[data-regenerate-invite]");
  if (regenerateInviteButton) {
    regenerateInvite(regenerateInviteButton.dataset.regenerateInvite);
    return;
  }
  const removeMemberButton = event.target.closest("[data-remove-member]");
  if (removeMemberButton) {
    removeMember(removeMemberButton.dataset.listId, removeMemberButton.dataset.removeMember);
    if (removeMemberButton.dataset.afterRemove === "members") {
      showMembers(removeMemberButton.dataset.listId);
    } else {
      shareList(removeMemberButton.dataset.listId);
    }
    return;
  }
  const memberRoleButton = event.target.closest("[data-member-role]");
  if (memberRoleButton) {
    setMemberRole(memberRoleButton.dataset.listId, memberRoleButton.dataset.memberId, memberRoleButton.dataset.memberRole);
    return;
  }
  const transferOwnerButton = event.target.closest("[data-transfer-owner]");
  if (transferOwnerButton) {
    transferOwnership(transferOwnerButton.dataset.listId, transferOwnerButton.dataset.transferOwner);
    return;
  }
  if (event.target.closest("[data-save-profile]")) {
    saveProfile();
    return;
  }
  if (event.target.closest("[data-save-rename]")) {
    saveRenamedList();
    return;
  }
  if (event.target.closest("[data-save-item-note]")) {
    saveItemNote();
    return;
  }
  if (event.target.closest("[data-clear-item-note]")) {
    clearItemNote();
  }
});
elements.modalContent.addEventListener("input", (event) => {
  if (event.target.matches("[data-market-search-input]")) {
    scheduleMarketSearchRender(event.target.value, marketSearchState.selectedMarketId);
    return;
  }
  if (event.target.matches("[data-price-market-search]")) {
    schedulePriceSearchRender(event.target.value);
  }
});
elements.modalContent.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.id === "renameListInput") {
    saveRenamedList();
  }
  if (event.key === "Enter" && event.target.id === "itemNoteInput") {
    saveItemNote();
  }
  if (event.key === "Enter" && event.target.id === "profileNameInput") {
    saveProfile();
  }
  if (event.key === "Enter" && event.target.id === "deviceNameInput") {
    saveDeviceName();
  }
  if (event.key === "Enter" && event.target.id === "recoveryCodeInput") {
    restoreAccountFromCode();
  }
});

function updatePresence() {
  const listData = activeList();
  if (!listData) return;
  const member = memberFor(listData, currentUser.userId);
  if (listData.ownerId !== currentUser.userId && (!member || isMemberRemoved(listData))) return;
  activeMembersByList[listData.id] = collaborationService.heartbeat(listData, currentUser);
}

async function refreshRealtimeNow(reason) {
  await flushSyncQueue();
  return pullRemoteLists(reason);
}

async function bootApp() {
  pendingDevicePairing = pairingPayloadFromUrl();
  applyBackgroundTheme();
  await connectDeviceAccount();

  authSubscription = collaborationService.onAuthStateChange?.((event, nextUser) => {
    if (accountSetupPromise) return;
    if (event === "SIGNED_OUT" || !nextUser) {
      if (authState.accountReady) deactivateAccount("Der Geräte-Account wird neu verbunden.");
      window.setTimeout(() => connectDeviceAccount(), 0);
      return;
    }
    if (isDeviceAuthUser(nextUser)) activateAccount(nextUser);
  }) ?? null;

  window.addEventListener("online", () => {
    if (isAuthenticatedAccount()) refreshRealtimeNow("online");
  });
  window.addEventListener("offline", () => markSyncError("offline"));
  window.addEventListener("focus", () => {
    if (isAuthenticatedAccount()) refreshRealtimeNow("focus");
  });
  document.addEventListener("focusout", () => flushPendingNotesRender(220));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && isAuthenticatedAccount()) refreshRealtimeNow("visible");
  });
}

bootApp();
