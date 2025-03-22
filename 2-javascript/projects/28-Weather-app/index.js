const apiKey = '1dc8c97189d4ff6245d063df0e7edf96';  // Replace with your own API key
const cityInput = document.querySelector('.search-box-js');
const temp = document.querySelector('.temp-js');
const condition = document.querySelector('.condition');
const cityName = document.querySelector('.city-js');
const weatherEmoji = document.querySelector('.weatherEmoji');
const btn = document.querySelector('.btn-js');
const errorDisplay = document.querySelector(".errorDisplay"); 

btn.addEventListener('click', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (city) {
    await getWeatherData(city);
  } else {
    displayError("Please enter a city");
  }
});

async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error("City not found");
    
    const data = await response.json();
    console.log(data); 
    displayWeatherInfo(data);
  } catch (error) {
    displayError("City not found. Please try again.");
    console.error("Error fetching weather:", error);
  }
}

function displayWeatherInfo(data) {
  cityName.textContent = data.name;
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent = data.weather[0].description;
  weatherEmoji.textContent = getWeatherEmoji(data.weather[0].id);

  errorDisplay.textContent = ""; 
}

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "⛈️";  // Thunderstorm
  if (weatherId >= 300 && weatherId < 500) return "🌧️";  // Drizzle
  if (weatherId >= 500 && weatherId < 600) return "🌦️";  // Rain
  if (weatherId >= 600 && weatherId < 700) return "❄️";  // Snow
  if (weatherId >= 700 && weatherId < 800) return "🌫️";  // Atmosphere (fog, smoke)
  if (weatherId === 800) return "☀️";                     // Clear
  if (weatherId > 800) return "☁️";                      // Clouds
  return "❓";                                           // Unknown
}

function displayError(message) {
//  const errorDisplay = document.querySelector(".errorDisplay");
  errorDisplay.textContent = message;
  errorDisplay.style.color = "red";
}
