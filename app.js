const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherDisplay = document.getElementById('weather-result');
const temperature = document.getElementById('temperature');
const windSpeed = document.getElementById('wind-speed');
const cityInfo = document.getElementById('city-info');
const population = document.getElementById('population');
const lastUpdated = document.getElementById('last-updated');
const forecastDetails = document.getElementById('forecast-details');
const resetButton = document.getElementById('reset-button');
const countryInfo = document.getElementById('country');

const updateBackground = (isDay) => {
    const body = document.body;
    if (isDay) {
        body.style.backgroundImage = "url('./images/day.jpg')";
    } else {
        body.style.backgroundImage = "url('./images/night.jpg')";
    }
};

const fetchCity = (cityName) => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`)
    .then(response => response.json())
    .then(data => {
        if (data.results && data.results.length > 0) {
            const { latitude, longitude, name, country, population: cityPopulation } = data.results[0];
            fetchWeather(latitude, longitude, name, country, cityPopulation);
        } else {
            alert('City not found. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching city:', error);
        alert('Error fetching city data. Please try again.');
    });
};

const fetchWeather = (latitude, longitude, cityName, country, cityPopulation) => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=2`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        updateBackground(data.current.is_day === 1);
        
        temperature.textContent = `${data.current.temperature_2m}${data.current_units.temperature_2m}`;
        windSpeed.textContent = `Wind Speed: ${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;
        cityInfo.textContent = cityName;
        countryInfo.textContent = country;
        
        if (cityPopulation) {
            population.textContent = `Population: ${cityPopulation.toLocaleString()}`;
        } else {
            population.textContent = `Population: N/A`;
        }
        
        const date = new Date(data.current.time);
        lastUpdated.textContent = `Last Updated: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        
        if (data.daily && data.daily.time.length > 1) {
            const tomorrowMax = data.daily.temperature_2m_max[1];
            const tomorrowMin = data.daily.temperature_2m_min[1];
            
            forecastDetails.innerHTML = `
                <p>High: ${tomorrowMax}${data.daily_units.temperature_2m_max} | Low: ${tomorrowMin}${data.daily_units.temperature_2m_min}</p>
                `;
        }
        
        weatherDisplay.classList.remove('hidden');
        resetButton.classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error fetching weather:', error);
        alert('Weather info not available');
    });
};

const handleSearch = () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchCity(cityName);
    }
};

const handleReset = () => {
    weatherDisplay.classList.add('hidden');
    resetButton.classList.add('hidden');
    cityInput.value = '';
    document.body.style.backgroundImage = '';
};

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

searchButton.addEventListener('click', handleSearch);
resetButton.addEventListener('click', handleReset);