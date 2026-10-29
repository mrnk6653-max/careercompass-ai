# CareerCompass AI

CareerCompass AI is an open-source student career exploration and learning-planning prototype. It combines a React/Vite frontend, an Express API, a hosted Gemma model, and browser-local progress storage.

## Features

- Career explorer with searchable career profiles and saved careers.
- Interest discovery activities and interest-map exploration.
- AI Career Companion powered by a hosted Gemma model.
- Career recommendations based on keyword overlap (exploratory, not a validated assessment).
- AI Study Plan Generator: goal, current skills, weekly hours, and 1–4 week plan.
- Add study-plan tasks to the existing roadmap and track completion.
- Practice Quiz generator with multiple-choice questions, scoring, and explanations.
- Saved careers, opportunity demonstration cards, and local progress dashboard.
- Responsive layout for desktop and mobile.
- Fallback starter plans and quizzes if the AI model cannot return structured output.

## Tech stack

- React 18, Vite, React Router, Lucide React
- Node.js and Express
- Google GenAI SDK with a hosted Gemma model
- `localStorage` for prototype progress and preferences

> **Model hosting:** The app calls a Google-hosted Gemma model using a backend API key. It does not run the model locally. API availability, quotas, and pricing depend on the provider and account.

## Requirements

- Node.js 18+ (Node.js 20 LTS recommended)
- npm
- A Google AI Studio API key for Gemma-powered features (optional; fallback plan/quiz templates are returned if no key is configured)

## Setup

### 1. Install frontend dependencies

From the project root:

```bash
npm install
```

### 2. Configure the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env`, then set your private API key:

```dotenv
PORT=5000
GEMINI_API_KEY=your_private_key
GEMMA_MODEL=gemma-4-26b-a4b-it
```

Never commit `.env` or expose the key in frontend code.

### 3. Run the backend

From the `server` directory:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### 4. Run the frontend

Open a second terminal at the project root:

```bash
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`.

The root `.env.example` documents the local frontend API URL. If the backend is hosted elsewhere, create a root `.env` file with `VITE_API_URL=https://your-backend.example` before building. Do not put secret keys in Vite variables; frontend variables are public.

## Main API routes

- `GET /api/health`
- `GET /api/careers`
- `GET /api/careers/:id`
- `POST /api/careers/recommend`
- `POST /api/chat`
- `POST /api/study-plan`
- `POST /api/quiz/generate`

## Testing checklist

1. Open Career Explorer and save a career.
2. Open AI Companion and send a message.
3. Open AI Study Plan, enter a goal and current skills, and generate a plan.
4. Add the plan tasks to My Roadmap and mark one task complete.
5. Open Practice Quiz, generate a quiz, answer every question, and submit.
6. Refresh the browser and confirm saved careers and roadmap progress persist locally.
7. Check `/api/health` to verify backend status and whether the AI key is configured.

## Prototype limitations

- Career recommendations are based on keyword overlap, not a scientifically validated career-fit assessment.
- Study plans and quizzes are AI-generated or fallback templates; check important details and treat results as learning aids, not formal assessments.
- Opportunity cards contain demonstration/sample data. They are not verified live listings and should not be treated as real deadlines or eligibility advice.
- Student progress and preferences are stored in browser `localStorage`. There is no authentication, server-side database, or cross-device sync.
- The app does not provide parental/teacher accounts or verified plan approval workflows yet.

## License

MIT. See `LICENSE`.
