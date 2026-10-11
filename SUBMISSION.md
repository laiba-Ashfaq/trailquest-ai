# TrailQuest AI — DEV submission draft

Use this as the body of your DEV post. Required tags: `devchallenge`, `hf26challenge`.

Challenge: [Hacktoberfest Open-Source AI Challenge: Week 1](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)

---

## What I Built

**TrailQuest AI** is a local outdoor “micro-adventure” generator.

You pick how much time you have, what you feel like doing, your energy, and the kind of place you can reach. A **local open-weight model** (via Ollama) writes a short mission card. Then the app asks you to close the tab and go outside.

Most AI apps want another prompt. TrailQuest wants you to close the app.

## Demo

- GitHub: _add repo URL_
- Local run: `frontend` + `backend` + Ollama (see README)
- Video: _60–90s: generate → mission → “I’m going out” → actually go outside_
- Real-world test: _photo of completing one task_

## How I Built It

```text
User → React/Vite UI → FastAPI → Ollama → open-weight LLM → outdoor mission → CLOSE SCREEN
```

The model is not decoration. It is the thing that writes the experience. There is no OpenAI (or other closed AI) API in the stack.

Three screens only: configure, glance at the mission, leave.

## Why Open Innovation Matters

Closed chat products are tuned to keep you talking. An outdoor mission is the opposite: one useful answer, then you should not need the model at all.

Local open-weight inference makes that honest:

- the walk is not uploaded to a hosted assistant
- it still works after the model is downloaded, even with no signal
- you can swap Qwen, Gemma, or another Ollama instruct model without rewriting the app

Open innovation here is not “we used an open model because the challenge said so.” It is how we made AI that **gets out of the way**.

## Prize Categories

- Overall (open-source AI + Touch Grass)
- Best Use of Gemma — TrailQuest’s default local model is `gemma4:latest` via Ollama

## What I Learned / How it went outside

_After you take it outside: what the mission asked, what you noticed, whether you kept the phone in your pocket._
