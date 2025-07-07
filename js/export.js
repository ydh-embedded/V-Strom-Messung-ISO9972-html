/**
 * export.js - Vereinfachtes Export-System für Blower Door Messdaten
 * Ersetzt die komplexe transfer.js mit einer sauberen Export-Lösung
 */

console.log("🚀 Export-System wird geladen...");

// =============================================================================
// HAUPTKLASSE: DATA EXPORT SYSTEM
// =============================================================================
class BlowerDoorExporter {
    constructor() {
        this.pageType = this.detectPageType();
        this.initialize();
    }

    detectPageType() {
        const url = window.location.href.toLowerCase();
        if (url.includes('protocol.html')) return 'protocol';
        return 'index';
    }

    initialize() {
        console.log("📍 Seitentyp:", this.pageType);
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        if (this.pageType === 'index') {
            this.setupExportFunctions();
            this.createDebugButton();
        } else if (this.pageType === 'protocol') {
            this.setupProtocolReceiver();
        }
    }

    setupExportFunctions() {
        console.log("🔧 Export-Funktionen werden eingerichtet...");
        
        // Globale Export-Funktionen registrieren
        window.exportData = () => this.exportData();
        window.exportToProtocol = () => this.exportToProtocol();
        window.exportToJson = () => this.exportToJson();
        window.exportToPdf = () => this.exportToPdf();
        
        // Rückwärtskompatibilität
        window.transferWeatherToProtocol = () => this.exportToProtocol();
        window.transferAllData = () => this.exportToProtocol();
        window.printProtocol = () => this.exportData();
        
        console.log("✅ Export-Funktionen registriert");
    }

    setupProtocolReceiver() {
        console.log("📥 Protocol-Empfänger wird eingerichtet...");
        this.loadTransferredData();
        this.createProtocolDebugButton();
    }
    
    createProtocolDebugButton() {
        const debugBtn = document.createElement('button');
        debugBtn.innerHTML = '🔍 PROTOCOL DEBUG';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        debugBtn.onmouseover = () => {
            debugBtn.style.transform = 'scale(1.05)';
        };
        
        debugBtn.onmouseout = () => {
            debugBtn.style.transform = 'scale(1)';
        };
        
        debugBtn.onclick = () => {
            console.log("🔍 === PROTOCOL DEBUG ===");
            
            const inputs = document.querySelectorAll('input, select, textarea');
            const dataTransferElements = document.querySelectorAll('[data-transfer]');
            
            console.log(`📝 Eingabefelder gefunden: ${inputs.length}`);
            console.log(`🔗 data-transfer Elemente: ${dataTransferElements.length}`);
            
            // Suche nach dem funktionierenden simple-transfer-btn
            const simpleTransferBtn = document.getElementById('simple-transfer-btn');
            if (simpleTransferBtn) {
                console.log("✅ simple-transfer-btn gefunden!");
                console.log("🔍 simple-transfer-btn onclick:", simpleTransferBtn.onclick);
                console.log("🔍 simple-transfer-btn getAttribute('onclick'):", simpleTransferBtn.getAttribute('onclick'));
            } else {
                console.log("❌ simple-transfer-btn nicht gefunden");
            }
            
            // Suche nach anderen Transfer-Funktionen
            const transferFunctions = [];
            for (const prop in window) {
                if (prop.toLowerCase().includes('transfer') && typeof window[prop] === 'function') {
                    transferFunctions.push(prop);
                }
            }
            console.log("🔍 Verfügbare Transfer-Funktionen:", transferFunctions);
            
            inputs.forEach((input, index) => {
                console.log(`Feld ${index}:`, {
                    id: input.id,
                    placeholder: input.placeholder,
                    name: input.name,
                    className: input.className,
                    value: input.value,
                    dataTransfer: input.getAttribute('data-transfer')
                });
            });
            
            dataTransferElements.forEach((element, index) => {
                console.log(`data-transfer ${index}:`, {
                    element: element.tagName,
                    transfer: element.getAttribute('data-transfer'),
                    content: element.textContent || element.value
                });
            });
            
            // Prüfe alle Storage-Typen
            const storageKeys = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                storageKeys.push(sessionStorage.key(i));
            }
            console.log("📦 SessionStorage Keys:", storageKeys);
            
            const localKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                localKeys.push(localStorage.key(i));
            }
            console.log("📦 LocalStorage Keys:", localKeys);
            
            // Simuliere das funktionierende System
            const testData = {
                weather: {
                    'outside-temp': '18.5',
                    'inside-temp': '22.1',
                    'wind-speed': '4.2',
                    'humidity': '68'
                },
                building: {
                    'volume': '420',
                    'n50': '1.8',
                    'pressure': '80'
                },
                analysis: {
                    calculated: {
                        'n50': '1.8',
                        'q50': '4.82',
                        'v50': '756'
                    }
                }
            };
            
            console.log("🧪 Teste Daten-Eintrag mit funktionierendem System...");
            
            // Versuche die Methode des funktionierenden Systems nachzuahmen
            if (window.completeTransferSystem && window.completeTransferSystem.fillProtocolFields) {
                console.log("🔄 Versuche completeTransferSystem.fillProtocolFields...");
                window.completeTransferSystem.fillProtocolFields(testData);
            } else if (window.transferSystem && window.transferSystem.fillProtocolFields) {
                console.log("🔄 Versuche transferSystem.fillProtocolFields...");
                window.transferSystem.fillProtocolFields(testData);
            } else {
                console.log("🔄 Versuche eigene kompatible Methode...");
                blowerDoorExporter.fillProtocolDataCompatible(testData);
            }
            
