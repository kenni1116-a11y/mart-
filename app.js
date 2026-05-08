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
    icon: "home",
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
    icon: "home",
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
    icon: "home",
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
    icon: "bottle",
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
    icon: "home",
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
    icon: "home",
    products: [
      "Hundefutter", "Katzenfutter", "Leckerlis", "Katzenstreu", "Vogelfutter", "Hundekotbeutel", "Kauspielzeug", "Tierstreu", "Aquariumfutter", "Heu"
    ]
  },
  {
    id: "gesundheit-apotheke",
    title: "Gesundheit & Apotheke",
    emoji: "💊",
    color: "#4f8b77",
    icon: "sparkle",
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
    icon: "sparkle",
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
    icon: "home",
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
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  cart: '<path d="M3 4h2l2 12h10l3-8H6M9 20h.01M17 20h.01"/>'
};

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
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function chunk(items, size) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );
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

function addToList(product) {
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
  elements.shelfGrid.innerHTML = chunk(matchingShelves, 16).map((page) => `
    <div class="grid-page">
      ${page.map((shelf) => `
        <button class="shelf-card" type="button" data-shelf="${escapeText(shelf.id)}">
          <span class="shelf-icon">${icon(shelf.icon)}</span>
          <span class="shelf-title">${escapeText(shelf.title)}</span>
          <span class="shelf-meta">${shelf.products.length} Artikel</span>
        </button>
      `).join("")}
    </div>
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

  container.innerHTML = chunk(products, 16).map((page) => `
    <div class="grid-page">
      ${page.map((product) => {
    const isFavorite = favorites.includes(product.id);
    return `
      <article class="product-card">
        <span class="product-icon">${icon(product.shelfIcon ?? "cart")}</span>
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
      }).join("")}
    </div>
  `).join("");

  container.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToList(allProducts().find((product) => product.id === button.dataset.add)));
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
elements.clearDoneButton.addEventListener("click", clearDone);

render();
