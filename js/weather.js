// =================================================================
// weather.js - Wetter-System
// =================================================================



// Nur Wetterdaten übertragen
function transferWeatherToProtocol() {
    const weatherData = {
        outsideTemp: document.getElementById('outside-temp')?.value || '',
        windSpeed: document.getElementById('wind-speed')?.value || '',
        windDirection: document.getElementById('wind-direction')?.value || '',
        airPressure: document.getElementById('air-pressure')?.value || '',
        humidity: document.getElementById('humidity')?.value || ''
    };

    const encodedData = encodeURIComponent(JSON.stringify({weather: weatherData}));
    window.location.href = `./sites/protocol.html?data=${encodedData}`;
}
// Globale Variablen
let currentLat = 52.52; // Berlin
let currentLon = 13.40;

/**
 * Initialisiert das Wetter-System
 */
window.initWeatherSystem = function() {
    console.log("Initialisiere Wetter-System...");
    updateWeatherStatus('🚀 Bereit! Standort ermitteln oder Daten manuell eingeben.', '', 5000);
}

/**
 * Aktualisiert den Wetter-Status
 */
function updateWeatherStatus(message, type = '', timeout = 0) {
    const statusElement = document.getElementById('weather-status');
    if (!statusElement) return;

    const typeClasses = {
        loading: 'bg-blue-800 text-blue-200',
        success: 'bg-green-800 text-green-200',
        error: 'bg-red-800 text-red-200'
    };

    // Reset classes
    statusElement.className = 'weather-status text-center mt-4 p-2 rounded-md';
    
    // Add type-specific classes
    if (type && typeClasses[type]) {
        statusElement.classList.add(...typeClasses[type].split(' '));
    }

    statusElement.textContent = message;
    statusElement.style.display = message ? 'block' : 'none';

    if (timeout > 0) {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, timeout);
    }
}

/**
 * Ermittelt Benutzer-Standort via GPS
 */
window.getUserLocation = async function() {
    updateWeatherStatus('📍 Standort wird ermittelt...', 'loading');
    
    if (!navigator.geolocation) {
        updateWeatherStatus('❌ Geolocation wird nicht unterstützt.', 'error', 5000);
        return;
    }

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve, 
                reject, 
                { timeout: 10000, enableHighAccuracy: true }
            );
        });

        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        
        updateWeatherStatus('✅ GPS-Standort ermittelt', 'success', 3000);
        await getCurrentWeather();
        
    } catch (error) {
        const errorMessage = getGeolocationErrorMessage(error);
        updateWeatherStatus(`❌ Standort-Fehler: ${errorMessage}`, 'error', 5000);
    }
}

/**
 * Ermittelt Standort via IP
 */
window.getLocationByIP = async function() {
    updateWeatherStatus('🌐 Standort wird über IP ermittelt...', 'loading');
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.latitude || !data.longitude) {
            throw new Error('Keine Koordinaten in der Antwort');
        }

        currentLat = data.latitude;
        currentLon = data.longitude;
        
        updateWeatherStatus(`✅ IP-Standort: ${data.city}, ${data.country_name}`, 'success', 3000);
        await getCurrentWeather();
        
    } catch (error) {
        updateWeatherStatus(`❌ IP-Standort fehlgeschlagen: ${error.message}`, 'error', 5000);
    }
}

/**
 * Holt aktuelle Wetterdaten
 */
