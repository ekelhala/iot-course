import { createClient } from 'redis';
import Express from 'express';

import { TemperatureIn, TemperatureOut, Humidity, Pressure } from '../../models/WeatherData';

const mqttTopics:string[] = [
    "sensors/temperature_in",
    "sensors/temperature_out",
    "sensors/humidity",
    "sensors/pressure"
];

// generic function to get a value from cache or db
// also handles caching the value in case of cache miss
const getValue = async (topic:string) => {
    let data:any = await redisClient.json.get(topic);
    if(!data) {
        switch(topic) {
            case mqttTopics[0]:
                data = await TemperatureIn.findOne().sort({$natural:-1});
                break;
            case mqttTopics[1]:
                data = await TemperatureOut.findOne().sort({$natural:-1});
                break;
            case mqttTopics[2]:
                data = await Humidity.findOne().sort({$natural:-1});
                break;
            case mqttTopics[3]:
                data = await Pressure.findOne().sort({$natural:-1});
                break;
        }
        data = data.toJSON();
        // caching the value from db
        await redisClient.json.set(topic, '$', data);
    }
    
    return data;
}

const router = Express.Router();

// connecting to redis
const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.on('connect', () => console.log('redis client connected'));
redisClient.on('error', (err) => console.log('redis client error:', err));
redisClient.connect();

// Handlers
router.get('/temperature_out', async (req, res) => {
    res.json(await getValue(mqttTopics[1]));
})

router.get('/temperature_in', async (req, res) => {
    res.json(await getValue(mqttTopics[0]));
})

router.get('/pressure', async (req, res) => {
    res.json(await getValue(mqttTopics[3]));
})

router.get('/humidity', async (req, res) => {
    res.json(await getValue(mqttTopics[2]));
})

router.get('/all', async (req, res) => {

    res.json({
        temperature_in: await getValue(mqttTopics[0]),
        temperature_out: await getValue(mqttTopics[1]),
        humidity: await getValue(mqttTopics[2]),
        pressure: await getValue(mqttTopics[3])
    });
})

export default router;
