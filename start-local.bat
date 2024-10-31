@echo off
echo Starting TrackMyGoal locally...

:: Start the backend server
start cmd /k "cd server && npm install && npm start"

:: Wait for backend to initialize
timeout /t 5

:: Start the frontend
start cmd /k "cd app && npm install && npm start"

echo Servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:8000
