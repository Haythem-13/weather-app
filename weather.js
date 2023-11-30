'use strict';
let locateYourSelf = document.querySelector('.btn-location');
let weatherContainer = document.querySelector('.Weather-report');
let city = document.querySelector('.pick');
let input = document.querySelector('.inputs');
let btn = document.querySelector('.add');
let message = document.querySelector('.message');

let renderWeather = function (data) {
    let html = `
    <section class="render">
        <div class="contain"></div>
        <h2 class="city"><span>City :</span>${data.name} ${data.sys.country}</h2>
        <p class="descrip"><span>Weather :</span>${data.weather[0].main}</p>
        <p class="temp"><span>Temp 🌡️ :</span>${(data.main.temp - 273, 15).toFixed(2)}C° </p>
        <p class="temp-feel"><span>temp min  :</span>${(data.main.temp_min - 273, 15).toFixed(2)}C° </p>
        <p class="temp-feel"><span>temp max  :</span>${(data.main.temp_max - 273, 15).toFixed(2)}C° </p>
        <p class="wind"><span> Wind : </span>${data.wind.speed}km/h </p>
    </section>
    `;

    weatherContainer.innerHTML = html;
    weatherContainer.style.opacity = 1;
};

let text = `Climate change will impact the lives of future generations
Our stable home will be flooded over. Our water will be dried out. Our crops won't be able to grow because of the increased heat. Our oxygen will be limited as deforestation continues.`;

let wait = function () {
    return new Promise(function () {
        setTimeout(() => {
            console.log(text);
        }, 4000);
    });
};

let APIKEY = 'b3ca1784f612ec0f83ddd2fd57f45ea0';

input.addEventListener('submit', (e) => {
    try {
        e.preventDefault();
        console.log(city.value);

        let getWeatherData = async function () {
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&APPID=${APIKEY}`);
            let res = await response.json();
            return res;
        };

        let cityWeather = getWeatherData();
        cityWeather.then((data) => {
            console.log(data);
            renderWeather(data);
            wait();
        });
    } catch (err) {
        console.error(`${err} ERROR`);
        renderError(`${err.message}`);
        throw err;
    }
});

locateYourSelf.addEventListener('click', async function () {
    try {
        const locationMessage = await whereAmI();
        console.log(locationMessage);
    } catch (err) {
        console.error(`${err} ERROR`);
        renderError(`${err.message}`);
        throw err;
    }
});

const e = function () {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};
const whereAmI = async function () {
    try {
        const position = await getPosition();
        const { latitude: lat, longitude: lng } = position.coords;
        // Reverse geocoding
        const Geo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        if (!Geo.ok) throw new Error('Problem getting location data');
        const dataGeo = await Geo.json();
        // Country data
        const res = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}`);
        if (!Geo.ok) throw new Error('Problem getting country');
        const data = await res.json();
        renderCountry(data[0]);
        return `You are in ${dataGeo.city}, ${dataGeo.country}`;
    } catch (err) {
        console.error(`${err} `);
        renderError(` ${err.message}`);
        throw err;
    }
};
