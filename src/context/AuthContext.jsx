import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`
const AuthContext = createContext(null)

async function authRequest(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/auth${path}`, {
      ...options,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('Could not reach CareerCompass. Make sure the backend is running.')
  }
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'The account request failed.')
  return result
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState('')

  useEffect(() => {
    let active = true
    authRequest('/me').then(result => {
      if (active) setUser(result.user)
    }).catch(error => {
      if (active && error.message.includes('Could not reach')) setConnectionError(error.message)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  const login = async credentials => {
    const result = await authRequest('/login', { method: 'POST', body: JSON.stringify(credentials) })
    setUser(result.user)
    setConnectionError('')
    return result.user
  }
  const register = async details => {
    const result = await authRequest('/register', { method: 'POST', body: JSON.stringify(details) })
    setUser(result.user)
    setConnectionError('')
    return result.user
  }
  const updateProfile = async details => {
    const result = await authRequest('/profile', { method: 'PATCH', body: JSON.stringify(details) })
    setUser(result.user)
    return result.user
  }
  const logout = async () => {
    await authRequest('/logout', { method: 'POST', body: '{}' })
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, connectionError, login, register, updateProfile, logout }), [user, loading, connectionError])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
