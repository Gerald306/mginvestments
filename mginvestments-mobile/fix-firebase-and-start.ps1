# Fix Firebase Auth Error and Start Expo - MG Investments
# This script fixes the Firebase Auth registration error and starts the app

Write-Host "🔧 Fixing Firebase Auth Registration Error" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the mginvestments-mobile directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing required dependencies..." -ForegroundColor Yellow
npm install @react-native-async-storage/async-storage --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "🧹 Clearing Expo cache..." -ForegroundColor Yellow
npx expo start --clear --port 8082

Write-Host ""
Write-Host "🎉 Firebase Auth error should now be fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 To test on your phone:" -ForegroundColor Cyan
Write-Host "1. Make sure your phone and computer are on the same WiFi" -ForegroundColor White
Write-Host "2. Open Expo Go app on your phone" -ForegroundColor White
Write-Host "3. Scan the QR code that appears above" -ForegroundColor White
Write-Host "4. The app should now load without Firebase Auth errors" -ForegroundColor White
Write-Host ""
Write-Host "🔍 What was fixed:" -ForegroundColor Yellow
Write-Host "- Added proper Firebase Auth initialization for React Native" -ForegroundColor White
Write-Host "- Added AsyncStorage persistence for authentication" -ForegroundColor White
Write-Host "- Added Firebase initialization checker component" -ForegroundColor White
Write-Host "- Added error handling for Firebase service registration" -ForegroundColor White
