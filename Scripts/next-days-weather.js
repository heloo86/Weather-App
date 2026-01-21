// ========================================
// next-days-weather.js
// Módulo para gerenciar a previsão dos próximos dias
// ========================================

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * Função principal: busca e exibe a previsão dos próximos dias
 * @param {string} city - Nome da cidade
 * @param {string} apiKey - Chave da API do OpenWeather
 */
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

/**
 * Busca os dados de previsão na API
 * @param {string} city - Nome da cidade
 * @param {string} apiKey - Chave da API
 * @returns {Object|null} - Dados da previsão ou null em caso de erro
 */
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

/**
 * Processa os dados da API e agrupa por dia
 * @param {Object} data - Dados brutos da API
 * @returns {Array} - Array com dados diários processados
 */
function processForecastData(data) {
    const dailyData = {};
    
    // Agrupar previsões por data
    data.list.forEach(item => {
        // Extrair apenas a data (sem hora)
        const date = item.dt_txt.split(' ')[0]; // "2025-01-22"
        
        // Inicializar o dia se ainda não existir
        if (!dailyData[date]) {
            dailyData[date] = {
                temps: [],
                date: new Date(date)
            };
        }
        
        // Adicionar temperatura ao array do dia
        dailyData[date].temps.push(item.main.temp);
    });
    
    // Converter objeto em array e pegar os primeiros 4 dias
    return Object.values(dailyData).slice(0, 4);
}

/**
 * Atualiza a interface com os dados da previsão
 * @param {Array} daysArray - Array com dados de cada dia
 */
function updateForecastUI(daysArray) {
    const weekDays = [
        'Sunday', 
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday', 
        'Saturday'
    ];
    
    daysArray.forEach((day, index) => {
        // Calcular temperaturas mínima e máxima do dia
        const minTemp = Math.round(Math.min(...day.temps));
        const maxTemp = Math.round(Math.max(...day.temps));
        
        // Determinar o nome do dia
        const dayOfWeek = day.date.getDay();
        const dayName = index === 0 ? 'Today' : weekDays[dayOfWeek];
        
        // Atualizar elementos HTML
        const weekDayElement = document.getElementById(`weekDay${index}`);
        const dayTempElement = document.getElementById(`dayTemp${index}`);
        
        if (weekDayElement && dayTempElement) {
            weekDayElement.textContent = dayName;
            dayTempElement.textContent = `${minTemp}°C - ${maxTemp}°C`;
        }
    });
}