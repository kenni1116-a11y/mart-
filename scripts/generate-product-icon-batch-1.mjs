import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const desktopRoot = "/Users/ken/Desktop/Zettel Produkt-icons";

const vegetables = [
  ["Tomaten", "01-tomaten.svg", "tomato-pair", "#ef3f32", '<circle cx="27" cy="36" r="13" fill="#ef3f32"/><circle cx="43" cy="32" r="10" fill="#ff6544"/><path d="m25 23 3 5 5-4-1 6 6 1-6 3m9-13 2 4 5-2-3 5" fill="#35a854"/><path d="M20 35c3-5 8-7 13-6M38 29c2-3 5-4 8-3" class="shine"/>'],
  ["Gurken", "02-gurken.svg", "cucumber-and-slice", "#35af52", '<path d="M13 45C22 26 36 17 52 18c2 13-8 27-28 34-7 2-13-1-11-7Z" fill="#37b85b"/><path d="M18 44c9-13 20-20 31-21" class="detail"/><circle cx="45" cy="42" r="9" fill="#a9df65"/><circle cx="45" cy="42" r="5" fill="#d9f29b"/><path d="m42 39 2 2m4-2-2 2m-3 4 2-1" class="fine"/>'],
  ["Paprika", "03-paprika.svg", "three-bell-peppers", "#f0442e", '<path d="M8 32c0-9 5-15 12-14 7 1 9 8 7 17-2 10-7 15-12 13-6-2-8-8-7-16Z" fill="#36b94f"/><path d="M22 29c0-10 6-17 13-15 7 1 9 10 6 20-2 9-8 14-13 11-5-3-7-9-6-16Z" fill="#ffd12e"/><path d="M38 31c0-9 6-15 12-13 7 2 8 10 5 19-3 9-8 13-13 9-5-3-6-9-4-15Z" fill="#ef4436"/><path d="m18 18 2-7m14 4 1-7m14 11 2-7" class="stem"/><path d="M12 29c2-4 5-6 8-6m7 3c2-4 5-6 8-6m8 7c2-3 5-4 8-3" class="shine"/>'],
  ["Zwiebeln", "04-zwiebeln.svg", "white-onion-brown-skin", "#c8894a", '<path d="M18 30c1-8 7-13 14-13s13 5 14 13c2 12-5 22-14 22S16 42 18 30Z" fill="#fff7dd"/><path d="M18 31c2-7 5-11 10-13-4 9-3 22 3 33M46 31c-2-7-5-11-10-13 4 9 3 22-3 33" fill="#c98a4b" opacity=".75"/><path d="M27 18c1-5 3-8 5-11 2 3 4 6 5 11M22 50l-5 4m11-3-2 6m16-7 5 4" class="detail"/><path d="M24 29c2-4 5-6 8-6" class="shine"/>'],
  ["Kartoffeln", "05-kartoffeln.svg", "potato-pile", "#bd8145", '<ellipse cx="24" cy="39" rx="15" ry="11" transform="rotate(-18 24 39)" fill="#c89152"/><ellipse cx="41" cy="30" rx="14" ry="10" transform="rotate(16 41 30)" fill="#d7a060"/><ellipse cx="43" cy="46" rx="12" ry="9" transform="rotate(-8 43 46)" fill="#b9773f"/><path d="m18 37 2 1m8-4 2-1m10-7 2 1m6 3 2-1m-11 17 2 1m7-3 2-1" class="fine"/>'],
  ["Karotten", "06-karotten.svg", "carrot-bunch", "#ff7b24", '<path d="M18 24 26 53 35 23Z" fill="#ff7b24"/><path d="M29 22 36 54 44 23Z" fill="#f05c25"/><path d="M39 24 45 50 52 25Z" fill="#ff9a2d"/><path d="M26 23C18 18 15 12 17 7c7 3 10 8 10 15Zm5-1c-2-9 1-15 6-18 4 6 2 13-4 19Zm9 2c1-8 6-12 12-13 1 7-4 12-11 15Z" fill="#3aad53"/><path d="m23 33 8-2m-6 9 8-2m2-6 8-2m-6 10 8-2" class="detail"/>'],
  ["Brokkoli", "07-brokkoli.svg", "broccoli-floret", "#2fa957", '<path d="M27 34h12l5 22H22Z" fill="#8bcf59"/><circle cx="19" cy="28" r="10" fill="#36ae55"/><circle cx="30" cy="22" r="12" fill="#2f994e"/><circle cx="43" cy="27" r="11" fill="#45bb5d"/><circle cx="33" cy="34" r="10" fill="#24934c"/><path d="M29 38c1 8 2 13 4 18m3-18c-1 7-1 12-1 18" class="detail"/><path d="M24 18c3-3 7-4 11-3" class="shine"/>'],
  ["Blumenkohl", "08-blumenkohl.svg", "white-cauliflower", "#f4f0d9", '<path d="M13 51c4-16 9-23 19-23s16 7 20 23c-12-4-27-4-39 0Z" fill="#58a858"/><circle cx="20" cy="29" r="10" fill="#fffdf0"/><circle cx="31" cy="22" r="12" fill="#f4f0dc"/><circle cx="43" cy="28" r="11" fill="#fffcef"/><circle cx="33" cy="34" r="11" fill="#ece8d3"/><path d="M14 50c5-8 10-12 17-14M51 50c-5-8-10-12-17-14" class="detail"/><path d="M25 17c4-3 9-3 13 0" class="shine"/>'],
  ["Lauch", "09-lauch.svg", "long-leek", "#46aa55", '<path d="M27 55c-1-15 0-27 2-38l7 1c2 12 2 25 0 37Z" fill="#fff6dc"/><path d="M29 36c0-10-3-20-7-29 8 3 11 13 11 29Zm4 0c0-12 3-23 9-31 2 12-1 22-7 32Zm1-1c3-10 9-17 16-21-1 10-6 18-14 24Z" fill="#3a9f50"/><path d="m27 55-5 5m9-5-2 6m7-6 3 6m-5-26-1 19" class="detail"/>'],
  ["Sellerie", "10-sellerie.svg", "celery-bunch", "#91cf5b", '<path d="M20 55c2-17 3-28 2-39h7c1 13 0 26-1 39Zm10 0c1-17 1-30-1-42h7c3 14 3 28 2 42Zm10 0c-1-16-1-27 1-37l7 2c0 12-1 23-2 35Z" fill="#a9dc68"/><path d="M23 18C14 18 10 13 11 7c7 0 12 4 14 10Zm8-4c-4-7-1-12 4-14 4 5 3 10-2 15Zm11 6c2-8 8-11 14-9-1 7-6 11-13 11Z" fill="#46a94e"/><path d="M25 24c1 10 0 20-1 30m9-31c2 11 2 22 1 31m10-27c-1 9-1 18-2 27" class="detail"/>'],
  ["Knoblauch", "11-knoblauch.svg", "three-garlic-bulbs", "#e8dfd1", '<path d="M9 38c1-8 7-13 13-10 5-4 11 1 11 9 0 10-5 16-12 16S8 48 9 38Z" fill="#fff8e8"/><path d="M29 33c1-8 7-13 13-9 6-3 12 2 11 11 0 10-5 16-12 16S28 44 29 33Z" fill="#eee2d1"/><path d="M18 28c0-6 2-11 5-16m16 12c0-6 2-10 5-14M21 30c-3 8-2 16 0 22m3-22c3 8 2 16-1 22m17-27c-3 8-2 16 0 25m4-24c3 8 2 16-1 24" class="detail"/><path d="M16 34c2-3 5-4 8-3m12-1c3-3 6-3 9-1" class="shine"/>'],
  ["Zucchini", "12-zucchini.svg", "two-zucchini", "#278d4d", '<path d="M11 44c9-18 22-29 37-31 6 7-4 23-26 38-7 5-15 0-11-7Z" fill="#258849"/><path d="M25 50c8-17 18-27 30-29 5 8-4 22-20 33-5 4-12 1-10-4Z" fill="#6fbd4d"/><path d="M46 13c4-4 8-4 11-1-1 4-4 6-9 6m6 3c4-3 7-3 9 0-1 4-4 5-8 5" fill="#3b6d35"/><path d="M17 43c8-12 18-20 29-24m-14 29c6-10 13-17 21-21" class="shine"/>'],
  ["Aubergine", "13-aubergine.svg", "eggplant", "#6740b6", '<path d="M19 23c9-7 23-3 28 9 5 13-1 24-12 24-13 0-22-14-16-33Z" fill="#7044bc"/><path d="M20 24c3-9 10-14 18-13 6 1 10 5 12 11-7-3-12-1-15 4-4-4-9-5-15-2Z" fill="#4aaa4d"/><path d="M39 13c2-5 5-8 9-9" class="stem"/><path d="M25 29c3-5 8-7 13-6" class="shine"/><path d="m36 45 7-5m-4 10 7-5" class="fine"/>'],
  ["Spinat", "14-spinat.svg", "spinach-leaf-pile", "#2a9850", '<path d="M9 43c3-12 12-17 23-13-3 12-12 18-23 13Z" fill="#2f9e51"/><path d="M20 51c1-13 10-21 22-20 0 13-9 21-22 20Z" fill="#4ab65a"/><path d="M28 40c5-12 15-16 25-10-5 11-14 16-25 10Z" fill="#237e45"/><path d="M10 43c8-1 15-4 22-13m-12 21c6-6 14-13 22-20m-14 9c8-2 16-5 25-10" class="detail"/>'],
  ["Salat", "15-salat.svg", "open-leaf-lettuce", "#63bb50", '<path d="M32 55C16 54 9 44 12 31c6 2 10 5 13 10-2-10 0-19 7-27 7 8 9 17 7 27 3-5 8-8 14-10 3 13-5 23-21 24Z" fill="#74c654"/><path d="M32 55c-3-13-3-26 0-41m0 30c-6-7-12-11-20-13m20 13c6-7 13-11 21-13" class="detail"/><path d="M24 24c2-4 5-7 8-10" class="shine"/>'],
  ["Mais", "16-mais.svg", "corn-cob", "#ffd23c", '<ellipse cx="34" cy="33" rx="12" ry="21" fill="#ffd13a"/><path d="M23 54C12 43 12 26 21 14c2 14 7 26 13 38Zm22 0c10-11 10-28 2-40-2 14-7 26-13 38Z" fill="#48a94d"/><path d="M27 19h14M24 26h19m-20 7h21m-20 7h19m-16 7h14M30 13v38m7-38v38" class="fine"/>'],
  ["Champignons", "17-champignons.svg", "three-mushrooms", "#d8b38c", '<path d="M8 31c2-10 8-15 17-15s15 5 17 15Z" fill="#d2aa82"/><path d="M19 30h12l2 22H17Z" fill="#fff0d2"/><path d="M31 37c2-9 8-14 15-14 8 0 13 5 15 14Z" fill="#b98b66"/><path d="M41 36h10l2 18H39Z" fill="#f2ddc2"/><path d="M13 27c4-5 10-7 17-6m22 10c-3-3-7-4-11-3" class="shine"/>'],
  ["Radieschen", "18-radieschen.svg", "radish-bunch", "#ec3e6a", '<circle cx="21" cy="39" r="10" fill="#ef4771"/><circle cx="35" cy="43" r="11" fill="#f25b7d"/><circle cx="47" cy="35" r="9" fill="#d92d5c"/><path d="M20 30C13 24 11 17 14 11c7 3 10 9 9 18Zm14 3c-3-9 1-16 7-19 4 7 2 14-5 20Zm12-7c1-8 6-13 13-14 1 7-4 13-12 16Z" fill="#45a94f"/><path d="m18 49-3 7m20-2-2 6m16-17 4 6" class="detail"/>'],
  ["Kohl", "19-kohl.svg", "round-cabbage", "#6eb659", '<circle cx="32" cy="35" r="21" fill="#75ba5b"/><path d="M32 14c-8 8-11 17-9 28 2 8 7 12 9 14m0-42c8 8 11 17 9 28-2 8-7 12-9 14M13 35c7-5 13-6 19-4 6-2 12-1 19 4M18 47c5-6 10-9 14-9 5 0 10 3 14 9" class="detail"/><path d="M21 25c4-4 8-6 13-6" class="shine"/>'],
  ["Süßkartoffeln", "20-suesskartoffeln.svg", "sweet-potato-pair", "#bb6238", '<path d="M9 42c4-14 14-22 27-20 8 1 10 9 4 18-8 12-18 18-26 13-4-2-6-6-5-11Z" fill="#ba6139"/><path d="M28 30c7-10 18-13 26-7 7 6 3 16-8 24-9 7-18 6-21-1-2-5-1-10 3-16Z" fill="#d37742"/><path d="m16 40 2 1m8-9 2-1m7 10 2 1m10-11 2-1" class="fine"/><path d="M14 37c5-7 12-11 19-10m2 4c4-4 9-6 14-5" class="shine"/>'],
  ["Ingwer", "21-ingwer.svg", "branched-ginger", "#d39a54", '<path d="M11 41c4-8 10-11 18-9-2-8 2-14 9-15 5 4 5 9 1 15 8-3 14 0 17 6-3 7-10 9-18 5-3 10-11 14-18 9 1-5-2-7-9-11Z" fill="#d5a05d"/><path d="M28 33c2 4 5 7 10 10m0-11c-4 3-6 6-7 10m9-20c-3 4-5 8-5 12" class="detail"/><path d="M16 39c4-3 8-4 12-3" class="shine"/>'],
  ["Frühlingszwiebeln", "22-fruehlingszwiebeln.svg", "spring-onion-bunch", "#55ad4f", '<path d="M20 57c2-17 2-31 0-44m8 44c1-20 1-37 3-51m5 51c2-18 6-34 13-47m-5 47c1-15 5-27 12-37" class="green-stalk"/><path d="M18 57c2-8 2-15 2-22h8c1 8 1 15 0 22Zm10 0c1-9 2-16 4-23h8c0 8-1 16-4 23Zm8 0c3-8 6-14 10-20l7 4c-3 7-6 12-9 16Z" fill="#fff5da"/><path d="m18 57-4 4m9-4-1 5m7-5 2 5m6-5-2 5m8-5 4 4" class="fine"/><path d="M19 35h29" class="tie"/>'],
  ["Rosenkohl", "23-rosenkohl.svg", "five-brussels-sprouts", "#4ca64c", '<circle cx="20" cy="27" r="9" fill="#58ad50"/><circle cx="34" cy="22" r="10" fill="#75bd55"/><circle cx="47" cy="29" r="9" fill="#3f9847"/><circle cx="26" cy="43" r="10" fill="#65b653"/><circle cx="43" cy="44" r="10" fill="#4da34a"/><path d="m14 27 6-3 6 3m1-6 7-3 7 3m-21 23 6-4 7 4m2 0 7-4 7 4" class="fine"/>'],
  ["Spargel", "24-spargel.svg", "five-white-asparagus-stalks", "#efe9c9", '<path d="M12 55V21l4-9 4 9v34Zm8 0V18l4-10 4 10v37Zm8 0V16l4-11 4 11v39Zm8 0V18l4-10 4 10v37Zm8 0V21l4-9 4 9v34Z" fill="#fff7dc"/><path d="M12 35h40v8H12Z" fill="#e4b755"/><path d="M14 21h4m4-3h4m4-2h4m4 2h4m4 3h4M12 39h40" class="detail"/><path d="M16 25v7m8-9v9m8-11v11m8-9v9m8-7v7" class="shine"/>'],
  ["Fenchel", "25-fenchel.svg", "fennel-bulb", "#d8e8a8", '<path d="M17 50c2-15 7-23 15-24 8 1 13 9 15 24-9 7-21 7-30 0Z" fill="#eef3c6"/><path d="M32 27V10m0 10L19 8m13 10L45 7m-13 14L11 18m21 4 21-5" class="green-stalk"/><path d="M19 8c5-2 8-1 10 2m16-3c-5-1-8 1-10 4M11 18c5-3 9-3 13 0m29-1c-5-2-9-1-13 2" class="frond"/><path d="M22 47c3-8 6-13 10-20m10 20c-3-8-6-13-10-20" class="detail"/>'],
  ["Chili", "26-chili.svg", "three-chili-peppers", "#e83b32", '<path d="M10 25c12 0 21 7 25 20-12 5-25-2-25-20Z" fill="#e83d34"/><path d="M23 18c12 1 20 9 22 22-13 3-24-6-22-22Z" fill="#f35a30"/><path d="M36 17c10 3 15 11 14 22-11 0-19-10-14-22Z" fill="#7bad3e"/><path d="M10 25c-2-4-1-7 3-9m10 2c0-4 2-7 6-8m7 7c1-4 4-6 8-6" class="stem"/><path d="M15 27c6 2 11 6 15 12m-2-18c6 3 10 7 13 13" class="shine"/>'],
];

