/**
 * TRANSFER.JS - Datenübertragung zwischen index.html und protocol.html
 * Version: 1.0
 * Autor: Blower Door System
 * 
 * Verwendung:
 * <script src="js/transfer.js"></script>
 */

// =============================================================================
// GLOBALE KONFIGURATION
// =============================================================================

const TRANSFER_CONFIG = {
    debug: true,
    highlightDuration: 2000,
    notificationDuration: 4000,
    defaultValues: {
        insideTemp: '20',
        volume: '300',
        n50: '1.5',
        pressure: '50',
        floors: '1',
        usageType: 'Wohngebäude'
    }
};

// =============================================================================
// HAUPTKLASSE FÜR DATENÜBERTRAGUNG
// =============================================================================

class DataTransferSystem {
    constructor() {
        this.isIndexPage = this.detectPageType() === 'index';
        this.isProtocolPage = this.detectPageType() === 'protocol';
        this.initializeSystem();
    }

    detectPageType() {
        const path = window.location.pathname;
        if (path.includes('protocol.html')) return 'protocol';
        if (path.includes('index.html') || path === '/') return 'index';
        return 'unknown';
    }

    initializeSystem() {
        if (this.isIndexPage) {
            this.initializeIndexPage();
        } else if (this.isProtocolPage) {
            this.initializeProtocolPage();
        }
        
        this.addGlobalStyles();
        this.log('🚀 Transfer-System initialisiert');
    }

    // =============================================================================
    // INDEX.HTML FUNKTIONEN
    // =============================================================================

