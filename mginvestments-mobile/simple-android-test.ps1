# Simple Android Setup Test for MG Investments

Write-Host "🧪 Testing Android Setup for MG Investments" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

$passed = 0
$total = 0

function Test-Item {
    param($Name, $Condition, $Path = "", $Recommendation = "")
    
    $script:total++
    
    if ($Condition) {
        Write-Host "✅ $Name" -ForegroundColor Green
        if ($Path) { Write-Host "   Found: $Path" -ForegroundColor Gray }
        $script:passed++
    } else {
        Write-Host "❌ $Name" -ForegroundColor Red
        if ($Recommendation) { Write-Host "   💡 $Recommendation" -ForegroundColor Yellow }
    }
    Write-Host ""
}

# Test Android SDK
$androidHome = $env:ANDROID_HOME
if (!$androidHome) {
    $androidHome = "${env:LOCALAPPDATA}\Android\Sdk"
}

Test-Item "Android SDK" (Test-Path $androidHome) $androidHome "Run setup-android-enhanced.ps1"

# Test Android Studio
$androidStudio = "${env:ProgramFiles}\Android\Android Studio"
Test-Item "Android Studio" (Test-Path $androidStudio) $androidStudio "Install from https://developer.android.com/studio"

# Test Command Line Tools
$avdManager = "$androidHome\cmdline-tools\latest\bin\avdmanager.bat"
if (!(Test-Path $avdManager)) {
    $avdManager = "$androidHome\tools\bin\avdmanager.bat"
}
Test-Item "AVD Manager" (Test-Path $avdManager) $avdManager "Install Android SDK Command-line Tools"

# Test Emulator
$emulator = "$androidHome\emulator\emulator.exe"
Test-Item "Android Emulator" (Test-Path $emulator) $emulator "Install Android Emulator from SDK Manager"

# Test ADB
$adb = "$androidHome\platform-tools\adb.exe"
Test-Item "ADB Platform Tools" (Test-Path $adb) $adb "Install Android SDK Platform-Tools"

# Test System Resources
$totalRAM = [math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$freeSpace = [math]::Round((Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace / 1GB, 2)

Test-Item "System RAM ($totalRAM GB)" ($totalRAM -ge 8) "" "8GB+ recommended for emulator performance"
Test-Item "Disk Space ($freeSpace GB free)" ($freeSpace -ge 10) "" "10GB+ recommended for emulator storage"

# Test Node.js
try {
    $nodeVersion = node --version 2>$null
    Test-Item "Node.js" ($nodeVersion -ne $null) $nodeVersion "Install from https://nodejs.org"
} catch {
    Test-Item "Node.js" $false "" "Install from https://nodejs.org"
}

# Summary
Write-Host "📊 Test Summary" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "Passed: $passed/$total tests" -ForegroundColor Cyan
Write-Host ""

if ($passed -eq $total) {
    Write-Host "🎉 All tests passed! Ready for Android development!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create emulator: .\setup-android-emulator.ps1 -CreateRecommended" -ForegroundColor Cyan
    Write-Host "2. Start emulator: .\manage-emulators.ps1 -Quick" -ForegroundColor Cyan
    Write-Host "3. Run app: npx expo start --android" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some components missing. See recommendations above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Quick fix: Run .\setup-android-enhanced.ps1" -ForegroundColor Cyan
}

Write-Host ""
