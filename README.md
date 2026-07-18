# Einkaufszettel

Eine schlichte Einkaufszettel-App mit Marktsimulation, Favoriten und iPhone-Home-Screen-Unterstützung.

## Lokal prüfen

Die lokale Freigabeprüfung umfasst Unit-Tests, Syntax- und Cache-Prüfungen sowie einen isolierten WebKit-Test mit zwei Geräten:

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install webkit
pnpm verify
```

Die SQL-Integrationstests laufen ausschließlich mit einer geschützten direkten Datenbankverbindung:

```bash
SUPABASE_DB_URL="..." pnpm test:sql
```

SQL-Fixtures werden in Transaktionen angelegt und am Ende zurückgerollt.

Neue Dateien unter `supabase/` werden vor dem zugehörigen Client-Release als Migration im Supabase-Projekt installiert. Der GitHub-Workflow führt absichtlich keine Produktions-DDL aus; seine SQL-Tests prüfen stattdessen, dass die benötigten RPCs bereits vorhanden sind, und stoppen andernfalls das Deployment.

## GitHub Pages

Ein Push auf `main` startet `.github/workflows/verify-and-deploy.yml`. Erst nach erfolgreicher Prüfung und den transaktionalen SQL-Tests wird die statische App über GitHub Pages veröffentlicht. Anschließend prüft ein WebKit-Smoke-Test die veröffentlichte Version; bei einem Fehlschlag ist ein Rollback auf das letzte erfolgreiche Pages-Artefakt vorbereitet.

Im Repository muss dafür das Actions-Secret `SUPABASE_DB_URL` gesetzt und GitHub Pages als Quelle auf `GitHub Actions` gestellt sein. Zugangsdaten gehören nie in Dateien oder Logs.

Danach kann die App auf dem iPhone in Safari geöffnet und über Teilen -> Zum Home-Bildschirm installiert werden.

## Accounts und Supabase

Die App erstellt beim ersten Start automatisch einen anonym authentifizierten Geräte-Account mit einem Namen wie `user-A4F82C1`. Einkaufszettel gehören zu einer dauerhaften Account-ID und werden lokal ebenfalls pro Account getrennt gespeichert. Eine E-Mail-Adresse ist nicht erforderlich.

Im Profil oben rechts kann der Anzeigename geändert und ein einmal sichtbarer Wiederherstellungscode erzeugt werden. Unter `Deine Geräte` lassen sich weitere Geräte per fünf Minuten gültigem QR-Code, Vergleichscode und Bestätigung durch ein bereits verbundenes Gerät hinzufügen. Der Wiederherstellungscode muss außerhalb der App privat aufbewahrt werden.

Eine **Listen-Einladung** gibt einem anderen Account Zugriff auf genau einen Einkaufszettel. Das **Geräte-Pairing** verbindet dagegen ein weiteres Gerät mit demselben Account und damit mit allen zugehörigen Zetteln. Diese Links dürfen nicht miteinander vertauscht werden.

Am Ende der Account-Ansicht kann der aktuelle Account über `Account löschen` entfernt werden. Erst `Ja` führt die serverseitige Löschung aus; `Abbrechen` lässt Account, Geräte und Zettel unverändert.

`supabase/device_accounts_v2.sql` ist historisches Bootstrap-Material und kein Reset-Skript. Laufende Änderungen werden über die einzelnen versionierten SQL-Dateien in `supabase/` migriert. In Supabase Auth muss `Allow anonymous sign-ins` aktiviert sein.
