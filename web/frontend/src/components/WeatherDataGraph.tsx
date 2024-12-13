import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import WeatherDataPoint from '../types/WeatherDataPoint'
import { formatTimestamp } from '../utils'
import { scaleTime } from 'd3-scale'
import { useEffect, useState } from 'react'

const WeatherDataGraph = (props: { data: WeatherDataPoint[] }) => {
    const [domain, setDomain] = useState<[number, number] | null>(null)
    const [filteredDataPoints, setFilteredDataPoints] = useState<WeatherDataPoint[]>([])

    const thresholdFilter = (dataPoints: WeatherDataPoint[]) => {
        // Get raw values
        const values = dataPoints.map((point) => point.value);
        // calculate mean and standard deviation
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
        // form the threshold value at three standard deviations
        const threshold = mean + 3 * stdDev;
        // filter the data
        const filteredDataPoints = dataPoints.filter((dataPoint) => dataPoint.value < threshold)
        return filteredDataPoints
    }

  useEffect(() => {
    const filtered = thresholdFilter(props.data)
    const numericValues = filtered.map((value) => new Date(value.timestamp).valueOf())
    const min = Math.min(...numericValues)
    const max = Math.max(...numericValues)
    setDomain([min, max])
    setFilteredDataPoints(filtered)
  }, [props.data])

  if (domain) {
    return (
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
    )
  }
  return null
}

export default WeatherDataGraph
