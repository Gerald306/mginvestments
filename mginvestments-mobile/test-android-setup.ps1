# Test Android Setup for MG Investments Mobile App
# Verifies that Android development environment is properly configured

Write-Host "🧪 Testing Android Setup for MG Investments" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

$testResults = @()

# Function to add test result
function Add-TestResult {
    param($TestName, $Success, $Message, $Recommendation = "")
    
    $testResults += @{
        Name = $TestName
        Success = $Success
        Message = $Message
        Recommendation = $Recommendation
    }
    
    $status = if ($Success) { "✅" } else { "❌" }
    $color = if ($Success) { "Green" } else { "Red" }
    
    Write-Host "$status $TestName" -ForegroundColor $color
    Write-Host "   $Message" -ForegroundColor Gray
    
    if ($Recommendation -and !$Success) {
        Write-Host "   💡 $Recommendation" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Test 1: Android SDK
Write-Host "🔍 Testing Android SDK..." -ForegroundColor Yellow

$androidHome = $env:ANDROID_HOME
if (!$androidHome) {
    $androidHome = "${env:LOCALAPPDATA}\Android\Sdk"
}

if (Test-Path $androidHome) {
    Add-TestResult "Android SDK" $true "Found at: $androidHome"
    $env:ANDROID_HOME = $androidHome
} else {
    Add-TestResult "Android SDK" $false "Not found" "Run setup-android-enhanced.ps1 to install Android Studio"
}

# Test 2: Android Studio
Write-Host "🔍 Testing Android Studio..." -ForegroundColor Yellow

$androidStudioPath = "${env:ProgramFiles}\Android\Android Studio"
if (Test-Path $androidStudioPath) {
    Add-TestResult "Android Studio" $true "Installed at: $androidStudioPath"
} else {
    Add-TestResult "Android Studio" $false "Not installed" "Run setup-android-enhanced.ps1 to install"
}

# Test 3: Command Line Tools
Write-Host "🔍 Testing Command Line Tools..." -ForegroundColor Yellow

$avdManagerPath = "$androidHome\cmdline-tools\latest\bin\avdmanager.bat"
if (!(Test-Path $avdManagerPath)) {
    $avdManagerPath = "$androidHome\tools\bin\avdmanager.bat"
}

if (Test-Path $avdManagerPath) {
    Add-TestResult "AVD Manager" $true "Command line tools available"
} else {
    Add-TestResult "AVD Manager" $false "Command line tools not found" "Install Android SDK Command-line Tools from Android Studio"
}

# Test 4: Emulator
Write-Host "🔍 Testing Android Emulator..." -ForegroundColor Yellow

$emulatorPath = "$androidHome\emulator\emulator.exe"
if (Test-Path $emulatorPath) {
    Add-TestResult "Android Emulator" $true "Emulator executable found"
} else {
    Add-TestResult "Android Emulator" $false "Emulator not found" "Install Android Emulator from Android Studio SDK Manager"
}

# Test 5: ADB
Write-Host "🔍 Testing ADB..." -ForegroundColor Yellow

$adbPath = "$androidHome\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Add-TestResult "ADB (Android Debug Bridge)" $true "Platform tools available"
} else {
    Add-TestResult "ADB (Android Debug Bridge)" $false "Platform tools not found" "Install Android SDK Platform-Tools"
}

# Test 6: System Images
Write-Host "🔍 Testing System Images..." -ForegroundColor Yellow

$systemImagesPath = "$androidHome\system-images"
if (Test-Path $systemImagesPath) {
    $images = Get-ChildItem $systemImagesPath -Directory | Measure-Object
    if ($images.Count -gt 0) {
        Add-TestResult "System Images" $true "$($images.Count) system image(s) found"
    } else {
        Add-TestResult "System Images" $false "No system images found" "Run setup-android-emulator.ps1 -InstallPackages"
    }
} else {
    Add-TestResult "System Images" $false "System images directory not found" "Install system images from Android Studio"
}

# Test 7: Existing AVDs
Write-Host "🔍 Testing Existing AVDs..." -ForegroundColor Yellow

if (Test-Path $avdManagerPath) {
    try {
        $avds = & $avdManagerPath list avd -c 2>$null
        $avdCount = ($avds | Where-Object { $_ -ne "" }).Count
        
        if ($avdCount -gt 0) {
            Add-TestResult "Android Virtual Devices" $true "$avdCount AVD(s) configured"
        } else {
            Add-TestResult "Android Virtual Devices" $false "No AVDs found" "Run setup-android-emulator.ps1 -CreateRecommended"
        }
    } catch {
        Add-TestResult "Android Virtual Devices" $false "Could not list AVDs" "Check AVD Manager installation"
    }
} else {
    Add-TestResult "Android Virtual Devices" $false "Cannot check AVDs - AVD Manager not found"
}

# Test 8: Hardware Acceleration
Write-Host "🔍 Testing Hardware Acceleration..." -ForegroundColor Yellow

# Check for Intel HAXM or Hyper-V
$haxmPath = "$androidHome\extras\intel\Hardware_Accelerated_Execution_Manager"
$hyperVEnabled = (Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All).State -eq "Enabled"

if ((Test-Path $haxmPath) -or $hyperVEnabled) {
    $accelerationType = if ($hyperVEnabled) { "Hyper-V" } else { "Intel HAXM" }
    Add-TestResult "Hardware Acceleration" $true "$accelerationType available"
} else {
    Add-TestResult "Hardware Acceleration" $false "No hardware acceleration found" "Enable Hyper-V or install Intel HAXM for better performance"
}

# Test 9: System Resources
Write-Host "🔍 Testing System Resources..." -ForegroundColor Yellow

$totalRAM = [math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$freeSpace = [math]::Round((Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace / 1GB, 2)

if ($totalRAM -ge 8) {
    Add-TestResult "System RAM" $true "$totalRAM GB available"
} else {
    Add-TestResult "System RAM" $false "$totalRAM GB available (8GB recommended)" "Consider upgrading RAM for better emulator performance"
}

if ($freeSpace -ge 10) {
    Add-TestResult "Disk Space" $true "$freeSpace GB free on C: drive"
} else {
    Add-TestResult "Disk Space" $false "$freeSpace GB free (10GB recommended)" "Free up disk space for emulator storage"
}

# Test 10: Node.js and Expo
Write-Host "🔍 Testing Development Environment..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Add-TestResult "Node.js" $true "Version: $nodeVersion"
    } else {
        Add-TestResult "Node.js" $false "Not installed" "Install Node.js for React Native development"
    }
} catch {
    Add-TestResult "Node.js" $false "Not found" "Install Node.js"
}

try {
    $expoVersion = npx expo --version 2>$null
    if ($expoVersion) {
        Add-TestResult "Expo CLI" $true "Version: $expoVersion"
    } else {
        Add-TestResult "Expo CLI" $false "Not available" "Expo CLI will be installed automatically"
    }
} catch {
    Add-TestResult "Expo CLI" $false "Not found" "Will be installed when needed"
}

# Summary
Write-Host "📊 Test Summary" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Success }).Count
$failedTests = $totalTests - $passedTests

Write-Host "Total Tests: $totalTests" -ForegroundColor Cyan
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "🎉 All tests passed! Your Android development environment is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create emulator: .\setup-android-emulator.ps1 -CreateRecommended" -ForegroundColor Cyan
    Write-Host "2. Start testing: .\manage-emulators.ps1 -Quick" -ForegroundColor Cyan
    Write-Host "3. Run your app: npx expo start --android" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some tests failed. Please address the issues above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Quick fixes:" -ForegroundColor Yellow
    
    $failedResults = $testResults | Where-Object { !$_.Success }
    foreach ($result in $failedResults) {
        if ($result.Recommendation) {
            Write-Host "• $($result.Name): $($result.Recommendation)" -ForegroundColor Cyan
        }
    }
    
    Write-Host ""
    Write-Host "💡 Run setup-android-enhanced.ps1 to fix most issues automatically" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 For detailed help, see:" -ForegroundColor Yellow
Write-Host "• ANDROID_EMULATOR_GUIDE.md - Complete setup guide" -ForegroundColor Cyan
Write-Host "• TROUBLESHOOTING.md - Common issues and solutions" -ForegroundColor Cyan
