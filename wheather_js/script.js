const apiKey = "42298ef77a48db17204feb7d5476e305";

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404") {
        document.getElementById("weatherResult").innerHTML = "City not found!";
      } else {
        const temp = data.main.temp;
        const condition = data.weather[0].description;
        const icon = data.weather[0].icon;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const country = data.sys.country;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        const flagUrl = `https://flagsapi.com/${country}/flat/64.png`;

        document.getElementById("weatherResult").innerHTML = `
          <h2>${data.name}, ${country} <img src="${flagUrl}" style="width: 30px; vertical-align: middle;" /></h2>
          <img src="${iconUrl}" alt="${condition}" />
          <p>Temperature: ${temp}°C</p>
          <p>Condition: ${condition}</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        saveToHistory(city);
      }
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      document.getElementById("weatherResult").innerHTML = "An error occurred.";
    });
}

function toggleMode() {
  document.body.classList.toggle("dark");
}

function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    updateHistory();
  }
}

function updateHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const historyList = history.map(city => `<li onclick="selectCity('${city}')">${city}</li>`).join('');
  document.getElementById("searchHistory").innerHTML = `
    <h3>Search History</h3>
    <ul>${historyList}</ul>
  `;
}

function selectCity(city) {
  document.getElementById("cityInput").value = city;
  getWeather();
}
window.onload = updateHistory;
