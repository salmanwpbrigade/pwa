import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = "b0a7bad410d5400c8c3145734251107";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');

  // Geolocation fetch
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
          );
          const data = await response.json();
          setWeather(data);
          setLocation(data.location.name);
        } catch (err) {
          console.error("Geolocation weather fetch error:", err);
        }
      });
    }
  }, []);

  // Manual city fetch
  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
      );
      const data = await response.json();
      setWeather(data);
      setLocation(data.location.name);
    } catch (err) {
      if (!navigator.onLine) {
        const queue = JSON.parse(localStorage.getItem('weatherQueue') || '[]');
        queue.push(city);
        localStorage.setItem('weatherQueue', JSON.stringify(queue));
        navigator.serviceWorker.ready.then(reg => reg.sync.register('sync-weather'));
      } else {
        console.error("Weather fetch failed:", err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) fetchWeather(city);
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button type="submit">Get Weather</button>
      </form>

      {weather && (
        <div>
          <h2>{location || weather.location.name}</h2>
          <p>{weather.current.temp_c} °C</p>
          <p>{weather.current.condition.text}</p>
        </div>
      )}
    </div>
  );
};

export default App;
