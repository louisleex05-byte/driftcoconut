@echo off
REM Start the local driftcoconut Next.js development server and open the homepage
REM once it responds. localhost always resolves to this computer (127.0.0.1).

setlocal
cd /d "%~dp0"
title driftcoconut Local Server
set "HOST=127.0.0.1"
set "PORT=3000"
set "URL=http://localhost:%PORT%/"

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

REM Use one predictable local URL. Do not silently start a second server on a
REM different port, because browser tabs and bookmarks would point at the wrong app.
netstat -ano | findstr /C:":%PORT% " | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo ERROR: http://localhost:%PORT% is already in use.
    echo Close the existing local server, then run drift_gpt.bat again.
    pause
    exit /b 1
)

echo.
echo Starting driftcoconut at %URL%
echo Keep this window open while you browse the local site.
echo Press Ctrl+C here to stop the server.
echo.

REM Open the homepage after Next has had a moment to start.
start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process '%URL%'"

npm run dev -- --hostname %HOST% --port %PORT%

echo.
echo The local server has stopped.
pause
