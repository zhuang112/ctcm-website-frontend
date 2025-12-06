@echo off
cd /d %~dp0

echo ===============================
echo Sync CTCM Vite frontend to GitHub (main branch)
echo ===============================

git status

echo.
echo Press any key to continue, or Ctrl+C to cancel...
pause >nul

set /p msg="Commit message (預設: auto update): "
if "%msg%"=="" set msg=auto update

git add .
git commit -m "%msg%"
git push origin main

echo.
echo Done! Changes pushed to GitHub.
pause
