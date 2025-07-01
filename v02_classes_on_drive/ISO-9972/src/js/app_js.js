// JavaScript für die Blower Door Messprotokoll Anwendung

// Globale Variablen
let chart = null;
let realMeasurements = [];
let underpressureMeasurements = [];
let overpressureMeasurements = [];
let currentSlide = 0;
const totalSlides = 8;

// Navigation zwischen Seiten
function showPage(pageId) {
    // Alle Seiten verstecken
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Gewählte Seite anzeigen
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Chart initialisieren wenn Analyse-Seite geladen wird
    if (pageId === 'analysis') {
        setTimeout(() => {
            if (!chart) {
                initChart();
            } else {
                updateChart();
            }
        }, 100);
    }
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Add active class to selected tab button
    const selectedButton = document.getElementById('tab-' + tabName);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Slide navigation für Protokoll
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlidePosition();
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlidePosition();
    }
}

function updateSlidePosition() {
    const wrapper = document.querySelector('.swipe-wrapper');
    if (wrapper) {
        wrapper.style.transform = `translateY(-${currentSlide * 100}vh)`;
    }

    // Update slide indicator
    const currentSlideElement = document.getElementById('current-slide');
    if (currentSlideElement) {
        currentSlideElement.textContent = currentSlide + 1;
    }
}

// Datum und Zeit Funktionen
function setzeDatum() {
    const datum = prompt("Datum eingeben (TT.MM.JJJJ):");
    if (datum) {
        document.querySelectorAll('.auto-datum').forEach(feld => {
            feld.textContent = datum;
        });
    }
}

function printProtocol() {
    window.print();
}

// Slider-Funktionalität
function initSliders() {
    const n50Slider = document.getElementById('n50');
    const volumeSlider = document.getElementById('volume');
    const pressureSlider = document.getElementById('pressure');

    if (n50Slider) {
        n50Slider.addEventListener('input', function () {
            document.getElementById('n50-value').textContent = this.value;
            updateCalculations();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
            document.getElementById('volume-value').textContent = this.value;
            updateCalculations();
        });
    }

    if (pressureSlider) {
        pressureSlider.addEventListener('input', function () {
            document.getElementById('pressure-value').textContent = this.value;
            updateCalculations();
        });
    }
}

// Messtabellen Initialisierung
function initMeasurementTables() {
    // Initialize underpressure table
    for (let i = 0; i < 5; i++) {
        addUnderpressureRow();
    }

    // Initialize overpressure table
    for (let i = 0; i < 5; i++) {
        addOverpressureRow();
    }

    // Initialize legacy table
    const tableBody = document.getElementById('measurementTable');
    if (tableBody) {
        for (let i = 0; i < 5; i++) {
            addMeasurementRow();
        }
    }

    // Event Listeners für Buttons
    document.getElementById('addMeasurementRow')?.addEventListener('click', addMeasurementRow);
    document.getElementById('clearMeasurements')?.addEventListener('click', clearMeasurements);
}

