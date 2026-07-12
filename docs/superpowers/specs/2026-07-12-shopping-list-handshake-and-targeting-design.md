# Einkaufszettel: QR-Beitritt, aktiver Zielzettel und Warenwert

## Ziel

Die bestehende Einkaufszettel-App wird stabilisiert und um vier zusammenhängende Funktionen ergänzt:

- Ein QR-Code im Teilen-Dialog ermöglicht den unmittelbaren Beitritt zu einem Einkaufszettel.
- Ein ausdrücklich aktivierter Zettel ist das alleinige Ziel für Produkte aus dem Markt.
- Jeder Zettel zeigt unter seiner Artikelliste einen geschätzten Gesamtwarenwert.
- Die Eingabe „Eigener Artikel“ bietet auswählbare Vorschläge aus Katalog und bisherigen Artikeln.

Zusätzlich werden die bereits festgestellten Synchronisierungsfehler bei Listen-Persistenz und fehlgeschlagener Link-Erneuerung behoben.

## Festgelegte Produktentscheidungen

### QR-Handshake

Der Scan schließt den Beitritt ohne Bestätigung durch den Besitzer ab. Der Teilen-Dialog rendert den bereits vorhandenen Einladungslink zusätzlich als QR-Code. Die Kamera des zweiten Geräts öffnet diesen Link; die bestehende Join-Funktion prüft Listen-ID und Einladungscode über Supabase und fügt das aktuelle Konto als Mitglied hinzu. Es gibt keine neue Handshake-Tabelle und keinen separaten Freigabeschritt.

Der QR-Code ist nur eine zweite Darstellung desselben Einladungslinks. „Link erneuern“ widerruft deshalb sowohl den bisherigen Link als auch dessen QR-Code.

### Aktiver Zielzettel

Genau ein Zettel kann als Ziel für Produkte aus dem Markt aktiv sein. Oben mittig auf jedem Zettel befindet sich ein länglicher Button mit dem Text „Aktiv“ beziehungsweise „Für Einkäufe aktivieren“.

Der aktive Zettel wird durch eine helle, leicht blaue Kontur und einen weichen Schatten hervorgehoben. Nur das Betätigen des Aktivierungsbuttons ändert das Ziel. Das Umbenennen, Bearbeiten, Öffnen oder manuelle Ergänzen eines anderen Zettels darf den aktiven Zielzettel nicht ändern.

Produkte aus Markt und Regalen werden immer dem aktiven Zettel hinzugefügt. Die Eingabe „Eigener Artikel“ gehört dagegen zu der Zettelkarte, in der sie angezeigt wird, und fügt dort hinzu.

Die aktive Listen-ID bleibt kontobezogen in `localStorage` gespeichert. Wird der aktive Zettel gelöscht oder verlassen, wird der nächstverfügbare Zettel aktiviert. Wird ein neuer Zettel erstellt, wird er nur dann automatisch aktiv, wenn zuvor kein Zettel aktiv war.

### Geschätzter Warenwert

Unter dem letzten Artikel und vor der Eingabe „Eigener Artikel“ steht eine kompakte Zusammenfassung:

`Geschätzter Warenwert: 12,34 €`

Für jeden Artikel wird der günstigste aktuell hinterlegte Marktpreis mit seiner Menge multipliziert. Artikel ohne bekannten Preis werden nicht geschätzt. Wenn solche Artikel vorhanden sind, ergänzt die Anzeige beispielsweise `2 Artikel ohne Preis`. Ist für keinen Artikel ein Preis vorhanden, wird `Noch kein Warenwert verfügbar` angezeigt.

Abgehakte Artikel bleiben Teil des Warenwerts, solange sie auf dem Zettel stehen. Gelöschte Artikel werden nicht berücksichtigt.

### Vorschläge für „Eigener Artikel“

Während der Eingabe erscheinen maximal fünf passende Vorschläge. Die Quellen sind:

1. der vorhandene Produktkatalog;
2. Artikelnamen, die aktuell oder früher in den lokal verfügbaren Zetteln des Kontos vorkommen.

Die Suche ignoriert Groß-/Kleinschreibung und Akzente, entfernt Duplikate und priorisiert Präfixtreffer vor sonstigen Teiltreffern. Ein Vorschlag kann per Touch, Mausklick, Pfeiltasten und Enter ausgewählt werden. Ein Katalogprodukt behält dabei seine Produkt-ID und damit seine Preisinformationen; ein historischer eigener Artikel wird als neuer manueller Artikel mit eigener ID angelegt.

Die Vorschlagsliste schließt sich nach Auswahl, bei leerer Eingabe, bei Escape und beim Fokuswechsel außerhalb der Eingabe.

