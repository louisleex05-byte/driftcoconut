@echo off
REM Start the local driftcoconut Next.js development server.
REM Keep this window open while browsing http://localhost:3000.

setlocal
cd /d "%~dp0"
title driftcoconut Local Server

if not exist "package.json" (
    echo ERROR: package.json was not found.
    echo Run this launcher from the driftcoconut project folder.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm was not found on PATH.
    echo Install Node.js, then run drift_gpt.bat again.
    pause
    exit /b 1
)

echo.
echo Starting driftcoconut at http://localhost:3000
echo Keep this window open while you browse the local site.
echo Press Ctrl+C here to stop the server.
echo.

npm run dev

echo.
echo The local server has stopped.
pause
