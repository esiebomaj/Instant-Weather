const API_KEY = "90ad1a751861d25727920ade4d222908";

window.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const search = document.querySelector(".search");
    const query = search.value;
    getWeatherData(query);
  }
});

async function getWeatherData(query) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&APPID=${API_KEY}`
    );
    console.log(data);

    const resultContainer = document.querySelector(".result-container");

    resultContainer.innerHTML = `<h3 class="city-name">${data.name} <sup>${data.sys.country}</sup></h3>
    <div class="weather">${data.weather[0].main}(${data.weather[0].description})</div>
    <img
      src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
      alt=""
      class="weather-icon"
    />
    <div class="temp">
       ${data.main.temp}<sup>o</sup>
    </div>
    <div class="wind">Wind speed : <span>${data.wind.speed}</span></div>`;
    resultContainer.style.display = "flex";
  } catch (e) {
    if (e.response && e.response.status) {
      const resultContainer = document.querySelector(".result-container");
      resultContainer.innerHTML = `<i style='color:red; font-size: 2em;' class="fas fa-heart-broken"></i> 
      <p class='error-text'>sorry we cant find that city </p>
      <i style='color:blue; font-size: 2em;' class="fas fa-sad-tear"></i>`;
      resultContainer.style.display = "flex";
    } else {
      const resultContainer = document.querySelector(".result-container");
      resultContainer.innerHTML = `<i style='color:red; font-size: 2em;' class="fas fa-heart-broken"></i> 
      <p class='error-text'>Something went wrong </p>
      <i style='color:blue; font-size: 2em;' class="fas fa-sad-tear"></i>`;
      resultContainer.style.display = "flex";
    }
  }
}
