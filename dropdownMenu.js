// JavaScript Code
document.addEventListener('DOMContentLoaded', () => {
    // Array of countries
    const countries = ["Sweden", "France", "USA", "Germany", "Australia"];

    // Get the dropdown element
    const countryDropdown = document.getElementById('country-dropdown');

    // Populate dropdown with countries
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.toLowerCase(); // Lowercase value for easy comparison
        option.textContent = country;
        countryDropdown.appendChild(option);
    });

    // Event listener for when a country is selected
    countryDropdown.addEventListener('change', function () {
        const selectedCountry = this.value;
        
        // Clear previous city results
        const cityResultsContainer = document.getElementById('city-results');
        cityResultsContainer.innerHTML = '';

        // Example array of cities for each country (simulate CSV data)
        const citiesData = {
            sweden: ['Stockholm', 'Gothenburg', 'Malmö'],
            france: ['Paris', 'Lyon', 'Marseille'],
            usa: ['New York', 'Los Angeles', 'Chicago'],
            germany: ['Berlin', 'Hamburg', 'Munich'],
            australia: ['Sydney', 'Melbourne', 'Brisbane']
        };

        // If cities exist for the selected country, display them
        if (citiesData[selectedCountry]) {
            citiesData[selectedCountry].forEach(city => {
                const cityItem = document.createElement('div');
                cityItem.classList.add('city-item');
                cityItem.textContent = city;

                // Add click event to each city to add it to selectedPlaces
                cityItem.addEventListener('click', function () {
                    addCityToSelected(city);
                });

                cityResultsContainer.appendChild(cityItem);
            });
        } else {
            // If no cities found, display a message
            cityResultsContainer.textContent = 'No cities found for this country.';
        }
    });

    // Function to add selected city as a tag in selectedPlaces
    function addCityToSelected(city) {
        const selectedCitiesContainer = document.getElementById('selected-cities');

        // Create a new tag for the selected city
        const cityTag = document.createElement('span');
        cityTag.classList.add('tag');
        cityTag.textContent = `${city}`;

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
});