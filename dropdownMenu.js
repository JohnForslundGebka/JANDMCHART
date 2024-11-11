import { getAllCountryNames } from './dataReader.js';
import { getCityNamesByCountry } from './dataReader.js';
import { addDataToGraph } from './script.js';
import { getUniqueColor } from './script.js';


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
                    addDataToGraph(city,1950,1960);
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
        });

        cityTag.appendChild(removeButton);
        selectedCitiesContainer.appendChild(cityTag);
    }
