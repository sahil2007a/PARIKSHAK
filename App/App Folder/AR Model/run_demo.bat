@echo off
echo ===================================================
echo   Starting AR Virtual Fire System (Demo Mode)
echo ===================================================
call .venv\Scripts\activate.bat
python main.py --source demo
pause
