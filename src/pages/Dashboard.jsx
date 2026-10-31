import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, CalendarDays, CheckCircle2, Compass, Flame, Lightbulb, Sparkles, Target, TrendingUp } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ProgressBar from '../components/ProgressBar'
import { getUserItem } from '../utils/userStorage'
import OpportunityCard from '../components/OpportunityCard'
import { getPersonalizedOpportunities } from '../data/opportunityData'
import { useAuth } from '../context/AuthContext'

export default function Dashboard({ tasks, savedOpportunities, toggleSavedOpportunity, discoveryCount, profile = {} }) {
  const { user } = useAuth()
  const completed = tasks.filter(t => t.done).length
  const opportunities = useMemo(() => getPersonalizedOpportunities(profile), [profile])
  const displayName = user?.name?.trim() || 'Student'
  const initials = displayName.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date()).toUpperCase()
  return <div className="page-content">
    <div className="welcome-row"><div><div className="eyebrow">{today} · YOUR WORKSPACE</div><h1>Good to see you, {displayName.split(/\s+/)[0]} <span>✦</span></h1><p>Every small step gives you more information about what could be next.</p></div><div className="welcome-badge"><span className="avatar large">{initials || 'S'}</span><div><strong>{displayName}</strong><span>Student profile</span></div></div></div>
    <section className="next-step-banner"><div className="banner-symbol"><Sparkles size={24}/></div><div className="banner-copy"><span className="banner-label">YOUR NEXT BEST STEP</span><h2>Try one interest discovery challenge</h2><p>Take a few minutes to explore what kind of problem-solving feels engaging to you.</p><div className="banner-meta"><span><CalendarDays size={15}/> About 5 minutes</span><span><Target size={15}/> No preparation needed</span></div></div><Link to="/discover" className="button button-primary">Start challenge <ArrowRight size={16}/></Link><div className="banner-decoration"></div></section>
    <div className="stats-grid"><div className="stat-card"><div className="stat-icon stat-teal"><Compass size={19}/></div><span className="stat-label">Discovery activities</span><strong>{discoveryCount} <small>explored</small></strong><span className="stat-note">Keep learning about yourself</span></div><div className="stat-card"><div className="stat-icon stat-violet"><BriefcaseBusiness size={19}/></div><span className="stat-label">Careers saved</span><strong>{JSON.parse(getUserItem('cc-saved-careers') || '[]').length} <small>saved</small></strong><span className="stat-note">Build your shortlist</span></div><div className="stat-card"><div className="stat-icon stat-amber"><CheckCircle2 size={19}/></div><span className="stat-label">Roadmap progress</span><strong>{completed}<small> / {tasks.length} tasks</small></strong><ProgressBar value={Math.round((completed / Math.max(tasks.length,1))*100)} /></div><div className="stat-card"><div className="stat-icon stat-blue"><Flame size={19}/></div><span className="stat-label">Your current focus</span><strong className="focus-value">Explore</strong><span className="stat-note">One step at a time</span></div></div>
    <div className="dashboard-columns"><div className="dashboard-main-column"><section className="content-section"><SectionTitle eyebrow="START WITH CURIOSITY" title="Explore your interests" description="Short activities help you notice what you enjoy." action={<Link className="text-button" to="/discover">View all <ArrowRight size={15}/></Link>}/><div className="interest-quick-grid"><Link to="/discover" className="quick-interest-card"><span className="quick-interest-icon icon-teal"><Lightbulb size={20}/></span><strong>Logic & problem solving</strong><span>Patterns, puzzles, decisions</span><small>5 min <ArrowUpRight size={13}/></small></Link><Link to="/discover" className="quick-interest-card"><span className="quick-interest-icon icon-violet"><BookOpen size={20}/></span><strong>Data & research</strong><span>Explore questions and evidence</span><small>5 min <ArrowUpRight size={13}/></small></Link></div></section>
    <section className="content-section"><SectionTitle eyebrow="KEEP MOVING" title="Your roadmap" description="Small, achievable actions add up." action={<Link className="text-button" to="/roadmap">Open roadmap <ArrowRight size={15}/></Link>}/><div className="roadmap-preview">{tasks.slice(0,3).map((task, index) => <div className="roadmap-preview-item" key={task.id}><span className={`roadmap-check ${task.done ? 'done' : ''}`}>{task.done ? <CheckCircle2 size={17}/> : index + 1}</span><div><strong className={task.done ? 'task-done-text' : ''}>{task.title}</strong><span>{task.category} · {task.duration}</span></div><span className={`task-status ${task.done ? 'completed' : ''}`}>{task.done ? 'Completed' : 'To do'}</span></div>)}</div></section></div>
    <div className="dashboard-side-column"><section className="content-section"><SectionTitle eyebrow="WORTH EXPLORING" title="Opportunity radar" action={<Link className="text-button" to="/opportunities">See all <ArrowRight size={15}/></Link>}/><div className="mini-opportunity-list">{opportunities.slice(0,2).map(item => <OpportunityCard key={item.id} item={item} compact saved={savedOpportunities.includes(item.id)} onSave={toggleSavedOpportunity}/>)}</div><p className="data-caveat">Official portals open in a new tab. Confirm current listings and eligibility there.</p></section><section className="insight-card"><div className="insight-top"><span className="insight-icon"><TrendingUp size={19}/></span><span className="insight-label">A USEFUL REMINDER</span></div><h3>Interests are clues, not limits.</h3><p>You can enjoy several different kinds of work. Explore broadly before narrowing your options.</p><Link to="/interest-map">View your interest map <ArrowRight size={15}/></Link></section></div></div>
  </div>
}
