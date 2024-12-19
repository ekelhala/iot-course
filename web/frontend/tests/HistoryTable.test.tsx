import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect } from 'vitest'
import HistoryTable from '../src/components/HistoryTable'
import WeatherHistory from '../src/types/WeatherHistory'

const mockWeatherHistory: WeatherHistory = {
  temperature_in: [
    { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 22 },
    { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 23 },
  ],
  temperature_out: [
    { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 18 },
    { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 19 },
  ],
  humidity: [
    { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 55 },
    { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 60 },
  ],
  pressure: [
    { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 1012 },
    { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 1013 },
  ],
}

describe('HistoryTable', () => {
  test('renders without crashing and displays the correct number of rows', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('Historical data: 2 rows')).toBeInTheDocument()
  })

  test('displays the correct date range', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('1.10.2023 - 2.10.2023')).toBeInTheDocument()
  })

  test('displays the correct data in the table', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('18 °C')).toBeInTheDocument()
    expect(screen.getByText('19 °C')).toBeInTheDocument()
    expect(screen.getByText('22 °C')).toBeInTheDocument()
    expect(screen.getByText('23 °C')).toBeInTheDocument()
    expect(screen.getByText('55 %')).toBeInTheDocument()
    expect(screen.getByText('60 %')).toBeInTheDocument()
    expect(screen.getByText('1012 hPa')).toBeInTheDocument()
    expect(screen.getByText('1013 hPa')).toBeInTheDocument()
  })

  test('displays "N/A" for missing data', () => {
    const mockWeatherHistory: WeatherHistory = {
      temperature_in: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 22 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 23 },
        { timestamp: new Date('2023-10-03T10:00:00.123Z'), value: 24 },
        { timestamp: new Date('2023-10-04T10:00:00.123Z'), value: 25 },
      ],
      temperature_out: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 18 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 19 },
      ],
      humidity: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 55 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 60 },
      ],
      pressure: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 1012 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 1013 },
      ],
    }
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('Historical data: 4 rows')).toBeInTheDocument()
    expect(screen.getByText('1.10.2023 - 4.10.2023')).toBeInTheDocument()
    expect(screen.queryAllByText('N/A').length).toBe(6)
  })

  test('renders weather history with correct timestamps', () => {
    const mockWeatherHistory: WeatherHistory = {
      temperature_in: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 22 },
        { timestamp: new Date('2023-10-02T10:00:00.135Z'), value: 23 },
        { timestamp: new Date('2023-10-03T10:00:00.137Z'), value: 24 },
      ],
      temperature_out: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 18 },
        { timestamp: new Date('2023-10-02T10:00:00.135Z'), value: 19 },
      ],
      humidity: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 55 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 60 },
        { timestamp: new Date('2023-11-02T10:00:00.154Z'), value: 60 },
      ],
      pressure: [
        { timestamp: new Date('2023-10-01T10:00:00.223Z'), value: 1012 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 1013 },
        { timestamp: new Date('2023-10-05T10:00:00.123Z'), value: 1014 },
        { timestamp: new Date('2023-10-06T10:00:00.123Z'), value: 1015 },
        { timestamp: new Date('2023-10-07T10:00:00.173Z'), value: 1016 },
      ],
    }
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('Historical data: 7 rows')).toBeInTheDocument()
    expect(screen.queryAllByText('N/A').length).toBe(15)
  })

  test('renders weather history without data', () => {
    const mockWeatherHistory: WeatherHistory = {
      temperature_in: [],
      temperature_out: [],
      humidity: [],
      pressure: [],
    }
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('Historical data: 0 rows')).toBeInTheDocument()
    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument()
  })

  test('renders weather history with one data point', () => {
    const mockWeatherHistory: WeatherHistory = {
      temperature_in: [{ timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 21 }],
      temperature_out: [],
      humidity: [],
      pressure: [],
    }
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('Historical data: 1 row')).toBeInTheDocument()
    expect(screen.getByText('1.10.2023 - 1.10.2023')).toBeInTheDocument()
    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument()
    expect(screen.queryByText('No data available')).not.toBeInTheDocument()
    expect(screen.queryAllByText('N/A').length).toBe(3)
  })

  test('renders weather history with only humidity', () => {
    const mockWeatherHistory: WeatherHistory = {
      temperature_in: [],
      temperature_out: [],
      humidity: [
        { timestamp: new Date('2023-10-01T10:00:00.123Z'), value: 55 },
        { timestamp: new Date('2023-10-02T10:00:00.123Z'), value: 60 },
        { timestamp: new Date('2023-11-02T10:00:00.123Z'), value: 60 },
      ],
      pressure: [],
    }
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('Historical data: 3 rows')).toBeInTheDocument()
    expect(screen.getByText('1.10.2023 - 2.11.2023')).toBeInTheDocument()
    expect(screen.queryByText('No data available')).not.toBeInTheDocument()
    expect(screen.queryByText('Invalid Date')).not.toBeInTheDocument()
    expect(screen.queryAllByText('N/A').length).toBe(9)
  })
})
