import React, { useState } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  UserRound,
  BookOpen,
  Compass,
  BriefcaseBusiness,
  LoaderCircle,
  AlertCircle
} from 'lucide-react'

import SectionTitle from '../components/SectionTitle'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const suggestions = [
  'I enjoy coding and mathematics. Which careers should I explore?',
  'I like designing creative things. What careers might suit my interests?',
  'What skills should I learn to become a software developer?'
]

const welcomeMessage = {
  role: 'assistant',
  text: "Hi! I'm your CareerCompass AI companion, powered by Gemma. Tell me about your interests, skills, or career goals, and I'll help you explore possibilities and practical next steps."
}

export default function Companion() {
  const [messages, setMessages] = useState([
    welcomeMessage
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function send(message = input) {
    const text = message.trim()

    if (!text || loading) return

    // Keep the previous conversation for contextual replies.
    const history = messages
  .slice(1)
  .filter(
    item =>
      ['user', 'assistant'].includes(item.role) &&
      typeof item.text === 'string'
  )
  .slice(-6)
  .map(item => ({
    role: item.role,
    content: item.text
  }));

    setMessages(previous => [
      ...previous,
      {
        role: 'user',
        text
      }
    ])

    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: text,history })
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'The AI request failed.'
        )
      }

      if (
        typeof result.answer !== 'string' ||
        !result.answer.trim()
      ) {
        throw new Error(
          'The AI service returned an empty response.'
        )
      }

      setMessages(previous => [
        ...previous,
        {
          role: 'assistant',
          text: result.answer,
          model: result.model
        }
      ])
    } catch (err) {
      console.error('CareerCompass chat error:', err)

      setError(
        err.message ||
          'Could not connect to CareerCompass AI. Check that your backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content companion-page">
      <SectionTitle
        eyebrow="THINK IT THROUGH"
        title="Your AI companion"
        description="Explore career possibilities and discover practical next steps with AI-powered guidance."
      />

      <div className="ai-demo-warning">
        <Sparkles size={18} />

        <p>
          <strong>AI-powered prototype:</strong>{' '}
          CareerCompass uses a hosted Gemma model to help
          you explore career options, skills, and learning
          activities. Suggestions are exploratory, not
          scientifically validated career-fit assessments.
          Verify important education and career decisions
          with reliable sources.
        </p>
      </div>

      <div className="chat-layout">
        <section className="chat-panel">
          <div className="chat-header">
            <div className="chat-avatar">
              <Bot size={21} />
            </div>

            <div>
              <strong>CareerCompass companion</strong>

              <span>
                <i />
                Gemma AI assistant
              </span>
            </div>
          </div>

          <div
            className="chat-messages"
            aria-live="polite"
            aria-busy={loading}
          >
            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={index}
              >
                <span className="chat-message-avatar">
                  {message.role === 'assistant'
                    ? <Bot size={16} />
                    : <UserRound size={16} />}
                </span>

                <div className="chat-bubble">
                  {message.text
                    .split('\n')
                    .map((line, lineIndex, lines) => (
                      <React.Fragment key={lineIndex}>
                        {line}

                        {lineIndex < lines.length - 1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <span className="chat-message-avatar">
                  <Bot size={16} />
                </span>

                <div className="chat-bubble">
                  <LoaderCircle
                    size={16}
                    className="loading-icon"
                  />
                  {' '}Gemma is thinking...
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="form-error">
              <AlertCircle size={16} />

              <span>{error}</span>
            </div>
          )}

          <div className="chat-suggestions">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="chat-input-row"
            onSubmit={event => {
              event.preventDefault()
              send()
            }}
          >
            <input
              value={input}
              onChange={event =>
                setInput(event.target.value)
              }
              placeholder="Tell me about your interests or skills..."
              aria-label="Message your companion"
              disabled={loading}
            />

            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              {loading
                ? (
                  <LoaderCircle
                    size={17}
                    className="loading-icon"
                  />
                )
                : <Send size={17} />}
            </button>
          </form>

          <p className="chat-footnote">
            Avoid sharing passwords, sensitive personal
            information, or private documents.
          </p>
        </section>

        <aside className="chat-side">
          <div className="panel">
            <span className="panel-icon">
              <Compass size={19} />
            </span>

            <h3>Explore first</h3>

            <p>
              Discover your interests before narrowing
              your options.
            </p>

            <a className="inline-link" href="/discover">
              Interest discovery →
            </a>
          </div>

          <div className="panel">
            <span className="panel-icon panel-icon-violet">
              <BriefcaseBusiness size={19} />
            </span>

            <h3>Compare possibilities</h3>

            <p>
              Explore different careers, their skills,
              and their possible pathways.
            </p>

            <a className="inline-link" href="/careers">
              Career explorer →
            </a>
          </div>

          <div className="panel">
            <span className="panel-icon panel-icon-amber">
              <BookOpen size={19} />
            </span>

            <h3>Make it actionable</h3>

            <p>
              Turn exploration into a small activity
              or learning goal.
            </p>

            <a className="inline-link" href="/next-steps">
              What's next? →
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}