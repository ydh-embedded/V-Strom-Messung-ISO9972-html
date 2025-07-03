# DIN EN ISO 9972:2018-12

## Norm

 -  Das Diagramm zeigt die typische Beziehung zwischen Differenzdruck (Pa) und Volumenstrom (m³/h) bei Blower-Door-Tests.
 -  X-Achse: Differenzdruck in Pascal (Pa)
 -  Y-Achse: Volumenstrom in m³/h
 -  Interaktive Steuerung der Parameter (n₅₀-Wert, Gebäudevolumen, Druckbereich)
 -  Anzeige simulierter Messpunkte mit realistischen Abweichungen
 -  Automatische Berechnung der Kennwerte (n₅₀, q₅₀, V₅₀)

## Grundlagen

 -  Basiert auf der Potenzfunktion V = C × ΔP^n (typisch n = 0,65)
 -  Messbereich entspricht der ISO 9972 (10-100 Pa)
 -  Zeigt sowohl theoretische Kurve als auch simulierte Messpunkte
 -  Berechnet wichtige Kennwerte automatisch

##  Was passiert technisch:

- Daten-Sammlung: Alle Tabellendaten aus index.html werden gesammelt
- Transfer: Daten werden via SessionStorage übertragen
- Tabellen-Erkennung: System findet .data-table Elemente auf Seite 4
- Daten-Ersetzung: Statische Zeilen werden komplett ersetzt
- Visuelle Bestätigung: Hervorhebungen, Animationen, Benachrichtigungen
- Auto-Navigation: Automatisches Scrollen zu den gefüllten Tabellen

 ## Live-Server 

  - Wir starten den Live-Server

  ```bash
  python -m http.server 7000
  ```


## Anordnung der print.css

Logische Neuordnung

- Page Setup → Grundkonfiguration zuerst
- Body & Container → Haupt-Layout
- Navigation → Versteckte Elemente
- Seiten-Layout → Seitenumbrüche und -struktur
- Typography → Schriftarten und Überschriften
- Layouts → Grid und Flex-Systeme
- Tabellen → Datendarstellung
- Formulare → Eingabefelder
- Charts → Diagramme
- Spacing → Abstände
- Dark Mode → Überschreibungen


## Gebäude-Enenergie-Gesetz

Ab dem 1. November 2020 gilt in Deutschland das GEG (Gebäude-Enenergie-Gesetz) und somit tritt auch eine neue Norm für „Bestimmung der Luftdurchlässigkeit von Gebäuden – Differenzdruckverfahren“ in Kraft. Die alte DIN EN 13829 wir dann durch die DIN EN ISO 9972 abgelöst.

Das bedeutet erhebliche, Änderungen im Ablauf der Blowerdoor-Messung und besonders auch Veränderungen in der Planung, auf die sich Messdienstleister,  Energieberater und Planer neu einstellen müssen. Teilweise betreffen die Änderungen konstruktive Entscheidungen, die bereits in der Planungsphase getroffen werden müssen! 

Es muss nun noch mehr auf die luftdichte Planung, die fachgerechte Ausführung und die korrekte Messung geachtet werden!!!

Die wichtigsten Punkte möchten wir Ihnen hier kurz vorstellen:

DIN EN ISO 9972 2018-12 Anhang NA 



Die Gebäude müssen dichter erstellt werden.
Der Messzeitpunkt für die Blowerdoor-Messung muss vor der Fertigstellung liegen
Es muss eine Unter- und eine Überdruckmessung durchgeführt werden und bei beiden Messungen ist der Grenzwert einzuhalten!
Es gibt drei Messverfahren. (1 Prüfung im Nutzungszustand, 2 Prüfung der Gebäudehülle, 3 Prüfung zu einem bestimmten Zweck)
Das Innenvolumen wird anders berechnet.
Die Genauigkeit Messtechnik ist strenger.
Aufzugtüren und Rauchabzüge/Fahrstuhlentrauchungen dürfen nicht abgedichtet werden