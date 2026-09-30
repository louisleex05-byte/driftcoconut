@echo off
REM =====================================================================
REM  DASHBOARD SERVER — the "Update Data" button now works from the page
REM
REM  - Starts a local server at http://localhost:5788
REM  - Opens the dashboard in your browser
REM  - Click the "Update Data" button in the page for a fresh GA pull
REM  - CLOSE THIS TERMINAL WINDOW to stop the server
REM
REM  One-time setup (5 min) — done once, forever:
REM
REM    1. https://console.cloud.google.com  ->  New Project "driftcoconut-ga"
REM    2. APIs & Services -> Library -> "Google Analytics Data API" -> Enable
REM    3. APIs & Services -> OAuth consent screen -> External
REM       App: driftcoconut-dashboard  Email: louisleex05@gmail.com
REM       Test users: add louisleex05@gmail.com
REM    4. APIs & Services -> Credentials -> Create OAuth Client ID
REM       Application type: Desktop app  -> Download JSON
REM    5. Rename downloaded file to  ga-oauth-client.json
REM       Move it into this folder (Travel Site\)
REM
REM  Also grant GA property access to louisleex05@gmail.com:
REM     analytics.google.com -> Admin -> Property access management
REM     Add user: louisleex05@gmail.com  Role: Viewer
REM =====================================================================

setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: Node.js is not installed or not in PATH.
  echo Download the LTS version from: https://nodejs.org
  pause
  exit /b 1
)

echo.
echo Starting dashboard server...
echo.
echo  * Server URL: http://localhost:5788
echo  * Close THIS window to stop the server
echo.

node scripts\dashboard-server.mjs
if errorlevel 1 (
  echo.
  echo Server exited with error. See message above.
  pause
)

endlocal
