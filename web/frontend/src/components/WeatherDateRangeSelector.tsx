import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { formatDateForInput } from '../utils'

interface WeatherDateRangeSelectorProps {
  startDate: string
  setStartDate: (startDate: string) => void
  endDate: string
  setEndDate: (endDate: string) => void
  fetchLatestData: () => void
}

const WeatherDateRangeSelector = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  fetchLatestData,
}: WeatherDateRangeSelectorProps) => {
  // Set start date and end date according to the time period
  // timePeriodInHours: number - time period in hours
  const changeTimePeriod = (timePeriodInHours: number) => {
    const now = new Date()
    const timePeriodAgo = new Date(now.getTime() - timePeriodInHours * 1000 * 60 * 60)
    setEndDate(formatDateForInput(now))
    setStartDate(formatDateForInput(timePeriodAgo))
  }

  return (
    <Box>
      <Stack className="container-row" spacing={8} direction="row">
        <b>Weather history</b>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            fetchLatestData()
          }}
        >
          Update
        </Button>
      </Stack>
      <Stack className="container-row" spacing={8} direction="row">
        <label className="form-label" htmlFor="startDate">
          Start Date
        </label>
        <input
          className="form-input"
          type="datetime-local"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </Stack>
      <Stack className="container-row" spacing={8} direction="row">
        <label className="form-label" htmlFor="endDate">
          End Date
        </label>
        <input
          className="form-input"
          type="datetime-local"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Stack>
      <Stack spacing={2} direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={() => changeTimePeriod(1)}>
          1 hour
        </Button>
        <Button variant="contained" onClick={() => changeTimePeriod(24)}>
          1 day
        </Button>
        <Button variant="contained" onClick={() => changeTimePeriod(7 * 24)}>
          1 week
        </Button>
        <Button variant="contained" onClick={() => changeTimePeriod(30 * 24)}>
          1 month
        </Button>
        <Button variant="contained" onClick={() => changeTimePeriod(365 * 24)}>
          1 year
        </Button>
      </Stack>
    </Box>
  )
}

WeatherDateRangeSelector.displayName = 'WeatherDateRangeSelector'
export default WeatherDateRangeSelector
