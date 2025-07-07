/**
 * Keyboard Navigation Module - Sichere Minimal-Version
 * Verhindert Aufhängen durch defensive Programmierung
 */

class KeyboardNavigation {
    constructor() {
        this.currentIndex = 0;
        this.navigableElements = [];
        this.isActive = false;
        this.highlightClass = 'keyboard-nav-highlight';
        this.isProcessing = false;
        this.lastUpdate = 0;
        this.emergencyStop = false;
        
        this.init();
    }

    init() {
        console.log('🎹 Keyboard Navigation wird initialisiert...');
        
        // Emergency Stop bei zu vielen Aufrufen
        this.setupEmergencyStop();
        
        // Einfache Styles ohne Animationen
        this.createSimpleStyles();
        
        // Nur Keyboard Events, keine Observer
        this.bindKeyboardEvents();
        
        // Initiales Update
        this.safeUpdate();
        
        console.log('✅ Keyboard Navigation initialisiert');
    }

    setupEmergencyStop() {
        this.callCount = 0;
        this.lastCallTime = 0;
        
        setInterval(() => {
            this.callCount = 0; // Reset alle Sekunde
        }, 1000);
    }

    checkEmergencyStop(methodName) {
        this.callCount++;
        const now = Date.now();
        
        // Mehr als 10 Aufrufe pro Sekunde = Emergency Stop
        if (this.callCount > 10) {
            console.error(`🚨 EMERGENCY STOP: Zu viele ${methodName} Aufrufe!`);
            this.emergencyStop = true;
            this.deactivate();
            return true;
        }
        
        // Weniger als 50ms zwischen Aufrufen = verdächtig
        if (now - this.lastCallTime < 50) {
            console.warn(`⚠️ Schnelle ${methodName} Aufrufe erkannt`);
        }
        
        this.lastCallTime = now;
        return false;
    }

