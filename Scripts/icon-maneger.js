const iconMapping = {
    2: "wi-storm-showers",
    3: "wi-rain-mix",
    5: "wi-sleet",
    6: "wi-snow",
    7: "wi-fog",
    8: "wi-cloudy",
    800: "wi-day-sunny"
}

const tailwindStyle = "wi-fw max-w-full h-auto";

export function getWeatherIconClass(weatherID) {
    if (weatherID === 800) return iconMapping[800];

    const group = Math.floor(weatherID / 100);
    return iconMapping[group] || "wi-na";
}

export function updateIcon(weatherID) {
    const iconClass = getWeatherIconClass(weatherID);
    if (iconClass) {
        const iconElement = document.getElementById("weatherIcon");
        iconElement.className = `wi ${iconClass} ${tailwindStyle}`;
    }
}