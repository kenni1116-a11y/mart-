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
