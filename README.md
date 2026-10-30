# CareerCompass AI

CareerCompass AI is a student career exploration and learning-planning app. It combines a React/Vite frontend, an Express API, SQLite account storage, and a hosted Gemma model.

## Features

- Signup, login, logout, and database-backed student profiles. Signup requires current class/study year, favorite subject, and course/stream.
- Passwords are hashed with bcrypt. Sessions use HttpOnly, SameSite cookies and server-side expiration.
- The AI Career Companion is the default page after sign-in. It supports saved conversations, student profiles, validated app context, retry, copy, Markdown, and bounded history.
- Student data is isolated by account. Existing browser-only progress is copied into the first account that signs in on that browser; original legacy keys are preserved.
- Career explorer across government service, defence, finance, healthcare, law, engineering, education, media, skilled trades, private business, and self-employment. Career suggestions are ranked from the student's class, favorite subject, course, and other profile details.
- Opportunity Radar ranks official Indian recruitment, internship, and scholarship portals using the student's study profile and links to each source. Portal listings update at the source; always check current availability and eligibility there.
- Responsive navigation: desktop sidebar expands from the Dashboard icon on hover or keyboard focus; mobile uses an overlay menu.

## Requirements

- Node.js 24 LTS or later for the backend
- npm
- A Google AI Studio API key for Gemma-powered chat and generation features

## Setup

### 1. Install frontend dependencies

From the project root:

```bash
npm install
```

### 2. Configure and install the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env`. Set `GEMINI_API_KEY` for AI features. Authentication and SQLite do not require an external database service.

```dotenv
PORT=5000
GEMINI_API_KEY=your_private_key
GEMMA_MODEL=gemma-4-26b-a4b-it
DATABASE_PATH=./data/careercompass.sqlite
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

`PORT`, `GEMMA_MODEL`, `DATABASE_PATH`, and `CLIENT_ORIGINS` are configurable. The default SQLite file is `server/data/careercompass.sqlite` and is git-ignored. For deployment, use persistent disk storage, HTTPS, and set `CLIENT_ORIGINS` to the exact frontend origin(s). Never place secrets in Vite variables or commit `.env` files.

### 3. Run the backend

From `server`:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Run the frontend

Open another terminal at the project root:

```bash
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`. Signed-in users land on the AI Companion. `/welcome` remains the public information page; `/login` and `/signup` provide account access.

If the backend uses another host, set `VITE_API_URL` in a root `.env` file. The root `.env.example` shows the local default. Frontend environment variables are public and must not contain secrets.

## Account and data handling

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PATCH /api/auth/profile`, and `POST /api/auth/logout` manage accounts and sessions.
- AI chat, study-plan generation, and quiz generation require a signed-in session. Career reference endpoints remain available without a session.
- Email and student profile fields (including current class, favorite subject, and course) are stored in SQLite. Passwords are stored as bcrypt hashes. Session tokens are random, stored hashed in SQLite, and sent to the browser only in an HttpOnly cookie.
- Existing prototype progress and conversation data are migrated to the first account used on a browser and then stored under that account’s localStorage namespace. Other accounts use separate namespaces.
- Chat requests send the current message, recent conversation context, saved-career / discovery / study-plan / quiz / roadmap summaries, and the saved student profile to the configured AI provider.
- There is no email verification, password reset, account deletion, multi-device progress sync, or cloud database service in this prototype. Back up the SQLite database file if account records must be retained.

## Main API routes

- `GET /api/health`
- `GET /api/careers`
- `GET /api/careers/:id`
- `POST /api/careers/recommend`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/profile`
- `POST /api/auth/logout`
- `POST /api/chat`
- `POST /api/study-plan`
- `POST /api/quiz/generate`

The chat endpoint validates messages and context, keeps at most 12 recent history messages / 12,000 history characters, limits messages to 5,000 characters, times out at 45 seconds, and applies a per-IP request limit.

## Prototype limitations

- Career recommendations are based on keyword overlap, not a scientifically validated assessment.
- Study plans and quizzes are learning aids; review generated details.
- Opportunity cards contain demonstration/sample data, not verified live listings.
- SQLite stores account details locally on the backend host; it is not encrypted at rest by this application.
- Do not deploy over plain HTTP. Production authentication requires HTTPS and a persistent database volume.

## License

MIT. See `LICENSE`.
