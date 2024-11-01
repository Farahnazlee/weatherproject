async function fetchWeather() {
    const apiKey = '8c0b8104187b40999ac145004242510';
    const locationInput = document.getElementById('location-input').value.trim();

    if (!locationInput) {
        alert("Please enter a location.");
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationInput}&days=5`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();

        // Display location and current weather info
        document.getElementById('location-info').innerHTML = `
            <h2>Weather in ${data.location.name}, ${data.location.region}, ${data.location.country}</h2>
            <p>Local Time: ${data.location.localtime}</p>
            <div class="current-weather">
                <p><strong>Current Temperature:</strong> ${data.current.temp_c}°C</p>
                <p><strong>Condition:</strong> ${data.current.condition.text}</p>
                <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            </div>
        `;

        // 5-day forecast display with activity recommendations
        document.getElementById('forecast').innerHTML = data.forecast.forecastday.map((day) => `
            <div class="forecast-day">
                <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })} - ${day.date}</h3>
                <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p><strong>Average Temperature:</strong> ${day.day.avgtemp_c}°C</p>
                <p><strong>Condition:</strong> ${day.day.condition.text}</p>
                <p><strong>Wind Speed:</strong> ${day.day.maxwind_kph} kph</p>
                <p><strong>Humidity:</strong> ${day.day.avghumidity}%</p>
                <p><strong>Chance of Rain:</strong> ${day.day.daily_chance_of_rain}%</p>
                <p><strong>Chance of Snow:</strong> ${day.day.daily_chance_of_snow}%</p>
                <p><strong>Recommended Activity:</strong> ${getActivityRecommendation(day.day.condition.text, day.day.daily_chance_of_rain)}</p>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Could not retrieve weather data. Please check the location name and try again.");
    }
}

// Function to generate activity recommendations based on weather conditions
function getActivityRecommendation(condition, rainChance) {
    condition = condition.toLowerCase();
    
    if (condition.includes('sunny') || condition.includes('clear')) {
        return "Perfect for hiking, picnics, or outdoor sports!";
    } else if (condition.includes('rain') || rainChance > 50) {
        return "Great day for indoor activities like visiting a museum or indoor climbing.";
    } else if (condition.includes('cloudy')) {
        return "Moderate outdoor activities like jogging or cycling are suitable.";
    } else if (condition.includes('windy')) {
        return "Good day for kite flying or paragliding!";
    } else if (condition.includes('snow')) {
        return "Ideal for skiing, snowboarding, or winter sports.";
    } else {
        return "Outdoor activities are possible, but stay prepared for changes!";
    }
}
