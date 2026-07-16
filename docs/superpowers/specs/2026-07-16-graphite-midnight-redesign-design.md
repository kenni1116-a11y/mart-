# Graphite Midnight Redesign

## Status

Freigegebener Entwurf fuer die vollstaendige visuelle Ueberarbeitung der App-Oberflaeche.

## Ziel

Die App soll deutlich ruhiger, dunkler und hochwertiger wirken. Die neue Gestaltung orientiert sich an Apples praeziser Material- und Typografiesprache, behaelt aber den eigenstaendigen Zettel- und Marktcharakter der App.

Das Redesign umfasst Hintergrund, Kopfbereich, Navigation, Pinnwand, einzelne Zettel, Regalansicht und Produktkarten. Bestehende Funktionen, Datenmodelle, Accounts, Supabase-Logik und Synchronisierung bleiben unveraendert.

## Visuelle Richtung

Der Arbeitsname der Designsprache lautet `Graphite Midnight`.

- Grundflaeche: dunkler Verlauf von neutralem Graphit zu tiefem Nachtblau.
- Glasflaechen: transparente, kuehle Oberflaechen mit feinen Konturen und sehr sparsamer Tiefenwirkung.
- Papierflaechen: dunkle, eigenstaendige Zettel mit sichtbarem Hintergrund zwischen den Zetteln.
- Akzente: entsaettigtes Blau, Titan-Silber, warmes Graphit und eine zurueckhaltende Weinfaerbung fuer geteilte Zettel.
- Produktfarben: kraeftige Farben bleiben auf die Produktillustrationen beschraenkt.
- Regalbretter: helles Titan bis gebrochenes Weiss als klare horizontale Fuehrung.
- Keine dekorativen Lichtkugeln, Bokeh-Flaechen oder grossen Marketingeffekte.

## Typografie

Die Schriftrollen werden klar getrennt:

- App-Name: `zettel`, vollstaendig kleingeschrieben, Avenir Next Light, einheitliche Schriftgroesse.
- App-Name: geometrisch auf der Bildschirmmitte, unabhaengig von seitlichen Symbolen.
- Zettelnamen, Regaltitel und Produktnamen: Optima mit ruhigem, leichtem Schnitt.
- Bedienung, Preise, Zaehler, Hinweise und Metadaten: Apple-Systemschrift beziehungsweise SF Pro.
- Keine negative Laufweite und keine viewport-abhaengige Schriftgroesse.
- Lange Produkt- und Regalnamen muessen innerhalb ihrer Flaechen umbrechen oder kontrolliert gekuerzt werden.

## Kopfbereich

Der Kopfbereich wird kompakter und besteht aus drei Ebenen:

1. Eine zentrierte Wortmarke `zettel` mit einem Menue-Symbol links und Account-Zugriff rechts.
2. Eine zweigeteilte Navigation `Pinnwand | Markt`.
3. Kontextbezogene Aktionen innerhalb des aktiven Bereichs.

Die bestehende horizontale Wischbewegung zwischen Zettelbereich und Markt bleibt erhalten. Die neue Navigation steuert denselben Wechsel sichtbar per Tippen. Beim Wischen aktualisiert sich die aktive Schaltflaeche. Dadurch wird keine zweite, konkurrierende Navigationslogik eingefuehrt.

Die bisherigen Punkte Impressum, Bugreport und Mehr wandern in das Menue links. Ihre Funktion bleibt bestehen.

## Pinnwand

Die bisherige Einkaufszettel-Ansicht heisst in der sichtbaren Navigation `Pinnwand`.

- Jeder Zettel bleibt eine eigenstaendige Flaeche.
- Zwischen zwei Zetteln bleibt deutlich sichtbarer Hintergrund.
- Persoenliche Zettel verwenden dunkles Graphitpapier.
- Geteilte Zettel verwenden eine entsaettigte, dunkle Weinfaerbung.
- Beide Varianten behalten die obere Papierlasche als wiedererkennbares Detail.
- Schatten bleiben weich und sparsam; die Trennung entsteht aus Abstand, Kontur und Materialton.
- Der Button `Neuer Zettel` bleibt oberhalb der Pinnwand und im leeren Zustand mittig.
- Zetteltitel, Mitglieder, Teilen, Warenwert, Eingabefeld und Listeneintraege bleiben funktional unveraendert.
- Eintraege werden kompakt dargestellt, ohne Touchflaechen unter 44 CSS-Pixel zu verkleinern.

## Marktbereich

Der Markt behaelt zwei Ebenen: Regalwahl und geoeffnetes Regal.

### Regalwahl

- Drei Regale pro Reihe auf iPhone-Breiten von 393 und 430 Pixeln.
- Jedes Regal zeigt eine einfache, individuelle Regalszene statt eines generischen Kategorie-Icons.
- Regalbretter sind helles Titan beziehungsweise gebrochenes Weiss.
- Regalname und Produktanzahl stehen innerhalb der Regalflaeche.
- Bestehendes langes Druecken, Wackeln und Verschieben bleibt erhalten.
- Das eigene Regal und Favoriten bleiben unveraendert erreichbar.

