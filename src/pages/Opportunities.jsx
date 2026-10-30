import React, { useMemo, useState, useEffect } from 'react'
import { Search, Filter, ShieldAlert, CalendarDays, ExternalLink, X, CheckCircle2, CircleHelp, Bookmark, Sparkles } from 'lucide-react'
import SectionTitle from '../components/SectionTitle'
import OpportunityCard from '../components/OpportunityCard'
import { getPersonalizedOpportunities } from '../data/opportunityData'

export default function Opportunities({ profile = {}, savedOpportunities = [], toggleSavedOpportunity = () => {} }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All types')
  const [detail, setDetail] = useState(null)
  const opportunities = useMemo(() => getPersonalizedOpportunities(profile), [profile])
  useEffect(() => {
    const handler = event => {
      const found = opportunities.find(item => item.id === event.detail)
      if (found) setDetail(found)
    }
    window.addEventListener('show-opportunity', handler)
    return () => window.removeEventListener('show-opportunity', handler)
  }, [opportunities])

  const types = useMemo(() => ['All types', ...new Set(opportunities.map(item => item.type))], [opportunities])
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    return opportunities.filter(item => (type === 'All types' || item.type === type) &&
      `${item.title} ${item.provider} ${item.type} ${item.description} ${item.eligibility} ${item.keywords.join(' ')}`.toLowerCase().includes(search))
  }, [opportunities, type, query])
  const personalized = [profile.currentClass, profile.favoriteSubject, profile.course].filter(Boolean).join(' · ')

  return <div className="page-content">
    <SectionTitle eyebrow="FIND A WAY FORWARD" title="Opportunity radar" description="Official Indian portals and notices, ranked using your class, favorite subject, and course."/>
    {personalized && <div className="profile-match-note"><Sparkles size={16}/><span>Suggestions for <strong>{personalized}</strong>. Confirm the live listing and eligibility with the official source before applying.</span></div>}
    <div className="opportunity-alert"><ShieldAlert size={20}/><div><strong>Check the official notice before you apply</strong><p>Portal listings can change. Some cards open live search portals rather than a single vacancy; dates and eligibility shown here are checked against the linked notice and may change.</p></div></div>
    <div className="career-toolbar"><div className="search-field"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search jobs, exams, scholarships, subjects..." aria-label="Search opportunities"/></div><div className="filter-field"><Filter size={16}/><select value={type} onChange={event => setType(event.target.value)} aria-label="Filter opportunity type">{types.map(item => <option key={item}>{item}</option>)}</select></div></div>
    <div className="result-line"><span>{filtered.length} official sources and notices</span><span>Matched sources appear first.</span></div>
    <div className="opportunity-grid">{filtered.map(item => <OpportunityCard key={item.id} item={item} saved={savedOpportunities.includes(item.id)} onSave={toggleSavedOpportunity}/>)}</div>
    {filtered.length === 0 && <div className="empty-state"><Search size={26}/><h3>No matching opportunities</h3><p>Try a broader subject or clear the filters.</p><button className="button button-secondary" onClick={() => { setQuery(''); setType('All types') }}>Clear filters</button></div>}
    <div className="future-feature-card"><div className="future-feature-icon"><CheckCircle2 size={21}/></div><div><h3>Personalized starting points</h3><p>The radar matches your study profile with official portals. It does not claim every linked portal has an eligible opening for you; read the current notice and scheme rules.</p></div></div>
    {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><section className="career-modal" onClick={event => event.stopPropagation()}><button className="icon-button modal-close" onClick={() => setDetail(null)} aria-label="Close"><X size={19}/></button><span className="type-pill">{detail.type}</span><h2>{detail.title}</h2><p className="provider">{detail.provider}</p><div className="opportunity-alert compact-alert"><ShieldAlert size={18}/><div><strong>{detail.status}</strong><p>{detail.description}</p></div></div><div className="modal-section"><h3><CalendarDays size={17}/> Deadline</h3><p>{detail.deadline}</p></div><div className="modal-section"><h3><CircleHelp size={17}/> Eligibility</h3><p>{detail.eligibility}</p></div><div className="modal-actions"><button className="button button-primary" onClick={() => toggleSavedOpportunity(detail.id)}><Bookmark size={16}/>{savedOpportunities.includes(detail.id) ? 'Saved' : 'Save for later'}</button><a className="button button-secondary" href={detail.url} target="_blank" rel="noreferrer">Open official source <ExternalLink size={16}/></a><button className="button button-secondary" onClick={() => setDetail(null)}>Close</button></div></section></div>}
  </div>
}
