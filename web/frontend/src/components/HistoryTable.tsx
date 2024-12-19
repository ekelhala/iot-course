import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import WeatherDataPoint from '../types/WeatherDataPoint'
import WeatherHistory from '../types/WeatherHistory'
import { formatTimestamp } from '../utils'

interface HistoryTableProps {
  weatherHistory: WeatherHistory
}

const HistoryTable = ({ weatherHistory }: HistoryTableProps) => {
  // Collect all unique timestamps from the weather history
  const timestamps = new Set<string>()

  Object.values(weatherHistory).forEach((dataArray) => {
    dataArray.forEach((weatherData) => {
      // Remove milliseconds from the timestamp
      const formattedTimestamp = new Date(
        new Date(weatherData.timestamp).setMilliseconds(0)
      ).toISOString()
      if (!timestamps.has(formattedTimestamp)) {
        timestamps.add(formattedTimestamp)
      }
    })
  })

  // Sorts the weather history by timestamp in descending order
  const sortedTimestamps = Array.from(timestamps).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  const latestTimeStamp = formatTimestamp(new Date(sortedTimestamps[0]), {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })

  const oldestTimeStamp = formatTimestamp(new Date(sortedTimestamps[sortedTimestamps.length - 1]), {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })

  // Find weather data matching a normalized timestamp
  const findWeatherData = (dataArray: WeatherDataPoint[], normalizedTimestamp: Date) =>
    dataArray.find(
      (data) =>
        new Date(new Date(data.timestamp).setMilliseconds(0)).getTime() ===
        normalizedTimestamp.getTime()
    )

  return (
    <Box textAlign="center" sx={{ m: 3 }}>
      {sortedTimestamps.length === 1 ? (
        <b>Historical data: 1 row</b>
      ) : (
        <b>Historical data: {sortedTimestamps.length} rows</b>
      )}
      {sortedTimestamps.length > 0 && (
        <p>
          {oldestTimeStamp} - {latestTimeStamp}
        </p>
      )}
      <TableContainer className="weather-table" component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">temperature_in</TableCell>
              <TableCell align="left">temperature_out</TableCell>
              <TableCell align="left">humidity</TableCell>
              <TableCell align="left">pressure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTimestamps.length === 0 && (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  No data available
                </TableCell>
              </TableRow>
            )}
            {sortedTimestamps.map((timestamp) => {
              const date = new Date(timestamp)
              const normalizedDate = new Date(date.setMilliseconds(0))

              const temperatureIn = findWeatherData(weatherHistory.temperature_in, normalizedDate)
              const temperatureOut = findWeatherData(weatherHistory.temperature_out, normalizedDate)
              const humidity = findWeatherData(weatherHistory.humidity, normalizedDate)
              const pressure = findWeatherData(weatherHistory.pressure, normalizedDate)

              return (
                <TableRow key={timestamp}>
                  <TableCell>
                    {formatTimestamp(date, {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    {temperatureIn ? (
                      <span>{temperatureIn.value} &deg;C</span>
                    ) : (
                      <span style={{ color: 'red' }}>N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {temperatureOut ? (
                      <span>{temperatureOut.value} &deg;C</span>
                    ) : (
                      <span style={{ color: 'red' }}>N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {humidity ? (
                      <span>{humidity.value} %</span>
                    ) : (
                      <span style={{ color: 'red' }}>N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {pressure ? (
                      <span>{pressure.value} hPa</span>
                    ) : (
                      <span style={{ color: 'red' }}>N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

HistoryTable.displayName = 'HistoryTable'
export default HistoryTable
