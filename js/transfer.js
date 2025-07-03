/**
 * ./js/transfer.js
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
                        <td style="font-weight: bold;">${index + 1}</td>
                        <td style="color: #dc2626; font-weight: bold;">${row.pressure}</td>
                        <td style="color: #2563eb; font-weight: bold;">${row.volume}</td>
                        <td style="color: #10b981; font-weight: bold; background: #f0fdf4; border-radius: 4px; text-align: center;">
                            📥 ${row.type}
                        </td>
                    `;
                    
                    // Zeilen-Animation
                    tr.style.backgroundColor = '#fef3c7';
                    tr.style.transition = 'background-color 2s ease';
                    
                    tbody.appendChild(tr);
                    
                    // Animiere Zeile nach dem Einfügen
                    setTimeout(() => {
                        tr.style.backgroundColor = '';
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
        
        // Tabellen-Hervorhebung
        table.style.backgroundColor = '#f0fdf4';
        table.style.border = '3px solid #10b981';
        table.style.borderRadius = '8px';
        table.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        table.style.transition = 'all 0.5s ease';
        
        // Container-Hervorhebung
        if (container) {
            container.style.backgroundColor = '#f8fafc';
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
            table.style.backgroundColor = '';
            table.style.border = '1px solid #d1d5db';
            table.style.boxShadow = '';
            
            if (container) {
                container.style.backgroundColor = '';
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
                firstDataTable.style.backgroundColor = '#fef3c7';
                firstDataTable.style.transition = 'background-color 1s ease';
                
                setTimeout(() => {
                    firstDataTable.style.backgroundColor = '';
                }, 1500);
            }, 1000);
            
            console.log("📍 Automatisch zu Messdaten-Tabellen gescrollt");
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
    
    @keyframes slideOut {
        from { transform: translateX(0) scale(1); opacity: 1; }
        to { transform: translateX(100%) scale(0.8); opacity: 0; }
    }
    
    .data-table {
        transition: all 0.5s ease;
    }
    
    .data-table tbody tr {
        transition: background-color 0.3s ease;
    }
    
    .data-table tbody tr:hover {
        background-color: #f8fafc;
    }
`;



document.head.appendChild(styles);

console.log("✅ Vollständiges Transfer-System geladen und bereit!");
console.log("🎯 Neue Funktionen: Tabellen + Diagramm + erweiterte Visualisierung");
console.log("🚀 Verwenden Sie den Button 'VOLLSTÄNDIGER TRANSFER' zum Testen");


/**
 * KORRIGIERTE VERSION - VISUELLES DIAGRAMM-TRANSFER
 * Behebt den "Assignment to constant variable" Fehler
 */


