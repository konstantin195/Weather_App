# Weather App

Weather App is a responsive browser-based dashboard made with HTML, CSS, and JavaScript.

The user can search for a city or use their current location to view live weather conditions and a five-day forecast. Weather data is provided by the free Open-Meteo APIs, so the project does not require an API key.

## Preview

Open `index.html` in a browser or run the project with Live Server. The app loads Sofia by default and also supports direct links such as `index.html?city=London`.

## Features

- Search for weather by city name
- Quick-search buttons for Sofia, London, and Tokyo
- Current-location weather using browser geolocation
- Current temperature and weather condition
- Wind speed and direction
- Feels-like temperature and humidity
- UV index, sunrise, and sunset information
- Five-day weather forecast
- Celsius and Fahrenheit toggle
- Saved temperature-unit preference using `localStorage`
- Dynamic weather icons and backgrounds
- Loading, offline, and error states
- Responsive layout for desktop and mobile screens

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Font Awesome
- GitHub

## How to Use

1. Open the application in a browser.
2. Enter a city name in the search field.
3. Press **Search** to load the latest weather information.
4. Use **My location** to request weather for your current position.
5. Press **Show in °F** or **Show in °C** to change the temperature unit.
6. Select one of the quick-city buttons to load it immediately.

## Controls

The main dashboard contains:

- A city search field and **Search** button
- A **My location** button
- A Celsius/Fahrenheit unit toggle
- Quick-city buttons for Sofia, London, and Tokyo
- A current-weather card with detailed measurements
- A five-day forecast section

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/konstantin195/Weather_App.git
   ```

2. Open the `Weather_App` folder.
3. Open `index.html` in a browser, or launch it with the Live Server extension in Visual Studio Code.
4. Search for a city and explore the forecast.

## GitHub Repository

The repository includes:

- All HTML, CSS, and JavaScript source files
- `README.md` with project information and setup instructions
- A modular JavaScript structure for API, state, DOM, and UI logic

## Author

Konstantin Angelov
