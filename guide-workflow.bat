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

REM Check for config file, prompt user to create if missing
if not exist "guide-workflow-config.json" (
    if exist "guide-workflow-config.example.json" (
        echo -----------------------------------------------------------
        echo First run: no config file found.
        echo Copying guide-workflow-config.example.json to guide-workflow-config.json
        echo IMPORTANT: Edit guide-workflow-config.json and add your Claude API key
        echo before using the "Run Claude" buttons.
        echo -----------------------------------------------------------
        copy /Y "guide-workflow-config.example.json" "guide-workflow-config.json" >nul
        echo.
        echo Opening config file for you to edit...
        notepad guide-workflow-config.json
        echo.
        echo When you save the config, press any key to launch the app.
        pause
    ) else (
        echo WARNING: no config file. Claude API buttons will not work.
        echo Create guide-workflow-config.json with { "claudeApiKey": "sk-ant-..." }
        echo.
        pause
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
