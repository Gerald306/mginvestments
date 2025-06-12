# Check Android Emulator Status and Fix Display Issues
Write-Host "Checking Android Emulator Status..." -ForegroundColor Green

# Set Android SDK path
$sdkPath = "C:\Users\GOD CARES\AppData\Local\Android\Sdk"
$env:ANDROID_HOME = $sdkPath
$env:PATH = "$env:PATH;$sdkPath\platform-tools;$sdkPath\emulator"

Write-Host "Android SDK Path: $sdkPath" -ForegroundColor Cyan

# Check if ADB is working
$adbPath = "$sdkPath\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "ADB found at: $adbPath" -ForegroundColor Green
    
    # Check connected devices
    Write-Host "`nChecking connected devices..." -ForegroundColor Yellow
    & $adbPath devices -l
    
    # Check if emulator is responsive
    Write-Host "`nChecking emulator responsiveness..." -ForegroundColor Yellow
    & $adbPath shell getprop ro.build.version.release
    
    # Check if Expo Go is installed
    Write-Host "`nChecking for Expo Go installation..." -ForegroundColor Yellow
    & $adbPath shell pm list packages | Select-String "expo"
    
    # Try to install Expo Go if not found
    Write-Host "`nAttempting to install Expo Go..." -ForegroundColor Yellow
    & $adbPath install -r "$env:LOCALAPPDATA\Android\Sdk\extras\google\usb_driver\expo-go.apk" 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Expo Go APK not found locally. Will install via Play Store method." -ForegroundColor Yellow
    }
    
} else {
    Write-Host "ADB not found at: $adbPath" -ForegroundColor Red
}

# Check emulator process
Write-Host "`nChecking emulator processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*emulator*"} | Format-Table ProcessName, Id, CPU

Write-Host "`nEmulator troubleshooting complete." -ForegroundColor Green
