# Tastaturnavigation mit Leertaste

## Übersicht

Diese Implementierung fügt eine intelligente Tastaturnavigation zu den HTML-Seiten hinzu, die es ermöglicht, mit der Leertaste durch alle interaktiven Elemente zu navigieren.

## Funktionalität

### Automatische Erkennung
- **index.html**: Navigiert durch alle Buttons
- **protocol.html**: Navigiert durch alle Input-Felder (input, textarea, select)
- **Gemischte Seiten**: Navigiert durch alle interaktiven Elemente

### Tastenkombinationen
- **Leertaste**: Aktiviert die Navigation / Springt zum nächsten Element
- **Enter**: Aktiviert das aktuell hervorgehobene Element
- **Escape**: Beendet die Navigation

## Visuelle Hervorhebung

### Highlight-Effekt
- Rote Umrandung um das aktuelle Element
- Pulsierender Ziel-Emoji (🎯) als Indikator
- Sanfte Animationen für bessere Benutzererfahrung

### UI-Elemente
- **Zähler**: Zeigt aktuelle Position (z.B. "3/18") oben rechts
- **Info-Panel**: Zeigt Tastenkombinationen unten links
- **Auto-Scroll**: Scrollt automatisch zum aktuellen Element

## Implementierte Dateien

### 1. keyboard-navigation.js
Das Hauptmodul mit der kompletten Navigationslogik:

```javascript
class KeyboardNavigation {
    // Automatische Seitenerkennung
    // Elementfilterung nach Sichtbarkeit
    // Event-Handling für Tastatureingaben
    // UI-Management für Hervorhebung
}
```

### 2. Aktualisierte HTML-Dateien

#### index.html
```html
<!-- Keyboard Navigation -->
<script src="./js/keyboard-navigation.js"></script>
```

#### protocol.html
```html
<!-- Keyboard Navigation -->
<script src="./js/keyboard-navigation.js"></script>
```

### 3. demo.html
Eine vollständige Demo-Seite zum Testen der Funktionalität mit:
- Button-Navigation (simuliert index.html)
- Input-Navigation (simuliert protocol.html)
- Test-Funktionen
- Interaktive Anleitung

## Technische Details

### Seitenerkennung
```javascript
getCurrentPage() {
    // Erkennt basierend auf URL, Titel und Elementtypen
    // Rückgabe: 'index', 'protocol', oder 'mixed'
}
```

### Elementfilterung
```javascript
isElementVisible(element) {
    // Prüft Sichtbarkeit, Größe und CSS-Eigenschaften
    // Filtert disabled/readonly Elemente aus
}
```

### Event-Handling
```javascript
// Verhindert Konflikte mit normaler Eingabe
if (e.code === 'Space' && !this.isInputFocused()) {
    e.preventDefault();
    this.handleSpacePress();
}
```

## Verwendung

### Automatische Initialisierung
Das Script wird automatisch beim Laden der Seite initialisiert:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    keyboardNavigation = new KeyboardNavigation();
});
```

### Manuelle Steuerung
```javascript
// Navigation aktivieren/deaktivieren
window.keyboardNavigation.toggle();

// Status abfragen
const status = window.keyboardNavigation.getStatus();

// Elemente neu scannen
window.keyboardNavigation.refresh();
```

## Browser-Kompatibilität

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile Browser (mit Touch-Unterstützung)

## Besonderheiten

### Intelligente Filterung
- Nur sichtbare und interaktive Elemente werden berücksichtigt
- Automatische Aktualisierung bei DOM-Änderungen
- Respektiert disabled/readonly Zustände

### Performance-Optimierung
- Mutation Observer für effiziente DOM-Überwachung
- Throttling bei häufigen Änderungen
- Minimaler Memory-Footprint

### Accessibility
- Kompatibel mit Screen Readern
- Respektiert bestehende Tab-Reihenfolge
- Keine Interferenz mit nativer Tastaturnavigation

## Debugging

### Konsolen-Ausgaben
```
🎹 Keyboard Navigation initialisiert
🔍 18 navigierbare Elemente gefunden auf index-Seite
✅ Keyboard Navigation aktiviert
➡️ Navigation zu Element 3/18
```

### Globale Referenz
```javascript
// Für Debugging verfügbar
window.keyboardNavigation.getStatus();
```

## Anpassungen

### CSS-Klassen
```css
.keyboard-nav-highlight {
    /* Haupthervorhebung */
}

.keyboard-nav-counter {
    /* Positionszähler */
}

.keyboard-nav-info {
    /* Info-Panel */
}
```

### Konfiguration
```javascript
// Anpassbare Eigenschaften
this.highlightClass = 'keyboard-nav-highlight';
this.currentIndex = 0;
this.isActive = false;
```

## Installation

1. Kopieren Sie `keyboard-navigation.js` in den `js/` Ordner
2. Fügen Sie das Script-Tag vor dem schließenden `</body>` Tag hinzu:
   ```html
   <script src="./js/keyboard-navigation.js"></script>
   ```
3. Die Navigation ist sofort einsatzbereit!

## Support

Bei Fragen oder Problemen:
- Überprüfen Sie die Browser-Konsole auf Fehlermeldungen
- Testen Sie mit der `demo.html` Datei
- Verwenden Sie `window.keyboardNavigation.getStatus()` für Debugging

