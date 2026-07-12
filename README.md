# Einkaufszettel

Eine schlichte Einkaufszettel-App mit Marktsimulation, Favoriten und iPhone-Home-Screen-Unterstützung.

## GitHub Pages

Dieses Projekt ist eine statische Website. Für GitHub Pages reicht es, die Dateien im Repository zu veröffentlichen und Pages auf den Branch `main` mit dem Ordner `/root` zu setzen.

Danach kann die App auf dem iPhone in Safari geöffnet und über Teilen -> Zum Home-Bildschirm installiert werden.

## Accounts und Supabase

Die App erstellt beim ersten Start automatisch einen anonym authentifizierten Geräte-Account mit einem Namen wie `user-A4F82C1`. Einkaufszettel gehören zu einer dauerhaften Account-ID und werden lokal ebenfalls pro Account getrennt gespeichert. Eine E-Mail-Adresse ist nicht erforderlich.

Unter `Mehr` -> `Account` kann der Anzeigename geändert und ein einmal sichtbarer Wiederherstellungscode erzeugt werden. Unter `Account` -> `Geräte` lassen sich weitere Geräte per fünf Minuten gültigem QR-Code, Vergleichscode und Bestätigung durch ein bereits verbundenes Gerät hinzufügen.

Das aktuelle Schema liegt in `supabase/device_accounts_v2.sql`. Es trennt Supabase-Auth-Geräte von dauerhaften Accounts und enthält RLS-Regeln, Recovery, Geräte-Pairing sowie die relationalen gemeinsamen Zettel. In Supabase Auth muss `Allow anonymous sign-ins` aktiviert sein.
