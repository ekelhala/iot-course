import { Box } from '@mui/material'
import WeatherHistory from '../types/WeatherHistory'
import { formatTimestamp } from '../utils'

interface HistoryTableProps {
  weatherHistory: WeatherHistory
}

const HistoryTable = ({ weatherHistory }: HistoryTableProps) => {
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
    <Box>
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
    </Box>
  )
}

HistoryTable.displayName = 'HistoryTable'
export default HistoryTable
