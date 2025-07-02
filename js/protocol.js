// js/protocol.js

/**
 * Initialisiert die Protokollseite und macht wichtige Funktionen global verfügbar.
 */
window.initProtocolPage = function() {
    window.validateAndPrint = validateAndPrint;
    window.exportProtocol = exportProtocol;
    window.transferDataToProtocol = transferDataToProtocol;
};

/**
 * Füllt den Protokoll-Tab mit dem HTML-Inhalt der Seiten, falls noch nicht geschehen.
 */
window.updateProtocolPage = function() {
    const protocolPage = document.getElementById('protocol');
    // Bricht ab, wenn die Seite nicht existiert oder bereits gefüllt ist.
    if (!protocolPage || protocolPage.querySelector('.protocol-container')) return;

    protocolPage.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div class="max-w-7xl mx-auto">
            <div class="protocol-wrapper no-print">
                <div class="protocol-controls text-center mb-6">
                    <h3 class="text-2xl font-bold text-rose-300 mb-4">📋 Blower Door Protokoll</h3>
                    <div class="flex flex-wrap justify-center gap-2">
                        <button onclick="validateAndPrint()" class="action-btn bg-emerald-600 text-white px-4 py-2 rounded-lg">🖨️ Drucken</button>
                        <button onclick="exportProtocol()" class="action-btn bg-blue-600 text-white px-4 py-2 rounded-lg">📄 Exportieren (JSON)</button>
                        <button onclick="transferDataToProtocol()" class="action-btn bg-rose-600 text-white px-4 py-2 rounded-lg">🔄 Daten jetzt übertragen</button>
                    </div>
                </div>
                <div class="protocol-content">
                    <div class="protocol-container bg-white text-black p-4 rounded-lg">
                        ${generateProtocolPages()}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    // Nach dem Erstellen des HTML, Event-Listener für die Eingabefelder hinzufügen
    addProtocolInputListeners();
};

/**
 * Generiert den HTML-String für alle 6 Protokollseiten.
 */
function generateProtocolPages() {
    // Ruft für jede Seite eine Funktion auf, die das entsprechende HTML zurückgibt.
    return `
        <div class="page protocol-page">${getPage1Content()}</div>
        <div class="page protocol-page">${getPage2Content()}</div>
        <div class="page protocol-page">${getPage3Content()}</div>
        <div class="page protocol-page">${getPage4Content()}</div>
        <div class="page protocol-page">${getPage5Content()}</div>
        <div class="page protocol-page">${getPage6Content()}</div>
    `;
}

/**
 * Überträgt alle relevanten Daten von den anderen Tabs in die Protokollfelder.
 */
window.transferDataToProtocol = function() {
    console.log('Übertrage Daten ins Protokoll...');

    // 1. Gebäudedaten (Volumen, Druck)
    const volume = document.getElementById('volume')?.value || 'N/A';
    document.querySelectorAll('.protocol-volume, .protocol-volume-display').forEach(el => {
        el.value = volume;
        if(el.tagName !== 'INPUT') el.textContent = volume;
    });
    const pressure = document.getElementById('pressure')?.value || 'N/A';
    document.querySelectorAll('.protocol-pressure-display').forEach(el => el.textContent = pressure);

    // 2. Wetterdaten
    const weatherMappings = { 'outside-temp': '.protocol-outside-temp', 'wind-speed': '.protocol-wind-speed', 'wind-direction': '.protocol-wind-direction' };
    Object.entries(weatherMappings).forEach(([id, selector]) => {
        const value = document.getElementById(id)?.value || '___';
        document.querySelectorAll(selector).forEach(el => el.value = value);
    });

    // 3. Messwerte (Unter- und Überdruck)
    transferTableData('underpressure', '#protocol-underpressure-table');
    transferTableData('overpressure', '#protocol-overpressure-table');

    // 4. Berechnete Kennwerte (n50, q50, V50)
    const calculatedValues = { 'calc-n50': '.protocol-result-n50', 'calc-q50': '.protocol-result-q50', 'calc-v50': '.protocol-result-v50' };
    Object.entries(calculatedValues).forEach(([id, selector]) => {
        const value = document.getElementById(id)?.textContent || 'N/A';
        document.querySelectorAll(selector).forEach(el => el.textContent = value);
    });

    // 5. Prüfergebnis basierend auf n50-Wert
    const n50 = parseFloat(document.getElementById('calc-n50')?.textContent || '99');
    const result = n50 <= 1.5 ? 'Bestanden' : 'Nicht bestanden';
    document.querySelectorAll('.protocol-result').forEach(el => {
        el.textContent = result;
        el.style.color = result === 'Bestanden' ? '#4CAF50' : '#F44336';
    });
    
    // 6. Datum aktualisieren
    document.querySelectorAll('.auto-datum').forEach(el => el.textContent = new Date().toLocaleDateString('de-DE'));

    console.log('Datenübertragung abgeschlossen.');
    alert('Alle aktuellen Daten wurden erfolgreich in das Protokoll übertragen!');
}

