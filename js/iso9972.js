/**
 * ISO 9972 - Luftdurchlässigkeitsmessung
 * Interactive Chart Application
 * Version: 1.0
 */

// Konstanten
const FLOW_EXPONENT = 0.65;
const REFERENCE_PRESSURE = 50;
const CHART_UPDATE_DELAY = 100;
const MAX_MEASUREMENT_ROWS = 20;

// Globale Variablen
let chart;
let isDarkMode = false;
let realMeasurements = [];
let updateTimeout;

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showError(message) {
    console.error(message);
    const errorDiv = document.getElementById('chart-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
}

function validateNumericInput(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Theme Functions
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.getElementById('theme-icon').textContent = isDarkMode ? '☀️' : '🌙';

    if (chart) {
        updateChartTheme();
    }
}

function updateChartTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#4b5563' : '#e5e7eb';

    try {
        chart.options.plugins.legend.labels.color = textColor;
        chart.options.scales.x.title.color = textColor;
        chart.options.scales.y.title.color = textColor;
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.y.ticks.color = textColor;
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.y.grid.color = gridColor;

        chart.update('none');
    } catch (error) {
        showError('Fehler beim Aktualisieren des Chart-Themes: ' + error.message);
    }
}

// Calculation Functions
function calculateData(n50, volume, maxPressure) {
    try {
        const theoreticalData = [];
        const simulatedPoints = [];
        const C = (n50 * volume) / Math.pow(REFERENCE_PRESSURE, FLOW_EXPONENT);

        // Theoretische Kurve
        for (let pressure = 10; pressure <= maxPressure; pressure += 2) {
            const volumeFlow = C * Math.pow(pressure, FLOW_EXPONENT);
            theoreticalData.push({
                x: pressure,
                y: Math.round(volumeFlow * 10) / 10
            });
        }

        // Simulierte Messpunkte mit realistischen Abweichungen
        const testPressures = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        testPressures.forEach(pressure => {
            if (pressure <= maxPressure) {
                const theoreticalFlow = C * Math.pow(pressure, FLOW_EXPONENT);
                const deviation = (Math.random() - 0.5) * 0.1; // ±5% Abweichung
                const actualFlow = theoreticalFlow * (1 + deviation);

                simulatedPoints.push({
                    x: pressure,
                    y: Math.round(actualFlow * 10) / 10
                });
            }
        });

        return { theoreticalData, simulatedPoints, C };
    } catch (error) {
        showError('Fehler bei der Berechnung: ' + error.message);
        return { theoreticalData: [], simulatedPoints: [], C: 0 };
    }
}

// Measurement Table Functions
function addMeasurementRow(pressure = '', flow = '') {
    const table = document.getElementById('measurementTable');
    const currentRows = table.querySelectorAll('.measurement-row').length;
    
    if (currentRows >= MAX_MEASUREMENT_ROWS) {
        alert(`Maximal ${MAX_MEASUREMENT_ROWS} Messpunkte sind erlaubt.`);
        return;
    }

    const row = document.createElement('tr');
    row.className = 'measurement-row border-b border-gray-200 dark:border-gray-600';
    
    const rowId = 'row_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    row.id = rowId;
    
    row.innerHTML = `
        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
            <input type="number" 
                   class="measurement-input w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-200"
                   placeholder="z.B. 50" 
                   min="0" 
                   max="200" 
                   step="1"
                   value="${pressure}"
                   aria-label="Differenzdruck eingeben"
                   onchange="debouncedValidateAndUpdate()"
                   oninput="this.classList.remove('border-red-500')">
        </td>
        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
            <input type="number" 
                   class="measurement-input w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-800 dark:text-gray-200"
                   placeholder="z.B. 1500" 
                   min="0" 
                   step="0.1"
                   value="${flow}"
                   aria-label="Volumenstrom eingeben"
                   onchange="debouncedValidateAndUpdate()"
                   oninput="this.classList.remove('border-red-500')">
        </td>
        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
            <button onclick="removeMeasurementRow('${rowId}')" 
                    class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm"
                    aria-label="Diese Zeile löschen">
                Löschen
            </button>
        </td>
    `;
    
    table.appendChild(row);
}

function removeMeasurementRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        debouncedValidateAndUpdate();
    }
}

function clearAllMeasurements() {
    if (confirm('Möchten Sie wirklich alle Messpunkte löschen?')) {
        const table = document.getElementById('measurementTable');
        table.innerHTML = '';
        realMeasurements = [];
        updateChart();
    }
}

