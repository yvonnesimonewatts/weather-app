// DATE & TIME
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let month = months[date.getMonth()];

  let calendarDate = date.getDate();

  return `${day} | ${calendarDate} ${month} | ${formatTime(timestamp)}`;
}

function formatTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

// TEMPERATURE INFORMATION
function showTemperature(response) {
  celsiusTemperature = Math.round(response.data.main.temp);
  document.querySelector("#date-time").innerHTML = formatDate(response.data.dt * 1000);
  document.querySelector("#location").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = `${celsiusTemperature}°`;
  document.querySelector("#weather-description").innerHTML = response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed * 2.237);

  document.querySelector('#temp-icon').setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
}

// FORECAST
function handleForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `<div class="col-2 weather-forecast-items border p-2 rounded shadow">
      <h1>
        <strong>${formatTime(forecast.dt * 1000)}</strong>
      </h1>
      <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" 
      alt="" />
      <h2>
        <strong><span class="forecast-max">${Math.round(forecast.main.temp_max)}</span>°</strong> 
        |
        <span class="forecast-min">${Math.round(forecast.main.temp_min)}</span>°
      </h2>
    </div>`;
  }
}

// API CALLS FOR showTemperature() & handleForecast()
function handleCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=fe75cdcdc7e5e9de834be3340e916f6e`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=fe75cdcdc7e5e9de834be3340e916f6e`;

  axios.get(apiUrl).then(handleForecast);
}

//SEARCH ENGINE
function enterCity(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;

  handleCity(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", enterCity);

handleCity("London");

// API CALL FOR CURRENT LOCATION
function handleLocation(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=fe75cdcdc7e5e9de834be3340e916f6e`;

  axios.get(apiUrl).then(showTemperature);
}

// FORMAT CURRENT LOCATION BTN FEATURE
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleLocation);
}

let btnCurrentLocation = document.querySelector("#btn-current-location");
btnCurrentLocation.addEventListener("click", getCurrentLocation);

// FORMAT FAHRENHEIT & CELSIUS
function convertFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.add("inactive");
  fahrenheitLink.classList.remove("inactive");
  let temperatureInput = document.querySelector("#temperature");
  let fahrenheit = (celsiusTemperature * 9) / 5 + 32;
  temperatureInput.innerHTML = `${Math.round(fahrenheit)}°`;

  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemperature = item.innerHTML;
    item.innerHTML = Math.round((currentTemperature * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemperature = item.innerHTML;
    item.innerHTML = Math.round((currentTemperature * 9) / 5 + 32);
  });

  celsiusLink.addEventListener("click", convertCelsius);
  fahrenheitLink.removeEventListener("click", convertFahrenheit);
}

function convertCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.add("inactive");
  celsiusLink.classList.remove("inactive");
  let temperatureInput = document.querySelector("#temperature");
  temperatureInput.innerHTML = `${celsiusTemperature}°`;

  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemperature = item.innerHTML;
    item.innerHTML = Math.round(((currentTemperature - 32) * 5) / 9);
  });

  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function (item) {
    let currentTemperature = item.innerHTML;
    item.innerHTML = Math.round(((currentTemperature - 32) * 5) / 9);
  });

  celsiusLink.removeEventListener("click", convertCelsius);
  fahrenheitLink.addEventListener("click", convertFahrenheit);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertCelsius);
