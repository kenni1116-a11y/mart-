# Release 0.7.8 und Obst-Icons

## Ziel

Das Impressum wird um den unvollstaendigen Betreiber-Hinweis bereinigt. Gleichzeitig
erhaelt die App mit Version 0.7.8 und Build 78 einen neuen Service-Worker-Cache.
Der bestehende individuelle Produkticon-Satz wird um alle 24 Produkte des Obstregals
erweitert.

## Umfang

- Der Satz `Angaben zum Betreiber werden hier ergänzt.` wird entfernt.
- Kontakt und inhaltliche Verantwortung bleiben als sichtbare Platzhalter erhalten.
- Alle Asset-Query-Strings, Release-Texte und Cache-Namen wechseln auf Build 78.
- Das Obstregal erhaelt fuer jedes Produkt genau ein eigenes SVG-Asset.
- Produkt-, Preis-, Warenkorb-, Favoriten- und Supabase-Logik bleiben unveraendert.

## Illustrationsstil

Die Obst-Illustrationen folgen dem bestehenden ersten Icon-Batch:

- `64 x 64` Pixel ViewBox und weisser Hintergrund.
- Kraeftige, reale Produktfarben mit schwarzer, leicht handgezeichneter Kontur.
- Ein bis zwei transparente, kantige Farbmarkierungen hinter dem Motiv.
- Keine Beschriftung im Bild, ausser dem unsichtbaren SVG-`title`.
- Jedes Motiv ist auch in der kleinen Vier-Spalten-Produktkarte eindeutig erkennbar.

Besondere Motive: ein ueberwiegend roter Apfel mit gelb-gruenem Akzent, drei dicke
Bananen, farblich klar getrennte Zitrusfruechte, deutlich unterscheidbare Beeren,
eine gruene Kiwihaelfte mit brauner Schale, eine gelb-orange Mango mit gruen-gelber
Schale, ein Ananasring, halbierte Melonen, ein Haeufchen violetter Pflaumen und ein
aufgeschnittener Granatapfel mit roten Kernen. Die uebrigen Produkte erhalten jeweils
ihre typische Form und Farbe.

## Asset-Vertrag

`product-icon-assets.js` enthaelt die Obstprodukte in derselben Reihenfolge wie
`shelves[1].products` in `app.js`. Jeder Eintrag besitzt:

- `shelfId: "obst"`
- einen eindeutigen Pfad unter `assets/product-icons/02-obst/`
- ein eindeutiges, kleingeschriebenes `motif`

Jede Datei traegt `data-product-illustration="<motif>"` und einen passenden
`<title>Produktname</title>`.

## Pruefung

Automatisierte Tests sichern Anzahl, Reihenfolge, Pfade, eindeutige Motive,
SVG-Sicherheit, Release-Metadaten und Cache-Busting ab. Danach folgen die komplette
Unit-/Syntaxpruefung, WebKit-Browsertests sowie eine visuelle Kontrolle des Obstregals
auf iPhone-Breite.
