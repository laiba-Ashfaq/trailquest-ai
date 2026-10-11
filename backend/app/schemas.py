from typing import Literal

from pydantic import BaseModel, Field

TimeChoice = Literal["30 min", "60 min", "2 hours"]
ActivityChoice = Literal["walking", "photography", "nature observation", "hiking"]
EnergyChoice = Literal["low", "medium", "high"]
EnvironmentChoice = Literal["park", "mountains", "garden", "neighborhood", "anywhere"]
Difficulty = Literal["easy", "moderate", "adventurous"]


class MissionRequest(BaseModel):
    time: TimeChoice
    activity: ActivityChoice
    energy: EnergyChoice
    environment: EnvironmentChoice
    surprise: bool = False


class Mission(BaseModel):
    title: str
    estimated_duration: str
    difficulty: Difficulty
    activities: list[str] = Field(min_length=3, max_length=5)
    observation_challenge: str
    photo_challenge: str
    phone_rule: str
    safety_reminder: str
    closing_nudge: str = "Close this tab. Go outside. Come back when you're done."


class MissionResponse(BaseModel):
    mission: Mission
    model: str
    source: Literal["ollama"] = "ollama"


class HealthResponse(BaseModel):
    ok: bool
    ollama: bool
    model: str
    available_models: list[str] = []
    message: str
