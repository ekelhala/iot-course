import { Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import WeatherDataMinMax from '../types/WeatherDataMinMax'
import { formatTimestamp } from '../utils'

interface MinMaxTableProps {
  weatherDataMinMax: WeatherDataMinMax
}

const MinMaxTable = ({ weatherDataMinMax }: MinMaxTableProps) => {
  return (
    <Box textAlign="center" sx={{ m: 3 }}>
      <b>Maximum values during period</b>
      <TableContainer className="weather-table" component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Value</TableCell>
              <TableCell align="left">Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(weatherDataMinMax.max).map((dataType: string) => {
              // If there is no data, display a message
              if (!weatherDataMinMax.max[dataType].value) {
                return (
                  <TableRow key={`max-${dataType}`}>
                    <TableCell>{dataType}</TableCell>
                    <TableCell colSpan={2}>No data available</TableCell>
                  </TableRow>
                )
              }
              return (
                <TableRow key={`max-${dataType}`}>
                  <TableCell>{dataType}</TableCell>
                  <TableCell>{weatherDataMinMax.max[dataType].value}</TableCell>
                  <TableCell>
                    {formatTimestamp(weatherDataMinMax.max[dataType].timestamp)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <b>Minimum values during period</b>
      <TableContainer className="weather-table" component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Value</TableCell>
              <TableCell align="left">Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(weatherDataMinMax.min).map((dataType: string) => {
              // If there is no data, display a message
              if (!weatherDataMinMax.min[dataType].value) {
                return (
                  <TableRow key={`min-${dataType}`}>
                    <TableCell>{dataType}</TableCell>
                    <TableCell colSpan={2}>No data available</TableCell>
                  </TableRow>
                )
              }
              return (
                <TableRow key={`min-${dataType}`}>
                  <TableCell>{dataType}</TableCell>
                  <TableCell>{weatherDataMinMax.min[dataType].value}</TableCell>
                  <TableCell>
                    {formatTimestamp(weatherDataMinMax.min[dataType].timestamp)}
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

MinMaxTable.displayName = 'MinMaxTable'
export default MinMaxTable
