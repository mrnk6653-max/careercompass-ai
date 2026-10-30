import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, Brain, CheckCircle2, Clock3, Compass, FlaskConical, ChartNoAxesCombined, Palette, Users, Wrench, ChartColumn, Leaf, Sparkles, CalendarDays, Search, Lightbulb, Eye, BookOpen, MessageCircle, Target, Handshake, Ear, Heart, Zap, Map, Sprout, Recycle } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { interestAreas } from '../data/demoData'
import { getUserItem, setUserItem } from '../utils/userStorage'

const iconMap = { Brain, Palette, FlaskConical, ChartNoAxesCombined, Users, Wrench, ChartColumn, Leaf }
const HISTORY_KEY = 'cc-discovery-history'
const option = (label, icon, score, theme) => ({ label, icon, score, theme })
const question = (prompt, options) => ({ question: prompt, options })
const questionSets = {
  logic: [
    question('A tricky puzzle has no obvious answer. What do you do first?', [option('Break it into smaller steps', Brain, 3, 'step-by-step thinking'), option('Look for a pattern or rule', ChartColumn, 3, 'pattern spotting'), option('Try a small example', FlaskConical, 2, 'testing ideas'), option('Choose a different task', Compass, 0, 'other interests')]),
    question('Your answer does not match a friend’s. What interests you most?', [option('Compare each reasoning step', Search, 3, 'checking reasoning'), option('Find another way to solve it', Lightbulb, 3, 'trying alternatives'), option('Test both answers with examples', FlaskConical, 2, 'checking evidence'), option('Leave it and move on', ArrowRight, 0, 'other interests')]),
    question('Which activity would you choose for fun?', [option('Solve a logic puzzle', Brain, 3, 'puzzles'), option('Find the rule in a number pattern', ChartColumn, 3, 'patterns'), option('Debug a simple program', Wrench, 2, 'troubleshooting'), option('Make something without a set answer', Palette, 1, 'open-ended work')]),
  ],
  creative: [
    question('You are asked to make a poster. Where would you begin?', [option('Sketch a few different layouts', Palette, 3, 'visual ideas'), option('Choose colours and images', Eye, 3, 'visual details'), option('Ask who will look at it', Users, 2, 'audience awareness'), option('Use a ready-made design', BookOpen, 1, 'clear guidance')]),
    question('A design is hard to understand. What would you enjoy changing?', [option('Try a completely new concept', Lightbulb, 3, 'new ideas'), option('Make the layout simpler', Palette, 3, 'visual communication'), option('Ask people what confused them', MessageCircle, 2, 'user feedback'), option('Move to a different task', Compass, 0, 'other interests')]),
    question('Which creative project sounds most like you?', [option('Draw or make something original', Palette, 3, 'making things'), option('Tell a story with images', BookOpen, 3, 'visual storytelling'), option('Improve how an app looks', Eye, 2, 'design improvement'), option('Follow exact instructions', CheckCircle2, 1, 'structured work')]),
  ],
  science: [
    question('You notice something unusual in nature. What would you do?', [option('Ask what caused it', Search, 3, 'asking questions'), option('Observe it and take notes', BookOpen, 3, 'careful observation'), option('Try a safe test to learn more', FlaskConical, 3, 'testing ideas'), option('Read a short explanation and move on', Compass, 1, 'guided learning')]),
    question('An experiment gives an unexpected result. What is your reaction?', [option('Repeat it carefully', FlaskConical, 3, 'checking results'), option('Look for a mistake in the method', Search, 3, 'investigating causes'), option('Think of another explanation', Lightbulb, 2, 'forming ideas'), option('Feel ready to stop the experiment', ArrowRight, 0, 'other interests')]),
    question('Which science activity would you pick?', [option('Study plants, animals, or the body', Leaf, 3, 'life science'), option('Mix safe materials and observe change', FlaskConical, 3, 'experiments'), option('Explore space or physical systems', Compass, 2, 'big questions'), option('Sort facts from a reading', BookOpen, 1, 'learning from sources')]),
  ],
  business: [
    question('Your group wants to raise money for a cause. What role appeals to you?', [option('Plan a simple budget', ChartNoAxesCombined, 3, 'planning'), option('Find out what people would buy', Search, 3, 'understanding customers'), option('Organize the team and timeline', CalendarDays, 2, 'coordination'), option('Work on a task someone assigns', CheckCircle2, 1, 'structured support')]),
    question('A small project is running out of time. What would you focus on?', [option('Choose the most important task', Target, 3, 'prioritizing'), option('Adjust the plan and divide the work', ChartNoAxesCombined, 3, 'organizing resources'), option('Ask the team what is getting in the way', Users, 2, 'team communication'), option('Leave the decisions to someone else', Compass, 0, 'other interests')]),
    question('Which business idea would you like to explore?', [option('Create a helpful service', Lightbulb, 3, 'building an idea'), option('Compare prices and costs', ChartColumn, 3, 'working with numbers'), option('Promote a product to an audience', MessageCircle, 2, 'persuasion'), option('Follow a clear checklist', CheckCircle2, 1, 'reliable process')]),
  ],
  people: [
    question('A classmate seems upset after a difficult day. What would you naturally do?', [option('Listen and ask what they need', Ear, 3, 'active listening'), option('Try to understand how they feel', Heart, 3, 'empathy'), option('Offer a practical next step', Lightbulb, 2, 'helpful problem solving'), option('Give them space and check in later', MessageCircle, 2, 'thoughtful support')]),
    question('During a group discussion, which role feels most comfortable?', [option('Invite quieter people to share', Users, 3, 'including others'), option('Explain an idea clearly', MessageCircle, 3, 'explaining ideas'), option('Help the group agree on a plan', Handshake, 3, 'bringing people together'), option('Work alone instead of discussing', BookOpen, 0, 'independent preference')]),
    question('Two friends disagree. What would you pay most attention to?', [option('Hear both sides before responding', Ear, 3, 'fair listening'), option('Find a solution both can accept', Handshake, 3, 'finding common ground'), option('Explain the issue calmly', MessageCircle, 2, 'clear communication'), option('Avoid getting involved', Compass, 0, 'other interests')]),
  ],
  building: [
    question('A small device stops working. What would you try first?', [option('Check each part one by one', Wrench, 3, 'troubleshooting'), option('Look at a diagram and trace the system', Search, 3, 'understanding systems'), option('Try a safe adjustment', FlaskConical, 2, 'hands-on testing'), option('Ask someone else to repair it', Users, 1, 'learning with help')]),
    question('You can improve one thing in your classroom. Which task sounds best?', [option('Build a useful organizer', Wrench, 3, 'making useful things'), option('Sketch a better room layout', Palette, 2, 'designing spaces'), option('Plan how materials will be used', ChartNoAxesCombined, 2, 'planning resources'), option('Choose a non-building task', Compass, 0, 'other interests')]),
    question('Which practical challenge would you choose?', [option('Make a bridge from simple materials', Wrench, 3, 'engineering design'), option('Build a basic electronic circuit', Zap, 3, 'electronics'), option('Test which materials are strongest', FlaskConical, 2, 'testing materials'), option('Read how a machine works', BookOpen, 1, 'learning about technology')]),
  ],
  data: [
    question('A class survey has many answers. What would you like to find out?', [option('Which answer appears most often', ChartColumn, 3, 'finding patterns'), option('Whether two answers are connected', ChartNoAxesCombined, 3, 'comparing information'), option('What people meant in their comments', MessageCircle, 2, 'understanding context'), option('Skip the numbers and read a summary', BookOpen, 1, 'using summaries')]),
    question('A chart shows an unexpected result. What would you do?', [option('Check the original numbers', Search, 3, 'checking accuracy'), option('Compare it with another group', ChartColumn, 3, 'making comparisons'), option('Ask what might explain the change', Lightbulb, 2, 'interpreting results'), option('Accept the chart without checking', CheckCircle2, 0, 'less interest in checking')]),
    question('Which information task sounds satisfying?', [option('Organize messy information', ChartNoAxesCombined, 3, 'organizing data'), option('Make a clear chart for others', Palette, 3, 'communicating findings'), option('Find a useful answer in a dataset', Search, 3, 'investigating data'), option('Write a story or create a design', BookOpen, 1, 'other ways to communicate')]),
  ],
  society: [
    question('You notice litter near a local park. What would you be most likely to do?', [option('Find out where the litter comes from', Search, 3, 'investigating causes'), option('Join or organize a clean-up', Leaf, 3, 'taking local action'), option('Talk with people about prevention', MessageCircle, 2, 'community communication'), option('Look for another issue to work on', Compass, 0, 'other interests')]),
    question('A community is planning a greener neighborhood. What interests you?', [option('Protect plants and wildlife', Leaf, 3, 'care for nature'), option('Plan safer walking and cycling routes', Map, 3, 'improving places'), option('Learn how residents use the area', Users, 2, 'understanding communities'), option('Read the final plan only', BookOpen, 1, 'following updates')]),
    question('Which project would you choose?', [option('Track local air or water quality', FlaskConical, 3, 'environmental research'), option('Create a garden for the community', Sprout, 3, 'restoring nature'), option('Help people reduce waste', Recycle, 2, 'sustainable habits'), option('Work on a topic unrelated to the environment', Compass, 0, 'other interests')]),
  ],
}

