import React, { useEffect, useState } from 'react'
import { Bookmark, BriefcaseBusiness, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle'
import CareerCard from '../components/CareerCard'
import OpportunityCard from '../components/OpportunityCard'
import { fetchCareers } from '../services/careersApi'

export default function Saved({
  careers: initialCareers = [],
  opportunities = [],
  savedCareers = [],
  savedOpportunities = [],
  toggleSavedCareer,
  toggleSavedOpportunity,
}) {
  const [careers, setCareers] = useState(initialCareers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadCareers() {
      try {
        const data = await fetchCareers()

        if (active) {
          setCareers(data)
          setError('')
        }
      } catch (err) {
        if (active) {
          setError('Could not load careers from the server. Showing available sample data.')
          setCareers(initialCareers)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadCareers()

    return () => {
      active = false
    }
  }, [initialCareers])

  const cs = careers.filter(c =>
    savedCareers.some(id => String(id) === String(c.id))
  )

  const os = opportunities.filter(o =>
    savedOpportunities.some(id => String(id) === String(o.id))
  )

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="YOUR SHORTLIST"
        title="Saved items"
        description="Keep the careers and opportunities you want to revisit in one place."
      />

      <section className="content-section">
        <div className="saved-section-title">
          <span className="panel-icon">
            <BriefcaseBusiness size={18} />
          </span>
          <div>
            <h2>Saved careers</h2>
            <p>{cs.length} saved</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state compact-empty">
            <p>Loading saved careers...</p>
          </div>
        ) : error ? (
          <div className="notice-box">
            <p>{error}</p>
          </div>
        ) : null}

        {!loading && cs.length > 0 && (
          <div className="career-grid">
            {cs.map(c => (
              <CareerCard
                key={c.id}
                career={c}
                saved
                onSave={toggleSavedCareer}
                onOpen={() => {
                  window.location.href = '/careers'
                }}
              />
            ))}
          </div>
        )}

        {!loading && cs.length === 0 && (
          <div className="empty-state compact-empty">
            <Bookmark size={24} />
            <h3>No saved careers yet</h3>
            <p>Save a career to build your shortlist and revisit it later.</p>
            <Link to="/careers" className="button button-secondary">
              Explore careers <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      <section className="content-section">
        <div className="saved-section-title">
          <span className="panel-icon panel-icon-amber">
            <Sparkles size={18} />
          </span>
          <div>
            <h2>Saved opportunities</h2>
            <p>{os.length} saved · sample records only</p>
          </div>
        </div>

        {os.length > 0 ? (
          <div className="opportunity-grid">
            {os.map(o => (
              <OpportunityCard
                key={o.id}
                item={o}
                saved
                onSave={toggleSavedOpportunity}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state compact-empty">
            <Bookmark size={24} />
            <h3>No saved opportunities yet</h3>
            <p>
              Save a listing to keep it in your shortlist. Current listings
              are demonstration data only.
            </p>
            <Link to="/opportunities" className="button button-secondary">
              Open Opportunity Radar <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}