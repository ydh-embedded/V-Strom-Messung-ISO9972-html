
        // Globale Variablen
        let myChart = null;
        let realMeasurements = [];
        let isDarkMode = false;

        // Warten bis DOM und Chart.js geladen sind
        document.addEventListener('DOMContentLoaded', function() {
            // Überprüfen ob Chart.js verfügbar ist
            if (typeof Chart === 'undefined') {
                console.error('Chart.js ist nicht verfügbar!');
                document.getElementById('chart-error').classList.remove('hidden');
                return;
            }

            console.log('Chart.js erfolgreich geladen, Version:', Chart.version);
            
            // Initialisierung
            initializeApp();
        });

        function initializeApp() {
            try {
                // Event Listeners hinzufügen
                setupEventListeners();
                
                // Initiale Messpunkt-Zeilen hinzufügen
                addMeasurementRow();
                addMeasurementRow();
                addMeasurementRow();
                
                // Chart initialisieren
                initializeChart();
                
                // Initiale Berechnung
                updateCalculations();
                
                // Input-Styles initialisieren
                updateInputStyles();
                
                // Chart Theme initialisieren
                updateChartTheme();
                
                console.log('App erfolgreich initialisiert');
            } catch (error) {
                console.error('Fehler bei der App-Initialisierung:', error);
                document.getElementById('chart-error').classList.remove('hidden');
            }
        }

        function setupEventListeners() {
            // Slider Event Listeners
            document.getElementById('n50').addEventListener('input', function() {
                document.getElementById('n50-value').textContent = this.value;
                updateCalculations();
            });

            document.getElementById('volume').addEventListener('input', function() {
                document.getElementById('volume-value').textContent = this.value;
                updateCalculations();
            });

            document.getElementById('pressure').addEventListener('input', function() {
                document.getElementById('pressure-value').textContent = this.value;
                updateCalculations();
            });

            // Checkbox Event Listeners
            document.getElementById('showTheoretical').addEventListener('change', updateChart);
            document.getElementById('showSimulated').addEventListener('change', updateChart);
            document.getElementById('showReal').addEventListener('change', updateChart);

            // Button Event Listeners
            document.getElementById('addMeasurementRow').addEventListener('click', addMeasurementRow);
            document.getElementById('clearMeasurements').addEventListener('click', clearMeasurements);

            // Dark Mode Toggle
            document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
        }

        function initializeChart() {
            const ctx = document.getElementById('chart').getContext('2d');
            
            // Theme-abhängige Farben bestimmen
            const isDark = document.body.classList.contains('dark');
            const textColor = isDark ? '#e5e7eb' : '#374151';
            const gridColor = isDark ? '#374151' : '#e5e7eb';
            
            myChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Differenzdruck [Pa]',
                                color: textColor,
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: textColor,
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: gridColor,
                                borderColor: textColor
                            },
                            min: 0,
                            max: 120
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Volumenstrom [m³/h]',
                                color: textColor,
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: textColor,
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: gridColor,
                                borderColor: textColor
                            },
                            min: 0
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: textColor,
                                font: {
                                    size: 13,
                                    weight: 'bold'
                                },
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            mode: 'point',
                            intersect: false,
                            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            titleColor: textColor,
                            bodyColor: textColor,
                            borderColor: textColor,
                            borderWidth: 1
                        }
                    }
                }
            });

            updateChart();
        }

        function updateCalculations() {
            const n50 = parseFloat(document.getElementById('n50').value);
            const volume = parseFloat(document.getElementById('volume').value);
            const pressure = parseFloat(document.getElementById('pressure').value);

            // Angenommene Gebäudehülle (vereinfacht)
            const assumedEnvelopeArea = Math.pow(volume, 2/3) * 6; // Vereinfachte Annahme für kubisches Gebäude
            
            // V50 berechnen
            const v50 = n50 * volume;
            
            // q50 berechnen
            const q50 = v50 / assumedEnvelopeArea;

            // Werte anzeigen
            document.getElementById('calc-n50').textContent = n50.toFixed(1);
            document.getElementById('calc-q50').textContent = q50.toFixed(2);
            document.getElementById('calc-v50').textContent = Math.round(v50);

            updateChart();
        }

        function updateChart() {
            if (!myChart) return;

            const n50 = parseFloat(document.getElementById('n50').value);
            const volume = parseFloat(document.getElementById('volume').value);
            const pressure = parseFloat(document.getElementById('pressure').value);
            const v50 = n50 * volume;

            // Theoretische Daten generieren
            const theoreticalData = [];
            const n = 0.65; // Typischer Exponent für turbulente Strömung
            for (let p = 10; p <= pressure; p += 5) {
                const flow = v50 * Math.pow(p / 50, n);
                theoreticalData.push({ x: p, y: flow });
            }

            // Simulierte Messpunkte (mit etwas Rauschen)
            const simulatedData = [];
            for (let p = 15; p <= pressure; p += 10) {
                const theoreticalFlow = v50 * Math.pow(p / 50, n);
                const noise = (Math.random() - 0.5) * theoreticalFlow * 0.1; // 10% Rauschen
                simulatedData.push({ x: p, y: Math.max(0, theoreticalFlow + noise) });
            }

            // Reale Messpunkte sammeln
            const realData = [];
            const rows = document.querySelectorAll('#measurementTable tr');
            rows.forEach(row => {
                const pressureInput = row.querySelector('input[placeholder="z.B. 50"]');
                const flowInput = row.querySelector('input[placeholder="z.B. 1500"]');
                
                if (pressureInput && flowInput) {
                    const p = parseFloat(pressureInput.value);
                    const f = parseFloat(flowInput.value);
                    
                    if (!isNaN(p) && !isNaN(f) && p > 0 && f > 0) {
                        realData.push({ x: p, y: f });
                    }
                }
            });

            // Datasets für Chart
            const datasets = [];

            if (document.getElementById('showTheoretical').checked) {
                datasets.push({
                    label: 'Theoretische Kurve',
                    data: theoreticalData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    type: 'line',
                    tension: 0.4,
                    pointRadius: 0,
                    borderWidth: 2
                });
            }

            if (document.getElementById('showSimulated').checked) {
                datasets.push({
                    label: 'Simulierte Messpunkte',
                    data: simulatedData,
                    borderColor: 'rgb(245, 158, 11)',
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                });
            }

            if (document.getElementById('showReal').checked && realData.length > 0) {
                datasets.push({
                    label: 'Reale Messpunkte',
                    data: realData,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                });
            }

            myChart.data.datasets = datasets;
            myChart.update();
        }

        function addMeasurementRow() {
            const tbody = document.getElementById('measurementTable');
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
            
            row.innerHTML = `
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <input type="number" placeholder="z.B. 50" min="0" max="200" 
                           class="measurement-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                  placeholder-gray-500 dark:placeholder-gray-400"
                           oninput="validateInput(this); updateChart();">
                </td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <input type="number" placeholder="z.B. 1500" min="0" 
                           class="measurement-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                  placeholder-gray-500 dark:placeholder-gray-400"
                           oninput="validateInput(this); updateChart();">
                </td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                    <button onclick="removeRow(this)" 
                            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                        Löschen
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
            
            // Dark Mode für neue Inputs aktualisieren
            updateInputStyles();
        }

        function removeRow(button) {
            button.closest('tr').remove();
            updateChart();
        }

        function clearMeasurements() {
            document.getElementById('measurementTable').innerHTML = '';
            updateChart();
        }

        function validateInput(input) {
            const value = parseFloat(input.value);
            const isDark = document.body.classList.contains('dark');
            
            if (isNaN(value) || value <= 0) {
                input.style.borderColor = '#ef4444';
                input.style.backgroundColor = isDark ? '#7f1d1d' : '#fef2f2';
                input.style.color = isDark ? '#fca5a5' : '#dc2626';
            } else {
                input.style.borderColor = '#10b981';
                input.style.backgroundColor = isDark ? '#064e3b' : '#f0fdf4';
                input.style.color = isDark ? '#6ee7b7' : '#059669';
            }
        }

        function updateInputStyles() {
            const isDark = document.body.classList.contains('dark');
            const inputs = document.querySelectorAll('.measurement-input');
            
            inputs.forEach(input => {
                if (isDark) {
                    input.style.backgroundColor = '#374151';
                    input.style.color = '#e5e7eb';
                    input.style.borderColor = '#4b5563';
                } else {
                    input.style.backgroundColor = '#ffffff';
                    input.style.color = '#111827';
                    input.style.borderColor = '#d1d5db';
                }
            });
        }

        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark');
            
            // Icon ändern
            const icon = document.getElementById('theme-icon');
            icon.textContent = isDarkMode ? '☀️' : '🌙';
            
            // Input-Felder aktualisieren
            updateInputStyles();
            
            // Chart Theme vollständig aktualisieren
            updateChartTheme();
        }

        function updateChartTheme() {
            if (!myChart) return;
            
            const isDark = document.body.classList.contains('dark');
            const textColor = isDark ? '#e5e7eb' : '#374151';
            const gridColor = isDark ? '#374151' : '#e5e7eb';
            
            // Achsen-Beschriftungen aktualisieren
            myChart.options.scales.x.title.color = textColor;
            myChart.options.scales.y.title.color = textColor;
            myChart.options.scales.x.ticks.color = textColor;
            myChart.options.scales.y.ticks.color = textColor;
            
            // Grid-Farben aktualisieren
            myChart.options.scales.x.grid.color = gridColor;
            myChart.options.scales.y.grid.color = gridColor;
            myChart.options.scales.x.grid.borderColor = textColor;
            myChart.options.scales.y.grid.borderColor = textColor;
            
            // Legende aktualisieren
            myChart.options.plugins.legend.labels.color = textColor;
            
            // Tooltip aktualisieren
            myChart.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)';
            myChart.options.plugins.tooltip.titleColor = textColor;
            myChart.options.plugins.tooltip.bodyColor = textColor;
            myChart.options.plugins.tooltip.borderColor = textColor;
            
            myChart.update('none'); // Ohne Animation für sofortiges Update
        }

        // Keyboard Shortcuts
        document.addEventListener('keydown', function(e) {
            // Strg + Enter für neue Zeile
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                addMeasurementRow();
            }
            
            // Escape für Dark Mode Toggle
            if (e.key === 'Escape') {
                toggleDarkMode();
            }
        });

        // Error Handling für Chart.js
        window.addEventListener('error', function(e) {
            if (e.message.includes('Chart')) {
                console.error('Chart.js Fehler:', e);
                document.getElementById('chart-error').classList.remove('hidden');
            }
        });

        // Responsive Chart Resize
        window.addEventListener('resize', function() {
            if (myChart) {
                myChart.resize();
            }
        });