import { useEffect } from 'react'
import './App.css'
import { DocumentManager } from './components/DocumentManager'
import { DocumentList } from './components/DocumentList'
import { Auth } from './components/Auth'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/authStore'

function App() {
  const { user, setSession, signOut } = useAuthStore()

  useEffect(() => {
    // 1. Get the session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  // If there is no user logged in, show the login screen!
  if (!user) {
    return <Auth />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#ffffff' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <div>
          <span style={{ marginRight: 10 }}>Hello, {user.email}</span>
          <button
            onClick={signOut}
            style={{ padding: '4px 8px', backgroundColor: '#f6f8fa', border: '1px solid #d1d9e0', borderRadius: '6px', cursor: 'pointer', color: 'black' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <DocumentList />
      <DocumentManager />
    </div>
  )
}

export default App
