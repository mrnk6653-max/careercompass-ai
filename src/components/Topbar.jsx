import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Menu, Search, UserRound, Pencil, LogOut, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getUserItem, setUserItem } from '../utils/userStorage'

export default function Topbar({ onMenu, user }) {
  const initials = user?.name?.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'CC'
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const syncTheme = () => setDarkMode(getUserItem('cc-theme') === 'dark')
    syncTheme()
    window.addEventListener('cc-theme-change', syncTheme)
    const onPointerDown = event => { if (!menuRef.current?.contains(event.target)) setOpen(false) }
    const onKeyDown = event => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('cc-theme-change', syncTheme)
    }
  }, [])

  const signOut = async () => {
    setError('')
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (logoutError) {
      setError(logoutError.message || 'Could not sign out.')
    }
  }

  return <header className="topbar"><button className="icon-button menu-toggle" onClick={onMenu} aria-label="Open navigation"><Menu size={21}/></button><button className="icon-button theme-toggle" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => { setUserItem('cc-theme', darkMode ? 'light' : 'dark'); window.dispatchEvent(new Event('cc-theme-change')) }}>{darkMode ? <Sun size={19}/> : <Moon size={19}/>}</button><div className="topbar-search"><Search size={17}/><input placeholder="Search careers, skills, opportunities..." aria-label="Search"/></div><div className="topbar-actions"><button className="icon-button notification-button" aria-label="Notifications" title="Notifications"><Bell size={19}/><i /></button><div className="account-menu-wrap" ref={menuRef}><button className="topbar-avatar account-menu-trigger" title={user?.name || 'Account menu'} aria-label="Open account menu" aria-haspopup="menu" aria-expanded={open} onClick={() => { setOpen(value => !value); setError('') }}>{initials}</button>{open && <div className="account-menu" role="menu"><div className="account-menu-heading"><span className="avatar">{initials}</span><div><strong>{user?.name || 'Student account'}</strong><span>{user?.email || ''}</span></div></div>{error && <p className="account-menu-error" role="alert">{error}</p>}<Link role="menuitem" to="/profile" onClick={() => setOpen(false)}><UserRound size={16}/> Profile</Link><Link role="menuitem" to="/profile/edit" onClick={() => setOpen(false)}><Pencil size={16}/> Edit profile</Link><button role="menuitem" className="account-menu-logout" onClick={signOut}><LogOut size={16}/> Log out</button></div>}</div></div></header>
}
