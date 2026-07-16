# Optik-Paket 1: kompakte Zettelansicht

## Ziel

Die bestehende Einkaufszettel-Ansicht soll auf einem iPhone ruhiger, kompakter und hochwertiger wirken. Alle vorhandenen Funktionen, Datenmodelle und Supabase-Abläufe bleiben unverändert.

## Gewählte Richtung

Die vorhandene Post-it-Gestaltung wird behutsam verfeinert. Der Zettel bleibt gelb beziehungsweise bei geteilten Listen entsättigt rot, die handschriftliche Schrift bleibt erhalten und die bestehende Anordnung wird nicht grundsätzlich umgebaut.

Die Alternative, den Zettel vollständig neu zu gestalten, hätte unnötig viele Bedienelemente und Browserabläufe berührt. Eine reine Verkleinerung aller Abstände wäre zwar risikoarm, würde aber die unruhige Hierarchie aus Titel, Beteiligten, Status und Aktionen nicht ausreichend verbessern. Deshalb wird die bestehende Struktur gezielt verdichtet und visuell geordnet.

## Umfang

- Außenabstände der App und Abstände zwischen Zetteln auf kleinen Bildschirmen harmonisieren.
- Kopfbereich des Zettels kompakter ausrichten: Zettel-Icon, Titel und Bearbeitungssymbol bilden eine klare Einheit; Anzahl und Teilen bleiben rechts.
- Beteiligte und Statusinformationen in einer niedrigen, stabilen Zeile halten.
- Eingabe für eigene Artikel und Plus-Button auf eine einheitliche, fingerfreundliche Höhe bringen.
- Artikelzeilen niedriger gestalten, ohne Checkbox, Notiz, Nutzer-Badges, Mengensteuerung oder Entfernen-Button zu beeinträchtigen.
- Löschen-/Verlassen-Aktion im Zettelfuß kleiner und ruhiger darstellen, weiterhin eindeutig und gut erreichbar.
- Leerer Zustand und mehrere Zettel bleiben unverändert funktionsfähig.

## Nicht enthalten

- Keine Änderungen an Supabase, Realtime, Accounts, Einladungen oder Berechtigungen.
- Keine neuen Produkt- oder Regalicons.
- Keine Neugestaltung der Marktsimulation.
- Keine neuen Funktionen und keine Änderung bestehender Texte oder Bestätigungsdialoge.

## Responsive Verhalten

Die Zettelansicht wird vorrangig für 393 bis 430 Pixel breite iPhones geprüft. Auf Desktop bleibt die vorhandene maximale Inhaltsbreite erhalten. Bedienelemente dürfen nicht überlappen oder abgeschnitten werden; lange Zettelnamen und Artikelnamen werden weiterhin kontrolliert gekürzt beziehungsweise umgebrochen.

## Prüfung

- Automatischer Browser-Test mit iPhone-Viewport prüft sichtbare, nicht überlappende Zettelbereiche und fingerfreundliche Bedienelemente.
- Bestehende Zwei-Geräte-Tests prüfen weiterhin Hinzufügen, Live-Synchronisierung, Verlassen und Löschen.
- Gesamte Freigabeprüfung umfasst Unit-Tests, Syntax, Asset-Versionen und WebKit-Browser-Tests.
- Abschließende Screenshots werden auf iPhone- und Desktop-Größe visuell kontrolliert.
