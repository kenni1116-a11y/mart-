# Einkaufszettel

Eine schlichte Einkaufszettel-App mit Marktsimulation, Favoriten und iPhone-Home-Screen-Unterstützung.

## GitHub Pages

Dieses Projekt ist eine statische Website. Für GitHub Pages reicht es, die Dateien im Repository zu veröffentlichen und Pages auf den Branch `main` mit dem Ordner `/root` zu setzen.

Danach kann die App auf dem iPhone in Safari geöffnet und über Teilen -> Zum Home-Bildschirm installiert werden.

## Accounts und Supabase

Die App verwendet dauerhafte Supabase-E-Mail-Accounts. Einkaufszettel werden unter der Supabase-Nutzer-ID gespeichert und lokal ebenfalls pro Account getrennt.

Für ein neues Supabase-Projekt enthält `supabase/relational_collaboration_schema.sql` das vollständige relationale Listen-Schema. Bei einem bestehenden Projekt dokumentieren `supabase/account_scoped_auth.sql` und `supabase/harden_account_helpers.sql` die nachträgliche Kontoabsicherung.

In Supabase Auth muss `https://kenni1116-a11y.github.io/mart-/` als Site URL und erlaubte Redirect URL eingetragen sein. Anonymous Sign-Ins sollten deaktiviert werden. Mit dem Supabase-Standardversand erfolgt die Anmeldung über den Link in der neuesten E-Mail.
