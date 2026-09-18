@echo off
echo ===================================================
echo   Starting AR Virtual Fire System (Webcam Feed)
echo ===================================================
call .venv\Scripts\activate.bat
python main.py --source 0
pause