### Geoeffnetes Regal

- Vier Produkte pro Reihe bleiben erhalten.
- Die Produktkarte verwendet dunkles Glas mit feiner Kontur.
- Produktillustration, Name, Preis und Aktionen erhalten stabile, getrennte Zeilen.
- Favoriten- und Hinzufuegen-Symbole bleiben vollstaendig innerhalb der Produktkarte.
- Die Warenkorb-Aktion wird durch eine helle Titanflaeche betont.
- Zwischen Produktreihen erscheint ein helles Regalbrett als raeumliche Orientierung.
- Fehlende Preise werden weiterhin als `Noch kein Preis verfuegbar` dargestellt.
- Das bestehende Haptik- und Hakenfeedback beim Hinzufuegen bleibt erhalten.

## Hintergrund und Themen

`Graphite Midnight` wird das neue Standardthema. Die vorhandene Einstellung `Hintergrund anpassen` bleibt erhalten und wird spaeter auf kompatible dunkle Varianten begrenzt. In diesem Redesign-Paket wird keine neue Themenverwaltung gebaut.

Die HTML-Metadaten fuer Browser- und PWA-Farbe werden auf die neue dunkle Grundflaeche angepasst. Safe-Area-Abstaende fuer Dynamic Island und iPhone-Benachrichtigungen bleiben bestehen.

## Verhalten und Datenfluss

Das Redesign aendert keine fachlichen Datenfluesse.

- Keine Aenderung an Supabase-Tabellen, RLS, Realtime oder RPCs.
- Keine Aenderung an Account-, Geraete- oder Einladungslogik.
- Keine Aenderung an Mutationswarteschlange, Offline-Verhalten oder Konfliktbehandlung.
- Keine Aenderung an Listen-, Mitglieds-, Artikel-, Markt- oder Preismodellen.
- Bestehende Event-Handler werden weiterverwendet.
- Neue Navigationselemente duerfen nur bestehende Ansichten fokussieren beziehungsweise horizontal in Sicht scrollen.

## Technische Aufteilung

Die Umsetzung erfolgt in kleinen, einzeln pruefbaren Paketen:

1. Design-Tokens, Hintergrund und PWA-Farben.
2. Kopfbereich, Menue und `Pinnwand | Markt`-Navigation.
3. Pinnwand, persoenliche und geteilte Zettel.
4. Regalwahl mit drei Spalten und hellen Regalbrettern.
5. Produktkarten mit vier Spalten und stabilen Aktionsflaechen.
6. Modale, Account- und Supportoberflaechen an die neue Sprache angleichen.
7. Gesamte visuelle und funktionale Regression pruefen und veroeffentlichen.

Jedes Paket erhaelt eigene Browsermessungen und wird vor dem naechsten Paket vollstaendig verifiziert.

## Barrierefreiheit

- Normaler Text erreicht mindestens WCAG-AA-Kontrast.
- Sekundaertext bleibt auf dunklen Flaechen lesbar und wird nicht nur ueber Transparenz abgeschwaecht.
- Fokusrahmen sind deutlich sichtbar.
- Touchziele fuer Befehle bleiben mindestens 44 mal 44 CSS-Pixel gross.
- Die aktive Navigation ist nicht nur ueber Farbe, sondern auch ueber Flaeche und `aria-current` erkennbar.
- `prefers-reduced-motion` deaktiviert Wackeln, grosse Uebergaenge und Materialbewegungen.

## Pruefung

Die vorhandene Verifikationskette bleibt verbindlich. Zusaetzlich werden folgende Browservertraege ergaenzt:

- `zettel` ist kleingeschrieben, einheitlich gross und geometrisch zentriert.
- Die Navigation enthaelt `Pinnwand` und `Markt` und folgt Tippen sowie horizontalem Wischen.
- Mehrere Zettel sind durch sichtbaren Hintergrund getrennt.
- Persoenliche und geteilte Zettel sind unterscheidbar, ohne grelle Farben zu verwenden.
- Regalwahl zeigt auf 393 und 430 Pixeln genau drei Spalten ohne Ueberlauf.
- Produktansicht zeigt genau vier Spalten ohne Text- oder Aktionsueberlauf.
- Alle sichtbaren Befehle haben ausreichende Touchflaechen.
- Texteingabe, Zettelaktionen, Favoriten und Warenkorb funktionieren nach dem Redesign unveraendert.
- Die Produktionspruefung bestaetigt Start, Assets, Service Worker und zentrale Interaktionen.

## Release

Das abgeschlossene Redesign wird als Version `0.7.0`, Build `70`, veroeffentlicht. Die Version wird erst im letzten Umsetzungspaket angehoben, damit keine halbfertige Oberflaeche als neuer Release-Stand erscheint.

## Nicht Teil dieses Redesigns

- Neue Produktillustrationen oder weitere Icon-Batches.
- Neue Supabase- oder Realtime-Funktionen.
- Preisquellen, Kartenanbieter oder Prospekt-Auswertung.
- Neue Account-, Rollen- oder Einladungsfunktionen.
- Neue Hintergrundeditoren oder frei waehlbare Designsysteme.
