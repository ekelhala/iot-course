import axios from 'axios'
import { API_URL } from '../constants'
import WeatherData from '../types/WeatherData'
import WeatherHistory from '../types/WeatherHistory'
import WeatherDataPoint from '../types/WeatherDataPoint'

// Generic function to get historical values
// Checks start and end dates
const getHistoricalData = async <T extends WeatherDataPoint|WeatherHistory> (start: string, end: string, endpoint: string): Promise<T> => {
  if (!start || !end) {
    throw new Error('Start and end dates are required')
  }
  return (await axios.get(`${API_URL}/history/${endpoint}?start=${start}&end=${end}`)).data
}

const getAll = async (start: string, end: string): Promise<WeatherHistory> => {
  return (await getHistoricalData<WeatherHistory>(start, end, 'all'))
}

// Gets the minimum historical weather data values in time interval start-end
const getMin = async (start: string, end: string): Promise<WeatherData> => {
  const minTemperatureIn = await getHistoricalData<WeatherDataPoint>(start, end, 'temperature_out/min')
  const minTemperatureOut = await getHistoricalData<WeatherDataPoint>(start, end, 'temperature_in/min')
  const minHumidity = await getHistoricalData<WeatherDataPoint>(start, end, 'humidity/min')
  const minPressure = await getHistoricalData<WeatherDataPoint>(start, end, 'pressure/min')

  return {
    temperature_in: minTemperatureIn,
    temperature_out: minTemperatureOut,
    humidity: minHumidity,
    pressure: minPressure
  }
}

const getMax = async (start: string, end: string): Promise<WeatherData> => {
  const maxTemperatureIn = await getHistoricalData<WeatherDataPoint>(start, end, 'temperature_out/max')
  const maxTemperatureOut = await getHistoricalData<WeatherDataPoint>(start, end, 'temperature_in/max')
  const maxHumidity = await getHistoricalData<WeatherDataPoint>(start, end, 'humidity/max')
  const maxPressure = await getHistoricalData<WeatherDataPoint>(start, end, 'pressure/max')

  return {
    temperature_in: maxTemperatureIn,
    temperature_out: maxTemperatureOut,
    humidity: maxHumidity,
    pressure: maxPressure
  }
}


export default { getAll, getMin, getMax }
