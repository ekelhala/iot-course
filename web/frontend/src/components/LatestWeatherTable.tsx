import WeatherData from '../types/WeatherData'

interface LatestWeatherTableProps {
  weatherDataLatest: WeatherData
}

const LatestWeatherTable = ({ weatherDataLatest }: LatestWeatherTableProps) => {
  return (
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
  )
}

LatestWeatherTable.displayName = 'LatestWeatherTable'
export default LatestWeatherTable