function readHistory() {
  try {
    const parsed = JSON.parse(getUserItem(HISTORY_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export default function Discover({ discoveryCount, setDiscoveryCount }) {
  const [active, setActive] = useState(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [complete, setComplete] = useState(false)
  const [history, setHistory] = useState(readHistory)
  const activityQuestions = active ? (questionSets[active.id] || []) : []
  const selectedChoices = activityQuestions.map((item, index) => item.options.find(answer => answer.label === answers[index])).filter(Boolean)
  const choose = answer => { const next = [...answers]; next[step] = answer; setAnswers(next) }
  const start = area => {
    if (history.some(result => result.activityId === area.id)) return
    setActive(area); setStep(0); setAnswers([]); setComplete(false)
  }
  const finish = () => {
    const result = {
      activityId: active.id,
      activityName: active.name,
      answers,
      signals: selectedChoices.map(() => active.id),
      score: selectedChoices.reduce((total, answer) => total + answer.score, 0),
      maxScore: activityQuestions.length * 3,
      themes: selectedChoices.map(answer => answer.theme),
      date: new Date().toISOString(),
    }
    const nextHistory = [...history, result].slice(-500)
    setHistory(nextHistory)
    setUserItem(HISTORY_KEY, JSON.stringify(nextHistory))
    setUserItem('cc-last-discovery', JSON.stringify(result))
    setDiscoveryCount(count => count + 1)
    setComplete(true)
  }
  const reset = () => { setActive(null); setStep(0); setAnswers([]); setComplete(false) }

  if (active && !complete) return <div className="page-content"><button className="back-link" onClick={reset}><ArrowLeft size={16}/> All discovery activities</button><div className="challenge-shell"><div className="challenge-progress"><span>DISCOVERY CHALLENGE</span><span>Question {step + 1} of {activityQuestions.length}</span></div><div className="progress-track"><span className="progress-fill teal" style={{ width: `${((step + 1) / activityQuestions.length) * 100}%` }}/></div><div className="challenge-main"><div className="challenge-badge"><Brain size={24}/></div><div className="eyebrow">{active.name.toUpperCase()}</div><h1>{activityQuestions[step].question}</h1><p className="challenge-hint">Pick the picture that best matches how you would think or act. There are no right answers.</p><div className="answer-list visual-answer-list">{activityQuestions[step].options.map(answer => { const Icon = answer.icon; const color = interestAreas.find(area => area.id === active.id)?.color || 'teal'; return <button type="button" key={answer.label} onClick={() => choose(answer.label)} className={`answer-option visual-answer-option ${answers[step] === answer.label ? 'selected' : ''}`}><span className={`visual-answer-image icon-${color}`}><Icon size={30}/></span><span className="visual-answer-label">{answer.label}</span><span className="answer-radio">{answers[step] === answer.label ? '✓' : ''}</span></button> })}</div><div className="challenge-actions"><button className="button button-secondary" onClick={() => step === 0 ? reset() : setStep(current => current - 1)}>{step === 0 ? 'Cancel' : 'Previous'}</button><button className="button button-primary" disabled={!answers[step]} onClick={() => step === activityQuestions.length - 1 ? finish() : setStep(current => current + 1)}>{step === activityQuestions.length - 1 ? 'Complete activity' : 'Next'} <ArrowRight size={16}/></button></div></div><p className="challenge-disclaimer">This activity is a simple reflection, not a test of ability.</p></div></div>

  if (complete) return <div className="page-content"><div className="completion-card"><div className="completion-icon"><CheckCircle2 size={32}/></div><div className="eyebrow">ACTIVITY COMPLETED</div><h1>Nice work making time to explore.</h1><p>Your answers suggest interest in {selectedChoices.map(answer => answer.theme).filter((theme, index, values) => values.indexOf(theme) === index).join(', ')}. This is a reflection of the choices you made, not a fixed label.</p><div className="completion-summary"><span>Exploration signal</span><strong>{selectedChoices.reduce((total, answer) => total + answer.score, 0)} / {activityQuestions.length * 3}</strong></div><div className="completion-actions"><button className="button button-primary" onClick={reset}>Explore other activities</button><a className="button button-secondary" href="/interest-map">View interest map <ArrowRight size={16}/></a></div></div></div>

  return <div className="page-content"><SectionTitle eyebrow="DISCOVER YOURSELF" title="Explore what sparks your curiosity." description="Choose an activity and answer three simple picture-led questions. Each activity can be completed once."/><div className="discovery-callout"><div className="callout-icon"><Sparkles size={21}/></div><div><strong>There is no single right path.</strong><p>Your answers are saved as reflection signals, not as a measure of ability or a limit on your future.</p></div><span className="callout-progress">{discoveryCount} completed</span></div><div className="discovery-grid">{interestAreas.map(area => { const Icon = iconMap[area.icon] || Compass; const completedArea = history.some(result => result.activityId === area.id); return <article className={`discovery-card ${completedArea ? 'discovery-card-complete' : ''}`} key={area.id}><div className={`discovery-card-icon icon-${area.color}`}>{completedArea ? <CheckCircle2 size={22}/> : <Icon size={22}/>}</div><div className="discovery-card-meta"><span className="activity-type">{completedArea ? 'COMPLETED' : 'REFLECTION ACTIVITY'}</span><span className="duration"><Clock3 size={13}/> {area.time}</span></div><h3>{area.name}</h3><p>{area.description}</p><button className="card-link" disabled={completedArea} onClick={() => start(area)}><span>{completedArea ? 'Completed' : 'Start activity'}</span>{!completedArea && <ArrowRight size={16}/>}</button></article> })}</div><div className="notice-box"><span>ⓘ</span><p><strong>About these activities:</strong> Picture choices make the reflection simple. Your selections add signals to the interest map; they are not an assessment of ability.</p></div></div>
}
