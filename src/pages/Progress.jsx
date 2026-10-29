import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, BriefcaseBusiness, Route, CheckCircle2, Sparkles } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import ProgressBar from '../components/ProgressBar'

export default function Progress({ tasks, discoveryCount, savedCareers, savedOpportunities }) {
 const done=tasks.filter(t=>t.done).length
 const metrics=[{label:'Discovery activities',value:discoveryCount,icon:Compass,to:'/discover',desc:'Experiences tried'},{label:'Careers saved',value:savedCareers.length,icon:BriefcaseBusiness,to:'/careers',desc:'Careers on your shortlist'},{label:'Roadmap tasks',value:`${done}/${tasks.length}`,icon:Route,to:'/roadmap',desc:'Small steps completed'},{label:'Opportunities saved',value:savedOpportunities.length,icon:Sparkles,to:'/opportunities',desc:'Sample listings only'}]
 return <div className="page-content"><SectionTitle eyebrow="YOUR JOURNEY SO FAR" title="Progress, not perfection." description="A simple overview of the steps you've taken in this browser. Your progress is not a score of your potential."/><div className="progress-summary"><div><span className="banner-label">YOUR ROADMAP</span><h2>{done===tasks.length?'Starter plan complete':'Keep taking small steps'}</h2><p>{done} of {tasks.length} starter tasks completed.</p><ProgressBar value={Math.round(done/Math.max(tasks.length,1)*100)}/></div><div className="summary-icon"><CheckCircle2 size={30}/></div></div><div className="progress-metrics-grid">{metrics.map(m=>{const Icon=m.icon;return <Link className="progress-metric-card" to={m.to} key={m.label}><span className="panel-icon"><Icon size={19}/></span><strong>{m.value}</strong><h3>{m.label}</h3><p>{m.desc}</p><span className="inline-link">View details <ArrowRight size={14}/></span></Link>})}</div><div className="notice-box"><span>ⓘ</span><p>This progress is stored locally in your browser. It is not a verified assessment and will not sync across devices.</p></div></div>
}
