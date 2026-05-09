const API_BASE = 'http://localhost:3001/api'

export const documentApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/documents`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  },
  
  get: async (id: string) => {
    const response = await fetch(`${API_BASE}/documents/${id}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  },
  
  create: async (doc: {title: string, content: string}) => {
    const response = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(doc)
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  },
  
  update: async (id: string, doc: {title: string, content: string}) => {
    const response = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(doc)
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  },
  
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE}/documents/${id}`, {method: 'DELETE'})
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  }
}