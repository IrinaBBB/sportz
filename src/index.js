import express from 'express'
import { matchRouter } from './routes/matches.js'
import http from 'http'
import { attachWebSocketServer } from './ws/server.js'
import { securityMiddleware } from './arcjet.js'

const PORT = Number(process.env.PORT || 5000)
const HOST = process.env.HOST || '0.0.0.0'

const app = express()
const server = http.createServer(app)

// Middleware to parse JSON bodies
app.use(express.json())

// Root route
app.get('/', (req, res) => {
    res.send('Sportz API is up!')
})

app.use(securityMiddleware())

app.use('/matches', matchRouter)

const { broadcastMatchCreated } = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated

// Start server
server.listen(PORT, HOST, () => {
    const baseUrl =
        HOST === '0.0.0.0'
            ? `http://localhost:${PORT}`
            : `http://${HOST}:${PORT}`
    console.log(`Server running on ${baseUrl}`)
    console.log(
        `WebSocket server running on ${baseUrl.replace('http', 'ws')}/ws`
    )
})
