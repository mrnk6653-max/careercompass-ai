import React from 'react'
import { Bell, Menu, Search } from 'lucide-react'

export default function Topbar({ onMenu }) {
  return <header className="topbar"><button className="icon-button menu-toggle" onClick={onMenu} aria-label="Open navigation"><Menu size={21}/></button><div className="topbar-search"><Search size={17}/><input placeholder="Search careers, skills, opportunities..." aria-label="Search"/></div><div className="topbar-actions"><button className="icon-button notification-button" aria-label="Notifications" title="Notifications"><Bell size={19}/><i /></button><div className="topbar-avatar">NK</div></div></header>
}
