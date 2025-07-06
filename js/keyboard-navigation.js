/**
 * Keyboard Navigation Module
 * Implementiert Tastaturnavigation mit der Leertaste für Buttons und Input-Felder
 */

class KeyboardNavigation {
    constructor() {
        this.currentIndex = 0;
        this.navigableElements = [];
        this.isActive = false;
        this.highlightClass = 'keyboard-nav-highlight';
        
        this.init();
    }

    init() {
        this.createStyles();
        this.bindEvents();
        this.updateNavigableElements();
        
        console.log('🎹 Keyboard Navigation initialisiert');
        console.log('💡 Drücken Sie die Leertaste, um durch die Elemente zu navigieren');
    }

    createStyles() {
        // Erstelle CSS-Styles für die Hervorhebung
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-nav-highlight {
                outline: 3px solid #f43f5e !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 6px rgba(244, 63, 94, 0.2) !important;
                background-color: rgba(244, 63, 94, 0.1) !important;
                transition: all 0.2s ease !important;
                position: relative !important;
                z-index: 1000 !important;
            }
            
            .keyboard-nav-highlight::before {
                content: '🎯';
                position: absolute;
                top: -25px;
                left: -5px;
                background: #f43f5e;
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                z-index: 1001;
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .keyboard-nav-counter {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(244, 63, 94, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 14px;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }
            
            .keyboard-nav-info {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(15, 23, 42, 0.95);
                color: #f1f5f9;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 13px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(244, 63, 94, 0.3);
                max-width: 300px;
            }
        `;
        document.head.appendChild(style);
    }

    updateNavigableElements() {
        // Bestimme die navigierbaren Elemente basierend auf der aktuellen Seite
        const currentPage = this.getCurrentPage();
        
        if (currentPage === 'index') {
            // Für index.html: alle Buttons
            this.navigableElements = Array.from(document.querySelectorAll('button')).filter(btn => {
                return this.isElementVisible(btn) && !btn.disabled;
            });
        } else if (currentPage === 'protocol') {
            // Für protocol.html: alle Input-Felder
            this.navigableElements = Array.from(document.querySelectorAll('input, textarea, select')).filter(input => {
                return this.isElementVisible(input) && !input.disabled && !input.readOnly;
            });
        } else {
            // Fallback: alle interaktiven Elemente
            this.navigableElements = Array.from(document.querySelectorAll('button, input, textarea, select, [tabindex]')).filter(el => {
                return this.isElementVisible(el) && !el.disabled;
            });
        }

        console.log(`🔍 ${this.navigableElements.length} navigierbare Elemente gefunden auf ${currentPage}-Seite`);
        
        // Reset index wenn keine Elemente vorhanden
        if (this.navigableElements.length === 0) {
            this.currentIndex = 0;
            this.isActive = false;
        } else if (this.currentIndex >= this.navigableElements.length) {
            this.currentIndex = 0;
        }

        this.updateUI();
    }

    getCurrentPage() {
        // Bestimme die aktuelle Seite basierend auf der URL oder dem Dokumenttitel
        const url = window.location.href;
        const title = document.title;
        
        if (url.includes('protocol.html') || title.includes('Prüfverfahren')) {
            return 'protocol';
        } else if (url.includes('index.html') || title.includes('Blower Door Messprotokoll')) {
            return 'index';
        }
        
        // Fallback: prüfe sichtbare Elemente
        const hasButtons = document.querySelectorAll('button').length > 0;
        const hasInputs = document.querySelectorAll('input').length > 0;
        
        if (hasButtons && !hasInputs) return 'index';
        if (hasInputs && !hasButtons) return 'protocol';
        
        return 'mixed';
    }

    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0'
        );
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            // Leertaste für Navigation
            if (e.code === 'Space' && !this.isInputFocused()) {
                e.preventDefault();
                this.handleSpacePress();
            }
            
            // Escape zum Beenden der Navigation
            if (e.code === 'Escape') {
                this.deactivate();
            }
            
            // Enter zum Aktivieren des aktuellen Elements
            if (e.code === 'Enter' && this.isActive) {
                e.preventDefault();
                this.activateCurrentElement();
            }
        });

        // Aktualisiere Elemente bei Seitenänderungen
        const observer = new MutationObserver(() => {
            this.updateNavigableElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });

        // Aktualisiere bei Scroll und Resize
        window.addEventListener('scroll', () => this.updateNavigableElements());
        window.addEventListener('resize', () => this.updateNavigableElements());
    }

    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.contentEditable === 'true'
        );
    }

    handleSpacePress() {
        if (this.navigableElements.length === 0) {
            this.updateNavigableElements();
            if (this.navigableElements.length === 0) {
                console.log('⚠️ Keine navigierbaren Elemente gefunden');
                return;
            }
        }

        if (!this.isActive) {
            this.activate();
        } else {
            this.navigateNext();
        }
    }

    activate() {
        this.isActive = true;
        this.currentIndex = 0;
        this.highlightCurrentElement();
        this.showUI();
        
        console.log('✅ Keyboard Navigation aktiviert');
    }

    deactivate() {
        this.isActive = false;
        this.removeHighlight();
        this.hideUI();
        
        console.log('❌ Keyboard Navigation deaktiviert');
    }

    navigateNext() {
        this.removeHighlight();
        this.currentIndex = (this.currentIndex + 1) % this.navigableElements.length;
        this.highlightCurrentElement();
        this.updateCounter();
        
        console.log(`➡️ Navigation zu Element ${this.currentIndex + 1}/${this.navigableElements.length}`);
    }

    highlightCurrentElement() {
        if (this.navigableElements.length > 0 && this.currentIndex < this.navigableElements.length) {
            const element = this.navigableElements[this.currentIndex];
            element.classList.add(this.highlightClass);
            
            // Scrolle zum Element
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
            
            // Fokussiere das Element
            element.focus();
        }
    }

    removeHighlight() {
        this.navigableElements.forEach(element => {
            element.classList.remove(this.highlightClass);
        });
    }

    activateCurrentElement() {
        if (this.navigableElements.length > 0 && this.currentIndex < this.navigableElements.length) {
            const element = this.navigableElements[this.currentIndex];
            
            if (element.tagName === 'BUTTON') {
                element.click();
                console.log('🖱️ Button geklickt:', element.textContent?.trim());
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.focus();
                console.log('📝 Input-Feld fokussiert:', element.placeholder || element.name);
            }
        }
    }

    showUI() {
        this.createCounter();
        this.createInfo();
    }

    hideUI() {
        this.removeCounter();
        this.removeInfo();
    }

    createCounter() {
        this.removeCounter();
        
        const counter = document.createElement('div');
        counter.id = 'keyboard-nav-counter';
        counter.className = 'keyboard-nav-counter';
        counter.textContent = `${this.currentIndex + 1}/${this.navigableElements.length}`;
        
        document.body.appendChild(counter);
    }

    updateCounter() {
        const counter = document.getElementById('keyboard-nav-counter');
        if (counter) {
            counter.textContent = `${this.currentIndex + 1}/${this.navigableElements.length}`;
        }
    }

    removeCounter() {
        const counter = document.getElementById('keyboard-nav-counter');
        if (counter) {
            counter.remove();
        }
    }

    createInfo() {
        this.removeInfo();
        
        const info = document.createElement('div');
        info.id = 'keyboard-nav-info';
        info.className = 'keyboard-nav-info';
        
        const currentPage = this.getCurrentPage();
        const elementType = currentPage === 'index' ? 'Buttons' : 'Input-Felder';
        
        info.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">🎹 Tastaturnavigation</div>
            <div style="font-size: 12px; opacity: 0.8;">
                <div>Leertaste: Nächstes ${elementType}</div>
                <div>Enter: Element aktivieren</div>
                <div>Escape: Navigation beenden</div>
            </div>
        `;
        
        document.body.appendChild(info);
    }

    removeInfo() {
        const info = document.getElementById('keyboard-nav-info');
        if (info) {
            info.remove();
        }
    }

    updateUI() {
        if (this.isActive) {
            this.updateCounter();
            this.createInfo(); // Info aktualisieren
        }
    }

    // Öffentliche Methoden für externe Steuerung
    toggle() {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    refresh() {
        this.updateNavigableElements();
    }

    getStatus() {
        return {
            isActive: this.isActive,
            currentIndex: this.currentIndex,
            totalElements: this.navigableElements.length,
            currentPage: this.getCurrentPage()
        };
    }
}

// Globale Instanz erstellen
let keyboardNavigation;

// Initialisierung nach DOM-Load
document.addEventListener('DOMContentLoaded', () => {
    keyboardNavigation = new KeyboardNavigation();
    
    // Globale Referenz für Debugging
    window.keyboardNavigation = keyboardNavigation;
});

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardNavigation;
}

