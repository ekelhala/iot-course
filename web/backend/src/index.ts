import Express from 'express'

const PORT = process.env.PORT || 8000;

const app = Express();

app.get('/', (req, res) => {
    res.json({data: 'Server is up!'});
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
