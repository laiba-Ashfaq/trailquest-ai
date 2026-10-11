# TrailQuest AI local start helper (Windows)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Ollama if needed..."
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden -ErrorAction SilentlyContinue

if (-not (Test-Path "$root\backend\.venv")) {
  python -m venv "$root\backend\.venv"
}
& "$root\backend\.venv\Scripts\python.exe" -m pip install -r "$root\backend\requirements.txt"
if (-not (Test-Path "$root\frontend\node_modules")) {
  npm --prefix "$root\frontend" install
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\backend`"; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\frontend`"; npm run dev"

Write-Host "Backend: http://127.0.0.1:8000"
Write-Host "Frontend: http://127.0.0.1:5173"
