// js/app.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialisiert alle anderen Skripte und Event-Listener
    initializeScrollHandling();
    initializeDate();
    
    // Stellt sicher, dass die Initialisierungsfunktionen aus den anderen Skripten aufgerufen werden
    if (typeof initMeasurementPage === "function") initMeasurementPage();
    if (typeof initWeatherSystem === "function") initWeatherSystem();
    if (typeof initProtocolPage === "function") initProtocolPage();

    // Startseite beim ersten Laden anzeigen
    showPage('home');
});

/**
 * Zeigt eine bestimmte Seite an und blendet die anderen aus.
 * Macht die Funktion global verfügbar, damit sie von onclick-Attributen im HTML aufgerufen werden kann.
 * @param {string} pageId - Die ID der anzuzeigenden Seite.
 */
window.showPage = function(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Spezifische Aktionen beim Seitenwechsel
    switch (pageId) {
        case 'analysis':
            // Verzögerung, um sicherzustellen, dass das Canvas-Element für Chart.js sichtbar ist
            setTimeout(() => {
                if (!window.chart) {
                    initChart();
                } else {
                    updateChart();
                }
            }, 100);
            break;
        case 'protocol':
            // Lädt den Protokollinhalt dynamisch, falls noch nicht geschehen
            if (!targetPage.querySelector('.protocol-container')) {
                updateProtocolPage();
            }
            // Überträgt automatisch die neuesten Daten ins Protokoll
            setTimeout(() => transferDataToProtocol(), 200);
            break;
    }
}

/**
 * Wechselt zwischen den Tabs (z.B. Unterdruck/Überdruck).
 * @param {string} tabName - Der Name des zu aktivierenden Tabs.
 */
window.switchTab = function(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) selectedContent.classList.add('active');

    const selectedButton = document.getElementById('tab-' + tabName);
    if (selectedButton) selectedButton.classList.add('active');
}

/**
 * Initialisiert das Scroll-Verhalten für die Navigation (blendet Header aus/ein).
 */
function initializeScrollHandling() {
    let isScrolling = false;
    let headerHidden = false;

    const handleScroll = () => {
        if (isScrolling) return;
        isScrolling = true;

        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const header = document.getElementById('main-header');
            const nav = document.getElementById('main-nav');

            const hideThreshold = 150;
            const showThreshold = 100;

            if (scrollY > hideThreshold && !headerHidden) {
                header?.classList.add('hidden');
                headerHidden = true;
            } else if (scrollY < showThreshold && headerHidden) {
                header?.classList.remove('hidden');
                headerHidden = false;
            }

            if (scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }
            isScrolling = false;
        });
    };

    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(handleScroll, 10);
    }, { passive: true });
}

/**
 * Setzt das aktuelle Datum in alle relevanten Felder beim Start.
 */
function initializeDate() {
    const heute = new Date();
    const deutschesDatum = heute.toLocaleDateString('de-DE');
    document.querySelectorAll('.auto-datum').forEach(feld => {
        feld.textContent = deutschesDatum;
    });
}

/**
 * Ermöglicht das manuelle Ändern des Datums über einen Prompt.
 */
window.setzeDatum = function() {
    const aktuellesDatum = document.querySelector('.auto-datum')?.textContent || new Date().toLocaleDateString('de-DE');
    const datum = prompt("Datum eingeben (TT.MM.JJJJ):", aktuellesDatum);
    if (datum && /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(datum)) {
        document.querySelectorAll('.auto-datum').forEach(feld => {
            feld.textContent = datum;
        });
    } else if (datum) {
        alert("Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein.");
    }
}
