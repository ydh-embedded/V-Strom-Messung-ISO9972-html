// =============================================================================
// DATENÜBERTRAGUNG VON INDEX.HTML ZU PROTOCOL.HTML
// =============================================================================

// 1. DATENSAMMLUNG AUS INDEX.HTML
// =============================================================================

/**
 * Hauptfunktion: Sammelt alle Daten aus index.html und überträgt sie zu protocol.html
 */
function transferAllDataToProtocol() {
    console.log('🔄 Starte vollständige Datenübertragung...');
    
    const collectedData = {
        weather: collectWeatherData(),
        measurement: collectMeasurementData(),
        underpressure: collectTableData('#underpressureTable'),
        overpressure: collectTableData('#overpressureTable'),
        legacy: collectTableData('#measurementTable'), // Falls vorhanden
        analysis: collectAnalysisData(),
        timestamp: new Date().toISOString(),
        transferType: 'complete'
    };
    
    console.log('📊 Gesammelte Daten:', collectedData);
    
    // Datenvalidierung
    const validation = validateData(collectedData);
    if (!validation.isValid && !confirm(`⚠️ ${validation.message}\n\nTrotzdem übertragen?`)) {
        return;
    }
    
    // Transfer ausführen
    executeTransfer(collectedData);
}

/**
 * Sammelt Wetterdaten aus dem Weather-Formular
 */
function collectWeatherData() {
    return {
        outsideTemp: getInputValue('outside-temp'),
        insideTemp: getInputValue('inside-temp') || '20', // Standard-Innentemperatur
        windSpeed: getInputValue('wind-speed'),
        windDirection: getInputValue('wind-direction'),
        airPressure: getInputValue('air-pressure'),
        humidity: getInputValue('humidity')
    };
}

/**
 * Sammelt Messparameter von den Schiebereglern und Eingabefeldern
 */
function collectMeasurementData() {
    const volume = getInputValue('volume') || '300';
    const n50 = getInputValue('n50') || '1.5';
    
    return {
        n50: n50,
        volume: volume,
        pressure: getInputValue('pressure') || '50',
        surfaceArea: calculateSurfaceArea(volume),
        floors: estimateFloors(volume),
        usageType: 'Wohngebäude',
        // Berechnete Werte
        q50: calculateQ50(n50, volume),
        v50: calculateV50(n50, volume)
    };
}

/**
 * Sammelt Analysedaten aus dem Chart und berechneten Werten
 */
function collectAnalysisData() {
    return {
        calculatedN50: getElementText('calc-n50') || getInputValue('n50'),
        calculatedQ50: getElementText('calc-q50'),
        calculatedV50: getElementText('calc-v50'),
        chartOptions: getChartOptions()
    };
}

/**
 * Universelle Funktion zum Sammeln von Tabellendaten
 */
function collectTableData(tableSelector) {
    const table = document.querySelector(tableSelector);
    if (!table) return [];
    
    const data = [];
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach((row, index) => {
        const pressureInput = row.querySelector('input[type="number"]:first-child, td:nth-child(2)');
        const volumeInput = row.querySelector('input[type="number"]:nth-child(2), td:nth-child(3)');
        
        let pressure = '';
        let volume = '';
        
        if (pressureInput) {
            pressure = pressureInput.value || pressureInput.textContent || '';
        }
        if (volumeInput) {
            volume = volumeInput.value || volumeInput.textContent || '';
        }
        
        if (pressure && volume && !isNaN(pressure) && !isNaN(volume)) {
            data.push({
                index: index + 1,
                pressure: parseFloat(pressure),
                volume: parseFloat(volume),
                type: tableSelector.includes('underpressure') ? 'underpressure' : 
                      tableSelector.includes('overpressure') ? 'overpressure' : 'legacy'
            });
        }
    });
    
    console.log(`📊 ${tableSelector}: ${data.length} Datensätze gesammelt`);
    return data;
}

// 2. HILFSFUNKTIONEN
// =============================================================================

function getInputValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value.trim() : '';
}

function getElementText(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.textContent.trim() : '';
}

function calculateSurfaceArea(volume) {
    if (!volume || isNaN(volume)) return '';
    const factor = 5.5; // Typischer Faktor für Wohngebäude
    return Math.round(Math.pow(parseFloat(volume), 2/3) * factor);
}

function estimateFloors(volume) {
    if (!volume || isNaN(volume)) return '1';
    const vol = parseFloat(volume);
    if (vol < 200) return '1';
    if (vol < 500) return '1-2';
    if (vol < 1000) return '2';
    return '2-3';
}

