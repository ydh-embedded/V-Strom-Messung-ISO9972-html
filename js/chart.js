// =================================================================
// Erstellt: 2025-07-04
// 
// 📊 chart.js - Blower-Door Chart System für protocol.html
//
// Chart.js Integration: Erstellt Blower-Door Diagramme
// Theoretische Kurven: Berechnung mit Potenzfunktion V = C × ΔP^n
// Simulierte Daten: Generierung realistischer Testdaten
// Messdaten-Visualisierung: Unter-/Überdruck-Darstellung
// Export-Funktionen: PNG-Download der Diagramme
// SessionStorage Transfer: Datenübertragung zwischen Seiten
//
//
// =================================================================
// Globale Chart-Variablen
let blowerDoorChart = null;
let chartData = {
    parameters: {
        n50: 3.0,
        volume: 500,
        pressure: 100
    },
    measurements: {
        underpressure: [
            { pressure: -10, volume: 850 },
            { pressure: -20, volume: 1200 },
            { pressure: -30, volume: 1480 },
            { pressure: -40, volume: 1720 },
            { pressure: -50, volume: 1950 }
        ],
        overpressure: [
            { pressure: 10, volume: 820 },
            { pressure: 20, volume: 1150 },
            { pressure: 30, volume: 1420 },
            { pressure: 40, volume: 1680 },
            { pressure: 50, volume: 1920 }
        ]
    }
};

/**
 * Berechnet die theoretische Kurve basierend auf der Potenzfunktion
 * V = C × ΔP^n, wobei n ≈ 0,65 für turbulente Strömung
 */
function calculateTheoreticalCurve(n50, volume, maxPressure = 100) {
    const curve = [];
    const C = (n50 * volume) / Math.pow(50, 0.65); // Koeffizient aus 50 Pa Referenz
    
    for (let pressure = 10; pressure <= maxPressure; pressure += 5) {
        const volumeFlow = C * Math.pow(pressure, 0.65);
        curve.push({ pressure, volume: volumeFlow });
        curve.push({ pressure: -pressure, volume: volumeFlow });
    }
    
    return curve.sort((a, b) => a.pressure - b.pressure);
}

/**
 * Generiert simulierte Messpunkte mit realistischen Variationen
 */
function generateSimulatedPoints(n50, volume, maxPressure = 100) {
    const points = [];
    const C = (n50 * volume) / Math.pow(50, 0.65);
    
    // Unterdruck-Simulationen
    for (let pressure = 10; pressure <= maxPressure; pressure += 10) {
        const theoreticalVolume = C * Math.pow(pressure, 0.65);
        const variation = theoreticalVolume * (0.02 + Math.random() * 0.06); // 2-8% Variation
        const actualVolume = theoreticalVolume + (Math.random() - 0.5) * variation;
        points.push({ pressure: -pressure, volume: Math.max(0, actualVolume) });
    }
    
    // Überdruck-Simulationen
    for (let pressure = 10; pressure <= maxPressure; pressure += 10) {
        const theoreticalVolume = C * Math.pow(pressure, 0.65);
        const variation = theoreticalVolume * (0.02 + Math.random() * 0.06);
        const actualVolume = theoreticalVolume + (Math.random() - 0.5) * variation;
        points.push({ pressure: pressure, volume: Math.max(0, actualVolume) });
    }
    
    return points;
}

/**
 * Erstellt oder aktualisiert das Blower-Door Chart
 */
