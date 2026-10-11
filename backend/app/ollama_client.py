import json
import re
from typing import Any

import httpx

from .config import settings

JSON_FENCE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.DOTALL)
BRACE_OBJECT = re.compile(r"\{.*\}", re.DOTALL)


class OllamaError(RuntimeError):
    pass


async def list_models() -> list[str]:
    url = f"{settings.ollama_base_url.rstrip('/')}/api/tags"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            return [m.get("name", "") for m in data.get("models", []) if m.get("name")]
    except httpx.HTTPError:
        return []


async def ping() -> bool:
    models = await list_models()
    return True if models or await _is_up() else False


async def _is_up() -> bool:
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            response = await client.get(f"{settings.ollama_base_url.rstrip('/')}/api/tags")
            return response.status_code < 500
    except httpx.HTTPError:
        return False


def extract_json(text: str) -> dict[str, Any]:
    text = text.strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    fenced = JSON_FENCE.search(text)
    if fenced:
        return json.loads(fenced.group(1))

    braces = BRACE_OBJECT.search(text)
    if braces:
        return json.loads(braces.group(0))

    raise OllamaError("The local model did not return usable JSON.")


async def generate_json(system: str, user: str) -> dict[str, Any]:
    url = f"{settings.ollama_base_url.rstrip('/')}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "format": "json",
        "think": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 700,
        },
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(10.0, read=600.0)) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 404:
                raise OllamaError(
                    f"Model '{settings.ollama_model}' is not installed. "
                    f"Run: ollama pull {settings.ollama_model}"
                )
            if response.status_code >= 400:
                raise OllamaError(
                    f"Ollama returned {response.status_code}: {response.text[:400]}"
                )
            body = response.json()
    except OllamaError:
        raise
    except httpx.ConnectError as exc:
        raise OllamaError(
            "Ollama is not running. Start it with `ollama serve`, then try again."
        ) from exc
    except httpx.HTTPError as exc:
        raise OllamaError(f"Ollama request failed: {exc}") from exc

    content = (body.get("message") or {}).get("content") or body.get("response") or ""
    if not content:
        raise OllamaError("The local model returned an empty response.")
    return extract_json(content)
