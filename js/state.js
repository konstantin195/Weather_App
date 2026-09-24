(function () {
  "use strict";

  const app = window.WeatherApp || {};

  // Shared runtime state used by the UI and event handlers.
  app.state = {
    isCelsius: true,
    lastTempC: null,
    lastWeatherResult: null
  };

  // Local storage keys and other app-wide settings.
  app.config = {
    unitKey: "weatherUnit"
  };

  window.WeatherApp = app;
})();
