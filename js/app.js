// =================================================================
// app.js - Hauptanwendung und Navigation
//
// 🎯 app.js - Kern & Navigation
//
// Tab-System: Wechsel zwischen verschiedenen Bereichen
// Scroll-Handling: Header ausblenden/einblenden bei Scroll
// Seiten-Management: Single-Page-Application mit showPage()
// Datum-Management: Automatische Datumsinitialisierung
// Page-spezifische Initialisierung: Lädt je nach Seite die richtigen Module
//
//
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("App.js: DOM geladen. Initialisiere Basis-UI.");
    initializeApp();
});

function initializeApp() {
    initializeScrollHandling();
    initializeDate();
    showPage('home');
}

/**
 * Zeigt eine bestimmte Seite an und blendet andere aus
 */
window.showPage = function(pageId) {
    // Alle Seiten ausblenden
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Zielseite anzeigen
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Seitenspezifische Initialisierung
    handlePageSpecificActions(pageId);
}

function handlePageSpecificActions(pageId) {
    switch (pageId) {
        case 'measurement':
            // Messseite initialisieren falls noch nicht geschehen
            if (typeof initMeasurementPage === 'function') {
                initMeasurementPage();
            }
            break;
        case 'analysis':
            // Chart initialisieren mit Verzögerung
            setTimeout(() => {
                if (typeof initChart === 'function') {
                    if (!window.chart) {
                        initChart();
                    } else {
                        updateChart();
                    }
                }
            }, 100);
            break;
        case 'protocol':
            // Protokoll aktualisieren
            if (typeof updateProtocolPage === 'function') {
                updateProtocolPage();
            }
            setTimeout(() => {
                if (typeof transferDataToProtocol === 'function') {
                    transferDataToProtocol();
                }
            }, 200);
            break;
        case 'weather':
            // Wettersystem initialisieren
            if (typeof initWeatherSystem === 'function') {
                initWeatherSystem();
            }
            break;
    }
}

/**
 * Wechselt zwischen Tabs
 */
window.switchTab = function(tabName) {
    // Alle Tab-Inhalte ausblenden
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Alle Tab-Buttons deaktivieren
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Gewählten Tab aktivieren
    const selectedContent = document.getElementById(tabName + '-content');
    const selectedButton = document.getElementById('tab-' + tabName);
    
    if (selectedContent) selectedContent.classList.add('active');
    if (selectedButton) selectedButton.classList.add('active');
}

/**
 * Initialisiert Scroll-Handling für Header
 */
function initializeScrollHandling() {
    let isScrolling = false;
    let headerHidden = false;
    
    const handleScroll = () => {
        if (isScrolling) return;
        isScrolling = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const header = document.getElementById('main-header');
            const nav = document.getElementById('main-nav');

            // Header ausblenden/einblenden
            if (scrollY > 150 && !headerHidden) {
                header?.classList.add('hidden');
                headerHidden = true;
            } else if (scrollY < 100 && headerHidden) {
                header?.classList.remove('hidden');
                headerHidden = false;
            }

            // Navigation-Styling bei Scroll
            if (scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }

            isScrolling = false;
        });
    };

    // Scroll-Event mit Throttling
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleScroll, 10);
    }, { passive: true });
}

/**
 * Initialisiert Datum in allen relevanten Feldern
 */
function initializeDate() {
    const heute = new Date();
    const deutschesDatum = heute.toLocaleDateString('de-DE');
    
    document.querySelectorAll('.auto-datum').forEach(feld => {
        feld.textContent = deutschesDatum;
    });
}

/**
 * Ermöglicht manuelles Ändern des Datums
 */
window.setzeDatum = function() {
    const aktuellesDatum = document.querySelector('.auto-datum')?.textContent || 
                          new Date().toLocaleDateString('de-DE');
    
    const datum = prompt("Datum eingeben (TT.MM.JJJJ):", aktuellesDatum);
    
    if (datum && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(datum)) {
        document.querySelectorAll('.auto-datum').forEach(feld => {
            feld.textContent = datum;
        });
    } else if (datum) {
        alert("Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein.");
    }
}