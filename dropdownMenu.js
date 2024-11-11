import { getAllCountryNames } from './dataReader.js';
import { getCityNamesByCountry } from './dataReader.js';
import { addDataToGraph } from './script.js';
import { getUniqueColor } from './script.js';
import { removeDataFromGraph } from './script.js';


    // Array of countries
    const countries = await getAllCountryNames();

    // Get the dropdown element
    const countryDropdown = document.getElementById('country-dropdown');

    // Populate dropdown with countries
    countries.forEach(country => {
        const option = document.createElement('option');
        option.textContent = country;
        countryDropdown.appendChild(option);
    });

    // Event listener for when a country is selected
    countryDropdown.addEventListener('change', async function () {
        const selectedCountry = this.value;
        
        // Clear previous city results
        const cityResultsContainer = document.getElementById('city-results');
        cityResultsContainer.innerHTML = '';

        // Example array of cities for each country (simulate CSV data)
        const citiesData = await getCityNamesByCountry(selectedCountry);
           
        
        citiesData.forEach(city => {
            const cityItem = document.createElement('div');
            cityItem.classList.add('city-item');
            cityItem.textContent = city;

            // Add click event to each city to add it to selectedPlaces
                cityItem.addEventListener('click', function () {
                    addDataToGraph(city);
                    addCityToSelected(city);
                });

                cityResultsContainer.appendChild(cityItem);
        })

    });

    // Function to add selected city as a tag in selectedPlaces
    function addCityToSelected(city) {

        console.log("VI börjar addcity");
        const selectedCitiesContainer = document.getElementById('tag-container');

        // Create a new tag for the selected city
        const cityTag = document.createElement('span');
        cityTag.classList.add('tag');
        cityTag.textContent = `${city}`;

        cityTag.style.backgroundColor = getUniqueColor();
        
        // Add remove button to the tag
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = '✖'; 
        removeButton.addEventListener('click', function () {
            selectedCitiesContainer.removeChild(cityTag);
            removeDataFromGraph(city);
        });

        cityTag.appendChild(removeButton);
        selectedCitiesContainer.appendChild(cityTag);
    }


// Year range and selected start and end year
let startYear = 1910;
let endYear = 2005;

// Slider element
const yearSlider = document.getElementById('year-slider');
const yearRangeDisplay = document.getElementById('year-range');

// Initialize noUiSlider with two handles
noUiSlider.create(yearSlider, {
    start: [startYear, endYear], // Initial start and end years
    connect: true,
    range: {
        min: 1910,
        max: 2020
    },
    step: 1, // Step by 1 year
    tooltips: true, // Show tooltips on handles
    format: {
        to: value => Math.round(value),
        from: value => Math.round(value)
    }
});

// Update startYear and endYear when the slider values change
yearSlider.noUiSlider.on('update', function (values) {
    startYear = parseInt(values[0]);
    endYear = parseInt(values[1]);

    // Update the displayed range
    yearRangeDisplay.textContent = `${startYear} - ${endYear}`;
});

// Optional: Add a listener to trigger data reload based on slider movement
yearSlider.noUiSlider.on('change', function () {
    reloadDataPointsInGraph(startYear, endYear); // Call function to reload data based on the selected range
});
