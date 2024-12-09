type WeatherData = {
  temperature_in: { value: number; timestamp: Date }
  temperature_out: { value: number; timestamp: Date }
  humidity: { value: number; timestamp: Date }
  pressure: { value: number; timestamp: Date }
}

export default WeatherData