    createSimpleStyles() {
        const existingStyle = document.getElementById('keyboard-nav-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'keyboard-nav-styles';
        style.textContent = `
            .keyboard-nav-highlight {
                outline: 3px solid #f43f5e !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 10px rgba(244, 63, 94, 0.5) !important;
                background-color: rgba(244, 63, 94, 0.1) !important;
                z-index: 1000 !important;
            }
            
            .keyboard-nav-counter {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #f43f5e;
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 14px;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
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
                max-width: 300px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    bindKeyboardEvents() {
        // Nur ein einziger Event Listener
        document.addEventListener('keydown', (e) => {
            if (this.emergencyStop) {
                console.log('🚨 Emergency Stop aktiv - Events ignoriert');
                return;
            }
            
            if (this.isProcessing) {
                console.log('⏳ Bereits am Verarbeiten - Event ignoriert');
                return;
            }
            
            this.handleKeyDown(e);
        }, { passive: false });
        
        console.log('⌨️ Keyboard Events gebunden');
    }

    handleKeyDown(e) {
        if (this.checkEmergencyStop('handleKeyDown')) return;
        
        try {
            this.isProcessing = true;
            
            // Leertaste für Navigation (aber nicht in Inputs)
            if (e.code === 'Space' && !this.isInputFocused()) {
                console.log('🔳 Leertaste gedrückt');
                e.preventDefault();
                this.handleSpacePress();
            }
            
            // Escape zum Beenden
            else if (e.code === 'Escape') {
                console.log('⎋ Escape gedrückt');
                this.deactivate();
            }
            
            // Enter zum Aktivieren
            else if (e.code === 'Enter' && this.isActive) {
                console.log('↵ Enter gedrückt');
                e.preventDefault();
                this.activateCurrentElement();
            }
            
        } catch (error) {
            console.error('❌ Fehler in handleKeyDown:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    isInputFocused() {
        const activeElement = document.activeElement;
        const isInput = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.tagName === 'SELECT' ||
            activeElement.contentEditable === 'true'
        );
        
        if (isInput) {
            console.log('📝 Input ist fokussiert:', activeElement.tagName);
        }
        
        return isInput;
    }

    handleSpacePress() {
        if (this.checkEmergencyStop('handleSpacePress')) return;
        
        console.log('🚀 handleSpacePress() gestartet');
        
        // Immer erst aktualisieren
        this.safeUpdate();
        
        if (this.navigableElements.length === 0) {
            console.log('⚠️ Keine navigierbaren Elemente gefunden');
            return;
        }
        
        if (!this.isActive) {
            console.log('▶️ Aktiviere Navigation');
            this.activate();
        } else {
            console.log('➡️ Navigiere zum nächsten Element');
            this.navigateNext();
        }
        
        console.log('✅ handleSpacePress() beendet');
    }

    safeUpdate() {
        if (this.checkEmergencyStop('safeUpdate')) return;
        
        const now = Date.now();
        
        // Maximal alle 100ms aktualisieren
        if (now - this.lastUpdate < 100) {
            console.log('⏰ Update zu früh - übersprungen');
            return;
        }
        
        this.lastUpdate = now;
        
        try {
            console.log('🔄 Aktualisiere navigierbare Elemente...');
            
            // Einfache Element-Sammlung ohne komplizierte Filter
            const allButtons = Array.from(document.querySelectorAll('button'));
            const allInputs = Array.from(document.querySelectorAll('input, textarea, select'));
            
            // Kombiniere alle Elemente
            const allElements = [...allButtons, ...allInputs];
            
            // Sehr einfacher Sichtbarkeits-Check
            this.navigableElements = allElements.filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && !el.disabled;
            });
            
            console.log(`✅ ${this.navigableElements.length} navigierbare Elemente gefunden`);
            
            // Index prüfen
            if (this.currentIndex >= this.navigableElements.length) {
                this.currentIndex = 0;
            }
            
        } catch (error) {
            console.error('❌ Fehler in safeUpdate:', error);
            this.navigableElements = [];
        }
    }

    activate() {
        if (this.checkEmergencyStop('activate')) return;
        
        this.isActive = true;
        this.currentIndex = 0;
        
        this.highlightCurrentElement();
        this.showUI();
        
        console.log('✅ Navigation aktiviert');
    }

    deactivate() {
        this.isActive = false;
        this.removeHighlight();
        this.hideUI();
        
        console.log('❌ Navigation deaktiviert');
    }

    navigateNext() {
        if (this.checkEmergencyStop('navigateNext')) return;
        
        this.removeHighlight();
        this.currentIndex = (this.currentIndex + 1) % this.navigableElements.length;
        this.highlightCurrentElement();
        this.updateCounter();
        
        console.log(`➡️ Navigation zu Element ${this.currentIndex + 1}/${this.navigableElements.length}`);
    }

    highlightCurrentElement() {
        if (this.navigableElements.length === 0) return;
        if (this.currentIndex >= this.navigableElements.length) return;
        
        try {
            const element = this.navigableElements[this.currentIndex];
            element.classList.add(this.highlightClass);
            
            // Einfaches Scrolling ohne Events
            element.scrollIntoView({
                behavior: 'auto', // Kein smooth scrolling
                block: 'nearest',
                inline: 'nearest'
            });
            
            console.log('🎯 Element hervorgehoben:', element.tagName, element.textContent?.slice(0, 20));
            
        } catch (error) {
            console.error('❌ Fehler beim Hervorheben:', error);
        }
    }

    removeHighlight() {
        try {
            // Entferne Highlight von ALLEN Elementen, nicht nur den aktuellen
            document.querySelectorAll(`.${this.highlightClass}`).forEach(el => {
                el.classList.remove(this.highlightClass);
            });
        } catch (error) {
            console.error('❌ Fehler beim Entfernen der Hervorhebung:', error);
        }
    }

    activateCurrentElement() {
        if (this.navigableElements.length === 0) return;
        if (this.currentIndex >= this.navigableElements.length) return;
        
        try {
            const element = this.navigableElements[this.currentIndex];
            
            if (element.tagName === 'BUTTON') {
                console.log('🖱️ Klicke Button:', element.textContent?.slice(0, 30));
                element.click();
            } else {
                console.log('📝 Fokussiere Input:', element.name || element.placeholder);
                element.focus();
            }
            
        } catch (error) {
            console.error('❌ Fehler beim Aktivieren:', error);
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
        if (counter) counter.remove();
    }

    createInfo() {
        this.removeInfo();
        
        const info = document.createElement('div');
        info.id = 'keyboard-nav-info';
        info.className = 'keyboard-nav-info';
        info.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">🎹 Tastaturnavigation</div>
            <div style="font-size: 12px; opacity: 0.8;">
                <div>Leertaste: Nächstes Element</div>
                <div>Enter: Element aktivieren</div>
                <div>Escape: Navigation beenden</div>
            </div>
        `;
        
        document.body.appendChild(info);
    }

    removeInfo() {
        const info = document.getElementById('keyboard-nav-info');
        if (info) info.remove();
    }

    // Emergency Reset
    reset() {
        console.log('🔄 RESET: Navigation wird zurückgesetzt');
        
        this.emergencyStop = false;
        this.isProcessing = false;
        this.isActive = false;
        this.currentIndex = 0;
        this.callCount = 0;
        
        this.removeHighlight();
        this.hideUI();
        
        console.log('✅ Reset abgeschlossen');
    }

    // Status für Debugging
    getStatus() {
        return {
            isActive: this.isActive,
            currentIndex: this.currentIndex,
            totalElements: this.navigableElements.length,
            isProcessing: this.isProcessing,
            emergencyStop: this.emergencyStop,
            callCount: this.callCount
        };
    }
}

// Sichere Initialisierung
let keyboardNavigation;

function initKeyboardNavigation() {
    try {
        console.log('🚀 Initialisiere Keyboard Navigation...');
        
        // Cleanup alte Instanz
        if (window.keyboardNavigation) {
            window.keyboardNavigation.reset();
        }
        
        keyboardNavigation = new KeyboardNavigation();
        window.keyboardNavigation = keyboardNavigation;
        
        // Debug-Befehle für Konsole
        window.debugNav = () => console.log(keyboardNavigation.getStatus());
        window.resetNav = () => keyboardNavigation.reset();
        
        console.log('✅ Keyboard Navigation bereit!');
        console.log('💡 Debug: debugNav() oder resetNav() in der Konsole');
        
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren:', error);
    }
}

// Initialisierung
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboardNavigation);
} else {
    initKeyboardNavigation();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardNavigation;
}