
import Papa from 'papaparse';
import { Chart } from 'chart.js';

    // Get the canvas element
    const ctx = document.getElementById('weatherChart').getContext('2d');

    // Sample weather data (you'll replace this with real data later)
    const weatherData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        temperatures: [20, 22, 19, 24, 21]
    };

    // Create the chart
    const myChart = new Chart(ctx, {
        type: 'line',  // You can change this to 'bar', 'pie', etc.
        data: {
            labels: weatherData.labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: weatherData.temperatures,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Weather Temperature Data'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day'
                    }
                }
            }
        }
    });