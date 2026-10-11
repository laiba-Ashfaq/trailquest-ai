from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .ollama_client import OllamaError, generate_json, list_models, ping
from .prompts import SYSTEM_PROMPT, user_prompt
from .schemas import HealthResponse, Mission, MissionRequest, MissionResponse

app = FastAPI(
    title="TrailQuest AI",
    description="Local open-weight outdoor mission generator. No closed AI APIs.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    models = await list_models()
    ollama_up = await ping()
    configured = settings.ollama_model
    installed = any(
        name == configured or name.startswith(f"{configured}:") for name in models
    )
    if not ollama_up:
        message = "Ollama is offline. Start it with `ollama serve`."
    elif not installed and models:
        message = (
            f"Ollama is up, but '{configured}' is not installed. "
            f"Run: ollama pull {configured}"
        )
    elif not models:
        message = "Ollama responded, but no models are installed yet."
    else:
        message = f"Ready. Using local model {configured}."
    return HealthResponse(
        ok=ollama_up and installed,
        ollama=ollama_up,
        model=configured,
        available_models=models,
        message=message,
    )


@app.post("/api/mission", response_model=MissionResponse)
async def create_mission(payload: MissionRequest) -> MissionResponse:
    prompt = user_prompt(
        time=payload.time,
        activity=payload.activity,
        energy=payload.energy,
        environment=payload.environment,
        surprise=payload.surprise,
    )
    try:
        raw = await generate_json(SYSTEM_PROMPT, prompt)
        mission = Mission.model_validate(_normalize(raw, payload.time))
    except OllamaError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not parse a mission from the local model: {exc}",
        ) from exc

    return MissionResponse(mission=mission, model=settings.ollama_model, source="ollama")


def _normalize(raw: dict, time: str) -> dict:
    data = dict(raw)
    activities = data.get("activities") or []
    if isinstance(activities, str):
        activities = [line.strip(" -") for line in activities.split("\n") if line.strip()]
    activities = [str(item).strip() for item in activities if str(item).strip()]
    if len(activities) < 3:
        raise ValueError("Need at least 3 activities")
    data["activities"] = activities[:5]

    duration = str(data.get("estimated_duration") or time)
    data["estimated_duration"] = duration

    difficulty = str(data.get("difficulty", "easy")).lower()
    if difficulty not in {"easy", "moderate", "adventurous"}:
        difficulty = "easy"
    data["difficulty"] = difficulty

    for key in (
        "title",
        "observation_challenge",
        "photo_challenge",
        "phone_rule",
        "safety_reminder",
        "closing_nudge",
    ):
        data[key] = str(data.get(key) or "").strip()
    if not data["title"]:
        data["title"] = "Outdoor Mission"
    if not data["closing_nudge"]:
        data["closing_nudge"] = "Close this tab. Go outside. Come back when you're done."
    return data