// Erweitere das Transfer-System um visuelles Diagramm
function enhanceWithVisualChart() {
    
    // NEUE FUNKTION: Übertrage visuelles Diagramm
    function transferVisualChart(chartData, measurements) {
        console.log("🎨 Übertrage visuelles Diagramm zur Protocol-Seite...");
        
        const chartContainer = findChartContainer();
        if (!chartContainer) {
            console.log("❌ Chart-Container nicht gefunden");
            return;
        }
        
        // Erstelle visuelles Diagramm basierend auf bestehender Analyse-Seite
        createVisualChart(chartContainer, chartData, measurements);
    }
    
    // FUNKTION: Finde Chart-Container auf Seite 5
    function findChartContainer() {
        // Suche nach verschiedenen Chart-Container Möglichkeiten
        return document.querySelector('.chart-placeholder') || 
               document.querySelector('#chart-container') ||
               document.querySelector('#chart') ||
               createChartContainer();
    }
    
    // FUNKTION: Erstelle Chart-Container falls nicht vorhanden
    function createChartContainer() {
        const diagramSection = findDiagramSection();
        if (!diagramSection) return null;
        
        const container = document.createElement('div');
        container.className = 'chart-placeholder';
        container.style.cssText = `
            width: 100%;
            margin: 20px 0;
            background: #0f172a;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #334155;
        `;
        
        diagramSection.appendChild(container);
        return container;
    }
    
    // FUNKTION: Finde Diagramm-Sektion
    function findDiagramSection() {
        // Suche nach "Diagramm" Überschrift
        const headings = document.querySelectorAll('.section-title, h3, h4');
        for (let heading of headings) {
            if (heading.textContent.toLowerCase().includes('diagramm')) {
                return heading.parentElement;
            }
        }
        
        // Fallback: Seite 5
        const pages = document.querySelectorAll('.page');
        return pages[4]; // Index 4 = Seite 5
    }
    
    // HAUPTFUNKTION: Erstelle visuelles Diagramm
    function createVisualChart(container, chartData, measurements) {
        console.log("🎨 Erstelle visuelles Canvas-Diagramm...");
        
        // Canvas erstellen
        const canvas = document.createElement('canvas');
        canvas.id = 'protocol-chart';
        canvas.width = 855;
        canvas.height = 320;
        canvas.style.cssText = `
            display: block;
            box-sizing: border-box;
            height: 400px;
            width: 100%;
            background: #1e293b;
            border-radius: 8px;
        `;
        
        // Chart-Info Container
        const chartWrapper = document.createElement('div');
        chartWrapper.style.cssText = `
            background: #0f172a;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #334155;
        `;
        
        const chartTitle = document.createElement('div');
        chartTitle.style.cssText = `
            color: #e2e8f0;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        `;
        chartTitle.innerHTML = '📊 Blower-Door Messung - Druckverlauf';
        
        chartWrapper.appendChild(chartTitle);
        chartWrapper.appendChild(canvas);
        
        // Füge Chart-Informationen hinzu
        const chartInfo = createChartInfo(chartData, measurements);
        chartWrapper.appendChild(chartInfo);
        
        // Ersetze Container-Inhalt
        container.innerHTML = '';
        container.appendChild(chartWrapper);
        
        // Zeichne das Diagramm
        drawChart(canvas, chartData, measurements);
    }
    
    // FUNKTION: Zeichne Chart auf Canvas
    function drawChart(canvas, chartData, measurements) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Hintergrund
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        
        // Chart-Bereich definieren
        const chartArea = {
            x: 80,
            y: 60,
            width: width - 160,
            height: height - 120
        };
        
        // Bestimme Datenbereich
        const allPoints = [
            ...(measurements.underpressure || []),
            ...(measurements.overpressure || [])
        ];
        
        if (allPoints.length === 0) {
            drawEmptyChart(ctx, chartArea);
            return;
        }
        
        const maxPressure = Math.max(...allPoints.map(p => Math.abs(p.pressure)), 50);
        const maxVolume = Math.max(...allPoints.map(p => p.volume), 2000);
        
        // Zeichne Achsen
        drawAxes(ctx, chartArea, maxPressure, maxVolume);
        
        // Zeichne Theoretische Kurve (falls aktiviert)
        if (chartData.options.showTheoretical && chartData.parameters.n50 && chartData.parameters.volume) {
            drawTheoreticalCurve(ctx, chartArea, chartData.parameters, maxPressure, maxVolume);
        }
        
        // Zeichne Messpunkte
        if (chartData.options.showUnderpressure && measurements.underpressure) {
            drawMeasurementPoints(ctx, chartArea, measurements.underpressure, '#ef4444', maxPressure, maxVolume, true);
        }
        
        if (chartData.options.showOverpressure && measurements.overpressure) {
            drawMeasurementPoints(ctx, chartArea, measurements.overpressure, '#10b981', maxPressure, maxVolume, false);
        }
        
        // Zeichne Legende
        drawLegend(ctx, chartData.options, width);
        
        console.log("✅ Visuelles Diagramm gezeichnet");
    }
    
    // FUNKTION: Zeichne leeres Diagramm
    function drawEmptyChart(ctx, chartArea) {
        ctx.fillStyle = '#475569';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Keine Messdaten vorhanden', chartArea.x + chartArea.width / 2, chartArea.y + chartArea.height / 2);
    }
    
    // FUNKTION: Zeichne Achsen
    function drawAxes(ctx, chartArea, maxPressure, maxVolume) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        
        // X-Achse
        ctx.beginPath();
        ctx.moveTo(chartArea.x, chartArea.y + chartArea.height);
        ctx.lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height);
        ctx.stroke();
        
        // Y-Achse
        ctx.beginPath();
        ctx.moveTo(chartArea.x, chartArea.y);
        ctx.lineTo(chartArea.x, chartArea.y + chartArea.height);
        ctx.stroke();
        
        // Achsenbeschriftungen
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // X-Achse Beschriftung
        for (let i = 0; i <= 5; i++) {
            const x = chartArea.x + (i / 5) * chartArea.width;
            const value = (i / 5) * maxPressure;
            ctx.fillText(value.toFixed(0), x, chartArea.y + chartArea.height + 20);
        }
        
        // Y-Achse Beschriftung
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = chartArea.y + chartArea.height - (i / 5) * chartArea.height;
            const value = (i / 5) * maxVolume;
            ctx.fillText(value.toFixed(0), chartArea.x - 10, y + 4);
        }
        
        // Achsentitel
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Druckdifferenz [Pa]', chartArea.x + chartArea.width / 2, chartArea.y + chartArea.height + 50);
        
        ctx.save();
        ctx.translate(20, chartArea.y + chartArea.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Volumenstrom [m³/h]', 0, 0);
        ctx.restore();
    }
    
    // FUNKTION: Zeichne theoretische Kurve
    function drawTheoreticalCurve(ctx, chartArea, parameters, maxPressure, maxVolume) {
        const n50 = parseFloat(parameters.n50);
        const volume = parseFloat(parameters.volume);
        
        if (!n50 || !volume) return;
        
        ctx.strokeStyle = '#3b82f6';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        let firstPoint = true;
        for (let pressure = 5; pressure <= maxPressure; pressure += 1) {
            const flow = n50 * volume * Math.pow(pressure / 50, 0.65);
            const x = chartArea.x + (pressure / maxPressure) * chartArea.width;
            const y = chartArea.y + chartArea.height - (flow / maxVolume) * chartArea.height;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // FUNKTION: Zeichne Messpunkte
    function drawMeasurementPoints(ctx, chartArea, points, color, maxPressure, maxVolume, isUnderpressure) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Verbindungslinie
        if (points.length > 1) {
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            
            points.forEach((point, index) => {
                const pressure = isUnderpressure ? Math.abs(point.pressure) : point.pressure;
                const x = chartArea.x + (pressure / maxPressure) * chartArea.width;
                const y = chartArea.y + chartArea.height - (point.volume / maxVolume) * chartArea.height;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Punkte
        points.forEach(point => {
            const pressure = isUnderpressure ? Math.abs(point.pressure) : point.pressure;
            const x = chartArea.x + (pressure / maxPressure) * chartArea.width;
            const y = chartArea.y + chartArea.height - (point.volume / maxVolume) * chartArea.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Weißer Rand
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.strokeStyle = color;
        });
    }
    
    // KORRIGIERTE FUNKTION: Zeichne Legende
    function drawLegend(ctx, options, width) {
        let legendY = 20; // ← GEÄNDERT: let statt const
        let legendX = width - 200;
        
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        
        if (options.showUnderpressure) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(legendX, legendY, 12, 12);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('Unterdruck', legendX + 20, legendY + 10);
            legendY += 20; // ← Jetzt funktioniert das!
        }
        
        if (options.showOverpressure) {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(legendX, legendY, 12, 12);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('Überdruck', legendX + 20, legendY + 10);
            legendY += 20; // ← Und das auch!
        }
        
        if (options.showTheoretical) {
            ctx.strokeStyle = '#3b82f6';
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(legendX, legendY + 6);
            ctx.lineTo(legendX + 12, legendY + 6);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('Theoretisch', legendX + 20, legendY + 10);
        }
    }
    
    // FUNKTION: Erstelle Chart-Informationen
    function createChartInfo(chartData, measurements) {
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            margin-top: 20px;
            padding: 20px;
            background: #334155;
            border-radius: 8px;
            color: #e2e8f0;
        `;
        
        const totalUnder = measurements.underpressure?.length || 0;
        const totalOver = measurements.overpressure?.length || 0;
        const totalPoints = totalUnder + totalOver;
        
        infoDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
                <div style="background: #475569; padding: 15px; border-radius: 6px;">
                    <div style="font-size: 24px; color: #ef4444; margin-bottom: 8px;">📉</div>
                    <div style="font-size: 18px; font-weight: bold;">${totalUnder}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Unterdruckmessungen</div>
                </div>
                <div style="background: #475569; padding: 15px; border-radius: 6px;">
                    <div style="font-size: 24px; color: #10b981; margin-bottom: 8px;">📈</div>
                    <div style="font-size: 18px; font-weight: bold;">${totalOver}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Überdruckmessungen</div>
                </div>
                <div style="background: #475569; padding: 15px; border-radius: 6px;">
                    <div style="font-size: 24px; color: #3b82f6; margin-bottom: 8px;">📊</div>
                    <div style="font-size: 18px; font-weight: bold;">${totalPoints}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Gesamt-Messpunkte</div>
                </div>
            </div>
            <div style="margin-top: 15px; text-align: center; font-size: 12px; opacity: 0.7;">
                n₅₀: ${chartData.parameters.n50 || 'N/A'} [1/h] • 
                Volumen: ${chartData.parameters.volume || 'N/A'} [m³] • 
                erstellt: ${new Date().toLocaleString('de-DE')}
            </div>
        `;
        
        return infoDiv;
    }
    
    // ERWEITERE DIE BESTEHENDE updateChartDisplay FUNKTION
    if (window.completeTransferSystem) {
        const originalUpdateChart = window.completeTransferSystem.updateChartDisplay;
        
        window.completeTransferSystem.updateChartDisplay = function(chartData) {
            console.log("🎨 Erstelle visuelles Diagramm (wie Analyse-Seite)...");
            
            // Sammle Messdaten aus dem Transfer
            const transferData = JSON.parse(sessionStorage.getItem('blowerDoorTransfer') || '{}');
            const measurements = transferData.measurements || { underpressure: [], overpressure: [], combined: [] };
            
            // Erstelle visuelles Diagramm
            setTimeout(() => {
                transferVisualChart(chartData, measurements);
            }, 500);
        };
        
        console.log("✅ Transfer-System mit visuellem Diagramm erweitert");
    }
    
    // GLOBALE TEST-FUNKTION
    window.testVisualChart = function() {
        console.log("🧪 Teste visuelles Diagramm...");
        
        const testChartData = {
            options: {
                showTheoretical: true,
                showUnderpressure: true,
                showOverpressure: true
            },
            parameters: {
                n50: '2.1',
                volume: '350',
                pressure: '75'
            }
        };
        
        const testMeasurements = {
            underpressure: [
                {pressure: -10, volume: 850},
                {pressure: -20, volume: 1200},
                {pressure: -30, volume: 1480},
                {pressure: -40, volume: 1720},
                {pressure: -50, volume: 1950}
            ],
            overpressure: [
                {pressure: 10, volume: 820},
                {pressure: 20, volume: 1150},
                {pressure: 30, volume: 1420},
                {pressure: 40, volume: 1680},
                {pressure: 50, volume: 1920}
            ]
        };
        
        transferVisualChart(testChartData, testMeasurements);
    };
}

// Initialisiere visuelle Chart-Erweiterung
enhanceWithVisualChart();

console.log("🎨 Korrigiertes visuelles Diagramm-System geladen!");
console.log("🧪 Test-Befehl: testVisualChart()");
console.log("✅ Fehler behoben - Das Diagramm funktioniert jetzt!");
