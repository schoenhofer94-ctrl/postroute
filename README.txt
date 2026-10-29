PostRoute – Offline-Karten-Integration (Testversion)

BITTE BEACHTEN
- Dies ist eine Testversion, kein garantiert fertig offline funktionierendes Produkt.
- Sie verwendet MapLibre GL JS und PMTiles. Die Bibliotheken werden beim ersten Online-Besuch vom CDN geladen und vom Service Worker zwischengespeichert.
- Die .pmtiles-Datei wird per Dateiauswahl in den Origin Private File System (OPFS) kopiert, sofern der Browser diese API und genügend Speicherplatz unterstützt.
- Auf iOS/Safari kann Browser-Speicher eingeschränkt sein. Import kann fehlschlagen, unterbrochen werden oder Daten können später entfernt werden. Vor dem Einsatz auf einer echten Zustellrunde bitte im Flugmodus prüfen.
- Adresssuche und Straßenrouting bleiben online. Organic Maps bleibt eine externe Navigationsoption.
- Vektorkarte ist auf Zoomstufe 14 begrenzt; Hausnummern/Buildings hängen von den Daten ab.

INSTALLATION
1. ZIP entpacken.
2. Ersetze im GitHub-Repository die Dateien index.html, style.css, app.js, service-worker.js und manifest.json mit diesen Dateien.
3. Commit/Änderungen speichern und warten, bis GitHub Pages aktualisiert ist.
4. Öffne die veröffentlichte Seite auf dem iPhone in Safari bei stabiler WLAN-Verbindung.
5. Warte, bis die Seite vollständig geladen ist. Falls nötig Seite neu laden, damit der neue Service Worker aktiv wird.
6. Öffne in der App „Offline-Karte importieren“ und wähle die .pmtiles-Datei aus der Dateien-App.
   Dafür muss die Kartendatei vorher auf dem iPhone verfügbar sein. Du kannst sie z. B. über iCloud Drive, USB/Computer-Synchronisierung oder eine andere Dateiübertragung in die Dateien-App kopieren.
7. Lass Safari geöffnet, bis „Import abgeschlossen“ angezeigt wird.
8. Schließe die Seite, öffne sie erneut und prüfe, ob die Karte erhalten blieb.
9. Schalte den Flugmodus ein und prüfe die Karte sowie die Zustellliste.

WICHTIGER HINWEIS ZUR KARTENÜBERTRAGUNG
Die PMTiles-Datei ist etwa 1,03 GB groß. Sie muss auf das iPhone übertragen werden; die Auswahl auf dem PC allein reicht nicht. Beim Import kann zusätzlicher freier Gerätespeicher nötig sein. Die Testversion prüft die Browser-Speicherquote, aber das ist keine Garantie, dass iOS den kompletten Import erlaubt.

ROLLBACK
Bewahre eine Kopie deiner bisherigen Dateien auf, damit du sie bei Problemen zurücksetzen kannst.
