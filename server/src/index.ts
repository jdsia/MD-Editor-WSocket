import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { joinRoom, leaveRoom, broadcastToRoom, Client } from './websocket/rooms'
import { WsMessage } from '../../shared/types/ws-messages'


// load env vars
dotenv.config()

// uses a supabase client created from db.ts
import { supabase } from './db'

const app = express()
//middleware
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3001

// create HTTP server manually using express app
const httpServer = createServer(app)
// attach websocketserver to that specific http server
const wss = new WebSocketServer({ server: httpServer })


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
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('updated_at', { ascending: false })

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


// websocket connection
wss.on('connection', (socket: WebSocket, request) => {
  console.log('Client connected')

  // We initialize the client with just the socket. 
  // We'll fill in the rest when they send a 'join-room' message.
  const currentClient: Partial<Client> = {
    socket: socket
  }

  socket.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString()) as WsMessage;

      switch (message.type) {
        case 'join-room':
          // 1. Populate our client object with the info they sent
          currentClient.userId = message.userId;
          currentClient.documentId = message.documentId;
          currentClient.color = message.color;

          // 2. Add them to the room
          joinRoom(message.documentId, currentClient as Client);

          // 3. Optional: Broadcast to everyone else that they joined
          broadcastToRoom(message.documentId, currentClient as Client, {
            type: 'user-joined',
            userId: message.userId,
            color: message.color
          });
          break;

        case 'document-update':
          // If they send a document update, just forward it exactly as-is to everyone else
          if (currentClient.documentId) {
            broadcastToRoom(currentClient.documentId, currentClient as Client, message);
          }
          break;

        case 'cursor-position':
          // Same with cursor positions
          if (currentClient.documentId) {
            broadcastToRoom(currentClient.documentId, currentClient as Client, message);
          }
          break;

        case 'leave-room':
          if (currentClient.documentId) {
            // Remove them from the room
            leaveRoom(currentClient.documentId, currentClient as Client);

            // Let everyone else know they left
            broadcastToRoom(currentClient.documentId, currentClient as Client, {
              type: 'user-left',
              userId: currentClient.userId
            });
          }
          break;
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message", error);
    }
  })

  socket.on('close', () => {
    console.log('Client disconnected');

    // If they unexpectedly disconnect, we must clean them up from the room!
    if (currentClient.documentId && currentClient.userId) {
      leaveRoom(currentClient.documentId, currentClient as Client);
      broadcastToRoom(currentClient.documentId, currentClient as Client, {
        type: 'user-left',
        userId: currentClient.userId
      });
    }
  });

  socket.on('error', (err) => console.error('Socket error:', err));
})



// start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})