

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
