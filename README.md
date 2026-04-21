# DeckForge 🎨

> **AI-powered presentation generator** — Transform ideas into polished PowerPoint decks in seconds using Google Gemini.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- 🤖 **AI Slide Generation** — Describe your topic and let Gemini build a full, structured slide deck
- ✏️ **Live Editing** — Edit slide titles and bullet points directly in the browser, changes sync to the backend
- 📄 **Document Upload** — Upload PDF or DOCX files to generate presentations from existing content
- 📥 **PPTX Export** — Download presentation as a fully formatted PowerPoint file
- 🔐 **User Authentication** — JWT-based register / login with secure password hashing
- 📊 **Dashboard** — View, manage, and delete all your previously generated presentations
- 🖼️ **Slide Preview** — Full slide-by-slide preview before downloading

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend** | FastAPI, Python 3.11, Uvicorn |
| **Database** | MongoDB (Atlas) via Motor (async driver) |
| **AI** | Google Gemini API (`google-generativeai`) |
| **Auth** | JWT (PyJWT), Passlib + Bcrypt |
| **PPTX** | python-pptx |
| **Container** | Docker, Docker Compose |

---

## 📁 Project Structure

```
DeskForge/
└── deckforge/
    ├── docker-compose.yml
    ├── .env.example               # ← copy to .env and fill values
    ├── backend/
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   ├── example.env            # backend-specific env reference
    │   └── app/
    │       ├── main.py            # FastAPI app entry point
    │       ├── core/
    │       │   ├── config.py      # Pydantic settings
    │       │   └── security.py    # JWT & password utilities
    │       ├── api/
    │       │   └── routes/
    │       │       ├── auth.py          # /auth — register, login
    │       │       ├── presentations.py # /presentations — CRUD + AI gen
    │       │       ├── upload.py        # /upload — file ingestion
    │       │       └── export.py        # /export — PPTX download
    │       ├── db/                # MongoDB connection
    │       ├── schemas/           # Pydantic request/response models
    │       └── services/          # AI generation & PPTX building logic
    └── frontend/
        ├── Dockerfile
        ├── package.json
        └── app/
            ├── page.tsx           # Landing page
            ├── pricing/           # Pricing page
            ├── auth/              # Login & Register pages
            └── (app)/
                ├── dashboard/     # Presentation management
                ├── create/        # New presentation form
                ├── preview/[id]/  # Slide preview + live edit
                └── settings/      # User settings
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+ & npm
- [Conda](https://docs.conda.io/) (recommended for backend env isolation)
- MongoDB Atlas account **or** a local MongoDB instance
- Google Gemini API key — [get one here](https://aistudio.google.com/app/apikey)

### 1 — Clone the Repository

```bash
git clone https://github.com/AshrayVB30/DeskForege.git
cd DeskForege/deckforge
```

### 2 — Configure Environment Variables

```bash
# Copy the example and fill in your values
cp .env.example .env
```

Open `.env` and set at minimum:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `SECRET_KEY` | A random string used to sign JWTs |
| `DATABASE_URL` | Full MongoDB connection URI |
| `NEXT_PUBLIC_API_URL` | Backend URL seen by the browser |

---

### 3a — Run with Docker (Recommended)

```bash
# From the deckforge/ directory
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

### 3b — Run Locally (Development)

#### Backend

```bash
cd backend

# Create and activate conda environment
conda create -n deckforge python=3.11 -y
conda activate deckforge

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp example.env .env
# Edit .env with your actual values

# Start the API server
uvicorn app.main:app --reload
# → Runs on http://127.0.0.1:8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# → Runs on http://localhost:3000
```

---

## 🔌 API Overview

All endpoints are documented interactively at `http://localhost:8000/docs`.

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Login and receive a JWT token |
| `GET` | `/presentations` | List all presentations for current user |
| `POST` | `/presentations` | Generate a new AI presentation |
| `GET` | `/presentations/{id}` | Retrieve a single presentation |
| `PATCH` | `/presentations/{id}` | Update slide content (live edit) |
| `DELETE` | `/presentations/{id}` | Delete a presentation |
| `POST` | `/upload` | Upload a PDF or DOCX for AI generation |
| `GET` | `/export/{id}` | Download the presentation as `.pptx` |

> **Authentication**: All `/presentations`, `/upload`, and `/export` endpoints require a Bearer token in the `Authorization` header.

---

## 🌐 Environment Variables Reference

### `deckforge/.env` (shared / Docker)

```env
# Backend
SECRET_KEY=your_random_secret_key_here
DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/
GEMINI_API_KEY=your_google_gemini_api_key_here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `deckforge/backend/.env` (local backend dev)

```env
SECRET_KEY=your_random_secret_key_here
DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🐳 Docker Notes

- The `docker-compose.yml` is in `deckforge/` — **run all Docker commands from that directory**.
- The `GEMINI_API_KEY` is passed from your host `.env` into the backend container via `${GEMINI_API_KEY}`.
- Make sure your `.env` is **never committed** to git (it is already in `.gitignore`).

---

## 🛠️ Development Tips

- **Hot reload** is enabled for both backend (`--reload`) and frontend (`next dev`).
- The backend reads settings from `backend/.env` via `pydantic-settings` when running locally.
- MongoDB collections are created automatically on first use.
- After editing slides in `/preview/[id]`, changes are persisted via the `PATCH /presentations/{id}` endpoint before PPTX export.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ashray VB**  
GitHub: [@AshrayVB30](https://github.com/AshrayVB30)