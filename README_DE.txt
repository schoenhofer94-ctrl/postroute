PostRoute 2 – Adresssuche + Kartenpunkte
=========================================

NEU:
- Karte rund um Kilb (OpenStreetMap)
- Adressen online suchen
- Suchtreffer auf der Karte ansehen und zur Route hinzufügen
- Direkt auf die Karte tippen und einen eigenen Adressnamen eingeben
- Ziele bleiben lokal im Browser gespeichert
- Reihenfolge, Erledigt, Überspringen, Abschnittsgrenze, Standortanzeige
- Route als JSON sichern/wiederherstellen

WICHTIG:
Dies ist weiterhin ein Prototyp. Es gibt noch keine echte Routenberechnung entlang der Straßen,
keine Turn-by-turn-Navigation und keine Offline-Karten. Die Adresssuche und Kartentiles brauchen Internet.
Ein Kartenklick wählt einen Punkt aus, aber garantiert nicht, dass dort tatsächlich ein Haus liegt.
OpenStreetMap-Hausnummern können unvollständig sein.

START AM WINDOWS-PC:
1. Im Ordner mit index.html oben in die Explorer-Adressleiste klicken.
2. cmd eingeben und Enter drücken.
3. Befehl: python -m http.server 8000
4. Im Browser öffnen: http://localhost:8000

Für Installation am iPhone als Web-App braucht man üblicherweise eine HTTPS-Adresse (z. B. kostenloses
Hosting). Die lokale Adresse localhost auf dem PC funktioniert nicht direkt als Adresse auf dem iPhone.

Hinweis: Für OpenStreetMap und Nominatim gelten Nutzungsrichtlinien. Bitte keine automatisierten Massenabfragen
durchführen. Dieses Beispiel fragt nur bei einer manuellen Suche ab.


VERSION 3 – STRASSENROUTE (ONLINE-PROTOTYP)
- „Mein Standort“ speichert den aktuellen GPS-Standort.
- „Nächstes offenes Ziel“ versucht eine Straßenroute vom GPS-Standort zum Ziel einzuzeichnen.
- Diese Funktion benötigt Internet und nutzt einen öffentlichen OSRM-Demodienst. Sie ist nicht für garantierte
  Navigation im Produktivbetrieb gedacht.
- Noch KEINE Offline-Routenberechnung, KEINE Offline-Karten und KEINE Sprachführung.
- Für Offline-Betrieb müssen Kartendaten und Routing-Engine später ausdrücklich eingebaut und auf dem iPhone getestet werden.
