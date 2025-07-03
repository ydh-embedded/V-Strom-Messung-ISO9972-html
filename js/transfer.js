/**
 * ERWEITERTE TRANSFER-SYSTEM - KOMPLETT MIT TABELLEN UND DIAGRAMM
 * Überträgt alle Daten zwischen index.html und protocol.html
 */

console.log("🚀 ERWEITERTE TRANSFER-SYSTEM STARTET");

// =============================================================================
// HAUPTKLASSE
// =============================================================================
class CompleteTransferSystem {
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
            this.setupIndexPage();
        } else if (this.pageType === 'protocol') {
            this.setupProtocolPage();
        }
    }

    // =============================================================================
    // INDEX PAGE - DATEN SAMMELN UND ÜBERTRAGEN
    // =============================================================================
    setupIndexPage() {
        console.log("🔧 Index-Seite konfiguriert");
        
        // Erstelle sichtbaren Test-Button
        this.createDebugButton();
        
        // Ersetze bestehende Protocol-Buttons
        this.replaceProtocolButtons();
    }

    createDebugButton() {
        const button = document.createElement('button');
        button.id = 'complete-transfer-btn';
        button.innerHTML = '🚀 VOLLSTÄNDIGER TRANSFER';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        button.onmouseover = () => {
            button.style.background = 'linear-gradient(135deg, #ff6666, #ff0000)';
            button.style.transform = 'scale(1.05)';
        };
        
        button.onmouseout = () => {
            button.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
            button.style.transform = 'scale(1)';
        };
        
        button.onclick = () => this.transferAllData();
        document.body.appendChild(button);
        console.log("✅ Erweiterte Transfer-Button erstellt");
    }

    replaceProtocolButtons() {
        // Finde alle Buttons die zu protocol.html führen
        const buttons = document.querySelectorAll('button[onclick*="protocol.html"]');
        console.log("🔄 Gefundene Protocol-Buttons:", buttons.length);
        
        buttons.forEach(btn => {
            const originalOnclick = btn.getAttribute('onclick');
            btn.onclick = (e) => {
                e.preventDefault();
                this.transferAllData();
            };
            console.log("✅ Button ersetzt:", originalOnclick);
        });
    }

    transferAllData() {
        console.log("🔄 Sammle ALLE Daten (erweitert)...");
        
        try {
            const data = this.collectAllData();
            console.log("📊 Gesammelte Daten (komplett):", data);
            
            if (this.hasAnyData(data)) {
                this.executeTransfer(data);
            } else {
                alert("❌ Keine Daten gefunden!\nBitte füllen Sie mindestens ein Feld aus.");
            }
        } catch (error) {
            console.error("❌ Transfer fehlgeschlagen:", error);
            alert("Fehler beim Übertragen: " + error.message);
        }
    }

    collectAllData() {
        return {
            // Wetterdaten
            weather: this.collectWeatherData(),
            // Gebäudedaten
            building: this.collectBuildingData(),
            // Tabellendaten - ERWEITERT
            measurements: this.collectMeasurementTables(),
            // Diagramm-Daten - NEU
            chart: this.collectChartData(),
            // Metadaten
            timestamp: new Date().toISOString(),
            transferType: 'complete-extended'
        };
    }

    collectWeatherData() {
        const weatherData = {};
        
        // Wetterdaten-IDs aus index.html
        const weatherFields = [
            'outside-temp',
            'inside-temp', 
            'wind-speed',
            'wind-direction',
            'air-pressure',
            'humidity'
        ];
        
        weatherFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                weatherData[fieldId] = element.value || '';
                console.log(`🌤️ ${fieldId}:`, weatherData[fieldId]);
            }
        });
        
        return weatherData;
    }

    collectBuildingData() {
        const buildingData = {};
        
        // Gebäudedaten-IDs aus index.html
        const buildingFields = [
            'volume',
            'n50', 
            'pressure'
        ];
        
        buildingFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                buildingData[fieldId] = element.value || '';
                console.log(`🏗️ ${fieldId}:`, buildingData[fieldId]);
            }
        });
        
        return buildingData;
    }

    // NEUE FUNKTION: Sammle Messdaten-Tabellen
    collectMeasurementTables() {
        console.log("📊 Sammle Tabellendaten...");
        
        const tables = {
            underpressure: this.collectTableData('#underpressureTable', 'Unterdruck'),
            overpressure: this.collectTableData('#overpressureTable', 'Überdruck'),
            combined: this.collectTableData('#measurementTable', 'Kombiniert')
        };
        
        const totalRows = tables.underpressure.length + tables.overpressure.length + tables.combined.length;
        console.log(`📋 Gesamt: ${totalRows} Tabellenzeilen gesammelt`);
        
        return tables;
    }

    // NEUE FUNKTION: Sammle Daten aus spezifischer Tabelle
    collectTableData(tableSelector, tableName) {
        const table = document.querySelector(tableSelector);
        if (!table) {
            console.log(`❌ Tabelle nicht gefunden: ${tableSelector}`);
            return [];
        }
        
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
                        volume: parseFloat(volume),
                        type: tableName
                    });
                    console.log(`📊 ${tableName} Zeile ${index + 1}: ${pressure}Pa → ${volume}m³/h`);
                }
            }
        });
        
        return data;
    }

    // NEUE FUNKTION: Sammle Chart/Diagramm-Daten
    collectChartData() {
        console.log("📈 Sammle Diagramm-Daten...");
        
        const chartData = {
            options: {
                showTheoretical: document.getElementById('showTheoretical')?.checked || false,
                showSimulated: document.getElementById('showSimulated')?.checked || false,
                showReal: document.getElementById('showReal')?.checked || false,
                showUnderpressure: document.getElementById('showUnderpressure')?.checked || false,
                showOverpressure: document.getElementById('showOverpressure')?.checked || false
            },
            calculatedValues: {
                n50: document.getElementById('calc-n50')?.textContent || this.getInputValue('n50') || 'N/A',
                q50: document.getElementById('calc-q50')?.textContent || 'N/A',
                v50: document.getElementById('calc-v50')?.textContent || 'N/A'
            },
            parameters: {
                n50: this.getInputValue('n50'),
                volume: this.getInputValue('volume'),
                pressure: this.getInputValue('pressure')
            }
        };
        
        console.log("📈 Chart-Optionen:", chartData.options);
        console.log("📈 Berechnete Werte:", chartData.calculatedValues);
        console.log("📈 Parameter:", chartData.parameters);
        
        return chartData;
    }

    getInputValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value.trim() : '';
    }

    hasAnyData(data) {
        const hasWeather = Object.values(data.weather).some(val => val !== '');
        const hasBuilding = Object.values(data.building).some(val => val !== '');
        const hasMeasurements = Object.values(data.measurements).some(table => table.length > 0);
        const hasChart = data.chart && (
            Object.values(data.chart.parameters).some(val => val !== '') ||
            Object.values(data.chart.calculatedValues).some(val => val !== '' && val !== 'N/A')
        );
        
        console.log("🔍 Daten-Check:", { 
            hasWeather, 
            hasBuilding, 
            hasMeasurements,
            hasChart,
            measurementCounts: {
                underpressure: data.measurements.underpressure.length,
                overpressure: data.measurements.overpressure.length,
                combined: data.measurements.combined.length
            }
        });
        
        return hasWeather || hasBuilding || hasMeasurements || hasChart;
    }

    executeTransfer(data) {
        try {
            // Korrekte Pfade für protocol.html
            const protocolUrl = this.getProtocolUrl();
            const jsonData = JSON.stringify(data);
            const encodedData = encodeURIComponent(jsonData);
            const finalUrl = `${protocolUrl}?data=${encodedData}`;
            
            console.log("🎯 Ziel-URL:", protocolUrl);
            console.log("📏 JSON-Größe:", jsonData.length, "Zeichen");
            console.log("📏 URL-Länge:", finalUrl.length, "Zeichen");
            
            // Erweiterte Benutzer-Information
            const totalMeasurements = data.measurements.underpressure.length + 
                                      data.measurements.overpressure.length + 
                                      data.measurements.combined.length;
            
            const proceed = confirm(`✅ ERWEITERTE Daten bereit für Transfer!\n\n` +
                `🌤️ Wetter-Felder: ${Object.values(data.weather).filter(v => v !== '').length}/${Object.keys(data.weather).length}\n` +
                `🏗️ Gebäude-Felder: ${Object.values(data.building).filter(v => v !== '').length}/${Object.keys(data.building).length}\n` +
                `📊 Tabellen-Zeilen: ${totalMeasurements} (U:${data.measurements.underpressure.length}, Ü:${data.measurements.overpressure.length}, K:${data.measurements.combined.length})\n` +
                `📈 Chart-Optionen: ${Object.values(data.chart.options).filter(v => v === true).length} aktiviert\n` +
                `🎯 Berechnete Werte: n₅₀=${data.chart.calculatedValues.n50}, q₅₀=${data.chart.calculatedValues.q50}\n\n` +
                `Jetzt zu protocol.html wechseln?`);
            
            if (!proceed) {
                console.log("❌ Transfer vom Benutzer abgebrochen");
                return;
            }
            
            // Verwende SessionStorage für große Daten
            if (finalUrl.length > 2000) {
                console.log("📦 Verwende SessionStorage (URL zu lang)");
                sessionStorage.setItem('blowerDoorTransfer', jsonData);
                window.location.href = protocolUrl;
            } else {
                console.log("🔗 Verwende URL-Parameter");
                window.location.href = finalUrl;
            }
            
        } catch (error) {
            console.error("❌ Transfer-Fehler:", error);
            alert("Fehler beim Übertragen: " + error.message);
        }
    }

    getProtocolUrl() {
        // Korrekte Pfade basierend auf Dateistruktur
        const currentPath = window.location.pathname;
        console.log("🔍 Aktueller Pfad:", currentPath);
        
        if (currentPath.includes('/sites/')) {
            // Wir sind bereits im sites-Ordner
            return './protocol.html';
        } else {
            // Wir sind im Root-Ordner, müssen zu sites/
            return './sites/protocol.html';
        }
    }

    // =============================================================================
    // PROTOCOL PAGE - DATEN EMPFANGEN UND EINFÜGEN
    // =============================================================================
    setupProtocolPage() {
        console.log("📄 Protocol-Seite konfiguriert");
        this.loadTransferredData();
    }

    loadTransferredData() {
        console.log("📥 Lade übertragene Daten...");
        
        let data = null;
        let source = '';
        
        // 1. URL-Parameter prüfen
        const urlParams = new URLSearchParams(window.location.search);
        const urlData = urlParams.get('data');
        
        if (urlData) {
            try {
                data = JSON.parse(decodeURIComponent(urlData));
                source = 'URL';
            } catch (error) {
                console.error("❌ URL-Daten fehlerhaft:", error);
            }
        }
        
        // 2. SessionStorage prüfen
        if (!data) {
            const sessionData = sessionStorage.getItem('blowerDoorTransfer');
            if (sessionData) {
                try {
                    data = JSON.parse(sessionData);
                    source = 'SessionStorage';
                    sessionStorage.removeItem('blowerDoorTransfer');
                } catch (error) {
                    console.error("❌ SessionStorage-Daten fehlerhaft:", error);
                }
            }
        }
        
        if (data) {
            console.log("✅ Daten geladen aus:", source);
            console.log("📊 Empfangene Daten:", data);
            this.fillProtocolFields(data);
            
            // NEUE FUNKTIONEN: Tabellen und Diagramm
            if (data.measurements) {
                this.fillMeasurementTables(data.measurements);
            }
            
            if (data.chart) {
                this.updateChartDisplay(data.chart);
            }
            
            this.showSuccessMessage(`Erweiterte Daten erfolgreich aus ${source} übertragen!`);
        } else {
            console.log("ℹ️ Keine Übertragungsdaten gefunden");
        }
    }

    fillProtocolFields(data) {
        console.log("✏️ Fülle Protocol-Felder aus...");
        
        let fieldsUpdated = 0;
        
        // Alle input-Felder durchgehen
        const inputs = document.querySelectorAll('input');
        console.log(`🔍 ${inputs.length} Eingabefelder gefunden`);
        
        inputs.forEach((input, index) => {
            const placeholder = input.placeholder ? input.placeholder.toLowerCase() : '';
            const dataTransfer = input.getAttribute('data-transfer') || '';
            
            console.log(`🔍 Feld ${index}: placeholder="${placeholder}", data-transfer="${dataTransfer}"`);
            
            // Direkte Zuordnung über Platzhalter und data-transfer
            const fieldMappings = [
                // Wetterdaten - exakte Übereinstimmung
                { 
                    key: 'outside-temp', 
                    value: data.weather['outside-temp'],
                    name: 'Außentemperatur'
                },
                { 
                    key: 'inside-temp', 
                    value: data.weather['inside-temp'],
                    name: 'Innentemperatur'
                },
                { 
                    key: 'wind-speed', 
                    value: data.weather['wind-speed'],
                    name: 'Windgeschwindigkeit'
                },
                { 
                    key: 'wind-direction', 
                    value: data.weather['wind-direction'],
                    name: 'Windrichtung'
                },
                { 
                    key: 'air-pressure', 
                    value: data.weather['air-pressure'],
                    name: 'Luftdruck'
                },
                { 
                    key: 'humidity', 
                    value: data.weather['humidity'],
                    name: 'Luftfeuchtigkeit'
                },
                // Gebäudedaten - exakte Übereinstimmung
                { 
                    key: 'volume', 
                    value: data.building['volume'],
                    name: 'Volumen'
                },
                { 
                    key: 'n50', 
                    value: data.building['n50'],
                    name: 'n50-Wert'
                },
                { 
                    key: 'pressure', 
                    value: data.building['pressure'],
                    name: 'Druck'
                }
            ];
            
            // Prüfe jedes Mapping
            fieldMappings.forEach(mapping => {
                const exactMatch = placeholder === mapping.key || dataTransfer === mapping.key;
                
                if (exactMatch && mapping.value) {
                    input.value = mapping.value;
                    input.style.backgroundColor = '#e6ffe6';
                    input.style.border = '2px solid #10b981';
                    fieldsUpdated++;
                    console.log(`✅ ${mapping.name}: ${mapping.value} (${mapping.key})`);
                }
            });
        });
        
        // Aktualisiere auch Result Cards und Control Values
        this.updateResultElements(data);
        
        console.log(`📊 ${fieldsUpdated} Felder aktualisiert`);
    }

    // NEUE FUNKTION: Fülle Messdaten-Tabellen in protocol.html
    fillMeasurementTables(measurements) {
        console.log("📊 Fülle Messdaten-Tabellen...");
        
        // Unterdruck-Tabelle füllen
        if (measurements.underpressure && measurements.underpressure.length > 0) {
            this.fillProtocolTable('Unterdruckmessungen', measurements.underpressure, 0);
        }
        
        // Überdruck-Tabelle füllen  
        if (measurements.overpressure && measurements.overpressure.length > 0) {
            this.fillProtocolTable('Überdruckmessungen', measurements.overpressure, 1);
        }
        
        // Kombinierte Tabelle füllen
        if (measurements.combined && measurements.combined.length > 0) {
            this.fillProtocolTable('Kombinierte Messungen', measurements.combined, 2);
        }
    }
    
    // NEUE FUNKTION: Fülle spezifische Tabelle in protocol.html
    fillProtocolTable(tableName, data, tableIndex) {
        console.log(`📋 Fülle ${tableName} mit ${data.length} Zeilen...`);
        
        // Finde Tabellen über verschiedene Selektoren
        const tables = document.querySelectorAll('.data-table, table');
        
        if (tables[tableIndex]) {
            const tbody = tables[tableIndex].querySelector('tbody');
            if (tbody) {
                // Leere existierende Daten
                tbody.innerHTML = '';
                
                // Füge neue Daten ein
                data.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${row.pressure}</td>
                        <td>${row.volume}</td>
                        <td style="color: #10b981; font-weight: bold;">📥 ${row.type}</td>
                    `;
                    tbody.appendChild(tr);
                });
                
                // Tabelle hervorheben
                tables[tableIndex].style.backgroundColor = '#f0fdf4';
                tables[tableIndex].style.border = '3px solid #10b981';
                tables[tableIndex].style.borderRadius = '8px';
                
                setTimeout(() => {
                    tables[tableIndex].style.backgroundColor = '';
                    tables[tableIndex].style.border = '';
                }, 3000);
                
                console.log(`✅ ${tableName}: ${data.length} Zeilen eingefügt`);
            }
        } else {
            console.log(`❌ Tabelle ${tableIndex} nicht gefunden für ${tableName}`);
        }
    }
    
    // NEUE FUNKTION: Aktualisiere Diagramm-Anzeige
    updateChartDisplay(chartData) {
        console.log("📈 Aktualisiere Diagramm-Anzeige...");
        
        // Aktualisiere Chart-Platzhalter
        const chartPlaceholder = document.querySelector('.chart-placeholder div');
        if (chartPlaceholder) {
            const options = chartData.options;
            const values = chartData.calculatedValues;
            
            chartPlaceholder.innerHTML = `
                <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; border: 3px solid #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">
                    <div style="font-size: 20px; font-weight: bold; color: #1e40af; margin-bottom: 20px;">
                        📊 Übertragenes Diagramm-Setup
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <strong style="color: #1f2937; font-size: 16px;">🎛️ Aktivierte Kurven:</strong><br><br>
                            ${options.showTheoretical ? '✅ <span style="color: #10b981;">Theoretisch</span>' : '❌ <span style="color: #ef4444;">Theoretisch</span>'}<br>
                            ${options.showReal ? '✅ <span style="color: #10b981;">Real</span>' : '❌ <span style="color: #ef4444;">Real</span>'}<br>
                            ${options.showUnderpressure ? '✅ <span style="color: #10b981;">Unterdruck</span>' : '❌ <span style="color: #ef4444;">Unterdruck</span>'}<br>
                            ${options.showOverpressure ? '✅ <span style="color: #10b981;">Überdruck</span>' : '❌ <span style="color: #ef4444;">Überdruck</span>'}
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <strong style="color: #1f2937; font-size: 16px;">📐 Berechnete Werte:</strong><br><br>
                            n₅₀: <span style="color: #dc2626; font-weight: bold; font-size: 18px;">${values.n50}</span><br>
                            q₅₀: <span style="color: #dc2626; font-weight: bold; font-size: 18px;">${values.q50}</span><br>
                            V₅₀: <span style="color: #dc2626; font-weight: bold; font-size: 18px;">${values.v50}</span>
                        </div>
                    </div>
                    <div style="background: #1f2937; color: white; padding: 12px; border-radius: 6px; font-size: 12px;">
                        📅 Übertragen am: ${new Date().toLocaleString('de-DE')}<br>
                        ⚙️ Parameter: n₅₀=${chartData.parameters.n50}, Vol=${chartData.parameters.volume}m³, p=${chartData.parameters.pressure}Pa
                    </div>
                </div>
            `;
            
            console.log("✅ Chart-Platzhalter aktualisiert");
        }
        
        // Aktualisiere Result-Cards falls vorhanden
        this.updateResultCards(chartData.calculatedValues, chartData.parameters);
    }
    
    // ERWEITERTE FUNKTION: Aktualisiere Result-Cards
    updateResultCards(calculatedValues, parameters) {
        console.log("🎯 Aktualisiere Result-Cards...");
        
        // Suche nach Result-Cards
        const resultCards = document.querySelectorAll('.result-card .value');
        
        if (resultCards.length >= 3) {
            // n50-Wert
            if (calculatedValues.n50 && calculatedValues.n50 !== 'N/A') {
                resultCards[0].textContent = calculatedValues.n50;
                resultCards[0].style.backgroundColor = '#dcfce7';
                resultCards[0].style.border = '2px solid #10b981';
                resultCards[0].style.borderRadius = '6px';
                resultCards[0].style.padding = '4px 8px';
            } else if (parameters.n50) {
                resultCards[0].textContent = parameters.n50;
                resultCards[0].style.backgroundColor = '#fef3c7';
                resultCards[0].style.border = '2px solid #f59e0b';
                resultCards[0].style.borderRadius = '6px';
                resultCards[0].style.padding = '4px 8px';
            }
            
            // q50-Wert  
            if (calculatedValues.q50 && calculatedValues.q50 !== 'N/A') {
                resultCards[1].textContent = calculatedValues.q50;
                resultCards[1].style.backgroundColor = '#dcfce7';
                resultCards[1].style.border = '2px solid #10b981';
                resultCards[1].style.borderRadius = '6px';
                resultCards[1].style.padding = '4px 8px';
            } else if (parameters.n50 && parameters.volume) {
                // Berechne q50
                const q50 = (parseFloat(parameters.n50) * 2.68).toFixed(2);
                resultCards[1].textContent = q50;
                resultCards[1].style.backgroundColor = '#fef3c7';
                resultCards[1].style.border = '2px solid #f59e0b';
                resultCards[1].style.borderRadius = '6px';
                resultCards[1].style.padding = '4px 8px';
            }
            
            // V50-Wert
            if (calculatedValues.v50 && calculatedValues.v50 !== 'N/A') {
                resultCards[2].textContent = calculatedValues.v50;
                resultCards[2].style.backgroundColor = '#dcfce7';
                resultCards[2].style.border = '2px solid #10b981';
                resultCards[2].style.borderRadius = '6px';
                resultCards[2].style.padding = '4px 8px';
            } else if (parameters.n50 && parameters.volume) {
                // Berechne V50
                const v50 = (parseFloat(parameters.n50) * parseFloat(parameters.volume)).toFixed(0);
                resultCards[2].textContent = v50;
                resultCards[2].style.backgroundColor = '#fef3c7';
                resultCards[2].style.border = '2px solid #f59e0b';
                resultCards[2].style.borderRadius = '6px';
                resultCards[2].style.padding = '4px 8px';
            }
            
            console.log("✅ Result-Cards aktualisiert");
        }
    }

    // Neue Funktion für Result Elements
    updateResultElements(data) {
        console.log("🎯 Aktualisiere Result-Elemente...");
        
        // Suche nach Elementen mit data-transfer Attributen
        const elements = document.querySelectorAll('[data-transfer]');
        
        elements.forEach(element => {
            const transferKey = element.getAttribute('data-transfer');
            let value = null;
            
            // Zuordnung der Werte
            switch(transferKey) {
                case 'n50':
                    value = data.building['n50'];
                    break;
                case 'volume':
                    value = data.building['volume'];
                    break;
                case 'pressure':
                    value = data.building['pressure'];
                    break;
                case 'q50':
                    // Berechne q50 falls n50 und volume vorhanden
                    if (data.building['n50'] && data.building['volume']) {
                        const n50 = parseFloat(data.building['n50']);
                        const volume = parseFloat(data.building['volume']);
                        // Beispielberechnung für q50 (vereinfacht)
                        value = (n50 * 2.68).toFixed(2);
                    }
                    break;
                case 'v50':
                    // Berechne v50 falls n50 und volume vorhanden
                    if (data.building['n50'] && data.building['volume']) {
                        const n50 = parseFloat(data.building['n50']);
                        const volume = parseFloat(data.building['volume']);
                        value = (n50 * volume).toFixed(0);
                    }
                    break;
            }
            
            if (value) {
                element.textContent = value;
                element.style.backgroundColor = '#f0fdf4';
                element.style.border = '2px solid #10b981';
                element.style.borderRadius = '4px';
                element.style.padding = '2px 4px';
                console.log(`✅ ${transferKey}: ${value}`);
            }
        });
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 18px 28px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            font-weight: 600;
            font-size: 16px;
            max-width: 350px;
            animation: slideIn 0.5s ease-out;
        `;
        notification.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 5px;">🎉 Transfer erfolgreich!</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// =============================================================================
// GLOBALE INITIALISIERUNG
// =============================================================================

// Erstelle globale Instanz
let completeTransferSystem;

// Initialisiere beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        completeTransferSystem = new CompleteTransferSystem();
    });
} else {
    completeTransferSystem = new CompleteTransferSystem();
}

// Globale Funktionen für Rückwärtskompatibilität
window.transferAllData = function() {
    return completeTransferSystem?.transferAllData();
};

window.transferWeatherToProtocol = function() {
    return completeTransferSystem?.transferAllData();
};

window.transferMeasurementToProtocol = function() {
    return completeTransferSystem?.transferAllData();
};

// Debug-Funktionen
window.debugTransferData = function() {
    if (completeTransferSystem && completeTransferSystem.pageType === 'index') {
        const data = completeTransferSystem.collectAllData();
        console.log("🔍 Debug-Daten:", data);
        return data;
    }
};

window.testCompleteTransfer = function() {
    return completeTransferSystem?.transferAllData();
};

// CSS für Animationen
const styles = document.createElement('style');
styles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%) scale(0.8); opacity: 0; }
        to { transform: translateX(0) scale(1); opacity: 1; }
    }
`;
document.head.appendChild(styles);

console.log("✅ Vollständiges Transfer-System geladen und bereit!");
console.log("🎯 Neue Funktionen: Tabellen + Diagramm + erweiterte Visualisierung");
console.log("🚀 Verwenden Sie den Button 'VOLLSTÄNDIGER TRANSFER' zum Testen");