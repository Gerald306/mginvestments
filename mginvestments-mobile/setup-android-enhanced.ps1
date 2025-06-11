# Enhanced Android Studio Setup for MG Investments Mobile App
# Run as Administrator

param(
    [switch]$DownloadOnly,
    [switch]$ConfigureOnly,
    [switch]$CreateAVD
)

Write-Host "🚀 Enhanced Android Studio Setup for MG Investments" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to download file with progress
function Download-FileWithProgress {
    param($Url, $OutputPath, $Description)
    
    Write-Host "📥 Downloading $Description..." -ForegroundColor Yellow
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($Url, $OutputPath)
        Write-Host "✅ Downloaded successfully!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Download failed: $_" -ForegroundColor Red
        return $false
    }
}

# Check system requirements
Write-Host "🔍 Checking System Requirements..." -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

$osInfo = Get-WmiObject -Class Win32_OperatingSystem
$totalRAM = [math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$freeSpace = [math]::Round((Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace / 1GB, 2)

Write-Host "OS: $($osInfo.Caption)" -ForegroundColor Cyan
Write-Host "RAM: $totalRAM GB" -ForegroundColor Cyan
Write-Host "Free Space (C:): $freeSpace GB" -ForegroundColor Cyan
Write-Host ""

if ($totalRAM -lt 8) {
    Write-Host "⚠️  Warning: 8GB+ RAM recommended for Android development" -ForegroundColor Yellow
}

if ($freeSpace -lt 10) {
    Write-Host "❌ Error: At least 10GB free space required" -ForegroundColor Red
    exit 1
}

# Check if Android Studio is installed
$androidStudioPath = "${env:ProgramFiles}\Android\Android Studio"
$androidStudioInstalled = Test-Path $androidStudioPath

Write-Host "📱 Android Studio Status:" -ForegroundColor Yellow
if ($androidStudioInstalled) {
    Write-Host "✅ Android Studio found at: $androidStudioPath" -ForegroundColor Green
} else {
    Write-Host "❌ Android Studio not found" -ForegroundColor Red
}

# Check Android SDK
$androidSdkPath = "${env:LOCALAPPDATA}\Android\Sdk"
$androidSdkInstalled = Test-Path $androidSdkPath

Write-Host "🔧 Android SDK Status:" -ForegroundColor Yellow
if ($androidSdkInstalled) {
    Write-Host "✅ Android SDK found at: $androidSdkPath" -ForegroundColor Green
} else {
    Write-Host "❌ Android SDK not found" -ForegroundColor Red
}

# Check environment variables
Write-Host "🌍 Environment Variables:" -ForegroundColor Yellow
$androidHome = [Environment]::GetEnvironmentVariable("ANDROID_HOME", "User")
if ($androidHome) {
    Write-Host "✅ ANDROID_HOME: $androidHome" -ForegroundColor Green
} else {
    Write-Host "❌ ANDROID_HOME not set" -ForegroundColor Red
}

Write-Host ""

# Download Android Studio if not installed
if (!$androidStudioInstalled -and !$ConfigureOnly) {
    Write-Host "📥 Downloading Android Studio..." -ForegroundColor Yellow
    Write-Host "=================================" -ForegroundColor Yellow
    
    $downloadUrl = "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.28/android-studio-2023.1.1.28-windows.exe"
    $downloadPath = "$env:TEMP\android-studio-installer.exe"
    
    if (Download-FileWithProgress $downloadUrl $downloadPath "Android Studio") {
        Write-Host ""
        Write-Host "🚀 Starting Android Studio installation..." -ForegroundColor Green
        Write-Host "Please follow the installation wizard:" -ForegroundColor Yellow
        Write-Host "1. Choose 'Standard' installation type" -ForegroundColor Cyan
        Write-Host "2. Accept license agreements" -ForegroundColor Cyan
        Write-Host "3. Wait for SDK components to download" -ForegroundColor Cyan
        Write-Host ""
        
        if (!$DownloadOnly) {
            Start-Process -FilePath $downloadPath -Wait
            Write-Host "✅ Android Studio installation completed!" -ForegroundColor Green
        } else {
            Write-Host "📁 Installer saved to: $downloadPath" -ForegroundColor Cyan
            Write-Host "Run the installer manually when ready." -ForegroundColor Yellow
        }
    }
}

# Configure environment variables
if (!$DownloadOnly) {
    Write-Host "🔧 Configuring Environment Variables..." -ForegroundColor Yellow
    Write-Host "=======================================" -ForegroundColor Yellow
    
    # Set ANDROID_HOME
    if (!$androidHome) {
        [Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
        $env:ANDROID_HOME = $androidSdkPath
        Write-Host "✅ Set ANDROID_HOME to: $androidSdkPath" -ForegroundColor Green
    }
    
    # Update PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    $pathsToAdd = @(
        "$androidSdkPath\platform-tools",
        "$androidSdkPath\tools",
        "$androidSdkPath\tools\bin",
        "$androidSdkPath\emulator"
    )
    
    $pathUpdated = $false
    foreach ($pathToAdd in $pathsToAdd) {
        if ($currentPath -notlike "*$pathToAdd*") {
            $currentPath += ";$pathToAdd"
            $pathUpdated = $true
            Write-Host "➕ Added to PATH: $pathToAdd" -ForegroundColor Green
        }
    }
    
    if ($pathUpdated) {
        [Environment]::SetEnvironmentVariable("PATH", $currentPath, "User")
        Write-Host "✅ PATH updated successfully!" -ForegroundColor Green
    }
}

# Create AVD (Android Virtual Device)
if ($CreateAVD -and (Test-Command "avdmanager")) {
    Write-Host "📱 Creating Android Virtual Device..." -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Yellow
    
    $avdName = "MG_Investments_Pixel_4"
    $systemImage = "system-images;android-30;google_apis;x86_64"
    
    Write-Host "Creating AVD: $avdName" -ForegroundColor Cyan
    
    # Create AVD
    & avdmanager create avd -n $avdName -k $systemImage -d "pixel_4" --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AVD created successfully!" -ForegroundColor Green
        Write-Host "📱 You can now start the emulator with:" -ForegroundColor Cyan
        Write-Host "   emulator -avd $avdName" -ForegroundColor White
    } else {
        Write-Host "❌ Failed to create AVD" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Android Setup Summary" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

if ($androidStudioInstalled) {
    Write-Host "✅ Android Studio: Installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Android Studio: Needs installation" -ForegroundColor Yellow
}

if ($androidSdkInstalled) {
    Write-Host "✅ Android SDK: Configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  Android SDK: Needs setup" -ForegroundColor Yellow
}

if ([Environment]::GetEnvironmentVariable("ANDROID_HOME", "User")) {
    Write-Host "✅ Environment Variables: Configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  Environment Variables: Need setup" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor Cyan
Write-Host "2. Open Android Studio and complete setup" -ForegroundColor Cyan
Write-Host "3. Install SDK platforms (API 30, 31, 33)" -ForegroundColor Cyan
Write-Host "4. Create a virtual device (Pixel 4 recommended)" -ForegroundColor Cyan
Write-Host "5. Test with: npx expo start --android" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Happy Android development!" -ForegroundColor Green
