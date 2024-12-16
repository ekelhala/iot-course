import { scaleTime } from 'd3-scale'
import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import WeatherDataPoint from '../types/WeatherDataPoint'
import WeatherHistory from '../types/WeatherHistory'
import { formatTimestamp } from '../utils'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material'

interface WeatherDataGraphProps {
  weatherHistory: WeatherHistory
}

const WeatherDataGraph = ({ weatherHistory }: WeatherDataGraphProps) => {
  const [selectedWeatherData, setSelectedWeatherData] = useState('temperature_out')
  const [domain, setDomain] = useState<[number, number] | null>(null)
  const [filteredDataPoints, setFilteredDataPoints] = useState<WeatherDataPoint[]>([])

  // Get the selected weather data
  const weatherData = weatherHistory[selectedWeatherData]

  const thresholdFilter = (dataPoints: WeatherDataPoint[]) => {
    // Get raw values
    const values = dataPoints.map((point) => point.value)
    // calculate mean and standard deviation
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length
    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    )
    // form the threshold value at three standard deviations
    const threshold = mean + 3 * stdDev
    // filter the data
    const filteredDataPoints = dataPoints.filter((dataPoint) => dataPoint.value < threshold)
    return filteredDataPoints
  }

  useEffect(() => {
    const filtered = thresholdFilter(weatherData)
    const numericValues = filtered.map((value) => new Date(value.timestamp).valueOf())
    const min = Math.min(...numericValues)
    const max = Math.max(...numericValues)
    setDomain([min, max])
    setFilteredDataPoints(filtered)
  }, [weatherData])

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedWeatherData(event.target.value)
  }

  if (domain) {
    return (
      <Box>
        <Stack className="container-row" spacing={4} direction="row">
          <b>Chart</b>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Weather data</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedWeatherData}
              label="Weather data"
              onChange={handleChange}
            >
              {Object.keys(weatherHistory).map((historyItem) => (
                <MenuItem key={`history-selector-${historyItem}`} value={historyItem}>
                  {historyItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <LineChart
          width={500}
          height={200}
          data={filteredDataPoints.map((data) => {
            return { timestamp: new Date(data.timestamp).valueOf(), value: data.value }
          })}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            domain={domain}
            scale="time"
            type="number"
            ticks={scaleTime()
              .domain(domain)
              .ticks(5)
              .map((date) => date.valueOf())}
            tickFormatter={formatTimestamp}
          />
          <YAxis />
          <Tooltip labelFormatter={formatTimestamp} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </Box>
    )
  }
  return null
}

export default WeatherDataGraph
