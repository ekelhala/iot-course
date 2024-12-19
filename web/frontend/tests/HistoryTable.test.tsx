import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect } from 'vitest'
import HistoryTable from '../src/components/HistoryTable'
import WeatherHistory from '../src/types/WeatherHistory'

const mockWeatherHistory: WeatherHistory = {
  temperature_in: [
    { timestamp: new Date('2023-10-01T10:00:00Z'), value: 22 },
    { timestamp: new Date('2023-10-02T10:00:00Z'), value: 23 },
  ],
  temperature_out: [
    { timestamp: new Date('2023-10-01T10:00:00Z'), value: 18 },
    { timestamp: new Date('2023-10-02T10:00:00Z'), value: 19 },
  ],
  humidity: [
    { timestamp: new Date('2023-10-01T10:00:00Z'), value: 55 },
    { timestamp: new Date('2023-10-02T10:00:00Z'), value: 60 },
  ],
  pressure: [
    { timestamp: new Date('2023-10-01T10:00:00Z'), value: 1012 },
    { timestamp: new Date('2023-10-02T10:00:00Z'), value: 1013 },
  ],
}

describe('HistoryTable', () => {
  test('renders without crashing', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText(/Historical data:/)).toBeInTheDocument()
  })

  test('displays the correct number of rows', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText(/2 rows/)).toBeInTheDocument()
  })

  test('displays the correct date range', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('1.10.2023 - 2.10.2023')).toBeInTheDocument()
  })

  test('displays the correct data in the table', () => {
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.getByText('22 °C')).toBeInTheDocument()
    expect(screen.getByText('18 °C')).toBeInTheDocument()
    expect(screen.getByText('55 %')).toBeInTheDocument()
    expect(screen.getByText('1012 hPa')).toBeInTheDocument()
  })

  test('displays "N/A" for missing data', () => {
    const incompleteWeatherHistory: WeatherHistory = {
      temperature_in: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 22 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 23 },
        { timestamp: new Date('2023-10-03T10:00:00Z'), value: 24 },
        { timestamp: new Date('2023-10-04T10:00:00Z'), value: 25 },
      ],
      temperature_out: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 18 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 19 },
      ],
      humidity: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 55 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 60 },
      ],
      pressure: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 1012 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 1013 },
      ],
    }
    render(<HistoryTable weatherHistory={incompleteWeatherHistory} />)
    expect(screen.queryAllByText('N/A').length).toBeGreaterThan(0)
  })

  test('renders weather history with correct timestamps', () => {
    const mockWeatherHistory: WeatherHistory = {
      temperature_in: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 22 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 23 },
        { timestamp: new Date('2023-10-03T10:00:00Z'), value: 24 },
        { timestamp: new Date('2023-10-04T10:00:00Z'), value: 25 },
      ],
      temperature_out: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 18 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 19 },
      ],
      humidity: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 55 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 60 },
      ],
      pressure: [
        { timestamp: new Date('2023-10-01T10:00:00Z'), value: 1012 },
        { timestamp: new Date('2023-10-02T10:00:00Z'), value: 1013 },
        { timestamp: new Date('2023-10-05T10:00:00Z'), value: 1014 },
        { timestamp: new Date('2023-10-06T10:00:00Z'), value: 1015 },
      ],
    }
    render(<HistoryTable weatherHistory={mockWeatherHistory} />)
    expect(screen.queryAllByText('N/A').length).toBeGreaterThan(0)
  })
})
