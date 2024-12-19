import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import WeatherHistory from '../types/WeatherHistory'
import { formatTimestamp } from '../utils'

interface HistoryTableProps {
  weatherHistory: WeatherHistory
}

const HistoryTable = ({ weatherHistory }: HistoryTableProps) => {
  // Sorts the weather history by timestamp in descending order
  const sortWeatherHistory = (weatherHistory: { value: number; timestamp: Date }[]) => {
    return weatherHistory?.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  const temperatureInHistory = sortWeatherHistory(weatherHistory.temperature_in)
  const temperatureOutHistory = sortWeatherHistory(weatherHistory.temperature_out)
  const humidityHistory = sortWeatherHistory(weatherHistory.humidity)
  const pressureHistory = sortWeatherHistory(weatherHistory.pressure)

  const latestTimeStamp = formatTimestamp(temperatureInHistory[0]?.timestamp, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })

  const oldestTimeStamp = formatTimestamp(
    temperatureInHistory[temperatureInHistory.length - 1]?.timestamp,
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }
  )

  return (
    <Box textAlign="center" sx={{ m: 3 }}>
      <b>Historical data: {temperatureInHistory.length} rows</b>
      <p>
        {oldestTimeStamp} - {latestTimeStamp}
      </p>

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
            {temperatureInHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>No data available</TableCell>
              </TableRow>
            )}
            {temperatureInHistory?.map((temperatureIn, index) => (
              <TableRow key={`${temperatureIn.timestamp}-${index}`}>
                <TableCell>{formatTimestamp(temperatureIn.timestamp)}</TableCell>
                <TableCell>{temperatureIn.value} &deg;C</TableCell>
                <TableCell>{temperatureOutHistory[index]?.value ?? 'N/A'} &deg;C</TableCell>
                <TableCell>{humidityHistory[index]?.value ?? 'N/A'} %</TableCell>
                <TableCell>{pressureHistory[index]?.value ?? 'N/A'} hPa</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

HistoryTable.displayName = 'HistoryTable'
export default HistoryTable
