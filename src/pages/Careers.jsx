import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  GraduationCap,
  FlaskConical,
  Users,
  LoaderCircle,
  AlertCircle
} from 'lucide-react'

import SectionTitle from '../components/SectionTitle'
import CareerCard from '../components/CareerCard'
import { fetchCareers } from '../services/careersApi'

export default function Careers({
  careers: initialCareers = [],
  profile = {},
  savedCareers = [],
  toggleSavedCareer = () => {}
}) {
  const [careers, setCareers] = useState(initialCareers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All careers')
  const [selected, setSelected] = useState(null)

  // Fetch career information from the Express backend.
  useEffect(() => {
    let active = true

    async function loadCareers() {
      try {
        setLoading(true)
        setError('')

        const data = await fetchCareers()

        if (active) {
          setCareers(data)
        }
      } catch (err) {
        if (active) {
          setError(
            'Unable to load careers from the server. Please check that your backend is running.'
          )
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
  }, [])

  // Support both the API field "skills" and the frontend field "tags".
  const getSkills = career => career.skills || career.tags || []
  const getInterests = career => career.interests || []
  const getActivities = career => career.activities || []
  const getEducation = career => career.education || []
  const getWorkStyles = career => career.workStyles || []

  // Build category options from the career data.
  const categories = useMemo(
    () => [
      'All careers',
      ...new Set(careers.map(career => career.category).filter(Boolean))
    ],
    [careers]
  )

  // Search careers by title, category, description, skills, and interests.
  const filtered = useMemo(() => {
    const searchText = query.trim().toLowerCase()
    const profileTerms = [profile.favoriteSubject, profile.course, profile.degree, profile.interests, profile.currentClass]
      .filter(Boolean).join(' ').toLowerCase().split(/[^a-z0-9+#]+/).filter(term => term.length > 2 && !['class', 'year', 'course', 'and', 'the'].includes(term))

    return careers.map(career => {
      const matchesCategory =
        category === 'All careers' || career.category === category

      const searchableText = [
        career.title,
        career.category,
        career.description,
        ...getSkills(career),
        ...getInterests(career),
        ...getActivities(career)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const profileScore = profileTerms.reduce((score, term) => score + (searchableText.includes(term) ? (career.title.toLowerCase().includes(term) || career.category.toLowerCase().includes(term) ? 3 : 1) : 0), 0)
      return { ...career, profileScore, matchesCategory, searchableText }
    }).filter(career => career.matchesCategory && career.searchableText.includes(searchText))
      .sort((a, b) => (b.profileScore || 0) - (a.profileScore || 0))
  }, [careers, category, query, profile])

  const isSaved = careerId =>
    savedCareers.some(id => String(id) === String(careerId))

  return (
    <div className="page-content">
      <SectionTitle
        eyebrow="EXPLORE POSSIBILITIES"
        title="Careers to be curious about."
        description="Explore government, private-sector, healthcare, skilled-trade, creative, and self-employment paths. Your study details bring the closest matches to the top."
      />

      {profile.favoriteSubject || profile.course ? <div className="profile-match-note"><Lightbulb size={16}/><span>Personalized using <strong>{[profile.currentClass, profile.favoriteSubject, profile.course].filter(Boolean).join(' · ')}</strong>. Matches are starting points, not a career test.</span></div> : null}

      {/* Search and category filters */}
      <div className="career-toolbar">
        <div className="search-field">
          <Search size={17} />

          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search careers, skills, or interests..."
            aria-label="Search careers"
          />
        </div>

        <div className="filter-field">
          <SlidersHorizontal size={16} />

          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            aria-label="Filter by career category"
          >
            {categories.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-line">
        <span>{filtered.length} careers to explore</span>
        <span>Start with curiosity, not certainty.</span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="empty-state">
          <LoaderCircle size={28} className="loading-icon" />
          <h3>Loading careers...</h3>
          <p>Getting career information from the backend.</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="empty-state">
          <AlertCircle size={28} />
          <h3>Couldn't load careers</h3>
          <p>{error}</p>

          <button
            className="button button-secondary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      )}

      {/* Career cards */}
      {!loading && !error && filtered.length > 0 && (
        <div className="career-grid">
          {filtered.map(career => (
            <CareerCard
              key={career.id}
              career={career}
              saved={isSaved(career.id)}
              profileScore={career.profileScore}
              onSave={toggleSavedCareer}
              onOpen={setSelected}
            />
          ))}
        </div>
      )}

      {/* No matching careers */}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <Search size={26} />
          <h3>No careers found</h3>
          <p>Try another search term or choose a different category.</p>

          <button
            className="button button-secondary"
            onClick={() => {
              setQuery('')
              setCategory('All careers')
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Career details modal */}
      {selected && (
        <div
          className="modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <section
            className="career-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-modal-title"
            onClick={event => event.stopPropagation()}
          >
            <button
              className="icon-button modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close career details"
            >
              <X size={19} />
            </button>

            <div className="career-modal-icon">
              <BriefcaseBusiness size={24} />
            </div>

            <span className="career-category">
              {selected.category || 'Career'}
            </span>

            <h2 id="career-modal-title">{selected.title}</h2>

            <p className="modal-lead">
              {selected.description ||
                'Explore this career to learn about its skills, activities, and possible pathways.'}
            </p>

            {/* Interests */}
            <div className="modal-section">
              <h3>
                <Lightbulb size={17} />
                Why explore this career?
              </h3>

              {getInterests(selected).length > 0 ? (
                <>
                  <p>
                    These interest areas may connect with this career:
                  </p>

                  <div className="tag-row">
                    {getInterests(selected).map(interest => (
                      <span className="tag" key={interest}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p>
                  Explore the everyday tasks to see whether this career
                  interests you.
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="modal-section">
              <h3>
                <CheckCircle2 size={17} />
                Skills to explore
              </h3>

              {getSkills(selected).length > 0 ? (
                <div className="tag-row">
                  {getSkills(selected).map(skill => (
                    <span className="tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Skills for this career are not available yet.</p>
              )}
            </div>

            {/* Education */}
            <div className="modal-section">
              <h3>
                <GraduationCap size={17} />
                Possible education pathways
              </h3>

              {getEducation(selected).length > 0 ? (
                <ul className="career-detail-list">
                  {getEducation(selected).map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Research relevant courses and check official entry
                  requirements for your location.
                </p>
              )}
            </div>

            {/* Practical activities */}
            <div className="modal-section">
              <h3>
                <FlaskConical size={17} />
                Practical activities to try
              </h3>

              {getActivities(selected).length > 0 ? (
                <ul className="career-detail-list">
                  {getActivities(selected).map((activity, index) => (
                    <li key={`${activity}-${index}`}>{activity}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Try a small project or beginner exercise related to
                  this career.
                </p>
              )}
            </div>

            {/* Work styles */}
            <div className="modal-section">
              <h3>
                <Users size={17} />
                Example work styles
              </h3>

              {getWorkStyles(selected).length > 0 ? (
                <div className="tag-row">
                  {getWorkStyles(selected).map(style => (
                    <span className="tag" key={style}>
                      {style}
                    </span>
                  ))}
                </div>
              ) : (
                <p>
                  Work environments vary by role and employer.
                </p>
              )}
            </div>

            {/* Pathway */}
            {selected.pathway && (
              <div className="modal-section">
                <h3>
                  <BookOpen size={17} />
                  Possible starting pathway
                </h3>

                <p>{selected.pathway}</p>
              </div>
            )}

            <p className="muted-small">
              Career information is introductory guidance, not a
              guaranteed career-fit assessment or an official list of
              education requirements. Verify course and qualification
              requirements with reliable institutions and sources.
            </p>

            <div className="modal-actions">
              <button
                className={`button ${
                  isSaved(selected.id)
                    ? 'button-secondary'
                    : 'button-primary'
                }`}
                onClick={() => toggleSavedCareer(selected.id)}
              >
                <Bookmark
                  size={16}
                  fill={isSaved(selected.id) ? 'currentColor' : 'none'}
                />

                {isSaved(selected.id) ? 'Saved career' : 'Save career'}
              </button>

              <button
                className="button button-secondary"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      <div className="notice-box">
        <span aria-hidden="true">ⓘ</span>
        <p>
          Career descriptions and activities are introductory examples.
          CareerCompass AI helps students explore possibilities; it does
          not guarantee career outcomes.
        </p>
      </div>
    </div>
  )
}
