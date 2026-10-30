import React from 'react'
import { Check, Circle, Clock3, RotateCcw, Route, Sparkles, Trash2 } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ProgressBar from '../components/ProgressBar'

export default function Roadmap({ tasks, setTasks }) {
  const done = tasks.filter(task => task.done).length
  const toggle = id => setTasks(previous => previous.map(task => task.id === id ? { ...task, done: !task.done } : task))
  const remove = task => {
    if (window.confirm(`Delete “${task.title}” from your roadmap?`)) setTasks(previous => previous.filter(item => item.id !== task.id))
  }
  const reset = () => {
    if (window.confirm('Reset completion status for all roadmap tasks? This keeps the tasks.')) setTasks(previous => previous.map(task => ({ ...task, done: false })))
  }

  return <div className="page-content">
    <SectionTitle eyebrow="YOUR PLAN, YOUR PACE" title="A roadmap built from small steps." description="Track your starter tasks and add selected tasks from your generated study plan. Delete tasks whenever your plan changes." action={<button className="button button-secondary button-sm" onClick={reset}><RotateCcw size={15}/> Reset progress</button>}/>
    <div className="roadmap-hero"><div className="roadmap-hero-icon"><Route size={24}/></div><div className="roadmap-hero-copy"><span className="banner-label">YOUR EXPLORATION PLAN</span><h2>Discover → Explore → Practise → Reflect</h2><p>There is no rush to finish. Adjust the steps to suit your life.</p></div><div className="roadmap-hero-progress"><strong>{done}/{tasks.length}</strong><span>tasks complete</span></div></div>
    <div className="roadmap-progress-panel"><div><h3>Your progress</h3><p>{tasks.length > 0 && done === tasks.length ? 'All roadmap tasks are complete. Add more from your study plan whenever you like.' : `${tasks.length - done} tasks left to work on.`}</p></div><div className="roadmap-progress-bar"><ProgressBar value={Math.round(done / Math.max(tasks.length, 1) * 100)} label="Overall progress"/></div></div>
    {tasks.length ? <div className="timeline">{tasks.map((task, index) => <article className={`timeline-task ${task.done ? 'task-complete' : ''}`} key={task.id}><div className="timeline-marker">{task.done ? <span className="marker-done"><Check size={15}/></span> : <span className="marker-pending">{index + 1}</span>}{index < tasks.length - 1 && <span className="timeline-connector"/>}</div><div className="timeline-task-card"><div className="timeline-task-top"><span className="timeline-category">{task.category}</span><span className="duration"><Clock3 size={14}/>{task.duration}</span></div><h3>{task.title}</h3>{task.sourcePlan && <span className="roadmap-source-label">From study plan: {task.sourcePlan}</span>}<p>{task.description || (task.done ? 'Completed. You can revisit this task or continue to the next one.' : 'Take this step when it fits your schedule. Mark it complete when you have made a genuine attempt.')}</p><div className="roadmap-task-actions"><button className={`task-toggle ${task.done ? 'done' : ''}`} onClick={() => toggle(task.id)}>{task.done ? <><Check size={15}/> Completed · Undo</> : <><Circle size={15}/> Mark as complete</>}</button><button className="roadmap-delete-button" onClick={() => remove(task)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={16}/> Delete</button></div></div></article>)}</div> : <div className="empty-state"><Route size={27}/><h3>Your roadmap is clear</h3><p>Add selected tasks from a generated study plan to build your next steps.</p></div>}
    <div className="roadmap-bottom-tip"><span><Sparkles size={18}/></span><div><strong>Make the plan yours</strong><p>Generated plan tasks are optional. Add only the steps that fit your goals and schedule.</p></div></div>
  </div>
}
