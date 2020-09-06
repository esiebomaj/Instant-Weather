const API_KEY = "90ad1a751861d25727920ade4d222908";

const resultContainer = document.querySelector(".result-container");

window.addEventListener("keypress", (e) => handleSearch(e));

async function init() {
  //checks local storage for search history and display result based on this history
  const prevQuery = localStorage.getItem("weatherQuery");
  try {
    const data = await getWeatherData(prevQuery);
    displayResult(data);
  } catch (e) {
    displayErrorResult(e);
  }
}

async function getWeatherData(query) {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&APPID=${API_KEY}`
  );
  return data;
}

async function handleSearch(e) {
  if (e.key === "Enter") {
    const search = document.querySelector(".search");
    const query = search.value;
    localStorage.removeItem("weatherQuery");
    localStorage.setItem("weatherQuery", query);
    try {
      const data = await getWeatherData(query);
      displayResult(data);
    } catch (e) {
      displayErrorResult(e);
    }
  }
}

const displayResult = (data) => {
  resultContainer.innerHTML = `<h3 class="city-name">${data.name} <sup>${data.sys.country}</sup></h3>
  <div class="weather">${data.weather[0].main}(${data.weather[0].description})</div>
  <img
    src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
    alt="${data.weather[0].description}"
    class="weather-icon"
  />
  <div class="temp">
     ${data.main.temp}<sup>o</sup>
  </div>
  <div class="wind">Wind speed : <span>${data.wind.speed}</span></div>`;

  resultContainer.style.display = "flex";
};

const displayErrorResult = (e) => {
  if (e.response && e.response.status === 404) {
    resultContainer.innerHTML = `<i style='color:red; font-size: 2em;' class="fas fa-heart-broken"></i> 
    <p class='error-text'>sorry we cant find that city </p>
    <i style='color:blue; font-size: 2em;' class="fas fa-sad-tear"></i>`;
  } else {
    resultContainer.innerHTML = `<i style='color:red; font-size: 2em;' class="fas fa-heart-broken"></i> 
    <p class='error-text'>Something went wrong </p>
    <i style='color:blue; font-size: 2em;' class="fas fa-sad-tear"></i>`;
  }
  resultContainer.style.display = "flex";
};

init();
