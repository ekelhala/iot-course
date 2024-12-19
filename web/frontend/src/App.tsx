import axios from 'axios'
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import HistoryTable from './components/HistoryTable'
import LatestWeatherTable from './components/LatestWeatherTable'
import MinMaxTable from './components/MinMaxTable'
import WeatherDataGraph from './components/WeatherDataGraph'
import WeatherDateRangeSelector from './components/WeatherDateRangeSelector'
import { API_URL, WS_URL } from './constants'
import historyService from './services/history'
import sensorService from './services/sensors'
import WeatherData from './types/WeatherData'
import WeatherDataMinMax from './types/WeatherDataMinMax'
import WeatherHistory from './types/WeatherHistory'
import { formatDateForInput } from './utils'

function App() {
  // First day of the year
  const initialStartDate = formatDateForInput(new Date(new Date().getFullYear(), 0, 1))

  // Current date and time
  const initialEndDate = formatDateForInput(new Date())

  const [startDate, setStartDate] = useState<string>(initialStartDate)
  const [endDate, setEndDate] = useState<string>(initialEndDate)

  const [weatherDataLatest, setWeatherDataLatest] = useState<WeatherData>({
    temperature_in: { value: 0, timestamp: new Date(), unit: '°C' },
    temperature_out: { value: 0, timestamp: new Date(), unit: '°C' },
    humidity: { value: 0, timestamp: new Date(), unit: '%' },
    pressure: { value: 0, timestamp: new Date(), unit: 'hPa' },
  })

  const [weatherHistory, setWeatherHistory] = useState<WeatherHistory>({
    temperature_in: [],
    temperature_out: [],
    humidity: [],
    pressure: [],
  })

  const [weatherDataMinMax, setWeatherDataMinMax] = useState<WeatherDataMinMax>({
    min: {
      temperature_in: { value: 0, timestamp: new Date(), unit: '°C' },
      temperature_out: { value: 0, timestamp: new Date(), unit: '°C' },
      humidity: { value: 0, timestamp: new Date(), unit: '%' },
      pressure: { value: 0, timestamp: new Date(), unit: 'hPa' },
    },
    max: {
      temperature_in: { value: 0, timestamp: new Date(), unit: '°C' },
      temperature_out: { value: 0, timestamp: new Date(), unit: '°C' },
      humidity: { value: 0, timestamp: new Date(), unit: '%' },
      pressure: { value: 0, timestamp: new Date(), unit: 'hPa' },
    },
  })

  useWebSocket(`${WS_URL}`, {
    onMessage: async (message) => {
      const data = (await axios.get(`${API_URL}/${message.data}`)).data
      const eventName = message.data.replace('sensors/', '')
      const nextObject = Object.fromEntries([[eventName, data]])
      setWeatherDataLatest({ ...weatherDataLatest, ...nextObject })
    },
  })

  const getLatestSensorData = async () => {
    sensorService.getAll().then((data) => {
      console.log(data)
      setWeatherDataLatest(data)
    })
  }

  const getWeatherHistoryData = async () => {
    const startDateFormatted = new Date(startDate).toISOString()
    const endDateFormatted = new Date(endDate).toISOString()
    console.log(startDateFormatted, endDateFormatted)

    historyService.getAll(startDateFormatted, endDateFormatted).then((data) => {
      console.log(data)
      setWeatherHistory(data)
    })
  }

  const getMinMaxWeatherData = async () => {
    const startDateFormatted = new Date(startDate).toISOString()
    const endDateFormatted = new Date(endDate).toISOString()

    const max = await historyService.getMax(startDateFormatted, endDateFormatted)
    const min = await historyService.getMin(startDateFormatted, endDateFormatted)
    setWeatherDataMinMax({ max, min })
  }

  const fetchLatestData = async () => {
    await getLatestSensorData()
    await getWeatherHistoryData()
    await getMinMaxWeatherData()
  }

  useEffect(() => {
    fetchLatestData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  return (
    <>
      <LatestWeatherTable weatherDataLatest={weatherDataLatest} />
      <WeatherDateRangeSelector
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        fetchLatestData={fetchLatestData}
      />
      <WeatherDataGraph weatherHistory={weatherHistory} />
      <MinMaxTable weatherDataMinMax={weatherDataMinMax} />
      <HistoryTable weatherHistory={weatherHistory} />
    </>
  )
}

export default App
