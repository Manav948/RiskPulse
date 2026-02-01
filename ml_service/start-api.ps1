# RiskPulse ML Service Startup Script (Windows)
# Run from the project root: .\ml_service\start-api.ps1

$env:PYTHONPATH = "$(Split-Path -Parent (Get-Item $PSCommandPath).FullName)"

Write-Host "Starting RiskPulse ML Service..." -ForegroundColor Green
Write-Host "API will be available at: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Docs at: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host ""

& D:\riskpulse\.venv\Scripts\uvicorn.exe ml_service.main:app --host 0.0.0.0 --port 8000
