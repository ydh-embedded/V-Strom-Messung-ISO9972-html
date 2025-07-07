// ==========================================================
// CHART.JS CANVAS-FEHLER BEHEBUNG
// Für robuste Chart-Initialisierung
// ==========================================================

// 1. SICHERE CANVAS-SUCHE
// ==========================================================

function findChartCanvas() {
    // Mögliche Canvas-IDs in Reihenfolge der Priorität
    const possibleIds = ['chart', 'chartCanvas', 'analysis-chart', 'main-chart'];
    
    for (const id of possibleIds) {
        const canvas = document.getElementById(id);
        if (canvas) {
            console.log(`✅ Chart-Canvas gefunden: #${id}`);
            return canvas;
        }
    }
    
    // Fallback: Suche nach Canvas in Analysis-Section
    const analysisSection = document.getElementById('analysis-section');
    if (analysisSection) {
        const canvas = analysisSection.querySelector('canvas');
        if (canvas) {
            console.log('✅ Chart-Canvas in Analysis-Section gefunden');
            return canvas;
        }
    }
    
    // Fallback: Erstes Canvas auf der Seite
    const firstCanvas = document.querySelector('canvas');
    if (firstCanvas) {
        console.log('✅ Erstes Canvas-Element als Fallback verwendet');
        return firstCanvas;
    }
    
    console.warn('⚠️ Kein Canvas-Element gefunden');
    return null;
}

// 2. CANVAS ERSTELLEN FALLS NICHT VORHANDEN
// ==========================================================

function ensureChartCanvas() {
    let canvas = findChartCanvas();
    
    if (!canvas) {
        console.log('🔧 Erstelle neues Canvas-Element...');
        
        // Erstelle Canvas
        canvas = document.createElement('canvas');
        canvas.id = 'chart';
        canvas.width = 800;
        canvas.height = 400;
        canvas.style.cssText = 'display: block; box-sizing: border-box; width: 100%; height: 400px;';
        
        // Suche geeigneten Container
        const containers = [
            '#chart-container',
            '#analysis-section', 
            '.bg-slate-800\\/60', // Chart-Container in Analysis
            'main',
            'body'
        ];
        
        let targetContainer = null;
        for (const selector of containers) {
            targetContainer = document.querySelector(selector);
            if (targetContainer) {
                console.log(`✅ Container gefunden: ${selector}`);
                break;
            }
        }
        
        if (targetContainer) {
            // Erstelle Wrapper für besseres Styling
            const wrapper = document.createElement('div');
            wrapper.className = 'bg-slate-800/90 rounded-lg p-4';
            wrapper.appendChild(canvas);
            
            targetContainer.appendChild(wrapper);
            console.log('✅ Canvas erfolgreich erstellt und eingefügt');
        } else {
            console.error('❌ Kein geeigneter Container für Canvas gefunden');
            return null;
        }
    }
    
    return canvas;
}

// 3. SICHERE CHART-INITIALISIERUNG
// ==========================================================

function safeCreateChart(canvasId, config) {
    // Warte bis DOM bereit ist
    if (document.readyState !== 'complete') {
        console.log('⏳ DOM noch nicht bereit - warte...');
        return new Promise((resolve) => {
            window.addEventListener('load', () => {
                resolve(safeCreateChart(canvasId, config));
            });
        });
    }
    
    try {
        // Stelle sicher dass Canvas existiert
        const canvas = ensureChartCanvas();
        if (!canvas) {
            throw new Error('Canvas konnte nicht erstellt werden');
        }
        
        // Prüfe ob Chart.js verfügbar ist
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js Library nicht geladen');
            return null;
        }
        
        // Zerstöre existierendes Chart falls vorhanden
        if (window.currentChart && typeof window.currentChart.destroy === 'function') {
            window.currentChart.destroy();
            console.log('🗑️ Altes Chart zerstört');
        }
        
        // Erstelle neues Chart
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas 2D Context nicht verfügbar');
        }
        
        const chart = new Chart(ctx, config);
        window.currentChart = chart; // Globale Referenz speichern
        
        console.log('✅ Chart erfolgreich erstellt');
        return chart;
        
    } catch (error) {
        console.error('❌ Fehler beim Erstellen des Charts:', error);
        return null;
    }
}

// 4. CHART.JS FALLBACK-IMPLEMENTIERUNG
// ==========================================================

function createChartFallback() {
    console.log('🔧 Erstelle Chart-Fallback...');
    
    const canvas = ensureChartCanvas();
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Einfache Fallback-Darstellung
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text anzeigen
    ctx.fillStyle = '#f43f5e'; // rose-500
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Chart wird geladen...', canvas.width / 2, canvas.height / 2);
    
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '16px Arial';
    ctx.fillText('Chart.js wird initialisiert', canvas.width / 2, canvas.height / 2 + 40);
    
    console.log('✅ Chart-Fallback angezeigt');
}

