import "./App.css";
import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Description from "./components/Description";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherApi";

function App() {
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric')
  const [city, setCity] = useState('Guwahati')
  const [bg, setBg] = useState(hotBg)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setError(null); // Clear any previous errors
        const data = await getFormattedWeatherData(city, units);
        setWeather(data);

        // Dynamic background
        const threshold = units === 'metric' ? 20 : 60;
        if (data.temp <= threshold) {
          setBg(coldBg);
        } else {
          setBg(hotBg);
        }
      } catch (error) {
        setError('Location not found or API request failed. Please try again.');
      }
    };

    fetchWeatherData();
  }, [units, city]);


  const handleUnitsClick = (e)=>{
    const button = e.currentTarget
    const currentUnit = button.innerText.slice(1)
  
    const isCelcius = currentUnit === 'C'
    button.innerText = isCelcius ? '°F' : '°C'
    setUnits(isCelcius ? 'metric' : 'imperial')
  }

  const enterKeyPressed = (e)=>{
    if(e.keyCode === 13){
      setCity(e.currentTarget.value)
      e.currentTarget.blur()
    }
  }

  const handleReset = () => {
    setError(null); // Clear the error message
    setCity('Guwahati'); // Reset the city to the initial value
  };
  

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleReset}>Reset</button>
          </div>
        ): weather ? (
          <div className="container">
            <div className="section section_inputs">
              <input onKeyDown={enterKeyPressed} type="text" name="city" placeholder="Enter City..." />
              <button onClick={(e)=> handleUnitsClick(e)}>°F</button>
            </div>

            <div className="section section_temp">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={`${weather.iconURL}`} alt="weatherIcon"/>

                <h3>{weather.description}</h3>
              </div>

              <div className="temp">
                <h1>{`${weather.temp.toFixed()} °${units === 'metric' ? 'C' : 'F'}`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <Description weather={weather} units={units} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
