(function () {
  "use strict";

  const app = window.WeatherApp || {};
  const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";


  /**
   * Fetches JSON from the provided URL and throws a clear error on failure.
   * @param {URL} url Request URL.
   * @returns {Promise<object>}
   */
  async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("The API request failed. Please try again in a moment.");
    }

    return response.json();
  }

  /**
   * Builds a short location label.
   * @param {{name?: string, admin1?: string, country?: string}} place Place data.
   * @returns {string}
   */
  function formatPlace(place) {
    return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
  }

  /**
   * Normalizes place data for the UI and search history.
   * @param {object} place Raw object from the API or geolocation.
   * @returns {{name: string, admin1: string, country: string, latitude: number, longitude: number}}
   */
  function normalizePlace(place) {
    return {
      name: place.name || "My location",
      admin1: place.admin1 || "",
      country: place.country || "",
      latitude: Number(place.latitude),
      longitude: Number(place.longitude)
    };
  }

  /**
   * Searches for a city by name and then loads weather for its coordinates.
   * @param {string} cityName City name.
   * @returns {Promise<{place: object, weather: object}>}
   */
  async function searchCity(cityName) {
    const url = new URL(GEOCODING_URL);

    url.search = new URLSearchParams({
      name: cityName,
      count: "1",
      language: "en",
      format: "json"
    }).toString();

    const geoData = await fetchJson(url);

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`I could not find "${cityName}". Check the spelling and try again.`);
    }

    const place = normalizePlace(geoData.results[0]);
    const weather = await fetchWeatherByCoordinates(place.latitude, place.longitude);

    return { place, weather };
  }

  /**
   * Loads current weather and daily forecast by coordinates.
   * @param {number} latitude Geographic latitude.
   * @param {number} longitude Geographic longitude.
   * @param {object} placeInfo Additional place details.
   * @returns {Promise<{place: object, weather: object}>}
   */
  async function fetchLocationWeather(latitude, longitude, placeInfo = {}) {
    const place = normalizePlace({ ...placeInfo, latitude, longitude });
    const weather = await fetchWeatherByCoordinates(place.latitude, place.longitude);

    return { place, weather };
  }

  /**
   * Sends a request to the Open-Meteo Forecast API.
   * @param {number} latitude Geographic latitude.
   * @param {number} longitude Geographic longitude.
   * @returns {Promise<object>}
   */
  async function fetchWeatherByCoordinates(latitude, longitude) {
    const url = new URL(FORECAST_URL);

    url.search = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
        "is_day"
      ].join(","),
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
        "sunrise",
        "sunset",
        "uv_index_max"
      ].join(","),
      timezone: "auto",
      forecast_days: "5",
      wind_speed_unit: "kmh"
    }).toString();

    return fetchJson(url);
  }

  app.WeatherAPI = {
    searchCity,
    fetchLocationWeather,
    formatPlace
  };

  window.WeatherApp = app;
})();
