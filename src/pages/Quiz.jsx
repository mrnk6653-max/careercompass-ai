import React, { useState } from 'react'
import { Brain, CheckCircle2, LoaderCircle, RotateCcw, Sparkles, Target } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import { setUserItem } from '../utils/userStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`

export default function Quiz() {
  const [topic, setTopic] = useState('Trees and Graphs in DSA')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [count, setCount] = useState(5)
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate(event) {
    event.preventDefault()
    setLoading(true); setError(''); setSubmitted(false); setAnswers({})
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, count: Number(count) })
      })
      const result = await response.json()
      if (!response.ok || !result.success || !result.data?.questions?.length) throw new Error(result.message || 'Could not create a quiz.')
      setQuiz(result.data)
    } catch (err) {
      setError(`${err.message} Make sure the backend is running and try again.`)
    } finally { setLoading(false) }
  }

  const score = quiz ? quiz.questions.reduce((total, question, index) => total + (Number(answers[index]) === question.answerIndex ? 1 : 0), 0) : 0
  function submitQuiz() {
    const total = quiz.questions.length
    setUserItem('cc-last-quiz', JSON.stringify({ topic, difficulty, score, total, percentage: Math.round(score / total * 100), date: new Date().toISOString() }))
    setSubmitted(true)
  }

  return <div className="page-content">
    <SectionTitle eyebrow="PRACTISE & REFLECT" title="Check what you understand." description="Generate a short multiple-choice quiz on a topic you're learning, then review explanations for every question."/>
    <div className="feature-layout quiz-feature-layout">
      <form className="feature-form panel" onSubmit={generate}>
        <div className="feature-form-heading"><span className="panel-icon panel-icon-violet"><Brain size={19}/></span><div><h2>Create a practice quiz</h2><p>Choose a topic and difficulty.</p></div></div>
        <label className="form-label">Topic<input required maxLength={200} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Binary trees"/></label>
        <div className="form-two-col"><label className="form-label">Difficulty<select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label className="form-label">Questions<select value={count} onChange={e=>setCount(e.target.value)}>{[3,5,8].map(n=><option value={n} key={n}>{n} questions</option>)}</select></label></div>
        <button className="button button-primary feature-submit" disabled={loading}>{loading?<><LoaderCircle size={16} className="loading-icon"/> Creating quiz…</>:<><Sparkles size={16}/> Generate quiz</>}</button>
        {error && <p className="form-error">{error}</p>}
        <p className="muted-small">Use this as practice, not as a formal assessment. AI-generated questions and answers can be imperfect.</p>
      </form>
      <aside className="feature-side-card quiz-side-card"><div className="feature-side-icon"><Target size={22}/></div><h3>Learn from every answer</h3><p>Choose an answer, submit your quiz, and review the explanations to identify what to revise next.</p><div className="feature-mini-row"><CheckCircle2 size={16}/><span>Instant score</span></div><div className="feature-mini-row"><Brain size={16}/><span>Explanations for review</span></div></aside>
    </div>
    {quiz && <section className="quiz-panel">
      <div className="generated-plan-header"><div><span className="eyebrow">{difficulty.toUpperCase()} PRACTICE</span><h2>{quiz.title}</h2><p>{submitted ? `You scored ${score} out of ${quiz.questions.length}. Review each explanation below.` : `Answer all ${quiz.questions.length} questions, then submit to see your results.`}</p></div>{submitted && <div className="quiz-score"><strong>{Math.round(score/quiz.questions.length*100)}%</strong><span>Your score</span></div>}</div>
      {quiz.questions.map((question,index)=><article className={`quiz-question ${submitted ? (Number(answers[index])===question.answerIndex?'quiz-correct':'quiz-incorrect') : ''}`} key={`${index}-${question.question}`}><h3><span>{index+1}</span>{question.question}</h3><div className="quiz-options">{question.options.map((option,optionIndex)=><label className={`quiz-option ${submitted && optionIndex===question.answerIndex?'answer-correct':''} ${submitted && Number(answers[index])===optionIndex && optionIndex!==question.answerIndex?'answer-wrong':''}`} key={optionIndex}><input type="radio" name={`question-${index}`} value={optionIndex} checked={Number(answers[index])===optionIndex} onChange={()=>setAnswers(previous=>({...previous,[index]:optionIndex}))} disabled={submitted}/><span>{option}</span></label>)}</div>{submitted && <div className="quiz-explanation"><strong>{Number(answers[index])===question.answerIndex?'Correct':'Review this answer'}</strong><p>{question.explanation}</p></div>}</article>)}
      {!submitted ? <button className="button button-primary" disabled={Object.keys(answers).length!==quiz.questions.length} onClick={submitQuiz}><CheckCircle2 size={16}/> Submit answers</button> : <button className="button button-secondary" onClick={()=>{setQuiz(null);setAnswers({});setSubmitted(false)}}><RotateCcw size={16}/> Create another quiz</button>}
    </section>}
  </div>
}