function createOrUpdateChart() {
    const ctx = document.getElementById('blowerDoorChart');
    if (!ctx) {
        console.error('❌ Chart-Canvas nicht gefunden!');
        return;
    }
    
    // Bestehende Chart zerstören
    if (blowerDoorChart) {
        blowerDoorChart.destroy();
    }

    // Daten vorbereiten
    const theoreticalCurve = calculateTheoreticalCurve(
        chartData.parameters.n50,
        chartData.parameters.volume,
        chartData.parameters.pressure
    );
    
    const simulatedPoints = generateSimulatedPoints(
        chartData.parameters.n50,
        chartData.parameters.volume,
        chartData.parameters.pressure
    );

    // Chart erstellen
    blowerDoorChart = new Chart(ctx.getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Theoretische Kurve',
                    data: theoreticalCurve.map(p => ({ x: p.pressure, y: p.volume })),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgb(255, 255, 255)',
                    type: 'line',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2
                },
                {
                    label: 'Simulierte Punkte',
                    data: simulatedPoints.map(p => ({ x: p.pressure, y: p.volume })),
                    borderColor: '#f59e0b',
                    backgroundColor: '#f59e0b',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Unterdruckmessungen',
                    data: chartData.measurements.underpressure.map(p => ({ x: p.pressure, y: p.volume })),
                    borderColor: '#ef4444',
                    backgroundColor: '#ef4444',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointStyle: 'circle'
                },
                {
                    label: 'Überdruckmessungen',
                    data: chartData.measurements.overpressure.map(p => ({ x: p.pressure, y: p.volume })),
                    borderColor: '#22c55e',
                    backgroundColor: '#22c55e',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointStyle: 'circle'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    display: false // Wir verwenden unsere eigene Legende
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Druck: ${context[0].parsed.x} Pa`;
                        },
                        label: function(context) {
                            return `${context.dataset.label}: ${Math.round(context.parsed.y)} m³/h`;
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
                        color: '#e2e8f0',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e2e8f0'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Volumenstrom [m³/h]',
                        color: '#e2e8f0',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e2e8f0'
                    }
                }
            }
        }
    });

    // Ergebniswerte aktualisieren
    updateResultValues();
    
    console.log('📊 Blower-Door Chart erstellt/aktualisiert');
}

/**
 * Aktualisiert die Ergebniswerte in der UI
 */
function updateResultValues() {
    const n50 = chartData.parameters.n50;
    const volume = chartData.parameters.volume;
    const q50 = (n50 * 2.68).toFixed(2); // Vereinfachte Berechnung für q₅₀
    const v50 = (n50 * volume).toFixed(0);

    // Werte in den result-cards aktualisieren
    document.querySelectorAll('[data-transfer="n50"]').forEach(el => {
        el.textContent = n50;
    });
    document.querySelectorAll('[data-transfer="q50"]').forEach(el => {
        el.textContent = q50;
    });
    document.querySelectorAll('[data-transfer="v50"]').forEach(el => {
        el.textContent = v50;
    });
    document.querySelectorAll('[data-transfer="volume"]').forEach(el => {
        el.textContent = volume;
    });
    document.querySelectorAll('[data-transfer="pressure"]').forEach(el => {
        el.textContent = chartData.parameters.pressure;
    });
    
    console.log(`📊 Ergebniswerte aktualisiert: n₅₀=${n50}, q₅₀=${q50}, V₅₀=${v50}`);
}

/**
 * Erstellt ein Test-Diagramm mit Beispieldaten
 */
function createTestChart() {
    console.log('🧪 Erstelle Test-Diagramm...');
    
    // Zufällige Testparameter generieren
    chartData.parameters.n50 = 1.5 + Math.random() * 2.5; // 1.5-4.0
    chartData.parameters.volume = 300 + Math.random() * 400; // 300-700
    chartData.parameters.pressure = 80 + Math.random() * 40; // 80-120
    
    // Neue Messdaten generieren
    const newUnderpressure = [];
    const newOverpressure = [];
    
    for (let i = 1; i <= 5; i++) {
        const pressure = i * 10;
        const baseVolume = 600 + (i * 250) + (Math.random() - 0.5) * 100;
        
        newUnderpressure.push({
            pressure: -pressure,
            volume: Math.round(baseVolume * 0.95) // Leicht niedrigere Werte für Unterdruck
        });
        
        newOverpressure.push({
            pressure: pressure,
            volume: Math.round(baseVolume * 1.05) // Leicht höhere Werte für Überdruck
        });
    }
    
    chartData.measurements.underpressure = newUnderpressure;
    chartData.measurements.overpressure = newOverpressure;
    
    createOrUpdateChart();
    
    console.log('✅ Test-Diagramm erstellt', chartData.parameters);
}

/**
 * Leert das aktuelle Diagramm
 */
function clearChart() {
    if (blowerDoorChart) {
        blowerDoorChart.destroy();
        blowerDoorChart = null;
        console.log('🗑️ Diagramm geleert');
    } else {
        console.log('ℹ️ Kein Diagramm zum Löschen vorhanden');
    }
}

/**
 * Exportiert das Diagramm als PNG-Datei
 */
function exportChart() {
    if (blowerDoorChart) {
        const link = document.createElement('a');
        link.download = `blower-door-diagramm-${new Date().toISOString().split('T')[0]}.png`;
        link.href = blowerDoorChart.toBase64Image();
        link.click();
        console.log('💾 Diagramm exportiert');
    } else {
        alert('Kein Diagramm zum Exportieren verfügbar!');
        console.warn('⚠️ Export fehlgeschlagen: Kein Diagramm vorhanden');
    }
}

/**
 * Lädt Transfer-Daten aus dem sessionStorage
 */
function loadTransferData() {
    try {
        const transferData = JSON.parse(sessionStorage.getItem('blowerDoorTransfer') || '{}');
        
        if (transferData.chart) {
            chartData.parameters = { ...chartData.parameters, ...transferData.chart.parameters };
            console.log('📊 Chart-Parameter aus Transfer geladen:', chartData.parameters);
        }
        
        if (transferData.measurements) {
            if (transferData.measurements.underpressure) {
                chartData.measurements.underpressure = transferData.measurements.underpressure;
            }
            if (transferData.measurements.overpressure) {
                chartData.measurements.overpressure = transferData.measurements.overpressure;
            }
            console.log('📊 Messdaten aus Transfer geladen:', chartData.measurements);
        }
        
        // Wetterdaten übertragen
        if (transferData.weather) {
            Object.entries(transferData.weather).forEach(([key, value]) => {
                const elements = document.querySelectorAll(`[data-transfer="${key}"]`);
                elements.forEach(el => {
                    if (el.tagName === 'INPUT') {
                        el.value = value;
                    } else {
                        el.textContent = value;
                    }
                });
            });
            console.log('🌤️ Wetterdaten übertragen:', transferData.weather);
        }
        
        console.log('📥 Transfer-Daten erfolgreich geladen');
        
        // Diagramm automatisch erstellen wenn Daten vorhanden
        if (transferData.chart || transferData.measurements) {
            createOrUpdateChart();
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Fehler beim Laden der Transfer-Daten:', error);
        return false;
    }
}

/**
 * Speichert aktuelle Chart-Daten in sessionStorage
 */
function saveTransferData() {
    try {
        const currentData = JSON.parse(sessionStorage.getItem('blowerDoorTransfer') || '{}');
        
        currentData.chart = {
            parameters: chartData.parameters,
            timestamp: new Date().toISOString()
        };
        
        currentData.measurements = chartData.measurements;
        
        sessionStorage.setItem('blowerDoorTransfer', JSON.stringify(currentData));
        console.log('💾 Chart-Daten gespeichert');
        
    } catch (error) {
        console.error('❌ Fehler beim Speichern der Transfer-Daten:', error);
    }
}

/**
 * Initialisiert das Chart-System
 */
function initializeChartSystem() {
    console.log('🚀 Chart-System wird initialisiert...');
    
    // Prüfe ob Chart.js verfügbar ist
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js nicht verfügbar! Bitte laden Sie Chart.js vor dieser Datei.');
        return false;
    }
    
    // Chart.js Konfiguration
    Chart.defaults.color = '#e2e8f0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    // Transfer-Daten laden
    const transferLoaded = loadTransferData();
    
    // Test-Diagramm erstellen falls keine Transfer-Daten vorhanden
    if (!transferLoaded) {
        setTimeout(() => {
            if (!blowerDoorChart) {
                console.log('📊 Erstelle Standard-Diagramm...');
                createOrUpdateChart();
            }
        }, 500);
    }
    
    console.log('✅ Chart-System initialisiert');
    return true;
}

// Globale API für externe Zugriffe
window.protocolChart = {
    // Haupt-Funktionen
    create: createOrUpdateChart,
    clear: clearChart,
    export: exportChart,
    
    // Test-Funktionen
    createTest: createTestChart,
    
    // Daten-Management
    loadData: loadTransferData,
    saveData: saveTransferData,
    
    // Parameter-Updates
    updateParameters: function(params) {
        chartData.parameters = { ...chartData.parameters, ...params };
        createOrUpdateChart();
        saveTransferData();
    },
    
    // Messdaten-Updates
    updateMeasurements: function(measurements) {
        chartData.measurements = { ...chartData.measurements, ...measurements };
        createOrUpdateChart();
        saveTransferData();
    },
    
    // Getter für aktuelle Daten
    getCurrentData: function() {
        return { ...chartData };
    },
    
    // Chart-Instanz abrufen
    getChart: function() {
        return blowerDoorChart;
    }
};

// Automatische Initialisierung wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Protocol Chart-System wird geladen...');
    
    // Kurze Verzögerung für Chart.js Initialisierung
    setTimeout(() => {
        initializeChartSystem();
    }, 100);
});

// Debug-Funktionen (nur in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.chartDebug = {
        data: () => console.log('📊 Chart Data:', chartData),
        chart: () => console.log('📊 Chart Instance:', blowerDoorChart),
        transfer: () => console.log('📥 Transfer Data:', JSON.parse(sessionStorage.getItem('blowerDoorTransfer') || '{}')),
        reset: () => {
            sessionStorage.removeItem('blowerDoorTransfer');
            location.reload();
        }
    };
}