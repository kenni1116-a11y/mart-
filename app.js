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

const storageKeys = {
  list: "shopping-list-app.items",
  lists: "shopping-list-app.lists",
  activeList: "shopping-list-app.active-list",
  favorites: "shopping-list-app.favorites",
  shelfOrder: "shopping-list-app.shelf-order",
  background: "shopping-list-app.background",
  currentUser: "shopping-list-app.current-user",
  realtime: "shopping-list-app.mock-realtime",
  presence: "shopping-list-app.mock-presence",
  outbox: "shopping-list-app.sync-outbox"
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
  note: '<path d="M7 3h8l4 4v14H7V3Zm8 0v5h4M10 12h6M10 16h5"/>',
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

  publishLists(nextLists) {
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
    }
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
    this.tableName = this.config.sharedListsTable || "shared_lists";
    this.url = this.config.url || this.config.projectUrl || "";
    this.publishableKey = this.config.publishableKey || this.config.anonKey || "";
    this.authUserId = "";
    this.client = this.createClient();
  }

  createClient() {
    if (!this.config.enabled || !this.url || !this.publishableKey || !window.supabase?.createClient) {
      return null;
    }
    try {
      return window.supabase.createClient(this.url, this.publishableKey, {
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch {
      return null;
    }
  }

  async initializeUser(user) {
    if (!this.client || !this.config.useAnonymousAuth) return null;
    return this.ensureAuthenticated(user);
  }

  async ensureAuthenticated(user) {
    if (!this.client) return null;
    try {
      const { data: sessionData } = await this.client.auth.getSession();
      let authUser = sessionData?.session?.user ?? null;
      if (!authUser) {
        const { data, error } = await this.client.auth.signInAnonymously({
          options: {
            data: {
              displayName: cleanDisplayName(user.displayName, "Gast")
            }
          }
        });
        if (error) {
          this.queueOffline({ type: "auth", createdAt: isoNow(), error: error.message });
          return null;
        }
        authUser = data?.user ?? null;
      }
      this.authUserId = authUser?.id ?? "";
      return authUser;
    } catch (error) {
      this.queueOffline({ type: "auth", createdAt: isoNow(), error: error?.message ?? "Supabase Auth nicht erreichbar" });
      return null;
    }
  }

  subscribe(listener) {
    const unsubscribeFallback = this.fallback.subscribe(listener);
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
    this.listChannel = this.client
      .channel("mart-shared-lists")
      .on("postgres_changes", { event: "*", schema: "public", table: this.tableName }, (payload) => {
        const row = payload.new ?? payload.old;
        const listPayload = row?.payload;
        if (!listPayload) return;
        this.notify({
          type: "lists",
          sourceId: "supabase",
          sentAt: isoNow(),
          lists: [listPayload]
        });
      })
      .subscribe();
  }

  publishLists(nextLists) {
    this.fallback.publishLists(nextLists);
    if (!this.client) {
      this.queueOffline({ type: "lists", createdAt: isoNow(), lists: nextLists.map(exportCollaborativeList) });
      return;
    }

    const rows = nextLists.map((listData) => {
      const payload = exportCollaborativeList(listData);
      return {
        id: payload.listId,
        owner_user_id: isUuid(payload.ownerId) ? payload.ownerId : null,
        invite_code: payload.inviteCode,
        payload,
        updated_at: payload.updatedAt
      };
    });

    this.client
      .from(this.tableName)
      .upsert(rows, { onConflict: "id" })
      .then(({ error }) => {
        if (error) {
          this.queueOffline({
            type: "lists",
            createdAt: isoNow(),
            error: error.message,
            lists: rows.map((row) => row.payload)
          });
        }
      });
  }

  async joinSharedList(listData, user) {
    if (!this.client || !listData?.inviteCode) return null;
    const authUser = await this.ensureAuthenticated(user);
    if (!authUser) return null;
    const { data, error } = await this.client.rpc("join_shared_list", {
      target_list_id: listData.id,
      target_invite_code: listData.inviteCode,
      display_name: user.displayName,
      avatar_url: user.avatarUrl
    });
    if (error) {
      this.queueOffline({
        type: "join",
        createdAt: isoNow(),
        listId: listData.id,
        inviteCode: listData.inviteCode,
        error: error.message
      });
      return null;
    }
    return data;
  }

  heartbeat(listData, user) {
    const localMembers = this.fallback.heartbeat(listData, user);
    this.trackPresence(listData, user);
    return localMembers;
  }

  trackPresence(listData, user) {
    if (!this.client) return;
    const now = isoNow();
    const presencePayload = {
      userId: user.userId,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: memberRole(listData, user.userId),
      joinedAt: memberFor(listData, user.userId)?.joinedAt ?? now,
      lastSeenAt: now
    };

    let channel = this.presenceChannels.get(listData.id);
    if (!channel) {
      channel = this.client.channel(`mart-presence:${listData.id}`, {
        config: { presence: { key: user.userId } }
      });
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const members = Object.values(state).flat().map((entry) => ({
          userId: entry.userId,
          displayName: cleanDisplayName(entry.displayName, "Gast"),
          avatarUrl: typeof entry.avatarUrl === "string" ? entry.avatarUrl : "",
          role: normalizeRole(entry.role),
          joinedAt: safeDate(entry.joinedAt),
          lastSeenAt: safeDate(entry.lastSeenAt)
        }));
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
    return this.fallback.presenceFor(listId);
  }

  queueOffline(operation) {
    this.fallback.queueOffline(operation);
  }
}

let activeView = "market";
let selectedShelfId = null;
let currentUser = loadCurrentUser();
let lists = loadLists();
let activeListId = localStorage.getItem(storageKeys.activeList) || lists[0]?.id;
let favorites = load(storageKeys.favorites, []);
let shelfOrder = load(storageKeys.shelfOrder, []);
let shelfReorderMode = false;
let draggedShelfId = null;
let backgroundTheme = localStorage.getItem(storageKeys.background) || "paper";
let pendingRenameListId = null;
let pendingItemNoteEdit = null;
let activeMembersByList = {};

const collaborationService = createCollaborationService();

const elements = {
  body: document.body,
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

function userInitials(user) {
  const name = cleanDisplayName(user?.displayName, "K");
  const words = name.split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? `${words[0][0]}${words[1][0]}` : name.slice(0, 1);
  return initials.toUpperCase();
}

function loadCurrentUser() {
  const storedUser = load(storageKeys.currentUser, null);
  const user = {
    userId: typeof storedUser?.userId === "string" && storedUser.userId ? storedUser.userId : `user:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
    displayName: cleanDisplayName(storedUser?.displayName),
    avatarUrl: typeof storedUser?.avatarUrl === "string" ? storedUser.avatarUrl : "",
    role: normalizeRole(storedUser?.role ?? collaborationRoles.owner),
    joinedAt: safeDate(storedUser?.joinedAt)
  };
  try {
    localStorage.setItem(storageKeys.currentUser, JSON.stringify(user));
  } catch {
    // User identity falls back to memory if storage is unavailable.
  }
  return user;
}

function saveCurrentUser() {
  localStorage.setItem(storageKeys.currentUser, JSON.stringify(currentUser));
}

function replaceUserId(value, previousUserId, nextUserId) {
  return value === previousUserId ? nextUserId : value;
}

function adoptCurrentUserId(nextUserId) {
  if (!nextUserId || nextUserId === currentUser.userId) return;
  const previousUserId = currentUser.userId;
  currentUser = {
    ...currentUser,
    userId: nextUserId
  };
  saveCurrentUser();
  lists = lists.map((listData) => normalizeListData({
    ...listData,
    ownerId: replaceUserId(listData.ownerId, previousUserId, nextUserId),
    updatedByUserId: replaceUserId(listData.updatedByUserId, previousUserId, nextUserId),
    members: listData.members.map((member) => ({
      ...member,
      userId: replaceUserId(member.userId, previousUserId, nextUserId)
    })),
    removedMembers: listData.removedMembers.map((member) => ({
      ...member,
      userId: replaceUserId(member.userId, previousUserId, nextUserId)
    })),
    deletedItems: listData.deletedItems.map((entry) => ({
      ...entry,
      deletedByUserId: replaceUserId(entry.deletedByUserId, previousUserId, nextUserId)
    })),
    items: listData.items.map((item) => ({
      ...item,
      addedByUserId: replaceUserId(item.addedByUserId, previousUserId, nextUserId),
      checkedByUserId: replaceUserId(item.checkedByUserId, previousUserId, nextUserId),
      updatedByUserId: replaceUserId(item.updatedByUserId, previousUserId, nextUserId)
    }))
  }));
  activeMembersByList = {};
  save({ broadcast: false });
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

function ensureCurrentMember(listData, role = listData.ownerId === currentUser.userId ? collaborationRoles.owner : collaborationRoles.editor) {
  if (isMemberRemoved(listData, currentUser.userId)) return null;
  const existing = memberFor(listData, currentUser.userId);
  if (existing) {
    existing.displayName = currentUser.displayName;
    existing.avatarUrl = currentUser.avatarUrl;
    existing.role = listData.ownerId === currentUser.userId ? collaborationRoles.owner : normalizeRole(existing.role);
    return existing;
  }
  const member = createMember(currentUser, role);
  listData.members.push(member);
  return member;
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
    updatedAt: safeDate(item.updatedAt ?? item.checkedAt ?? now)
  };
}

function touchList(listData, userId = currentUser.userId) {
  const now = isoNow();
  listData.updatedAt = now;
  listData.updatedByUserId = userId;
  listData.listName = listData.title;
  return now;
}

function touchItem(item, listData, user = currentUser) {
  const now = touchList(listData, user.userId);
  item.updatedAt = now;
  item.updatedByUserId = user.userId;
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
    deletedItems: Array.isArray(listData?.deletedItems) ? listData.deletedItems : [],
    removedMembers: Array.isArray(listData?.removedMembers) ? listData.removedMembers : [],
    items: Array.isArray(listData?.items) ? listData.items.map(normalizeShoppingItem).filter(Boolean) : []
  };
  normalizedList.members = mergeMembers(normalizedList.members, [], ownerId, normalizedList.removedMembers);
  if (!normalizedList.members.some((member) => member.userId === ownerId)) {
    normalizedList.members.unshift(createMember({ userId: ownerId, displayName: ownerId === currentUser.userId ? currentUser.displayName : "Owner", avatarUrl: "" }, collaborationRoles.owner, normalizedList.createdAt));
  }
  ensureCurrentMember(normalizedList, ownerId === currentUser.userId ? collaborationRoles.owner : collaborationRoles.editor);
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
    deletedItems: [],
    removedMembers: [],
    items: Array.isArray(items) ? items : []
  });
}

function loadLists() {
  const storedLists = load(storageKeys.lists, null);
  if (Array.isArray(storedLists) && storedLists.length) {
    return storedLists.map(normalizeListData);
  }

  const legacyList = load(storageKeys.list, []);
  return [createList("Dein Zettel", Array.isArray(legacyList) ? legacyList : [], "zettel:1")];
}

function activeList() {
  let currentList = lists.find((item) => item.id === activeListId);
  if (!currentList) {
    currentList = lists[0] ?? createList("Dein Zettel", [], "zettel:1");
    lists = lists.length ? lists : [currentList];
    activeListId = currentList.id;
  }
  return currentList;
}

function activeItems() {
  return activeList().items;
}

function save(options = {}) {
  lists = lists.map(normalizeListData);
  localStorage.setItem(storageKeys.lists, JSON.stringify(lists));
  localStorage.setItem(storageKeys.activeList, activeListId);
  localStorage.setItem(storageKeys.list, JSON.stringify(activeItems()));
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  localStorage.setItem(storageKeys.shelfOrder, JSON.stringify(shelfOrder));
  localStorage.setItem(storageKeys.background, backgroundTheme);
  if (options.broadcast !== false) {
    collaborationService.publishLists(lists);
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

function mergeList(localList, remoteList) {
  const local = normalizeListData(localList);
  const remote = normalizeListData(remoteList);
  const deletedItems = mergeDeletedItems(local.deletedItems, remote.deletedItems);
  const removedMembers = mergeRemovedMembers(local.removedMembers, remote.removedMembers);
  const itemIds = new Set([...local.items.map((item) => item.id), ...remote.items.map((item) => item.id)]);
  const items = Array.from(itemIds).map((itemId) => {
    const localItem = local.items.find((item) => item.id === itemId);
    const remoteItem = remote.items.find((item) => item.id === itemId);
    const deletedAt = latestDeletedAt(deletedItems, itemId);
    const newestItem = !localItem ? remoteItem : (!remoteItem ? localItem : (newerDate(remoteItem.updatedAt, localItem.updatedAt) ? remoteItem : localItem));
    if (deletedAt && (!newestItem || newerDate(deletedAt, newestItem.updatedAt))) return null;
    if (localItem && remoteItem && localItem.quantity !== remoteItem.quantity) {
      return { ...newestItem, quantity: Math.max(localItem.quantity, remoteItem.quantity) };
    }
    return newestItem;
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
    deletedItems,
    removedMembers,
    items
  };
  ensureCurrentMember(merged, merged.ownerId === currentUser.userId ? collaborationRoles.owner : collaborationRoles.editor);
  return normalizeListData(merged);
}

function mergeRemoteLists(remoteLists) {
  if (!Array.isArray(remoteLists)) return;
  let didChange = false;
  remoteLists.forEach((remoteListData) => {
    const remoteList = importedListFromValue(remoteListData);
    if (!remoteList) return;
    const index = lists.findIndex((listData) => listData.id === remoteList.id);
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
  if (!didChange) return;
  save({ broadcast: false });
  render();
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

  try {
    const decoded = decodeShareValue(payload);
    let importedList = importedListFromValue(decoded);
    if (!importedList) throw new Error("empty shared list");
    const remotePayload = await collaborationService.joinSharedList?.(importedList, currentUser);
    if (remotePayload) {
      importedList = importedListFromValue(remotePayload) ?? importedList;
    }
    ensureCurrentMember(importedList, importedList.ownerId === currentUser.userId ? collaborationRoles.owner : collaborationRoles.editor);
    const existingIndex = lists.findIndex((listData) => listData.id === importedList.id);
    if (existingIndex === -1) {
      lists.push(importedList);
      activeListId = importedList.id;
    } else {
      lists[existingIndex] = mergeList(lists[existingIndex], importedList);
      activeListId = lists[existingIndex].id;
    }
    save();
  } catch {
    window.alert("Der geteilte Zettel konnte nicht gelesen werden.");
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

async function shareList(listId = activeListId) {
  const listData = lists.find((item) => item.id === listId) ?? activeList();
  listData.inviteCode = listData.inviteCode || generateInviteCode();
  ensureCurrentMember(listData);
  touchList(listData);
  save();

  const url = shareBaseUrl();
  url.searchParams.set("invite", encodeShareValue(exportCollaborativeList(listData)));
  const inviteCode = listData.inviteCode.slice(0, 8).toUpperCase();
  openModal(`
    <h2 id="modalTitle">Zettel teilen</h2>
    <div class="share-panel" data-invite-url="${escapeText(url.href)}" data-invite-title="${escapeText(listData.title)}">
      <div class="invite-code">${escapeText(inviteCode)}</div>
      <textarea readonly rows="4">${escapeText(url.href)}</textarea>
      <div class="modal-actions">
        <button type="button" data-native-share>Teilen</button>
        <button type="button" data-copy-invite>Link kopieren</button>
      </div>
      ${shareMemberRowsMarkup(listData)}
    </div>
  `);
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
  if (!canPerform(listData, "remove") || userId === listData.ownerId) return;
  listData.removedMembers = mergeRemovedMembers(listData.removedMembers, [{
    userId,
    removedByUserId: currentUser.userId,
    removedAt: isoNow()
  }]);
  listData.members = listData.members.filter((member) => member.userId !== userId);
  touchList(listData);
  save();
  shareList(listId);
  renderNotes();
}

function openModal(content) {
  elements.modalContent.innerHTML = content;
  elements.modalLayer.classList.remove("is-hidden");
  elements.modalLayer.setAttribute("aria-hidden", "false");
}

function closeModal() {
  elements.modalLayer.classList.add("is-hidden");
  elements.modalLayer.setAttribute("aria-hidden", "true");
  elements.modalContent.innerHTML = "";
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

function showMore() {
  openModal(`
    <h2 id="modalTitle">Mehr</h2>
    <div class="modal-actions modal-actions-stack">
      <button type="button" data-open-profile>Profil</button>
      <button type="button" data-open-background>Hintergrund anpassen</button>
    </div>
  `);
}

function showProfile() {
  openModal(`
    <h2 id="modalTitle">Profil</h2>
    <div class="profile-form">
      <div class="profile-preview">
        ${memberAvatarMarkup(currentUser, "is-current")}
      </div>
      <input id="profileNameInput" type="text" maxlength="24" value="${escapeText(currentUser.displayName)}" placeholder="Name">
      <input id="profileAvatarInput" type="url" maxlength="240" value="${escapeText(currentUser.avatarUrl)}" placeholder="Avatar-Link">
      <div class="modal-actions">
        <button type="button" data-save-profile>Speichern</button>
      </div>
    </div>
  `);
  window.setTimeout(() => {
    const input = elements.modalContent.querySelector("#profileNameInput");
    input?.focus();
    input?.select();
  }, 0);
}

function saveProfile() {
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
    const member = ensureCurrentMember(listData);
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
    touchList(listData);
  });
  save();
  updatePresence();
  closeModal();
  render();
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

function addToList(product) {
  const currentList = activeList();
  ensureCurrentMember(currentList);
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
  const name = input.value.trim();
  if (!name) return false;
  activeListId = listId;
  const added = addToList({
    id: `manual:${Date.now()}`,
    name,
    shelfId: "manual",
    shelfTitle: "Eigener Artikel"
  });
  if (!added) return false;
  input.value = "";
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

  const canAdd = canPerform(activeList(), "add");
  container.innerHTML = products.map((product) => {
    const isFavorite = favorites.includes(product.id);
    return `
      <article class="product-card">
        ${productIconMarkup(product)}
        <div>
          <p class="product-name">${escapeText(product.name)}</p>
          <p class="product-shelf">${escapeText(product.shelfTitle)}</p>
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
  const highestNumber = lists.reduce((highest, listData) => {
    const match = listData.title.match(/^Zettel\s+(\d+)$/i);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 1);
  return `Zettel ${highestNumber + 1}`;
}

function addList() {
  const newList = createList(nextListTitle());
  lists.push(newList);
  activeListId = newList.id;
  save();
  renderNotes();
}

function selectList(id) {
  if (!lists.some((listData) => listData.id === id)) return;
  activeListId = id;
  save();
  renderNotes();
}

function deleteList(id) {
  const index = lists.findIndex((listData) => listData.id === id);
  if (index === -1) return;

  const listToDelete = lists[index];
  if (lists.length === 1) {
    if (!window.confirm("Diesen Zettel wirklich vollständig leeren?")) return;
    listToDelete.items = [];
    save();
    renderNotes();
    return;
  }

  if (!window.confirm(`"${listToDelete.title}" wirklich vollständig löschen?`)) return;
  lists = lists.filter((listData) => listData.id !== id);
  if (activeListId === id) {
    activeListId = lists[Math.max(0, index - 1)]?.id ?? lists[0].id;
  }
  save();
  renderNotes();
}

function renameList(id) {
  const listData = listById(id);
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
  if (!canPerform(listData, "edit")) return;
  const nextTitle = input.value;
  const cleanTitle = nextTitle.trim().slice(0, 24);
  if (!cleanTitle) return;
  listData.title = cleanTitle;
  listData.listName = cleanTitle;
  touchList(listData);
  activeListId = listData.id;
  pendingRenameListId = null;
  save();
  closeModal();
  renderNotes();
}

function itemById(listId, itemId) {
  return listById(listId).items.find((item) => item.id === itemId);
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
  activeListId = pendingItemNoteEdit.listId;
  pendingItemNoteEdit = null;
  save();
  closeModal();
  renderNotes();
}

function clearItemNote() {
  if (!pendingItemNoteEdit) return;
  const listData = listById(pendingItemNoteEdit.listId);
  if (!canPerform(listData, "edit")) return;
  const item = itemById(pendingItemNoteEdit.listId, pendingItemNoteEdit.itemId);
  if (!item) return;
  delete item.note;
  touchItem(item, listData);
  activeListId = pendingItemNoteEdit.listId;
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
    selectList(listId);
  });
}

function activeMembersFor(listData) {
  const presenceMembers = activeMembersByList[listData.id] ?? collaborationService.presenceFor(listData.id);
  return mergeMembers(listData.members, presenceMembers, listData.ownerId, listData.removedMembers);
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

function itemUserBadgeMarkup(item, listData) {
  const addedName = cleanDisplayName(item.addedByDisplayName, "Gast");
  const checkedMember = item.checkedByUserId ? (memberFor(listData, item.checkedByUserId) ?? { displayName: item.checkedByUserId }) : null;
  const checkedName = checkedMember ? cleanDisplayName(checkedMember.displayName, "Gast") : "";
  return `
    <span class="item-badges">
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

function showItemContributor(listId, itemId) {
  const listData = listById(listId);
  const item = itemById(listId, itemId);
  if (!item) return;
  const addedName = cleanDisplayName(item.addedByDisplayName, "Gast");
  const updatedMember = item.updatedByUserId ? (memberFor(listData, item.updatedByUserId) ?? { displayName: item.updatedByUserId }) : null;
  const checkedMember = item.checkedByUserId ? (memberFor(listData, item.checkedByUserId) ?? { displayName: item.checkedByUserId }) : null;
  openModal(`
    <h2 id="modalTitle">${escapeText(item.name)}</h2>
    <div class="modal-copy">
      <p>Hinzugefügt von <strong>${escapeText(addedName)}</strong></p>
      ${updatedMember ? `<p>Bearbeitet von <strong>${escapeText(cleanDisplayName(updatedMember.displayName, "Gast"))}</strong></p>` : ""}
      ${checkedMember && item.checkedAt ? `<p>Abgehakt von <strong>${escapeText(cleanDisplayName(checkedMember.displayName, "Gast"))}</strong></p>` : ""}
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

function noteMarkup(listData) {
  const member = ensureCurrentMember(listData);
  const count = listData.items.reduce((sum, item) => sum + item.quantity, 0);
  const canAdd = Boolean(member) && canPerform(listData, "add");
  return `
    <article class="list-panel note-card ${listData.id === activeListId ? "is-active" : ""}" data-note="${escapeText(listData.id)}">
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
        <span class="sync-chip">${canManageMembers(listData) ? "Owner" : roleLabels[memberRole(listData)]}</span>
      </div>
      <form class="manual-add" data-manual-form="${escapeText(listData.id)}">
        <input type="text" placeholder="Eigener Artikel" autocomplete="off" enterkeyhint="done" ${canAdd ? "" : "disabled"} data-manual-input="${escapeText(listData.id)}">
        <button type="submit" ${canAdd ? "" : "disabled"} title="Hinzufügen" aria-label="Hinzufügen">
          ${icon("plus")}
        </button>
      </form>
      <ul class="shopping-list">
        ${noteItemsMarkup(listData)}
      </ul>
    </article>
  `;
}

function renderNotes() {
  elements.notesStack.innerHTML = lists.map(noteMarkup).join("");

  elements.notesStack.querySelectorAll("[data-note]").forEach((note) => {
    note.addEventListener("click", (event) => {
      if (event.target.closest("button, input")) return;
      selectList(note.dataset.note);
    });
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
  elements.notesStack.querySelectorAll("[data-edit-item-note]").forEach((button) => {
    button.addEventListener("click", () => editItemNote(button.dataset.listId, button.dataset.editItemNote));
  });
  elements.notesStack.querySelectorAll("[data-user-badge]").forEach((button) => {
    button.addEventListener("click", () => showItemContributor(button.dataset.listId, button.dataset.userBadge));
  });
  elements.notesStack.querySelectorAll("[data-manual-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("[data-manual-input]");
      addManualItem(form.dataset.manualForm, input);
    });
  });
  elements.notesStack.querySelectorAll("[data-manual-input]").forEach((input) => {
    input.addEventListener("focus", () => selectList(input.dataset.manualInput));
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
}

function render() {
  elements.marketView.classList.toggle("is-hidden", activeView !== "market");
  elements.productsView.classList.toggle("is-hidden", activeView !== "products");
  elements.favoritesView.classList.toggle("is-hidden", activeView !== "favorites");

  if (activeView === "market") renderShelves();
  if (activeView === "products") renderProducts();
  if (activeView === "favorites") renderFavorites();
  renderNotes();
}

elements.tabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
elements.searchInput.addEventListener("input", render);
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
  if (event.target.closest("[data-open-profile]")) {
    showProfile();
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
  const removeMemberButton = event.target.closest("[data-remove-member]");
  if (removeMemberButton) {
    removeMember(removeMemberButton.dataset.listId, removeMemberButton.dataset.removeMember);
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
});

function updatePresence() {
  const listData = activeList();
  const member = ensureCurrentMember(listData);
  if (!member && isMemberRemoved(listData)) return;
  activeMembersByList[listData.id] = collaborationService.heartbeat(listData, currentUser);
}

async function bootApp() {
  applyBackgroundTheme();
  const authUser = await collaborationService.initializeUser?.(currentUser);
  if (authUser?.id) {
    adoptCurrentUserId(authUser.id);
  }
  await importSharedListFromUrl();
  collaborationService.subscribe((message) => {
    if (message.type === "lists") {
      mergeRemoteLists(message.lists);
      return;
    }
    if (message.type === "presence" && message.listId) {
      activeMembersByList[message.listId] = message.members;
      renderNotes();
    }
  });
  updatePresence();
  window.setInterval(updatePresence, 15000);
  render();
}

bootApp();
