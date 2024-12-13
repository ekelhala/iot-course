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
    <div className="container">
      <div className="container-row space-between width-70">
        <b>Weather history</b>
        <button
          onClick={() => {
            fetchLatestData()
          }}
        >
          Update
        </button>
      </div>
      <div className="container-row space-between width-70">
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
      </div>
      <div className="container-row space-between width-70">
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
      </div>
      <div className="container-row">
        <button onClick={() => changeTimePeriod(1)}>1 hour</button>
        <button onClick={() => changeTimePeriod(24)}>1 day</button>
        <button onClick={() => changeTimePeriod(7 * 24)}>1 week</button>
        <button onClick={() => changeTimePeriod(30 * 24)}>1 month</button>
        <button onClick={() => changeTimePeriod(365 * 24)}>1 year</button>
      </div>
    </div>
  )
}

WeatherDateRangeSelector.displayName = 'WeatherDateRangeSelector'
export default WeatherDateRangeSelector
