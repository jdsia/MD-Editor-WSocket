import { useState } from 'react'
import './App.css'
import { DocumentManager } from './components/DocumentManager'
import { DocumentList } from './components/DocumentList'

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#ffffff' }}>
      <DocumentList />
      <DocumentManager />
    </div>
  )
}

export default App
