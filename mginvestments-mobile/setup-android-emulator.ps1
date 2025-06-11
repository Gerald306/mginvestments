# Android Emulator Configuration Script for MG Investments Mobile App
# Run as Administrator for best results

param(
    [switch]$ListDevices,
    [switch]$CreateRecommended,
    [switch]$CreateAll,
    [switch]$StartEmulator,
    [string]$EmulatorName,
    [switch]$InstallPackages,
    [switch]$CheckStatus
)

Write-Host "📱 Android Emulator Configuration for MG Investments" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Check if Android SDK is available
$androidSdkPath = $env:ANDROID_HOME
if (!$androidSdkPath) {
    $androidSdkPath = "${env:LOCALAPPDATA}\Android\Sdk"
}

if (!(Test-Path $androidSdkPath)) {
    Write-Host "❌ Android SDK not found!" -ForegroundColor Red
    Write-Host "Please run setup-android-enhanced.ps1 first to install Android Studio and SDK" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Android SDK found at: $androidSdkPath" -ForegroundColor Green
$env:ANDROID_HOME = $androidSdkPath

# Set up paths
$avdManagerPath = "$androidSdkPath\cmdline-tools\latest\bin\avdmanager.bat"
$sdkManagerPath = "$androidSdkPath\cmdline-tools\latest\bin\sdkmanager.bat"
$emulatorPath = "$androidSdkPath\emulator\emulator.exe"

# Alternative paths if cmdline-tools are in different location
if (!(Test-Path $avdManagerPath)) {
    $avdManagerPath = "$androidSdkPath\tools\bin\avdmanager.bat"
    $sdkManagerPath = "$androidSdkPath\tools\bin\sdkmanager.bat"
}

# Function to check if command exists
function Test-AndroidCommand {
    param($CommandPath, $CommandName)
    
    if (Test-Path $CommandPath) {
        Write-Host "✅ $CommandName found" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $CommandName not found at $CommandPath" -ForegroundColor Red
        return $false
    }
}

# Check required tools
Write-Host "🔍 Checking Android tools..." -ForegroundColor Yellow
$avdManagerExists = Test-AndroidCommand $avdManagerPath "AVD Manager"
$sdkManagerExists = Test-AndroidCommand $sdkManagerPath "SDK Manager"
$emulatorExists = Test-AndroidCommand $emulatorPath "Emulator"

if (!$avdManagerExists -or !$sdkManagerExists -or !$emulatorExists) {
    Write-Host ""
    Write-Host "⚠️  Some Android tools are missing. Please ensure:" -ForegroundColor Yellow
    Write-Host "1. Android Studio is properly installed" -ForegroundColor Cyan
    Write-Host "2. Android SDK Command-line Tools are installed" -ForegroundColor Cyan
    Write-Host "3. Android Emulator is installed" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 You can install these from Android Studio SDK Manager" -ForegroundColor Cyan
}

# Recommended emulator configurations for MG Investments
$recommendedEmulators = @(
    @{
        Name = "MG_Pixel_4_API_30"
        SystemImage = "system-images;android-30;google_apis;x86_64"
        Device = "pixel_4"
        DisplayName = "Pixel 4 (Android 11) - Recommended for testing"
        RAM = "2048"
        Heap = "512"
        Storage = "6144"
    },
    @{
        Name = "MG_Pixel_6_API_33"
        SystemImage = "system-images;android-33;google_apis;x86_64"
        Device = "pixel_6"
        DisplayName = "Pixel 6 (Android 13) - Latest features"
        RAM = "3072"
        Heap = "512"
        Storage = "6144"
    },
    @{
        Name = "MG_Tablet_API_30"
        SystemImage = "system-images;android-30;google_apis;x86_64"
        Device = "pixel_c"
        DisplayName = "Pixel C Tablet (Android 11) - Tablet testing"
        RAM = "2048"
        Heap = "512"
        Storage = "6144"
    }
)

# Function to install system images
function Install-SystemImages {
    Write-Host "📦 Installing required system images..." -ForegroundColor Yellow
    
    $systemImages = @(
        "system-images;android-30;google_apis;x86_64",
        "system-images;android-33;google_apis;x86_64",
        "platforms;android-30",
        "platforms;android-33",
        "build-tools;30.0.3",
        "build-tools;33.0.0"
    )
    
    foreach ($image in $systemImages) {
        Write-Host "Installing $image..." -ForegroundColor Cyan
        & $sdkManagerPath $image --verbose
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $image installed successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Failed to install $image" -ForegroundColor Yellow
        }
    }
}

