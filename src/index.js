import express from 'express'
import { matchRouter } from './routes/matches.js'

const app = express()
const PORT = 8000

// Middleware to parse JSON bodies
app.use(express.json())

// Root route
app.get('/', (req, res) => {
    res.send('Sportz API is up!')
})

app.use('/matches', matchRouter)

// Start server
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`
    console.log(`Server started at ${url}`)
})
