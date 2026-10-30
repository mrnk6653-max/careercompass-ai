import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Lightbulb, TrendingUp, CircleHelp } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { interestAreas } from '../data/demoData'
import { getUserItem } from '../utils/userStorage'

const barColors = { teal: '#28aa9a', violet: '#8c7bd5', amber: '#e0a23c', blue: '#5b8bd8', rose: '#dd7692', green: '#4aa878' }
const legacyAnswerSignals = new Map([
  ['Finding a pattern that makes the problem click', 'logic'], ['Designing a clear way to explain the problem', 'creative'], ['Testing a few ideas to see what works', 'science'], ['Talking it through with someone', 'people'],
  ['Investigating the information behind it', 'data'], ['Building or improving how it works', 'building'], ['Understanding what people need', 'people'], ['Understanding how it affects a community or environment', 'society'], ['Planning the best approach', 'business'],
  ['A more complex puzzle', 'logic'], ['A chance to make the result more useful', 'building'], ['Learning something surprising', 'science'], ['Sharing the result with others', 'people'],
])

function readResults() {
  try {
    const saved = JSON.parse(getUserItem('cc-discovery-history') || '[]')
    if (Array.isArray(saved) && saved.length) return saved
    const last = JSON.parse(getUserItem('cc-last-discovery') || 'null')
    if (!last || !Array.isArray(last.answers)) return []
    if (Array.isArray(last.signals)) return [last]
    const signals = last.answers.map(answer => legacyAnswerSignals.get(answer)).filter(Boolean)
    return [{ ...last, signals }]
  } catch { return [] }
}

export default function InterestMap({ discoveryCount }) {
  const results = useMemo(readResults, [discoveryCount])
  const histogram = interestAreas.map(area => ({
    ...area,
    value: results.reduce((total, result) => total + (Number.isFinite(result.score)
      ? (result.activityId === area.id ? result.score : 0)
      : (Array.isArray(result.signals) ? result.signals.filter(signal => signal === area.id).length : 0)), 0),
  }))
  const max = 9
  const totalSignals = histogram.reduce((total, area) => total + area.value, 0)

  return <div className="page-content"><SectionTitle eyebrow="YOUR EXPLORATION PROFILE" title="My interest map" description="A histogram of your responses to questions tailored to each activity. Complete other activities to explore more areas." action={<Link to="/discover" className="button button-primary button-sm">Explore more <ArrowRight size={15}/></Link>}/><div className="interest-map-hero"><div className="map-hero-icon"><Compass size={25}/></div><div><span className="banner-label">YOUR CURRENT SNAPSHOT</span><h2>Curiosity has many directions.</h2><p>Use these reflections to decide what to explore next. They do not measure talent or predict success.</p></div><div className="map-count"><strong>{discoveryCount}</strong><span>activity<br/>attempts</span></div></div><div className="interest-map-layout"><section className="panel interest-signals-panel"><div className="panel-heading"><div><h3>Activity interest signals</h3><p>Choice points from activity-specific questions · {totalSignals} points</p></div><span className="pill-neutral">Your reflections</span></div><div className="histogram-scroll"><div className="interest-histogram" role="img" aria-label={`Histogram of ${totalSignals} activity interest points from your answers`}>
      {histogram.map(area => <div className="histogram-column" key={area.id} title={`${area.name}: ${area.value} of 9 points`}><strong className="histogram-value">{area.value}/9</strong><div className="histogram-track"><div className="histogram-bar" style={{ height: `${(area.value / max) * 100}%`, backgroundColor: barColors[area.color] || barColors.teal }}/></div><span className="histogram-label">{area.name}</span></div>)}
      </div></div>{totalSignals === 0 && <p className="histogram-empty">Complete an activity to see your first interest signal. Each activity can be completed once.</p>}<p className="histogram-footnote">Points summarize the choices you made in each activity. They are a reflection aid, not a psychological test or ability score.</p></section><div className="map-side"><section className="panel small-panel"><span className="panel-icon"><Lightbulb size={19}/></span><h3>What these signals mean</h3><p>They reflect how your answers align with that activity—not what you are good at or which career you should choose.</p></section><section className="panel small-panel"><span className="panel-icon panel-icon-violet"><TrendingUp size={19}/></span><h3>Build a fuller picture</h3><p>Complete other activity topics to explore different interests, behaviors, and ways of thinking.</p><Link to="/discover" className="inline-link">Choose another activity <ArrowRight size={14}/></Link></section><section className="soft-note"><CircleHelp size={18}/><p>Nothing here rules out a career. Skills can be learned and interests can grow.</p></section></div></div></div>
}