function calculateQ50(n50, volume) {
    if (!n50 || !volume || isNaN(n50) || isNaN(volume)) return '';
    const surfaceArea = calculateSurfaceArea(volume);
    if (!surfaceArea) return '';
    return ((parseFloat(n50) * parseFloat(volume)) / parseFloat(surfaceArea)).toFixed(2);
}

function calculateV50(n50, volume) {
    if (!n50 || !volume || isNaN(n50) || isNaN(volume)) return '';
    return (parseFloat(n50) * parseFloat(volume)).toFixed(0);
}

function getChartOptions() {
    return {
        showTheoretical: document.getElementById('showTheoretical')?.checked || false,
        showSimulated: document.getElementById('showSimulated')?.checked || false,
        showReal: document.getElementById('showReal')?.checked || false,
        showUnderpressure: document.getElementById('showUnderpressure')?.checked || false,
        showOverpressure: document.getElementById('showOverpressure')?.checked || false
    };
}

function validateData(data) {
    const hasWeather = Object.values(data.weather).some(val => val !== '');
    const hasMeasurement = Object.values(data.measurement).some(val => val !== '');
    const hasTableData = data.underpressure.length > 0 || data.overpressure.length > 0 || data.legacy.length > 0;
    
    if (!hasWeather && !hasMeasurement && !hasTableData) {
        return {
            isValid: false,
            message: 'Keine Daten gefunden. Bitte füllen Sie mindestens ein Formular aus.'
        };
    }
    
    return { isValid: true, message: 'Daten sind gültig.' };
}

function executeTransfer(data) {
    try {
        const encodedData = encodeURIComponent(JSON.stringify(data));
        const url = `./sites/protocol.html?data=${encodedData}`;
        
        console.log('🚀 Navigiere zu Protocol mit Daten...');
        showTransferNotification('Daten werden übertragen...', 'info');
        
        // Kurze Verzögerung für bessere UX
        setTimeout(() => {
            window.location.href = url;
        }, 500);
        
    } catch (error) {
        console.error('❌ Fehler bei der Übertragung:', error);
        showTransferNotification('Fehler bei der Datenübertragung: ' + error.message, 'error');
    }
}

// 3. SPEZIFISCHE ÜBERTRAGUNGSFUNKTIONEN
// =============================================================================

function transferWeatherOnly() {
    const weatherData = collectWeatherData();
    const hasData = Object.values(weatherData).some(val => val !== '');
    
    if (!hasData) {
        showTransferNotification('Keine Wetterdaten gefunden.', 'warning');
        return;
    }
    
    executeTransfer({
        weather: weatherData,
        transferType: 'weather-only',
        timestamp: new Date().toISOString()
    });
}

function transferMeasurementOnly() {
    const measurementData = collectMeasurementData();
    
    executeTransfer({
        measurement: measurementData,
        transferType: 'measurement-only',
        timestamp: new Date().toISOString()
    });
}

function transferTablesOnly() {
    const tableData = {
        underpressure: collectTableData('#underpressureTable'),
        overpressure: collectTableData('#overpressureTable'),
        legacy: collectTableData('#measurementTable')
    };
    
    const totalRows = tableData.underpressure.length + tableData.overpressure.length + tableData.legacy.length;
    
    if (totalRows === 0) {
        showTransferNotification('Keine Tabellendaten gefunden.', 'warning');
        return;
    }
    
    executeTransfer({
        ...tableData,
        transferType: 'tables-only',
        timestamp: new Date().toISOString()
    });
}

// 4. EMPFANGSFUNKTIONEN FÜR PROTOCOL.HTML
// =============================================================================

/**
 * Hauptfunktion für protocol.html: Lädt und verarbeitet übertragene Daten
 */
function loadTransferredData() {
    console.log('🔄 Protocol.html: Lade übertragene Daten...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (!encodedData) {
        console.log('ℹ️ Keine Daten in URL gefunden.');
        return;
    }
    
    try {
        const data = JSON.parse(decodeURIComponent(encodedData));
        console.log('📥 Daten erfolgreich geladen:', data);
        
        // Daten verarbeiten je nach Typ
        if (data.weather) processWeatherData(data.weather);
        if (data.measurement) processMeasurementData(data.measurement);
        if (data.underpressure) processUnderpressureData(data.underpressure);
        if (data.overpressure) processOverpressureData(data.overpressure);
        if (data.legacy) processLegacyTableData(data.legacy);
        if (data.analysis) processAnalysisData(data.analysis);
        
        // Erfolgsanzeige
        showProtocolNotification(`✅ ${data.transferType || 'Daten'} erfolgreich übertragen!`, 'success');
        
    } catch (error) {
        console.error('❌ Fehler beim Laden der Daten:', error);
        showProtocolNotification('Fehler beim Laden der Daten: ' + error.message, 'error');
    }
}

