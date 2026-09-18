@echo off
title Mobile AR Virtual Fire YOLO Server
echo ========================================================
echo   Starting Mobile AR Virtual Fire YOLO Detection Server
echo ========================================================
echo.

cd /d "%~dp0"
echo Starting YOLO server on port 8000...
echo.
.venv\Scripts\python.exe mobile_virtual_fire\server\app.py
pause
