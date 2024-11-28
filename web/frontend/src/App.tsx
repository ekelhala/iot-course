import { useState } from "react"

function App() {

  const [weatherData, setWeatherData] = useState({
    temperature_in: 0,
    temperature_out: 0,
    humidity: 0,
    pressure: 0
  })

  

  return (
    <>
      <b>Latest weather data</b>
      <table>
        <tbody>
          <tr>
            <td>temperature_in</td><td>{weatherData.temperature_in}</td>
          </tr>
          <tr>
          <td>temperature_out</td><td>{weatherData.temperature_out}</td>
          </tr>
          <tr>
          <td>humidity</td><td>{weatherData.humidity}</td>
          </tr>
          <tr>
          <td>pressure</td><td>{weatherData.pressure}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default App
