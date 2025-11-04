import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Header() {
  const { token, setToken } = useAuth()
  const nav = useNavigate()

  function logout() {
    setToken(null)
    nav('/login')
  }

  return (
    <header className="sh-header">
      <div className="sh-container">
        <div className="sh-brand">SlotSwapper</div>
        <nav className="sh-nav">
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/requests">Requests</Link>
              <button className="sh-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
