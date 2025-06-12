# Connect MG Investments to Android Studio Emulator
Write-Host "Connecting to Android Studio Emulator..." -ForegroundColor Green

# Find Android SDK
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (Test-Path "$sdkPath\platform-tools\adb.exe") {
    Write-Host "Found Android SDK at: $sdkPath" -ForegroundColor Green
    
    # Set environment for this session
    $env:ANDROID_HOME = $sdkPath
    $env:PATH = "$env:PATH;$sdkPath\platform-tools"
    
    # Check for emulators
    Write-Host "Checking for running emulators..." -ForegroundColor Yellow
    $adbPath = "$sdkPath\platform-tools\adb.exe"
    $devices = & $adbPath devices
    
    Write-Host "Connected devices:"
    Write-Host $devices
    
    if ($devices -match "emulator.*device") {
        Write-Host "Emulator found! Starting Expo..." -ForegroundColor Green
        npx expo start
    } else {
        Write-Host "No emulator running. Please:" -ForegroundColor Yellow
        Write-Host "1. Open Android Studio"
        Write-Host "2. Go to Tools > AVD Manager" 
        Write-Host "3. Start an emulator"
        Write-Host "4. Run this script again"
    }
} else {
    Write-Host "Android SDK not found at: $sdkPath" -ForegroundColor Red
    Write-Host "Please check your Android Studio installation"
}