// Unterdrucktabelle Funktionen
function addUnderpressureRow() {
    const tableBody = document.getElementById('underpressureTable');
    if (!tableBody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="border border-gray-300 px-4 py-2">
            <input type="number" class="w-full p-2 border rounded underpressure-pressure-input" placeholder="z.B. -50" step="0.1">
        </td>
        <td class="border border-gray-300 px-4 py-2">
            <input type="number" class="w-full p-2 border rounded underpressure-flow-input" placeholder="z.B. 1500" step="0.1">
        </td>
        <td class="border border-gray-300 px-4 py-2 text-center">
            <button onclick="removeRow(this)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                Entfernen
            </button>
        </td>
    `;

    tableBody.appendChild(row);

    // Event Listeners für neue Eingabefelder
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateUnderpressureMeasurements);
    });
}

function clearUnderpressure() {
    const tableBody = document.getElementById('underpressureTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    underpressureMeasurements = [];

    // 3 leere Zeilen hinzufügen
    for (let i = 0; i < 3; i++) {
        addUnderpressureRow();
    }

    updateChart();
}

function updateUnderpressureMeasurements() {
    const pressureInputs = document.querySelectorAll('.underpressure-pressure-input');
    const flowInputs = document.querySelectorAll('.underpressure-flow-input');

    underpressureMeasurements = [];

    for (let i = 0; i < pressureInputs.length; i++) {
        const pressure = parseFloat(pressureInputs[i].value);
        const flow = parseFloat(flowInputs[i].value);

        if (!isNaN(pressure) && !isNaN(flow) && Math.abs(pressure) > 0 && flow > 0) {
            underpressureMeasurements.push({ x: Math.abs(pressure), y: flow });
        }
    }

    updateChart();
}

// Überdrucktabelle Funktionen
function addOverpressureRow() {
    const tableBody = document.getElementById('overpressureTable');
    if (!tableBody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="border border-gray-300 px-4 py-2">
            <input type="number" class="w-full p-2 border rounded overpressure-pressure-input" placeholder="z.B. 50" step="0.1">
        </td>
        <td class="border border-gray-300 px-4 py-2">
            <input type="number" class="w-full p-2 border rounded overpressure-flow-input" placeholder="z.B. 1500" step="0.1">
        </td>
        <td class="border border-gray-300 px-4 py-2 text-center">
            <button onclick="removeRow(this)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                Entfernen
            </button>
        </td>
    `;

    tableBody.appendChild(row);

    // Event Listeners für neue Eingabefelder
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateOverpressureMeasurements);
    });
}

