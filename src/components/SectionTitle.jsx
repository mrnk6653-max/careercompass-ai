import React from 'react'
export default function SectionTitle({ eyebrow, title, description, action }) {
  return <div className="section-title"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <div className="section-title-action">{action}</div>}</div>
}
