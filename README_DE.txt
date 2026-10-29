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


VERSION 4 – LIVE-STANDORT + NAVIGATIONSÜBERSICHT
- Neue Navigationskarte mit hervorgehobenem Ziel.
- „Standort verfolgen“ verwendet GPS-Updates im geöffneten Browser.
- Versucht, die Straßenroute neu zu berechnen, wenn sich der Standort um mehr als etwa 60 m verändert.
- Routing und Karten benötigen weiterhin Internet. Keine Offline-Karte, keine Offline-Routenberechnung,
  keine Turn-by-turn-/Sprachanweisungen und keine garantierte Hintergrund-GPS-Nutzung.
- Öffentliche OSRM-Demo ist nur für Tests geeignet; kein garantierter Produktionsdienst.


VERSION 5 – ORGANIC MAPS VERKNÜPFUNG
- Zusätzlicher Knopf „In Organic Maps navigieren“ für das nächste offene Ziel.
- Öffnet Organic Maps über dessen iOS Deep Link mit Zielkoordinaten und Fahrmodus.
- Organic Maps muss installiert sein und die passenden Offline-Karten müssen vorher heruntergeladen sein.
- Das Öffnen und der genaue Navigationsmodus sollten auf dem iPhone getestet werden.
- Die PostRoute-App selbst berechnet weiterhin keine Offline-Routen; die Offline-Navigation erfolgt in Organic Maps.


VERSION 6 – ORGANIC MAPS DEEP LINK FIX
- The Organic Maps route link now includes origin=currentLocation plus destination coordinates.
- This follows the documented v2 route-link shape. Test on the target iPhone; app behavior can vary by version.


Version 7: Der Organic-Maps-Button verwendet jetzt die tatsächlichen GPS-Koordinaten als Startpunkt und öffnet die dokumentierte Routenplanung (om://v2/dir). Organic Maps soll die Route anzeigen; dort anschließend Navigation starten.


VERSION 8 – ORGANIC MAPS OFFIZIELLER ROUTENLINK
- Verwendet den auf der offiziellen Organic-Maps-API-Testseite dokumentierten /route-Link mit Start- und Zielkoordinaten.
- Der Link wird als https://omaps.app/route geöffnet, damit iOS den Universal Link an Organic Maps übergeben kann.
- Auf dem iPhone testen; falls eine Auswahl erscheint, „In Organic Maps öffnen“ bestätigen.


VERSION 9 – GPS-ÜBERGABE KORRIGIERT
- Korrigiert den Zugriff auf den aktuellen Standort: PostRoute speichert GPS-Koordinaten als Array [Breitengrad, Längengrad].
- Der Organic-Maps-Link verwendet das getestete Format /route?sll=...&dll=...&type=vehicle.
- Service-Worker-Cache wurde auf v9 angehoben, damit die aktualisierte app.js geladen wird.