// 5. CHART-SYSTEM ÜBERSCHREIBUNGEN
// ==========================================================

// Überschreibe möglicherweise problematische Funktionen
const originalCreateChart = window.createOrUpdateChart;

window.createOrUpdateChart = function(data, options = {}) {
    console.log('🎯 Sichere Chart-Erstellung gestartet...');
    
    try {
        // Prüfe ob Canvas verfügbar ist
        const canvas = findChartCanvas();
        if (!canvas) {
            console.warn('⚠️ Canvas nicht gefunden - erstelle Fallback');
            createChartFallback();
            return null;
        }
        
        // Prüfe ob Canvas sichtbar ist
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('⚠️ Canvas ist nicht sichtbar - verzögere Chart-Erstellung');
            setTimeout(() => window.createOrUpdateChart(data, options), 1000);
            return null;
        }
        
        // Rufe ursprüngliche Funktion auf falls verfügbar
        if (typeof originalCreateChart === 'function') {
            return originalCreateChart(data, options);
        } else {
            // Fallback-Implementierung
            return safeCreateChart('chart', {
                type: 'line',
                data: data || { labels: [], datasets: [] },
                options: options
            });
        }
        
    } catch (error) {
        console.error('❌ Fehler in createOrUpdateChart:', error);
        createChartFallback();
        return null;
    }
};

// 6. CHART-SYSTEM INITIALISIERUNG
// ==========================================================

function safeInitializeChartSystem() {
    console.log('🚀 Starte sichere Chart-System Initialisierung...');
    
    // Warte bis Seite vollständig geladen ist
    const initChart = () => {
        try {
            // Prüfe ob wir auf der Analysis-Seite sind
            const analysisPage = document.getElementById('analysis');
            if (!analysisPage || analysisPage.style.display === 'none') {
                console.log('📊 Analysis-Seite nicht aktiv - Chart-Init übersprungen');
                return;
            }
            
            // Stelle Canvas sicher
            const canvas = ensureChartCanvas();
            if (!canvas) {
                console.warn('⚠️ Canvas-Erstellung fehlgeschlagen');
                return;
            }
            
            // Prüfe Chart.js Verfügbarkeit
            if (typeof Chart === 'undefined') {
                console.warn('⚠️ Chart.js nicht verfügbar - lade Fallback');
                createChartFallback();
                return;
            }
            
            // Initialisiere mit Dummy-Daten wenn nötig
            const dummyData = {
                labels: ['10', '20', '30', '40', '50'],
                datasets: [{
                    label: 'Messdaten',
                    data: [100, 150, 200, 250, 300],
                    borderColor: '#f43f5e',
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    tension: 0.4
                }]
            };
            
            window.createOrUpdateChart(dummyData);
            console.log('✅ Chart-System erfolgreich initialisiert');
            
        } catch (error) {
            console.error('❌ Fehler bei Chart-Initialisierung:', error);
            createChartFallback();
        }
    };
    
    // Initialisiere basierend auf DOM-Status
    if (document.readyState === 'complete') {
        setTimeout(initChart, 100); // Kurze Verzögerung für Stabilität
    } else {
        window.addEventListener('load', () => {
            setTimeout(initChart, 100);
        });
    }
}

// 7. CHART-DEBUGGING TOOLS
// ==========================================================

function debugChart() {
    console.log('🔍 Chart Debug-Informationen:');
    console.log('📊 Chart.js verfügbar:', typeof Chart !== 'undefined');
    console.log('🎯 Canvas gefunden:', !!findChartCanvas());
    console.log('📈 Aktuelles Chart:', window.currentChart);
    console.log('📋 DOM bereit:', document.readyState);
    
    const analysisPage = document.getElementById('analysis');
    console.log('📄 Analysis-Seite sichtbar:', analysisPage && analysisPage.style.display !== 'none');
}

// Globale Debug-Funktion
window.debugChart = debugChart;

// 8. AUTO-INITIALISIERUNG
// ==========================================================

// Sichere Initialisierung starten
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInitializeChartSystem);
} else {
    safeInitializeChartSystem();
}

// Neu-initialisierung bei Seiten-Wechsel
const originalShowPage = window.showPage;
if (typeof originalShowPage === 'function') {
    window.showPage = function(pageId) {
        const result = originalShowPage(pageId);
        
        // Wenn Analysis-Seite angezeigt wird, initialisiere Chart
        if (pageId === 'analysis') {
            setTimeout(safeInitializeChartSystem, 200);
        }
        
        return result;
    };
}

console.log('✅ Chart-Sicherheitssystem geladen');
console.log('💡 Debug: debugChart() in der Konsole für Details');