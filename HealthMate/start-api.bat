@echo off
echo Starting HealthMate API Server...
echo.
cd api
if not exist .env (
    echo ERROR: .env file not found in api folder!
    echo.
    echo Please create api\.env with:
    echo MONGODB_URI=your-mongodb-connection-string
    echo JWT_SECRET=your-secret-key
    echo.
    pause
    exit /b 1
)
echo Starting server on http://localhost:5000
echo.
node server.js
pause
