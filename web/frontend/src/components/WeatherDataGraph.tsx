import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from 'recharts'
import WeatherDataPoint from '../types/WeatherDataPoint'
import { formatTimestamp } from '../utils'
import { scaleTime } from 'd3-scale'
import { useEffect, useState } from 'react'

const WeatherDataGraph = (props: { data: WeatherDataPoint[] }) => {
  const [domain, setDomain] = useState<[number, number] | null>(null)

  useEffect(() => {
    const numericValues = props.data.map((value) => new Date(value.timestamp).valueOf())
    const min = Math.min(...numericValues)
    const max = Math.max(...numericValues)
    setDomain([min, max])
  }, [props.data])

  if (domain) {
    return (
      <LineChart
        width={500}
        height={200}
        data={props.data.map((data) => {
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
        <Tooltip labelFormatter={formatTimestamp} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    )
  }
  return null
}

export default WeatherDataGraph
