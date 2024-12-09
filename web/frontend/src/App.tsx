import axios from 'axios'
import { format } from 'date-fns-tz'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.css'
import { API_URL, WS_URL } from './constants'
import historyService from './services/history'
import sensorService from './services/sensors'
import WeatherData from './types/WeatherData'
import WeatherHistory from './types/WeatherHistory'

function App() {
  const formatDateForInput = (date: Date): string => {
    return format(date, "yyyy-MM-dd'T'HH:mm")
  }

  // First day of the year
  const initialStartDate = formatDateForInput(new Date(new Date().getFullYear(), 0, 1))

  // Current date and time
  const initialEndDate = formatDateForInput(new Date())

  const [startDate, setStartDate] = useState<string>(initialStartDate)
  const [endDate, setEndDate] = useState<string>(initialEndDate)

  const [weatherDataLatest, setWeatherDataLatest] = useState<WeatherData>({
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
      setWeatherDataLatest({ ...weatherDataLatest, ...nextObject })
    },
  })

  const getLatestSensorData = async () => {
    sensorService.getAll().then((data) => {
      console.log(data)
      setWeatherDataLatest(data)
    })
  }

  const getWeatherHistoryData = async () => {
    const startDateFormatted = format(new Date(startDate), 'yyyy-MM-dd')
    const endDateFormatted = format(new Date(endDate), 'yyyy-MM-dd')
    console.log(startDateFormatted, endDateFormatted)

    historyService.getAll(startDateFormatted, endDateFormatted).then((data) => {
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
              <td>{weatherDataLatest.temperature_in?.value}&deg;C</td>
            </tr>
            <tr>
              <td>temperature_out</td>
              <td>{weatherDataLatest.temperature_out?.value}&deg;C</td>
            </tr>
            <tr>
              <td>humidity</td>
              <td>{weatherDataLatest.humidity?.value}%</td>
            </tr>
            <tr>
              <td>pressure</td>
              <td>{weatherDataLatest.pressure?.value} hPa</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container">
        <div className="container-row">
          <b>Weather history</b>
          <button onClick={getWeatherHistoryData}>Update</button>
        </div>
        <div className="container-row">
          <label className="form-label" htmlFor="startDate">
            Start Date
          </label>
          <input
            className="form-input"
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="container-row">
          <label className="form-label" htmlFor="endDate">
            End Date
          </label>
          <input
            className="form-input"
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <table className="weather-table">
          <thead>
            <tr>
              <th>timestamp</th>
              <th>temperature_in</th>
            </tr>
          </thead>
          <tbody>
            {temperatureInHistory.length === 0 && (
              <tr>
                <td colSpan={2}>No data available</td>
              </tr>
            )}
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
            {temperatureOutHistory.length === 0 && (
              <tr>
                <td colSpan={2}>No data available</td>
              </tr>
            )}
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
            {humidityHistory.length === 0 && (
              <tr>
                <td colSpan={2}>No data available</td>
              </tr>
            )}
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
            {pressureHistory.length === 0 && (
              <tr>
                <td colSpan={2}>No data available</td>
              </tr>
            )}
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
