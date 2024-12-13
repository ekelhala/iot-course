import axios from 'axios'
import { format } from 'date-fns-tz'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import './App.css'
import LatestWeatherTable from './components/LatestWeatherTable'
import WeatherDataGraph from './components/WeatherDataGraph'
import { API_URL, WS_URL } from './constants'
import historyService from './services/history'
import sensorService from './services/sensors'
import WeatherData from './types/WeatherData'
import WeatherDataMinMax from './types/WeatherDataMinMax'
import WeatherHistory from './types/WeatherHistory'
import { formatDateForInput } from './utils'
import WeatherDateRangeSelector from './components/WeatherDateRangeSelector'

function App() {
  // First day of the year
  const initialStartDate = formatDateForInput(new Date(new Date().getFullYear(), 0, 1))

  // Current date and time
  const initialEndDate = formatDateForInput(new Date())

  const [startDate, setStartDate] = useState<string>(initialStartDate)
  const [endDate, setEndDate] = useState<string>(initialEndDate)
  const [selectedWeatherData, setSelectedWeatherData] = useState('temperature_out')

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

  const [weatherDataMinMax, setWeatherDataMinMax] = useState<WeatherDataMinMax>({
    min: {
      temperature_in: { value: 0, timestamp: new Date() },
      temperature_out: { value: 0, timestamp: new Date() },
      humidity: { value: 0, timestamp: new Date() },
      pressure: { value: 0, timestamp: new Date() },
    },
    max: {
      temperature_in: { value: 0, timestamp: new Date() },
      temperature_out: { value: 0, timestamp: new Date() },
      humidity: { value: 0, timestamp: new Date() },
      pressure: { value: 0, timestamp: new Date() },
    },
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

  const getMinMaxWeatherData = async () => {
    const startDateFormatted = format(new Date(startDate), 'yyyy-MM-dd')
    const endDateFormatted = format(new Date(endDate), 'yyyy-MM-dd')

    const max = await historyService.getMax(startDateFormatted, endDateFormatted)
    const min = await historyService.getMin(startDateFormatted, endDateFormatted)
    setWeatherDataMinMax({ max, min })
  }

  const fetchLatestData = async () => {
    await getLatestSensorData()
    await getWeatherHistoryData()
    await getMinMaxWeatherData()
  }

  useEffect(() => {
    fetchLatestData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

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
      <LatestWeatherTable weatherDataLatest={weatherDataLatest} />
      <WeatherDateRangeSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        fetchLatestData={fetchLatestData}
      />

      <div className="container">
        <p>Chart</p>
        <select
          onChange={(event) => setSelectedWeatherData(event.target.value)}
          value={selectedWeatherData}
        >
          {Object.keys(weatherHistory).map((historyItem) => (
            <option key={`history-selector-${historyItem}`} value={historyItem}>
              {historyItem}
            </option>
          ))}
        </select>
        <WeatherDataGraph weatherData={weatherHistory[selectedWeatherData]} />
      </div>

      <div className="container">
        <p>Maximum values during period</p>
        <table className="weather-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(weatherDataMinMax.max).map((dataType: string) => {
              // If there is no data, display a message
              if (!weatherDataMinMax.max[dataType].value) {
                return (
                  <tr>
                    <td>{dataType}</td>
                    <td colSpan={2}>No data available</td>
                  </tr>
                )
              }
              return (
                <tr key={`max-${dataType}`}>
                  <td>{dataType}</td>
                  <td>{weatherDataMinMax.max[dataType].value}</td>
                  <td>{formatTimestamp(weatherDataMinMax.max[dataType].timestamp)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p>Minimum values during period</p>
        <table className="weather-table">
          <thead>
            <tr>
              <th>type</th>
              <th>value</th>
              <th>timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(weatherDataMinMax.min).map((dataType: string) => {
              // If there is no data, display a message
              if (!weatherDataMinMax.min[dataType].value) {
                return (
                  <tr>
                    <td>{dataType}</td>
                    <td colSpan={2}>No data available</td>
                  </tr>
                )
              }
              return (
                <tr key={`min-${dataType}`}>
                  <td>{dataType}</td>
                  <td>{weatherDataMinMax.min[dataType].value}</td>
                  <td>{formatTimestamp(weatherDataMinMax.min[dataType].timestamp)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <p>Historical data</p>
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
