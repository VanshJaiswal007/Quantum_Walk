@echo off
REM Quick Start Guide for Quantum Budget Optimizer (Windows)

echo.
echo 🚀 Quantum Budget Optimizer - Quick Start (Windows)
echo ====================================================
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed!
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🔥 Starting application...
echo.
echo Frontend will run on:   http://localhost:5173
echo Backend will run on:    http://localhost:3000
echo.
echo In separate terminals, you can also run:
echo   • npm run dev:server  (backend only)
echo   • npm run dev:client  (frontend only)
echo.
echo Press Ctrl+C to stop the development server.
echo.

REM Start development mode
call npm run dev

pause
