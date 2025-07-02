// js/measurement.js

// Globale Variablen für das Diagramm-Objekt und die Messdaten
window.chart = null;
let realMeasurements = [];
let underpressureMeasurements = [];
let overpressureMeasurements = [];

/**
 * Initialisiert die Seite für die Messdatenerfassung.
 */
window.initMeasurementPage = function() {
    initSliders();
    initMeasurementTables();
    addChartCheckboxListeners();
    updateCalculations(); // Initialberechnung
}

/**
 * Initialisiert die Slider für n50, Volumen und Druck.
 */
function initSliders() {
    const sliders = {
        'n50': 'n50-value',
        'volume': 'volume-value',
        'pressure': 'pressure-value'
    };

    for (const id in sliders) {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(sliders[id]);
        if (slider && valueDisplay) {
            // Initialwert setzen
            valueDisplay.textContent = slider.value;
            // Event Listener hinzufügen
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
                updateCalculations();
                if (window.chart) updateChart();
            });
        }
    }
}

/**
 * Initialisiert die drei Messtabellen mit leeren Zeilen.
 */
function initMeasurementTables() {
    // Leere die Tabellenkörper, bevor neue Zeilen hinzugefügt werden
    document.getElementById('underpressureTable').innerHTML = '';
    document.getElementById('overpressureTable').innerHTML = '';
    document.getElementById('measurementTable').innerHTML = '';

    for (let i = 0; i < 5; i++) {
        addUnderpressureRow();
        addOverpressureRow();
        addMeasurementRow();
    }
}

// Funktionen für Unterdruck-Tabelle
window.addUnderpressureRow = function() {
    const tableBody = document.getElementById('underpressureTable');
    if (tableBody) tableBody.appendChild(createMeasurementRow('underpressure'));
};
window.clearUnderpressure = function() {
    const tableBody = document.getElementById('underpressureTable');
    if(tableBody) tableBody.innerHTML = '';
    underpressureMeasurements = [];
    for (let i = 0; i < 3; i++) addUnderpressureRow();
    if(window.chart) updateChart();
};
function updateUnderpressureMeasurements() {
    underpressureMeasurements = readTableData('.underpressure-pressure-input', '.underpressure-flow-input', true);
    if(window.chart) updateChart();
};

// Funktionen für Überdruck-Tabelle
window.addOverpressureRow = function() {
    const tableBody = document.getElementById('overpressureTable');
    if (tableBody) tableBody.appendChild(createMeasurementRow('overpressure'));
};
window.clearOverpressure = function() {
    const tableBody = document.getElementById('overpressureTable');
    if(tableBody) tableBody.innerHTML = '';
    overpressureMeasurements = [];
    for (let i = 0; i < 3; i++) addOverpressureRow();
    if(window.chart) updateChart();
};
function updateOverpressureMeasurements() {
    overpressureMeasurements = readTableData('.overpressure-pressure-input', '.overpressure-flow-input');
    if(window.chart) updateChart();
};

// Funktionen für Legacy-Tabelle
window.addMeasurementRow = function() {
    const tableBody = document.getElementById('measurementTable');
    if (tableBody) tableBody.appendChild(createMeasurementRow('legacy'));
};
window.clearMeasurements = function() {
    const tableBody = document.getElementById('measurementTable');
    if(tableBody) tableBody.innerHTML = '';
    realMeasurements = [];
    for (let i = 0; i < 3; i++) addMeasurementRow();
    if(window.chart) updateChart();
};
function updateMeasurements() {
    realMeasurements = readTableData('.pressure-input', '.flow-input');
    if(window.chart) updateChart();
};

/**
 * Erstellt eine neue Zeile für eine Messtabelle.
 * @param {string} type - 'underpressure', 'overpressure', oder 'legacy'
 */
function createMeasurementRow(type) {
    const row = document.createElement('tr');
    let pressureClass, flowClass, updateFunc;
    switch(type) {
        case 'underpressure':
            [pressureClass, flowClass, updateFunc] = ['underpressure-pressure-input', 'underpressure-flow-input', 'updateUnderpressureMeasurements()'];
            break;
        case 'overpressure':
            [pressureClass, flowClass, updateFunc] = ['overpressure-pressure-input', 'overpressure-flow-input', 'updateOverpressureMeasurements()'];
            break;
        default: // legacy
            [pressureClass, flowClass, updateFunc] = ['pressure-input', 'flow-input', 'updateMeasurements()'];
    }

    row.innerHTML = `
        <td class="border border-rose-500/30 px-4 py-2"><input type="number" class="w-full p-2 border border-rose-500/40 rounded ${pressureClass} bg-slate-800/80 text-slate-200" placeholder="Druck [Pa]" step="0.1" oninput="${updateFunc}"></td>
        <td class="border border-rose-500/30 px-4 py-2"><input type="number" class="w-full p-2 border border-rose-500/40 rounded ${flowClass} bg-slate-800/80 text-slate-200" placeholder="Fluss [m³/h]" step="0.1" oninput="${updateFunc}"></td>
        <td class="border border-rose-500/30 px-4 py-2 text-center"><button onclick="removeRow(this, '${type}')" class="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded hover:from-red-500 hover:to-red-400 transition-all duration-300">Entfernen</button></td>
    `;
    return row;
}

/**
 * Entfernt eine Zeile aus einer Tabelle und aktualisiert die Daten.
 */
window.removeRow = function(button, type) {
    button.closest('tr').remove();
    switch(type) {
        case 'underpressure': updateUnderpressureMeasurements(); break;
        case 'overpressure': updateOverpressureMeasurements(); break;
        default: updateMeasurements();
    }
};

/**
 * Liest die Daten aus einer Messtabelle aus.
 */
