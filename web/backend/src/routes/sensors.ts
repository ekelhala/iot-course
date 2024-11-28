import { createClient } from 'redis';
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
    const data = await redisClient.json.get("sensors/temperature_out");
    res.json(data);
})

router.get('/temperature_in', async (req, res) => {
    const data = await redisClient.json.get("sensors/temperature_in");
    res.json(data);
})

router.get('/pressure', async (req, res) => {
    const data = await redisClient.json.get("sensors/pressure");
    res.json(data);
})

router.get('/humidity', async (req, res) => {
    const data = await redisClient.json.get("sensors/humidity");
    res.json(data);
})

router.get('/all', async (req, res) => {
    const temperature_in = await redisClient.json.get("sensors/temperature_in");
    const temperature_out = await redisClient.json.get("sensors/temperature_out");
    const pressure = await redisClient.json.get("sensors/pressure");
    const humidity = await redisClient.json.get("sensors/humidity");

    res.json({
        temperature_in,
        temperature_out,
        pressure,
        humidity
    });
})

export default router;
