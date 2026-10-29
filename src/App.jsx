import React, { useEffect, useState } from 'react'
import { Routes, Route as RouterRoute, Navigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Brand from './components/Brand'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import InterestMap from './pages/InterestMap'
import Careers from './pages/Careers'
import Opportunities from './pages/Opportunities'
import NextSteps from './pages/NextSteps'
import Roadmap from './pages/Roadmap'
import Companion from './pages/Companion'
import StudyPlan from './pages/StudyPlan'
import Quiz from './pages/Quiz'
import Saved from './pages/Saved'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import { careers as initialCareers, opportunities as initialOpportunities, initialTasks } from './data/demoData'

function readList(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}
const titles = {
  '/dashboard':'Dashboard','/discover':'Interest discovery','/interest-map':'My interest map','/careers':'Career explorer',
  '/next-steps':"What's next?",'/opportunities':'Opportunity radar','/roadmap':'My roadmap','/companion':'AI companion','/study-plan':'AI study plan','/quiz':'Practice quiz',
  '/saved':'Saved items','/progress':'My progress','/settings':'Settings'
}
function Workspace({ children, onMenu, title }) {
  return <div className="app-shell"><Sidebar open={false} onClose={()=>{}}/><div className="workspace"><Topbar onMenu={onMenu}/><div className="mobile-page-title"><span>{title}</span></div>{children}</div></div>
}
export default function App() {
  const location = useLocation()
  const [menuOpen,setMenuOpen] = useState(false)
  const [tasks,setTasks] = useState(()=>readList('cc-tasks',initialTasks))
  const [discoveryCount,setDiscoveryCount] = useState(()=>Number(localStorage.getItem('cc-discovery-count')||0))
  const [savedCareers,setSavedCareers] = useState(()=>readList('cc-saved-careers',[]))

  
  const [savedOpportunities,setSavedOpportunities] = useState(()=>readList('cc-saved-opportunities',[]))
  useEffect(()=>{localStorage.setItem('cc-tasks',JSON.stringify(tasks))},[tasks])
  useEffect(()=>{localStorage.setItem('cc-discovery-count',String(discoveryCount))},[discoveryCount])
  useEffect(()=>{localStorage.setItem('cc-saved-careers',JSON.stringify(savedCareers))},[savedCareers])
  useEffect(()=>{localStorage.setItem('cc-saved-opportunities',JSON.stringify(savedOpportunities))},[savedOpportunities])
  useEffect(()=>{window.scrollTo(0,0);setMenuOpen(false)},[location.pathname])
  const toggleSavedCareer=id=>setSavedCareers(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
  const toggleSavedOpportunity=id=>setSavedOpportunities(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
 const pageProps = {
  tasks,
  setTasks,
  discoveryCount,
  setDiscoveryCount,
  careers: initialCareers,
  opportunities: initialOpportunities,
  savedCareers,
  savedOpportunities,
  toggleSavedCareer,
  toggleSavedOpportunity,
}
  const isLanding=location.pathname==='/'
  const currentTitle=titles[location.pathname]||'CareerCompass AI'
  return <>
    {isLanding?<Landing/>:<div className="app-shell"><div className={`sidebar-host ${menuOpen?'menu-visible':''}`}><Sidebar open={menuOpen} onClose={()=>setMenuOpen(false)}/></div><div className="workspace"><Topbar onMenu={()=>setMenuOpen(true)}/><div className="mobile-page-title"><Brand/><span>{currentTitle}</span></div><Routes>
      <RouterRoute path="/dashboard" element={<Dashboard {...pageProps}/>}/>
      <RouterRoute path="/discover" element={<Discover discoveryCount={discoveryCount} setDiscoveryCount={setDiscoveryCount}/>}/>
      <RouterRoute path="/interest-map" element={<InterestMap discoveryCount={discoveryCount}/>}/>
      <RouterRoute path="/careers" element={<Careers careers={initialCareers} savedCareers={savedCareers} toggleSavedCareer={toggleSavedCareer}/>}/>
      <RouterRoute path="/opportunities" element={<Opportunities opportunities={initialOpportunities} savedOpportunities={savedOpportunities} toggleSavedOpportunity={toggleSavedOpportunity}/>}/>
      <RouterRoute path="/next-steps" element={<NextSteps/>}/>
      <RouterRoute path="/roadmap" element={<Roadmap tasks={tasks} setTasks={setTasks}/>}/>
      <RouterRoute path="/study-plan" element={<StudyPlan setTasks={setTasks}/>}/>
      <RouterRoute path="/quiz" element={<Quiz/>}/>
      <RouterRoute path="/companion" element={<Companion/>}/>
      <RouterRoute path="/saved" element={<Saved {...pageProps}/>}/>
      <RouterRoute path="/progress" element={<Progress {...pageProps}/>}/>
      <RouterRoute path="/settings" element={<Settings/>}/>
      <RouterRoute path="*" element={<Navigate to="/dashboard" replace/>}/>
    </Routes><footer className="app-footer"><span>© 2026 CareerCompass AI</span><span>Prototype · Sample opportunity data</span><Link to="/settings">Privacy & settings</Link></footer></div></div>}
  </>
}
