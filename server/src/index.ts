import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// load env vars
dotenv.config()

import { supabase } from './db'

const app = express()
const PORT = process.env.PORT || 3001

//middleware
app.use(cors())
app.use(express.json())

// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// testing db connection

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('count')
      .single()
    
    if (error) throw error
    
    res.json({ 
      status: 'connected', 
      count: data?.count || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
})

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})