## Technische Architektur

Die App bleibt eine statische Website ohne Build-Schritt. Reine, testbare Berechnungen werden in einer kleinen browser- und Node-kompatiblen Logikdatei gekapselt. Dazu gehören Warenwertberechnung, Vorschlagsermittlung und begrenzte Parallelisierung. `app.js` bleibt für DOM, Zustand und Supabase-Orchestrierung zuständig.

Neue oder geänderte Browser-Assets werden in den Service-Worker-Cache aufgenommen; die Cache-Version wird erhöht.

Es sind keine Schemaänderungen erforderlich. Das bestehende `join_shopping_list`-RPC und die bestehenden RLS-Regeln bleiben die Autorität für einen Beitritt.

## Synchronisierung und Fehlerbehandlung

### Listen-Persistenz

Die Update-oder-Insert-Logik für eigene Listen bleibt erhalten, wird aber nicht mehr unbeschränkt seriell ausgeführt. Listenzeilen werden mit einer kleinen, festen Parallelitätsgrenze verarbeitet. Mitglieds- und Artikelzeilen werden erst geschrieben, nachdem alle benötigten Elternzeilen erfolgreich vorhanden sind. Beim ersten Fehler wird der gesamte Publish-Vorgang als fehlgeschlagen behandelt und wie bisher durch den Sync-Status sichtbar gemacht.

### Einladung erneuern

Vor einer Erneuerung werden alter Einladungscode und Zeitstempel gesichert. Der neue Code wird zunächst ohne Hintergrund-Broadcast lokal gesetzt und ausdrücklich ohne Offline-Warteschlange veröffentlicht. Schlägt die Veröffentlichung fehl, wird der vorherige lokale Zustand wiederhergestellt. Damit kann ein nicht angezeigter neuer Code weder später unbemerkt synchronisiert noch der bisherige Link unerwartet ungültig werden.

Der normale Teilen-Dialog zeigt Link und QR-Code erst, nachdem die aktuelle Liste erfolgreich online gespeichert wurde.

### QR- und Join-Fehler

Ein ungültiger oder widerrufener QR-Link zeigt die bestehende verständliche Einladung-Fehlermeldung. Ein bereits vorhandenes Mitglied erhält den aktuellen Serverstand der Liste, ohne ein doppeltes Mitglied anzulegen. Netzwerkfehler lassen die lokale Zielauswahl unverändert.

## Bedienoberfläche

Die neue Aktiv-Markierung verwendet die vorhandenen Farben, Radien und Schatten des Papierkarten-Designs. Sie darf weder Drag- noch Eingabeelemente überdecken. Auf kleinen Bildschirmen bleibt der Button innerhalb der Kartenbreite und besitzt eine ausreichend große Touch-Fläche.

Der Warenwert ist visuell der Artikelliste zugeordnet, aber schwächer als der Zetteltitel. Vorschläge erscheinen als schwebende Liste direkt unter „Eigener Artikel“ und bleiben innerhalb der jeweiligen Zettelkarte.

Im Teilen-Dialog stehen QR-Code, kurzer Einladungscode, Linkfeld und Aktionen in dieser Reihenfolge. Der QR-Code erhält einen lesbaren Text als Alternative.

## Teststrategie

Automatisierte Node-Tests decken mindestens ab:

- Warenwert mit Mengen, fehlenden Preisen und leeren Zetteln;
- Sortierung, Deduplizierung und Begrenzung der Vorschläge;
- Auswahl eines Katalogprodukts gegenüber einem historischen manuellen Artikel;
- Parallelitätsgrenze und Fehlerweitergabe der Listen-Persistenz;
- Rollback eines Einladungscodes nach fehlgeschlagener Veröffentlichung;
- Aktivierungsregeln beim Erstellen, Löschen und manuellen Ergänzen.

Zusätzlich werden JavaScript-Syntax, `git diff --check`, Service-Worker-Assets und die Oberfläche im lokalen Browser geprüft. Die Browserprüfung umfasst Aktiv-Markierung, korrektes Ziel bei Marktprodukten, Warenwertposition, Vorschlagsbedienung und QR-Darstellung. Ein produktiver Supabase-Schreibtest erfolgt nur, wenn eine sichere Testidentität beziehungsweise ein isoliertes Testprojekt verfügbar ist.

## Nicht im Umfang

- Ein eingebauter Kamera-Scanner;
- eine Besitzerfreigabe nach dem Scan;
- eine neue Supabase-Handshake-Tabelle;
- manuell pflegbare Preise für eigene Artikel;
- serverseitige Produktempfehlungen.
