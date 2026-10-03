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

REM Reuse an existing driftcoconut server before checking whether another app
REM owns the port. This avoids starting a second server on a different URL.
powershell.exe -NoProfile -Command "try { $response = Invoke-WebRequest -Uri '%URL%' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200 -and $response.Content -match 'driftcoconut') { exit 0 } } catch {}; exit 1"
if not errorlevel 1 (
    echo driftcoconut is already running at %URL%
    echo Opening the existing local site...
    start "" "%URL%"
    exit /b 0
)

REM If another process is listening on the fixed port, stop with a clear error.
powershell.exe -NoProfile -Command "if (Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
    echo ERROR: http://localhost:%PORT% is already in use.
    echo Another application owns this port. Close it, then run drift_gpt.bat again.
    pause
    exit /b 1
)

echo.
echo Starting driftcoconut at %URL%
echo Keep this window open while you browse the local site.
echo Press Ctrl+C here to stop the server.
echo.

REM Open the homepage after Next has had a moment to start. rundll32 asks
REM Windows to use the default browser without launching it through PowerShell.
start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; & rundll32.exe url.dll,FileProtocolHandler '%URL%'"

npm run dev -- --hostname %HOST% --port %PORT%

echo.
echo The local server has stopped.
pause
