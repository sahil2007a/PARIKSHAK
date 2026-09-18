@echo off
title [1] YOLO AI Detection Backend Server
echo ========================================================
echo   Starting Mobile AR Virtual Fire YOLO Detection Server
echo ========================================================
echo.

:: Locate root project directory
set "CURRENT_DIR=%~dp0"
cd /d "%CURRENT_DIR%.."

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

if exist "%~dp0..\.venv\Scripts\python.exe" (
    "%~dp0..\.venv\Scripts\python.exe" "%~dp0server\app.py"
) else (
    python "%~dp0server\app.py"
)
pause
