import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Send, Sparkles, UserRound, BookOpen, Compass, BriefcaseBusiness, LoaderCircle, AlertCircle, Plus, Trash2, Pencil, Copy, Check, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../context/AuthContext'
import { getUserItem, setUserItem } from '../utils/userStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`
const STORAGE_KEY = 'cc-companion-v2'
const MAX_CONVERSATIONS = 20
const MAX_MESSAGES = 60
const welcome = () => ({ id: crypto.randomUUID(), role: 'assistant', text: "Hi! I'm your CareerCompass mentor. Tell me what you're curious about, and we'll turn it into a practical next step." })
const suggestions = ['What careers combine my interests?', 'Help me make a beginner learning roadmap', 'How can I prepare for internships?']
const blankConversation = () => ({ id: crypto.randomUUID(), title: 'New conversation', createdAt: Date.now(), updatedAt: Date.now(), messages: [welcome()] })
function readStore() {
  try {
    const parsed = JSON.parse(getUserItem(STORAGE_KEY) || 'null')
    if (parsed?.version === 2 && Array.isArray(parsed.conversations)) return { conversations: parsed.conversations.slice(0, MAX_CONVERSATIONS), activeId: parsed.activeId, profile: parsed.profile || {} }
  } catch { /* recover from malformed local data */ }
  return { conversations: [], activeId: null, profile: {} }
}
function readLocalJson(key, fallback = null) {
  try { return JSON.parse(getUserItem(key) || 'null') ?? fallback } catch { return fallback }
}
function buildAppContext({ careers = [], savedCareers = [], tasks = [], discoveryCount = 0 }) {
  const savedCareerTitles = careers.filter(career => savedCareers.includes(career.id)).map(career => career.title).slice(0, 8)
  const pendingTasks = tasks.filter(task => !task.done).slice(0, 5).map(task => String(task.title || '').slice(0, 140)).filter(Boolean)
  const lastDiscovery = readLocalJson('cc-last-discovery', {})
  const lastQuiz = readLocalJson('cc-last-quiz', {})
  return {
    savedCareers: savedCareerTitles,
    discoveryCount: Number.isFinite(Number(discoveryCount)) ? Number(discoveryCount) : 0,
    discoveryResponses: Array.isArray(lastDiscovery?.answers) ? lastDiscovery.answers.filter(answer => typeof answer === 'string').slice(0, 3).map(answer => answer.slice(0, 160)) : [],
    roadmap: { completed: tasks.filter(task => task.done).length, total: tasks.length, nextTasks: pendingTasks },
    lastQuiz: {
      topic: String(lastQuiz?.topic || '').slice(0, 120),
      difficulty: String(lastQuiz?.difficulty || '').slice(0, 40),
      score: Number.isFinite(lastQuiz?.score) ? lastQuiz.score : null,
      total: Number.isFinite(lastQuiz?.total) ? lastQuiz.total : null,
      percentage: Number.isFinite(lastQuiz?.percentage) ? lastQuiz.percentage : null,
    },
    studyPlan: {
      goal: String(getUserItem('cc-plan-goal') || '').slice(0, 160),
      currentSkills: String(getUserItem('cc-plan-skills') || '').slice(0, 160),
    },
  }
}
function titleFrom(text) { return text.trim().replace(/\s+/g, ' ').slice(0, 42) + (text.trim().length > 42 ? '…' : '') }
function InlineMarkdown({ text }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g)
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2,-2)}</strong>
    if (part.startsWith('*')) return <em key={i}>{part.slice(1,-1)}</em>
    if (part.startsWith('`')) return <code key={i}>{part.slice(1,-1)}</code>
    return part
  })
}
function Markdown({ text }) {
  const lines = text.split('\n'); const blocks=[]; let list=[]; let code=[]; let inCode=false
  const flushList=()=>{if(list.length){blocks.push(<ul key={`ul-${blocks.length}`}>{list.map((item,i)=><li key={i}><InlineMarkdown text={item}/></li>)}</ul>);list=[]}}
  lines.forEach((line,i)=>{
    if (line.trim().startsWith('```')) { flushList(); if(inCode) blocks.push(<pre key={`code-${i}`}><code>{code.join('\n')}</code></pre>); code=[]; inCode=!inCode; return }
    if(inCode){code.push(line);return}
    const bullet=line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)/)
    if(bullet){list.push(bullet[1]);return} flushList()
    if(!line.trim()){return}
    const heading=line.match(/^#{1,3}\s+(.+)/)
    blocks.push(heading ? <h4 key={i}><InlineMarkdown text={heading[1]}/></h4> : <p key={i}><InlineMarkdown text={line}/></p>)
  }); flushList(); if(code.length) blocks.push(<pre key="code-end"><code>{code.join('\n')}</code></pre>); return blocks
}