function clearOverpressure() {
    const tableBody = document.getElementById('overpressureTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    overpressureMeasurements = [];

    // 3 leere Zeilen hinzufügen
    for (let i = 0; i < 3; i++) {
        addOverpressureRow();
    }

    updateChart();
}

function updateOverpressureMeasurements() {
    const pressureInputs = document.querySelectorAll('.overpressure-pressure-input');
    const flowInputs = document.querySelectorAll('.overpressure-flow-input');

    overpressureMeasurements = [];

    for (let i = 0; i < pressureInputs.length; i++) {
        const pressure = parseFloat(pressureInputs[i].value);
        const flow = parseFloat(flowInputs[i].value);

        if (!isNaN(pressure) && !isNaN(flow) && pressure > 0 && flow > 0) {
            overpressureMeasurements.push({ x: pressure, y: flow });
        }
    }

    updateChart();
}

// Legacy Messtabelle Funktionen
function addMeasurementRow() {
    const tableBody = document.getElementById('measurementTable');
    if (!tableBody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="border border-gray-300 px-4 py-2">
            <input type="number" class="w-full p-2 border rounded pressure-input" placeholder="z.B. 50" step="0.1">
        </td>
        <td class="border border-gray-300 px-4 py-2">
            <input type="number" class="w-full p-2 border rounded flow-input" placeholder="z.B. 1500" step="0.1">
        </td>
        <td class="border border-gray-300 px-4 py-2 text-center">
            <button onclick="removeRow(this)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                Entfernen
            </button>
        </td>
    `;

    tableBody.appendChild(row);

    // Event Listeners für neue Eingabefelder
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', updateMeasurements);
    });
}

function removeRow(button) {
    button.closest('tr').remove();
    updateMeasurements();
    updateUnderpressureMeasurements();
    updateOverpressureMeasurements();
}

function clearMeasurements() {
    const tableBody = document.getElementById('measurementTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    realMeasurements = [];

    // 3 leere Zeilen hinzufügen
    for (let i = 0; i < 3; i++) {
        addMeasurementRow();
    }

    updateChart();
}

function updateMeasurements() {
    const pressureInputs = document.querySelectorAll('.pressure-input');
    const flowInputs = document.querySelectorAll('.flow-input');

    realMeasurements = [];

    for (let i = 0; i < pressureInputs.length; i++) {
        const pressure = parseFloat(pressureInputs[i].value);
        const flow = parseFloat(flowInputs[i].value);

        if (!isNaN(pressure) && !isNaN(flow) && pressure > 0 && flow > 0) {
            realMeasurements.push({ x: pressure, y: flow });
        }
    }

    updateChart();
}

// Chart-Funktionen
function initChart() {
    const ctx = document.getElementById('chart');
    if (!ctx) {
        console.warn('Chart-Element nicht gefunden');
        return;
    }

    // Wenn Chart bereits existiert, zerstören
    if (chart) {
        chart.destroy();
        chart = null;
    }

    try {
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Theoretische Kurve',
                        data: [],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 3,
                        tension: 0.1
                    },
                    {
                        label: 'Simulierte Messpunkte',
                        data: [],
                        borderColor: 'rgb(245, 158, 11)',
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        pointRadius: 6,
                        showLine: false
                    },
                    {
                        label: 'Reale Messpunkte (Legacy)',
                        data: [],
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        pointRadius: 8,
                        showLine: false
                    },
                    {
                        label: 'Unterdruckmessungen',
                        data: [],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        pointRadius: 8,
                        showLine: false,
                        pointStyle: 'triangle'
                    },
                    {
                        label: 'Überdruckmessungen',
                        data: [],
                        borderColor: 'rgb(168, 85, 247)',
                        backgroundColor: 'rgba(168, 85, 247, 0.8)',
                        pointRadius: 8,
                        showLine: false,
                        pointStyle: 'rect'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Differenzdruck [Pa]'
                        },
                        min: 0,
                        max: 100
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Volumenstrom [m³/h]'
                        },
                        min: 0
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Blower Door Messung - Druckverlauf (Unter- und Überdruck)'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });

        console.log('Chart erfolgreich initialisiert');
        updateChart();

    } catch (error) {
        console.error('Chart konnte nicht initialisiert werden:', error);
        const errorElement = document.getElementById('chart-error');
        if (errorElement) {
            errorElement.classList.remove('hidden');
        }
    }
}

function updateChart() {
    if (!chart) return;

    // Sichere Werte-Extraktion mit Fallback
    const n50Element = document.getElementById('n50');
    const volumeElement = document.getElementById('volume');
    const pressureElement = document.getElementById('pressure');

    const n50 = n50Element ? parseFloat(n50Element.value) : 3.0;
    const volume = volumeElement ? parseFloat(volumeElement.value) : 500;
    const maxPressure = pressureElement ? parseFloat(pressureElement.value) : 100;

    // Theoretische Kurve berechnen
    const theoreticalData = [];
    const C = (n50 * volume) / Math.pow(50, 0.65); // Konstante C

    for (let p = 10; p <= maxPressure; p += 2) {
        const flow = C * Math.pow(p, 0.65);
        theoreticalData.push({ x: p, y: flow });
    }

    // Simulierte Messpunkte
    const simulatedData = [];
    for (let p = 15; p <= maxPressure; p += 15) {
        const baseFlow = C * Math.pow(p, 0.65);
        // Zufällige Abweichung ±5%
        const deviation = (Math.random() - 0.5) * 0.1;
        const flow = baseFlow * (1 + deviation);
        simulatedData.push({ x: p, y: flow });
    }

    // Chart-Daten aktualisieren - Sichere Checkbox-Abfrage
    const showTheoreticalElement = document.getElementById('showTheoretical');
    const showSimulatedElement = document.getElementById('showSimulated');
    const showRealElement = document.getElementById('showReal');
    const showUnderpressureElement = document.getElementById('showUnderpressure');
    const showOverpressureElement = document.getElementById('showOverpressure');

    const showTheoretical = showTheoreticalElement ? showTheoreticalElement.checked : true;
    const showSimulated = showSimulatedElement ? showSimulatedElement.checked : false;
    const showReal = showRealElement ? showRealElement.checked : true;
    const showUnderpressure = showUnderpressureElement ? showUnderpressureElement.checked : true;
    const showOverpressure = showOverpressureElement ? showOverpressureElement.checked : true;

    chart.data.datasets[0].data = showTheoretical ? theoreticalData : [];
    chart.data.datasets[1].data = showSimulated ? simulatedData : [];
    chart.data.datasets[2].data = showReal ? realMeasurements : [];
    chart.data.datasets[3].data = showUnderpressure ? underpressureMeasurements : [];
    chart.data.datasets[4].data = showOverpressure ? overpressureMeasurements : [];

    // Y-Achse dynamisch anpassen
    const allData = [
        ...theoreticalData.map(d => d.y),
        ...simulatedData.map(d => d.y),
        ...realMeasurements.map(d => d.y || 0),
        ...underpressureMeasurements.map(d => d.y || 0),
        ...overpressureMeasurements.map(d => d.y || 0)
    ];
    const maxY = Math.max(...allData);
    chart.options.scales.y.max = maxY * 1.1;

    chart.update('none'); // 'none' für bessere Performance

    updateCalculations();
}

function updateCalculations() {
    // Sichere Element-Abfrage
    const n50Element = document.getElementById('n50');
    const volumeElement = document.getElementById('volume');

    const n50 = n50Element ? parseFloat(n50Element.value) : 3.0;
    const volume = volumeElement ? parseFloat(volumeElement.value) : 500;

    // Angenommene Hüllfläche (vereinfacht als 2.5 * Volumen^(2/3))
    const hullArea = 2.5 * Math.pow(volume, 2 / 3);

    // V50 berechnen
    const v50 = n50 * volume;

    // q50 berechnen
    const q50 = v50 / hullArea;

    // Werte anzeigen - Sichere Element-Abfrage
    const calcN50Element = document.getElementById('calc-n50');
    const calcQ50Element = document.getElementById('calc-q50');
    const calcV50Element = document.getElementById('calc-v50');

    if (calcN50Element) calcN50Element.textContent = n50.toFixed(1);
    if (calcQ50Element) calcQ50Element.textContent = q50.toFixed(2);
    if (calcV50Element) calcV50Element.textContent = Math.round(v50);
}

// Event Listeners und Initialisierung
document.addEventListener('DOMContentLoaded', function () {
    // Datum und Zeit setzen
    const heute = new Date();
    const deutschesDatum = heute.toLocaleDateString('de-DE');
    const aktuelleZeit = heute.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Alle Datumsfelder füllen
    const datumsfelder = document.querySelectorAll('.auto-datum');
    datumsfelder.forEach(feld => {
        feld.textContent = deutschesDatum;
    });

    // Alle Uhrzeitfelder füllen
    const uhrzeitfelder = document.querySelectorAll('.auto-uhrzeit');
    uhrzeitfelder.forEach(feld => {
        feld.textContent = aktuelleZeit;
    });

    // Messtabellen initialisieren
    initMeasurementTables();

    // Event Listeners für Slider
    initSliders();

    // Event Listeners für Checkboxen
    const checkboxes = ['showTheoretical', 'showSimulated', 'showReal', 'showUnderpressure', 'showOverpressure'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function () {
                if (chart) {
                    updateChart();
                }
            });
        }
    });

    // Keyboard Navigation für Protokoll-Seiten
    document.addEventListener('keydown', function(e) {
        const protocolPage = document.getElementById('protocol');
        if (protocolPage && protocolPage.classList.contains('active')) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                previousSlide();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });

    // Initial Chart Setup wenn auf Analyse-Seite
    setTimeout(() => {
        const analysisPage = document.getElementById('analysis');
        if (analysisPage && analysisPage.classList.contains('active')) {
            initChart();
        }
    }, 500);

    console.log('Blower Door Anwendung initialisiert');
});