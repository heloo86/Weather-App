
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';


export async function updateNextDaysWeather(city, apiKey) {
    try {
        const forecastData = await fetchForecast(city, apiKey);
        
        if (forecastData) {
            const dailyData = processForecastData(forecastData);
            updateForecastUI(dailyData);
        }
    } catch (error) {
        console.error('Erro ao atualizar previsão dos próximos dias:', error);
    }
}

async function fetchForecast(city, apiKey) {
    const forecastRequest = `${FORECAST_URL}?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(forecastRequest);
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            console.error('Erro na resposta da API:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar previsão:', error);
        return null;
    }
}

function processForecastData(data) {
    const dailyData = {};
    
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; // "2025-01-22"
        
        if (!dailyData[date]) {
            dailyData[date] = {
                temps: [],
                date: new Date(date)
            };
        }
        
        dailyData[date].temps.push(item.main.temp);
    });
    
    return Object.values(dailyData).slice(0, 4);
}

function updateForecastUI(daysArray) {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    daysArray.forEach((day, index) => {
        const minTemp = Math.round(Math.min(...day.temps));
        const maxTemp = Math.round(Math.max(...day.temps));
        
        const date = new Date();
        date.setDate(date.getDate() + index); 
        
        const dayOfWeek = date.getDay();
        const dayName = index === 0 ? 'Today' : weekDays[dayOfWeek];
        
        const weekDayElement = document.getElementById(`weekDay${index}`);
        const dayTempElement = document.getElementById(`dayTemp${index}`);
        
        if (weekDayElement && dayTempElement) {
            weekDayElement.textContent = dayName;
            dayTempElement.textContent = `${minTemp}°C - ${maxTemp}°C`;
        }
    });
}