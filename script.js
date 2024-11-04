import { getFilteredWeatherData } from './dataReader.js';
import { getCityNamesByCountry } from './dataReader.js';


try {
    // Get filtered weather data for Stockholm between 1950 and 2010
    const filteredData = await getFilteredWeatherData("Stockholm", 1950, 1960);

    // Extract years and temperatures from the filtered data
    const years = filteredData.map(row => row.year);
    const temperatures = filteredData.map(row => parseFloat(row.AverageTemperatureFahr));

    // Get the canvas context from the HTML
    const ctx = document.getElementById('weatherChart').getContext('2d');


    // Create the chart using Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                data: temperatures,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // Disable the default legend
                }
            },
            scales: {
                y: {
                    suggestedMin: 50,
                    suggestedMax: 70,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°F)'
                    }
                },
                x: {
                    suggestedMin: 1950,
                    suggestedMax: 1960,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
} catch (error) {
    console.error('Error while drawing chart:', error);
}




