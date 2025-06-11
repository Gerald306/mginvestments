# Android Emulator Management Script for MG Investments
# Quick commands for daily emulator management

param(
    [switch]$Start,
    [switch]$Stop,
    [switch]$List,
    [switch]$Delete,
    [switch]$Restart,
    [switch]$Status,
    [string]$Name,
    [switch]$Quick
)

Write-Host "🎮 MG Investments - Emulator Manager" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Set up Android paths
$androidSdkPath = $env:ANDROID_HOME
if (!$androidSdkPath) {
    $androidSdkPath = "${env:LOCALAPPDATA}\Android\Sdk"
}

$emulatorPath = "$androidSdkPath\emulator\emulator.exe"
$adbPath = "$androidSdkPath\platform-tools\adb.exe"
$avdManagerPath = "$androidSdkPath\cmdline-tools\latest\bin\avdmanager.bat"

# Alternative paths
if (!(Test-Path $avdManagerPath)) {
    $avdManagerPath = "$androidSdkPath\tools\bin\avdmanager.bat"
}

# Function to get available AVDs
function Get-AvailableAVDs {
    if (Test-Path $avdManagerPath) {
        $avds = & $avdManagerPath list avd -c 2>$null
        return $avds | Where-Object { $_ -ne "" }
    }
    return @()
}

# Function to get running emulators
function Get-RunningEmulators {
    if (Test-Path $adbPath) {
        $devices = & $adbPath devices 2>$null
        $emulators = $devices | Select-String "emulator-" | ForEach-Object { 
            $_.ToString().Split()[0] 
        }
        return $emulators
    }
    return @()
}

# Function to start emulator
function Start-Emulator {
    param($EmulatorName)
    
    $availableAVDs = Get-AvailableAVDs
    
    if (!$EmulatorName) {
        if ($availableAVDs.Count -eq 0) {
            Write-Host "❌ No emulators found!" -ForegroundColor Red
            Write-Host "Run: .\setup-android-emulator.ps1 -CreateRecommended" -ForegroundColor Yellow
            return
        }
        
        Write-Host "📱 Available emulators:" -ForegroundColor Yellow
        for ($i = 0; $i -lt $availableAVDs.Count; $i++) {
            Write-Host "  $($i + 1). $($availableAVDs[$i])" -ForegroundColor Cyan
        }
        
        $choice = Read-Host "Enter number or emulator name"
        
        if ($choice -match '^\d+$') {
            $index = [int]$choice - 1
            if ($index -ge 0 -and $index -lt $availableAVDs.Count) {
                $EmulatorName = $availableAVDs[$index]
            }
        } else {
            $EmulatorName = $choice
        }
    }
    
    if ($EmulatorName -notin $availableAVDs) {
        Write-Host "❌ Emulator '$EmulatorName' not found!" -ForegroundColor Red
        return
    }
    
    # Check if already running
    $runningEmulators = Get-RunningEmulators
    if ($runningEmulators.Count -gt 0) {
        Write-Host "⚠️  Another emulator is already running:" -ForegroundColor Yellow
        $runningEmulators | ForEach-Object { Write-Host "  • $_" -ForegroundColor Cyan }
        
        $continue = Read-Host "Continue anyway? (y/N)"
        if ($continue -ne 'y' -and $continue -ne 'Y') {
            return
        }
    }
    
    Write-Host "🚀 Starting emulator: $EmulatorName" -ForegroundColor Green
    Write-Host "This may take 2-3 minutes..." -ForegroundColor Yellow
    
    # Optimized emulator settings for MG Investments
    $args = @(
        "-avd", $EmulatorName,
        "-gpu", "auto",
        "-memory", "2048",
        "-cores", "4",
        "-no-snapshot-save",
        "-wipe-data"
    )
    
    Start-Process -FilePath $emulatorPath -ArgumentList $args
    
    Write-Host "✅ Emulator starting..." -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Wait for emulator to fully boot" -ForegroundColor Cyan
    Write-Host "  2. Run: npx expo start --android" -ForegroundColor Cyan
    Write-Host "  3. Test MG Investments mobile app" -ForegroundColor Cyan
}

# Function to stop emulators
function Stop-Emulators {
    $runningEmulators = Get-RunningEmulators
    
    if ($runningEmulators.Count -eq 0) {
        Write-Host "✅ No emulators currently running" -ForegroundColor Green
        return
    }
    
    Write-Host "🛑 Stopping emulators..." -ForegroundColor Yellow
    foreach ($emulator in $runningEmulators) {
        Write-Host "Stopping $emulator..." -ForegroundColor Cyan
        & $adbPath -s $emulator emu kill 2>$null
    }
    
    Write-Host "✅ All emulators stopped" -ForegroundColor Green
}

