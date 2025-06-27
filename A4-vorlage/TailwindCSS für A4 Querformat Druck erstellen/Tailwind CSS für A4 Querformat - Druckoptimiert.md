# Tailwind CSS für A4 Querformat - Druckoptimiert

Dieses CSS-Framework ist speziell für das Drucken von HTML-Seiten im A4 Querformat (297mm x 210mm) entwickelt worden.

## 📁 Dateien

- `tailwind-a4-landscape.css` - Das Haupt-CSS-Framework
- `beispiel-a4-landscape.html` - Vollständige Beispielseite
- `README.md` - Diese Anleitung

## 🚀 Schnellstart

1. Binden Sie das CSS in Ihre HTML-Seite ein:
```html
<link rel="stylesheet" href="tailwind-a4-landscape.css">
```

2. Verwenden Sie den A4-Container:
```html
<div class="a4-landscape">
    <!-- Ihr Inhalt hier -->
</div>
```

3. Öffnen Sie die Seite im Browser und drucken Sie mit Strg+P

## 📐 Grundlegende Struktur

### A4 Querformat Container
```html
<div class="a4-landscape">
    <header class="print-header">Header-Inhalt</header>
    <main class="print-content">Hauptinhalt</main>
    <footer class="print-footer">Footer-Inhalt</footer>
</div>
```

### Maße und Einstellungen
- **Seitengröße:** 297mm × 210mm (A4 Querformat)
- **Standard-Padding:** 20mm
- **Nutzbare Fläche:** 257mm × 170mm
- **Header/Footer Höhe:** 15mm

## 🎨 CSS-Klassen

### Layout-Klassen

#### Flexbox
- `print-flex` - Display: flex
- `print-flex-col` - Flex-direction: column
- `print-flex-row` - Flex-direction: row
- `print-justify-center` - Justify-content: center
- `print-justify-between` - Justify-content: space-between
- `print-items-center` - Align-items: center

#### Grid
- `print-grid` - Display: grid
- `print-grid-cols-1` bis `print-grid-cols-4` - Grid-Spalten
- Verwenden Sie `style="gap: 5mm;"` für Abstände

### Typografie

#### Schriftgrößen
- `print-text-xs` - 8pt
- `print-text-sm` - 10pt
- `print-text-base` - 12pt (Standard)
- `print-text-lg` - 14pt
- `print-text-xl` - 16pt
- `print-text-2xl` - 18pt
- `print-text-3xl` - 20pt

#### Textfarben
- `print-text-black` - Schwarz
- `print-text-gray-600` - Mittelgrau
- `print-text-gray-800` - Dunkelgrau

### Abstände

#### Margin
- `print-m-0` bis `print-m-4` - Margin von 0 bis 10mm
- Verfügbar auch für einzelne Seiten: `print-mt-2`, `print-mb-3`, etc.

#### Padding
- `print-p-0` bis `print-p-4` - Padding von 0 bis 10mm
- Verfügbar auch für einzelne Seiten: `print-pt-2`, `print-pb-3`, etc.

### Farben und Hintergründe
- `print-bg-white` - Weißer Hintergrund
- `print-bg-gray-100` - Hellgrauer Hintergrund

### Rahmen
- `print-border` - Vollständiger Rahmen
- `print-border-t`, `print-border-b`, `print-border-l`, `print-border-r` - Einzelne Seiten

### Tabellen
```html
<table class="print-table">
    <thead>
        <tr>
            <th>Spalte 1</th>
            <th>Spalte 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Daten 1</td>
            <td>Daten 2</td>
        </tr>
    </tbody>
</table>
```

## 📄 Seitenumbrüche

### Seitenumbruch-Kontrolle
- `page-break` - Erzwingt Seitenumbruch nach Element
- `no-page-break` - Verhindert Seitenumbruch innerhalb des Elements

### Sichtbarkeit
- `print-hidden` - Versteckt beim Drucken
- `print-visible` - Zeigt nur beim Drucken
- `no-print` - Versteckt beim Drucken (für Bildschirm-only Elemente)
- `print-only` - Zeigt nur beim Drucken

## 🖨️ Druckeinstellungen

### Browser-Einstellungen
1. **Papierformat:** A4
2. **Ausrichtung:** Querformat
3. **Ränder:** Minimal oder Keine
4. **Hintergrundgrafiken:** Aktiviert
5. **Maßstab:** 100%

### Empfohlene Browser
- Google Chrome (beste Unterstützung)
- Mozilla Firefox
- Microsoft Edge

### CSS Print Media Query
Das Framework verwendet `@media print` für druckspezifische Styles:
```css
@media print {
    /* Druckspezifische Regeln */
}
```

## 💡 Tipps und Best Practices

### Layout-Tipps
1. **Verwenden Sie mm-Einheiten** für präzise Maße
2. **Testen Sie regelmäßig** mit der Druckvorschau
3. **Vermeiden Sie zu kleine Schriften** (minimum 8pt)
4. **Nutzen Sie Kontraste** für bessere Lesbarkeit

### Inhalt-Tipps
1. **Halten Sie Tabellen einfach** - max. 5-6 Spalten
2. **Verwenden Sie Seitenumbrüche** bei langen Inhalten
3. **Platzieren Sie wichtige Infos** nicht am Seitenrand
4. **Testen Sie verschiedene Inhaltsmengen**

### Performance-Tipps
1. **Minimieren Sie CSS** für Produktion
2. **Optimieren Sie Bilder** für Druck (300 DPI)
3. **Verwenden Sie Web-sichere Schriften**

## 🔧 Anpassungen

### Eigene Farben hinzufügen
```css
.print-text-custom { color: #your-color !important; }
.print-bg-custom { background-color: #your-color !important; }
```

### Eigene Schriftgrößen
```css
.print-text-custom { font-size: 15pt !important; }
```

### Eigene Abstände
```css
.print-m-custom { margin: 12mm !important; }
.print-p-custom { padding: 8mm !important; }
```

## 🐛 Fehlerbehebung

### Häufige Probleme

**Problem:** Inhalt wird abgeschnitten
- **Lösung:** Reduzieren Sie Padding oder Schriftgröße

**Problem:** Seitenumbrüche an falschen Stellen
- **Lösung:** Verwenden Sie `no-page-break` Klasse

**Problem:** Farben werden nicht gedruckt
- **Lösung:** Aktivieren Sie "Hintergrundgrafiken drucken"

**Problem:** Layout sieht anders aus als erwartet
- **Lösung:** Testen Sie in verschiedenen Browsern

### Debug-Tipps
1. Verwenden Sie die Druckvorschau des Browsers
2. Testen Sie mit verschiedenen Zoom-Stufen
3. Überprüfen Sie die Browser-Konsole auf Fehler

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die Beispiel-HTML-Datei
2. Testen Sie mit verschiedenen Browsern
3. Validieren Sie Ihr HTML

## 📄 Lizenz

Dieses CSS-Framework steht unter der MIT-Lizenz zur freien Verfügung.

