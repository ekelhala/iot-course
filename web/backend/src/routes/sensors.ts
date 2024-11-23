import Express from 'express';

const router = Express.Router();

// Handlers

router.get('/temperature_out', (req, res) => {
    res.json({});
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
