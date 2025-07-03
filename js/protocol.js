// =================================================================
// protocol.js - Protokoll-System
// =================================================================

/**
 * Initialisiert das Protokoll-System
 */
window.initProtocolPage = function() {
    console.log("Initialisiere Protokoll-System...");
    
    // Funktionen global verfügbar machen
    window.validateAndPrint = validateAndPrint;
    window.exportProtocol = exportProtocol;
    window.transferDataToProtocol = transferDataToProtocol;
}

/**
 * Aktualisiert die Protokoll-Seite
 */
window.updateProtocolPage = function() {
    const protocolPage = document.getElementById('protocol');
    
    if (!protocolPage || protocolPage.querySelector('.protocol-container')) {
        return;
    }

    protocolPage.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div class="max-w-7xl mx-auto">
                <div class="protocol-wrapper no-print">
                    <div class="protocol-controls text-center mb-6">
                        <h3 class="text-2xl font-bold text-rose-300 mb-4">📋 Blower Door Protokoll</h3>
                        <div class="flex flex-wrap justify-center gap-2">
                            <button onclick="validateAndPrint()" 
                                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                                🖨️ Drucken
                            </button>
                            <button onclick="exportProtocol()" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                📄 Exportieren (JSON)
                            </button>
                            <button onclick="transferDataToProtocol()" 
                                    class="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors">
                                🔄 Daten übertragen
                            </button>
                        </div>
                    </div>
                    <div class="protocol-content">
                        <div class="protocol-container bg-white text-black p-4 rounded-lg">
                            ${generateProtocolPages()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    addProtocolInputListeners();
}

/**
 * Generiert die Protokoll-Seiten
 */
function generateProtocolPages() {
    const pages = [];
    
    for (let i = 1; i <= 6; i++) {
        const contentFunction = `getPage${i}Content`;
        const content = typeof window[contentFunction] === 'function' 
            ? window[contentFunction]() 
            : `<div class="p-4"><h2>Seite ${i}</h2><p>Inhalt wird geladen...</p></div>`;
        
        pages.push(`<div class="page protocol-page">${content}</div>`);
    }
    
    return pages.join('');
}

/**
 * Überträgt Daten ins Protokoll
 */
window.transferDataToProtocol = function() {
    console.log('Übertrage Daten ins Protokoll...');

    try {
        // Gebäudedaten
        transferBuildingData();
        
        // Wetterdaten
        transferWeatherData();
        
        // Messdaten
        transferMeasurementData();
        
        // Berechnete Werte
        transferCalculatedValues();
        
        // Prüfergebnis
        transferTestResult();
        
        // Datum
        updateProtocolDate();

        console.log('Datenübertragung erfolgreich abgeschlossen');
        alert('Alle Daten wurden erfolgreich ins Protokoll übertragen!');
        
    } catch (error) {
        console.error('Fehler bei der Datenübertragung:', error);
        alert('Fehler beim Übertragen der Daten. Bitte versuchen Sie es erneut.');
    }
}

function transferBuildingData() {
    const volume = document.getElementById('volume')?.value || 'N/A';
    const pressure = document.getElementById('pressure')?.value || 'N/A';
    
    document.querySelectorAll('.protocol-volume, .protocol-volume-display').forEach(el => {
        if (el.tagName === 'INPUT') {
            el.value = volume;
        } else {
            el.textContent = volume;
        }
    });
    
    document.querySelectorAll('.protocol-pressure-display').forEach(el => {
        el.textContent = pressure;
    });
}

function transferWeatherData() {
    const weatherMappings = {
        'outside-temp': '.protocol-outside-temp',
        'wind-speed': '.protocol-wind-speed',
        'wind-direction': '.protocol-wind-direction'
    };

    Object.entries(weatherMappings).forEach(([inputId, selector]) => {
        const value = document.getElementById(inputId)?.value || '___';
        
        document.querySelectorAll(selector).forEach(el => {
            if (el.tagName === 'INPUT') {
                el.value = value;
            } else {
                el.textContent = value;
            }
        });
    });
}

function transferMeasurementData() {
    // Unterdruck-Messungen
    transferTableData('underpressure', '#protocol-underpressure-table');
    
    // Überdruck-Messungen
    transferTableData('overpressure', '#protocol-overpressure-table');
}

function transferTableData(type, tableSelector) {
    const table = document.querySelector(tableSelector);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    const data = window.readTableData(
        `.${type}-pressure-input`, 
        `.${type}-flow-input`, 
        type === 'underpressure'
    );

    data.forEach((entry, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td class="border px-2 py-1">${index + 1}</td>
            <td class="border px-2 py-1">${entry.x.toFixed(1)}</td>
            <td class="border px-2 py-1">${entry.y.toFixed(1)}</td>
            <td class="border px-2 py-1">Messwert ${index + 1}</td>
        `;
    });
}

function transferCalculatedValues() {
    const calculatedValues = {
        'calc-n50': '.protocol-result-n50',
        'calc-q50': '.protocol-result-q50',
        'calc-v50': '.protocol-result-v50'
    };

    Object.entries(calculatedValues).forEach(([inputId, selector]) => {
        const value = document.getElementById(inputId)?.textContent || 'N/A';
        
        document.querySelectorAll(selector).forEach(el => {
            el.textContent = value;
        });
    });
}

function transferTestResult() {
    const n50 = parseFloat(document.getElementById('calc-n50')?.textContent || '99');
    const result = n50 <= 1.5 ? 'Bestanden' : 'Nicht bestanden';
    const color = result === 'Bestanden' ? '#4CAF50' : '#F44336';
    
    document.querySelectorAll('.protocol-result').forEach(el => {
        el.textContent = result;
        el.style.color = color;
    });
}

function updateProtocolDate() {
    const heute = new Date().toLocaleDateString('de-DE');
    document.querySelectorAll('.auto-datum').forEach(el => {
        el.textContent = heute;
    });
}

/**
 * Validiert Protokoll-Daten
 */
function validateProtocolData() {
    const requiredFields = [
        '.protocol-object',
        '.protocol-address',
        '.protocol-client-name',
        '.protocol-volume'
    ];

    const missingFields = [];
    
    requiredFields.forEach(selector => {
        const field = document.querySelector(selector);
        if (!field || !field.value.trim()) {
            const label = field?.previousElementSibling?.textContent || selector;
            missingFields.push(label);
        }
    });

    if (missingFields.length > 0) {
        alert(`Bitte füllen Sie die folgenden Pflichtfelder aus:\n- ${missingFields.join('\n- ')}`);
        return false;
    }

    return true;
}

/**
 * Druckt das Protokoll
 */
window.validateAndPrint = function() {
    if (!validateProtocolData()) return;

    const printStyles = `
        @media print {
            body * { visibility: hidden; }
            .protocol-container, .protocol-container * { visibility: visible; }
            .protocol-container { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
            }
            .no-print, .protocol-controls { display: none !important; }
            .protocol-page { 
                page-break-after: always; 
                box-shadow: none !important; 
                margin: 0; 
                border: none; 
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);

    window.print();

    document.head.removeChild(styleSheet);
}

/**
 * Exportiert das Protokoll
 */
window.exportProtocol = function() {
    if (!validateProtocolData()) return;

    const data = {
        timestamp: new Date().toISOString(),
        version: '1.0'
    };

    // Eingabefelder sammeln
    document.querySelectorAll('.protocol-container input, .protocol-container textarea').forEach(input => {
        const key = input.className.split(' ').find(cls => cls.startsWith('protocol-'));
        if (key) {
            data[key] = input.value;
        }
    });

    // Berechnete Werte
    const calculatedSelectors = [
        '.protocol-result-n50',
        '.protocol-result-q50',
        '.protocol-result-v50',
        '.protocol-result'
    ];

    calculatedSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            const key = selector.replace('.', '').replace('-', '_');
            data[key] = element.textContent;
        }
    });

    // Export
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `blower-door-protokoll-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Fügt Event-Listener zu Protokoll-Eingabefeldern hinzu
 */
function addProtocolInputListeners() {
    document.querySelectorAll('.protocol-container input, .protocol-container textarea').forEach(input => {
        input.addEventListener('change', saveProtocolData);
        input.addEventListener('input', saveProtocolData);
    });
}

/**
 * Speichert Protokoll-Daten
 */
function saveProtocolData() {
    if (!window.protocolData) {
        window.protocolData = {};
    }

    document.querySelectorAll('.protocol-container input, .protocol-container textarea').forEach(input => {
        const key = input.className.split(' ').find(cls => cls.startsWith('protocol-'));
        if (key) {
            window.protocolData[key] = input.value;
        }
    });

    console.log('Protokolldaten gespeichert');
}

// Platzhalter für Protokoll-Seiten (müssen implementiert werden)
window.getPage1Content = function() {
    return `
        <div class="p-4">
            <h2 class="text-xl font-bold mb-4">Seite 1 - Grunddaten</h2>
            <div class="space-y-4">
                <div>
                    <label class="block font-medium">Objekt:</label>
                    <input type="text" class="protocol-object border rounded px-2 py-1 w-full" 
                           placeholder="Bezeichnung des Objekts">
                </div>
                <div>
                    <label class="block font-medium">Adresse:</label>
                    <input type="text" class="protocol-address border rounded px-2 py-1 w-full" 
                           placeholder="Vollständige Adresse">
                </div>
                <div>
                    <label class="block font-medium">Auftraggeber:</label>
                    <input type="text" class="protocol-client-name border rounded px-2 py-1 w-full" 
                           placeholder="Name des Auftraggebers">
                </div>
                <div>
                    <label class="block font-medium">Volumen [m³]:</label>
                    <input type="number" class="protocol-volume border rounded px-2 py-1 w-full" 
                           placeholder="Gebäudevolumen">
                </div>
            </div>
        </div>
    `;
};

// Weitere Seiten müssen entsprechend implementiert werden
window.getPage2Content = function() { return '<div class="p-4">Seite 2 - Inhalt folgt</div>'; };
window.getPage3Content = function() { return '<div class="p-4">Seite 3 - Inhalt folgt</div>'; };
window.getPage4Content = function() { return '<div class="p-4">Seite 4 - Inhalt folgt</div>'; };
window.getPage5Content = function() { return '<div class="p-4">Seite 5 - Inhalt folgt</div>'; };
window.getPage6Content = function() { return '<div class="p-4">Seite 6 - Inhalt folgt</div>'; };