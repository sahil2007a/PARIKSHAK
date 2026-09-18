@echo off
title Mobile AR Virtual Fire Expo App
echo ========================================================
echo   Starting Mobile AR Virtual Fire Expo Metro Bundler
echo ========================================================
echo.

cd /d "%~dp0\mobile_virtual_fire"
npx expo start -c
pause