# Function to create AVD
function Create-AVD {
    param($Config)
    
    Write-Host "Creating emulator: $($Config.DisplayName)" -ForegroundColor Cyan
    
    # Check if AVD already exists
    $existingAVDs = & $avdManagerPath list avd -c
    if ($existingAVDs -contains $Config.Name) {
        Write-Host "⚠️  AVD '$($Config.Name)' already exists. Deleting..." -ForegroundColor Yellow
        & $avdManagerPath delete avd -n $Config.Name
    }
    
    # Create the AVD
    $createCommand = @(
        "create", "avd",
        "-n", $Config.Name,
        "-k", $Config.SystemImage,
        "-d", $Config.Device,
        "--force"
    )
    
    Write-Host "Command: avdmanager $($createCommand -join ' ')" -ForegroundColor Gray
    & $avdManagerPath @createCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AVD '$($Config.Name)' created successfully" -ForegroundColor Green
        
        # Configure AVD settings
        $avdPath = "$env:USERPROFILE\.android\avd\$($Config.Name).avd"
        $configPath = "$avdPath\config.ini"
        
        if (Test-Path $configPath) {
            Write-Host "⚙️  Configuring AVD settings..." -ForegroundColor Cyan
            
            # Read current config
            $configContent = Get-Content $configPath
            
            # Update or add settings
            $newConfig = @()
            $settingsToUpdate = @{
                "hw.ramSize" = $Config.RAM
                "vm.heapSize" = $Config.Heap
                "disk.dataPartition.size" = "$($Config.Storage)MB"
                "hw.keyboard" = "yes"
                "hw.gpu.enabled" = "yes"
                "hw.gpu.mode" = "auto"
                "showDeviceFrame" = "yes"
                "hw.camera.back" = "webcam0"
                "hw.camera.front" = "webcam0"
            }
            
            # Process existing config
            foreach ($line in $configContent) {
                $updated = $false
                foreach ($setting in $settingsToUpdate.GetEnumerator()) {
                    if ($line.StartsWith("$($setting.Key)=")) {
                        $newConfig += "$($setting.Key)=$($setting.Value)"
                        $updated = $true
                        break
                    }
                }
                if (!$updated) {
                    $newConfig += $line
                }
            }
            
            # Add missing settings
            foreach ($setting in $settingsToUpdate.GetEnumerator()) {
                $exists = $configContent | Where-Object { $_.StartsWith("$($setting.Key)=") }
                if (!$exists) {
                    $newConfig += "$($setting.Key)=$($setting.Value)"
                }
            }
            
            # Write updated config
            $newConfig | Set-Content $configPath
            Write-Host "✅ AVD configuration updated" -ForegroundColor Green
        }
        
    } else {
        Write-Host "❌ Failed to create AVD '$($Config.Name)'" -ForegroundColor Red
    }
}

# Function to list available devices
function Show-AvailableDevices {
    Write-Host "📱 Available Device Definitions:" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    
    & $avdManagerPath list device -c
    
    Write-Host ""
    Write-Host "📋 Existing AVDs:" -ForegroundColor Yellow
    Write-Host "=================" -ForegroundColor Yellow
    
    & $avdManagerPath list avd
}

# Function to start emulator
function Start-AndroidEmulator {
    param($EmulatorName)
    
    if (!$EmulatorName) {
        Write-Host "Available emulators:" -ForegroundColor Yellow
        & $avdManagerPath list avd -c
        Write-Host ""
        $EmulatorName = Read-Host "Enter emulator name to start"
    }
    
    Write-Host "🚀 Starting emulator: $EmulatorName" -ForegroundColor Green
    
    # Start emulator with optimized settings
    $emulatorArgs = @(
        "-avd", $EmulatorName,
        "-gpu", "auto",
        "-skin", "1080x1920",
        "-memory", "2048",
        "-cores", "4"
    )
    
    Write-Host "Command: emulator $($emulatorArgs -join ' ')" -ForegroundColor Gray
    Start-Process -FilePath $emulatorPath -ArgumentList $emulatorArgs -NoNewWindow
    
    Write-Host "✅ Emulator starting... This may take a few minutes" -ForegroundColor Green
    Write-Host "💡 Once started, you can run: npx expo start --android" -ForegroundColor Cyan
}

