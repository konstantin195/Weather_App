(function () {
  "use strict";

  const app = window.WeatherApp || {};
  const { DOM, state, weatherCodes } = app;
  const DEGREE = "\u00B0";

  /**
   * Removes all child nodes without using unsafe HTML.
   * @param {HTMLElement} element Container to clear.
   */
  function clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Creates an HTML element with classes and text.
   * @param {string} tag Tag name.
   * @param {string} className CSS classes.
   * @param {string} text Text content.
   * @returns {HTMLElement}
   */
  function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text) {
      element.textContent = text;
    }

    return element;
  }

  /**
   * Shows the loading indicator.
   * @param {string} message User-facing message.
   */
  function showLoading(message = "Loading weather data...") {
    clearError();
    DOM.loading.textContent = "";
    DOM.loading.appendChild(createElement("span", "spinner"));
    DOM.loading.append(` ${message}`);
    DOM.loading.hidden = false;
    DOM.searchButton.disabled = true;
    DOM.locationButton.disabled = true;
  }

  /**
   * Hides the loading indicator.
   */
  function hideLoading() {
    DOM.loading.hidden = true;
    DOM.searchButton.disabled = false;
    DOM.locationButton.disabled = false;
  }

  /**
   * Shows an error without leaving stale state from a previous request.
   * @param {string} message Error text.
   */
  function showError(message) {
    DOM.errorMessage.textContent = message;
    DOM.errorMessage.hidden = false;
    DOM.loading.hidden = true;
  }

  /**
   * Hides the error message.
   */
  function clearError() {
    DOM.errorMessage.textContent = "";
    DOM.errorMessage.hidden = true;
  }

  /**
   * Converts Celsius to Fahrenheit.
   * @param {number} celsius Temperature in Celsius.
   * @returns {number}
   */
  function toFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  /**
   * Returns the current unit as a simple letter.
   * @returns {string}
   */
  function getCurrentUnit() {
    if (state.isCelsius) {
      return "c";
    }

    return "f";
  }

  /**
   * Returns the visible label for a temperature unit.
   * @param {string} unit Unit letter.
   * @returns {string}
   */
  function getUnitLabel(unit) {
    if (unit === "c") {
      return `${DEGREE}C`;
    }

    return `${DEGREE}F`;
  }

  /**
   * Formats temperature according to the selected unit.
   * @param {number} celsius Temperature in Celsius.
   * @returns {string}
   */
  function formatTemperature(celsius) {
    if (typeof celsius !== "number" || Number.isNaN(celsius)) {
      return `--${getUnitLabel(getCurrentUnit())}`;
    }

    if (state.isCelsius) {
      return `${Math.round(celsius)}${getUnitLabel("c")}`;
    }

    return `${toFahrenheit(celsius).toFixed(1)}${getUnitLabel("f")}`;
  }

  /**
   * Updates the main temperature display.
   */
  function updateTemperatureDisplay() {
    DOM.temperature.textContent = formatTemperature(state.lastTempC);
    DOM.unitToggle.textContent = state.isCelsius ? `Show in ${getUnitLabel("f")}` : `Show in ${getUnitLabel("c")}`;
    DOM.unitToggle.setAttribute("aria-pressed", String(!state.isCelsius));

    if (!state.lastWeatherResult) {
      DOM.apparentTemp.textContent = formatTemperature(null);
    }
  }

  /**
   * Updates all temperature views after switching Celsius/Fahrenheit.
   */
  function refreshTemperatureViews() {
    updateTemperatureDisplay();

    if (!state.lastWeatherResult) {
      return;
    }

    DOM.apparentTemp.textContent = formatTemperature(state.lastWeatherResult.weather.current.apparent_temperature);
    renderForecast(state.lastWeatherResult.weather.daily);
  }

  /**
   * Converts degrees into a short wind direction.
   * @param {number} degrees Direction in degrees.
   * @returns {string}
   */
  function formatWindDirection(degrees) {
    if (typeof degrees !== "number") {
      return "--";
    }

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % directions.length;

    return `${directions[index]} ${Math.round(degrees)}${DEGREE}`;
  }

  /**
   * Formats a date for the daily cards.
   * @param {string} date ISO date.
   * @returns {string}
   */
  function formatDay(date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short"
    }).format(new Date(`${date}T12:00:00`));
  }

  /**
   * Formats an hour for the hourly forecast.
   * @param {string} dateTime ISO date and time.
   * @returns {string}
   */
  function formatHour(dateTime) {
    if (!dateTime) {
      return "--";
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateTime));
  }

  /**
   * Converts a UV value into a beginner-friendly label.
   * @param {number} value UV index value.
   * @returns {string}
   */
  function getUvLevel(value) {
    if (value < 3) {
      return "Low";
    }

    if (value < 6) {
      return "Moderate";
    }

    if (value < 8) {
      return "High";
    }

    if (value < 11) {
      return "Very high";
    }

    return "Extreme";
  }

  /**
   * Formats the UV index shown in the metric card.
   * @param {number} value UV index value.
   * @returns {string}
   */
  function formatUvIndex(value) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "--";
    }

    return `${value.toFixed(1)} ${getUvLevel(value)}`;
  }

  /**
   * Displays weather data in the DOM.
   * @param {object} place City data.
   * @param {object} weather Open-Meteo data.
   */
  function displayWeather(place, weather) {
    const current = weather.current;
    const meta = weatherCodes.getWeatherMeta(current.weather_code, current.is_day);
    const countryText = [place.admin1, place.country].filter(Boolean).join(", ");

    // Store raw Celsius data so unit changes can re-render without another API call.
    state.lastTempC = current.temperature_2m;
    state.lastWeatherResult = { place, weather };

    DOM.body.dataset.theme = meta.theme;
    DOM.weatherCard.classList.remove("is-empty");
    DOM.cityName.textContent = place.name;
    DOM.countryName.textContent = countryText || `${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}`;
    DOM.weatherIcon.className = `${meta.icon} weather-icon`;
    DOM.weatherIcon.setAttribute("aria-label", meta.label);
    DOM.weatherCondition.textContent = meta.label;
    DOM.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    DOM.windDirection.textContent = formatWindDirection(current.wind_direction_10m);
    DOM.apparentTemp.textContent = formatTemperature(current.apparent_temperature);
    DOM.humidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
    DOM.uvIndex.textContent = formatUvIndex(weather.daily.uv_index_max[0]);
    DOM.sunriseTime.textContent = formatHour(weather.daily.sunrise[0]);
    DOM.sunsetTime.textContent = formatHour(weather.daily.sunset[0]);
    DOM.updatedAt.textContent = formatHour(current.time);
    DOM.unitToggle.disabled = false;

    updateTemperatureDisplay();
    renderForecast(weather.daily);
  }

  /**
   * Renders the 5-day forecast.
   * @param {object} daily Daily API data.
   */
  function renderForecast(daily) {
    clearChildren(DOM.forecastList);

    if (!daily || !daily.time) {
      DOM.forecastSection.hidden = true;
      return;
    }

    DOM.forecastSection.hidden = false;

    daily.time.forEach((date, index) => {
      // Daily arrays from Open-Meteo share the same index across all forecast values.
      const card = createElement("article", "forecast-card");
      const meta = weatherCodes.getWeatherMeta(daily.weather_code[index]);
      const day = createElement("span", "", formatDay(date));
      const icon = createElement("i", meta.icon);
      const temp = createElement(
        "strong",
        "",
        `${formatTemperature(daily.temperature_2m_max[index])} / ${formatTemperature(daily.temperature_2m_min[index])}`
      );
      const rain = createElement(
        "span",
        "",
        `Rain: ${daily.precipitation_probability_max[index] ?? 0}%`
      );

      card.append(day, icon, temp, rain);
      DOM.forecastList.appendChild(card);
    });
  }

  app.UI = {
    showLoading,
    hideLoading,
    showError,
    clearError,
    displayWeather,
    refreshTemperatureViews
  };

  window.WeatherApp = app;
})();
