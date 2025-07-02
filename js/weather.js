// js/weather.js

// Globale Variablen für den Standort mit Standardwerten (Berlin)
let currentLat = 52.52;
let currentLon = 13.40;

/**
 * Initialisiert das Wettersystem.
 */
window.initWeatherSystem = function() {
    updateWeatherStatus('🚀 Bereit! Standort ermitteln oder Daten manuell eingeben.', '', 5000);
}

/**
 * Aktualisiert die Statusanzeige im Wetter-Tab.
 */
function updateWeatherStatus(message, type = '', timeout = 0) {
    const statusElement = document.getElementById('weather-status');
    if (!statusElement) return;

    const typeClasses = {
        loading: 'bg-blue-800 text-blue-200',
        success: 'bg-green-800 text-green-200',
        error: 'bg-red-800 text-red-200'
    };

    statusElement.className = 'weather-status text-center mt-4 p-2 rounded-md'; // Reset
    if (type && typeClasses[type]) {
        statusElement.classList.add(...typeClasses[type].split(' '));
    }

    statusElement.textContent = message;
    statusElement.style.display = message ? 'block' : 'none';

    if (timeout > 0) setTimeout(() => { statusElement.style.display = 'none'; }, timeout);
}

/**
 * Holt den Standort des Benutzers über die Browser-Geolocation-API.
 */
window.getUserLocation = async function() {
    updateWeatherStatus('📍 Standort wird ermittelt...', 'loading');
    if (!navigator.geolocation) {
        updateWeatherStatus('❌ Geolocation wird von diesem Browser nicht unterstützt.', 'error', 5000);
        return;
    }
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        currentLat = position.coords.latitude;
        currentLon = position.coords.longitude;
        updateWeatherStatus(`✅ GPS-Standort ermittelt.`, 'success', 3000);
        getCurrentWeather();
    } catch (error) {
        updateWeatherStatus(`❌ Standortzugriff fehlgeschlagen: ${error.message}`, 'error', 5000);
    }
}

/**
 * Holt den Standort über eine IP-Geolocation-API.
 */
window.getLocationByIP = async function() {
    updateWeatherStatus('🌐 Standort wird über IP ermittelt...', 'loading');
    try {
        const response = await fetch('https://ipapi.co/json/' );
        if (!response.ok) throw new Error(`HTTP-Status: ${response.status}`);
        const data = await response.json();
        if (data.latitude && data.longitude) {
            currentLat = data.latitude;
            currentLon = data.longitude;
            updateWeatherStatus(`✅ IP-Standort: ${data.city}, ${data.country_name}`, 'success', 3000);
            getCurrentWeather();
        } else {
            throw new Error('Keine Koordinaten in der Antwort gefunden.');
        }
    } catch (error) {
        updateWeatherStatus(`❌ IP-Standort fehlgeschlagen: ${error.message}`, 'error', 5000);
    }
}

/**
 * Holt die aktuellen Wetterdaten von Open-Meteo.
 */
window.getCurrentWeather = async function() {
    updateWeatherStatus('🌤️ Wetterdaten werden geladen...', 'loading');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current_weather=true&hourly=surface_pressure,relative_humidity_2m&timezone=auto`;
    try {
        const response = await fetch(url );
        if (!response.ok) throw new Error(`HTTP-Status: ${response.status}`);
        const data = await response.json();
        if (!data.current_weather) throw new Error('Keine Wetterdaten in API-Antwort.');
        
        updateWeatherInputFields(data.current_weather, data.hourly);
        updateCurrentWeatherDisplay(data.current_weather);
        updateWeatherStatus('✅ Wetterdaten erfolgreich geladen!', 'success', 3000);
    } catch (error) {
        updateWeatherStatus(`❌ Fehler beim Laden der Wetterdaten: ${error.message}`, 'error', 8000);
    }
}

/**
 * Füllt die Eingabefelder mit den abgerufenen Wetterdaten.
 */
function updateWeatherInputFields(weather, hourly) {
    document.getElementById('outside-temp').value = weather.temperature?.toFixed(1) || '';
    document.getElementById('wind-speed').value = (weather.windspeed / 3.6)?.toFixed(1) || ''; // km/h to m/s
    document.getElementById('wind-direction').value = getWindDirection(weather.winddirection) || '';
    document.getElementById('air-pressure').value = hourly?.surface_pressure?.[0]?.toFixed(0) || '';
    document.getElementById('humidity').value = hourly?.relative_humidity_2m?.[0]?.toFixed(0) || '';
}

/**
 * Aktualisiert die kleine Wetteranzeige auf der Wetter-Seite.
 */
function updateCurrentWeatherDisplay(weather) {
    const display = document.getElementById('current-weather-display');
    if (!display) return;
    document.getElementById('current-temp').textContent = `${weather.temperature?.toFixed(0) || '--'}°C`;
    document.getElementById('current-wind').textContent = `${weather.windspeed?.toFixed(0) || '--'} km/h ${getWindDirection(weather.winddirection)}`;
    document.getElementById('current-weather-desc').textContent = getWeatherDescription(weather.weathercode);
    display.style.display = 'block';
}

/**
 * Überträgt die Wetterdaten von der Wetter-Seite in die Protokoll-Seite.
 */
window.transferWeatherToProtocol = function() {
    const mappings = {
        'outside-temp': '.protocol-outside-temp',
        'wind-speed': '.protocol-wind-speed',
        'wind-direction': '.protocol-wind-direction',
    };
    Object.entries(mappings).forEach(([inputId, protocolSelector]) => {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            document.querySelectorAll(protocolSelector).forEach(field => {
                if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                    field.value = inputElement.value;
                } else {
                    field.textContent = inputElement.value;
                }
            });
        }
    });
    updateWeatherStatus('✅ Daten ins Protokoll übertragen!', 'success', 3000);
    setTimeout(() => showPage('protocol'), 1500);
}

/**
 * Konvertiert Windrichtung in Grad zu einer Himmelsrichtung (z.B. "NNO").
 */
function getWindDirection(degrees) {
    if (degrees === undefined || degrees === null) return 'N/A';
    const directions = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
}

/**
 * Gibt eine deutsche Beschreibung für einen WMO-Wettercode zurück.
 */
function getWeatherDescription(code) {
    const descriptions = { 0: 'Klarer Himmel', 1: 'Überwiegend klar', 2: 'Teilweise bewölkt', 3: 'Bedeckt', 45: 'Nebel', 61: 'Leichter Regen', 63: 'Mäßiger Regen', 65: 'Starker Regen', 71: 'Leichter Schneefall', 80: 'Regenschauer', 95: 'Gewitter' };
    return descriptions[code] || `Code: ${code}`;
}

/**
 * Aktualisiert die Wetteranzeige in der Navigationsleiste.
 */
window.updateNavWeather = function() {
    const temp = document.getElementById('outside-temp')?.value || '--';
    const pressure = document.getElementById('air-pressure')?.value || '--';
    document.getElementById('nav-temp').textContent = temp;
    document.getElementById('nav-pressure').textContent = pressure;
    const navDisplay = document.getElementById('nav-weather-display');
    if (navDisplay && (temp !== '--' || pressure !== '--')) {
        navDisplay.classList.remove('hidden');
        navDisplay.classList.add('lg:block');
    }
}
