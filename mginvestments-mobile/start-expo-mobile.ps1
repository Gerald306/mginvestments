# Start Expo for Mobile Testing - MG Investments
# Generates QR code for Expo Go app testing

Write-Host "📱 Starting MG Investments Mobile App for Phone Testing" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the mginvestments-mobile directory" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🚀 Starting Expo development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 Instructions for testing on your phone:" -ForegroundColor Cyan
Write-Host "1. Install Expo Go app from your app store" -ForegroundColor White
Write-Host "2. Make sure your phone and computer are on the same WiFi network" -ForegroundColor White
Write-Host "3. Scan the QR code that will appear below" -ForegroundColor White
Write-Host "4. The MG Investments app will load on your phone" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  If QR code doesn't work, try tunnel mode:" -ForegroundColor Yellow
Write-Host "   Press 's' in the terminal and select 'Expo Go'" -ForegroundColor White
Write-Host ""

# Start Expo with tunnel for better connectivity
Write-Host "Starting Expo with tunnel mode for better phone connectivity..." -ForegroundColor Green
npx expo start --tunnel

# If tunnel fails, try regular mode
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  Tunnel mode failed, trying regular mode..." -ForegroundColor Yellow
    npx expo start
}
