@echo off
title Mobile AR Virtual Fire YOLO Server
echo ========================================================
echo   Starting Mobile AR Virtual Fire YOLO Detection Server
echo ========================================================
echo.

cd /d "%~dp0"
..\..\.venv\Scripts\python.exe app.py
pause
