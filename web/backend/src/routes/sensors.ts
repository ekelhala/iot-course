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

router.get('/temperature_in', (req, res) => {
    res.json({});
})

router.get('/pressure', (req, res) => {
    res.json({});
})

router.get('/humidity', (req, res) => {
    res.json({});
})

router.get('/all', (req, res) => {
    res.json({});
})

export default router;
