import WeatherDataPoint from './WeatherDataPoint'

interface WeatherData extends Record<string, any> {
  temperature_in: WeatherDataPoint
  temperature_out: WeatherDataPoint
  humidity: WeatherDataPoint
  pressure: WeatherDataPoint
}

export default WeatherData
