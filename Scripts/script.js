const cityInput = document.getElementById('cityInput');
const submitButton = document.getElementById('submit');
const weatherResult = document.getElementById('weatherResult');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const errorMessage = document.getElementById('errorMessage');
const cityName = document.getElementById('cityName');

const API_KEY = '1d72351d9b88f37f26980c4425fdc660';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function searchWeather(){
    const city = cityInput.value.trim();

    if(city === ''){
        alert('Please, enter a city name');
        return;
    }

    weatherResult.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const request = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`;

    try{
        const response = await fetch(request);
        const data = await response.json();

        if(response.ok){

            const finalData = {
                city: data.name,
                temperature: data.main.temp,
                description: data.weather[0].description
            }

            cityName.textContent = finalData.city;
            temperature.textContent = `Temperature: ${finalData.temperature}°C`;
            description.textContent = `Description: ${finalData.description}`;
            weatherResult.classList.remove('hidden');
            
        } else {
            errorMessage.classList.remove('hidden');
        }
    } catch(erro){
        alert( erro )
    
    } finally {
        submitButton.textContent = 'Buscar'
        submitButton.disabled = false;
    }
} 

submitButton.addEventListener('click', searchWeather);

