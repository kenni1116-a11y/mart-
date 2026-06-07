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
    title: "Getränke alkoholfrei",
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

const storageKeys = {
  list: "shopping-list-app.items",
  favorites: "shopping-list-app.favorites"
};

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
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  cart: '<path d="M3 4h2l2 12h10l3-8H6M9 20h.01M17 20h.01"/>'
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

let activeView = "market";
let selectedShelfId = null;
let list = load(storageKeys.list, []);
let favorites = load(storageKeys.favorites, []);

const elements = {
  tabs: document.querySelectorAll(".tab"),
  searchInput: document.querySelector("#searchInput"),
  marketView: document.querySelector("#marketView"),
  productsView: document.querySelector("#productsView"),
  favoritesView: document.querySelector("#favoritesView"),
  shelfGrid: document.querySelector("#shelfGrid"),
  productGrid: document.querySelector("#productGrid"),
  favoriteGrid: document.querySelector("#favoriteGrid"),
  currentShelfTitle: document.querySelector("#currentShelfTitle"),
  shelfCount: document.querySelector("#shelfCount"),
  favoriteCount: document.querySelector("#favoriteCount"),
  backButton: document.querySelector("#backButton"),
  shoppingList: document.querySelector("#shoppingList"),
  listCount: document.querySelector("#listCount"),
  manualInput: document.querySelector("#manualInput"),
  manualAddButton: document.querySelector("#manualAddButton"),
  shareListButton: document.querySelector("#shareListButton"),
  clearDoneButton: document.querySelector("#clearDoneButton")
};

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save() {
  localStorage.setItem(storageKeys.list, JSON.stringify(list));
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
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
  return value.trim().toLowerCase();
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

function sanitizeSharedList(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      if (!item || typeof item.name !== "string" || !item.name.trim()) return null;
      const name = item.name.trim().slice(0, 80);
      const knownProduct = allProducts().find((product) => normalize(product.name) === normalize(name));
      const quantity = Math.max(1, Math.min(99, Math.round(Number(item.quantity) || 1)));

      return {
        id: typeof item.id === "string" ? item.id : knownProduct?.id ?? `geteilt:${Date.now()}:${index}`,
        name,
        shelfId: typeof item.shelfId === "string" ? item.shelfId : knownProduct?.shelfId ?? "geteilt",
        shelfTitle: typeof item.shelfTitle === "string" ? item.shelfTitle : knownProduct?.shelfTitle ?? "Geteilter Zettel",
        shelfIcon: typeof item.shelfIcon === "string" ? item.shelfIcon : knownProduct?.shelfIcon,
        quantity,
        done: Boolean(item.done)
      };
    })
    .filter(Boolean);
}