    initializeIndexPage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupTransferButtons();
            this.setupKeyboardShortcuts();
            this.log('✅ Index.html Transfer-System bereit');
        });
    }

    setupTransferButtons() {
        // Hauptprotokoll-Button modifizieren
        this.modifyProtocolButtons();
        
        // Zusätzliche Transfer-Buttons hinzufügen
        this.addWeatherTransferButton();
        this.addMeasurementTransferButton();
        this.addTableTransferButtons();
        this.addMainTransferButton();
    }

    modifyProtocolButtons() {
        const protocolButtons = document.querySelectorAll('button[onclick*="protocol.html"]');
        protocolButtons.forEach(button => {
            button.setAttribute('onclick', 'dataTransfer.transferAllData()');
            button.title = 'Alle Daten zum Protokoll übertragen';
            
            // Transfer-Indikator hinzufügen
            if (!button.querySelector('.transfer-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'transfer-indicator';
                indicator.innerHTML = '📊';
                indicator.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #10b981;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                `;
                button.style.position = 'relative';
                button.appendChild(indicator);
            }
        });
    }

    addWeatherTransferButton() {
        const weatherSection = document.getElementById('weather-data-form');
        if (weatherSection) {
            const buttonContainer = weatherSection.querySelector('.text-center');
            if (buttonContainer) {
                this.createTransferButton(
                    buttonContainer,
                    '🌤️ Nur Wetter übertragen',
                    'dataTransfer.transferWeatherOnly()',
                    'blue'
                );
            }
        }
    }

    addMeasurementTransferButton() {
        const measurementSection = document.getElementById('measurement-parameters');
        if (measurementSection) {
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'text-center mt-4';
            this.createTransferButton(
                buttonDiv,
                '📊 Parameter übertragen',
                'dataTransfer.transferMeasurementOnly()',
                'amber'
            );
            measurementSection.appendChild(buttonDiv);
        }
    }

    addTableTransferButtons() {
        const tableSection = document.getElementById('measurement-tables');
        if (tableSection) {
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'text-center mt-6 space-x-2';
            
            this.createTransferButton(
                buttonDiv,
                '📋 Nur Tabellen',
                'dataTransfer.transferTablesOnly()',
                'emerald'
            );
            
            tableSection.appendChild(buttonDiv);
        }
    }

    addMainTransferButton() {
        const analysisSection = document.getElementById('analysis-results');
        if (analysisSection) {
            const buttonDiv = document.createElement('div');
            buttonDiv.className = 'text-center mt-6';
            
            this.createTransferButton(
                buttonDiv,
                '🚀 Komplette Übertragung starten',
                'dataTransfer.transferAllData()',
                'rose',
                'large'
            );
            
            analysisSection.appendChild(buttonDiv);
        }
    }

    createTransferButton(container, text, onclick, color, size = 'normal') {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.setAttribute('onclick', onclick);
        
        const sizeClass = size === 'large' ? 'px-8 py-3 text-base' : 'px-4 py-2 text-sm';
        button.className = `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white ${sizeClass} rounded-lg font-medium hover:from-${color}-400 hover:to-${color}-500 transition-all duration-300 mr-2 mb-2 shadow-lg hover:shadow-xl transform hover:scale-105`;
        
        container.appendChild(button);
    }

    // =============================================================================
    // DATENSAMMLUNG
    // =============================================================================

    transferAllData() {
        this.log('🔄 Starte vollständige Datenübertragung...');
        
        const collectedData = {
            weather: this.collectWeatherData(),
            measurement: this.collectMeasurementData(),
            underpressure: this.collectTableData('#underpressureTable'),
            overpressure: this.collectTableData('#overpressureTable'),
            legacy: this.collectTableData('#measurementTable'),
            analysis: this.collectAnalysisData(),
            timestamp: new Date().toISOString(),
            transferType: 'complete'
        };
        
        this.log('📊 Gesammelte Daten:', collectedData);
        
        const validation = this.validateData(collectedData);
        if (!validation.isValid) {
            if (!confirm(`⚠️ ${validation.message}\n\nTrotzdem übertragen?`)) {
                return;
            }
        }
        
        this.executeTransfer(collectedData);
    }

    transferWeatherOnly() {
        const weatherData = this.collectWeatherData();
        const hasData = Object.values(weatherData).some(val => val !== '');
        
        if (!hasData) {
            this.showNotification('Keine Wetterdaten gefunden.', 'warning');
            return;
        }
        
        this.executeTransfer({
            weather: weatherData,
            transferType: 'weather-only',
            timestamp: new Date().toISOString()
        });
    }

    transferMeasurementOnly() {
        const measurementData = this.collectMeasurementData();
        
        this.executeTransfer({
            measurement: measurementData,
            transferType: 'measurement-only',
            timestamp: new Date().toISOString()
        });
    }

    transferTablesOnly() {
        const tableData = {
            underpressure: this.collectTableData('#underpressureTable'),
            overpressure: this.collectTableData('#overpressureTable'),
            legacy: this.collectTableData('#measurementTable')
        };
        
        const totalRows = tableData.underpressure.length + tableData.overpressure.length + tableData.legacy.length;
        
        if (totalRows === 0) {
            this.showNotification('Keine Tabellendaten gefunden.', 'warning');
            return;
        }
        
        this.executeTransfer({
            ...tableData,
            transferType: 'tables-only',
            timestamp: new Date().toISOString()
        });
    }

    collectWeatherData() {
        return {
            outsideTemp: this.getInputValue('outside-temp'),
            insideTemp: this.getInputValue('inside-temp') || TRANSFER_CONFIG.defaultValues.insideTemp,
            windSpeed: this.getInputValue('wind-speed'),
            windDirection: this.getInputValue('wind-direction'),
            airPressure: this.getInputValue('air-pressure'),
            humidity: this.getInputValue('humidity')
        };
    }

    collectMeasurementData() {
        const volume = this.getInputValue('volume') || TRANSFER_CONFIG.defaultValues.volume;
        const n50 = this.getInputValue('n50') || TRANSFER_CONFIG.defaultValues.n50;
        
        return {
            n50: n50,
            volume: volume,
            pressure: this.getInputValue('pressure') || TRANSFER_CONFIG.defaultValues.pressure,
            surfaceArea: this.calculateSurfaceArea(volume),
            floors: this.estimateFloors(volume),
            usageType: TRANSFER_CONFIG.defaultValues.usageType,
            q50: this.calculateQ50(n50, volume),
            v50: this.calculateV50(n50, volume)
        };
    }

    collectAnalysisData() {
        return {
            calculatedN50: this.getElementText('calc-n50') || this.getInputValue('n50'),
            calculatedQ50: this.getElementText('calc-q50'),
            calculatedV50: this.getElementText('calc-v50'),
            chartOptions: this.getChartOptions()
        };
    }

    collectTableData(tableSelector) {
        const table = document.querySelector(tableSelector);
        if (!table) return [];
        
        const data = [];
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach((row, index) => {
            const inputs = row.querySelectorAll('input[type="number"]');
            const cells = row.querySelectorAll('td');
            
            let pressure = '';
            let volume = '';
            
            if (inputs.length >= 2) {
                pressure = inputs[0].value;
                volume = inputs[1].value;
            } else if (cells.length >= 3) {
                pressure = cells[1].textContent || cells[1].innerText;
                volume = cells[2].textContent || cells[2].innerText;
            }
            
            if (pressure && volume && !isNaN(pressure) && !isNaN(volume)) {
                data.push({
                    index: index + 1,
                    pressure: parseFloat(pressure),
                    volume: parseFloat(volume),
                    type: this.getTableType(tableSelector)
                });
            }
        });
        
        this.log(`📊 ${tableSelector}: ${data.length} Datensätze gesammelt`);
        return data;
    }

    // =============================================================================
    // PROTOCOL.HTML FUNKTIONEN
    // =============================================================================

    initializeProtocolPage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadTransferredData();
            this.log('✅ Protocol.html Empfang-System bereit');
        });
    }

    loadTransferredData() {
        this.log('🔄 Protocol.html: Lade übertragene Daten...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (!encodedData) {
            this.log('ℹ️ Keine Daten in URL gefunden.');
            return;
        }
        
        try {
            const data = JSON.parse(decodeURIComponent(encodedData));
            this.log('📥 Daten erfolgreich geladen:', data);
            
            // Daten verarbeiten
            if (data.weather) this.processWeatherData(data.weather);
            if (data.measurement) this.processMeasurementData(data.measurement);
            if (data.underpressure) this.processUnderpressureData(data.underpressure);
            if (data.overpressure) this.processOverpressureData(data.overpressure);
            if (data.legacy) this.processLegacyTableData(data.legacy);
            if (data.analysis) this.processAnalysisData(data.analysis);
            
            this.showNotification(`✅ ${this.getTransferTypeText(data.transferType)} erfolgreich übertragen!`, 'success');
            
        } catch (error) {
            console.error('❌ Fehler beim Laden der Daten:', error);
            this.showNotification('Fehler beim Laden der Daten: ' + error.message, 'error');
        }
    }

    processWeatherData(weatherData) {
        this.log('🌤️ Fülle Wetterdaten ein:', weatherData);
        
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
                const input = this.findInputByPlaceholder(placeholder);
                if (input) {
                    input.value = value;
                    this.highlightField(input, '#e6f3ff');
                    this.log(`✅ ${placeholder}: ${value}`);
                }
            }
        });
    }

    processMeasurementData(measurementData) {
        this.log('📏 Fülle Messparameter ein:', measurementData);
        
        const buildingMappings = {
            'Netto-Raumvolumen V': measurementData.volume,
            'Hüllfläche': measurementData.surfaceArea,
            'Geschossanzahl': measurementData.floors,
            'Nutzungsart': measurementData.usageType
        };
        
        Object.entries(buildingMappings).forEach(([placeholder, value]) => {
            if (value) {
                const input = this.findInputByPlaceholder(placeholder);
                if (input) {
                    input.value = value;
                    this.highlightField(input, '#ffe6e6');
                    this.log(`✅ ${placeholder}: ${value}`);
                }
            }
        });
        
        this.updateDisplayCards(measurementData);
    }

    processUnderpressureData(underpressureData) {
        this.log('📊 Fülle Unterdrucktabelle:', underpressureData);
        this.fillTable('Unterdruckmessungen', underpressureData, 0);
    }

    processOverpressureData(overpressureData) {
        this.log('📊 Fülle Überdrucktabelle:', overpressureData);
        this.fillTable('Überdruckmessungen', overpressureData, 1);
    }

    processLegacyTableData(legacyData) {
        this.log('📊 Fülle Legacy-Tabelle:', legacyData);
        // Implementierung für kombinierte Tabelle falls benötigt
    }

    processAnalysisData(analysisData) {
        this.log('📈 Fülle Analysedaten ein:', analysisData);
        
        this.updateResultCards(analysisData);
        this.updateChartPlaceholder(analysisData);
    }

    // =============================================================================
    // HILFSFUNKTIONEN
    // =============================================================================

    getInputValue(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.value.trim() : '';
    }

    getElementText(elementId) {
        const element = document.getElementById(elementId);
        return element ? element.textContent.trim() : '';
    }

    findInputByPlaceholder(placeholder) {
        return document.querySelector(`input[placeholder*="${placeholder}"]`);
    }

    calculateSurfaceArea(volume) {
        if (!volume || isNaN(volume)) return '';
        const factor = 5.5;
        return Math.round(Math.pow(parseFloat(volume), 2/3) * factor);
    }

    estimateFloors(volume) {
        if (!volume || isNaN(volume)) return TRANSFER_CONFIG.defaultValues.floors;
        const vol = parseFloat(volume);
        if (vol < 200) return '1';
        if (vol < 500) return '1-2';
        if (vol < 1000) return '2';
        return '2-3';
    }

    calculateQ50(n50, volume) {
        if (!n50 || !volume || isNaN(n50) || isNaN(volume)) return '';
        const surfaceArea = this.calculateSurfaceArea(volume);
        if (!surfaceArea) return '';
        return ((parseFloat(n50) * parseFloat(volume)) / parseFloat(surfaceArea)).toFixed(2);
    }

    calculateV50(n50, volume) {
        if (!n50 || !volume || isNaN(n50) || isNaN(volume)) return '';
        return (parseFloat(n50) * parseFloat(volume)).toFixed(0);
    }

    getChartOptions() {
        return {
            showTheoretical: document.getElementById('showTheoretical')?.checked || false,
            showSimulated: document.getElementById('showSimulated')?.checked || false,
            showReal: document.getElementById('showReal')?.checked || false,
            showUnderpressure: document.getElementById('showUnderpressure')?.checked || false,
            showOverpressure: document.getElementById('showOverpressure')?.checked || false
        };
    }

    getTableType(tableSelector) {
        if (tableSelector.includes('underpressure')) return 'underpressure';
        if (tableSelector.includes('overpressure')) return 'overpressure';
        return 'legacy';
    }

    getTransferTypeText(transferType) {
        const types = {
            'complete': 'Alle Daten',
            'weather-only': 'Wetterdaten',
            'measurement-only': 'Messparameter',
            'tables-only': 'Tabellendaten'
        };
        return types[transferType] || 'Daten';
    }

    fillTable(tableTitle, data, tableIndex) {
        const tables = document.querySelectorAll('.data-table tbody');
        const table = tables[tableIndex];
        
        if (table && data.length > 0) {
            table.innerHTML = '';
            
            data.forEach((measurement, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${measurement.pressure}</td>
                    <td>${measurement.volume}</td>
                    <td style="color: #10b981; font-weight: bold;">📥 Übertragen</td>
                `;
                table.appendChild(row);
            });
            
            this.highlightElement(table.parentElement, '#f0fdf4');
            this.log(`✅ ${data.length} ${tableTitle} eingefügt`);
        }
    }

    updateDisplayCards(measurementData) {
        const cards = {
            '.control-n50': measurementData.n50,
            '.control-volume': measurementData.volume,
            '.control-pressure': measurementData.pressure
        };
        
        Object.entries(cards).forEach(([selector, value]) => {
            const card = document.querySelector(selector);
            if (card && value) {
                card.textContent = value;
                this.highlightElement(card, '#f0f9ff');
            }
        });
    }

    updateResultCards(analysisData) {
        const resultMappings = [
            { selector: '.result-card:nth-child(1) .value', value: analysisData.calculatedN50 },
            { selector: '.result-card:nth-child(2) .value', value: analysisData.calculatedQ50 },
            { selector: '.result-card:nth-child(3) .value', value: analysisData.calculatedV50 }
        ];
        
        resultMappings.forEach(({ selector, value }) => {
            if (value) {
                const card = document.querySelector(selector);
                if (card) {
                    card.textContent = value;
                    this.highlightElement(card, '#f0fdf4');
                }
            }
        });
    }

    updateChartPlaceholder(analysisData) {
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
            this.highlightElement(chartPlaceholder.parentElement, '#fefce8');
        }
    }

    validateData(data) {
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

    executeTransfer(data) {
        try {
            const encodedData = encodeURIComponent(JSON.stringify(data));
            const url = `./sites/protocol.html?data=${encodedData}`;
            
            this.log('🚀 Navigiere zu Protocol mit Daten...');
            this.showNotification('Daten werden übertragen...', 'info');
            
            setTimeout(() => {
                window.location.href = url;
            }, 500);
            
        } catch (error) {
            console.error('❌ Fehler bei der Übertragung:', error);
            this.showNotification('Fehler bei der Datenübertragung: ' + error.message, 'error');
        }
    }

    highlightField(input, color) {
        const originalColor = input.style.backgroundColor;
        input.style.backgroundColor = color;
        input.style.transition = 'background-color 0.3s ease';
        
        setTimeout(() => {
            input.style.backgroundColor = originalColor;
        }, TRANSFER_CONFIG.highlightDuration);
    }

    highlightElement(element, color) {
        const originalColor = element.style.backgroundColor;
        element.style.backgroundColor = color;
        element.style.transition = 'background-color 0.3s ease';
        element.style.borderRadius = '8px';
        element.style.padding = '4px 8px';
        
        setTimeout(() => {
            element.style.backgroundColor = originalColor;
            element.style.padding = '';
        }, TRANSFER_CONFIG.highlightDuration);
    }

    showNotification(message, type = 'info') {
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
        }, TRANSFER_CONFIG.notificationDuration);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+T für komplette Übertragung
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.transferAllData();
            }
            
            // Ctrl+Shift+W für Wetter
            if (e.ctrlKey && e.shiftKey && e.key === 'W') {
                e.preventDefault();
                this.transferWeatherOnly();
            }
            
            // Ctrl+Shift+M für Messung
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                this.transferMeasurementOnly();
            }
        });
    }

    addGlobalStyles() {
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
            
            .transfer-indicator {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(styles);
    }

    log(message, data = null) {
        if (TRANSFER_CONFIG.debug) {
            if (data) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        }
    }
}

// =============================================================================
// GLOBALE INITIALISIERUNG
// =============================================================================

// Globale Instanz erstellen
let dataTransfer;

// System beim Laden der Seite initialisieren
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dataTransfer = new DataTransferSystem();
    });
} else {
    dataTransfer = new DataTransferSystem();
}

// Globale Funktionen für Rückwärtskompatibilität
window.transferAllDataToProtocol = () => dataTransfer?.transferAllData();
window.transferWeatherToProtocol = () => dataTransfer?.transferWeatherOnly();
window.transferMeasurementToProtocol = () => dataTransfer?.transferMeasurementOnly();
window.transferTablesToProtocol = () => dataTransfer?.transferTablesOnly();