window.getCurrentWeather = async function() {
    updateWeatherStatus('🌤️ Wetterdaten werden geladen...', 'loading');
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current_weather=true&hourly=surface_pressure,relative_humidity_2m&timezone=auto`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.current_weather) {
            throw new Error('Keine Wetterdaten in der Antwort');
        }

        updateWeatherInputFields(data.current_weather, data.hourly);
        updateCurrentWeatherDisplay(data.current_weather);
        updateNavWeather();
        
        updateWeatherStatus('✅ Wetterdaten erfolgreich geladen!', 'success', 3000);
        
    } catch (error) {
        updateWeatherStatus(`❌ Wetterdaten-Fehler: ${error.message}`, 'error', 8000);
    }
}

/**
 * Aktualisiert die Eingabefelder mit Wetterdaten
 */
function updateWeatherInputFields(weather, hourly) {
    const fields = {
        'outside-temp': weather.temperature?.toFixed(1),
        'wind-speed': (weather.windspeed / 3.6)?.toFixed(1), // km/h zu m/s
        'wind-direction': getWindDirection(weather.winddirection),
        'air-pressure': hourly?.surface_pressure?.[0]?.toFixed(0),
        'humidity': hourly?.relative_humidity_2m?.[0]?.toFixed(0)
    };

    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field && value) {
            field.value = value;
        }
    });
}

/**
 * Aktualisiert die Wetteranzeige
 */
function updateCurrentWeatherDisplay(weather) {
    const display = document.getElementById('current-weather-display');
    if (!display) return;

    const tempElement = document.getElementById('current-temp');
    const windElement = document.getElementById('current-wind');
    const descElement = document.getElementById('current-weather-desc');

    if (tempElement) {
        tempElement.textContent = `${weather.temperature?.toFixed(0) || '--'}°C`;
    }
    
    if (windElement) {
        const windDir = getWindDirection(weather.winddirection);
        windElement.textContent = `${weather.windspeed?.toFixed(0) || '--'} km/h ${windDir}`;
    }
    
    if (descElement) {
        descElement.textContent = getWeatherDescription(weather.weathercode);
    }

    display.style.display = 'block';
}

/**
 * Überträgt Wetter-Daten ins Protokoll
 */
window.transferWeatherToProtocol = function() {
    const mappings = {
        'outside-temp': '.protocol-outside-temp',
        'wind-speed': '.protocol-wind-speed',
        'wind-direction': '.protocol-wind-direction',
        'air-pressure': '.protocol-air-pressure',
        'humidity': '.protocol-humidity'
    };

    let transferredCount = 0;

    Object.entries(mappings).forEach(([inputId, protocolSelector]) => {
        const inputElement = document.getElementById(inputId);
        if (inputElement && inputElement.value) {
            document.querySelectorAll(protocolSelector).forEach(field => {
                if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                    field.value = inputElement.value;
                } else {
                    field.textContent = inputElement.value;
                }
            });
            transferredCount++;
        }
    });

    if (transferredCount > 0) {
        updateWeatherStatus('✅ Wetterdaten ins Protokoll übertragen!', 'success', 3000);
        setTimeout(() => showPage('protocol'), 1500);
    } else {
        updateWeatherStatus('❌ Keine Wetterdaten zum Übertragen vorhanden', 'error', 3000);
    }
}

/**
 * Aktualisiert die Wetteranzeige in der Navigation
 */
window.updateNavWeather = function() {
    const temp = document.getElementById('outside-temp')?.value || '--';
    const pressure = document.getElementById('air-pressure')?.value || '--';
    
    const navTemp = document.getElementById('nav-temp');
    const navPressure = document.getElementById('nav-pressure');
    const navDisplay = document.getElementById('nav-weather-display');
    
    if (navTemp) navTemp.textContent = `${temp}°C`;
    if (navPressure) navPressure.textContent = `${pressure} hPa`;
    
    if (navDisplay && (temp !== '--' || pressure !== '--')) {
        navDisplay.classList.remove('hidden');
        navDisplay.classList.add('lg:block');
    }
}

/**
 * Hilfsfunktionen
 */
function getWindDirection(degrees) {
    if (degrees == null) return 'N/A';
    
    const directions = [
        'N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];
    
    return directions[Math.round(degrees / 22.5) % 16];
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Klarer Himmel',
        1: 'Überwiegend klar',
        2: 'Teilweise bewölkt',
        3: 'Bedeckt',
        45: 'Nebel',
        48: 'Reifnebel',
        51: 'Leichter Nieselregen',
        53: 'Mäßiger Nieselregen',
        55: 'Starker Nieselregen',
        61: 'Leichter Regen',
        63: 'Mäßiger Regen',
        65: 'Starker Regen',
        71: 'Leichter Schneefall',
        73: 'Mäßiger Schneefall',
        75: 'Starker Schneefall',
        80: 'Leichte Regenschauer',
        81: 'Mäßige Regenschauer',
        82: 'Starke Regenschauer',
        95: 'Gewitter',
        96: 'Gewitter mit Hagel',
        99: 'Gewitter mit starkem Hagel'
    };
    
    return descriptions[code] || `Unbekannt (${code})`;
}

function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "Berechtigung verweigert";
        case error.POSITION_UNAVAILABLE:
            return "Position nicht verfügbar";
        case error.TIMEOUT:
            return "Zeitüberschreitung";
        default:
            return "Unbekannter Fehler";
    }
}