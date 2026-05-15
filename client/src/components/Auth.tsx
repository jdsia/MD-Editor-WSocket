import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

export function Auth() {
  const { signInWithEmail, signUpWithEmail } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    const { error } = isLogin 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password)
      
    if (error) {
      setErrorMsg(error.message)
    } else if (!isLogin) {
      setErrorMsg('Check your email for the confirmation link!')
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', marginBottom: '16px',
    borderRadius: '6px', border: '1px solid #d1d9e0', 
    backgroundColor: '#ffffff', color: '#24292f', fontSize: '14px', boxSizing: 'border-box' as const
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#f6f8fa' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '6px', border: '1px solid #d1d9e0', width: '340px', boxShadow: '0 3px 6px rgba(140,149,159,0.15)' }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '300', textAlign: 'center', color: '#24292f' }}>
          {isLogin ? 'Sign in' : 'Create an account'}
        </h2>
        
        {errorMsg && (
          <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '6px', backgroundColor: '#ffebe9', border: '1px solid #ff8182', color: '#cf222e', fontSize: '14px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#24292f' }}>Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#24292f' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          
          <button type="submit" style={{ width: '100%', padding: '8px 16px', backgroundColor: '#2da44e', color: '#ffffff', border: '1px solid rgba(27,31,36,0.15)', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: '0.2s' }}>
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px 0 0 0', borderTop: '1px solid #d1d9e0', textAlign: 'center', fontSize: '14px', color: '#24292f' }}>
          {isLogin ? "New to the app? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#0969da', cursor: 'pointer' }}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  )
}
