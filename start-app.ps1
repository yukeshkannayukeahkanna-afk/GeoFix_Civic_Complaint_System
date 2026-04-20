# GeoFix App - Quick Start Server
# This script starts a local web server to test your PWA

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  GeoFix Mobile App - Development Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[X] Node.js not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The app will open in your browser at:" -ForegroundColor Cyan
Write-Host "http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "To test PWA installation:" -ForegroundColor Cyan
Write-Host "1. Look for the 'Install App' button" -ForegroundColor White
Write-Host "2. Or check browser address bar for install icon" -ForegroundColor White
Write-Host "3. Click install and follow prompts" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if http-server is available globally
$httpServerInstalled = $false
try {
    $null = Get-Command http-server -ErrorAction Stop
    $httpServerInstalled = $true
} catch {
    Write-Host "Installing http-server..." -ForegroundColor Yellow
    npm install -g http-server
    $httpServerInstalled = $true
}

if ($httpServerInstalled) {
    # Start the server
    http-server -p 8080 -o
} else {
    Write-Host "[X] Could not install http-server" -ForegroundColor Red
    Write-Host "Please run: npm install -g http-server" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