# Function to show status
function Show-Status {
    Write-Host "📊 Emulator Status" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    
    # Available AVDs
    $availableAVDs = Get-AvailableAVDs
    Write-Host ""
    Write-Host "📱 Available Emulators ($($availableAVDs.Count)):" -ForegroundColor Green
    if ($availableAVDs.Count -eq 0) {
        Write-Host "  None found. Run setup-android-emulator.ps1 -CreateRecommended" -ForegroundColor Yellow
    } else {
        $availableAVDs | ForEach-Object { Write-Host "  • $_" -ForegroundColor Cyan }
    }
    
    # Running emulators
    $runningEmulators = Get-RunningEmulators
    Write-Host ""
    Write-Host "🏃 Running Emulators ($($runningEmulators.Count)):" -ForegroundColor Green
    if ($runningEmulators.Count -eq 0) {
        Write-Host "  None running" -ForegroundColor Gray
    } else {
        $runningEmulators | ForEach-Object { Write-Host "  • $_" -ForegroundColor Cyan }
    }
    
    # System info
    Write-Host ""
    Write-Host "🔧 System Info:" -ForegroundColor Green
    Write-Host "  Android SDK: $androidSdkPath" -ForegroundColor Cyan
    Write-Host "  Emulator: $(Test-Path $emulatorPath)" -ForegroundColor Cyan
    Write-Host "  ADB: $(Test-Path $adbPath)" -ForegroundColor Cyan
}

# Function to list emulators with details
function List-Emulators {
    Write-Host "📋 Detailed Emulator List" -ForegroundColor Yellow
    Write-Host "=========================" -ForegroundColor Yellow
    
    if (Test-Path $avdManagerPath) {
        & $avdManagerPath list avd
    } else {
        Write-Host "❌ AVD Manager not found" -ForegroundColor Red
    }
}

# Function to delete emulator
function Delete-Emulator {
    param($EmulatorName)
    
    $availableAVDs = Get-AvailableAVDs
    
    if (!$EmulatorName) {
        if ($availableAVDs.Count -eq 0) {
            Write-Host "❌ No emulators found to delete!" -ForegroundColor Red
            return
        }
        
        Write-Host "📱 Available emulators:" -ForegroundColor Yellow
        for ($i = 0; $i -lt $availableAVDs.Count; $i++) {
            Write-Host "  $($i + 1). $($availableAVDs[$i])" -ForegroundColor Cyan
        }
        
        $choice = Read-Host "Enter number or emulator name to delete"
        
        if ($choice -match '^\d+$') {
            $index = [int]$choice - 1
            if ($index -ge 0 -and $index -lt $availableAVDs.Count) {
                $EmulatorName = $availableAVDs[$index]
            }
        } else {
            $EmulatorName = $choice
        }
    }
    
    if ($EmulatorName -notin $availableAVDs) {
        Write-Host "❌ Emulator '$EmulatorName' not found!" -ForegroundColor Red
        return
    }
    
    $confirm = Read-Host "Are you sure you want to delete '$EmulatorName'? (y/N)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        Write-Host "🗑️  Deleting emulator: $EmulatorName" -ForegroundColor Yellow
        & $avdManagerPath delete avd -n $EmulatorName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Emulator deleted successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to delete emulator" -ForegroundColor Red
        }
    }
}

# Quick start function
function Quick-Start {
    Write-Host "🚀 Quick Start - MG Investments Testing" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    
    $availableAVDs = Get-AvailableAVDs
    $runningEmulators = Get-RunningEmulators
    
    # Check if emulator is already running
    if ($runningEmulators.Count -gt 0) {
        Write-Host "✅ Emulator already running!" -ForegroundColor Green
        Write-Host "Ready to test MG Investments mobile app" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "💡 Run: npx expo start --android" -ForegroundColor Yellow
        return
    }
    
    # Find recommended emulator
    $recommendedEmulator = $availableAVDs | Where-Object { $_ -like "*MG_Pixel*" } | Select-Object -First 1
    
    if (!$recommendedEmulator) {
        $recommendedEmulator = $availableAVDs | Select-Object -First 1
    }
    
    if (!$recommendedEmulator) {
        Write-Host "❌ No emulators found!" -ForegroundColor Red
        Write-Host "Run: .\setup-android-emulator.ps1 -CreateRecommended" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Starting recommended emulator: $recommendedEmulator" -ForegroundColor Cyan
    Start-Emulator -EmulatorName $recommendedEmulator
}

# Main execution
if ($Quick) {
    Quick-Start
} elseif ($Start) {
    Start-Emulator -EmulatorName $Name
} elseif ($Stop) {
    Stop-Emulators
} elseif ($List) {
    List-Emulators
} elseif ($Delete) {
    Delete-Emulator -EmulatorName $Name
} elseif ($Restart) {
    Stop-Emulators
    Start-Sleep -Seconds 3
    Start-Emulator -EmulatorName $Name
} elseif ($Status) {
    Show-Status
} else {
    # Show help
    Write-Host "📋 Emulator Management Commands:" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick Actions:" -ForegroundColor Green
    Write-Host "  .\manage-emulators.ps1 -Quick              # Quick start for testing" -ForegroundColor Cyan
    Write-Host "  .\manage-emulators.ps1 -Status             # Show current status" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Emulator Control:" -ForegroundColor Green
    Write-Host "  .\manage-emulators.ps1 -Start              # Start emulator (interactive)" -ForegroundColor Cyan
    Write-Host "  .\manage-emulators.ps1 -Start -Name 'MG_Pixel_4_API_30'" -ForegroundColor Cyan
    Write-Host "  .\manage-emulators.ps1 -Stop               # Stop all emulators" -ForegroundColor Cyan
    Write-Host "  .\manage-emulators.ps1 -Restart            # Restart emulator" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Management:" -ForegroundColor Green
    Write-Host "  .\manage-emulators.ps1 -List               # List all emulators" -ForegroundColor Cyan
    Write-Host "  .\manage-emulators.ps1 -Delete             # Delete emulator (interactive)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Most common: .\manage-emulators.ps1 -Quick" -ForegroundColor Yellow
}
