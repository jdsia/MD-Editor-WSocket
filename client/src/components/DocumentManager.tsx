// components/DocumentManager.tsx
import { useDocumentStore } from '../stores/documentStore'
import { Editor } from './editor/Editor'

export function DocumentManager() {
  const { title, setTitle, saveDocument, loadDocument, isSaving } = useDocumentStore()
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document title"
        style={{ 
          width: '100%', 
          padding: '12px', 
          marginBottom: '20px',
          fontSize: '18px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      />
      
      <div style={{ marginBottom: '10px', display: 'flex', gap: '12px' }}>
        <button 
          onClick={saveDocument}
          disabled={isSaving}
          style={{ 
            padding: '10px 20px',
            backgroundColor: isSaving ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {isSaving ? 'Saving...' : 'Save Document'}
        </button>
        
        <button 
          onClick={() => loadDocument('doc-id')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Load Document
        </button>
      </div>

      <Editor />
      
    </div>
  )
}