@echo off
REM ============================================================================
REM driftcoconut Guide Workflow launcher
REM Double-click this file to open the guide-workflow app.
REM ============================================================================

REM Change to the directory this .bat lives in
cd /d "%~dp0"

REM Verify the .ps1 exists
if not exist "guide-workflow.ps1" (
    echo ERROR: guide-workflow.ps1 not found in this folder.
    echo Expected at: %~dp0guide-workflow.ps1
    pause
    exit /b 1
)

REM Create the local ignored config on first run. Manual ChatGPT mode is the
REM default and needs no API key; the config also retains an optional legacy
REM Claude API section during the transition.
if not exist "guide-workflow-config.json" (
    if exist "guide-workflow-config.example.json" (
        echo -----------------------------------------------------------
        echo First run: no config file found.
        echo Copying guide-workflow-config.example.json to guide-workflow-config.json
        echo Manual ChatGPT mode is ready; no API key is required.
        echo -----------------------------------------------------------
        copy /Y "guide-workflow-config.example.json" "guide-workflow-config.json" >nul
    ) else (
        echo WARNING: config template not found. Continuing in manual ChatGPT mode.
        echo.
    )
)

REM Launch PowerShell with the workflow script
REM -ExecutionPolicy Bypass  = don't fail on default restricted policy
REM -NoProfile              = skip $PROFILE loading (faster startup)
REM -STA                    = single-threaded apartment (required for WinForms)
powershell.exe -ExecutionPolicy Bypass -NoProfile -STA -File "guide-workflow.ps1"

REM Keep window open if the script errors on startup
if errorlevel 1 (
    echo.
    echo PowerShell exited with an error. See above.
    pause
)
