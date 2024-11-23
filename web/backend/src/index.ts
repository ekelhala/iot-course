import Express from 'express'

import sensors from './routes/sensors';

const PORT = process.env.PORT || 8000;

const app = Express();

// App-wide settings
app.use(Express.json());
app.disable('x-powered-by');

// Attach routers from their respective modules
app.use('/sensors', sensors);

app.get('/', (req, res) => {
    res.json({data: 'Server is up!'});
})

// Not found
app.use((req, res, next) => {
    res.status(404).json({error: 'Not found'});
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
