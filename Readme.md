# Iso 9972

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