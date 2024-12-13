import WeatherDataPoint from "./WeatherDataPoint";

type WeatherHistory = {
  temperature_in: WeatherDataPoint[]
  temperature_out: WeatherDataPoint[]
  humidity: WeatherDataPoint[]
  pressure: WeatherDataPoint[]
}

export default WeatherHistory