            alert(`🔍 Protocol Debug ausgeführt!\n\n📝 Eingabefelder: ${inputs.length}\n🔗 data-transfer: ${dataTransferElements.length}\n🔍 Transfer-Funktionen: ${transferFunctions.length}\n\nDetails in der Browser-Konsole!\n\n🧪 Testdaten werden mit funktionierendem System eingefügt...`);
        };
        
        document.body.appendChild(debugBtn);
        // Zusätzlich: CSS-Regel für alle übertragenen Felder
        const transferredFieldsStyle = document.createElement('style');
        transferredFieldsStyle.textContent = `
            /* Höchste Priorität für übertragene Felder */
            .transferred-field,
            input.transferred-field,
            select.transferred-field,
            textarea.transferred-field,
            div.transferred-field,
            span.transferred-field,
            td.transferred-field {
                background-color: transparent !important;
                background: transparent !important;
                border: transparent !important;
                border-color: transparent !important;
                color: #065f46 !important;
                font-weight: bold !important;
                box-shadow: none !important;
            }
            
            /* Focus-Styles für Accessibility */
            .transferred-field:focus,
            input.transferred-field:focus,
            select.transferred-field:focus,
            textarea.transferred-field:focus {
                outline: 2px solid #065f46 !important;
                outline-offset: 2px !important;
                background-color: transparent !important;
                background: transparent !important;
                border: transparent !important;
                border-color: transparent !important;
            }
            
            /* Hover-Effekt für bessere Usability */
            .transferred-field:hover,
            input.transferred-field:hover,
            select.transferred-field:hover,
            textarea.transferred-field:hover {
                background-color: rgba(6, 95, 70, 0.05) !important;
                background: rgba(6, 95, 70, 0.05) !important;
                border: transparent !important;
                border-color: transparent !important;
            }
            
            /* Spezifische Überschreibung für Protocol-Styles */
            .protocol-field.transferred-field,
            .data-field.transferred-field,
            .info-field.transferred-field,
            .weather-field.transferred-field,
            .building-field.transferred-field {
                background-color: transparent !important;
                background: transparent !important;
                border: transparent !important;
                border-color: transparent !important;
                color: #065f46 !important;
                font-weight: bold !important;
                box-shadow: none !important;
            }
            
            /* Überschreibung für alle möglichen Input-Styles */
            input[type="text"].transferred-field,
            input[type="number"].transferred-field,
            input[type="email"].transferred-field,
            input[type="tel"].transferred-field,
            input[type="password"].transferred-field,
            input[type="search"].transferred-field,
            input[type="url"].transferred-field {
                background-color: transparent !important;
                background: transparent !important;
                border: transparent !important;
                border-color: transparent !important;
                color: #065f46 !important;
                font-weight: bold !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(transferredFieldsStyle);
        
        console.log("✅ Verstärkte transparente Styles für übertragene Felder hinzugefügt");
    }

    // =============================================================================
    // DATEN SAMMELN
    // =============================================================================
    
    collectAllData() {
        console.log("📊 Sammle alle Daten...");
        
        const data = {
            // Grunddaten
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('de-DE'),
            time: new Date().toLocaleTimeString('de-DE'),
            
            // Wetterdaten
            weather: this.collectWeatherData(),
            
            // Gebäudedaten
            building: this.collectBuildingData(),
            
            // Messdaten
            measurements: this.collectMeasurementData(),
            
            // Analysedaten
            analysis: this.collectAnalysisData(),
            
            // Metadaten
            metadata: {
                version: '1.0',
                source: 'Blower Door ISO 9972',
                exportType: 'complete'
            }
        };
        
        console.log("📊 Daten gesammelt:", data);
        return data;
    }

    collectWeatherData() {
        const weather = {};
        
        const weatherFields = [
            'outside-temp',
            'inside-temp',
            'wind-speed',
            'wind-direction',
            'air-pressure',
            'humidity'
        ];
        
        console.log("🌤️ Sammle Wetterdaten...");
        
        weatherFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                const value = element.value?.trim();
                if (value) {
                    weather[fieldId] = value;
                    console.log(`✅ ${fieldId}: ${value}`);
                } else {
                    console.log(`⚠️ ${fieldId}: leer`);
                }
            } else {
                console.log(`❌ ${fieldId}: Element nicht gefunden`);
            }
        });
        
        console.log("🌤️ Wetterdaten gesammelt:", weather);
        return weather;
    }

    collectBuildingData() {
        const building = {};
        
        const buildingFields = [
            'volume',
            'n50',
            'pressure'
        ];
        
        console.log("🏗️ Sammle Gebäudedaten...");
        
        buildingFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                const value = element.value?.trim();
                if (value) {
                    building[fieldId] = value;
                    console.log(`✅ ${fieldId}: ${value}`);
                } else {
                    console.log(`⚠️ ${fieldId}: leer`);
                }
            } else {
                console.log(`❌ ${fieldId}: Element nicht gefunden`);
            }
        });
        
        console.log("🏗️ Gebäudedaten gesammelt:", building);
        return building;
    }

    collectMeasurementData() {
        const measurements = {
            underpressure: this.collectTableData('#underpressureTable'),
            overpressure: this.collectTableData('#overpressureTable'),
            combined: this.collectTableData('#measurementTable')
        };
        
        const totalMeasurements = measurements.underpressure.length + 
                                  measurements.overpressure.length + 
                                  measurements.combined.length;
        
        console.log(`📊 ${totalMeasurements} Messwerte gesammelt`);
        return measurements;
    }

    collectTableData(tableSelector) {
        const table = document.querySelector(tableSelector);
        if (!table) return [];
        
        const rows = table.querySelectorAll('tbody tr');
        const data = [];
        
        rows.forEach((row, index) => {
            const inputs = row.querySelectorAll('input[type="number"]');
            if (inputs.length >= 2) {
                const pressure = inputs[0].value;
                const volume = inputs[1].value;
                
                if (pressure && volume && !isNaN(pressure) && !isNaN(volume)) {
                    data.push({
                        index: index + 1,
                        pressure: parseFloat(pressure),
                        volume: parseFloat(volume)
                    });
                }
            }
        });
        
        return data;
    }

    collectAnalysisData() {
        const analysis = {
            calculated: {
                n50: this.getElementValue('#calc-n50'),
                q50: this.getElementValue('#calc-q50'),
                v50: this.getElementValue('#calc-v50')
            },
            chartOptions: {
                showTheoretical: document.getElementById('showTheoretical')?.checked || false,
                showSimulated: document.getElementById('showSimulated')?.checked || false,
                showReal: document.getElementById('showReal')?.checked || false,
                showUnderpressure: document.getElementById('showUnderpressure')?.checked || false,
                showOverpressure: document.getElementById('showOverpressure')?.checked || false
            }
        };
        
        return analysis;
    }

    getElementValue(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent || element.value || '' : '';
    }

    // =============================================================================
    // EXPORT-FUNKTIONEN
    // =============================================================================
    
    exportData() {
        console.log("📤 Starte Export...");
        
        const data = this.collectAllData();
        
        if (!this.hasValidData(data)) {
            this.showNotification('❌ Keine Daten zum Exportieren gefunden!', 'error');
            return;
        }
        
        this.showExportDialog(data);
    }

    hasValidData(data) {
        const hasWeather = Object.keys(data.weather).length > 0;
        const hasBuilding = Object.keys(data.building).length > 0;
        const hasMeasurements = data.measurements.underpressure.length > 0 || 
                               data.measurements.overpressure.length > 0 || 
                               data.measurements.combined.length > 0;
        
        return hasWeather || hasBuilding || hasMeasurements;
    }

    showExportDialog(data) {
        const dialog = document.createElement('div');
        dialog.id = 'export-dialog';
        dialog.className = 'export-dialog';
        
        const totalMeasurements = data.measurements.underpressure.length + 
                                  data.measurements.overpressure.length + 
                                  data.measurements.combined.length;
        
        dialog.innerHTML = `
            <div class="export-dialog-overlay" onclick="this.parentElement.remove()"></div>
            <div class="export-dialog-content">
                <div class="export-dialog-header">
                    <h3>📤 Daten Export</h3>
                    <button onclick="this.closest('.export-dialog').remove()" class="close-btn">✕</button>
                </div>
                
                <div class="export-dialog-body">
                    <div class="export-summary">
                        <h4>📊 Verfügbare Daten:</h4>
                        <div class="data-summary">
                            <div class="data-item">
                                <span class="icon">🌤️</span>
                                <span class="label">Wetterdaten:</span>
                                <span class="value">${Object.keys(data.weather).length} Felder</span>
                            </div>
                            <div class="data-item">
                                <span class="icon">🏗️</span>
                                <span class="label">Gebäudedaten:</span>
                                <span class="value">${Object.keys(data.building).length} Parameter</span>
                            </div>
                            <div class="data-item">
                                <span class="icon">📊</span>
                                <span class="label">Messdaten:</span>
                                <span class="value">${totalMeasurements} Messpunkte</span>
                            </div>
                            <div class="data-item">
                                <span class="icon">📈</span>
                                <span class="label">Analysedaten:</span>
                                <span class="value">${Object.keys(data.analysis.calculated).length} Kennwerte</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="export-options">
                        <h4>🎯 Export-Optionen:</h4>
                        <div class="export-buttons">
                            <button onclick="blowerDoorExporter.exportToProtocol(); this.closest('.export-dialog').remove();" 
                                    class="export-btn protocol-btn">
                                <span class="icon">📋</span>
                                <span class="text">
                                    <strong>Protokoll öffnen</strong>
                                    <small>Öffnet protocol.html mit allen Daten</small>
                                </span>
                            </button>                       
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Animation
        setTimeout(() => {
            dialog.classList.add('active');
        }, 10);
    }

    exportToProtocol() {
        console.log("📋 Exportiere zu Protocol (wie simple-transfer-btn)...");
        
        const data = this.collectAllData();
        
        // Verwende die gleiche Methode wie der funktionierende simple-transfer-btn
        // Speichere mit dem gleichen Schlüssel wie das funktionierende System
        const transferKeys = [
            'blowerDoorExport',
            'blowerDoorTransfer', 
            'blowerDoorData',
            'protocolData',
            'transferData'
        ];
        
        // Speichere unter mehreren Schlüsseln um sicherzustellen, dass es gefunden wird
        const jsonData = JSON.stringify(data);
        transferKeys.forEach(key => {
            sessionStorage.setItem(key, jsonData);
            localStorage.setItem(key, jsonData);
        });
        
        console.log("💾 Daten gespeichert unter Schlüsseln:", transferKeys);
        console.log("📊 Gespeicherte Daten:", data);
        
        // Zusätzlich: URL-Parameter wie beim funktionierenden System
        const encodedData = encodeURIComponent(jsonData);
        const protocolUrl = this.getProtocolUrl();
        
        // Wenn URL nicht zu lang, verwende auch URL-Parameter
        if (encodedData.length < 2000) {
            const finalUrl = `${protocolUrl}?data=${encodedData}&transfer=true&source=export`;
            console.log("🔗 Öffne mit URL-Parameter:", finalUrl);
            window.location.href = finalUrl;
        } else {
            console.log("🔗 Öffne ohne URL-Parameter (zu lang):", protocolUrl);
            window.location.href = protocolUrl;
        }
        
        this.showNotification('📋 Daten werden übertragen...', 'info');
    }

    exportToJson() {
        console.log("💾 Exportiere zu JSON...");
        
        const data = this.collectAllData();
        
        // Erstelle JSON-Datei
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blower-door-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('💾 JSON-Datei wurde heruntergeladen!', 'success');
    }

    exportToPdf() {
        console.log("📄 Exportiere zu PDF...");
        
        const data = this.collectAllData();
        
        // Erstelle PDF-Inhalt
        const pdfContent = this.generatePdfContent(data);
        
        // Öffne PDF in neuem Tab
        const pdfWindow = window.open('', '_blank');
        pdfWindow.document.write(pdfContent);
        pdfWindow.document.close();
        
        // Drucken-Dialog öffnen
        setTimeout(() => {
            pdfWindow.print();
        }, 1000);
        
        this.showNotification('📄 PDF wird generiert...', 'info');
    }

    generatePdfContent(data) {
        const totalMeasurements = data.measurements.underpressure.length + 
                                  data.measurements.overpressure.length + 
                                  data.measurements.combined.length;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Blower Door Messprotokoll</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .section { margin-bottom: 30px; }
                    .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                    .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                    .data-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                    .data-item strong { color: #555; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏠 Blower Door Messprotokoll</h1>
                    <p>nach ISO 9972:2018-12</p>
                    <p>Erstellt am: ${data.date} um ${data.time}</p>
                </div>
                
                <div class="section">
                    <h2>🌤️ Wetterdaten</h2>
                    <div class="data-grid">
                        ${Object.entries(data.weather).map(([key, value]) => `
                            <div class="data-item">
                                <strong>${this.getFieldLabel(key)}:</strong> ${value}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="section">
                    <h2>🏗️ Gebäudedaten</h2>
                    <div class="data-grid">
                        ${Object.entries(data.building).map(([key, value]) => `
                            <div class="data-item">
                                <strong>${this.getFieldLabel(key)}:</strong> ${value}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="section">
                    <h2>📊 Messdaten (${totalMeasurements} Messpunkte)</h2>
                    
                    ${data.measurements.underpressure.length > 0 ? `
                        <h3>Unterdruckmessungen</h3>
                        <table>
                            <thead>
                                <tr><th>Nr.</th><th>Druck [Pa]</th><th>Volumenstrom [m³/h]</th></tr>
                            </thead>
                            <tbody>
                                ${data.measurements.underpressure.map(row => `
                                    <tr><td>${row.index}</td><td>${row.pressure}</td><td>${row.volume}</td></tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : ''}
                    
                    ${data.measurements.overpressure.length > 0 ? `
                        <h3>Überdruckmessungen</h3>
                        <table>
                            <thead>
                                <tr><th>Nr.</th><th>Druck [Pa]</th><th>Volumenstrom [m³/h]</th></tr>
                            </thead>
                            <tbody>
                                ${data.measurements.overpressure.map(row => `
                                    <tr><td>${row.index}</td><td>${row.pressure}</td><td>${row.volume}</td></tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : ''}
                </div>
                
                <div class="section">
                    <h2>📈 Analyseergebnisse</h2>
                    <div class="data-grid">
                        ${Object.entries(data.analysis.calculated).map(([key, value]) => `
                            <div class="data-item">
                                <strong>${this.getFieldLabel(key)}:</strong> ${value}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="footer">
                    <p>Generiert mit Blower Door Export-System v${data.metadata.version}</p>
                    <p>ISO 9972:2018-12 - Wärmetechnisches Verhalten von Gebäuden</p>
                </div>
            </body>
            </html>
        `;
    }

    getFieldLabel(key) {
        const labels = {
            'outside-temp': 'Außentemperatur [°C]',
            'inside-temp': 'Innentemperatur [°C]',
            'wind-speed': 'Windgeschwindigkeit [m/s]',
            'wind-direction': 'Windrichtung',
            'air-pressure': 'Luftdruck [hPa]',
            'humidity': 'Luftfeuchtigkeit [%]',
            'volume': 'Gebäudevolumen [m³]',
            'n50': 'n₅₀-Wert [1/h]',
            'pressure': 'Max. Druck [Pa]',
            'q50': 'q₅₀-Wert [m³/(h·m²)]',
            'v50': 'V₅₀ [m³/h]'
        };
        
        return labels[key] || key;
    }

    getProtocolUrl() {
        const currentPath = window.location.pathname;
        console.log("🔍 Aktueller Pfad:", currentPath);
        
        if (currentPath.includes('/sites/')) {
            return './protocol.html';
        } else {
            return './sites/protocol.html';
        }
    }

    // =============================================================================
    // PROTOCOL-SEITE: DATEN EMPFANGEN
    // =============================================================================
    
    loadTransferredData() {
        console.log("📥 Lade exportierte Daten auf Protocol-Seite...");
        
        // Delay um sicherzustellen, dass die Seite vollständig geladen ist
        setTimeout(() => {
            let data = null;
            let source = '';
            
            // Prüfe alle möglichen Schlüssel (wie das funktionierende System)
            const transferKeys = [
                'blowerDoorExport',
                'blowerDoorTransfer',
                'blowerDoorData', 
                'protocolData',
                'transferData'
            ];
            
            // 1. Prüfe SessionStorage
            for (const key of transferKeys) {
                const sessionData = sessionStorage.getItem(key);
                if (sessionData) {
                    try {
                        data = JSON.parse(sessionData);
                        source = `SessionStorage[${key}]`;
                        sessionStorage.removeItem(key); // Cleanup
                        break;
                    } catch (error) {
                        console.error(`❌ Fehler beim Parsen von ${key}:`, error);
                    }
                }
            }
            
            // 2. Prüfe LocalStorage als Fallback
            if (!data) {
                for (const key of transferKeys) {
                    const localData = localStorage.getItem(key);
                    if (localData) {
                        try {
                            data = JSON.parse(localData);
                            source = `LocalStorage[${key}]`;
                            localStorage.removeItem(key); // Cleanup
                            break;
                        } catch (error) {
                            console.error(`❌ Fehler beim Parsen von ${key}:`, error);
                        }
                    }
                }
            }
            
            // 3. Prüfe URL-Parameter
            if (!data) {
                const urlParams = new URLSearchParams(window.location.search);
                const urlData = urlParams.get('data');
                
                if (urlData) {
                    try {
                        data = JSON.parse(decodeURIComponent(urlData));
                        source = 'URL-Parameter';
                    } catch (error) {
                        console.error("❌ Fehler beim Parsen der URL-Daten:", error);
                    }
                }
            }
            
            if (data) {
                console.log(`✅ Daten erfolgreich geladen aus: ${source}`);
                console.log("📊 Empfangene Daten:", data);
                console.log("🔍 Verfügbare Eingabefelder:", document.querySelectorAll('input').length);
                
                // Verwende die gleiche Füll-Methode wie das funktionierende System
                this.fillProtocolDataCompatible(data);
                this.showNotification(`✅ Daten erfolgreich aus ${source} importiert!`, 'success');
                
            } else {
                console.log("ℹ️ Keine exportierten Daten gefunden");
                this.showNotification('ℹ️ Keine Übertragungsdaten gefunden', 'info');
            }
        }, 1000); // 1 Sekunde Delay
    }

    // Hilfsfunktion zum Setzen der transparenten Styles
    applyTransferredStyles(element) {
        if (!element) return;
        
        // Entferne alle bestehenden CSS-Eigenschaften
        element.style.removeProperty('background-color');
        element.style.removeProperty('background');
        element.style.removeProperty('border');
        element.style.removeProperty('border-color');
        element.style.removeProperty('box-shadow');
        
        // Setze neue Styles mit höchster Priorität
        element.style.setProperty('background-color', 'transparent', 'important');
        element.style.setProperty('background', 'transparent', 'important');
        element.style.setProperty('border', 'transparent', 'important');
        element.style.setProperty('border-color', 'transparent', 'important');
        element.style.setProperty('color', '#065f46', 'important');
        element.style.setProperty('font-weight', 'bold', 'important');
        element.style.setProperty('box-shadow', 'none', 'important');
        
        element.classList.add('transferred-field');
    }
    
    fillProtocolDataCompatible(data) {
        console.log("✏️ Fülle Protocol-Daten (kompatibel zu simple-transfer-btn)...");
        console.log("📊 Empfangene Daten:", data);
        
        let fieldsUpdated = 0;
        
        // Warte kurz, damit alle Elemente geladen sind
        setTimeout(() => {
            // Einfache direkte Zuordnung wie im funktionierenden System
            const directMappings = {
                // Wetterdaten - direkte ID-Zuordnung
                'outside-temp': data.weather['outside-temp'],
                'inside-temp': data.weather['inside-temp'],
                'wind-speed': data.weather['wind-speed'],
                'wind-direction': data.weather['wind-direction'],
                'air-pressure': data.weather['air-pressure'],
                'humidity': data.weather['humidity'],
                
                // Gebäudedaten - direkte ID-Zuordnung
                'volume': data.building['volume'],
                'n50': data.building['n50'],
                'pressure': data.building['pressure'],
                
                // Analysedaten - direkte ID-Zuordnung
                'calc-n50': data.analysis.calculated['n50'],
                'calc-q50': data.analysis.calculated['q50'],
                'calc-v50': data.analysis.calculated['v50']
            };
            
            console.log("🔍 Direkte Zuordnungen:", directMappings);
            
            // Fülle alle Felder mit direkter ID-Zuordnung
            Object.entries(directMappings).forEach(([fieldId, value]) => {
                if (value) {
                    const element = document.getElementById(fieldId);
                    if (element) {
                        element.value = value;
                        this.applyTransferredStyles(element);
                        fieldsUpdated++;
                        console.log(`✅ Direktes Mapping: ${fieldId} = ${value}`);
                    } else {
                        console.log(`❌ Element nicht gefunden: ${fieldId}`);
                    }
                }
            });
            
            // Zusätzlich: Alle Inputs mit passenden Platzhaltern
            const inputs = document.querySelectorAll('input[placeholder]');
            console.log(`🔍 Eingabefelder mit Platzhaltern: ${inputs.length}`);
            
            inputs.forEach(input => {
                const placeholder = input.placeholder.toLowerCase();
                
                // Suche nach passenden Werten
                const allData = {...data.weather, ...data.building, ...data.analysis.calculated};
                
                for (const [key, value] of Object.entries(allData)) {
                    if (value && (placeholder === key || placeholder.includes(key) || key.includes(placeholder))) {
                        input.value = value;
                        this.applyTransferredStyles(input);
                        fieldsUpdated++;
                        console.log(`✅ Platzhalter-Mapping: ${input.placeholder} = ${value}`);
                        break;
                    }
                }
            });
            
            // data-transfer Attribute (wie im funktionierenden System)
            const dataTransferElements = document.querySelectorAll('[data-transfer]');
            console.log(`🔍 data-transfer Elemente: ${dataTransferElements.length}`);
            
            dataTransferElements.forEach(element => {
                const transferKey = element.getAttribute('data-transfer');
                const allData = {...data.weather, ...data.building, ...data.analysis.calculated};
                
                if (allData[transferKey]) {
                    const value = allData[transferKey];
                    
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                        element.value = value;
                    } else {
                        element.textContent = value;
                    }
                    
                    this.applyTransferredStyles(element);
                    fieldsUpdated++;
                    console.log(`✅ data-transfer: ${transferKey} = ${value}`);
                }
            });
            
            // Fülle Tabellen
            if (data.measurements) {
                this.fillProtocolTables(data.measurements);
            }
            
            // Result-Cards aktualisieren
            this.updateResultCards(data.analysis.calculated);
            
            console.log(`📊 Insgesamt ${fieldsUpdated} Felder aktualisiert (kompatibel)`);
            
            // Zeige Zusammenfassung
            this.showFillSummary(data, fieldsUpdated);
            
            // Wenn keine Felder gefüllt wurden, zeige alle verfügbaren Felder
            if (fieldsUpdated === 0) {
                this.showAvailableFields(data);
            }
        }, 500);
    }
    
    showAvailableFields(data) {
        console.log("🔍 === VERFÜGBARE FELDER DEBUG ===");
        
        const allInputs = document.querySelectorAll('input, select, textarea');
        const allDataTransfer = document.querySelectorAll('[data-transfer]');
        
        console.log("📝 Alle Eingabefelder:");
        allInputs.forEach((input, index) => {
            console.log(`${index}: ID="${input.id}", placeholder="${input.placeholder}", name="${input.name}"`);
        });
        
        console.log("🔗 Alle data-transfer Elemente:");
        allDataTransfer.forEach((element, index) => {
            console.log(`${index}: transfer="${element.getAttribute('data-transfer')}", tag="${element.tagName}"`);
        });
        
        console.log("📊 Verfügbare Daten:");
        console.log("🌤️ Wetter:", Object.keys(data.weather));
        console.log("🏗️ Gebäude:", Object.keys(data.building));
        console.log("📈 Analyse:", Object.keys(data.analysis.calculated));
        
        // Zeige Browser-Alert mit wichtigsten Infos
        const fieldCount = allInputs.length + allDataTransfer.length;
        const dataCount = Object.keys({...data.weather, ...data.building, ...data.analysis.calculated}).length;
        
        alert(`🔍 DEBUG: Keine Felder gefüllt!\n\n📝 Verfügbare Felder: ${fieldCount}\n📊 Verfügbare Daten: ${dataCount}\n\nDetails in der Browser-Konsole (F12)`);
    }

    fillProtocolTables(measurements) {
        console.log("📊 Fülle Protocol-Tabellen...");
        
        const tables = document.querySelectorAll('.data-table');
        
        if (tables.length >= 2) {
            // Unterdrucktabelle
            if (measurements.underpressure.length > 0) {
                this.fillTable(tables[0], measurements.underpressure, 'Unterdruck');
            }
            
            // Überdrucktabelle
            if (measurements.overpressure.length > 0) {
                this.fillTable(tables[1], measurements.overpressure, 'Überdruck');
            }
        }
    }

    fillTable(table, data, type) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color: #065f46; font-weight: bold;" class="transferred-field">${index + 1}</td>
                <td style="color: #065f46; font-weight: bold;" class="transferred-field">${row.pressure}</td>
                <td style="color: #065f46; font-weight: bold;" class="transferred-field">${row.volume}</td>
                <td style="color: #065f46; font-weight: bold; text-align: center;" class="transferred-field">
                    📥 ${type}
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Tabelle dezent hervorheben
        table.style.backgroundColor = 'transparent';
        table.style.border = 'transparent';
        
        setTimeout(() => {
            table.style.backgroundColor = '';
            table.style.border = '';
        }, 3000);
    }

    updateResultCards(calculatedValues) {
        const resultCards = document.querySelectorAll('.result-card .value');
        
        if (resultCards.length >= 3) {
            if (calculatedValues.n50) {
                resultCards[0].textContent = calculatedValues.n50;
                this.applyTransferredStyles(resultCards[0]);
            }
            
            if (calculatedValues.q50) {
                resultCards[1].textContent = calculatedValues.q50;
                this.applyTransferredStyles(resultCards[1]);
            }
            
            if (calculatedValues.v50) {
                resultCards[2].textContent = calculatedValues.v50;
                this.applyTransferredStyles(resultCards[2]);
            }
        }
    }

    // =============================================================================
    // DEBUG & HILFSFUNKTIONEN
    // =============================================================================
    
    showFillSummary(data, fieldsUpdated) {
        const summary = document.createElement('div');
        summary.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1e40af, #1d4ed8);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
            z-index: 1000;
            max-width: 500px;
            text-align: center;
            font-weight: 600;
        `;
        
        const totalMeasurements = data.measurements.underpressure.length + 
                                  data.measurements.overpressure.length + 
                                  data.measurements.combined.length;
        
        summary.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 15px;">📊 Datenübertragung abgeschlossen</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; font-size: 14px;">
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 6px;">
                    <div style="font-size: 20px; margin-bottom: 5px;">📝</div>
                    <div>Felder gefüllt</div>
                    <div style="font-size: 16px; font-weight: bold;">${fieldsUpdated}</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 6px;">
                    <div style="font-size: 20px; margin-bottom: 5px;">📊</div>
                    <div>Messwerte</div>
                    <div style="font-size: 16px; font-weight: bold;">${totalMeasurements}</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 12px;">
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                    <div>🌤️ Wetter</div>
                    <div style="font-weight: bold;">${Object.keys(data.weather).length}</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                    <div>🏗️ Gebäude</div>
                    <div style="font-weight: bold;">${Object.keys(data.building).length}</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                    <div>📈 Analyse</div>
                    <div style="font-weight: bold;">${Object.keys(data.analysis.calculated).length}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(summary);
        
        setTimeout(() => {
            summary.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => summary.remove(), 500);
        }, 5000);
    }
    
    createDebugButton() {
        if (this.pageType !== 'index') return;
        
        const debugBtn = document.createElement('button');
        debugBtn.innerHTML = '🔍 DEBUG';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        debugBtn.onmouseover = () => {
            debugBtn.style.transform = 'scale(1.05)';
        };
        
        debugBtn.onmouseout = () => {
            debugBtn.style.transform = 'scale(1)';
        };
        
        debugBtn.onclick = () => {
            console.log("🔍 === DEBUG: Datensammlung ===");
            const data = this.collectAllData();
            console.log("📊 Gesammelte Daten:", data);
            
            console.log("🔍 === DEBUG: Verfügbare Felder ===");
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach((input, index) => {
                console.log(`Feld ${index}:`, {
                    id: input.id,
                    placeholder: input.placeholder,
                    name: input.name,
                    value: input.value,
                    dataTransfer: input.getAttribute('data-transfer')
                });
            });
            
            alert(`🔍 DEBUG-Informationen in der Konsole!\n\nGesammelte Daten:\n🌤️ Wetter: ${Object.keys(data.weather).length} Felder\n🏗️ Gebäude: ${Object.keys(data.building).length} Felder\n📊 Messwerte: ${data.measurements.underpressure.length + data.measurements.overpressure.length + data.measurements.combined.length} Punkte`);
        };
        
        document.body.appendChild(debugBtn);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-weight: 600;
            font-size: 14px;
            max-width: 350px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-Remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// =============================================================================
// CSS STYLES
// =============================================================================

const exportStyles = document.createElement('style');
exportStyles.textContent = `
    .export-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .export-dialog.active {
        opacity: 1;
    }
    
    .export-dialog-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }
    
    .export-dialog-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .export-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .export-dialog-header h3 {
        margin: 0;
        font-size: 20px;
        color: #111827;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .close-btn:hover {
        background: #f3f4f6;
        color: #374151;
    }
    
    .export-dialog-body {
        padding: 24px;
    }
    
    .export-summary {
        margin-bottom: 32px;
    }
    
    .export-summary h4 {
        margin: 0 0 16px 0;
        color: #374151;
        font-size: 16px;
    }
    
    .data-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    
    .data-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    }
    
    .data-item .icon {
        font-size: 18px;
    }
    
    .data-item .label {
        color: #6b7280;
        font-size: 14px;
    }
    
    .data-item .value {
        color: #111827;
        font-weight: 600;
        margin-left: auto;
    }
    
    .export-options h4 {
        margin: 0 0 16px 0;
        color: #374151;
        font-size: 16px;
    }
    
    .export-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .export-btn {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
    }
    
    .export-btn:hover {
        border-color: #3b82f6;
        background: #f8fafc;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }
    
    .export-btn .icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .export-btn .text {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .export-btn .text strong {
        color: #111827;
        font-size: 16px;
    }
    
    .export-btn .text small {
        color: #6b7280;
        font-size: 13px;
    }
    
    .protocol-btn:hover {
        border-color: #10b981;
        background: #f0fdf4;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    }
    
    .json-btn:hover {
        border-color: #8b5cf6;
        background: #faf5ff;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
    }
    
    .pdf-btn:hover {
        border-color: #ef4444;
        background: #fef2f2;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    }
    
    @media (max-width: 640px) {
        .export-dialog-content {
            width: 95%;
            margin: 20px;
        }
        
        .data-summary {
            grid-template-columns: 1fr;
        }
        
        .export-dialog-body {
            padding: 20px;
        }
    }
`;

document.head.appendChild(exportStyles);

// =============================================================================
// GLOBALE INITIALISIERUNG
// =============================================================================

// Erstelle globale Instanz
let blowerDoorExporter;

// Initialisiere beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        blowerDoorExporter = new BlowerDoorExporter();
    });
} else {
    blowerDoorExporter = new BlowerDoorExporter();
}

// Globale Funktionen für Rückwärtskompatibilität
window.exportData = function() {
    return blowerDoorExporter?.exportData();
};

window.exportToProtocol = function() {
    return blowerDoorExporter?.exportToProtocol();
};

window.exportToJson = function() {
    return blowerDoorExporter?.exportToJson();
};

window.exportToPdf = function() {
    return blowerDoorExporter?.exportToPdf();
};

// Legacy-Funktionen und Kompatibilität
window.transferWeatherToProtocol = function() {
    console.log("🔄 transferWeatherToProtocol aufgerufen - verwende Export-System");
    return blowerDoorExporter?.exportToProtocol();
};

window.transferAllData = function() {
    console.log("🔄 transferAllData aufgerufen - verwende Export-System");
    return blowerDoorExporter?.exportToProtocol();
};

window.printProtocol = function() {
    console.log("🔄 printProtocol aufgerufen - verwende Export-System");
    return blowerDoorExporter?.exportData();
};

// Versuche das funktionierende System zu finden und zu nutzen
window.useWorkingTransferSystem = function() {
    console.log("🔍 Suche nach funktionierendem Transfer-System...");
    
    // Prüfe auf vorhandene Transfer-Systeme
    const transferSystems = [
        'completeTransferSystem',
        'transferSystem', 
        'blowerDoorTransfer',
        'protocolTransfer'
    ];
    
    for (const systemName of transferSystems) {
        if (window[systemName]) {
            console.log(`✅ Gefunden: ${systemName}`);
            
            // Versuche die Transfer-Methode aufzurufen
            if (window[systemName].transferAllData) {
                console.log(`🔄 Verwende ${systemName}.transferAllData()`);
                return window[systemName].transferAllData();
            } else if (window[systemName].exportToProtocol) {
                console.log(`🔄 Verwende ${systemName}.exportToProtocol()`);
                return window[systemName].exportToProtocol();
            }
        }
    }
    
    console.log("❌ Kein funktionierendes Transfer-System gefunden");
    return false;
};

// Erweiterte Fallback-Funktion
window.smartTransfer = function() {
    console.log("🧠 Smart Transfer - versuche alle verfügbaren Methoden...");
    
    // 1. Versuche das funktionierende System
    if (window.useWorkingTransferSystem()) {
        console.log("✅ Funktionierendes System verwendet");
        return true;
    }
    
    // 2. Versuche das neue Export-System
    if (blowerDoorExporter) {
        console.log("🔄 Verwende neues Export-System");
        blowerDoorExporter.exportToProtocol();
        return true;
    }
    
    // 3. Direkte Datensammlung und Transfer
    console.log("🔄 Direkte Datensammlung als Fallback");
    try {
        const data = {
            weather: {},
            building: {},
            measurements: { underpressure: [], overpressure: [], combined: [] },
            analysis: { calculated: {} }
        };
        
        // Sammle Daten direkt
        ['outside-temp', 'inside-temp', 'wind-speed', 'wind-direction', 'air-pressure', 'humidity'].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) data.weather[id] = el.value;
        });
        
        ['volume', 'n50', 'pressure'].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.value) data.building[id] = el.value;
        });
        
        ['calc-n50', 'calc-q50', 'calc-v50'].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.textContent) data.analysis.calculated[id.replace('calc-', '')] = el.textContent;
        });
        
        // Speichere und übertrage
        sessionStorage.setItem('blowerDoorExport', JSON.stringify(data));
        sessionStorage.setItem('blowerDoorTransfer', JSON.stringify(data));
        window.location.href = './sites/protocol.html';
        
        console.log("✅ Direkter Transfer erfolgreich");
        return true;
        
    } catch (error) {
        console.error("❌ Direkter Transfer fehlgeschlagen:", error);
        return false;
    }
};

// Debug-Funktionen
window.debugExportData = function() {
    if (blowerDoorExporter?.pageType === 'index') {
        console.log("🔍 === DEBUG: Export-Daten ===");
        const data = blowerDoorExporter.collectAllData();
        console.log("📊 Gesammelte Daten:", data);
        return data;
    } else {
        console.log("❌ Debug nur auf Index-Seite verfügbar");
    }
};

window.debugProtocolFields = function() {
    if (blowerDoorExporter?.pageType === 'protocol') {
        console.log("🔍 === DEBUG: Protocol-Felder ===");
        const inputs = document.querySelectorAll('input, select, textarea');
        const dataTransferElements = document.querySelectorAll('[data-transfer]');
        
        console.log(`📝 Eingabefelder: ${inputs.length}`);
        console.log(`🔗 data-transfer Elemente: ${dataTransferElements.length}`);
        
        inputs.forEach((input, index) => {
            console.log(`Feld ${index}:`, {
                id: input.id,
                placeholder: input.placeholder,
                name: input.name,
                value: input.value,
                dataTransfer: input.getAttribute('data-transfer')
            });
        });
        
        return { inputs: inputs.length, dataTransfer: dataTransferElements.length };
    } else {
        console.log("❌ Debug nur auf Protocol-Seite verfügbar");
    }
};

window.testExportTransfer = function() {
    if (blowerDoorExporter?.pageType === 'index') {
        console.log("🧪 === TEST: Export-Transfer ===");
        
        // Testdaten in Felder einfügen
        const testData = {
            'outside-temp': '15.5',
            'inside-temp': '20.2',
            'wind-speed': '3.2',
            'wind-direction': 'SW',
            'air-pressure': '1013.2',
            'humidity': '65',
            'volume': '350',
            'n50': '2.1',
            'pressure': '75'
        };
        
        Object.entries(testData).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
                this.applyTransferredStyles(element);
                console.log(`✅ Testdaten: ${fieldId} = ${value}`);
            } else {
                console.log(`❌ Testdaten: ${fieldId} nicht gefunden`);
            }
        });
        
        // Auch auf der Index-Seite verfügbar machen
        if (blowerDoorExporter?.pageType === 'index') {
            Object.entries(testData).forEach(([fieldId, value]) => {
                const element = document.getElementById(fieldId);
                if (element) {
                    element.value = value;
                    blowerDoorExporter.applyTransferredStyles(element);
                    console.log(`✅ Testdaten: ${fieldId} = ${value}`);
                } else {
                    console.log(`❌ Testdaten: ${fieldId} nicht gefunden`);
                }
            });
        }
        
        console.log("🎯 Testdaten eingefügt. Jetzt Smart Transfer testen!");
        alert("🧪 Testdaten wurden eingefügt!\nJetzt können Sie 'smartTransfer()' testen oder den Export-Button verwenden.");
    } else {
        console.log("❌ Test nur auf Index-Seite verfügbar");
    }
};

console.log("✅ Blower Door Export-System geladen!");
console.log("🎯 Funktionen: exportData(), exportToProtocol(), exportToJson(), exportToPdf()");
console.log("📤 Verwenden Sie den Export-Button in der Navigation!");
