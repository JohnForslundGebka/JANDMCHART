import { getFilteredWeatherData } from './dataReader.js';
import { getCityNamesByCountry } from './dataReader.js';

let weatherChart;

let amountOfDataPonts = 0;

//create init graph
try {
    // Get filtered weather data for Stockholm between 1950 and 2010
    const filteredData = await getFilteredWeatherData("Stockholm", 1950, 1960);

    // Extract years and temperatures from the filtered data
    const years = filteredData.map(row => row.year);
    const temperatures = filteredData.map(row => parseFloat(row.AverageTemperatureFahr));

    // Get the canvas context from the HTML
    const ctx = document.getElementById('weatherChart').getContext('2d');


    // Create the chart using Chart.js
    weatherChart = new Chart(ctx, {
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



// Function to add new data to the chart
export async function addDataToGraph(city, startYear, endYear) {
    try {
        // Get new filtered weather data for the specified city and year range
        const filteredData = await getFilteredWeatherData(city, startYear, endYear);

        // Extract years and temperatures
        const years = filteredData.map(row => row.year);
        const temperatures = filteredData.map(row => parseFloat(row.AverageTemperatureFahr));

        // Add the new dataset to the existing chart
        weatherChart.data.datasets.push({
            label: `${city} Temperature (${startYear}-${endYear})`,
            data: temperatures,
            borderColor: getUniqueColor(), // Optionally set a unique color for each dataset
            tension: 0.1,
            fill: false
        });

        // Update the chart to render the new dataset
        weatherChart.update();

    } catch (error) {
        console.error('Error while adding data to chart:', error);
    }
}


// Array of 20 distinct colors
const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF3',
    '#F3FF33', '#FF8C33', '#8C33FF', '#33FF8C', '#FF3380',
    '#8033FF', '#33A8FF', '#A8FF33', '#FF33F3', '#F333FF',
    '#33F3FF', '#FF5733', '#5733FF', '#33FF57', '#FF33A8'
];

// Function to get a unique color
function getUniqueColor() {
    if (colors.length === 0) {
        console.error("No more colors available. All unique colors have been used.");
        return '#000000'; // Fallback color if all colors are used
    }
    return colors.shift(); // Remove and return the first color
}



