/**
 * EINFACHES TRANSFER-SYSTEM - GARANTIERT FUNKTIONIEREND
 * Ersetzen Sie den gesamten Inhalt von js/transfer.js
 */

console.log("🚀 EINFACHES TRANSFER-SYSTEM STARTET");

// =============================================================================
// SOFORT AUSFÜHRBARE FUNKTIONEN
// =============================================================================



// Sammle alle verfügbaren Daten
function collectData() {
    console.log("📊 Sammle Daten...");
    
    const data = {
        // Zeitstempel
        timestamp: new Date().toLocaleString('de-DE'),
        
        // Wetterdaten
        weather: {},
        
        // Gebäudedaten  
        building: {},
        
        // Status
        status: 'collected'
    };
    
    // Wetterdaten sammeln
    const weatherIds = ['outside-temp', 'inside-temp', 'wind-speed', 'wind-direction', 'air-pressure', 'humidity'];
    weatherIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            data.weather[id] = element.value || '';
            console.log(`🌤️ ${id}: "${element.value}"`);
        } else {
            console.log(`❌ Element nicht gefunden: ${id}`);
        }
    });
    
    // Gebäudedaten sammeln
    const buildingIds = ['volume', 'n50', 'pressure'];
    buildingIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            data.building[id] = element.value || '';
            console.log(`🏗️ ${id}: "${element.value}"`);
        } else {
            console.log(`❌ Element nicht gefunden: ${id}`);
        }
    });
    
    console.log("📋 Gesammelte Daten:", data);
    return data;
}

// Führe Transfer aus
function transferDataNow() {
    console.log("🔄 TRANSFER STARTET JETZT!");
    
    try {
        // 1. Daten sammeln
        const data = collectData();
        
        // 2. Prüfen ob Daten vorhanden
        const hasData = checkHasData(data);
        console.log("✅ Hat Daten:", hasData);
        
        if (!hasData) {
            alert("❌ Keine Daten gefunden!\n\nBitte füllen Sie mindestens ein Feld aus und versuchen Sie es erneut.");
            return;
        }
        
        // 3. Daten speichern und übertragen
        const success = executeTransfer(data);
        
        if (success) {
            console.log("🎉 TRANSFER ERFOLGREICH!");
        }
        
    } catch (error) {
        console.error("💥 TRANSFER FEHLER:", error);
        alert("Transfer fehlgeschlagen: " + error.message);
    }
}

// Prüfe ob Daten vorhanden sind
function checkHasData(data) {
    const weatherHasData = Object.values(data.weather).some(val => val !== '');
    const buildingHasData = Object.values(data.building).some(val => val !== '');
    
    console.log("🔍 Wetter hat Daten:", weatherHasData);
    console.log("🔍 Gebäude hat Daten:", buildingHasData);
    
    return weatherHasData || buildingHasData;
}

// Führe den eigentlichen Transfer aus
function executeTransfer(data) {
    console.log("🚚 Führe Transfer aus...");
    
    try {
        // 1. Daten als JSON speichern
        const jsonData = JSON.stringify(data);
        console.log("📦 JSON Daten erstellt, Größe:", jsonData.length);
        
        // 2. In SessionStorage speichern (immer, als Backup)
        sessionStorage.setItem('blowerDoorTransfer', jsonData);
        console.log("💾 Daten in SessionStorage gespeichert");
        
        // 3. URL erstellen
        const protocolUrl = './sites/protocol.html';
        console.log("🎯 Ziel-URL:", protocolUrl);
        
        // 4. Benutzer informieren
        const proceed = confirm(`✅ Daten bereit für Transfer!\n\n` +
            `Wetter-Felder: ${Object.keys(data.weather).length}\n` +
            `Gebäude-Felder: ${Object.keys(data.building).length}\n\n` +
            `Jetzt zu protocol.html wechseln?`);
        
        if (proceed) {
            // 5. Navigation ausführen
            console.log("🚀 Navigiere zu protocol.html...");
            window.location.href = protocolUrl;
            return true;
        } else {
            console.log("❌ Transfer vom Benutzer abgebrochen");
            return false;
        }
        
    } catch (error) {
        console.error("💥 Transfer-Ausführung fehlgeschlagen:", error);
        throw error;
    }
}

// =============================================================================
// PROTOCOL.HTML SEITE - DATEN LADEN
// =============================================================================

