import React from 'react'
import { Bookmark, CalendarDays, ArrowUpRight, ShieldAlert } from 'lucide-react'

export default function OpportunityCard({ item, saved, onSave, compact = false }) {
  return <article className={`opportunity-card ${compact ? 'compact' : ''}`}>
    <div className="opportunity-card-top"><div className="opportunity-type-group"><span className="type-pill">{item.type}</span>{item.profileScore > 0 && <span className="profile-match-badge">Profile match</span>}</div><button className={`icon-button save-button ${saved ? 'saved' : ''}`} onClick={() => onSave(item.id)} aria-label={saved ? 'Remove saved opportunity' : 'Save opportunity'}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <h3>{item.title}</h3><p className="provider">{item.provider}</p><p className="opportunity-desc">{item.description}</p>{item.matchReason && <p className="opportunity-match-reason">{item.matchReason}</p>}
    <div className="opportunity-meta"><span><CalendarDays size={15}/> Deadline: {item.deadline}</span><span className="sample-badge"><ShieldAlert size={14}/> {item.status}</span></div>
    <div className="opportunity-card-footer">{item.url && <a className="text-button official-source-link" href={item.url} target="_blank" rel="noreferrer">Open official source <ArrowUpRight size={15}/></a>}{!compact && <button className="text-button" onClick={() => window.dispatchEvent(new CustomEvent('show-opportunity', { detail: item.id }))}>View details <ArrowUpRight size={15}/></button>}</div>
  </article>
}
