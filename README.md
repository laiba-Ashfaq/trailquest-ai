# TrailQuest AI 🌿

**An AI app that deliberately ends the conversation.** A local open-weight model writes you a short outdoor mission. Then the app tells you to close the screen and go outside.

Built for the [Hacktoberfest Open-Source AI Challenge, Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05).

## How it works

1. Choose your **time** (30 min, 60 min, 2 hours), **activity**, **energy**, and **environment**, or tap **Surprise me**.
2. A local Gemma model, running through Ollama, writes a mission: a title, 3-5 simple tasks, an observation challenge, an optional photo idea, a phone rule, and a safety reminder.
3. Tap **I'm going out**. The app saves your mission and tells you to close the tab.
4. When you return, a **check-in screen** lets you tick off what you did, add a note and an optional photo, and shows how long you were out. It ends with a "Mission complete" card you can screenshot.

The screen is used for about a minute before and after. The outing itself needs none.

## Why open-weight, local AI?

- **Private.** Your mission settings, notes, and photos never leave your machine.
- **No API key, no cost.** Nothing is sent to a paid or closed service.
- **Swappable.** Change the model with one environment variable.
- **Offline-capable.** After setup, the app and model run without internet. The only exception is the Google Fonts stylesheet, which falls back to system fonts when offline.

## Architecture

```text
Browser (React + Vite)  ->  FastAPI backend  ->  Ollama  ->  Gemma (open-weight)
        |                                                          |
  localStorage (saved mission, check-in)              mission as structured JSON
```

- **Frontend:** React + Vite (`frontend/`)
- **Backend:** Python + FastAPI (`backend/`)
- **Model:** `gemma4:latest` through [Ollama](https://ollama.com) by default

## Requirements

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com)
- Enough free RAM for your model. `gemma4:latest` is about 6.6 GB. On a smaller machine, use `gemma3:4b` or `gemma3:1b`.

## Quick start

**1. Get the model**
```bash
ollama pull gemma4
ollama serve        # skip if the Ollama app is already running
```

**2. Start the backend** (terminal 1)
```bash
cd backend
python -m venv .venv
# Windows:      .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**3. Start the frontend** (terminal 2)
```bash
cd frontend
npm install
npm run dev
```

**4. Open** http://127.0.0.1:5173

The status line on the home screen should say "Ready. Using local model ...". The first mission is slow because the model has to load into memory. After that it's faster.

## Use a different model

Set `OLLAMA_MODEL` before starting the backend.

```powershell
# Windows PowerShell
$env:OLLAMA_MODEL="gemma3:4b"
```
```bash
# macOS/Linux
export OLLAMA_MODEL=gemma3:4b
```

Any instruction-following model that Ollama supports can work.

## API

- `GET /api/health` reports whether Ollama is reachable and the model is installed.
- `POST /api/mission` generates a mission. See `backend/sample_request.json` for an example request.

## Privacy

The saved mission and your check-in note are kept in your browser's `localStorage`. Photos are only previewed in the page and are never uploaded or stored. Nothing is sent to any server except your own local backend.

## Limitations

- Mission quality depends on the model you run. Small models write simpler missions.
- The first mission after starting Ollama is slow, especially on CPU-only machines.
- Photos are not saved between sessions, so screenshot the completion card if you want to keep it.

## License

See [LICENSE](LICENSE).
