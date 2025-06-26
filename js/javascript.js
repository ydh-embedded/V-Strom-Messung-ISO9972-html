
        // Global variables
        let chart = null;
        let realMeasurements = [];
        let n50Value = 3.0;
        let volumeValue = 500;
        let pressureValue = 100;

        // Navigation
        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });

            // Show selected page
            document.getElementById(pageId).classList.add('active');

            // Update navigation buttons
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                link.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
            });

            // Activate current link
            event.target.classList.add('active');
            event.target.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');

            // Update navigation title
            const navTitle = document.getElementById('nav-title');
            if (pageId === 'measurement') {
                navTitle.textContent = 'Messung & Eingabe';
            } else if (pageId === 'analysis') {
                navTitle.textContent = 'Analyse & Ergebnisse';
            }

            // Refresh chart if on analysis page
            if (pageId === 'analysis' && chart) {
                setTimeout(() => {
                    chart.resize();
                    updateChart();
                }, 100);
            }
        }

        // Dark mode toggle
        function setupThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');

            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                themeIcon.textContent = isDark ? '☀️' : '🌙';

                // Save theme preference
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });

            // Load saved theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                themeIcon.textContent = '☀️';
            }
        }

        // Initialize measurement table
        function initializeMeasurementTable() {
            const tableBody = document.getElementById('measurementTable');

            // Add initial rows
            for (let i = 0; i < 5; i++) {
                addMeasurementRow();
            }

            // Add measurement row button
            document.getElementById('addMeasurementRow').addEventListener('click', addMeasurementRow);

            // Clear measurements button
            document.getElementById('clearMeasurements').addEventListener('click', clearMeasurements);
        }

        function addMeasurementRow() {
            const tableBody = document.getElementById('measurementTable');
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';

            row.innerHTML = `
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <input type="number" step="0.1" placeholder="z.B. 25.5" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                           onchange="updateMeasurements()">
                </td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <input type="number" step="0.1" placeholder="z.B. 485.2" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                           onchange="updateMeasurements()">
                </td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-center">
                    <button onclick="removeRow(this)" 
                            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
                        Löschen
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        }

        function removeRow(button) {
            button.closest('tr').remove();
            updateMeasurements();
        }

        function clearMeasurements() {
            const tableBody = document.getElementById('measurementTable');
            tableBody.innerHTML = '';
            realMeasurements = [];
            updateChart();

            // Add a few empty rows
            for (let i = 0; i < 3; i++) {
                addMeasurementRow();
            }
        }

        function updateMeasurements() {
            const rows = document.querySelectorAll('#measurementTable tr');
            realMeasurements = [];

            rows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                const pressure = parseFloat(inputs[0].value);
                const flow = parseFloat(inputs[1].value);

                if (!isNaN(pressure) && !isNaN(flow) && pressure > 0 && flow > 0) {
                    realMeasurements.push({ x: pressure, y: flow });
                }
            });

            updateChart();
        }

        // Initialize sliders
        function setupSliders() {
            const n50Slider = document.getElementById('n50');
            const volumeSlider = document.getElementById('volume');
            const pressureSlider = document.getElementById('pressure');

            n50Slider.addEventListener('input', (e) => {
                n50Value = parseFloat(e.target.value);
                document.getElementById('n50-value').textContent = n50Value.toFixed(1);
                updateCalculatedValues();
                updateChart();
            });

            volumeSlider.addEventListener('input', (e) => {
                volumeValue = parseInt(e.target.value);
                document.getElementById('volume-value').textContent = volumeValue;
                updateCalculatedValues();
                updateChart();
            });

            pressureSlider.addEventListener('input', (e) => {
                pressureValue = parseInt(e.target.value);
                document.getElementById('pressure-value').textContent = pressureValue;
                updateChart();
            });
        }

        // Update calculated values
        function updateCalculatedValues() {
            const v50 = (n50Value * volumeValue).toFixed(0);
            const q50 = (n50Value * 2.4).toFixed(2); // Assuming 250 m² envelope area

            document.getElementById('calc-n50').textContent = n50Value.toFixed(1);
            document.getElementById('calc-q50').textContent = q50;
            document.getElementById('calc-v50').textContent = v50;
        }

        // Initialize chart
        function initializeChart() {
            const ctx = document.getElementById('chart');
            if (!ctx) return;

            try {
                chart = new Chart(ctx, {
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
                                    text: 'Differenzdruck [Pa]'
                                },
                                min: 0,
                                max: 120
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Volumenstrom [m³/h]'
                                },
                                min: 0
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.dataset.label}: (${context.parsed.x.toFixed(1)} Pa, ${context.parsed.y.toFixed(1)} m³/h)`;
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'point'
                        }
                    }
                });

                updateChart();
                document.getElementById('chart-error').classList.add('hidden');
            } catch (error) {
                console.error('Chart initialization error:', error);
                document.getElementById('chart-error').classList.remove('hidden');
            }
        }

        // Update chart
        function updateChart() {
            if (!chart) return;

            const datasets = [];

            // Check visibility options
            const showTheoretical = document.getElementById('showTheoretical')?.checked ?? true;
            const showSimulated = document.getElementById('showSimulated')?.checked ?? false;
            const showReal = document.getElementById('showReal')?.checked ?? true;

            // Theoretical curve
            if (showTheoretical) {
                const theoreticalData = [];
                const v50 = n50Value * volumeValue;
                const n = 0.65; // Typical flow exponent

                for (let pressure = 10; pressure <= pressureValue; pressure += 5) {
                    const flow = v50 * Math.pow(pressure / 50, n);
                    theoreticalData.push({ x: pressure, y: flow });
                }

                datasets.push({
                    label: 'Theoretische Kurve',
                    data: theoreticalData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    showLine: true,
                    pointRadius: 0,
                    tension: 0.4
                });
            }

            // Simulated measurements
            if (showSimulated) {
                const simulatedData = [];
                const v50 = n50Value * volumeValue;
                const n = 0.65;

                for (let pressure = 20; pressure <= Math.min(pressureValue, 100); pressure += 15) {
                    const baseFlow = v50 * Math.pow(pressure / 50, n);
                    const noise = (Math.random() - 0.5) * baseFlow * 0.1; // ±5% noise
                    simulatedData.push({ x: pressure, y: Math.max(0, baseFlow + noise) });
                }

                datasets.push({
                    label: 'Simulierte Messpunkte',
                    data: simulatedData,
                    borderColor: 'rgb(245, 158, 11)',
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderWidth: 2,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                });
            }

            // Real measurements
            if (showReal && realMeasurements.length > 0) {
                datasets.push({
                    label: 'Reale Messpunkte',
                    data: realMeasurements,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderWidth: 2,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                });
            }

            chart.data.datasets = datasets;
            chart.update('none');
        }

        // Setup checkbox listeners
        function setupCheckboxListeners() {
            const checkboxes = ['showTheoretical', 'showSimulated', 'showReal'];
            checkboxes.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.addEventListener('change', updateChart);
                }
            });
        }

        // Initialize everything
        document.addEventListener('DOMContentLoaded', function () {
            setupThemeToggle();
            setupSliders();
            initializeMeasurementTable();
            setupCheckboxListeners();
            updateCalculatedValues();

            // Initialize chart after a short delay to ensure DOM is ready
            setTimeout(() => {
                initializeChart();
            }, 100);
        });

        // Handle window resize
        window.addEventListener('resize', function () {
            if (chart) {
                chart.resize();
            }
        });