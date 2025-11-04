import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../api'
import { useAuth } from '../auth'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { setToken } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    try {
      const res = await signup({ name, email, password })
      setToken(res.token)
      nav('/dashboard')
    } catch (err) {
      setErr(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join SlotSwapper to start swapping time slots</p>
        
        <form onSubmit={submit} className="sh-form">
          <div className="sh-form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              type="text" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={e => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="sh-form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="sh-form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {err && <div className="error-message">{err}</div>}
          
          <button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        
        <div className="auth-link">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  )
}
