/**
 * ./js/transfer.js
 * ERWEITERTE TRANSFER-SYSTEM - KOMPLETT MIT TABELLEN UND DIAGRAMM
 * Überträgt alle Daten zwischen index.html und protocol.html
 * ANGEPASST: Transparenter Hintergrund und dunkelgrüne Schriftfarbe
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
                
                // Scroll zu Seite 4 nach einem kurzen Delay, um die Tabellen zu zeigen
                setTimeout(() => {
                    this.scrollToMeasurementTables();
                }, 2000);
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
                    // ANGEPASST: Transparenter Hintergrund und dunkelgrüne Schriftfarbe
                    input.style.backgroundColor = 'transparent';
                    input.style.color = '#064e3b';
                    input.style.fontWeight = 'bold';
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

    // ERWEITERTE FUNKTION: Fülle Messdaten-Tabellen in protocol.html
    fillMeasurementTables(measurements) {
        console.log("📊 Fülle Messdaten-Tabellen auf Seite 4...");
        
        let totalRowsInserted = 0;
        
        // Unterdruck-Tabelle füllen (erste .data-table)
        if (measurements.underpressure && measurements.underpressure.length > 0) {
            this.fillProtocolTable('Unterdruckmessungen', measurements.underpressure, 0);
            totalRowsInserted += measurements.underpressure.length;
        }
        
        // Überdruck-Tabelle füllen (zweite .data-table)
        if (measurements.overpressure && measurements.overpressure.length > 0) {
            this.fillProtocolTable('Überdruckmessungen', measurements.overpressure, 1);
            totalRowsInserted += measurements.overpressure.length;
        }
        
        // Kombinierte Tabelle füllen (falls vorhanden - dritte Tabelle)
        if (measurements.combined && measurements.combined.length > 0) {
            this.fillProtocolTable('Kombinierte Messungen', measurements.combined, 2);
            totalRowsInserted += measurements.combined.length;
        }
        
        // Zeige Gesamt-Summary
        if (totalRowsInserted > 0) {
            this.showMeasurementSummary(measurements, totalRowsInserted);
        }
        
        console.log(`📊 Gesamt: ${totalRowsInserted} Messwerte in Tabellen eingefügt`);
    }
    
    // NEUE FUNKTION: Zeige Messdaten-Zusammenfassung
    showMeasurementSummary(measurements, totalRows) {
        const summaryDiv = document.createElement('div');
        summaryDiv.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1e40af, #1d4ed8);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
            z-index: 1000;
            text-align: center;
            font-weight: 600;
            animation: slideIn 0.5s ease-out;
        `;
        
        summaryDiv.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 15px;">📊 Messdaten-Transfer abgeschlossen</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; font-size: 14px;">
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 20px; color: #ef4444;">↓</div>
                    <div>Unterdruck</div>
                    <div style="font-size: 16px; font-weight: bold;">${measurements.underpressure.length} Werte</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 20px; color: #10b981;">↑</div>
                    <div>Überdruck</div>
                    <div style="font-size: 16px; font-weight: bold;">${measurements.overpressure.length} Werte</div>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px;">
                    <div style="font-size: 20px; color: #f59e0b;">↕</div>
                    <div>Kombiniert</div>
                    <div style="font-size: 16px; font-weight: bold;">${measurements.combined.length} Werte</div>
                </div>
            </div>
            <div style="margin-top: 15px; font-size: 12px; opacity: 0.9;">
                Insgesamt ${totalRows} Messwerte in Seite 4 Tabellen eingefügt
            </div>
        `;
        
        document.body.appendChild(summaryDiv);
        
        setTimeout(() => {
            summaryDiv.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => summaryDiv.remove(), 500);
        }, 5000);
    }
    
    // ERWEITERTE FUNKTION: Fülle spezifische Tabelle in protocol.html
    fillProtocolTable(tableName, data, tableIndex) {
        console.log(`📋 Fülle ${tableName} mit ${data.length} Zeilen...`);
        
        // Verschiedene Strategien zum Finden der Tabellen
        let targetTable = null;
        
        // Strategie 1: Über Index (für Seite 4 Tabellen)
        const dataTables = document.querySelectorAll('.data-table');
        if (dataTables[tableIndex]) {
            targetTable = dataTables[tableIndex];
            console.log(`✅ Tabelle gefunden über Index ${tableIndex}: .data-table`);
        }
        
        // Strategie 2: Über Text-Suche in Überschriften (Fallback)
        if (!targetTable) {
            const allTables = document.querySelectorAll('table');
            allTables.forEach((table, index) => {
                const heading = table.closest('.info-block')?.querySelector('h3');
                if (heading && heading.textContent.toLowerCase().includes(tableName.toLowerCase().split('messungen')[0])) {
                    targetTable = table;
                    console.log(`✅ Tabelle gefunden über Überschrift: "${heading.textContent}"`);
                }
            });
        }
        
        if (targetTable) {
            const tbody = targetTable.querySelector('tbody');
            if (tbody) {
                console.log(`📊 Ersetze ${tbody.children.length} vorhandene Zeilen mit ${data.length} neuen Zeilen`);
                
                // Leere existierende Daten komplett
                tbody.innerHTML = '';
                
                // Füge neue Daten ein mit erweiterten Informationen
                data.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="font-weight: bold; background: transparent; color: #064e3b;">${index + 1}</td>
                        <td style="color: #064e3b; font-weight: bold; background: transparent;">${row.pressure}</td>
                        <td style="color: #064e3b; font-weight: bold; background: transparent;">${row.volume}</td>
                        <td style="color: #064e3b; font-weight: bold; background: transparent; border-radius: 4px; text-align: center;">
                            📥 ${row.type}
                        </td>
                    `;
                    
                    // ANGEPASST: Transparenter Hintergrund für Zeilen-Animation
                    tr.style.backgroundColor = 'rgba(254, 243, 199, 0.3)';
                    tr.style.transition = 'background-color 2s ease';
                    
                    tbody.appendChild(tr);
                    
                    // Animiere Zeile nach dem Einfügen
                    setTimeout(() => {
                        tr.style.backgroundColor = 'transparent';
                    }, 500 + (index * 100));
                });
                
                // Tabelle und Container hervorheben
                this.highlightTable(targetTable, tableName);
                
                console.log(`✅ ${tableName}: ${data.length} Zeilen erfolgreich eingefügt`);
                
                // Zeige Tabellen-spezifische Benachrichtigung
                this.showTableNotification(tableName, data.length);
                
            } else {
                console.log(`❌ Kein tbody in Tabelle ${tableIndex} gefunden für ${tableName}`);
            }
        } else {
            console.log(`❌ Tabelle ${tableIndex} nicht gefunden für ${tableName}`);
            // Zeige alle verfügbaren Tabellen für Debugging
            this.debugAvailableTables();
        }
    }
    
    // NEUE FUNKTION: Hebe Tabelle visuell hervor
    highlightTable(table, tableName) {
        // Finde den Container (info-block)
        const container = table.closest('.info-block') || table.parentElement;
        
        // ANGEPASST: Tabellen-Hervorhebung mit transparentem Hintergrund
        table.style.backgroundColor = 'transparent';
        table.style.border = '3px solid #10b981';
        table.style.borderRadius = '8px';
        table.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        table.style.transition = 'all 0.5s ease';
        
        // Container-Hervorhebung
        if (container) {
            container.style.backgroundColor = 'rgba(248, 250, 252, 0.5)';
            container.style.border = '2px solid #10b981';
            container.style.borderRadius = '12px';
            container.style.transform = 'scale(1.02)';
            container.style.transition = 'all 0.5s ease';
            
            // Überschrift hervorheben
            const heading = container.querySelector('h3');
            if (heading) {
                heading.style.color = '#10b981';
                heading.style.textShadow = '0 2px 4px rgba(16, 185, 129, 0.3)';
                heading.innerHTML = `📊 ${heading.textContent} (${tableName} übertragen)`;
            }
        }
        
        // Entferne Hervorhebung nach Delay
        setTimeout(() => {
            table.style.backgroundColor = 'transparent';
            table.style.border = '1px solid #d1d5db';
            table.style.boxShadow = '';
            
            if (container) {
                container.style.backgroundColor = 'transparent';
                container.style.border = '';
                container.style.transform = '';
            }
        }, 4000);
    }
    
    // NEUE FUNKTION: Zeige tabellen-spezifische Benachrichtigung
    showTableNotification(tableName, rowCount) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            z-index: 1000;
            font-weight: 600;
            font-size: 14px;
            animation: slideIn 0.5s ease-out;
            border-left: 4px solid #34d399;
        `;
        notification.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 4px;">📊 ${tableName}</div>
            <div style="font-size: 12px; opacity: 0.9;">${rowCount} Messwerte eingefügt</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    // NEUE FUNKTION: Debug verfügbare Tabellen
    debugAvailableTables() {
        console.log("🔍 === DEBUG: Verfügbare Tabellen ===");
        
        const allTables = document.querySelectorAll('table');
        allTables.forEach((table, index) => {
            const heading = table.closest('.info-block')?.querySelector('h3')?.textContent || 'Unbekannt';
            const rowCount = table.querySelectorAll('tbody tr').length;
            const className = table.className;
            
            console.log(`Tabelle ${index}:`, {
                heading: heading,
                class: className,
                rows: rowCount,
                hasDataTable: table.classList.contains('data-table')
            });
        });
        
        console.log("=== Ende Debug ===");
    }
    
    // NEUE FUNKTION: Scrolle zu den Messdaten-Tabellen (Seite 4)
    scrollToMeasurementTables() {
        // Finde die erste data-table (sollte Unterdrucktabelle sein)
        const firstDataTable = document.querySelector('.data-table');
        
        if (firstDataTable) {
            // Smooth scroll zur Tabelle
            firstDataTable.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Kurze Hervorhebung nach dem Scrollen
            setTimeout(() => {
                firstDataTable.style.backgroundColor = 'rgba(254, 243, 199, 0.3)';
                firstDataTable.style.transition = 'background-color 1s ease';
                
                setTimeout(() => {
                    firstDataTable.style.backgroundColor = 'transparent';
                }, 1500);
            }, 1000);
            
            console.log("📍 Automatisch zu Messdaten-Tabellen gescrollt");
        }
    }
    
    this.updateChartDisplay = function(chartData) {
        console.log("📈 Protocol-Seite: Aktualisiere Diagramm mit Chart.js...");

        const transferData = JSON.parse(sessionStorage.getItem('blowerDoorTransfer') || '{}');
        const measurements = transferData.measurements || { underpressure: [], overpressure: [], combined: [] };

        // Update UI elements (status, summary, parameters)
        this.updateChartStatus('Erstelle...', 'blue');
        this.updateDataSummary(measurements);
        this.updateParameters(chartData);

        // Hide status banner
        const statusBanner = document.getElementById('chart-status');
        if (statusBanner) {
            statusBanner.style.display = 'none';
        }

        // Get the canvas element
        const chartAreaDiv = document.getElementById('chart-area');
        if (!chartAreaDiv) {
            console.error("❌ Chart-Area Div nicht gefunden!");
            return;
        }

        // Clear previous content
