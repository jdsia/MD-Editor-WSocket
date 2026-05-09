import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// load env vars
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

//middleware
app.use(cors())
app.use(express.json())

// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})