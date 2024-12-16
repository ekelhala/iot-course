import Express, { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'

import { Model } from 'mongoose'
import { Humidity, Pressure, TemperatureIn, TemperatureOut } from '../../models/WeatherData'

const router = Express.Router()

// connecting to redis
const redisClient = createClient({
  url: process.env.REDIS_URL,
})
redisClient.on('connect', () => console.log('redis client connected'))
redisClient.on('error', (err) => console.log('redis client error:', err))
redisClient.connect()

class TimestampError extends Error {
  constructor() {
    super('Start date must be before end date')
    this.name = 'TimestampError'
  }
}

// Creates and returns a MongoDB query based on string representations of date
// throws an exception if start or end strings are not valid dates, or end is before start
const makeDBQuery = (start: string, end: string, type: string | null) => {
  // Create the date objects
  const startDate = new Date(start)
  const endDate = new Date(end)
  // If startDate since Epoch has more milliseconds, it's set to later date
  // so throw an error here
  if (startDate.getTime() > endDate.getTime()) throw new TimestampError()
  // Or if everything is good, create the query
  else {
    switch (type) {
      case 'min':
        // Match "timestamp"-property between startDate and endDate
        // Use ascending sorting and limit matches to one, 1st one will be picked, which will be the smallest
        return [
          { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
          { $sort: { value: 1 } },
          { $limit: 1 },
        ]
      case 'max':
        // Match "timestamp"-property between startDate and endDate
        // Use descending sorting and limit matches to one, resulting in 1st one to be picked,
        // which is also the largest in the set
        return [
          { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
          { $sort: { value: -1 } },
          { $limit: 1 },
        ]
      default:
        // Here we match the "timestamp" property between startDate and endDate
        return [
          {
            $match: {
              timestamp: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
        ]
    }
  }
}

const handleQuery = async <T>(req: Request, model: Model<T>, next: NextFunction) => {
  try {
    let query
    // query has "type" param set, we are looking for min/max value
    // so we pass it on
    if (req.params.type)
      query = makeDBQuery(req.query.start.toString(), req.query.end.toString(), req.params.type)
    // otherwise this is a regular history query
    else query = makeDBQuery(req.query.start.toString(), req.query.end.toString(), null)
    // Using aggregate to query, need to apply JSON transformation manually:
    const result = (await model.aggregate(query)).map((doc) => model.hydrate(doc).toJSON())
    // if query type is defined, we have min/max query
    // that means we should have only one result, so return only the first one
    if (req.params.type) return result[0]
    // otherwise we return everything
    return result
  } catch (error) {
    next(error)
  }
}

// Handlers, using conditional param type for everything with max and min
router.get('/temperature_in/:type?', async (req, res, next) => {
  const result = await handleQuery(req, TemperatureIn, next)
  res.json(result)
})

router.get('/temperature_out/:type?', async (req, res, next) => {
  const result = await handleQuery(req, TemperatureOut, next)
  res.json(result)
})

router.get('/humidity/:type?', async (req, res, next) => {
  const result = await handleQuery(req, Humidity, next)
  res.json(result)
})

router.get('/pressure/:type?', async (req, res, next) => {
  const result = await handleQuery(req, Pressure, next)
  res.json(result)
})

router.get('/all', async (req, res, next) => {
  try {
    res.json({
      temperature_in: await handleQuery(req, TemperatureIn, next),
      temperature_out: await handleQuery(req, TemperatureOut, next),
      humidity: await handleQuery(req, Humidity, next),
      pressure: await handleQuery(req, Pressure, next),
    })
  } catch (error) {
    console.log('error', error)
    next(error)
  }
})

// Error handler

router.use((err: Error, req, res, next) => {
  console.error(err)
  if (err.name == 'TimestampError') res.status(400).json({ error: err.message })
  else res.status(400).json({ error: 'Invalid query parameters' })
})

export default router
