

export function getFilteredWeatherData(city, yearFrom, yearTo) {
    return fetch('temperature.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: function(results) {
                        const data = results.data;
                        // Filter data based on the provided parameters
                        const filteredData = data.filter(row => {
                            return (
                                row.City === city &&
                                row.year >= yearFrom &&
                                row.year <= yearTo &&
                                row.AverageTemperatureFahr !== 'NA'
                            );
                        });

                        // Resolve the promise with filtered data
                        resolve(filteredData);
                    },
                    error: function(error) {
                        reject('Error parsing CSV: ' + error);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching CSV:', error);
            throw error; // Rethrow the error to allow further handling
        });
}

export function getCityNamesByCountry(country) {
    return fetch('temperature.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: function(results) {
                        const data = results.data;
                        
                        // Filter the data to only include rows that match the specified country
                        const filteredData = data.filter(row => row.Country === country);

                        // Extract unique city names from the filtered data
                        const cities = filteredData.map(row => row.City);
                        const uniqueCities = [...new Set(cities)]; // Create a unique list of cities

                        // Resolve the promise with the unique city names
                        resolve(uniqueCities);
                    },
                    error: function(error) {
                        reject('Error parsing CSV: ' + error);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching CSV:', error);
            throw error; // Rethrow the error to allow further handling
        });
}


export function getAllCountryNames() {
    return fetch('temperature.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            return new Promise((resolve, reject) => {
                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    complete: function(results) {
                        const data = results.data;

                        // Extract unique country names from the data
                        const countries = data.map(row => row.Country);
                        const uniqueCountries = [...new Set(countries)]; // Create a unique list of countries

                        // Resolve the promise with the unique country names
                        resolve(uniqueCountries);
                    },
                    error: function(error) {
                        reject('Error parsing CSV: ' + error);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching CSV:', error);
            throw error; // Rethrow the error to allow further handling
        });
}