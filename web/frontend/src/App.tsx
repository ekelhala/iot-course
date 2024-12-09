import axios from 'axios'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.css'
import { API_URL, WS_URL } from './constants'
import historyService from './services/history'
import sensorService from './services/sensors'
import WeatherData from './types/WeatherData'
import WeatherHistory from './types/WeatherHistory'

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature_in: { value: 0, timestamp: new Date() },
    temperature_out: { value: 0, timestamp: new Date() },
    humidity: { value: 0, timestamp: new Date() },
    pressure: { value: 0, timestamp: new Date() },
  })

  const [weatherHistory, setWeatherHistory] = useState<WeatherHistory>({
    temperature_in: [],
    temperature_out: [],
    humidity: [],
    pressure: [],
  })

  useWebSocket(`${WS_URL}`, {
    onMessage: async (message) => {
      const data = (await axios.get(`${API_URL}/${message.data}`)).data
      const eventName = message.data.replace('sensors/', '')
      const nextObject = Object.fromEntries([[eventName, data]])
      setWeatherData({ ...weatherData, ...nextObject })
    },
  })

  const getLatestSensorData = async () => {
    sensorService.getAll().then((data) => {
      console.log(data)
      setWeatherData(data)
    })
  }

  const getWeatherHistoryData = async () => {
    historyService.getAll().then((data) => {
      console.log(data)
      setWeatherHistory(data)
    })
  }

  useEffect(() => {
    getLatestSensorData()
    getWeatherHistoryData()
  }, [])

  // Converts a date and time to a string by using the current or specified locale
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
  }

  // Sorts the weather history by timestamp in descending order
  const sortWeatherHistory = (weatherHistory: { value: number; timestamp: Date }[]) => {
    return weatherHistory?.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  const temperatureInHistory = sortWeatherHistory(weatherHistory.temperature_in)
  const temperatureOutHistory = sortWeatherHistory(weatherHistory.temperature_out)
  const humidityHistory = sortWeatherHistory(weatherHistory.humidity)
  const pressureHistory = sortWeatherHistory(weatherHistory.pressure)

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
        <button onClick={getWeatherHistoryData}>Update</button>
        <table className="weather-table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>temperature_in</th>
            </tr>
          </thead>
          <tbody>
            {temperatureInHistory?.map((item, index) => (
              <tr key={`${item.timestamp}-${index}`}>
                <td>{formatTimestamp(item.timestamp)}</td>
                <td>{item.value}&deg;C</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="weather-table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>temperature_out</th>
            </tr>
          </thead>
          <tbody>
            {temperatureOutHistory?.map((item, index) => (
              <tr key={`${item.timestamp}-${index}`}>
                <td>{formatTimestamp(item.timestamp)}</td>
                <td>{item.value}&deg;C</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="weather-table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>humidity</th>
            </tr>
          </thead>
          <tbody>
            {humidityHistory?.map((item, index) => (
              <tr key={`${item.timestamp}-${index}`}>
                <td>{formatTimestamp(item.timestamp)}</td>
                <td>{item.value}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="weather-table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>pressure</th>
            </tr>
          </thead>
          <tbody>
            {pressureHistory?.map((item, index) => (
              <tr key={`${item.timestamp}-${index}`}>
                <td>{formatTimestamp(item.timestamp)}</td>
                <td>{item.value} hPa</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