function validateAndUpdateMeasurements() {
    const rows = document.querySelectorAll('.measurement-row');
    realMeasurements = [];
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[type="number"]');
        const pressureInput = inputs[0];
        const flowInput = inputs[1];
        
        const pressure = parseFloat(pressureInput.value);
        const flow = parseFloat(flowInput.value);
        
        // Reset validation styling
        pressureInput.classList.remove('border-red-500');
        flowInput.classList.remove('border-red-500');
        
        // Validate and add to realMeasurements if both values are present and valid
        if (pressureInput.value !== '' && flowInput.value !== '') {
            if (validateNumericInput(pressure, 0, 200) && validateNumericInput(flow, 0)) {
                realMeasurements.push({
                    x: pressure,
                    y: flow
                });
            } else {
                // Mark invalid inputs
                if (!validateNumericInput(pressure, 0, 200)) {
                    pressureInput.classList.add('border-red-500');
                }
                if (!validateNumericInput(flow, 0)) {
                    flowInput.classList.add('border-red-500');
                }
            }
        }
    });
    
    updateChart();
}

// Debounced function
const debouncedValidateAndUpdate = debounce(validateAndUpdateMeasurements, 300);

// Chart Functions
function updateChart() {
    if (!chart) return;

    try {
        const n50 = parseFloat(document.getElementById('n50').value);
        const volume = parseInt(document.getElementById('volume').value);
        const maxPressure = parseInt(document.getElementById('pressure').value);
        
        const showTheoretical = document.getElementById('showTheoretical').checked;
        const showSimulated = document.getElementById('showSimulated').checked;
        const showReal = document.getElementById('showReal').checked;

        const { theoreticalData, simulatedPoints, C } = calculateData(n50, volume, maxPressure);

        // Berechnete Werte aktualisieren
        const v50 = Math.round(C * Math.pow(REFERENCE_PRESSURE, FLOW_EXPONENT));
        const q50 = Math.round((v50 / (volume * 2.5)) * 100) / 100; // Vereinfachte q50-Berechnung

        document.getElementById('calc-n50').textContent = n50.toFixed(1);
        document.getElementById('calc-q50').textContent = q50.toFixed(2);
        document.getElementById('calc-v50').textContent = v50;

        // Chart datasets
        const datasets = [];

        if (showTheoretical) {
            datasets.push({
                label: 'Theoretische Kurve',
                data: theoreticalData,
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.4,
                fill: false
            });
        }

        if (showSimulated) {
            datasets.push({
                label: 'Simulierte Messpunkte',
                data: simulatedPoints,
                borderColor: '#f59e0b',
                backgroundColor: '#f59e0b',
                pointRadius: 6,
                pointHoverRadius: 8,
                showLine: false
            });
        }

        if (showReal && realMeasurements.length > 0) {
            datasets.push({
                label: 'Reale Messpunkte',
                data: realMeasurements,
                borderColor: '#10b981',
                backgroundColor: '#10b981',
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false,
                pointStyle: 'rectRot'
            });
        }

        chart.data.datasets = datasets;
        chart.update('none');

    } catch (error) {
        showError('Fehler beim Aktualisieren des Charts: ' + error.message);
    }
}

function initChart() {
    try {
        const ctx = document.getElementById('chart').getContext('2d');
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#e5e7eb' : '#374151';
        const gridColor = isDark ? '#4b5563' : '#e5e7eb';

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} m³/h bei ${context.parsed.x} Pa`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Differenzdruck [Pa]',
                            color: textColor,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor,
                            lineWidth: 1
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 12
                            }
                        },
                        min: 0,
                        max: 100
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Volumenstrom [m³/h]',
                            color: textColor,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: gridColor,
                            lineWidth: 1
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 12
                            }
                        },
                        min: 0
                    }
                }
            }
        });

        updateChart();
    } catch (error) {
        showError('Fehler beim Initialisieren des Charts: ' + error.message);
    }
}

// Event Handlers
function updateSliderValue(sliderId, displayId) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    
    if (slider && display) {
        display.textContent = slider.value;
        if (chart) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updateChart, CHART_UPDATE_DELAY);
        }
    }
}

// Keyboard event handler for adding rows
function handleKeyDown(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        addMeasurementRow();
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);

        // Slider event listeners
        document.getElementById('n50').addEventListener('input', () => updateSliderValue('n50', 'n50-value'));
        document.getElementById('volume').addEventListener('input', () => updateSliderValue('volume', 'volume-value'));
        document.getElementById('pressure').addEventListener('input', () => updateSliderValue('pressure', 'pressure-value'));

        // Checkbox event listeners
        document.getElementById('showTheoretical').addEventListener('change', updateChart);
        document.getElementById('showSimulated').addEventListener('change', updateChart);
        document.getElementById('showReal').addEventListener('change', updateChart);

        // Button event listeners
        document.getElementById('addMeasurementRow').addEventListener('click', () => addMeasurementRow());
        document.getElementById('clearMeasurements').addEventListener('click', clearAllMeasurements);

        // Keyboard event listener
        document.addEventListener('keydown', handleKeyDown);

        // Initialize chart
        initChart();

        // Add initial measurement rows
        for (let i = 0; i < 3; i++) {
            addMeasurementRow();
        }

        // Set initial slider values
        updateSliderValue('n50', 'n50-value');
        updateSliderValue('volume', 'volume-value');
        updateSliderValue('pressure', 'pressure-value');

    } catch (error) {
        showError('Fehler beim Initialisieren der Anwendung: ' + error.message);
    }
});