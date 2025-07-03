

// =================================================================
// measurement.js - Messdatenerfassung und Chart
// =================================================================

// Globale Variablen
window.chart = null;
let realMeasurements = [];
let underpressureMeasurements = [];
let overpressureMeasurements = [];

/**
 * Initialisiert die Messseite
 */
window.initMeasurementPage = function() {
    console.log("Initialisiere Messseite...");
    
    initSliders();
    initMeasurementTables();
    addChartCheckboxListeners();
    updateCalculations();
}

/**
 * Initialisiert die Slider
 */
function initSliders() {
    const sliders = {
        'n50': 'n50-value',
        'volume': 'volume-value',
        'pressure': 'pressure-value'
    };

    Object.entries(sliders).forEach(([sliderId, valueId]) => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        if (slider && valueDisplay) {
            // Initialwert setzen
            valueDisplay.textContent = slider.value;
            
            // Event Listener
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
                updateCalculations();
                if (window.chart) updateChart();
            });
        }
    });
}

/**
 * Initialisiert die Messtabellen
 */
function initMeasurementTables() {
    // Tabellen leeren
    const tables = ['underpressureTable', 'overpressureTable', 'measurementTable'];
    tables.forEach(tableId => {
        const table = document.getElementById(tableId);
        if (table) table.innerHTML = '';
    });

    // Standardzeilen hinzufügen
    for (let i = 0; i < 5; i++) {
        addUnderpressureRow();
        addOverpressureRow();
        addMeasurementRow();
    }
}

// Unterdruck-Tabelle
window.addUnderpressureRow = function() {
    const tableBody = document.getElementById('underpressureTable');
    if (tableBody) {
        tableBody.appendChild(createMeasurementRow('underpressure'));
    }
};

window.clearUnderpressure = function() {
    const tableBody = document.getElementById('underpressureTable');
    if (tableBody) {
        tableBody.innerHTML = '';
        underpressureMeasurements = [];
        
        // Neue Zeilen hinzufügen
        for (let i = 0; i < 3; i++) {
            addUnderpressureRow();
        }
        
        if (window.chart) updateChart();
    }
};

// Überdruck-Tabelle
window.addOverpressureRow = function() {
    const tableBody = document.getElementById('overpressureTable');
    if (tableBody) {
        tableBody.appendChild(createMeasurementRow('overpressure'));
    }
};

window.clearOverpressure = function() {
    const tableBody = document.getElementById('overpressureTable');
    if (tableBody) {
        tableBody.innerHTML = '';
        overpressureMeasurements = [];
        
        for (let i = 0; i < 3; i++) {
            addOverpressureRow();
        }
        
        if (window.chart) updateChart();
    }
};

// Legacy-Tabelle
window.addMeasurementRow = function() {
    const tableBody = document.getElementById('measurementTable');
    if (tableBody) {
        tableBody.appendChild(createMeasurementRow('legacy'));
    }
};

window.clearMeasurements = function() {
    const tableBody = document.getElementById('measurementTable');
    if (tableBody) {
        tableBody.innerHTML = '';
        realMeasurements = [];
        
        for (let i = 0; i < 3; i++) {
            addMeasurementRow();
        }
        
        if (window.chart) updateChart();
    }
};

/**
 * Erstellt eine neue Tabellenzeile
 */
function createMeasurementRow(type) {
    const row = document.createElement('tr');
    
    const config = {
        'underpressure': {
            pressureClass: 'underpressure-pressure-input',
            flowClass: 'underpressure-flow-input',
            updateFunc: 'updateUnderpressureMeasurements()'
        },
        'overpressure': {
            pressureClass: 'overpressure-pressure-input',
            flowClass: 'overpressure-flow-input',
            updateFunc: 'updateOverpressureMeasurements()'
        },
        'legacy': {
            pressureClass: 'pressure-input',
            flowClass: 'flow-input',
            updateFunc: 'updateMeasurements()'
        }
    };

    const { pressureClass, flowClass, updateFunc } = config[type];

    row.innerHTML = `
        <td class="border border-rose-500/30 px-4 py-2">
            <input type="number" 
                   class="w-full p-2 border border-rose-500/40 rounded ${pressureClass} bg-slate-800/80 text-slate-200" 
                   placeholder="Druck [Pa]" 
                   step="0.1" 
                   oninput="${updateFunc}">
        </td>
        <td class="border border-rose-500/30 px-4 py-2">
            <input type="number" 
                   class="w-full p-2 border border-rose-500/40 rounded ${flowClass} bg-slate-800/80 text-slate-200" 
                   placeholder="Fluss [m³/h]" 
                   step="0.1" 
                   oninput="${updateFunc}">
        </td>
        <td class="border border-rose-500/30 px-4 py-2 text-center">
            <button onclick="removeRow(this, '${type}')" 
                    class="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded hover:from-red-500 hover:to-red-400 transition-all duration-300">
                Entfernen
            </button>
        </td>
    `;

    return row;
}

