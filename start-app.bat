@echo off
echo ================================================
echo   GeoFix Mobile App - Development Server
echo ================================================
echo.

REM Try Python first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Python found. Starting server...
    echo.
    echo Server will run at: http://localhost:8080
    echo Press Ctrl+C to stop
    echo.
    python -m http.server 8080
    goto :end
)

REM Try Node.js with npx (no installation needed)
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Node.js found. Starting server...
    echo.
    echo Server will run at: http://localhost:8080
    echo Opening browser...
    echo Press Ctrl+C to stop
    echo.
    start http://localhost:8080
    npx http-server -p 8080
    goto :end
)

REM Neither found
echo [!] Neither Python nor Node.js found.
echo.
echo Please install one of the following:
echo.
echo Option 1 - Python (Recommended):
echo   Download from: https://www.python.org/downloads/
echo   or run: winget install Python.Python.3.11
echo.
echo Option 2 - Node.js:
echo   Download from: https://nodejs.org/
echo   or run: winget install OpenJS.NodeJS
echo.
echo After installing, run this script again.
echo.
pause

:end
