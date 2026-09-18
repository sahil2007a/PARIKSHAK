@echo off
title [1] YOLO AI Detection Backend Server
echo ========================================================
echo   Starting Mobile AR Virtual Fire YOLO Detection Server
echo ========================================================
echo.

:: Locate root project directory
set "ROOT_DIR=%~dp0"

:: Auto free port 8000 if previously occupied
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

if exist "%ROOT_DIR%.venv\Scripts\python.exe" (
    "%ROOT_DIR%.venv\Scripts\python.exe" "%ROOT_DIR%mobile_virtual_fire\server\app.py"
) else (
    python "%ROOT_DIR%mobile_virtual_fire\server\app.py"
)
pause
