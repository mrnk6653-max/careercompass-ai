import React from 'react'
import { ArrowUpRight, Bookmark, BriefcaseBusiness } from 'lucide-react'

export default function CareerCard({ career, saved, onSave, onOpen }) {
  // Support both the original demo data and backend API data
  const tags = career.tags || career.skills || []

  return (
    <article className="career-card">
      <div className="career-card-top">
        <div className="career-icon">
          <BriefcaseBusiness size={20} />
        </div>

        <button
          className={`icon-button save-button ${saved ? 'saved' : ''}`}
          onClick={() => onSave(career.id)}
          aria-label={saved ? 'Unsave career' : 'Save career'}
        >
          <Bookmark
            size={17}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      <span className="career-category">{career.category}</span>

      <h3>{career.title}</h3>

      <p>
        {career.description ||
          'Explore this career, discover its skills, and learn how to get started.'}
      </p>

      <div className="tag-row">
        {tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <button className="card-link" onClick={() => onOpen(career)}>
        <span>Explore career</span>
        <ArrowUpRight size={16} />
      </button>
    </article>
  )
}