/**
 * Wetterdaten in protocol.html einfügen
 */
function processWeatherData(weatherData) {
    console.log('🌤️ Fülle Wetterdaten ein:', weatherData);
    
    const fieldMappings = {
        'Außentemperatur': weatherData.outsideTemp,
        'Innentemperatur': weatherData.insideTemp,
        'Windgeschwindigkeit': weatherData.windSpeed,
        'Windrichtung': weatherData.windDirection,
        'Luftdruck': weatherData.airPressure,
        'Luftfeuchtigkeit': weatherData.humidity
    };
    
    Object.entries(fieldMappings).forEach(([placeholder, value]) => {
        if (value) {
            const input = findInputByPlaceholder(placeholder);
            if (input) {
                input.value = value;
                highlightField(input, '#e6f3ff');
                console.log(`✅ ${placeholder}: ${value}`);
            }
        }
    });
}

/**
 * Messparameter in protocol.html einfügen
 */
function processMeasurementData(measurementData) {
    console.log('📏 Fülle Messparameter ein:', measurementData);
    
    // Gebäudedaten
    const buildingMappings = {
        'Netto-Raumvolumen V': measurementData.volume,
        'Hüllfläche': measurementData.surfaceArea,
        'Geschossanzahl': measurementData.floors,
        'Nutzungsart': measurementData.usageType
    };
    
    Object.entries(buildingMappings).forEach(([placeholder, value]) => {
        if (value) {
            const input = findInputByPlaceholder(placeholder);
            if (input) {
                input.value = value;
                highlightField(input, '#ffe6e6');
                console.log(`✅ ${placeholder}: ${value}`);
            }
        }
    });
    
    // Berechnete Werte in Anzeige-Karten (Seite 5)
    updateDisplayCards(measurementData);
}

/**
 * Unterdruckmessungen in Tabelle einfügen (Seite 4)
 */
function processUnderpressureData(underpressureData) {
    console.log('📊 Fülle Unterdrucktabelle:', underpressureData);
    
    const table = document.querySelector('.info-block h3')?.textContent.includes('Unterdruckmessungen') 
        ? document.querySelector('.info-block h3').closest('.info-block').querySelector('tbody')
        : document.querySelector('table tbody');
    
    if (table && underpressureData.length > 0) {
        table.innerHTML = '';
        
        underpressureData.forEach((measurement, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${measurement.pressure}</td>
                <td>${measurement.volume}</td>
                <td style="color: #10b981; font-weight: bold;">📥 Übertragen</td>
            `;
            table.appendChild(row);
        });
        
        console.log(`✅ ${underpressureData.length} Unterdruckmessungen eingefügt`);
    }
}

/**
 * Überdruckmessungen in Tabelle einfügen (Seite 4)
 */
function processOverpressureData(overpressureData) {
    console.log('📊 Fülle Überdrucktabelle:', overpressureData);
    
    const tables = document.querySelectorAll('.data-table tbody');
    const overpressureTable = tables[1]; // Zweite Tabelle ist meist Überdruck
    
    if (overpressureTable && overpressureData.length > 0) {
        overpressureTable.innerHTML = '';
        
        overpressureData.forEach((measurement, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${measurement.pressure}</td>
                <td>${measurement.volume}</td>
                <td style="color: #10b981; font-weight: bold;">📥 Übertragen</td>
            `;
            overpressureTable.appendChild(row);
        });
        
        console.log(`✅ ${overpressureData.length} Überdruckmessungen eingefügt`);
    }
}

/**
 * Analysedaten und Diagramm aktualisieren (Seite 5)
 */
function processAnalysisData(analysisData) {
    console.log('📈 Fülle Analysedaten ein:', analysisData);
    
    // Berechnete Werte in Ergebnis-Karten
    if (analysisData.calculatedN50) {
        updateResultCard('.result-card .value', analysisData.calculatedN50);
    }
    if (analysisData.calculatedQ50) {
        updateResultCard('.result-card:nth-child(2) .value', analysisData.calculatedQ50);
    }
    if (analysisData.calculatedV50) {
        updateResultCard('.result-card:nth-child(3) .value', analysisData.calculatedV50);
    }
    
    // Diagramm-Platzhalter aktualisieren
    updateChartPlaceholder(analysisData);
}

// 5. HILFSFUNKTIONEN FÜR PROTOCOL.HTML
// =============================================================================

function findInputByPlaceholder(placeholder) {
    return document.querySelector(`input[placeholder*="${placeholder}"]`);
}