/**
 * Hilfsfunktion zum Übertragen von Tabellendaten.
 * @param {string} type - 'underpressure' oder 'overpressure'
 * @param {string} tableSelector - CSS-Selector für die Zieltabelle im Protokoll
 */
function transferTableData(type, tableSelector) {
    const table = document.querySelector(tableSelector);
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Leeren
    
    const data = window.readTableData(`.${type}-pressure-input`, `.${type}-flow-input`, type === 'underpressure');
    data.forEach((entry, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.x.toFixed(1)}</td>
            <td>${entry.y.toFixed(1)}</td>
            <td>Messwert ${index + 1}</td>
        `;
    });
}

/**
 * Validiert die Pflichtfelder im Protokoll.
 * @returns {boolean} - True, wenn alle Felder gültig sind.
 */
function validateProtocolData() {
    const requiredFields = ['.protocol-object', '.protocol-address', '.protocol-client-name', '.protocol-volume'];
    const missingFields = [];
    requiredFields.forEach(selector => {
        const field = document.querySelector(selector);
        if (!field || !field.value.trim()) {
            missingFields.push(field?.previousElementSibling?.textContent || selector);
        }
    });

    if (missingFields.length > 0) {
        alert(`Bitte füllen Sie die folgenden Pflichtfelder im Protokoll aus:\n- ${missingFields.join('\n- ')}`);
        return false;
    }
    return true;
}

/**
 * Validiert die Daten und startet dann den Druckvorgang.
 */
window.validateAndPrint = function() {
    if (validateProtocolData()) {
        // Fügt temporär Druck-Styles hinzu, druckt und entfernt sie wieder.
        const printStyles = `@media print { body * { visibility: hidden; } .protocol-container, .protocol-container * { visibility: visible; } .protocol-container { position: absolute; left: 0; top: 0; width: 100%; } .no-print, .protocol-controls { display: none !important; } .protocol-page { page-break-after: always; box-shadow: none !important; margin: 0; border: none; } }`;
        const styleSheet = document.createElement('style');
        styleSheet.innerHTML = printStyles;
        document.head.appendChild(styleSheet);
        window.print();
        document.head.removeChild(styleSheet);
    }
}

/**
 * Exportiert die Protokolldaten als JSON-Datei.
 */
window.exportProtocol = function() {
    if (!validateProtocolData()) return;
    const data = {};
    document.querySelectorAll('.protocol-container input, .protocol-container textarea').forEach(input => {
        // Verwende eine eindeutige Klasse oder ID als Schlüssel
        const key = input.className.split(' ').find(cls => cls.startsWith('protocol-'));
        if (key) data[key] = input.value;
    });
    // Füge berechnete Werte hinzu
    data.n50Value = document.querySelector('.protocol-result-n50')?.textContent;
    data.q50Value = document.querySelector('.protocol-result-q50')?.textContent;
    data.v50Value = document.querySelector('.protocol-result-v50')?.textContent;
    data.result = document.querySelector('.protocol-result')?.textContent;

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
 * Fügt Event-Listener zu den Eingabefeldern hinzu, um Änderungen zu speichern.
 */
function addProtocolInputListeners() {
    document.querySelectorAll('.protocol-container input, .protocol-container textarea').forEach(input => {
        input.addEventListener('change', saveProtocolData);
    });
}

/**
 * Speichert die Formulardaten in einem globalen Objekt (als Ersatz für localStorage).
 */
function saveProtocolData() {
    if (!window.protocolData) window.protocolData = {};
    document.querySelectorAll('.protocol-container input, .protocol-container textarea').forEach(input => {
        const key = input.className.split(' ').find(cls => cls.startsWith('protocol-'));
        if (key) window.protocolData[key] = input.value;
    });
    console.log('Protokolldaten zwischengespeichert.');
}

// =================================================================
// HTML-INHALT FÜR PROTOKOLLSEITEN
// =================================================================
// WICHTIG: Kopieren Sie hier den HTML-Code aus Ihrer Originaldatei hinein.

function getPage1Content() {
    return `<!-- Fügen Sie hier das vollständige HTML für Seite 1 ein -->
    <div class="header">...</div><div class="info-block"><h3>Geprüftes Objekt:</h3><div class="field-group"><label>Objekt:</label><input type="text" value="Wohneinheit nach Sanierung" class="protocol-object"></div>...</div>...`;
}
function getPage2Content() { return `<!-- Fügen Sie hier das vollständige HTML für Seite 2 ein -->`; }
function getPage3Content() { return `<!-- Fügen Sie hier das vollständige HTML für Seite 3 ein -->`; }
function getPage4Content() { return `<!-- Fügen Sie hier das vollständige HTML für Seite 4 ein -->`; }
function getPage5Content() { return `<!-- Fügen Sie hier das vollständige HTML für Seite 5 ein -->`; }
function getPage6Content() { return `<!-- Fügen Sie hier das vollständige HTML für Seite 6 ein -->`; }
