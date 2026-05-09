import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// load env vars
dotenv.config()

// uses a supabase client created from db.ts
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

// GET all docs
app.get('/api/documents', async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false})

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

// GET single document by ID
app.get('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

//create
app.post('/api/documents', async (req, res) => {
  try {
    const { title, content } = req.body

    const { data, error } = await supabase
      .from('documents')
      .insert([{ title, content }])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

// update document
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body

    const { data, error } = await supabase
      .from('documents')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
      // eq, selects rows where specific col (id) is only equal to a specific value
      // .single() - returns data as a single object instead of an array of objects

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})

// delete doc
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
  }
})




// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})