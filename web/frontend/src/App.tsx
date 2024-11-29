import axios from "axios";
import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket";

// Checks if we are on development mode, if yes, use localhost, if no, use relative path in production deployment
const API_URL:string = import.meta.env.DEV ? 'http://localhost:8000' : '/api'
const WS_URL:string = import.meta.env.DEV ? 'ws://127.0.0.1:8002' : 'ws://iot-weather.us.to/notify'

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
  useWebSocket(`${WS_URL}`, {
    onMessage: async (message) => {
      const data = (await axios.get(`${API_URL}/${message.data}`)).data
      const eventName = message.data.replace('sensors/','');
      const nextObject = Object.fromEntries([[eventName, data]]);
      setWeatherData({...weatherData, ...nextObject});
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const data = (await axios.get(`${API_URL}/sensors/all`)).data;
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
