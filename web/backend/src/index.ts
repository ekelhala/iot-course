import Express from 'express'
import { configDotenv } from "dotenv";
configDotenv();
import cors from 'cors';
import { createClient } from 'redis';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';

import sensors from './routes/sensors';

let wss : WebSocketServer;

const PORT = process.env.PORT || 8000;
const app = Express();

const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.on('connect', () => {
    console.log("subscriber connected");
    redisClient.subscribe('new_value', (message:string) => {
        wss.clients.forEach((client) => {
            if(client.readyState == WebSocket.OPEN) {
                client.send(message);
            }
        })
    })
});
redisClient.connect();

// App-wide settings
app.use(Express.json());
app.disable('x-powered-by');
app.use(cors())

// Attach routers from their respective modules
app.use('/sensors', sensors);

app.get('/', (req, res) => {
    res.json({data: 'Server is up!'});
})

// Not found
app.use((req, res, next) => {
    res.status(404).json({error: 'Not found'});
})

const httpServer = http.createServer(app);
wss = new WebSocketServer({server: httpServer});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
