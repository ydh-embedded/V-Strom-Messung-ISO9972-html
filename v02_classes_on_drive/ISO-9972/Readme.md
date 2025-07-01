# Blower Door Messprotokoll nach ISO 9972

Eine professionelle Webanwendung zur Durchführung und Dokumentation von Blower Door Messungen nach DIN EN ISO 9972.

## 🚀 Features

- **Messdatenerfassung**: Separate Erfassung von Unter- und Überdruckmessungen
- **Echtzeitanalyse**: Interaktive Diagramme mit Chart.js
- **Professionelle Protokolle**: 8-seitiges druckoptimiertes Messprotokoll
- **Responsive Design**: Optimiert für Desktop, Tablet und mobile Geräte
- **Print-ready**: Perfekt formatierte A4-Querformat Ausdrucke

## 📋 Projektstruktur

```
blower-door-protocol/
├── index.html                 # Hauptanwendung
├── package.json              # Node.js Abhängigkeiten
├── tailwind.config.js        # Tailwind CSS Konfiguration
├── postcss.config.js         # PostCSS Konfiguration
├── vite.config.js            # Vite Build-Tool Konfiguration
├── src/
│   ├── css/
│   │   └── input.css         # Tailwind Input CSS
│   └── js/
│       └── app.js            # JavaScript Funktionalität
├── dist/
│   └── css/
│       └── output.css        # Kompilierte CSS (generiert)
└── README.md                 # Diese Datei
```

## 🛠 Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn Package Manager

### Schnellstart

1. **Repository klonen oder Dateien herunterladen**
   ```bash
   git clone <repository-url>
   cd blower-door-protocol
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **CSS kompilieren**
   ```bash
   npm run build-css
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **Produktions-Build erstellen**
   ```bash
   npm run build
   ```

## 📦 Verfügbare Scripts

- `npm run dev` - Startet Vite Entwicklungsserver (Port 3000)
- `npm run build` - Erstellt Produktions-Build
- `npm run preview` - Vorschau des Produktions-Builds
- `npm run build-css` - Kompiliert CSS im Watch-Modus
- `npm run build-css-prod` - Kompiliert minimiertes CSS für Produktion

## 🎨 Tailwind CSS Setup

Das Projekt verwendet Tailwind CSS für das Styling. Die Konfiguration umfasst:

### Custom Colors
- **Brand Colors**: Professionelle Blautöne für die Markenidentität
- **Measurement Colors**: Spezifische Farben für verschiedene Messarten
- **Print Colors**: Optimierte Farben für den Druck

### Custom Components
- **Elegant Buttons**: Buttons mit Hover-Effekten und Animationen
- **Glass Effects**: Moderne Glassmorphismus-Effekte
- **Measurement Cards**: Spezielle Karten für Messdaten
- **Slider Components**: Custom Slider für Parameter-Eingabe

### Print Optimierung
- A4 Querformat Support
- Spezielle Print-Utilities
- Automatische Seitenumbrüche
- Optimierte Typografie für Druck

## 🧩 Hauptkomponenten

### 1. Navigation
- Responsive Navigation mit Smooth-Transitions
- Icon-basierte Menüpunkte
- Aktive Seitenverfolgung

### 2. Messdatenerfassung
- Getrennte Unter- und Überdrucktabellen
- Dynamische Tabellenzeilen
- Echtzeitvalidierung
- Parameter-Slider mit visueller Rückmeldung

### 3. Datenanalyse
- Interactive Charts mit Chart.js
- Theoretische Kurvenberechnung
- Konfigurierbarer Datenexport
- Berechnete Kennwerte (n₅₀, q₅₀, V₅₀)

### 4. Protokollerstellung
- 8-seitige Protokollvorlage
- Swipe/Slide Navigation
- Auto-Datumseingabe
- Druckoptimierung

## 🖨 Druckfunktionalität

Das Protokoll ist speziell für den Druck optimiert:

- **Format**: A4 Querformat
- **Ränder**: 35mm auf allen Seiten
- **Seitenumbrüche**: Automatisch zwischen Protokollseiten
- **Typografie**: Optimierte Schriftgrößen für Druck
- **Farben**: Print-sichere Farbpalette

## 🔧 Anpassungen

### CSS Customization
Anpassungen können in `src/css/input.css` vorgenommen werden:

```css
@layer components {
  .custom-component {
    @apply bg-blue-500 text-white p-4 rounded-lg;
  }
}
```

### JavaScript Erweiterungen
Neue Funktionalitäten können in `src/js/app.js` hinzugefügt werden:

```javascript
function customFunction() {
    // Ihre custom Logik hier
}
```

### Tailwind Konfiguration
Erweitern Sie `tailwind.config.js` für weitere Anpassungen:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom': '#your-color'
      }
    }
  }
}
```

## 📱 Browser-Kompatibilität

- Chrome/Chromium (empfohlen)
- Firefox
- Safari
- Edge

## 🐛 Fehlerbehebung

### CSS wird nicht geladen
1. Stellen Sie sicher, dass `npm run build-css` ausgeführt wurde
2. Prüfen Sie, ob `dist/css/output.css` existiert
3. Bei Problemen: Fallback auf Tailwind CDN ist eingebaut

### Chart.js Fehler
1. Überprüfen Sie die Browser-Konsole
2. Stellen Sie sicher, dass Chart.js korrekt geladen wurde
3. Testen Sie mit verschiedenen Browsern

### Druckprobleme
1. Verwenden Sie Chrome für besten Drucksupport
2. Stellen Sie Druckeinstellungen auf "Mehr Optionen" → "Hintergrundgrafiken"
3. Wählen Sie A4 Querformat im Druckdialog

## 🤝 Mitwirken

1. Fork des Repositories erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz - siehe LICENSE Datei für Details.

## 📞 Support

Bei Fragen oder Problemen:
- Erstellen Sie ein Issue im Repository
- Überprüfen Sie die Browser-Konsole auf Fehlermeldungen
- Testen Sie mit der neuesten Browser-Version

## 🔄 Updates

Das Projekt wird regelmäßig aktualisiert. Um Updates zu erhalten:

```bash
git pull origin main
npm install
npm run build-css
```

---

**Entwickelt für professionelle Blower Door Messungen nach ISO 9972:2018**