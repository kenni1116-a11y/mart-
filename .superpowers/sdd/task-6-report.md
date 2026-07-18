# Task 6 Bericht: Profil-Register Integration

### Umsetzung

- Das rechte Profil-Register hat jetzt stabile Abschnittsmarker in der Reihenfolge `account`, `pairing`, `devices`, `danger`.
- QR-Verbindung, Vergleichsstatus, Kopieren, Wiederholen, Polling, Geraeteverwaltung, Wiederherstellung und Account-Loeschung bleiben im Registerablauf erhalten.
- Wiederherstellungs- und Loeschdialoge kehren beim Schliessen wieder zum offenen Profil-Register zurueck. Nach einer erfolgreichen Account-Loeschung werden keine Oberflaechen wiederhergestellt.
- Die alte Vollbild-Profilpraesentation wurde entfernt. Dialoge bleiben allgemeine Dialoge; das Profil erscheint ausschliesslich als rechtes, scrollbares Register.
- Die vorhandene Sperr- und Identitaetslogik fuer Profilname und Avatar blieb unveraendert.

### Tests

- RED: Die neuen Register-Tests schlugen erwartungsgemaess fehl, weil die Abschnittsmarker noch fehlten.
- GREEN: Fokuspruefung mit Profilreihenfolge, QR-Status, Mindestgroessen, Register-Exklusivitaet sowie Modal-Rueckkehr: 3 WebKit-Tests bestanden.
- Vollstaendig: `pnpm verify` bestand mit 81 Unit- und Release-Tests.
- Vollstaendig: `pnpm test:browser -- --project=webkit` bestand mit 42 WebKit-Tests.
- Syntax-, Cache- und `git diff --check`-Pruefungen bestanden.

### Commit

- `feat: complete profile register workflows`

---

## Review-Fixes: Profil-Modal-Rueckkehr

### Umsetzung

- Die Geraeteverwaltung bewahrt ihre Profil-Herkunft. Schliessen ueber X oder den Hintergrund sowie der ausdrueckliche Zurueck-Button fuehren wieder in das Profil-Register.
- Das Ergebnis eines neu erzeugten Wiederherstellungscodes bewahrt die beim Start erfasste Profil-Herkunft und Account-Sitzung.
- Nach einer erfolgreichen Account-Wiederherstellung wird die neue Account-Identitaet nicht durch ein erneut geoeffnetes Profil-Register ueberlagert; X, Hintergrund und `Fertig` schliessen dort nur den Ergebnisdialog.
- Die vorhandene Sperr- und Nebenlaeufigkeitslogik fuer Profilname und Avatar blieb unveraendert.

### Tests

- RED: Die neue Geraeteverwaltungs-Regression lief in den erwarteten Timeout, weil X das Profil-Register nicht wiederherstellte.
- GREEN: 3 fokussierte WebKit-Tests fuer Geraeteverwaltung, Wiederherstellungscode und erfolgreiche Account-Loeschung bestanden.
- Vollstaendig: `pnpm verify` bestand mit 81 Unit- und Release-Tests.
- Vollstaendig: die gesamte WebKit-Suite bestand mit 45 Tests.
- Syntax-, Cache- und `git diff --check`-Pruefungen bestanden.

### Commit

- `fix: preserve profile modal returns`
