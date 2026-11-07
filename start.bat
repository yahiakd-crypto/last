@echo off
setlocal

cd /d "%~dp0"

REM ============================================================
REM  Port configuration. Change this line for another port.
REM  Note: 0070 is read as port 70 by Node and by browsers.
REM ============================================================
if "%PORT%"=="" set "PORT=0070"

title Product Intelligence OS - port %PORT%

echo ============================================================
echo   Product Intelligence OS
echo   URL: http://localhost:%PORT%
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 goto no_node

REM --- Step 1: make sure .env exists ---
if exist ".env" goto env_ready
if not exist ".env.example" goto env_ready
echo [1/3] Creating .env from .env.example ...
copy /y ".env.example" ".env" >nul
echo       You can add your API keys in .env later.
goto env_ready
:env_ready

REM --- Step 2: make sure dependencies are installed ---
if exist "node_modules" goto deps_ready
echo [2/3] Installing dependencies. First run can take a few minutes ...
call npm install
if errorlevel 1 goto install_failed
goto deps_ready
:deps_ready

REM --- Step 3: start the server ---
echo [3/3] Starting server on port %PORT% ...
echo.
echo Opening http://localhost:%PORT% in your browser in a few seconds.
echo Press Ctrl+C in this window to stop the server.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 5; Start-Process 'http://localhost:%PORT%/'"

call npm start
echo.
echo Server stopped.
goto end

:no_node
echo [ERROR] Node.js was not found in PATH.
echo         Install it from https://nodejs.org/ then run start.bat again.
goto end

:install_failed
echo.
echo [ERROR] npm install failed. Check your internet connection.
goto end

:end
echo.
pause
endlocal
