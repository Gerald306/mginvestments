# Simple Android Studio Connection - MG Investments
# Quick setup to connect your project to Android Studio emulator

Write-Host "🤖 Connecting MG Investments to Android Studio Emulator" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""

# Check common Android SDK locations
$androidSDKPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:APPDATA\Android\Sdk", 
    "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
)

$foundSDK = $null
foreach ($path in $androidSDKPaths) {
    if (Test-Path "$path\platform-tools\adb.exe") {
        $foundSDK = $path
        break
    }
}

if ($foundSDK) {
    Write-Host "✅ Found Android SDK at: $foundSDK" -ForegroundColor Green
    
    # Set environment variables for this session
    $env:ANDROID_HOME = $foundSDK
    $platformTools = "$foundSDK\platform-tools"
    $emulatorPath = "$foundSDK\emulator"
    
    # Add to PATH for this session
    if ($env:PATH -notlike "*$platformTools*") {
        $env:PATH = "$env:PATH;$platformTools;$emulatorPath"
    }
    
    Write-Host "✅ Environment variables set for this session" -ForegroundColor Green
    Write-Host ""
    
    # Check for running emulators
    Write-Host "🔍 Checking for running Android emulators..." -ForegroundColor Yellow
    try {
        $devices = & "$platformTools\adb.exe" devices
        Write-Host $devices -ForegroundColor Cyan
        
        if ($devices -match "emulator.*device") {
            Write-Host "✅ Android emulator is running and ready!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🚀 Starting Expo with Android support..." -ForegroundColor Green
            Write-Host ""
            Write-Host "📱 Next steps:" -ForegroundColor Cyan
            Write-Host "1. Wait for Expo to start" -ForegroundColor White
            Write-Host "2. Press 'a' in the terminal to open on Android" -ForegroundColor White
            Write-Host "3. Your app will install and run on the emulator" -ForegroundColor White
            Write-Host ""
            
            # Start Expo with Android
            npx expo start
        } else {
            Write-Host "⚠️  No Android emulator running" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "📋 Please start an emulator first:" -ForegroundColor Cyan
            Write-Host "1. Open Android Studio" -ForegroundColor White
            Write-Host "2. Go to Tools > AVD Manager" -ForegroundColor White
            Write-Host "3. Click the play button next to any emulator" -ForegroundColor White
            Write-Host "4. Wait for it to fully boot up" -ForegroundColor White
            Write-Host "5. Run this script again" -ForegroundColor White
            Write-Host ""
            Write-Host "Or create a new emulator if you don't have one:" -ForegroundColor Yellow
            Write-Host "1. In AVD Manager, click Create Virtual Device" -ForegroundColor White
            Write-Host "2. Choose Pixel 4 > Next" -ForegroundColor White
            Write-Host "3. Choose API 30 (Android 11) > Next > Finish" -ForegroundColor White
        }
    } catch {
        Write-Host "❌ Error checking emulators: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Android SDK not found in common locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Manual setup required:" -ForegroundColor Yellow
    Write-Host "1. Open Android Studio" -ForegroundColor White
    Write-Host "2. Go to File > Settings > Android SDK" -ForegroundColor White
    Write-Host "3. Note the SDK Location path" -ForegroundColor White
    Write-Host "4. Add these to your system PATH:" -ForegroundColor White
    Write-Host "   - [SDK_PATH]\platform-tools" -ForegroundColor White
    Write-Host "   - [SDK_PATH]\emulator" -ForegroundColor White
    Write-Host ""
    Write-Host "Common SDK locations to check:" -ForegroundColor Cyan
    foreach ($path in $androidSDKPaths) {
        Write-Host "   - $path" -ForegroundColor White
    }
}
