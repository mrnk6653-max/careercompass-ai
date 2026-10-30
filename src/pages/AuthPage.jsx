import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, UserRound } from 'lucide-react'
import Brand from '../components/Brand'
import { useAuth } from '../context/AuthContext'

const profileFields = [
  ['degree', 'Degree and branch', 'e.g. B.Tech, Computer Science'],
  ['year', 'Academic year', 'e.g. Second year'],
  ['interests', 'Interests', 'e.g. data, design, public service'],
  ['skills', 'Technical skills', 'e.g. Python, spreadsheets'],
  ['experience', 'Experience level', 'e.g. Beginner'],
  ['goals', 'Career goals', 'e.g. Explore data analysis'],
]
const requiredStudentFields = [
  ['currentClass', 'Current class / study year', 'e.g. Class 12, 2nd year, final year'],
  ['favoriteSubject', 'Favorite subject', 'e.g. Mathematics, Biology, History'],
  ['course', 'Course / stream', 'e.g. Science, Commerce, B.Com, B.Tech'],
]

export default function AuthPage({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const { login, register, connectionError } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '')
    try {
      if (isSignup) {
        if (password !== form.get('confirmPassword')) throw new Error('The passwords do not match.')
        const profile = Object.fromEntries([...profileFields, ...requiredStudentFields].map(([key]) => [key, String(form.get(key) || '').trim()]))
        await register({ displayName: String(form.get('displayName') || '').trim(), email, password, profile })
      } else {
        await login({ email, password })
      }
    } catch (submitError) {
      setError(submitError.message || 'Could not complete the account request.')
    } finally {
      setBusy(false)
    }
  }

  return <main className="auth-page">
    <div className="auth-topbar"><Link to="/welcome" aria-label="CareerCompass home"><Brand/></Link><Link className="auth-back-link" to="/welcome">Explore CareerCompass</Link></div>
    <section className={`auth-card ${isSignup ? 'auth-card-signup' : ''}`}>
      <div className="auth-card-heading"><span className="auth-icon"><UserRound size={21}/></span><div className="eyebrow">YOUR CAREER JOURNEY</div><h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1><p>{isSignup ? 'Save your student profile and keep your progress with you.' : 'Sign in to continue to your AI career mentor.'}</p></div>
      {(error || connectionError) && <div className="form-error" role="alert">{error || connectionError}</div>}
      <form className="auth-form" onSubmit={submit}>
        {isSignup && <label className="form-label">Full name<input name="displayName" autoComplete="name" minLength="2" maxLength="80" required placeholder="Your name"/></label>}
        <label className="form-label">Email address<input name="email" type="email" autoComplete="email" maxLength="254" required placeholder="you@example.com"/></label>
        <label className="form-label">Password<input name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} minLength="10" maxLength="72" required placeholder={isSignup ? 'At least 10 characters' : 'Your password'}/></label>
        {isSignup && <>
          <label className="form-label">Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength="10" maxLength="72" required placeholder="Enter your password again"/></label>
          <div className="auth-student-basics"><h2>About your studies</h2><p>We use this to tailor career paths and opportunities to you.</p><div className="auth-profile-grid">{requiredStudentFields.map(([key,label,placeholder])=><label className="form-label" key={key}>{label}<input name={key} required maxLength="160" placeholder={placeholder}/></label>)}</div></div>
          <details className="auth-profile-details"><summary>Personalize your mentor <span>Optional</span></summary><div className="auth-profile-grid">{profileFields.map(([key,label,placeholder])=><label className="form-label" key={key}>{label}<input name={key} maxLength="160" placeholder={placeholder}/></label>)}</div></details>
        </>}
        <button className="button button-primary auth-submit" disabled={busy}>{busy ? (isSignup ? 'Creating account…' : 'Signing in…') : (isSignup ? 'Create account' : 'Sign in')} {!busy && <ArrowRight size={16}/>}</button>
      </form>
      <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to CareerCompass?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create an account'}</Link></p>
      <div className="auth-privacy"><ShieldCheck size={15}/> Passwords are hashed before they are saved. Your account uses a secure server session.</div>
    </section>
    <p className="auth-footer">Your study details help personalize recommendations. You can update them later in the AI companion.</p>
  </main>
}
