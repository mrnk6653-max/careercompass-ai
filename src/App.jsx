import React, { useEffect, useState } from 'react'
import { Routes, Route as RouterRoute, Navigate, useLocation, Link } from 'react-router-dom'
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
import Profile from './pages/Profile'
import { careers as initialCareers, initialTasks } from './data/demoData'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import { activateUserStorage, deactivateUserStorage, getUserItem, setUserItem } from './utils/userStorage'
import { getPersonalizedOpportunities } from './data/opportunityData'

function readList(key, fallback) {
  try { const value = getUserItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}
const titles = {
  '/dashboard':'Dashboard','/discover':'Interest discovery','/interest-map':'My interest map','/careers':'Career explorer',
  '/next-steps':"What's next?",'/opportunities':'Opportunity radar','/roadmap':'My roadmap','/companion':'AI companion','/study-plan':'AI study plan','/quiz':'Practice quiz',
  '/saved':'Saved items','/progress':'My progress','/settings':'Settings','/profile':'Profile','/profile/edit':'Edit profile'
}
function Workspace({ children, onMenu, title }) {
  return <div className="app-shell"><Sidebar open={false} onClose={()=>{}}/><div className="workspace"><Topbar onMenu={onMenu}/><div className="mobile-page-title"><span>{title}</span></div>{children}</div></div>
}
function AccountWorkspace({ user }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    activateUserStorage(user.id)
    setReady(true)
    return () => deactivateUserStorage()
  }, [user.id])
  if (!ready) return <div className="auth-loading"><span className="loading-dot"/> Loading your workspace…</div>
  return <CareerWorkspace user={user}/>
}

function CareerWorkspace({ user }) {
  const location = useLocation()
  const [menuOpen,setMenuOpen] = useState(false)
  const [sidebarExpanded,setSidebarExpanded] = useState(false)
  const [tasks,setTasks] = useState(()=>readList('cc-tasks',initialTasks))
  const [discoveryCount,setDiscoveryCount] = useState(()=>Number(getUserItem('cc-discovery-count')||0))
  const [savedCareers,setSavedCareers] = useState(()=>readList('cc-saved-careers',[]))

  const [savedOpportunities,setSavedOpportunities] = useState(()=>readList('cc-saved-opportunities',[]))
  const opportunities = getPersonalizedOpportunities(user.profile || {})
  useEffect(()=>{setUserItem('cc-tasks',JSON.stringify(tasks))},[tasks])
  useEffect(()=>{setUserItem('cc-discovery-count',String(discoveryCount))},[discoveryCount])
  useEffect(()=>{setUserItem('cc-saved-careers',JSON.stringify(savedCareers))},[savedCareers])
  useEffect(()=>{setUserItem('cc-saved-opportunities',JSON.stringify(savedOpportunities))},[savedOpportunities])
  useEffect(()=>{window.scrollTo(0,0);setMenuOpen(false);setSidebarExpanded(false)},[location.pathname])
  const toggleSavedCareer=id=>setSavedCareers(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
  const toggleSavedOpportunity=id=>setSavedOpportunities(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])
 const pageProps = {
  tasks,
  setTasks,
  discoveryCount,
  setDiscoveryCount,
  careers: initialCareers,
  opportunities,
  profile: user.profile || {},
  user,
  savedCareers,
  savedOpportunities,
  toggleSavedCareer,
  toggleSavedOpportunity,
}
  const isLanding=location.pathname==='/welcome'
  const currentTitle=titles[location.pathname]||'CareerCompass AI'
  return <>
    {isLanding?<Landing/>:<div className={`app-shell ${sidebarExpanded?'sidebar-expanded':''}`}><div className={`sidebar-host ${menuOpen?'menu-visible':''}`}><Sidebar user={user} open={menuOpen} onExpand={()=>{if(!window.matchMedia('(max-width: 680px)').matches)setSidebarExpanded(true)}} onClose={()=>{setMenuOpen(false);setSidebarExpanded(false)}}/></div><div className="workspace"><Topbar user={user} onMenu={()=>setMenuOpen(true)}/><div className="mobile-page-title"><Brand/><span>{currentTitle}</span></div><Routes>
      <RouterRoute path="/" element={<Navigate to="/companion" replace/>}/>
      <RouterRoute path="/dashboard" element={<Dashboard {...pageProps}/>}/>
      <RouterRoute path="/discover" element={<Discover discoveryCount={discoveryCount} setDiscoveryCount={setDiscoveryCount}/>}/>
      <RouterRoute path="/interest-map" element={<InterestMap discoveryCount={discoveryCount}/>}/>
      <RouterRoute path="/careers" element={<Careers careers={initialCareers} profile={user.profile} savedCareers={savedCareers} toggleSavedCareer={toggleSavedCareer}/>}/>
      <RouterRoute path="/opportunities" element={<Opportunities opportunities={opportunities} profile={user.profile} savedOpportunities={savedOpportunities} toggleSavedOpportunity={toggleSavedOpportunity}/>}/>
      <RouterRoute path="/next-steps" element={<NextSteps/>}/>
      <RouterRoute path="/roadmap" element={<Roadmap tasks={tasks} setTasks={setTasks}/>}/>
      <RouterRoute path="/study-plan" element={<StudyPlan tasks={tasks} setTasks={setTasks}/>}/>
      <RouterRoute path="/quiz" element={<Quiz/>}/>
      <RouterRoute path="/companion" element={<Companion {...pageProps}/>}/>
      <RouterRoute path="/saved" element={<Saved {...pageProps}/>}/>
      <RouterRoute path="/progress" element={<Progress {...pageProps}/>}/>
      <RouterRoute path="/settings" element={<Settings/>}/>
      <RouterRoute path="/profile" element={<Profile/>}/>
      <RouterRoute path="/profile/edit" element={<Profile editing/>}/>
      <RouterRoute path="*" element={<Navigate to="/dashboard" replace/>}/>
    </Routes><footer className="app-footer"><span>© 2026 CareerCompass AI</span><span>Career ideas are exploratory · Check official opportunity notices</span><Link to="/settings">Privacy & settings</Link></footer></div></div>}
  </>
}

export default function App() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const authRoute = location.pathname === '/login' || location.pathname === '/signup'

  if (loading) return <div className="auth-loading"><span className="loading-dot"/> Loading CareerCompass…</div>
  if (authRoute) return user ? <Navigate to="/" replace/> : <AuthPage mode={location.pathname === '/signup' ? 'signup' : 'login'}/>
  if (location.pathname === '/welcome' && !user) return <Landing/>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }}/>
  if (location.pathname === '/welcome') return <Navigate to="/" replace/>
  return <AccountWorkspace key={user.id} user={user}/>
}
