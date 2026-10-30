import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Compass, Map, BriefcaseBusiness, Target, Route, Bookmark, ChartNoAxesCombined, MessageCircle, Settings, CircleHelp, Sparkles, X, Brain, CalendarDays } from 'lucide-react'
import Brand from './Brand'

const groups = [
  { label: 'WORKSPACE', items: [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
  ]},
  { label: 'DISCOVER', items: [
    { to: '/discover', label: 'Interest discovery', icon: Compass },
    { to: '/interest-map', label: 'My interest map', icon: Map },
    { to: '/careers', label: 'Career explorer', icon: BriefcaseBusiness },
  ]},
  { label: 'TAKE ACTION', items: [
    { to: '/next-steps', label: "What's next?", icon: Target },
    { to: '/opportunities', label: 'Opportunity radar', icon: Sparkles },
    { to: '/roadmap', label: 'My roadmap', icon: Route },
    { to: '/study-plan', label: 'AI study plan', icon: CalendarDays },
    { to: '/quiz', label: 'Practice quiz', icon: Brain },
  ]},
  { label: 'MY SPACE', items: [
    { to: '/saved', label: 'Saved items', icon: Bookmark },
    { to: '/progress', label: 'My progress', icon: ChartNoAxesCombined },
    { to: '/companion', label: 'AI companion', icon: MessageCircle },
  ]},
]

export default function Sidebar({ open, onClose, onExpand, user }) {
  const initials = user?.name?.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'CC'
  return <>
    {open && <button className="mobile-overlay" onClick={onClose} aria-label="Close menu" />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} onMouseEnter={() => { if (!window.matchMedia('(max-width: 680px)').matches) onExpand?.() }} onMouseLeave={() => { if (!window.matchMedia('(max-width: 680px)').matches) onClose() }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onClose() }}>
      <div className="sidebar-top"><Brand /><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18}/></button></div>
      <div className="profile-mini"><div className="avatar">{initials}</div><div><strong>{user?.name || 'Student workspace'}</strong><span>{user?.email || 'Explore your next step'}</span></div></div>
      <nav className="side-nav">
    {groups.map(group => <div className="nav-group" key={group.label}><p className="nav-label">{group.label}</p>{group.items.map(item => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} onMouseEnter={item.to === '/dashboard' ? onExpand : undefined} onFocus={item.to === '/dashboard' ? onExpand : undefined} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={item.label}><Icon size={18}/><span>{item.label}</span></NavLink> })}</div>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={18}/></div><strong>Need a little direction?</strong><p>Explore one small step at a time. You don't need every answer today.</p><NavLink to="/companion" onClick={onClose}>Ask your companion <span>→</span></NavLink></div><div className="sidebar-foot"><span className="status-dot"></span> Prototype workspace <span className="version">v0.2</span></div></div>
    </aside>
  </>
}
