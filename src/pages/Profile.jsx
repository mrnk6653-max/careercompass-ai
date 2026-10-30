import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Pencil, UserRound } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../context/AuthContext'

const fields = [
  ['currentClass', 'Current class / study year', true],
  ['favoriteSubject', 'Favorite subject', true],
  ['course', 'Course / stream', true],
  ['degree', 'Degree and branch', false],
  ['year', 'Academic year', false],
  ['interests', 'Interests', false],
  ['skills', 'Technical skills', false],
  ['experience', 'Experience level', false],
  ['goals', 'Career goals', false],
]

export default function Profile({ editing = false }) {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const save = async event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const profile = Object.fromEntries(fields.map(([key]) => [key, String(form.get(key) || '').trim()]))
    setError('')
    setBusy(true)
    try {
      await updateProfile({ displayName: name.trim(), profile })
      navigate('/profile', { replace: true })
    } catch (saveError) {
      setError(saveError.message || 'Could not save your profile.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="page-content"><SectionTitle eyebrow="YOUR ACCOUNT" title={editing ? 'Edit your profile' : 'Your profile'} description={editing ? 'Update the study details used to personalize career and opportunity suggestions.' : 'Your account and study details used throughout CareerCompass.'} action={editing ? <Link to="/profile" className="button button-secondary button-sm"><ArrowLeft size={15}/> Back to profile</Link> : <Link to="/profile/edit" className="button button-primary button-sm"><Pencil size={15}/> Edit profile</Link>}/>
    {editing ? <form className="profile-edit-panel" onSubmit={save}><div className="settings-heading"><span className="panel-icon"><UserRound size={19}/></span><div><h2>Account details</h2><p>Your profile is saved to your account.</p></div></div><label className="form-label">Display name<input name="displayName" value={name} onChange={event => setName(event.target.value)} minLength="2" maxLength="80" required/></label><label className="form-label">Email address<input value={user.email} readOnly/></label><div className="profile-study-heading"><h2>Study profile</h2><p>Required details help match you with relevant career paths and opportunities.</p></div><div className="profile-edit-grid">{fields.map(([key, label, required]) => <label className="form-label" key={key}>{label}<input name={key} defaultValue={user.profile?.[key] || ''} maxLength="160" required={required} placeholder={label}/></label>)}</div>{error && <p className="form-error account-error" role="alert">{error}</p>}<div className="account-settings-actions"><button className="button button-primary settings-save" disabled={busy}>{busy ? 'Saving…' : <><Check size={16}/> Save profile</>}</button><Link to="/profile" className="button button-secondary settings-save">Cancel</Link></div></form> : <div className="profile-view-layout"><section className="profile-view-panel"><div className="profile-view-identity"><span className="profile-view-avatar">{user.name?.trim()?.[0]?.toUpperCase() || 'S'}</span><div><h2>{user.name}</h2><p>{user.email}</p></div></div><div className="profile-view-grid">{fields.map(([key, label]) => <div className="profile-detail" key={key}><span>{label}</span><strong>{user.profile?.[key]?.trim() || 'Not added yet'}</strong></div>)}</div></section><aside className="profile-help-card"><h3>Personalized recommendations</h3><p>Your class, favorite subject, and course help CareerCompass bring relevant career paths and opportunities forward.</p><Link to="/settings">Settings & preferences</Link></aside></div>}
  </div>
}
