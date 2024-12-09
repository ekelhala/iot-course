import axios from 'axios'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.css'

// Checks if we are on development mode, if yes, use localhost, if no, use relative path in production deployment
const API_URL: string = import.meta.env.DEV ? 'http://localhost:8001' : '/api'
const WS_URL: string = import.meta.env.DEV ? 'ws://127.0.0.1:8002' : 'ws://iot-weather.us.to/notify'

function App() {
  const [weatherData, setWeatherData] = useState({
    temperature_in: {
      value: 0,
      timestamp: 0,
    },
    temperature_out: {
      value: 0,
      timestamp: 0,
    },
    humidity: {
      value: 0,
      timestamp: 0,
    },
    pressure: {
      value: 0,
      timestamp: 0,
    },
  })

  const [weatherHistory, setWeatherHistory] = useState({
    temperature_in: [] as { value: number; timestamp: Date }[],
    temperature_out: [] as { value: number; timestamp: Date }[],
    humidity: [] as { value: number; timestamp: Date }[],
    pressure: [] as { value: number; timestamp: Date }[],
  })

  useWebSocket(`${WS_URL}`, {
    onMessage: async (message) => {
      const data = (await axios.get(`${API_URL}/${message.data}`)).data
      const eventName = message.data.replace('sensors/', '')
      const nextObject = Object.fromEntries([[eventName, data]])
      setWeatherData({ ...weatherData, ...nextObject })
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const data = (await axios.get(`${API_URL}/sensors/all`)).data
      setWeatherData(data)
    }
    fetchData()
  }, [])

  const getWeatherHistory = async () => {
    const data = (await axios.get(`${API_URL}/history/all?start=2024-11-01&end=2024-12-31`)).data
    console.log(data)
    setWeatherHistory(data)
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <>
      <div className="container">
        <b>Latest weather data</b>
        <table className="weather-table">
          <tbody>
            <tr>
              <td>temperature_in</td>
              <td>{weatherData.temperature_in?.value}&deg;C</td>
            </tr>
            <tr>
              <td>temperature_out</td>
              <td>{weatherData.temperature_out?.value}&deg;C</td>
            </tr>
            <tr>
              <td>humidity</td>
              <td>{weatherData.humidity?.value}%</td>
            </tr>
            <tr>
              <td>pressure</td>
              <td>{weatherData.pressure?.value} hPa</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container">
        <b>Weather history</b>
        <button onClick={getWeatherHistory}>Update</button>
        <table className="weather-table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>temperature_in</th>
            </tr>
          </thead>
          <tbody>
            {weatherHistory.temperature_in
              ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((item, index) => (
                <tr key={`${item.timestamp}-${index}`}>
                  <td>{formatTimestamp(item.timestamp)}</td>
                  <td>{item.value}&deg;C</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