/**
 * Entfernt eine Tabellenzeile
 */
window.removeRow = function(button, type) {
    const row = button.closest('tr');
    if (row) {
        row.remove();
        
        // Entsprechende Update-Funktion aufrufen
        switch(type) {
            case 'underpressure':
                updateUnderpressureMeasurements();
                break;
            case 'overpressure':
                updateOverpressureMeasurements();
                break;
            default:
                updateMeasurements();
        }
    }
};

/**
 * Update-Funktionen für die verschiedenen Messtypen
 */
window.updateUnderpressureMeasurements = function() {
    underpressureMeasurements = readTableData('.underpressure-pressure-input', '.underpressure-flow-input', true);
    if (window.chart) updateChart();
};

window.updateOverpressureMeasurements = function() {
    overpressureMeasurements = readTableData('.overpressure-pressure-input', '.overpressure-flow-input');
    if (window.chart) updateChart();
};

window.updateMeasurements = function() {
    realMeasurements = readTableData('.pressure-input', '.flow-input');
    if (window.chart) updateChart();
};

/**
 * Liest Daten aus einer Tabelle
 */
window.readTableData = function(pressureSelector, flowSelector, absolute = false) {
    const pressureInputs = document.querySelectorAll(pressureSelector);
    const flowInputs = document.querySelectorAll(flowSelector);
    const data = [];

    for (let i = 0; i < pressureInputs.length; i++) {
        let pressure = parseFloat(pressureInputs[i].value);
        const flow = parseFloat(flowInputs[i].value);
        
        if (absolute) {
            pressure = Math.abs(pressure);
        }

        if (!isNaN(pressure) && !isNaN(flow) && pressure > 0 && flow > 0) {
            data.push({ x: pressure, y: flow });
        }
    }

    return data;
}

/**
 * Initialisiert das Chart
 */
window.initChart = function() {
    const ctx = document.getElementById('chart');
    if (!ctx) {
        console.error('Chart-Element nicht gefunden');
        return;
    }

    // Vorhandenes Chart zerstören
    if (window.chart) {
        window.chart.destroy();
    }

    try {
        window.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Theoretische Kurve',
                        data: [],
                        borderColor: 'rgb(244, 114, 182)',
                        backgroundColor: 'rgba(244, 114, 182, 0.1)',
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 3,
                        tension: 0.1
                    },
                    {
                        label: 'Simulierte Messpunkte',
                        data: [],
                        borderColor: 'rgb(252, 211, 77)',
                        backgroundColor: 'rgba(252, 211, 77, 0.8)',
                        pointRadius: 6,
                        showLine: false
                    },
                    {
                        label: 'Reale Messpunkte (Legacy)',
                        data: [],
                        borderColor: 'rgb(52, 211, 153)',
                        backgroundColor: 'rgba(52, 211, 153, 0.8)',
                        pointRadius: 8,
                        showLine: false
                    },
                    {
                        label: 'Unterdruckmessungen',
                        data: [],
                        borderColor: 'rgb(248, 113, 113)',
                        backgroundColor: 'rgba(248, 113, 113, 0.8)',
                        pointRadius: 8,
                        showLine: false,
                        pointStyle: 'triangle'
                    },
                    {
                        label: 'Überdruckmessungen',
                        data: [],
                        borderColor: 'rgb(196, 181, 253)',
                        backgroundColor: 'rgba(196, 181, 253, 0.8)',
                        pointRadius: 8,
                        showLine: false,
                        pointStyle: 'rect'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Differenzdruck [Pa]',
                            color: 'rgb(226, 232, 240)'
                        },
                        min: 0,
                        grid: {
                            color: 'rgba(244, 114, 182, 0.2)'
                        },
                        ticks: {
                            color: 'rgb(226, 232, 240)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Volumenstrom [m³/h]',
                            color: 'rgb(226, 232, 240)'
                        },
                        min: 0,
                        grid: {
                            color: 'rgba(244, 114, 182, 0.2)'
                        },
                        ticks: {
                            color: 'rgb(226, 232, 240)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Blower Door Messung - Druckverlauf',
                        color: 'rgb(244, 114, 182)'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgb(226, 232, 240)'
                        }
                    }
                }
            }
        });

        updateChart();
    } catch (error) {
        console.error('Chart konnte nicht initialisiert werden:', error);
        const errorElement = document.getElementById('chart-error');
        if (errorElement) {
            errorElement.classList.remove('hidden');
        }
    }
}

