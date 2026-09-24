# Weather App

Weather App is a browser-based project built with HTML, CSS, and Vanilla JavaScript. It searches for a city, uses the free Open-Meteo API without registration, and displays current weather, a 5-day forecast, an hourly forecast, and search history.

## Screenshots

The final screenshots are saved in the `screenshots` folder.

![Weather App - Sofia](screenshots/weather-app-sofia.png)
![Weather App - London](screenshots/weather-app-london.png)

## Features

- Search weather by city.
- Current temperature, weather condition, wind speed, wind direction, feels-like temperature, humidity, UV index, sunrise, and sunset.
- Celsius and Fahrenheit toggle without a new API request.
- Saved temperature unit preference using localStorage.
- 5-day forecast.
- Hourly forecast for the coming hours.
- Current location button.
- Expressive dynamic background based on the weather.
- Recent search history in localStorage.
- Loading and error states.

## Technologies

- HTML5
- CSS3
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Font Awesome icons

## How to Run Locally

1. Open the `weather-app` folder.
2. Open `index.html` in a browser or use Live Server.
3. Search for `Sofia`, `London`, or another city.

If the browser blocks some external resources when opening the file directly, use Live Server. The app does not need a backend and does not need an API key.

You can also open a direct demo URL, for example `index.html?city=Sofia`. For Fahrenheit, use `index.html?city=Sofia&unit=f`.

## File Structure

```text
weather-app/
  index.html
  styles.css
  README.md
  screenshots/
  js/
    app.js
    api.js
    dom.js
    state.js
    storage.js
    ui.js
    weatherCodes.js
```

## Code Notes

DOM elements are collected in one object in `js/dom.js`. Open-Meteo logic is in `js/api.js`, visual updates are in `js/ui.js`, and localStorage history is handled in `js/storage.js`.
