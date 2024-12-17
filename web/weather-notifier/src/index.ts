import { configDotenv } from 'dotenv'
import { createClient } from 'redis'
import { WebSocketServer } from 'ws'

// Get environment variables in
configDotenv()

// This is the port we listen on, defaults to 8002 if not set through environment variables
const PORT: number = Number(process.env.PORT) || 8002
// Our main WebSocket server instance
let wss: WebSocketServer

// A Redis subscriber is created with URL from environment variables
const redisSubscriber = createClient({
  url: process.env.REDIS_URL,
})
// When a connection with Redis is achieved, we log a message and
// start listening for messages on channel new_value
redisSubscriber.on('connect', () => {
  console.log('subscriber connected')
  redisSubscriber.subscribe('new_value', (message) => {
    console.log(new Date().toISOString())
    // When a message is received, we loop through each connected WebSocket client
    wss.clients.forEach((client) => {
      // Checking if the connection is open, if it is, we send the API endpoint
      // from which latest data can be requested
      if (client.readyState == WebSocket.OPEN) client.send(message)
    })
  })
})
// We connect our Redis client to the server
redisSubscriber.connect()

// Create and start the WebSocket server
wss = new WebSocketServer({
  port: PORT,
})
// When the server has started, log a message
wss.on('listening', () => {
  console.log(`notifier service listening on port ${PORT}`)
})