export default function Companion({ careers = [], savedCareers = [], tasks = [], discoveryCount = 0 }) {
  const { user, updateProfile } = useAuth()
  const [store,setStore]=useState(readStore)
  const [input,setInput]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [profileOpen,setProfileOpen]=useState(false); const [copied,setCopied]=useState('')
  const [profileError,setProfileError]=useState('')
  const bottomRef=useRef(null); const controller=useRef(null)
    const migratedProfileUser=useRef(null)
  const conversations=store.conversations
  const active=conversations.find(c=>c.id===store.activeId) || conversations[0] || null
  useEffect(()=>{setUserItem(STORAGE_KEY,JSON.stringify({...store,version:2}))},[store])
    useEffect(()=>{
      if (migratedProfileUser.current === user.id) return
      migratedProfileUser.current = user.id
      const savedProfile = store.profile || {}
      const hasSavedProfile = Object.values(savedProfile).some(value => typeof value === 'string' && value.trim())
      const hasAccountProfile = Object.values(user.profile || {}).some(value => typeof value === 'string' && value.trim())
      if (!hasAccountProfile && hasSavedProfile) {
        updateProfile({ profile: savedProfile }).then(updated => {
          setStore(previous => ({ ...previous, profile: updated.profile }))
        }).catch(error => setProfileError(error.message || 'Could not migrate your saved profile.'))
        return
      }
      setStore(previous=>({...previous,profile:user.profile||{}}))
    },[user.id])
  useEffect(()=>{if(!conversations.length){const chat=blankConversation();setStore(s=>({...s,conversations:[chat],activeId:chat.id}))}else if(!conversations.some(c=>c.id===store.activeId))setStore(s=>({...s,activeId:s.conversations[0]?.id}))},[conversations.length,store.activeId])
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth',block:'end'})},[active?.messages,loading])
  const updateActive = fn => setStore(s=>({...s,conversations:s.conversations.map(c=>c.id===s.activeId?fn(c):c)}))
  const newChat=()=>{if(conversations.length>=MAX_CONVERSATIONS){setError(`Keep up to ${MAX_CONVERSATIONS} conversations. Delete one before starting another.`);return}const chat=blankConversation();setStore(s=>({ ...s,conversations:[chat,...s.conversations],activeId:chat.id }));setError('')}
  const deleteChat=id=>{const chat=conversations.find(c=>c.id===id);if(!chat||!window.confirm(`Delete “${chat.title}”? This cannot be undone.`))return;const next=conversations.filter(c=>c.id!==id);setStore(s=>({...s,conversations:next,activeId:id===s.activeId?(next[0]?.id||null):s.activeId}));if(!next.length){const fresh=blankConversation();setStore(s=>({...s,conversations:[fresh],activeId:fresh.id}))}}
  const clearChat=()=>{if(!active||!window.confirm('Clear all messages in this conversation?'))return;updateActive(c=>({...c,messages:[welcome()],updatedAt:Date.now(),title:'New conversation'}));setError('')}
  async function send(raw=input) {
    const text=raw.trim(); if(!text||loading||!active)return
    const current=active.messages.slice(-MAX_MESSAGES)
    const history=current.filter(m=>['user','assistant'].includes(m.role)&&m.text).slice(-12).map(m=>({role:m.role,content:m.text}))
    const userMessage={id:crypto.randomUUID(),role:'user',text}
    updateActive(c=>({...c,title:c.title==='New conversation'?titleFrom(text):c.title,messages:[...c.messages,userMessage].slice(-MAX_MESSAGES),updatedAt:Date.now()}))
    setInput('');setError('');setLoading(true);controller.current=new AbortController()
    const timeout=setTimeout(()=>controller.current?.abort(),50000)
    try {
      const appContext=buildAppContext({careers,savedCareers,tasks,discoveryCount})
      const response=await fetch(`${API_BASE_URL}/api/chat`,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},signal:controller.current.signal,body:JSON.stringify({message:text,history,profile:store.profile,appContext})})
      const result=await response.json().catch(()=>({}))
      if(!response.ok||!result.success)throw new Error(result.message||`AI request failed (${response.status}).`)
      if(typeof result.answer!=='string'||!result.answer.trim())throw new Error('The AI service returned an empty response.')
      updateActive(c=>({...c,messages:[...c.messages,{id:crypto.randomUUID(),role:'assistant',text:result.answer,model:result.model}].slice(-MAX_MESSAGES),updatedAt:Date.now()}))
    } catch(e) { setError(e.name==='AbortError'?'The request took too long. Check your connection and retry.':e.message||'Could not connect to the AI service.') }
    finally{clearTimeout(timeout);setLoading(false);controller.current=null}
  }
  const saveProfile=async e=>{e.preventDefault();const form=new FormData(e.currentTarget);const profile=Object.fromEntries(['degree','year','interests','skills','experience','goals','currentClass','favoriteSubject','course'].map(key=>[key,String(form.get(key)||'').trim()]));setProfileError('');try{const updated=await updateProfile({profile});setStore(s=>({...s,profile:updated.profile}));setProfileOpen(false)}catch(error){setProfileError(error.message||'Could not save your profile.')}}
  const clearProfile=async()=>{const profile=Object.fromEntries(['degree','year','interests','skills','experience','goals','currentClass','favoriteSubject','course'].map(key=>[key,'']));setProfileError('');try{const updated=await updateProfile({profile});setStore(s=>({...s,profile:updated.profile}));setProfileOpen(false)}catch(error){setProfileError(error.message||'Could not clear your profile.')}}
  const copy=async text=>{try{await navigator.clipboard.writeText(text);setCopied(text);setTimeout(()=>setCopied(''),1400)}catch{setError('Could not access the clipboard in this browser.')}}
  const sorted=useMemo(()=>[...conversations].sort((a,b)=>b.updatedAt-a.updatedAt),[conversations])
  return <div className="page-content companion-page">
    <SectionTitle eyebrow="YOUR CAREER MENTOR" title="AI companion" description="A private, practical space to explore careers and plan your next step." action={<button className="button button-primary" onClick={newChat}><Plus size={16}/> New chat</button>}/>
    <div className="companion-workspace">
      <aside className="conversation-sidebar"><button className="button button-secondary conversation-new" onClick={newChat}><Plus size={16}/> New conversation</button><div className="conversation-list-label">RECENT CONVERSATIONS</div>{sorted.map(c=><div className={`conversation-item ${c.id===active?.id?'selected':''}`} key={c.id}><button className="conversation-select" onClick={()=>{setStore(s=>({...s,activeId:c.id}));setError('')}} title={c.title}>{c.title}</button><button className="conversation-delete" onClick={()=>deleteChat(c.id)} aria-label={`Delete ${c.title}`} title="Delete conversation"><Trash2 size={15}/></button></div>)}</aside>
      <section className="chat-panel">
        <div className="chat-header"><div className="chat-avatar"><Bot size={21}/></div><div className="chat-heading-copy"><strong>{active?.title||'New conversation'}</strong><span><i/> Gemma career mentor</span></div><button className="icon-button" onClick={()=>{const value=window.prompt('Rename conversation',active?.title);if(value?.trim())updateActive(c=>({...c,title:value.trim().slice(0,60)}))}} aria-label="Rename conversation" title="Rename"><Pencil size={16}/></button><button className="icon-button" onClick={clearChat} aria-label="Clear conversation" title="Clear conversation"><Trash2 size={16}/></button>
          <div className="profile-menu-wrap"><button className="button button-secondary profile-trigger" onClick={()=>setProfileOpen(v=>!v)}><UserRound size={15}/> Profile <ChevronDown size={14}/></button>{profileOpen&&<form className="student-profile-popover" onSubmit={saveProfile}><strong>Student profile</strong><p>Saved to your account and used to personalize careers, opportunities, and AI chat.</p>{profileError&&<div className="form-error" role="alert">{profileError}</div>}{[['currentClass','Current class / study year'],['favoriteSubject','Favorite subject'],['course','Course / stream'],['degree','Degree & branch'],['year','Academic year'],['interests','Interests'],['skills','Technical skills'],['experience','Experience level'],['goals','Career goals']].map(([key,label])=><label key={key}>{label}<input name={key} defaultValue={store.profile[key]||''} maxLength="160" placeholder={label}/></label>)}<div className="profile-actions"><button type="button" className="text-button" onClick={clearProfile}>Clear profile</button><button className="button button-primary button-sm">Save</button></div></form>}</div>
        </div>
        <div className="chat-messages" aria-live="polite" aria-busy={loading}>{active?.messages.map(message=><div className={`chat-message ${message.role}`} key={message.id}><span className="chat-message-avatar">{message.role==='assistant'?<Bot size={16}/>:<UserRound size={16}/>}</span><div className="chat-message-content"><div className="chat-bubble">{message.role==='assistant'?<Markdown text={message.text}/>:message.text}</div>{message.role==='assistant'&&<button className="copy-response" onClick={()=>copy(message.text)} aria-label="Copy response">{copied===message.text?<Check size={14}/>:<Copy size={14}/>} {copied===message.text?'Copied':'Copy'}</button>}</div></div>)}{loading&&<div className="chat-message assistant"><span className="chat-message-avatar"><Bot size={16}/></span><div className="chat-bubble typing-indicator"><span/><span/><span/><em>Thinking</em></div></div>}<div ref={bottomRef}/></div>
        {error&&<div className="form-error chat-error"><AlertCircle size={16}/><span>{error}</span>{active?.messages.some(m=>m.role==='user')&&<button className="text-button" onClick={()=>send(active.messages.filter(m=>m.role==='user').at(-1)?.text)}>Retry</button>}</div>}
        {active?.messages.length<=1&&<div className="chat-suggestions">{suggestions.map(q=><button key={q} onClick={()=>send(q)} disabled={loading}>{q}</button>)}</div>}
        <form className="chat-input-row" onSubmit={e=>{e.preventDefault();send()}}><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask about careers, skills, or your next step…" aria-label="Message your companion" disabled={loading} rows={2}/><button type="submit" className="send-button" disabled={!input.trim()||loading} aria-label="Send message">{loading?<LoaderCircle size={17} className="loading-icon"/>:<Send size={17}/>}</button></form><p className="chat-footnote">Conversations stay in this browser. Chat requests may include saved career, interest, study, quiz, roadmap, and profile context.</p>
      </section>
    </div>
    <div className="mentor-links"><Link to="/discover"><Compass size={17}/> Interest discovery</Link><Link to="/careers"><BriefcaseBusiness size={17}/> Career explorer</Link><Link to="/study-plan"><BookOpen size={17}/> Study plan</Link><Link to="/quiz"><Sparkles size={17}/> Practice quiz</Link><Link to="/roadmap"><BookOpen size={17}/> My roadmap</Link><Link to="/saved"><BriefcaseBusiness size={17}/> Saved careers</Link><Link to="/progress"><Sparkles size={17}/> Progress dashboard</Link></div>
  </div>
}
