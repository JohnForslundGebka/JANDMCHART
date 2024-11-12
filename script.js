import { getFilteredWeatherData } from './dataReader.js';
import { getCityNamesByCountry } from './dataReader.js';

// Get references to the slider elements and the span elements to show current values
const startYearSlider = document.getElementById('start-year-slider');
const endYearSlider = document.getElementById('end-year-slider');
const startYearValue = document.getElementById('start-year-value');
const endYearValue = document.getElementById('end-year-value');

// Set initial slider values
startYearValue.textContent = startYearSlider.value;
endYearValue.textContent = endYearSlider.value;

let weatherChart;
let amountOfDataPoints = 0;
export let citysToPrint = [];

let startYear = 1900;
let endYear = 2018;

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
                    suggestedMin: 0,
                    suggestedMax: 30,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
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

function reloadDataPointsInGraph(){
    weatherChart.data.datasets = [];
    weatherChart.data.labels = getYearsInRange();
    citysToPrint.forEach(city => {
        addDataToGraph(city);
    })
    weatherChart.update();  
}


// Function to add new data to the chart with yearly averages
export async function addDataToGraph(city) {
    try {
        const filteredData = await getFilteredWeatherData(city, startYear, endYear);

        // Calculate average temperature per year in Celsius
        const yearlyAverages = {};
        filteredData.forEach(row => {
            const year = row.year;
            const tempFahrenheit = parseFloat(row.AverageTemperatureFahr);
            const tempCelsius = (tempFahrenheit - 32) * 5 / 9;
            
            if (!yearlyAverages[year]) {
                yearlyAverages[year] = { totalTemp: 0, count: 0 };
            }
            
            yearlyAverages[year].totalTemp += tempCelsius;
            yearlyAverages[year].count += 1;
        });

        // Align average temperatures with chart labels
        const labels = weatherChart.data.labels.map(year => parseInt(year));
        const averageTemperatures = labels.map(year => {
            if (yearlyAverages[year]) {
                return yearlyAverages[year].totalTemp / yearlyAverages[year].count;
            } else {
                return null;
            }
        });

        // Add the new dataset with average temperatures in Celsius to the chart
        weatherChart.data.datasets.push({
            label: city,
            data: averageTemperatures,
            borderColor: getUniqueColor(),
            tension: 0.1,
            fill: false
        });

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


function getYearsInRange() {
    const years = [];
    
    // Loop from startYear to endYear, adding each year to the array
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    
    return years;
}


// Update the start year when the slider changes
startYearSlider.addEventListener('input', function () {
    startYear = parseInt(this.value);
    startYearValue.textContent = startYear;
    reloadDataPointsInGraph(); // Reload the chart with the new year range
});

// Update the end year when the slider changes
endYearSlider.addEventListener('input', function () {
    endYear = parseInt(this.value);
    endYearValue.textContent = endYear;
    reloadDataPointsInGraph(); // Reload the chart with the new year range
});