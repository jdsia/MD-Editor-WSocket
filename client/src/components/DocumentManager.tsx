// components/DocumentManager.tsx
import { useDocumentStore } from '../stores/documentStore'
import { Editor } from './editor/Editor'
import { useEffect } from 'react'

export function DocumentManager() {
  const { title, setTitle, saveDocument, saveStatus, enableAutoSave, disableAutoSave, documentId } = useDocumentStore()

  // Enable auto-save when component mounts
  useEffect(() => {
    enableAutoSave()
    
    // Cleanup: disable auto-save when unmounting
    return () => disableAutoSave()
  }, [enableAutoSave, disableAutoSave])

  // Prevent closing the tab if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (useDocumentStore.getState().saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #d1d9e0', backgroundColor: '#ffffff' }}>
        <input 
          style={{
            width: '100%',
            fontSize: '24px',
            fontWeight: '600',
            border: 'none',
            outline: 'none',
            padding: '8px 0',
            backgroundColor: 'transparent',
            color: '#24292f',
            fontFamily: 'inherit'
          }}
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Document"
        />
      </div>
      
      <div style={{ 
        padding: '12px', 
        borderBottom: '1px solid #d1d9e0', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        gap: '8px', 
        alignItems: 'center' 
      }}>
        <button 
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '500',
            border: '1px solid',
            borderRadius: '6px',
            transition: 'background-color 0.15s ease',
            cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
            backgroundColor: saveStatus === 'saving' ? '#f6f8fa' : '#0969da',
            color: saveStatus === 'saving' ? '#656d76' : '#ffffff',
            borderColor: saveStatus === 'saving' ? '#d1d9e0' : '#0969da'
          }}
          onClick={saveDocument}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save'}
        </button>
        
        <div style={{
          marginLeft: 'auto',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '12px',
          fontWeight: '500',
          backgroundColor: 
            saveStatus === 'saved' ? '#dcffe4' :
            saveStatus === 'saving' ? '#fff3cd' :
            saveStatus === 'unsaved' ? '#f8d7da' :
            '#f8d7da',
          color:
            saveStatus === 'saved' ? '#0f5132' :
            saveStatus === 'saving' ? '#664d03' :
            saveStatus === 'unsaved' ? '#721c24' :
            '#721c24'
        }}>
          {saveStatus === 'saved' ? 'Saved' : 
           saveStatus === 'saving' ? 'Saving...' :
           saveStatus === 'unsaved' ? 'Unsaved' :
           'Error'}
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#ffffff' }}>
        <Editor key={documentId || 'empty'} />
      </div>
    </div>
  )
}