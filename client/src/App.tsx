import { useState } from 'react'
import './App.css'
import { DocumentManager } from './components/DocumentManager'
import { DocumentList } from './components/DocumentList'

function App() {
  return (
    <div className="app" style={{ display: 'flex', height: '100vh' }}>
      <DocumentList />
      <div style={{ flex: 1 }}>
        <DocumentManager />
      </div>
    </div>
  )
}

export default App