window.readTableData = function(pressureSelector, flowSelector, absolute = false) {
    const pressureInputs = document.querySelectorAll(pressureSelector);
    const flowInputs = document.querySelectorAll(flowSelector);
    const data = [];
    for (let i = 0; i < pressureInputs.length; i++) {
        let pressure = parseFloat(pressureInputs[i].value);
        const flow = parseFloat(flowInputs[i].value);
        if (absolute) pressure = Math.abs(pressure);

        if (!isNaN(pressure) && !isNaN(flow) && pressure > 0 && flow > 0) {
            data.push({ x: pressure, y: flow });
        }
    }
    return data;
}

/**
 * Initialisiert das Chart.js-Diagramm.
 */
window.initChart = function() {
    const ctx = document.getElementById('chart');
    if (!ctx) return;
    if (window.chart) window.chart.destroy();

    try {
        window.chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets: [
                { label: 'Theoretische Kurve', data: [], borderColor: 'rgb(244, 114, 182)', backgroundColor: 'rgba(244, 114, 182, 0.1)', showLine: true, pointRadius: 0, borderWidth: 3, tension: 0.1 },
                { label: 'Simulierte Messpunkte', data: [], borderColor: 'rgb(252, 211, 77)', backgroundColor: 'rgba(252, 211, 77, 0.8)', pointRadius: 6, showLine: false },
                { label: 'Reale Messpunkte (Legacy)', data: [], borderColor: 'rgb(52, 211, 153)', backgroundColor: 'rgba(52, 211, 153, 0.8)', pointRadius: 8, showLine: false },
                { label: 'Unterdruckmessungen', data: [], borderColor: 'rgb(248, 113, 113)', backgroundColor: 'rgba(248, 113, 113, 0.8)', pointRadius: 8, showLine: false, pointStyle: 'triangle' },
                { label: 'Überdruckmessungen', data: [], borderColor: 'rgb(196, 181, 253)', backgroundColor: 'rgba(196, 181, 253, 0.8)', pointRadius: 8, showLine: false, pointStyle: 'rect' }
            ]},
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Differenzdruck [Pa]', color: 'rgb(226, 232, 240)' }, min: 0, grid: { color: 'rgba(244, 114, 182, 0.2)' }, ticks: { color: 'rgb(226, 232, 240)' } },
                    y: { title: { display: true, text: 'Volumenstrom [m³/h]', color: 'rgb(226, 232, 240)' }, min: 0, grid: { color: 'rgba(244, 114, 182, 0.2)' }, ticks: { color: 'rgb(226, 232, 240)' } }
                },
                plugins: {
                    title: { display: true, text: 'Blower Door Messung - Druckverlauf', color: 'rgb(244, 114, 182)' },
                    legend: { display: true, position: 'top', labels: { color: 'rgb(226, 232, 240)' } }
                }
            }
        });
        updateChart();
    } catch (error) {
        console.error('Chart konnte nicht initialisiert werden:', error);
        document.getElementById('chart-error')?.classList.remove('hidden');
    }
}

/**
 * Aktualisiert das Diagramm mit den aktuellen Daten.
 */
window.updateChart = function() {
    if (!window.chart) return;

    const n50 = parseFloat(document.getElementById('n50')?.value) || 3.0;
    const volume = parseFloat(document.getElementById('volume')?.value) || 500;
    const maxPressure = parseFloat(document.getElementById('pressure')?.value) || 100;

    const C = (n50 * volume) / Math.pow(50, 0.65);
    const theoreticalData = [];
    for (let p = 10; p <= maxPressure; p += 2) {
        theoreticalData.push({ x: p, y: C * Math.pow(p, 0.65) });
    }

    const simulatedData = [];
    for (let p = 15; p <= maxPressure; p += 15) {
        const baseFlow = C * Math.pow(p, 0.65);
        simulatedData.push({ x: p, y: baseFlow * (1 + (Math.random() - 0.5) * 0.1) });
    }

    chart.data.datasets[0].data = document.getElementById('showTheoretical')?.checked ? theoreticalData : [];
    chart.data.datasets[1].data = document.getElementById('showSimulated')?.checked ? simulatedData : [];
    chart.data.datasets[2].data = document.getElementById('showReal')?.checked ? realMeasurements : [];
    chart.data.datasets[3].data = document.getElementById('showUnderpressure')?.checked ? underpressureMeasurements : [];
    chart.data.datasets[4].data = document.getElementById('showOverpressure')?.checked ? overpressureMeasurements : [];

    const allYValues = chart.data.datasets.flatMap(ds => ds.data.map(d => d.y));
    const maxY = Math.max(0, ...allYValues);
    chart.options.scales.y.max = maxY > 0 ? maxY * 1.1 : 100;
    chart.options.scales.x.max = maxPressure;

    chart.update('none');
}

/**
 * Aktualisiert die berechneten Kennwerte (n50, q50, V50).
 */
function updateCalculations() {
    const n50 = parseFloat(document.getElementById('n50')?.value) || 3.0;
    const volume = parseFloat(document.getElementById('volume')?.value) || 500;
    const hullArea = 2.5 * Math.pow(volume, 2 / 3); // Schätzung
    const v50 = n50 * volume;
    const q50 = v50 / hullArea;

    document.getElementById('calc-n50').textContent = n50.toFixed(1);
    document.getElementById('calc-q50').textContent = q50.toFixed(2);
    document.getElementById('calc-v50').textContent = Math.round(v50);
}

/**
 * Fügt Event-Listener zu den Checkboxen für die Diagramm-Anzeige hinzu.
 */
function addChartCheckboxListeners() {
    const checkboxes = ['showTheoretical', 'showSimulated', 'showReal', 'showUnderpressure', 'showOverpressure'];
    checkboxes.forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateChart);
    });
}
