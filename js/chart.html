/**
 * CHART.JS INTEGRATION - BLOWER-DOOR DIAGRAMM
 * Erstellt echte grafische Diagramme aus übertragenen Messdaten
 */

// Erweitere das bestehende Transfer-System um Chart-Funktionalität
function enhanceTransferWithChart() {
    
    // NEUE FUNKTION: Erstelle echtes Chart.js Diagramm
    function createBlowerDoorChart(chartData, measurements) {
        console.log("📈 Erstelle Blower-Door Diagramm...");
        console.log("Chart-Daten:", chartData);
        console.log("Messdaten:", measurements);
        
        // Finde oder erstelle Chart-Container
        const chartContainer = findOrCreateChartContainer();
        
        if (!chartContainer) {
            console.error("❌ Chart-Container nicht gefunden");
            return;
        }
        
        // Erstelle Canvas-Element
        const canvas = document.createElement('canvas');
        canvas.id = 'blower-door-chart';
        canvas.width = 800;
        canvas.height = 400;
        
        // Ersetze Platzhalter mit Canvas
        chartContainer.innerHTML = '';
        chartContainer.appendChild(canvas);
        
        // Prüfe ob Chart.js verfügbar ist
        if (typeof Chart === 'undefined') {
            console.log("📦 Chart.js nicht verfügbar, lade externe Bibliothek...");
            loadChartJS(canvas, chartData, measurements);
            return;
        }
        
        // Erstelle Chart mit verfügbarer Chart.js
        createChart(canvas, chartData, measurements);
    }
    
    // FUNKTION: Finde oder erstelle Chart-Container
    function findOrCreateChartContainer() {
        // Suche nach bestehendem Chart-Platzhalter
        let container = document.querySelector('.chart-placeholder');
        
        if (!container) {
            // Suche nach alternativen Selektoren
            container = document.querySelector('#chart-container');
        }
        
        if (!container) {
            // Erstelle Container falls nicht vorhanden
            const diagramSection = findDiagramSection();
            if (diagramSection) {
                container = document.createElement('div');
                container.className = 'chart-placeholder';
                container.style.cssText = `
                    width: 100%;
                    height: 500px;
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                `;
                diagramSection.appendChild(container);
            }
        }
        
        return container;
    }
    
    // FUNKTION: Finde Diagramm-Sektion
    function findDiagramSection() {
        // Suche nach "Diagramm" Text
        const headings = document.querySelectorAll('h1, h2, h3, h4, .section-title');
        for (let heading of headings) {
            if (heading.textContent.toLowerCase().includes('diagramm')) {
                return heading.parentElement || heading.nextElementSibling;
            }
        }
        
        // Fallback: Suche nach Seite 5
        const pages = document.querySelectorAll('.page');
        if (pages[4]) { // Index 4 = Seite 5
            return pages[4];
        }
        
        return document.body;
    }
    
    // FUNKTION: Lade Chart.js extern falls nicht verfügbar
    function loadChartJS(canvas, chartData, measurements) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js';
        script.onload = () => {
            console.log("✅ Chart.js extern geladen");
            createChart(canvas, chartData, measurements);
        };
        script.onerror = () => {
            console.error("❌ Chart.js konnte nicht geladen werden");
            showFallbackChart(canvas.parentElement, chartData, measurements);
        };
        document.head.appendChild(script);
    }
    
    // HAUPTFUNKTION: Erstelle Chart.js Diagramm
    function createChart(canvas, chartData, measurements) {
        console.log("🎨 Erstelle Chart.js Diagramm...");
        
        const ctx = canvas.getContext('2d');
        
        // Bereite Datensätze vor
        const datasets = [];
        
        // Unterdruckmessungen (rote Punkte)
        if (chartData.options.showUnderpressure && measurements.underpressure.length > 0) {
            datasets.push({
                label: 'Unterdruckmessungen',
                data: measurements.underpressure.map(point => ({
                    x: Math.abs(point.pressure), // Absolute Werte für bessere Darstellung
                    y: point.volume
                })),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
                type: 'scatter',
                showLine: true,
                tension: 0.4
            });
        }
        
        // Überdruckmessungen (grüne Punkte)
        if (chartData.options.showOverpressure && measurements.overpressure.length > 0) {
            datasets.push({
                label: 'Überdruckmessungen',
                data: measurements.overpressure.map(point => ({
                    x: point.pressure,
                    y: point.volume
                })),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
                type: 'scatter',
                showLine: true,
                tension: 0.4
            });
        }
        
        // Theoretische Kurve
        if (chartData.options.showTheoretical && chartData.parameters.n50 && chartData.parameters.volume) {
            const theoreticalData = generateTheoreticalCurve(chartData.parameters);
            datasets.push({
                label: 'Theoretische Kurve',
                data: theoreticalData,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 3,
                pointRadius: 0,
                type: 'line',
                showLine: true,
                tension: 0.4,
                borderDash: [5, 5]
            });
        }
        
        // Erstelle Chart
        const chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Blower-Door Messung - Druckverlauf',
                        font: { size: 18, weight: 'bold' },
                        color: '#1f2937'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.x} Pa → ${context.parsed.y} m³/h`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Druckdifferenz [Pa]',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Volumenstrom [m³/h]',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBorderWidth: 3
                    }
                }
            }
        });
        
        // Chart-Container stylen
        canvas.parentElement.style.backgroundColor = 'white';
        canvas.parentElement.style.border = '2px solid #e5e7eb';
        canvas.parentElement.style.borderRadius = '12px';
        canvas.parentElement.style.padding = '20px';
        canvas.parentElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        
        console.log("✅ Chart.js Diagramm erstellt mit", datasets.length, "Datensätzen");
        
        // Zeige Chart-Info
        showChartInfo(chartData, measurements, canvas.parentElement);
        
        return chart;
    }
    
    // FUNKTION: Generiere theoretische Kurve
    function generateTheoreticalCurve(parameters) {
        const n50 = parseFloat(parameters.n50);
        const volume = parseFloat(parameters.volume);
        
        if (!n50 || !volume) return [];
        
        const data = [];
        
        // Generiere Punkte von 10 Pa bis 100 Pa
        for (let pressure = 10; pressure <= 100; pressure += 5) {
            // Vereinfachte Berechnung: V = n50 * volume * (pressure/50)^0.65
            const flow = n50 * volume * Math.pow(pressure / 50, 0.65);
            data.push({ x: pressure, y: flow });
        }
        
        return data;
    }
    
    // FUNKTION: Zeige Chart-Informationen
    function showChartInfo(chartData, measurements, container) {
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        `;
        
        const totalPoints = (measurements.underpressure?.length || 0) + (measurements.overpressure?.length || 0);
        
        infoDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">📊 Diagramm-Informationen</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                <div>
                    <strong>Messpunkte:</strong><br>
                    • Unterdruck: ${measurements.underpressure?.length || 0} Werte<br>
                    • Überdruck: ${measurements.overpressure?.length || 0} Werte<br>
                    • Gesamt: ${totalPoints} Messpunkte
                </div>
                <div>
                    <strong>Parameter:</strong><br>
                    • n₅₀-Wert: ${chartData.parameters.n50 || 'N/A'} [1/h]<br>
                    • Volumen: ${chartData.parameters.volume || 'N/A'} [m³]<br>
                    • Max. Druck: ${chartData.parameters.pressure || 'N/A'} [Pa]
                </div>
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
                Diagramm erstellt am: ${new Date().toLocaleString('de-DE')}
            </div>
        `;
        
        container.appendChild(infoDiv);
    }
    
    // FALLBACK: Zeige SVG-Chart falls Chart.js nicht verfügbar
    function showFallbackChart(container, chartData, measurements) {
        console.log("🎨 Erstelle SVG-Fallback-Chart...");
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '400');
        svg.setAttribute('viewBox', '0 0 800 400');
        svg.style.backgroundColor = 'white';
        svg.style.border = '2px solid #e5e7eb';
        svg.style.borderRadius = '12px';
        
        // Zeichne Achsen
        const axesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // X-Achse
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', '60');
        xAxis.setAttribute('y1', '340');
        xAxis.setAttribute('x2', '740');
        xAxis.setAttribute('y2', '340');
        xAxis.setAttribute('stroke', '#374151');
        xAxis.setAttribute('stroke-width', '2');
        
        // Y-Achse
        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', '60');
        yAxis.setAttribute('y1', '60');
        yAxis.setAttribute('x2', '60');
        yAxis.setAttribute('y2', '340');
        yAxis.setAttribute('stroke', '#374151');
        yAxis.setAttribute('stroke-width', '2');
        
        axesGroup.appendChild(xAxis);
        axesGroup.appendChild(yAxis);
        svg.appendChild(axesGroup);
        
        // Zeichne Messpunkte
        drawMeasurementPoints(svg, measurements);
        
        // Beschriftungen
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', '400');
        title.setAttribute('y', '30');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-size', '18');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('fill', '#1f2937');
        title.textContent = 'Blower-Door Messung - Druckverlauf (SVG)';
        svg.appendChild(title);
        
        container.innerHTML = '';
        container.appendChild(svg);
        
        console.log("✅ SVG-Fallback-Chart erstellt");
    }
    
    // FUNKTION: Zeichne Messpunkte im SVG
    function drawMeasurementPoints(svg, measurements) {
        const chartArea = { x: 60, y: 60, width: 680, height: 280 };
        
        // Finde Min/Max Werte für Skalierung
        const allPoints = [...(measurements.underpressure || []), ...(measurements.overpressure || [])];
        if (allPoints.length === 0) return;
        
        const maxPressure = Math.max(...allPoints.map(p => Math.abs(p.pressure))) || 50;
        const maxVolume = Math.max(...allPoints.map(p => p.volume)) || 2000;
        
        // Zeichne Unterdruckpunkte (rot)
        measurements.underpressure?.forEach(point => {
            const x = chartArea.x + (Math.abs(point.pressure) / maxPressure) * chartArea.width;
            const y = chartArea.y + chartArea.height - (point.volume / maxVolume) * chartArea.height;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', '#ef4444');
            circle.setAttribute('stroke', '#dc2626');
            circle.setAttribute('stroke-width', '2');
            
            svg.appendChild(circle);
        });
        
        // Zeichne Überdruckpunkte (grün)
        measurements.overpressure?.forEach(point => {
            const x = chartArea.x + (point.pressure / maxPressure) * chartArea.width;
            const y = chartArea.y + chartArea.height - (point.volume / maxVolume) * chartArea.height;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', '#10b981');
            circle.setAttribute('stroke', '#059669');
            circle.setAttribute('stroke-width', '2');
            
            svg.appendChild(circle);
        });
    }
    
    // ERWEITERE DIE BESTEHENDE updateChartDisplay FUNKTION
    if (window.completeTransferSystem) {
        const originalUpdateChart = window.completeTransferSystem.updateChartDisplay;
        
        window.completeTransferSystem.updateChartDisplay = function(chartData) {
            console.log("🎨 Erweiterte Chart-Anzeige mit echtem Diagramm...");
            
            // Führe originale Funktion aus (für Kompatibilität)
            if (originalUpdateChart) {
                originalUpdateChart.call(this, chartData);
            }
            
            // Sammle Messdaten aus dem Transfer
            const transferData = JSON.parse(sessionStorage.getItem('blowerDoorTransfer') || '{}');
            const measurements = transferData.measurements || { underpressure: [], overpressure: [], combined: [] };
            
            // Erstelle echtes Diagramm
            setTimeout(() => {
                createBlowerDoorChart(chartData, measurements);
            }, 1000);
        };
        
        console.log("✅ Transfer-System mit Chart-Integration erweitert");
    }
    
    // GLOBALE TEST-FUNKTION
    window.testChartCreation = function() {
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
        
        createBlowerDoorChart(testChartData, testMeasurements);
    };
    
    return {
        createBlowerDoorChart,
        testChartCreation: window.testChartCreation
    };
}

// Initialisiere Chart-Erweiterung
const chartExtension = enhanceTransferWithChart();

console.log("📈 Chart-Integration geladen!");
console.log("🧪 Test-Befehl: testChartCreation()");
console.log("✅ Echte Diagramme werden jetzt beim Transfer erstellt");