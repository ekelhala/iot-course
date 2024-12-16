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

  return (
    <Box textAlign="center" sx={{ m: 3 }}>
      <b>Historical data</b>

      <TableContainer className="weather-table" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">temperature_in</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {temperatureInHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>No data available</TableCell>
              </TableRow>
            )}
            {temperatureInHistory?.map((item, index) => (
              <TableRow key={`${item.timestamp}-${index}`}>
                <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                <TableCell>{item.value}&deg;C</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className="weather-table" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">temperature_out</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {temperatureOutHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>No data available</TableCell>
              </TableRow>
            )}
            {temperatureOutHistory?.map((item, index) => (
              <TableRow key={`${item.timestamp}-${index}`}>
                <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                <TableCell>{item.value}&deg;C</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className="weather-table" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">humidity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {humidityHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>No data available</TableCell>
              </TableRow>
            )}
            {humidityHistory?.map((item, index) => (
              <TableRow key={`${item.timestamp}-${index}`}>
                <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                <TableCell>{item.value}&deg;C</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className="weather-table" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">pressure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pressureHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>No data available</TableCell>
              </TableRow>
            )}
            {pressureHistory?.map((item, index) => (
              <TableRow key={`${item.timestamp}-${index}`}>
                <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                <TableCell>{item.value}&deg;C</TableCell>
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
