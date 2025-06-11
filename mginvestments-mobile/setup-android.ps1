# Android Studio Setup Script for MG Investments Mobile App
# Run this script as Administrator

Write-Host "🚀 Setting up Android Development Environment for MG Investments" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Function to download file
function Download-File {
    param($url, $output)
    Write-Host "📥 Downloading $output..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host "✅ Downloaded successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Download failed: $_" -ForegroundColor Red
        return $false
    }
    return $true
}

# Check if Android Studio is already installed
$androidStudioPath = "${env:ProgramFiles}\Android\Android Studio"
if (Test-Path $androidStudioPath) {
    Write-Host "✅ Android Studio is already installed at: $androidStudioPath" -ForegroundColor Green
} else {
    Write-Host "📱 Android Studio not found. Please download and install manually:" -ForegroundColor Yellow
    Write-Host "   1. Go to: https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host "   2. Download Android Studio" -ForegroundColor Cyan
    Write-Host "   3. Run the installer with default settings" -ForegroundColor Cyan
    Write-Host "   4. Choose 'Standard' installation type" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Have you installed Android Studio? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Please install Android Studio first and run this script again." -ForegroundColor Yellow
        exit 1
    }
}

# Set Android SDK path
$androidSdkPath = "${env:LOCALAPPDATA}\Android\Sdk"
Write-Host "🔧 Setting up Android SDK at: $androidSdkPath" -ForegroundColor Yellow

# Create Android SDK directory if it doesn't exist
if (!(Test-Path $androidSdkPath)) {
    New-Item -ItemType Directory -Path $androidSdkPath -Force | Out-Null
}

# Set environment variables
Write-Host "🌍 Setting environment variables..." -ForegroundColor Yellow

# Set ANDROID_HOME
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
$env:ANDROID_HOME = $androidSdkPath

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# Add Android SDK paths to PATH if not already present
$pathsToAdd = @(
    "$androidSdkPath\platform-tools",
    "$androidSdkPath\tools",
    "$androidSdkPath\tools\bin"
)

foreach ($pathToAdd in $pathsToAdd) {
    if ($currentPath -notlike "*$pathToAdd*") {
        $currentPath += ";$pathToAdd"
        Write-Host "➕ Added to PATH: $pathToAdd" -ForegroundColor Green
    } else {
        Write-Host "✅ Already in PATH: $pathToAdd" -ForegroundColor Green
    }
}

# Update PATH
[Environment]::SetEnvironmentVariable("PATH", $currentPath, "User")

Write-Host ""
Write-Host "✅ Environment variables configured!" -ForegroundColor Green
Write-Host "   ANDROID_HOME = $androidSdkPath" -ForegroundColor Cyan
Write-Host ""

# Instructions for manual setup
Write-Host "📋 Next Steps (Manual Setup Required):" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Android Studio" -ForegroundColor Cyan
Write-Host "2. Go to File → Settings → Appearance & Behavior → System Settings → Android SDK" -ForegroundColor Cyan
Write-Host "3. In 'SDK Platforms' tab, install:" -ForegroundColor Cyan
Write-Host "   ✓ Android 11 (API level 30)" -ForegroundColor White
Write-Host "   ✓ Android 12 (API level 31)" -ForegroundColor White
Write-Host "   ✓ Android 13 (API level 33)" -ForegroundColor White
Write-Host ""
Write-Host "4. In 'SDK Tools' tab, install:" -ForegroundColor Cyan
Write-Host "   ✓ Android SDK Build-Tools" -ForegroundColor White
Write-Host "   ✓ Android Emulator" -ForegroundColor White
Write-Host "   ✓ Android SDK Platform-Tools" -ForegroundColor White
Write-Host "   ✓ Intel x86 Emulator Accelerator (HAXM)" -ForegroundColor White
Write-Host ""
Write-Host "5. Create Virtual Device:" -ForegroundColor Cyan
Write-Host "   • Tools → AVD Manager → Create Virtual Device" -ForegroundColor White
Write-Host "   • Choose Pixel 4 or Pixel 6" -ForegroundColor White
Write-Host "   • Select Android 11 (API 30) or higher" -ForegroundColor White
Write-Host "   • Start the emulator" -ForegroundColor White
Write-Host ""
Write-Host "6. Test the setup:" -ForegroundColor Cyan
Write-Host "   • Restart PowerShell/Command Prompt" -ForegroundColor White
Write-Host "   • Run: adb version" -ForegroundColor White
Write-Host "   • Run: npx expo start" -ForegroundColor White
Write-Host "   • Press 'a' to open on Android emulator" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Setup script completed!" -ForegroundColor Green
Write-Host "Please restart your terminal and follow the manual steps above." -ForegroundColor Yellow