function updateDisplayCards(measurementData) {
    // Control Cards (Seite 5)
    const cards = {
        '.control-n50': measurementData.n50,
        '.control-volume': measurementData.volume,
        '.control-pressure': measurementData.pressure
    };
    
    Object.entries(cards).forEach(([selector, value]) => {
        const card = document.querySelector(selector);
        if (card && value) {
            card.textContent = value;
            highlightElement(card, '#f0f9ff');
        }
    });
}

function updateResultCard(selector, value) {
    const card = document.querySelector(selector);
    if (card && value) {
        card.textContent = value;
        highlightElement(card, '#f0fdf4');
    }
}

function updateChartPlaceholder(analysisData) {
    const chartPlaceholder = document.querySelector('.chart-placeholder div');
    if (chartPlaceholder) {
        chartPlaceholder.innerHTML = `
            <div>📊 Analysedaten eingefügt</div>
            <div style="font-size: 12px; margin-top: 10px;">
                n₅₀: ${analysisData.calculatedN50 || 'N/A'} | 
                q₅₀: ${analysisData.calculatedQ50 || 'N/A'} | 
                V₅₀: ${analysisData.calculatedV50 || 'N/A'}
                <br>Übertragen um: ${new Date().toLocaleTimeString()}
            </div>
        `;
        highlightElement(chartPlaceholder.parentElement, '#fefce8');
    }
}

function highlightField(input, color) {
    const originalColor = input.style.backgroundColor;
    input.style.backgroundColor = color;
    input.style.transition = 'background-color 0.3s ease';
    
    setTimeout(() => {
        input.style.backgroundColor = originalColor;
    }, 2000);
}

function highlightElement(element, color) {
    const originalColor = element.style.backgroundColor;
    element.style.backgroundColor = color;
    element.style.transition = 'background-color 0.3s ease';
    element.style.borderRadius = '8px';
    element.style.padding = '4px 8px';
    
    setTimeout(() => {
        element.style.backgroundColor = originalColor;
        element.style.padding = '';
    }, 2000);
}

// 6. BENACHRICHTIGUNGSSYSTEM
// =============================================================================

function showTransferNotification(message, type = 'info') {
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.5s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

function showProtocolNotification(message, type = 'success') {
    showTransferNotification(message, type);
}

// 7. INITIALISIERUNG
// =============================================================================

// Für index.html
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Index.html: Datenübertragung initialisiert');
        
        // Protokoll-Button erweitern
        const protocolButtons = document.querySelectorAll('button[onclick*="protocol.html"]');
        protocolButtons.forEach(button => {
            button.setAttribute('onclick', 'transferAllDataToProtocol()');
            button.title = 'Alle Daten zum Protokoll übertragen';
        });
        
        // Zusätzliche Transfer-Buttons hinzufügen
        addTransferButtons();
        
        console.log('✅ Index.html: Transfer-System bereit');
    });
}

// Für protocol.html
if (window.location.pathname.includes('protocol.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Protocol.html: Datenempfang initialisiert');
        
        // Daten aus URL laden
        loadTransferredData();
        
        console.log('✅ Protocol.html: Empfang-System bereit');
    });
}

function addTransferButtons() {
    // Wetter-Sektion
    const weatherSection = document.getElementById('weather-data-form');
    if (weatherSection) {
        const buttonContainer = weatherSection.querySelector('.text-center');
        if (buttonContainer) {
            addButton(buttonContainer, '🌤️ Nur Wetter', transferWeatherOnly, 'blue');
        }
    }
    
    // Mess-Sektion
    const measurementSection = document.getElementById('measurement-parameters');
    if (measurementSection) {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'text-center mt-4';
        addButton(buttonDiv, '📊 Nur Parameter', transferMeasurementOnly, 'amber');
        measurementSection.appendChild(buttonDiv);
    }
    
    // Tabellen-Sektion
    const tableSection = document.getElementById('measurement-tables');
    if (tableSection) {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'text-center mt-4';
        addButton(buttonDiv, '📋 Nur Tabellen', transferTablesOnly, 'emerald');
        addButton(buttonDiv, '🚀 Alles übertragen', transferAllDataToProtocol, 'rose');
        tableSection.appendChild(buttonDiv);
    }
}

function addButton(container, text, onclick, color) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white px-4 py-2 rounded-lg font-medium hover:from-${color}-400 hover:to-${color}-500 transition-all duration-300 mr-2 mb-2`;
    button.onclick = onclick;
    container.appendChild(button);
}

// 8. CSS ANIMATIONEN (Inline Styles)
// =============================================================================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%) scale(0.8); opacity: 0; }
        to { transform: translateX(0) scale(1); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0) scale(1); opacity: 1; }
        to { transform: translateX(100%) scale(0.8); opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);