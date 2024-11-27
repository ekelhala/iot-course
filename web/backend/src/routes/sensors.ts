import { createClient } from '@redis/client';
import Express from 'express';

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
    const data = await redisClient.get("sensors/temperature_out");
    res.json(JSON.parse(data));
})

router.get('/temperature_in', async (req, res) => {
    const data = await redisClient.get("sensors/temperature_in");
    res.json(JSON.parse(data));
})

router.get('/pressure', async (req, res) => {
    const data = await redisClient.get("sensors/pressure");
    res.json(JSON.parse(data));
})

router.get('/humidity', async (req, res) => {
    const data = await redisClient.get("sensors/humidity");
    res.json(JSON.parse(data));
})

router.get('/all', async (req, res) => {
    const temperature_in = JSON.parse(await redisClient.get("sensors/temperature_in"));
    const temperature_out = JSON.parse(await redisClient.get("sensors/temperature_out"));
    const pressure = JSON.parse(await redisClient.get("sensors/pressure"));
    const humidity = JSON.parse(await redisClient.get("sensors/humidity"));

    res.json({
        temperature_in,
        temperature_out,
        pressure,
        humidity
    });
})

export default router;