# Function to check system status
function Check-SystemStatus {
    Write-Host "🔍 System Status Check" -ForegroundColor Yellow
    Write-Host "======================" -ForegroundColor Yellow
    
    # Check Android SDK
    Write-Host "Android SDK: $androidSdkPath" -ForegroundColor Cyan
    
    # Check available system images
    Write-Host ""
    Write-Host "📦 Installed System Images:" -ForegroundColor Yellow
    & $sdkManagerPath --list_installed | Select-String "system-images"
    
    # Check existing AVDs
    Write-Host ""
    Write-Host "📱 Existing AVDs:" -ForegroundColor Yellow
    & $avdManagerPath list avd -c
    
    # Check running emulators
    Write-Host ""
    Write-Host "🏃 Running Emulators:" -ForegroundColor Yellow
    & $emulatorPath -list-avds
}

# Main execution logic
if ($CheckStatus) {
    Check-SystemStatus
    exit 0
}

if ($ListDevices) {
    Show-AvailableDevices
    exit 0
}

if ($InstallPackages) {
    Install-SystemImages
    exit 0
}

if ($StartEmulator) {
    Start-AndroidEmulator -EmulatorName $EmulatorName
    exit 0
}

if ($CreateRecommended) {
    Write-Host "🎯 Creating recommended emulator for MG Investments..." -ForegroundColor Green
    Install-SystemImages
    Create-AVD -Config $recommendedEmulators[0]
    
    Write-Host ""
    Write-Host "✅ Recommended emulator created!" -ForegroundColor Green
    Write-Host "To start it, run: .\setup-android-emulator.ps1 -StartEmulator -EmulatorName '$($recommendedEmulators[0].Name)'" -ForegroundColor Cyan
    exit 0
}

if ($CreateAll) {
    Write-Host "🎯 Creating all recommended emulators for MG Investments..." -ForegroundColor Green
    Install-SystemImages
    
    foreach ($config in $recommendedEmulators) {
        Create-AVD -Config $config
        Write-Host ""
    }
    
    Write-Host "✅ All emulators created!" -ForegroundColor Green
    Write-Host "Available emulators:" -ForegroundColor Cyan
    foreach ($config in $recommendedEmulators) {
        Write-Host "  • $($config.Name) - $($config.DisplayName)" -ForegroundColor White
    }
    exit 0
}

# Default: Show help
Write-Host "📋 Android Emulator Configuration Options:" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Quick Setup:" -ForegroundColor Green
Write-Host "  .\setup-android-emulator.ps1 -CreateRecommended    # Create recommended emulator" -ForegroundColor Cyan
Write-Host "  .\setup-android-emulator.ps1 -CreateAll           # Create all test emulators" -ForegroundColor Cyan
Write-Host ""
Write-Host "Management:" -ForegroundColor Green
Write-Host "  .\setup-android-emulator.ps1 -ListDevices         # List available devices" -ForegroundColor Cyan
Write-Host "  .\setup-android-emulator.ps1 -CheckStatus         # Check system status" -ForegroundColor Cyan
Write-Host "  .\setup-android-emulator.ps1 -InstallPackages     # Install required packages" -ForegroundColor Cyan
Write-Host ""
Write-Host "Emulator Control:" -ForegroundColor Green
Write-Host "  .\setup-android-emulator.ps1 -StartEmulator       # Start emulator (interactive)" -ForegroundColor Cyan
Write-Host "  .\setup-android-emulator.ps1 -StartEmulator -EmulatorName 'MG_Pixel_4_API_30'" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Recommended: Start with -CreateRecommended for best MG Investments testing experience" -ForegroundColor Yellow
