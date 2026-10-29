import React, { useState } from 'react'
import { BookOpen, CalendarDays, CheckCircle2, Clock3, LoaderCircle, Sparkles, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function StudyPlan({ setTasks }) {
  const [goal, setGoal] = useState(localStorage.getItem('cc-plan-goal') || 'Learn DSA in C++')
  const [skills, setSkills] = useState(localStorage.getItem('cc-plan-skills') || '')
  const [hours, setHours] = useState(5)
  const [weeks, setWeeks] = useState(2)
  const [plan, setPlan] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cc-study-plan') || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function generate(event) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/study-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, currentSkills: skills, hoursPerWeek: Number(hours), durationWeeks: Number(weeks) })
      })
      const result = await response.json()
      if (!response.ok || !result.success || !result.data?.weeks?.length) throw new Error(result.message || 'Could not create a plan.')
      setPlan(result.data)
      localStorage.setItem('cc-study-plan', JSON.stringify(result.data))
      localStorage.setItem('cc-plan-goal', goal)
      localStorage.setItem('cc-plan-skills', skills)
    } catch (err) {
      setError(`${err.message} Make sure the backend is running and try again.`)
    } finally { setLoading(false) }
  }

  function addToRoadmap() {
    if (!plan) return
    const newTasks = plan.weeks.flatMap(week => week.tasks.map((task, index) => ({
      id: `ai-${Date.now()}-${week.week}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      title: task.title,
      category: task.category || `Week ${week.week}`,
      duration: task.duration || '30 min',
      done: false,
      description: task.description,
      planWeek: week.week,
    })))
    setTasks(previous => {
      const existingTitles = new Set(previous.map(task => task.title.toLowerCase()))
      return [...previous, ...newTasks.filter(task => !existingTitles.has(task.title.toLowerCase()))]
    })
    navigate('/roadmap')
  }

  return <div className="page-content">
    <SectionTitle eyebrow="PERSONALIZED LEARNING" title="Build a study plan that fits your life." description="Set a goal, tell us where you're starting, and get a practical roadmap you can adjust as you learn."/>
    <div className="feature-layout">
      <form className="feature-form panel" onSubmit={generate}>
        <div className="feature-form-heading"><span className="panel-icon"><Target size={19}/></span><div><h2>Your learning goal</h2><p>Specific goals help create more useful steps.</p></div></div>
        <label className="form-label">What do you want to learn?<input required maxLength={300} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="e.g. Learn DSA in C++"/></label>
        <label className="form-label">What do you already know?<textarea rows={3} maxLength={1000} value={skills} onChange={e=>setSkills(e.target.value)} placeholder="e.g. Arrays, strings, recursion basics; currently learning trees"/></label>
        <div className="form-two-col"><label className="form-label">Time available per week<select value={hours} onChange={e=>setHours(e.target.value)}>{[2,3,4,5,6,8,10,12,15,20].map(n=><option value={n} key={n}>{n} hours</option>)}</select></label><label className="form-label">Plan length<select value={weeks} onChange={e=>setWeeks(e.target.value)}>{[1,2,3,4].map(n=><option value={n} key={n}>{n} week{n>1?'s':''}</option>)}</select></label></div>
        <button className="button button-primary feature-submit" disabled={loading}>{loading?<><LoaderCircle size={16} className="loading-icon"/> Creating plan…</>:<><Sparkles size={16}/> Generate my plan</>}</button>
        {error && <p className="form-error">{error}</p>}
        <p className="muted-small">AI-generated plans can contain mistakes. Treat this as a draft, verify important information, and adjust the workload to your needs.</p>
      </form>
      <aside className="feature-side-card"><div className="feature-side-icon"><CalendarDays size={22}/></div><h3>Small steps. Real progress.</h3><p>Your plan will be organized by week, with tasks that can be added to your existing roadmap.</p><div className="feature-mini-row"><Clock3 size={16}/><span>Fits your available time</span></div><div className="feature-mini-row"><BookOpen size={16}/><span>Learning + practice activities</span></div><div className="feature-mini-row"><CheckCircle2 size={16}/><span>Track tasks in My Roadmap</span></div></aside>
    </div>
    {plan && <section className="generated-plan">
      <div className="generated-plan-header"><div><span className="eyebrow">YOUR GENERATED PLAN</span><h2>{plan.title}</h2><p>{plan.summary}</p></div><button className="button button-primary" onClick={addToRoadmap}><CheckCircle2 size={16}/> Add tasks to roadmap</button></div>
      <div className="plan-week-grid">{plan.weeks.map(week=><article className="plan-week-card" key={week.week}><div className="plan-week-heading"><span>WEEK {week.week}</span><h3>{week.focus}</h3></div><div className="plan-task-list">{week.tasks.map((task,index)=><div className="plan-task" key={`${week.week}-${index}`}><span className="plan-task-number">{index+1}</span><div><strong>{task.title}</strong><p>{task.description}</p><small><Clock3 size={13}/> {task.duration} · {task.category}</small></div></div>)}</div></article>)}</div>
      <p className="muted-small">Plan stored in this browser. Generating a new plan replaces the saved plan, but does not erase existing roadmap tasks.</p>
    </section>}
  </div>
}
