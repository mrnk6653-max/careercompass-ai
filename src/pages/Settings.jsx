import React, { useState } from 'react'
import { Check, ShieldCheck, UserRound, Bell, Globe, Trash2, LogOut, Moon } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../context/AuthContext'
import { clearUserStorage, getUserItem, setUserItem } from '../utils/userStorage'

export default function Settings() {
  const { user, updateProfile, logout } = useAuth()
  const [name, setName] = useState(user.name || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [reminders, setReminders] = useState(getUserItem('cc-reminders') !== 'off')
  const [language, setLanguage] = useState(getUserItem('cc-language') || 'English')
  const [darkMode, setDarkMode] = useState(getUserItem('cc-theme') === 'dark')

  const changeTheme = enabled => {
    setDarkMode(enabled)
    setUserItem('cc-theme', enabled ? 'dark' : 'light')
    window.dispatchEvent(new Event('cc-theme-change'))
  }

  const save = async () => {
    setError('')
    try {
      await updateProfile({ displayName: name })
      setUserItem('cc-reminders', reminders ? 'on' : 'off')
      setUserItem('cc-language', language)
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } catch (saveError) {
      setError(saveError.message || 'Could not save your account settings.')
    }
  }
  const clear = () => {
    if (window.confirm('Clear local CareerCompass progress, preferences, and conversations for this account? Your database account will remain.')) {
      clearUserStorage()
      window.location.reload()
    }
  }
  const signOut = async () => {
    setError('')
    try { await logout() } catch (logoutError) { setError(logoutError.message || 'Could not sign out.') }
  }

  return <div className="page-content">
    <SectionTitle eyebrow="YOUR ACCOUNT" title="Settings & preferences" description="Manage your account, student profile, and local preferences."/>
    <div className="settings-layout">
      <section className="settings-panel">
        <div className="settings-heading"><span className="panel-icon"><UserRound size={19}/></span><div><h2>Account details</h2><p>Your account information is saved in the CareerCompass database.</p></div></div>
        <label className="form-label">Email address<input value={user.email} readOnly/></label>
        <label className="form-label account-name-field">Display name<input value={name} onChange={event => setName(event.target.value)} maxLength="80" placeholder="Your name"/></label>
        <div className="settings-heading settings-heading-spaced"><span className="panel-icon panel-icon-amber"><Bell size={19}/></span><div><h2>Reminders</h2><p>Notification controls for future features.</p></div></div>
        <label className="toggle-row"><span><strong>Enable reminders</strong><small>Prototype preference only; no reminders are sent.</small></span><input type="checkbox" checked={reminders} onChange={event => setReminders(event.target.checked)}/></label>
        <div className="settings-heading settings-heading-spaced"><span className="panel-icon"><Moon size={19}/></span><div><h2>Appearance</h2><p>Choose the look that feels comfortable for you.</p></div></div>
        <label className="toggle-row"><span><strong>Dark mode</strong><small>Use a darker color theme across your workspace.</small></span><input type="checkbox" checked={darkMode} onChange={event => changeTheme(event.target.checked)} aria-label="Enable dark mode"/></label>
        <div className="settings-heading settings-heading-spaced"><span className="panel-icon panel-icon-violet"><Globe size={19}/></span><div><h2>Language</h2><p>Language preference for future UI localization.</p></div></div>
        <label className="form-label">Preferred language<select value={language} onChange={event => setLanguage(event.target.value)}><option>English</option><option>Hindi</option></select></label>
        {error && <p className="form-error account-error" role="alert">{error}</p>}
        <div className="account-settings-actions"><button className="button button-primary settings-save" onClick={save}>{saved ? <><Check size={16}/> Saved</> : 'Save preferences'}</button><button className="button button-secondary settings-save" onClick={signOut}><LogOut size={15}/> Sign out</button></div>
      </section>
      <aside className="settings-side"><div className="privacy-card"><ShieldCheck size={22}/><h3>Your choices matter</h3><p>Your password is hashed and never returned to the browser. Sign-in uses an HttpOnly session cookie. Progress and conversations are scoped to your account in this browser.</p></div><div className="danger-card"><h3>Clear local data</h3><p>Remove this account’s locally stored saved items, progress, preferences, and conversations. Account details stay in the database.</p><button className="button button-danger button-sm" onClick={clear}><Trash2 size={15}/> Clear local data</button></div></aside>
    </div>
  </div>
}
