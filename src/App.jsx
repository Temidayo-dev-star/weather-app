import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

async function getWeatherData(city, apiKey) {
  if (!apiKey) {
    throw new Error(
      "Missing OpenWeather API key. Set VITE_OPENWEATHER_API_KEY in .env."
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch weather");
  }

  return data;
}

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("London");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getWeatherData("London", API_KEY);
        setWeather(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    loadInitialWeather();
  }, []);

  async function fetchWeather() {
    const query = city.trim();
    if (!query) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError("Missing OpenWeather API key. Set VITE_OPENWEATHER_API_KEY in .env.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getWeatherData(query, API_KEY);
      setWeather(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Weather App
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            type="text"
            placeholder="Enter city"
            className="border w-full p-3 rounded-xl outline-none"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            onClick={fetchWeather}
            className="bg-blue-500 text-white px-5 rounded-xl hover:bg-yellow-500"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : weather?.main ? (
          <div className="text-center">

            <h2 className="text-2xl sm:text-3xl font-semibold">
              {weather.name}
            </h2>

            <p className="text-4xl sm:text-5xl font-bold mt-4">
              {Math.round(weather.main.temp)}°C
            </p>

            <p className="text-gray-500 capitalize mt-2">
              {weather.weather[0].description}
            </p>

            <div className="flex justify-between mt-8">

              <div>
                <p className="font-semibold">Humidity</p>
                <p>{weather.main.humidity}%</p>
              </div>

              <div>
                <p className="font-semibold">Wind</p>
                <p>{weather.wind.speed} km/h</p>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-center text-red-500">
            City not found
          </p>
        )}

      </div>
    </div>
  );
}

export default App;