/**
 * Aktualisiert das Chart
 */
window.updateChart = function() {
    if (!window.chart) return;

    const n50 = parseFloat(document.getElementById('n50')?.value) || 3.0;
    const volume = parseFloat(document.getElementById('volume')?.value) || 500;
    const maxPressure = parseFloat(document.getElementById('pressure')?.value) || 100;

    // Berechnung der theoretischen Kurve
    const C = (n50 * volume) / Math.pow(50, 0.65);
    const theoreticalData = [];
    
    for (let p = 10; p <= maxPressure; p += 2) {
        theoreticalData.push({ x: p, y: C * Math.pow(p, 0.65) });
    }

    // Simulierte Daten
    const simulatedData = [];
    for (let p = 15; p <= maxPressure; p += 15) {
        const baseFlow = C * Math.pow(p, 0.65);
        const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
        simulatedData.push({ x: p, y: baseFlow * randomFactor });
    }

    // Checkboxen prüfen und entsprechende Daten setzen
    const checkboxes = {
        'showTheoretical': 0,
        'showSimulated': 1,
        'showReal': 2,
        'showUnderpressure': 3,
        'showOverpressure': 4
    };

    Object.entries(checkboxes).forEach(([checkboxId, datasetIndex]) => {
        const checkbox = document.getElementById(checkboxId);
        let data = [];
        
        if (checkbox && checkbox.checked) {
            switch (datasetIndex) {
                case 0: data = theoreticalData; break;
                case 1: data = simulatedData; break;
                case 2: data = realMeasurements; break;
                case 3: data = underpressureMeasurements; break;
                case 4: data = overpressureMeasurements; break;
            }
        }
        
        window.chart.data.datasets[datasetIndex].data = data;
    });

    // Achsen-Skalierung anpassen
    const allYValues = window.chart.data.datasets
        .flatMap(dataset => dataset.data.map(point => point.y))
        .filter(y => y > 0);
    
    const maxY = Math.max(...allYValues, 0);
    window.chart.options.scales.y.max = maxY > 0 ? maxY * 1.1 : 100;
    window.chart.options.scales.x.max = maxPressure;

    window.chart.update('none');
}

/**
 * Aktualisiert die Berechnungen
 */
function updateCalculations() {
    const n50 = parseFloat(document.getElementById('n50')?.value) || 3.0;
    const volume = parseFloat(document.getElementById('volume')?.value) || 500;
    
    // Geschätzte Hüllfläche (vereinfachte Formel)
    const hullArea = 2.5 * Math.pow(volume, 2/3);
    
    const v50 = n50 * volume;
    const q50 = v50 / hullArea;

    // Werte in UI aktualisieren
    const elements = {
        'calc-n50': n50.toFixed(1),
        'calc-q50': q50.toFixed(2),
        'calc-v50': Math.round(v50).toString()
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

/**
 * Fügt Event-Listener zu Chart-Checkboxen hinzu
 */
function addChartCheckboxListeners() {
    const checkboxes = [
        'showTheoretical', 
        'showSimulated', 
        'showReal', 
        'showUnderpressure', 
        'showOverpressure'
    ];

    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', updateChart);
        }
    });
}