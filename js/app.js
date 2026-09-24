(function () {
  "use strict";

  const app = window.WeatherApp || {};
  const { DOM, state, WeatherAPI, UI } = app;

  /**
   * Starts a city search and updates the interface.
   * @param {string} cityName City name.
   */
  async function loadCity(cityName) {
    const city = cityName.trim();

    if (!city) {
      UI.showError("Please enter a city name.");
      return;
    }

    if (!navigator.onLine) {
      UI.showError("You are offline. Please check your internet connection.");
      return;
    }

    UI.showLoading(`Searching for ${city}...`);

    try {
      // Geocoding resolves the city name before weather is requested by coordinates.
      const result = await WeatherAPI.searchCity(city);

      UI.displayWeather(result.place, result.weather);
      DOM.searchInput.value = "";
    } catch (error) {
      UI.showError(error.message || "An unexpected error occurred.");
    } finally {
      UI.hideLoading();
    }
  }

  /**
   * Gets the user's current position from the browser.
   * @returns {Promise<GeolocationPosition>}
   */
  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    });
  }

  /**
   * Loads weather for the current geolocation.
   */
  async function loadCurrentLocation() {
    if (!navigator.onLine) {
      UI.showError("You are offline. Please check your internet connection.");
      return;
    }

    if (!navigator.geolocation) {
      UI.showError("Your browser does not support geolocation.");
      return;
    }

    UI.showLoading("Waiting for location permission...");

    try {
      const position = await getCurrentPosition();
      const result = await WeatherAPI.fetchLocationWeather(
        position.coords.latitude,
        position.coords.longitude,
        { name: "My location", country: "GPS" }
      );

      UI.displayWeather(result.place, result.weather);
    } catch (error) {
      UI.showError("I could not get your location. Allow access or search for a city manually.");
    } finally {
      UI.hideLoading();
    }
  }

  /**
   * Attaches all application event listeners.
   */
  function attachEvents() {
    DOM.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      loadCity(DOM.searchInput.value);
    });

    DOM.unitToggle.addEventListener("click", () => {
      if (state.lastTempC === null) {
        return;
      }

      state.isCelsius = !state.isCelsius;
      localStorage.setItem(app.config.unitKey, state.isCelsius ? "c" : "f");
      UI.refreshTemperatureViews();
    });

    DOM.locationButton.addEventListener("click", loadCurrentLocation);

    DOM.quickCities.forEach((button) => {
      button.addEventListener("click", () => loadCity(button.dataset.city));
    });

  }

  /**
   * Application entry point.
   */
  function init() {
    const params = new URLSearchParams(window.location.search);
    const cityFromUrl = params.get("city");
    const unitFromUrl = params.get("unit");
    const savedUnit = localStorage.getItem(app.config.unitKey);

    if (savedUnit === "f") {
      state.isCelsius = false;
    }

    if (savedUnit === "c") {
      state.isCelsius = true;
    }

    if (unitFromUrl && unitFromUrl.toLowerCase() === "f") {
      state.isCelsius = false;
      localStorage.setItem(app.config.unitKey, "f");
    }

    if (unitFromUrl && unitFromUrl.toLowerCase() === "c") {
      state.isCelsius = true;
      localStorage.setItem(app.config.unitKey, "c");
    }

    attachEvents();
    UI.refreshTemperatureViews();

    // A query-string city is useful for sharing links; Sofia is the default fallback.
    if (cityFromUrl) {
      loadCity(cityFromUrl);
    } else {
      loadCity("Sofia");
    }
  }

  init();
})();
