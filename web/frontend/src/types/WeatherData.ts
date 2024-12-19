import WeatherDataPoint from './WeatherDataPoint'

interface WeatherData extends Record<string, WeatherDataPoint> {
  temperature_in: WeatherDataPoint
  temperature_out: WeatherDataPoint
  humidity: WeatherDataPoint
  pressure: WeatherDataPoint
}

export default WeatherData
