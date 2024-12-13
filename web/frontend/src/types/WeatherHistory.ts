import WeatherDataPoint from "./WeatherDataPoint";

interface WeatherHistory extends Record<string, any> {
  temperature_in: WeatherDataPoint[]
  temperature_out: WeatherDataPoint[]
  humidity: WeatherDataPoint[]
  pressure: WeatherDataPoint[]
}

export default WeatherHistory
