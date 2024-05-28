import React, { useEffect, useState } from "react";
import Descriptions from "./components/descriptions";
import { getFormattedWeatherData } from "./WeatherService.js";
import hotplace from "./assets/hotplace.jpg";
import coldplace from "./assets/coldplace.jpg";
import sunny from "./assets/sunny.jpg";

const App = () => {
  const [weather, setWeather] = useState(null);
  const[units,setUnits]=useState("metric");
  const[city,setCity]=useState("coimbatore");
  const[bg,setBg]=useState(hotplace);

  useEffect(() => {
    const fetchWeatherdata = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);
        setWeather(data);
        const threshold = units === "metric" ? 20 : 60;
        if (data.temp <= threshold) {
          setBg(coldplace);
          console.log("Background set to coldplace");
        } else {
          setBg(hotplace);
          console.log("Background set to hotplace");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
  
    fetchWeatherdata();
  }, [units, city]);
  

   const handleonclick =(e)=>{
    const button =e.currentTarget;
    const currentunit=button.innerText.slice(1);

    const isCelsius = currentunit ==="C";
    button.innerText=isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
   }

   const keypressed = (e) => {
    if (e.keyCode === 13) {
      const newCity = e.target.value.trim();
      console.log("City changed to:", newCity);
      setCity(newCity);
      e.target.blur();
    }
  }
  

  return (
    <>
    <div className="app" style={{backgroundImage:`url(${bg})`}}>
    <div className="h1tag">
    </div>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section_inputs">
              <input onKeyDown ={keypressed} type="text" name="city" placeholder="Enter city..."></input>
              <button onClick={(e)=>{handleonclick(e)}} style={{ color: "black" }}>°F</button>
            </div>

            <div className="section section_temperature">
              <div className="icon">
                <h3>{`${weather.name},${weather.country}`}</h3>
                <img src={weather.iconURL} alt={weather.description} />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed( )}° ${units==='metric' ? 'C' :'F'}`}</h1>
              </div>
            </div>
            <Descriptions weather={weather} units={units}/>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default App;
