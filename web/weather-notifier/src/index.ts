import { configDotenv } from "dotenv";
import {createClient} from "redis";
import {WebSocketServer} from "ws";

configDotenv();

const PORT:number = Number(process.env.PORT) || 8002
let wss:WebSocketServer;

const redisSubscriber = createClient({
    url: process.env.REDIS_URL
})
redisSubscriber.on('connect', () => {
    console.log("subscriber connected");
    redisSubscriber.subscribe('new_value', (message) => {
        wss.clients.forEach((client) => {
            if(client.readyState == WebSocket.OPEN)
                client.send(message);
        })
    })
})
redisSubscriber.connect();

wss = new WebSocketServer({
    port: PORT
});
wss.on('listening', () => {
    console.log(`notifier service listening on port ${PORT}`);
})