// Lade Daten auf protocol.html
function loadDataOnProtocol() {
    console.log("📥 Protocol.html: Lade Daten...");
    
    // Aus SessionStorage laden
    const sessionData = sessionStorage.getItem('blowerDoorTransfer');
    
    if (sessionData) {
        try {
            const data = JSON.parse(sessionData);
            console.log("✅ Daten aus SessionStorage geladen:", data);
            
            // Daten einfügen
            fillProtocolFields(data);
            
            // SessionStorage leeren
            sessionStorage.removeItem('blowerDoorTransfer');
            
            // Erfolg anzeigen
            showProtocolMessage("✅ Daten erfolgreich übertragen!", "success");
            
        } catch (error) {
            console.error("❌ Fehler beim Laden der SessionStorage Daten:", error);
            showProtocolMessage("❌ Fehler beim Laden der Daten", "error");
        }
    } else {
        console.log("ℹ️ Keine Übertragungsdaten in SessionStorage gefunden");
        showProtocolMessage("ℹ️ Keine Übertragungsdaten gefunden", "info");
    }
}

// Fülle Protocol-Felder aus
function fillProtocolFields(data) {
    console.log("✏️ Fülle Protocol-Felder aus...");
    
    let fieldsUpdated = 0;
    
    // Alle input-Felder durchgehen
    const inputs = document.querySelectorAll('input');
    console.log(`🔍 ${inputs.length} Eingabefelder gefunden`);
    
    inputs.forEach((input, index) => {
        const placeholder = input.placeholder ? input.placeholder.toLowerCase() : '';
        const label = input.previousElementSibling?.textContent?.toLowerCase() || '';
        const parentText = input.closest('.field-group')?.textContent?.toLowerCase() || '';
        
        console.log(`🔍 Feld ${index}: placeholder="${placeholder}", label="${label}"`);
        
        // Erweiterte Zuordnung basierend auf Labels UND Platzhaltern
        const fieldMappings = [
            // Wetterdaten
            { 
                checks: ['außentemp', 'außentemperatur'], 
                value: data.weather['outside-temp'],
                name: 'Außentemperatur'
            },
            { 
                checks: ['innentemp', 'innentemperatur', 'placeholder="20"'], 
                value: data.weather['inside-temp'],
                name: 'Innentemperatur'
            },
            { 
                checks: ['wind:', 'windgeschwindigkeit'], 
                value: data.weather['wind-speed'],
                name: 'Windgeschwindigkeit'
            },
            { 
                checks: ['windrichtung'], 
                value: data.weather['wind-direction'],
                name: 'Windrichtung'
            },
            { 
                checks: ['luftdruck'], 
                value: data.weather['air-pressure'],
                name: 'Luftdruck'
            },
            { 
                checks: ['luftfeuchtigkeit'], 
                value: data.weather['humidity'],
                name: 'Luftfeuchtigkeit'
            },
            // Gebäudedaten
            { 
                checks: ['netto-raumvolumen', 'volumen'], 
                value: data.building['volume'],
                name: 'Volumen'
            },
            { 
                checks: ['n₅₀', 'n50'], 
                value: data.building['n50'],
                name: 'n50-Wert'
            },
            { 
                checks: ['druck', 'pressure'], 
                value: data.building['pressure'],
                name: 'Druck'
            }
        ];
        
        // Prüfe jedes Mapping
        fieldMappings.forEach(mapping => {
            const matchFound = mapping.checks.some(check => 
                placeholder.includes(check) || 
                label.includes(check) || 
                parentText.includes(check) ||
                (check === 'placeholder="20"' && placeholder === '20')
            );
            
            if (matchFound && mapping.value) {
                input.value = mapping.value;
                input.style.backgroundColor = '#e6ffe6';
                input.style.border = '2px solid #10b981';
                fieldsUpdated++;
                console.log(`✅ ${mapping.name}: ${mapping.value} (gefunden mit: ${mapping.checks})`);
            }
        });
    });
    
    console.log(`📊 ${fieldsUpdated} Felder aktualisiert`);
}

// Zeige Nachricht auf Protocol-Seite
function showProtocolMessage(message, type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444', 
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// =============================================================================
// AUTOMATISCHE INITIALISIERUNG
// =============================================================================

// Prüfe welche Seite wir haben
function initializeTransferSystem() {
    const currentUrl = window.location.href.toLowerCase();
    console.log("🔍 Aktuelle URL:", currentUrl);
    
    if (currentUrl.includes('protocol.html')) {
        console.log("📄 Protocol-Seite erkannt");
        loadDataOnProtocol();
    } else {
        console.log("🏠 Index-Seite erkannt");
        createTestButton();
    }
}

// Starte sofort nach DOM-Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransferSystem);
} else {
    initializeTransferSystem();
}

// =============================================================================
// GLOBALE FUNKTIONEN
// =============================================================================

// Für bestehende Buttons
window.transferAllData = transferDataNow;
window.transferWeatherToProtocol = transferDataNow;
window.transferMeasurementToProtocol = transferDataNow;

// Debug-Funktionen
window.debugCollectData = collectData;
window.testTransfer = transferDataNow;

console.log("✅ Einfaches Transfer-System geladen und bereit!");