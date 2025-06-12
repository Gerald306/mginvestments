# Setup Android Studio Emulator for MG Investments Mobile App
# This script helps connect your project to Android Studio emulators

Write-Host "🤖 Setting up Android Studio Emulator Connection" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Function to find Android SDK path
function Find-AndroidSDK {
    $possiblePaths = @(
        "$env:LOCALAPPDATA\Android\Sdk",
        "$env:APPDATA\Android\Sdk",
        "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk",
        "C:\Android\Sdk",
        "$env:ANDROID_HOME"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path "$path\platform-tools\adb.exe") {
            return $path
        }
    }
    return $null
}

# Find Android SDK
Write-Host "🔍 Looking for Android SDK..." -ForegroundColor Yellow
$androidSDK = Find-AndroidSDK

if ($androidSDK) {
    Write-Host "✅ Found Android SDK at: $androidSDK" -ForegroundColor Green
    $env:ANDROID_HOME = $androidSDK
    $env:PATH = $env:PATH + ";$androidSDK\platform-tools;$androidSDK\tools;$androidSDK\emulator"
} else {
    Write-Host "❌ Android SDK not found. Please ensure Android Studio is properly installed." -ForegroundColor Red
    Write-Host "   Expected location: $env:LOCALAPPDATA\Android\Sdk" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Manual Setup Instructions:" -ForegroundColor Cyan
    Write-Host "1. Open Android Studio" -ForegroundColor White
    Write-Host "2. Go to File → Settings → Appearance & Behavior → System Settings → Android SDK" -ForegroundColor White
    Write-Host "3. Note the SDK Location path" -ForegroundColor White
    Write-Host "4. Add these to your system PATH:" -ForegroundColor White
    Write-Host "   - [SDK_PATH]\platform-tools" -ForegroundColor White
    Write-Host "   - [SDK_PATH]\tools" -ForegroundColor White
    Write-Host "   - [SDK_PATH]\emulator" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "📱 Checking for available emulators..." -ForegroundColor Yellow

# List available emulators
$emulatorPath = "$androidSDK\emulator\emulator.exe"
if (Test-Path $emulatorPath) {
    Write-Host "Available Android Virtual Devices (AVDs):" -ForegroundColor Cyan
    & "$emulatorPath" -list-avds
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Emulators found!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No emulators found. Let's create one..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔧 Creating recommended emulator..." -ForegroundColor Yellow
        
        # Create a recommended emulator
        $avdName = "MG_Investments_Pixel_4"
        $systemImage = "system-images;android-30;google_apis;x86_64"
        
        Write-Host "Creating AVD: $avdName" -ForegroundColor Cyan
        
        # Note: This requires sdkmanager and avdmanager to be available
        Write-Host "⚠️  Please create an emulator manually in Android Studio:" -ForegroundColor Yellow
        Write-Host "1. Open Android Studio" -ForegroundColor White
        Write-Host "2. Go to Tools → AVD Manager" -ForegroundColor White
        Write-Host "3. Click 'Create Virtual Device'" -ForegroundColor White
        Write-Host "4. Choose 'Pixel 4' → Next" -ForegroundColor White
        Write-Host "5. Choose 'R (API level 30)' → Next" -ForegroundColor White
        Write-Host "6. Name it 'MG_Investments_Pixel_4' → Finish" -ForegroundColor White
    }
} else {
    Write-Host "❌ Emulator executable not found at: $emulatorPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Starting Expo with Android support..." -ForegroundColor Green

# Check if an emulator is running
Write-Host "Checking for running emulators..." -ForegroundColor Yellow
$adbPath = "$androidSDK\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    $devices = & "$adbPath" devices
    Write-Host "Connected devices:" -ForegroundColor Cyan
    Write-Host $devices -ForegroundColor White
    
    if ($devices -match "emulator") {
        Write-Host "✅ Emulator is running!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No emulator running. Please start one from Android Studio:" -ForegroundColor Yellow
        Write-Host "1. Open Android Studio" -ForegroundColor White
        Write-Host "2. Go to Tools → AVD Manager" -ForegroundColor White
        Write-Host "3. Click the ▶️ play button next to your emulator" -ForegroundColor White
        Write-Host "4. Wait for the emulator to fully boot up" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key when your emulator is running..." -ForegroundColor Cyan
        Read-Host
    }
}

Write-Host ""
Write-Host "🎯 Starting Expo for Android development..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Instructions:" -ForegroundColor Cyan
Write-Host "1. Make sure your Android emulator is running" -ForegroundColor White
Write-Host "2. Press 'a' in the Expo terminal to open on Android" -ForegroundColor White
Write-Host "3. The app will install and run on your emulator" -ForegroundColor White
Write-Host ""

# Start Expo
npx expo start --android
