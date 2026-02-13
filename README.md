# Meeting Action Items Tracker

A MERN-stack productivity tool that extracts, manages, and tracks action items from meeting transcripts using Google Gemini.

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐     ┌────────────┐
│   React + Vite      │────▶│  Express API         │────▶│  MongoDB   │
│   (Port 5173)       │     │  (Port 5000)         │     │            │
└─────────────────────┘     └────────┬────────────┘     └────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  Google Gemini   │
                            │  (LLM)          │
                            └─────────────────┘
```

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React 19, Vite, React Router, Axios     |
| Backend   | Node.js, Express, Mongoose              |
| Database  | MongoDB                                 |
| LLM       | Google Gemini (`gemini-2.0-flash`)       |
| Styling   | Vanilla CSS (custom design system)      |
| DevOps    | Docker, Docker Compose                  |

## Features

- **Transcript Processing** — Paste a meeting transcript and extract structured action items via Gemini
- **Action Item Management** — Inline edit, add, delete, toggle done/open, assign owners and due dates
- **Tags** — Categorize items (tech, finance, urgent, etc.)
- **Filters & Sorting** — Filter by status (All / Open / Done), sort by created date or due date
- **History** — View last 5 processed transcripts, click to reload
- **System Status** — Health check page showing backend, database, and LLM status
- **Input Validation** — Min 20 / max 10,000 chars, informative error messages
- **Responsive** — Works on desktop and mobile

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key (free at [Google AI Studio](https://aistudio.google.com/apikey))

### Local Development

```bash
# 1. Clone and install
git clone <repo-url>
cd argoos
npm run install:all

# 2. Create .env in root
cp .env.example .env
# Fill in your GEMINI_API_KEY and MONGODB_URI

# 3. Start both servers
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

### Docker

```bash
# Set your Gemini key
export GEMINI_API_KEY=your_key_here

# Start everything
docker compose up --build
```

App is available at `http://localhost`.

## Environment Variables

| Variable        | Required | Default                                    | Description              |
| --------------- | -------- | ------------------------------------------ | ------------------------ |
| `PORT`          | No       | `5000`                                     | Backend port             |
| `MONGODB_URI`   | Yes      | `mongodb://localhost:27017/action-tracker`  | MongoDB connection URI   |
| `GEMINI_API_KEY` | Yes     | —                                          | Google Gemini API key    |
| `NODE_ENV`      | No       | `development`                              | Environment mode         |
| `CLIENT_ORIGIN` | No       | `http://localhost:5173`                     | CORS allowed origin      |

## API Endpoints

| Method   | Endpoint                       | Description                     |
| -------- | ------------------------------ | ------------------------------- |
| `POST`   | `/api/transcripts/process`     | Process transcript via LLM      |
| `GET`    | `/api/transcripts/history`     | Get last 5 transcripts          |
| `GET`    | `/api/transcripts/:id`         | Get transcript with items       |
| `PATCH`  | `/api/action-items/:id`        | Update an action item           |
| `DELETE` | `/api/action-items/:id`        | Delete an action item           |
| `GET`    | `/api/status`                  | System health check             |

## Project Structure

```
argoos/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API communication layer
│   │   └── index.css       # Design system
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # DB connection, env config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Error handler, validation
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   └── services/       # Business logic, LLM integration
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Known Limitations

- Manually added action items are local-only (not persisted to DB without a transcript)
- History limited to last 5 transcripts by design
- No user authentication — designed as a single-user internal tool
- LLM extraction quality depends on transcript clarity
- Gemini free tier has rate limits (~15 requests/minute)

## Hosting

**Recommended deployment:**

| Component | Platform          |
| --------- | ----------------- |
| Frontend  | Vercel / Netlify  |
| Backend   | Render / Railway  |
| Database  | MongoDB Atlas     |

For hosted deployment, update `VITE_API_URL` in the client build to point to the deployed backend URL, and set `CLIENT_ORIGIN` on the backend to the frontend domain.
