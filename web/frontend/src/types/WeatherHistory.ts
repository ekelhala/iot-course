import WeatherDataPoint from './WeatherDataPoint'

interface WeatherHistory extends Record<string, WeatherDataPoint[]> {
  temperature_in: WeatherDataPoint[]
  temperature_out: WeatherDataPoint[]
  humidity: WeatherDataPoint[]
  pressure: WeatherDataPoint[]
}

export default WeatherHistory
