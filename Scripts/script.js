import { updateIcon } from './icon-maneger.js';
import { updateNextDaysWeather } from './next-days-weather.js'; // IMPORTAR

const cityInput = document.getElementById('cityInput');
const submitButton = document.getElementById('submit');
const weatherResult = document.getElementById('weatherResult');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');
const forecast = document.getElementById('nextDaysForecast');

const API_KEY = '1d72351d9b88f37f26980c4425fdc660';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastSearchedCity');
    
    if (lastCity) {
        cityInput.value = lastCity;

        searchWeather();
    }
});

async function searchWeather(){
    const city = cityInput.value.trim();

    if(city === ''){
        alert('Please, enter a city name');
        return;
    }

    submitButton.disabled = true;
    weatherResult.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const request = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try{
        const response = await fetch(request);
        const data = await response.json();

        if(response.ok){
            updateIcon(data.weather[0].id);

            const finalData = {
                city: data.name,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description
            }

            cityName.textContent = finalData.city;
            temperature.textContent = `${finalData.temperature}°C`;
            description.textContent = `${finalData.description}`;
            weatherResult.classList.remove('hidden');

            await updateNextDaysWeather(city, API_KEY);
            forecast.classList.remove('hidden');

            localStorage.setItem('lastSearchedCity', city);

        } else {
            errorMessage.classList.remove('hidden');
        }
    } catch(erro){
        alert(erro);
    
    } finally {
        submitButton.disabled = false;
    }
}

submitButton.addEventListener('click', searchWeather);

cityInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        event.preventDefault(); 
        searchWeather();
    }
});

const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        searchWeather();
    });
}