// components/DocumentList.tsx
import { useEffect } from 'react'
import { useDocumentStore } from '../stores/documentStore'

export function DocumentList() {
  const { documents, loadAllDocuments, selectDocument } = useDocumentStore()
  
  useEffect(() => {
    loadAllDocuments()
  }, [])
  
  return (
    <div style={{ 
      width: '250px', 
      borderRight: '1px solid #ccc',
      padding: '16px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Documents</h3>
      {documents?.map(doc => (
        <div 
          key={doc.id}
          onClick={() => selectDocument(doc.id)}
          style={{ 
            padding: '12px 8px',
            cursor: 'pointer',
            borderBottom: '1px solid #eee',
            borderRadius: '4px'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {doc.title}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(doc.updated_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )
}
