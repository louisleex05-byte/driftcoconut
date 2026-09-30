@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ================================================================
echo    driftcoconut GA Dashboard  -  Setup Wizard
echo ================================================================
echo.
echo   This wizard walks you through the one-time setup.
echo   Takes about 5 minutes. Everything runs locally on your PC.
echo.
pause


REM ==================== Step 1 of 6: Node.js ====================
echo.
echo ================================================================
echo   [1/6] Checking Node.js
echo ================================================================
where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   [MISSING] Node.js is not installed or not in PATH.
  echo.
  echo   Opening the Node.js download page - install the LTS version,
  echo   then close this window and rerun install-dashboard.bat.
  echo.
  start "" "https://nodejs.org"
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo.
echo   [OK] Node.js !NODE_VER! detected.


REM ==================== Step 2 of 6: Project files ====================
echo.
echo ================================================================
echo   [2/6] Verifying project files
echo ================================================================
set MISSING=0
if not exist "scripts\dashboard-server.mjs" (
  echo   [MISSING] scripts\dashboard-server.mjs
  set MISSING=1
)
if not exist "refresh-dashboard.bat" (
  echo   [MISSING] refresh-dashboard.bat
  set MISSING=1
)
if not exist ".gitignore" (
  echo   [WARN] .gitignore is missing - credentials could accidentally be committed
)
if "!MISSING!"=="1" (
  echo.
  echo   Copy the missing files from your source machine into this folder:
  echo   %~dp0
  pause
  exit /b 1
)
echo.
echo   [OK] Project files present.


REM ==================== Step 3 of 6: Google Cloud project ====================
echo.
echo ================================================================
echo   [3/6] Google Cloud - create project and enable API
echo ================================================================
echo.
echo   Opening Google Cloud Console in your browser.
echo.
echo   Do these 3 things in the Cloud Console:
echo     a) Click New Project  -  name it "driftcoconut-ga"
echo     b) After the project is created, go to APIs and Services -^> Library
echo        Search: Google Analytics Data API  -^>  click Enable
echo     c) Also enable if prompted: OAuth flow support
echo.
start "" "https://console.cloud.google.com/projectcreate"
timeout /t 2 /nobreak >nul
echo   When done with a-b-c, press any key here to continue...
pause >nul


REM ==================== Step 4 of 6: OAuth consent + client ====================
echo.
echo ================================================================
echo   [4/6] OAuth consent screen + Desktop client
echo ================================================================
echo.
echo   Opening OAuth consent screen page now.
echo.
echo   Configure the consent screen:
echo     - User Type: External  -^>  Create
echo     - App name: driftcoconut-dashboard
echo     - User support email + developer email: your Google email
echo     - SKIP the Scopes step (leave empty) -^> Save
echo     - Test users -^> Add users -^> your Google email -^> Save
echo.
start "" "https://console.cloud.google.com/apis/credentials/consent"
timeout /t 2 /nobreak >nul
echo   Press any key once the consent screen is configured...
pause >nul

echo.
echo   Now creating the OAuth Client ID.
echo.
echo   Opening Credentials page. On that page:
echo     - Click + CREATE CREDENTIALS -^> OAuth client ID
echo     - Application type: Desktop app
echo     - Name: driftcoconut-desktop
echo     - Click CREATE -^> a popup shows the client ID + secret
echo     - Click DOWNLOAD JSON
echo.
start "" "https://console.cloud.google.com/apis/credentials"
timeout /t 2 /nobreak >nul
echo   After downloading the JSON:
echo     1) Rename the file to exactly:  ga-oauth-client.json
echo     2) Move it into this folder:    %~dp0
echo.
echo   IMPORTANT: enable "File name extensions" in File Explorer first
echo   (View menu -^> Show -^> File name extensions) so you don't end up
echo   with ga-oauth-client.json.json by accident.
echo.
pause


REM ==================== Step 5 of 6: Verify OAuth JSON ====================
echo.
echo ================================================================
echo   [5/6] Verifying ga-oauth-client.json
echo ================================================================
:check_oauth_file
if not exist "ga-oauth-client.json" (
  echo.
  echo   [MISSING] ga-oauth-client.json not found in this folder.
  echo.
  echo   Common mistakes:
  echo     - Windows hid the .json extension  -^>  actual file is .json.json
  echo     - Saved to Downloads folder instead of this folder
  echo     - Filename typo
  echo.
  set /p RETRY="   Recheck now? (Y=yes, N=exit): "
  if /i "!RETRY!"=="Y" goto :check_oauth_file
  echo   Exiting setup - fix the file and rerun this wizard.
  pause
  exit /b 1
)
echo.
echo   [OK] ga-oauth-client.json found.


REM ==================== Step 6 of 6: GA property access + Gemini ====================
echo.
echo ================================================================
echo   [6/6] Grant GA access + (optional) enable AI insights
echo ================================================================
echo.
echo   PART A - Grant your Google account Viewer access to GA property.
echo   Opening Google Analytics now.
echo.
echo     - Click Admin (gear icon, bottom-left)
echo     - Under Property, click Property access management
echo     - + Add users  -^>  paste your Google email  -^>  Role: Viewer  -^>  Add
echo.
start "" "https://analytics.google.com"
timeout /t 2 /nobreak >nul
pause

echo.
echo   PART B - Gemini API key (optional, for AI Weekly Insight Summary)
echo.
set HAS_KEY=0
if exist ".env.local" (
  findstr /B /C:"GEMINI_API_KEY=" .env.local >nul 2>&1
  if not errorlevel 1 set HAS_KEY=1
)
if "!HAS_KEY!"=="1" (
  echo   [OK] GEMINI_API_KEY already exists in .env.local - skipping.
  goto :done
)

set /p WANT_AI="   Enable AI Weekly Insight Summary? (Y=yes, N=skip): "
if /i not "!WANT_AI!"=="Y" (
  echo   Skipping AI setup. Dashboard will show a helper message in the AI panel.
  goto :done
)

echo.
echo   Opening AI Studio - copy any API key from there (or create a new one).
start "" "https://aistudio.google.com/apikey"
timeout /t 2 /nobreak >nul
echo.
set /p GEMINI_KEY="   Paste your Gemini API key here (or leave blank to skip): "
if "!GEMINI_KEY!"=="" (
  echo   No key entered - skipping AI insights.
  goto :done
)
if not exist ".env.local" type nul > .env.local
echo.>> .env.local
echo # Gemini API key for dashboard AI insights (added by install-dashboard.bat)>> .env.local
echo GEMINI_API_KEY=!GEMINI_KEY!>> .env.local
echo   [OK] Key saved to .env.local (gitignored - safe from git commits).


:done
echo.
echo ================================================================
echo   Setup complete!
echo ================================================================
echo.
echo   Next: launching refresh-dashboard.bat
echo   The browser will open once for a Google sign-in, then the
echo   dashboard loads at http://localhost:5788
echo.
echo   Future runs: just double-click refresh-dashboard.bat directly.
echo.
timeout /t 3 /nobreak >nul
call refresh-dashboard.bat

endlocal
