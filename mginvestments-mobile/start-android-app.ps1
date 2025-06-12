# Start MG Investments App on Android Emulator
Write-Host "Starting MG Investments on Android Emulator..." -ForegroundColor Green

# Set Android SDK path
$sdkPath = "C:\Users\GOD CARES\AppData\Local\Android\Sdk"
$env:ANDROID_HOME = $sdkPath
$env:PATH = "$env:PATH;$sdkPath\platform-tools;$sdkPath\emulator"

# Check emulator
$adbPath = "$sdkPath\platform-tools\adb.exe"
Write-Host "Checking emulator status..." -ForegroundColor Yellow
$devices = & $adbPath devices
Write-Host $devices

if ($devices -match "emulator.*device") {
    Write-Host "Emulator found! Starting Expo and opening app..." -ForegroundColor Green
    
    # Start Expo and immediately open on Android
    Start-Process powershell -ArgumentList "-Command", "npx expo start --android" -NoNewWindow
    
    # Wait a moment for Expo to start
    Start-Sleep -Seconds 5
    
    # Force open the app on Android
    Write-Host "Opening app on Android emulator..." -ForegroundColor Cyan
    & $adbPath shell am start -n host.exp.exponent/.experience.HomeActivity
    
    # Alternative: Open Expo Go and navigate to development server
    Write-Host "If app doesn't open, trying alternative method..." -ForegroundColor Yellow
    & $adbPath shell am start -n host.exp.exponent/.experience.HomeActivity -d "exp://127.0.0.1:8081"
    
} else {
    Write-Host "No emulator running. Please start an emulator first:" -ForegroundColor Red
    Write-Host "1. Open Android Studio"
    Write-Host "2. Go to Tools > AVD Manager"
    Write-Host "3. Start an emulator"
    Write-Host "4. Run this script again"
}
