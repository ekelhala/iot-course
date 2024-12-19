import { configDotenv } from 'dotenv'
import mongoose from 'mongoose'
configDotenv()
import mqtt from 'mqtt'
import { createClient } from 'redis'

import { TemperatureIn, TemperatureOut, Humidity, Pressure } from '../models/WeatherData'

// list of MQTT topics to listen to
const mqttTopics: string[] = [
  'sensors/temperature_in',
  'sensors/temperature_out',
  'sensors/humidity',
  'sensors/pressure',
]

// Connecting to MQTT broker with URL and credentials supplied from environment variables
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
})

// Creating Redis client with URL from environment variables
const redisClient = createClient({ url: process.env.REDIS_URL })
// Logging a message when there is an error and when the connection is established
redisClient.on('error', (error) => console.log('redis client error: ', error))
redisClient.on('connect', () => console.log('redis client connected'))
// Connecting the client to the Redis server container
redisClient.connect()
// Acquiring another client instance by duplicating and connecting the original client
const pubClient = redisClient.duplicate()
pubClient.connect()

// Connecting to the MongoDB instance with URI from environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .catch((error) => console.log('mongodb connection error:', error))
  .then(() => console.log('connected to mongodb'))

// MQTT handlers
mqttClient.on('message', async (topic: string, message: Buffer, packet: mqtt.IPublishPacket) => {
  console.log(new Date().valueOf())
  const payload = {
    value: Number(message.toString()),
    timestamp: new Date().toISOString(),
  }
  // caching the weather data once received
  await redisClient.json.set(topic, '$', payload)
  // Broadcasting a message on new_value channel for weather-notifier
  pubClient.publish('new_value', topic)
  //TODO: make this a bit more readable/intuitive
  // Saving the value to MongoDB based on the topic from which
  // it was received
  switch (topic) {
    case mqttTopics[0]:
      new TemperatureIn(payload).save()
      break
    case mqttTopics[1]:
      new TemperatureOut(payload).save()
      break
    case mqttTopics[2]:
      new Humidity(payload).save()
      break
    case mqttTopics[3]:
      new Pressure(payload).save()
      break
  }
})

// subscribing to given topics once connected
mqttClient.on('connect', () => {
  console.log('connected to broker')
  mqttClient.subscribe(mqttTopics)
})

console.log('service started!')
