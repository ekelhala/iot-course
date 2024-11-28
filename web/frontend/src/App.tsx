import axios from "axios";
import { useEffect, useState } from "react"

function App() {

  const [weatherData, setWeatherData] = useState({
    temperature_in: {
      value: 0,
      timestamp: 0
    },
    temperature_out: {
      value: 0,
      timestamp: 0
    },
    humidity: {
      value: 0,
      timestamp: 0
    },
    pressure: {
      value: 0,
      timestamp: 0
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const data = (await axios.get('http://localhost:8000/sensors/all')).data;
      setWeatherData(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <b>Latest weather data</b>
      <table>
        <tbody>
          <tr>
            <td>temperature_in</td><td>{weatherData.temperature_in?.value}&deg;C</td>
          </tr>
          <tr>
          <td>temperature_out</td><td>{weatherData.temperature_out?.value}&deg;C</td>
          </tr>
          <tr>
          <td>humidity</td><td>{weatherData.humidity?.value}%</td>
          </tr>
          <tr>
          <td>pressure</td><td>{weatherData.pressure?.value} hPa</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default App