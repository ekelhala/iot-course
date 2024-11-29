import Express from 'express'
import { configDotenv } from "dotenv";
configDotenv();
import cors from 'cors';
import { createClient } from 'redis';
import { WebSocket, WebSocketServer } from 'ws';
import mongoose from 'mongoose';

import sensors from './routes/sensors';

let wss : WebSocketServer;

const PORT = process.env.PORT || 8000;
const WS_PORT = Number(process.env.WS_PORT) || 8002;
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

mongoose.connect(process.env.MONGODB_URI)
    .catch(error => console.log('error in mongodb connect(): ', error))
    .then(() => console.log('connected to mongodb'));

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

app.listen(PORT, () => console.log(`backend server listening on port ${PORT}`))

wss = new WebSocketServer({port: WS_PORT});
wss.on('listening', () => console.log(`WebSocket server listening on port ${WS_PORT}`));
