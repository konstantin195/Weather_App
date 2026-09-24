(function () {
  "use strict";

  const app = window.WeatherApp || {};

  // Maps Open-Meteo WMO weather codes to labels, icons, and visual themes.
  const codeMap = {
    0: { label: "Clear sky", icon: "fa-sun", theme: "clear" },
    1: { label: "Mainly clear", icon: "fa-cloud-sun", theme: "clear" },
    2: { label: "Partly cloudy", icon: "fa-cloud-sun", theme: "cloudy" },
    3: { label: "Overcast", icon: "fa-cloud", theme: "cloudy" },
    45: { label: "Fog", icon: "fa-smog", theme: "cloudy" },
    48: { label: "Rime fog", icon: "fa-smog", theme: "cloudy" },
    51: { label: "Light drizzle", icon: "fa-cloud-rain", theme: "rain" },
    53: { label: "Moderate drizzle", icon: "fa-cloud-rain", theme: "rain" },
    55: { label: "Dense drizzle", icon: "fa-cloud-rain", theme: "rain" },
    56: { label: "Light freezing drizzle", icon: "fa-cloud-meatball", theme: "snow" },
    57: { label: "Dense freezing drizzle", icon: "fa-cloud-meatball", theme: "snow" },
    61: { label: "Slight rain", icon: "fa-cloud-rain", theme: "rain" },
    63: { label: "Moderate rain", icon: "fa-cloud-showers-heavy", theme: "rain" },
    65: { label: "Heavy rain", icon: "fa-cloud-showers-heavy", theme: "rain" },
    66: { label: "Light freezing rain", icon: "fa-cloud-meatball", theme: "snow" },
    67: { label: "Heavy freezing rain", icon: "fa-cloud-meatball", theme: "snow" },
    71: { label: "Slight snow", icon: "fa-snowflake", theme: "snow" },
    73: { label: "Moderate snow", icon: "fa-snowflake", theme: "snow" },
    75: { label: "Heavy snow", icon: "fa-snowflake", theme: "snow" },
    77: { label: "Snow grains", icon: "fa-snowflake", theme: "snow" },
    80: { label: "Slight rain showers", icon: "fa-cloud-sun-rain", theme: "rain" },
    81: { label: "Moderate rain showers", icon: "fa-cloud-showers-heavy", theme: "rain" },
    82: { label: "Violent rain showers", icon: "fa-cloud-showers-heavy", theme: "rain" },
    85: { label: "Slight snow showers", icon: "fa-snowflake", theme: "snow" },
    86: { label: "Heavy snow showers", icon: "fa-snowflake", theme: "snow" },
    95: { label: "Thunderstorm", icon: "fa-cloud-bolt", theme: "storm" },
    96: { label: "Thunderstorm with hail", icon: "fa-cloud-bolt", theme: "storm" },
    99: { label: "Thunderstorm with heavy hail", icon: "fa-cloud-bolt", theme: "storm" }
  };

  const fallbackCode = {
    label: "Variable weather",
    icon: "fa-cloud-sun",
    theme: "cloudy"
  };

  /**
   * Returns full metadata for an Open-Meteo WMO weather code.
   * @param {number} code Weather code.
   * @param {number} isDay 1 for day, 0 for night.
   * @returns {{label: string, icon: string, theme: string}}
   */
  function getWeatherMeta(code, isDay = 1) {
    const meta = codeMap[code] || fallbackCode;
    const isClearNight = !isDay && (meta.theme === "clear" || meta.theme === "cloudy");
    const icon = isClearNight && code === 0 ? "fa-moon" : meta.icon;

    return {
      label: meta.label,
      icon: `fa-solid ${icon}`,
      theme: isClearNight ? "night" : meta.theme
    };
  }

  /**
   * Returns a text description for the weather.
   * @param {number} code Weather code.
   * @returns {string}
   */
  function getWeatherCondition(code) {
    return getWeatherMeta(code).label;
  }

  /**
   * Returns a Font Awesome class for the weather icon.
   * @param {number} code Weather code.
   * @param {number} isDay 1 for day, 0 for night.
   * @returns {string}
   */
  function getWeatherIcon(code, isDay = 1) {
    return getWeatherMeta(code, isDay).icon;
  }

  app.weatherCodes = {
    getWeatherMeta,
    getWeatherCondition,
    getWeatherIcon
  };

  window.WeatherApp = app;
})();
