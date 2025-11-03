Write-Host "Starting HealthMate API Server..." -ForegroundColor Green
Write-Host ""

Set-Location api

if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found in api folder!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create api\.env with:" -ForegroundColor Yellow
    Write-Host "MONGODB_URI=your-mongodb-connection-string"
    Write-Host "JWT_SECRET=your-secret-key"
    Write-Host ""
    pause
    exit 1
}

Write-Host "Starting server on http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

node server.js
