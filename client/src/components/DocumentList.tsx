// components/DocumentList.tsx
import { useEffect } from 'react'
import { useDocumentStore } from '../stores/documentStore'

export function DocumentList() {
  const { documents, loadAllDocuments, selectDocument, documentId } = useDocumentStore()
  
  useEffect(() => {
    console.log('DocumentList mounted, loading documents...')
    loadAllDocuments()
  }, [])
  
  useEffect(() => {
    console.log('Documents updated:', documents)
  }, [documents])
  
  return (
    <div style={{ 
      width: '320px', 
      borderRight: '1px solid #d1d9e0',
      backgroundColor: '#f6f8fa',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <div style={{ 
        padding: '16px',
        borderBottom: '1px solid #d1d9e0',
        backgroundColor: '#ffffff'
      }}>
        <h3 style={{ 
          margin: '0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#24292f',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Documents
        </h3>
      </div>
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {documents?.length === 0 ? (
          <div style={{ 
            padding: '16px',
            textAlign: 'center',
            color: '#656d76',
            fontSize: '14px'
          }}>
            No documents yet. Create your first document!
          </div>
        ) : (
          documents?.map(doc => (
            <div 
              key={doc.id}
              onClick={() => selectDocument(doc.id)}
              style={{
                padding: '12px 16px',
                marginBottom: '4px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                border: '1px solid transparent',
                backgroundColor: documentId === doc.id ? '#e3f2fd' : 'transparent',
                borderColor: documentId === doc.id ? '#0969da' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (documentId !== doc.id) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                  e.currentTarget.style.borderColor = '#d1d9e0'
                }
              }}
              onMouseLeave={(e) => {
                if (documentId !== doc.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
            >
              <div style={{
                fontWeight: '500',
                fontSize: '14px',
                color: '#24292f',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {doc.title || 'Untitled Document'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#656d76'
              }}>
                {new Date(doc.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
