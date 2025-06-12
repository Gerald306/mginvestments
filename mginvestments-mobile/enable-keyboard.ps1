# Enable Android Emulator Keyboard - MG Investments
Write-Host "Enabling Android Emulator Keyboard..." -ForegroundColor Green

# Set Android SDK path
$sdkPath = "C:\Users\GOD CARES\AppData\Local\Android\Sdk"
$env:PATH = "$env:PATH;$sdkPath\platform-tools"
$adbPath = "$sdkPath\platform-tools\adb.exe"

Write-Host "Configuring emulator keyboard settings..." -ForegroundColor Yellow

# Enable soft keyboard
Write-Host "1. Enabling soft keyboard..." -ForegroundColor Cyan
& $adbPath shell settings put secure show_ime_with_hard_keyboard 1

# Set keyboard to always show
Write-Host "2. Setting keyboard to always show when focused..." -ForegroundColor Cyan
& $adbPath shell settings put system show_touches 1

# Enable keyboard suggestions
Write-Host "3. Enabling keyboard suggestions..." -ForegroundColor Cyan
& $adbPath shell settings put secure spell_checker_enabled 1

# Set default input method (if needed)
Write-Host "4. Checking input methods..." -ForegroundColor Cyan
& $adbPath shell ime list -s

Write-Host ""
Write-Host "Keyboard configuration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions for using keyboard in emulator:" -ForegroundColor Yellow
Write-Host "1. Tap on any text input field in the app" -ForegroundColor White
Write-Host "2. The soft keyboard should appear automatically" -ForegroundColor White
Write-Host "3. You can type using your computer keyboard" -ForegroundColor White
Write-Host "4. Or click on the on-screen keyboard keys" -ForegroundColor White
Write-Host ""
Write-Host "If keyboard doesn't appear:" -ForegroundColor Cyan
Write-Host "- Press F6 to toggle soft keyboard" -ForegroundColor White
Write-Host "- Or go to Settings > System > Languages & input > Virtual keyboard" -ForegroundColor White
Write-Host "- Enable 'Show input method' option" -ForegroundColor White