function importSharedListFromUrl() {
  const url = new URL(window.location.href);
  const payload = url.searchParams.get("zettel");
  if (!payload) return;

  try {
    const sharedList = sanitizeSharedList(decodeShareValue(payload));
    if (!sharedList.length) throw new Error("empty shared list");

    const shouldImport = !list.length || window.confirm("Geteilten Zettel übernehmen und deinen aktuellen Zettel ersetzen?");
    if (shouldImport) {
      list = sharedList;
      save();
    }
  } catch {
    window.alert("Der geteilte Zettel konnte nicht gelesen werden.");
  } finally {
    url.searchParams.delete("zettel");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

async function shareList() {
  if (!list.length) {
    window.alert("Dein Zettel ist noch leer.");
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("zettel", encodeShareValue(list));
  url.hash = "";
  const shareData = {
    title: "Zettel",
    text: "Mein Einkaufszettel",
    url: url.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url.href);
      window.alert("Link zum Zettel kopiert.");
      return;
    }
  } catch (error) {
    if (error.name === "AbortError") return;
  }

  window.prompt("Link zum Zettel kopieren:", url.href);
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

function addToList(product) {
  triggerHapticFeedback();
  const existing = list.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    list.push({ ...product, quantity: 1, done: false });
  }
  save();
  renderList();
}

function addManualItem() {
  const name = elements.manualInput.value.trim();
  if (!name) return;
  addToList({
    id: `manual:${Date.now()}`,
    name,
    shelfId: "manual",
    shelfTitle: "Eigener Artikel"
  });
  elements.manualInput.value = "";
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

function updateQuantity(id, delta) {
  list = list
    .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0);
  save();
  renderList();
}

function toggleDone(id) {
  list = list.map((item) => item.id === id ? { ...item, done: !item.done } : item);
  save();
  renderList();
}

function removeItem(id) {
  list = list.filter((item) => item.id !== id);
  save();
  renderList();
}

function clearDone() {
  list = list.filter((item) => !item.done);
  save();
  renderList();
}

function renderShelves() {
  const query = normalize(elements.searchInput.value);
  const matchingShelves = shelves.filter((shelf) => {
    if (!query) return true;
    return shelf.title.toLowerCase().includes(query) || shelf.products.some((name) => name.toLowerCase().includes(query));
  });

  elements.shelfCount.textContent = `${matchingShelves.length} Regale`;
  elements.shelfGrid.innerHTML = matchingShelves.map((shelf) => `
    <button class="shelf-card" type="button" data-shelf="${escapeText(shelf.id)}">
      <span class="shelf-icon">${icon(shelf.icon)}</span>
      <span class="shelf-title">${escapeText(shelf.title)}</span>
      <span class="shelf-meta">${shelf.products.length} Artikel</span>
    </button>
  `).join("");

  elements.shelfGrid.querySelectorAll("[data-shelf]").forEach((button) => {
    button.addEventListener("click", () => openShelf(button.dataset.shelf));
  });
}

function renderProductGrid(container, products) {
  if (!products.length) {
    container.innerHTML = '<p class="empty-state">Keine Artikel gefunden.</p>';
    return;
  }

  container.innerHTML = products.map((product) => {
    const isFavorite = favorites.includes(product.id);
    return `
      <article class="product-card">
        <span class="product-icon product-sketch">${icon(sketchIconFor(product))}</span>
        <div>
          <p class="product-name">${escapeText(product.name)}</p>
          <p class="product-shelf">${escapeText(product.shelfTitle)}</p>
        </div>
        <div class="product-actions">
          <button class="favorite-button ${isFavorite ? "is-active" : ""}" type="button" title="Favorit" aria-label="Favorit" data-favorite="${escapeText(product.id)}">
            ${icon("sparkle")}
          </button>
          <button class="add-button" type="button" title="Auf den Zettel" aria-label="Auf den Zettel" data-add="${escapeText(product.id)}">
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
}

function renderProducts() {
  const query = normalize(elements.searchInput.value);
  const shelf = shelves.find((item) => item.id === selectedShelfId);
  if (!shelf) return;

  elements.currentShelfTitle.textContent = shelf.title;
  const products = allProducts().filter((product) => {
    const inShelf = product.shelfId === shelf.id;
    const matchesQuery = !query || product.name.toLowerCase().includes(query);
    return inShelf && matchesQuery;
  });
  renderProductGrid(elements.productGrid, products);
}

function renderFavorites() {
  const query = normalize(elements.searchInput.value);
  const products = allProducts().filter((product) => {
    const isFavorite = favorites.includes(product.id);
    const matchesQuery = !query || product.name.toLowerCase().includes(query) || product.shelfTitle.toLowerCase().includes(query);
    return isFavorite && matchesQuery;
  });

  elements.favoriteCount.textContent = `${products.length} Artikel`;
  renderProductGrid(elements.favoriteGrid, products);
}

function renderList() {
  elements.listCount.textContent = `${list.reduce((sum, item) => sum + item.quantity, 0)} Artikel`;
  if (!list.length) {
    elements.shoppingList.innerHTML = '<li class="empty-state">Noch nichts auf dem Zettel.</li>';
    return;
  }

  elements.shoppingList.innerHTML = list.map((item) => `
    <li class="list-item ${item.done ? "is-done" : ""}">
      <input type="checkbox" ${item.done ? "checked" : ""} aria-label="${escapeText(item.name)} erledigt" data-done="${escapeText(item.id)}">
      <div>
        <p class="list-name">${escapeText(item.name)}</p>
        <p class="list-shelf">${escapeText(item.shelfTitle)}</p>
      </div>
      <div class="quantity">
        <button class="quantity-button" type="button" title="Weniger" aria-label="Weniger" data-minus="${escapeText(item.id)}">${icon("minus")}</button>
        <span>${item.quantity}</span>
        <button class="quantity-button" type="button" title="Mehr" aria-label="Mehr" data-plus="${escapeText(item.id)}">${icon("plus")}</button>
        <button class="remove-button" type="button" title="Entfernen" aria-label="Entfernen" data-remove="${escapeText(item.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </li>
  `).join("");

  elements.shoppingList.querySelectorAll("[data-done]").forEach((input) => {
    input.addEventListener("change", () => toggleDone(input.dataset.done));
  });
  elements.shoppingList.querySelectorAll("[data-minus]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.minus, -1));
  });
  elements.shoppingList.querySelectorAll("[data-plus]").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.plus, 1));
  });
  elements.shoppingList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeItem(button.dataset.remove));
  });
}

function render() {
  elements.marketView.classList.toggle("is-hidden", activeView !== "market");
  elements.productsView.classList.toggle("is-hidden", activeView !== "products");
  elements.favoritesView.classList.toggle("is-hidden", activeView !== "favorites");

  if (activeView === "market") renderShelves();
  if (activeView === "products") renderProducts();
  if (activeView === "favorites") renderFavorites();
  renderList();
}

elements.tabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
elements.searchInput.addEventListener("input", render);
elements.backButton.addEventListener("click", backToShelves);
elements.manualAddButton.addEventListener("click", addManualItem);
elements.manualInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addManualItem();
});
elements.shareListButton.addEventListener("click", shareList);
elements.clearDoneButton.addEventListener("click", clearDone);

importSharedListFromUrl();
render();
