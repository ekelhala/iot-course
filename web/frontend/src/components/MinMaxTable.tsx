import WeatherDataMinMax from '../types/WeatherDataMinMax'
import { formatTimestamp } from '../utils'

interface MinMaxTableProps {
  weatherDataMinMax: WeatherDataMinMax
}

const MinMaxTable = ({ weatherDataMinMax }: MinMaxTableProps) => {
  return (
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
    </div>
  )
}

MinMaxTable.displayName = 'MinMaxTable'
export default MinMaxTable
