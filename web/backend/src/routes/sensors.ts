import { createClient } from 'redis'
import Express from 'express'

import { TemperatureIn, TemperatureOut, Humidity, Pressure } from '../../models/WeatherData'

const TEMPERATURE_IN = 'sensors/temperature_in'
const TEMPERATURE_OUT = 'sensors/temperature_out'
const HUMIDITY = 'sensors/humidity'
const PRESSURE = 'sensors/pressure'

// generic function to get a value from cache or db
// also handles caching the value in case of cache miss
const getValueFromCache = async (topic: string) => {
  // First we look up the value from the cache
  let data: any = await redisClient.json.get(topic)
  if (!data) {
    // If cache returns null, we get here
    switch (topic) {
      // Get the latest value from the database by looking up with the respective data type
      case TEMPERATURE_IN:
        data = await TemperatureIn.findOne().sort({ $natural: -1 })
        break
      case TEMPERATURE_OUT:
        data = await TemperatureOut.findOne().sort({ $natural: -1 })
        break
      case HUMIDITY:
        data = await Humidity.findOne().sort({ $natural: -1 })
        break
      case PRESSURE:
        data = await Pressure.findOne().sort({ $natural: -1 })
        break
    }
    // Result of MongoDB query is in Document format, make it into regular Object
    data = data.toJSON()
    // caching the value from db
    await redisClient.json.set(topic, '$', data)
  }

  return data
}

const router = Express.Router()

// connecting to redis
const redisClient = createClient({
  url: process.env.REDIS_URL,
})
redisClient.on('connect', () => console.log('redis client connected'))
redisClient.on('error', (err) => console.log('redis client error:', err))
redisClient.connect()

// Handlers for different API endpoints
router.get('/temperature_out', async (req, res) => {
  res.json(await getValueFromCache(TEMPERATURE_OUT))
})

router.get('/temperature_in', async (req, res) => {
  console.log(new Date().toISOString())
  res.json(await getValueFromCache(TEMPERATURE_IN))
})

router.get('/pressure', async (req, res) => {
  res.json(await getValueFromCache(PRESSURE))
})

router.get('/humidity', async (req, res) => {
  res.json(await getValueFromCache(HUMIDITY))
})

router.get('/all', async (req, res) => {
  // Here we build the response by looking up the values individually
  res.json({
    temperature_in: await getValueFromCache(TEMPERATURE_IN),
    temperature_out: await getValueFromCache(TEMPERATURE_OUT),
    humidity: await getValueFromCache(HUMIDITY),
    pressure: await getValueFromCache(PRESSURE),
  })
})

export default router
