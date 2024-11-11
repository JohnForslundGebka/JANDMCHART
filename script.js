import { getFilteredWeatherData } from './dataReader.js';
import { getCityNamesByCountry } from './dataReader.js';

let weatherChart;
let amountOfDataPoints = 0;
let citysToPrint = [];

let startYear = 1910;
let endYear = 2005;

//create init graph
try {
    // Get filtered weather data for Stockholm between 1950 and 2010
    const filteredData = await getFilteredWeatherData("Stockholm", startYear, endYear);

    // Extract years and temperatures from the filtered data
    const years = filteredData.map(row => row.year);

    // Get the canvas context from the HTML
    const ctx = document.getElementById('weatherChart').getContext('2d');


    // Create the chart using Chart.js
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: getYearsInRange(),
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

export async function reloadDataPointsInGraph(startYear, endYear) {
    // Clear and reload the chart data
    weatherChart.clear();
    weatherChart.data.labels = getYearsInRange(startYear, endYear);

    citysToPrint.forEach(city => {
        addDataToGraph(city, startYear, endYear);
    });

    weatherChart.update();  
}

// Function to add new data to the chart
export async function addDataToGraph(city) {
    try {
        
        citysToPrint.push("city");
        // Get new filtered weather data for the specified city and year range
        const filteredData = await getFilteredWeatherData(city, startYear, endYear);

        // Extract years and temperatures
        const years = filteredData.map(row => row.year);
        const temperatures = filteredData.map(row => parseFloat(row.AverageTemperatureFahr));
        
        // Add the new dataset to the existing chart
        weatherChart.data.datasets.push({
            label: `${city}`,
            data: temperatures,
            borderColor: colors[amountOfDataPoints], 
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
export function getUniqueColor() {
    if (amountOfDataPoints > colors.length) {
        console.error("No more colors available. All unique colors have been used.");
        return '#000000'; // Fallback color if all colors are used
    }
    //Increment the graph data points counter for unique colors
    amountOfDataPoints++;
    return colors[amountOfDataPoints]; // Remove and return the first color
}


export function removeDataFromGraph(city){

    // Find the index of the dataset with the matching label
    const datasetIndex = weatherChart.data.datasets.findIndex(dataset => 
      dataset.label && dataset.label.startsWith(city) // Ensure label exists before calling startsWith
    );
    // If the dataset is found, remove it from the datasets array
    if (datasetIndex !== -1) {
        weatherChart.data.datasets.splice(datasetIndex, 1);
        weatherChart.update(); // Update the chart to reflect the changes
    } else {
        console.log(`Dataset for ${city} not found.`);
    }
}


// Adjust getYearsInRange to accept start and end parameters
function getYearsInRange(startYear, endYear) {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
}