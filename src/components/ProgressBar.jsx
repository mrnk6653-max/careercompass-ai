import React from 'react'
export default function ProgressBar({ value = 0, label, color = 'teal' }) {
  return <div className="progress-wrap">{label && <div className="progress-label"><span>{label}</span><strong>{value}%</strong></div>}<div className="progress-track"><span className={`progress-fill ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }}/></div></div>
}