const freshCounter = [
  ["Eisbergsalat", "01-eisbergsalat.svg", "iceberg-lettuce-head", "#a9d66c", '<circle cx="32" cy="35" r="22" fill="#b9df7a"/><path d="M16 27c7 1 12 5 16 12 4-7 9-11 16-12M13 38c8-2 14 0 19 6 5-6 11-8 19-6M22 16c-1 8 2 15 10 23 8-8 11-15 10-23M22 53c2-7 5-12 10-14 5 2 8 7 10 14" class="detail"/><path d="M20 23c4-4 8-6 13-6" class="shine"/>'],
  ["Feldsalat", "02-feldsalat.svg", "lambs-lettuce-rosettes", "#3f9d4b", '<g fill="#4da84e"><ellipse cx="19" cy="32" rx="7" ry="13" transform="rotate(-45 19 32)"/><ellipse cx="29" cy="27" rx="7" ry="13" transform="rotate(-12 29 27)"/><ellipse cx="39" cy="29" rx="7" ry="13" transform="rotate(24 39 29)"/><ellipse cx="46" cy="39" rx="7" ry="13" transform="rotate(52 46 39)"/><ellipse cx="31" cy="43" rx="7" ry="13" transform="rotate(8 31 43)"/></g><circle cx="32" cy="35" r="5" fill="#85c85d"/><path d="M14 27c4 4 10 8 18 8m0 0c4-4 9-8 14-10m-14 10c0 6 0 11-1 15" class="detail"/>'],
  ["Rucola", "03-rucola.svg", "rocket-leaf-bundle", "#2f954a", '<path d="M20 54c0-8 1-15 4-22-8-1-11-5-10-10 4 1 7 0 9-3-3-6-1-10 4-13 3 4 5 8 4 13 4-2 8-1 10 3-2 4-5 7-10 9 2 8 1 15-2 23Z" fill="#3da44e"/><path d="M36 55c0-7 1-13 4-19-6-1-9-4-8-8 4 1 6 0 8-3-2-5 0-8 4-10 3 3 4 7 3 10 4-1 7 0 9 3-2 4-5 6-9 8 1 7 0 13-2 19Z" fill="#68b74f"/><path d="M27 8c2 15 2 30-7 46m24-38c2 13 1 26-8 39" class="detail"/>'],
  ["Kopfsalat", "04-kopfsalat.svg", "open-butterhead-lettuce", "#69b950", '<path d="M32 56C15 55 7 44 12 28c7 2 12 6 15 12-4-12-2-22 5-32 7 10 9 20 5 32 4-6 9-10 16-12 5 16-4 27-21 28Z" fill="#82c75b"/><path d="M32 56c-1-17-1-33 0-48m0 39c-7-9-13-15-20-19m20 19c7-9 14-15 21-19M18 50c4-6 9-9 14-10 6 1 10 4 14 10" class="detail"/><path d="M27 19c1-4 3-8 5-11" class="shine"/>'],
  ["Fertigsalat", "05-fertigsalat.svg", "salad-bag", "#46a95a", '<path d="M16 10h32l5 45H11Z" fill="#eef7e5"/><path d="M17 18h30M14 46h36" class="detail"/><path d="M17 42c4-11 10-15 16-8 5-7 11-4 14 8Z" fill="#68b956"/><path d="M20 37c2-6 5-9 9-11 2 6 1 10-4 14m12 0c-2-7 0-12 5-15 4 7 2 12-5 15Z" fill="#3c984c"/><text x="32" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="800" fill="#171513" stroke="none">SALAT</text><path d="M20 13h24" class="shine"/>'],
  ["Krautsalat", "06-krautsalat.svg", "white-cabbage-slaw-bowl", "#eee9d5", '<path d="M10 31h44l-5 22H15Z" fill="#e7eef0"/><ellipse cx="32" cy="31" rx="22" ry="8" fill="#fff9e9"/><path d="m17 29 8-3m-3 7 10-5m-3 6 10-7m-3 7 10-5m-4 6 6-3" class="slaw"/><path d="M16 47c10 4 22 4 32 0" class="detail"/><path d="M18 28c7-3 14-4 21-3" class="shine"/>'],
  ["Kartoffelsalat", "07-kartoffelsalat.svg", "potato-salad-bowl", "#e2bd56", '<path d="M10 31h44l-5 22H15Z" fill="#e7eef0"/><ellipse cx="32" cy="31" rx="22" ry="8" fill="#f4d76c"/><g fill="#e6b94d"><ellipse cx="21" cy="29" rx="7" ry="3" transform="rotate(-12 21 29)"/><ellipse cx="34" cy="33" rx="8" ry="3" transform="rotate(8 34 33)"/><ellipse cx="44" cy="28" rx="7" ry="3" transform="rotate(-8 44 28)"/></g><circle cx="28" cy="28" r="1.5" fill="#5b9e45" stroke="none"/><circle cx="42" cy="33" r="1.5" fill="#5b9e45" stroke="none"/><path d="M16 47c10 4 22 4 32 0" class="detail"/>'],
  ["Nudelsalat", "08-nudelsalat.svg", "pasta-salad-bowl", "#e5a747", '<path d="M10 31h44l-5 22H15Z" fill="#e7eef0"/><ellipse cx="32" cy="31" rx="22" ry="8" fill="#ffe08a"/><path d="M16 29c4-6 8 5 12 0s8 5 12 0 8 4 12 0M19 34c4-5 8 4 12 0s8 4 12 0" class="pasta"/><circle cx="25" cy="28" r="2" fill="#4ca251" stroke="none"/><circle cx="40" cy="33" r="2" fill="#e65b45" stroke="none"/><path d="M16 47c10 4 22 4 32 0" class="detail"/>'],
  ["Coleslaw", "09-coleslaw.svg", "colorful-coleslaw-bowl", "#f0ead7", '<path d="M10 31h44l-5 22H15Z" fill="#e7eef0"/><ellipse cx="32" cy="31" rx="22" ry="8" fill="#fff9e9"/><path d="m16 30 11-5m-5 9 12-7m-4 8 12-8m-5 8 11-6" class="slaw"/><path d="m19 26 8 6m6-7 8 7m3-6 5 5" class="carrot-strip"/><path d="M16 47c10 4 22 4 32 0" class="detail"/>'],
  ["Antipasti", "10-antipasti.svg", "antipasti-platter", "#e64e3c", '<ellipse cx="32" cy="37" rx="25" ry="17" fill="#f3eee3"/><path d="M13 38c7-12 13-13 18-3-6 8-12 9-18 3Z" fill="#e9573e"/><path d="M34 29c6-9 13-8 17 1-4 8-10 10-17 6Z" fill="#ef9d2f"/><circle cx="24" cy="44" r="5" fill="#608237"/><circle cx="39" cy="45" r="5" fill="#446d32"/><circle cx="49" cy="39" r="4" fill="#728f3b"/><path d="M18 37c3-3 6-4 9-3m11-4c3-2 6-2 9 0" class="shine"/><path d="M12 48c12 7 28 7 40 0" class="detail"/>'],
];

