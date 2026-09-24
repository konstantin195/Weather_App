(function () {
  "use strict";

  const app = window.WeatherApp || {};
  const get = (id) => document.getElementById(id);

  // Centralized DOM references keep query selectors out of the feature modules.
  app.DOM = {
    body: document.body,
    searchForm: get("search-form"),
    searchInput: get("search-input"),
    searchButton: get("search-button"),
    locationButton: get("location-button"),
    unitToggle: get("unit-toggle"),
    quickCities: document.querySelectorAll("[data-city]"),
    loading: get("loading"),
    errorMessage: get("error-message"),
    weatherCard: get("weather-card"),
    cityName: get("city-name"),
    countryName: get("country-name"),
    weatherIcon: get("weather-icon"),
    temperature: get("temperature"),
    weatherCondition: get("weather-condition"),
    windSpeed: get("wind-speed"),
    windDirection: get("wind-direction"),
    apparentTemp: get("apparent-temp"),
    humidity: get("humidity"),
    uvIndex: get("uv-index"),
    sunriseTime: get("sunrise-time"),
    sunsetTime: get("sunset-time"),
    updatedAt: get("updated-at"),
    forecastSection: get("forecast-section"),
    forecastList: get("forecast-list")
  };

  window.WeatherApp = app;
})();
