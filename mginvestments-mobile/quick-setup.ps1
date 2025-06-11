# Quick Setup Script for MG Investments Mobile App
# This script helps you get started quickly

param(
    [switch]$Firebase,
    [switch]$Android,
    [switch]$All
)

Write-Host "🚀 MG Investments Mobile App - Quick Setup" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

if ($All) {
    $Firebase = $true
    $Android = $true
}

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the mginvestments-mobile directory" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Firebase setup
if ($Firebase) {
    Write-Host "🔥 Setting up Firebase..." -ForegroundColor Yellow
    Write-Host "=========================" -ForegroundColor Yellow
    
    if (Test-Path "configure-firebase.js") {
        Write-Host "Starting Firebase configuration wizard..." -ForegroundColor Cyan
        node configure-firebase.js
    } else {
        Write-Host "❌ Firebase configuration script not found" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "📋 Firebase Setup Checklist:" -ForegroundColor Yellow
    Write-Host "1. ✅ Run Firebase configuration wizard" -ForegroundColor Green
    Write-Host "2. ⚠️  Enable Authentication in Firebase Console" -ForegroundColor Yellow
    Write-Host "3. ⚠️  Create Firestore database" -ForegroundColor Yellow
    Write-Host "4. ⚠️  Set up Storage bucket" -ForegroundColor Yellow
    Write-Host "5. ⚠️  Configure security rules" -ForegroundColor Yellow
    Write-Host ""
}

# Android setup
if ($Android) {
    Write-Host "📱 Setting up Android development..." -ForegroundColor Yellow
    Write-Host "====================================" -ForegroundColor Yellow
    
    # Check if Android Studio is installed
    $androidStudioPath = "${env:ProgramFiles}\Android\Android Studio"
    if (Test-Path $androidStudioPath) {
        Write-Host "✅ Android Studio found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Android Studio not found" -ForegroundColor Yellow
        Write-Host "Run setup-android-enhanced.ps1 to install Android Studio" -ForegroundColor Cyan
    }
    
    # Check Android SDK
    $androidSdkPath = "${env:LOCALAPPDATA}\Android\Sdk"
    if (Test-Path $androidSdkPath) {
        Write-Host "✅ Android SDK found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Android SDK not found" -ForegroundColor Yellow
    }
    
    # Check environment variables
    $androidHome = [Environment]::GetEnvironmentVariable("ANDROID_HOME", "User")
    if ($androidHome) {
        Write-Host "✅ ANDROID_HOME configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  ANDROID_HOME not set" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "📋 Android Setup Checklist:" -ForegroundColor Yellow
    Write-Host "1. ⚠️  Install Android Studio" -ForegroundColor Yellow
    Write-Host "2. ⚠️  Install Android SDK (API 30, 31, 33)" -ForegroundColor Yellow
    Write-Host "3. ⚠️  Create Android Virtual Device" -ForegroundColor Yellow
    Write-Host "4. ⚠️  Set environment variables" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Run: .\setup-android-enhanced.ps1 for automated setup" -ForegroundColor Cyan
    Write-Host ""
}

# Test the app
Write-Host "🧪 Testing the app..." -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow

# Check TypeScript
Write-Host "Checking TypeScript..." -ForegroundColor Cyan
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript check passed" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript errors found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup Summary" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host ""

Write-Host "📱 Ready to start development:" -ForegroundColor Yellow
Write-Host "  npx expo start          # Start development server" -ForegroundColor Cyan
Write-Host "  npx expo start --web    # Start web version" -ForegroundColor Cyan
Write-Host "  npx expo start --android # Start Android version" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 Configuration files:" -ForegroundColor Yellow
Write-Host "  📄 .env.example         # Environment variables template" -ForegroundColor Cyan
Write-Host "  🔥 src/config/firebase.ts # Firebase configuration" -ForegroundColor Cyan
Write-Host "  🎨 src/config/theme.ts  # Theme configuration" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "  📖 README.md           # General setup guide" -ForegroundColor Cyan
Write-Host "  🔧 TROUBLESHOOTING.md  # Common issues and solutions" -ForegroundColor Cyan
Write-Host "  🔥 FIREBASE_SETUP.md   # Firebase configuration guide" -ForegroundColor Cyan
Write-Host "  📱 ANDROID_SETUP.md    # Android development guide" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Happy coding with MG Investments!" -ForegroundColor Green

# Show next steps based on what was set up
if (!$Firebase -and !$Android) {
    Write-Host ""
    Write-Host "💡 Quick start options:" -ForegroundColor Yellow
    Write-Host "  .\quick-setup.ps1 -Firebase  # Set up Firebase only" -ForegroundColor Cyan
    Write-Host "  .\quick-setup.ps1 -Android   # Set up Android only" -ForegroundColor Cyan
    Write-Host "  .\quick-setup.ps1 -All       # Set up everything" -ForegroundColor Cyan
}