function renderSvg(name, motif, marker, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="product-pop-icon product-asset-icon" width="64" height="64" viewBox="0 0 64 64" role="img" data-product-illustration="${motif}">
  <title>${name}</title>
  <rect width="64" height="64" fill="#fff"/>
  <path d="M5 17c13-8 36-9 53 0l-5 35c-14 7-34 7-47-2Z" fill="${marker}" opacity=".16" stroke="none"/>
  <path d="M10 12c15 3 29 4 44 1l-2 11c-15-2-28-1-41 3Z" fill="#ffd646" opacity=".2" stroke="none"/>
  <g stroke="#171513" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round">
    ${body}
  </g>
  <style>
    .detail{fill:none;stroke:#171513;stroke-width:1.7}.fine{fill:none;stroke:#171513;stroke-width:1.35}.shine{fill:none;stroke:#fff;stroke-width:2.5;opacity:.78}.stem,.green-stalk{fill:none;stroke:#328f47;stroke-width:4}.frond{fill:none;stroke:#4a9b4f;stroke-width:2}.tie{fill:none;stroke:#dfad43;stroke-width:4}.slaw{fill:none;stroke:#b5ad91;stroke-width:2}.carrot-strip{fill:none;stroke:#ed7b32;stroke-width:2}.pasta{fill:none;stroke:#d88d28;stroke-width:2.4}
  </style>
</svg>\n`;
}

const batches = [
  { shelfId: "gemuese", appFolder: "01-gemuese", desktopFolder: "01 - Gemüse", icons: vegetables },
  { shelfId: "salat", appFolder: "03-salate-frischetheke", desktopFolder: "03 - Salate & Frischetheke", icons: freshCounter }
];

const manifest = {};

for (const batch of batches) {
  const appDirectory = path.join(root, "assets", "product-icons", batch.appFolder);
  const desktopDirectory = path.join(desktopRoot, batch.desktopFolder);
  await fs.mkdir(appDirectory, { recursive: true });
  await fs.mkdir(desktopDirectory, { recursive: true });

  for (const [name, filename, motif, marker, body] of batch.icons) {
    const svg = renderSvg(name, motif, marker, body);
    await fs.writeFile(path.join(appDirectory, filename), svg, "utf8");
    await fs.writeFile(path.join(desktopDirectory, filename), svg, "utf8");
    manifest[name] = {
      shelfId: batch.shelfId,
      path: `./assets/product-icons/${batch.appFolder}/${filename}`,
      motif
    };
  }
}

const moduleSource = `(function exposeProductIconAssets(globalScope) {
  const productIconAssets = Object.freeze(${JSON.stringify(manifest, null, 2)});
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
`;

await fs.writeFile(path.join(root, "product-icon-assets.js"), moduleSource, "utf8");
console.log(`Generated ${Object.keys(manifest).length} product icons.`);
