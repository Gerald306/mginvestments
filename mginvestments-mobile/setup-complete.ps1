# Complete Setup Script for MG Investments Mobile App
# This script guides you through the entire setup process

Write-Host "🚀 MG Investments Mobile App - Complete Setup Guide" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to prompt user for input
function Get-UserInput {
    param($Prompt, $Default = "")
    if ($Default) {
        $input = Read-Host "$Prompt [$Default]"
        if ([string]::IsNullOrWhiteSpace($input)) { return $Default }
        return $input
    } else {
        return Read-Host $Prompt
    }
}

Write-Host "📋 Setup Checklist:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "1. ✅ Android Studio Setup" -ForegroundColor Cyan
Write-Host "2. ✅ App Branding & Theme Configuration" -ForegroundColor Cyan
Write-Host "3. ⚠️  Firebase Configuration (Manual)" -ForegroundColor Yellow
Write-Host "4. ⚠️  Production Build Setup (Manual)" -ForegroundColor Yellow
Write-Host ""

# Check prerequisites
Write-Host "🔍 Checking Prerequisites..." -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

$nodeInstalled = Test-Command "node"
$npmInstalled = Test-Command "npm"
$expoInstalled = Test-Command "expo"

Write-Host "Node.js: $(if($nodeInstalled){'✅ Installed'}else{'❌ Not Found'})" -ForegroundColor $(if($nodeInstalled){'Green'}else{'Red'})
Write-Host "NPM: $(if($npmInstalled){'✅ Installed'}else{'❌ Not Found'})" -ForegroundColor $(if($npmInstalled){'Green'}else{'Red'})
Write-Host "Expo CLI: $(if($expoInstalled){'✅ Installed'}else{'❌ Not Found'})" -ForegroundColor $(if($expoInstalled){'Green'}else{'Red'})

if (!$nodeInstalled -or !$npmInstalled) {
    Write-Host ""
    Write-Host "❌ Missing Prerequisites!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (!$expoInstalled) {
    Write-Host ""
    Write-Host "📦 Installing Expo CLI..." -ForegroundColor Yellow
    npm install -g @expo/cli
}

Write-Host ""
Write-Host "✅ Prerequisites check complete!" -ForegroundColor Green
Write-Host ""

# 1. Android Studio Setup
Write-Host "📱 1. ANDROID STUDIO SETUP" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green
Write-Host ""
Write-Host "For Android development, you need Android Studio installed." -ForegroundColor Yellow
Write-Host ""
$androidChoice = Get-UserInput "Do you want to set up Android development? (y/n)" "y"

if ($androidChoice -eq "y") {
    Write-Host ""
    Write-Host "🔧 Running Android setup script..." -ForegroundColor Yellow
    if (Test-Path ".\setup-android.ps1") {
        & ".\setup-android.ps1"
    } else {
        Write-Host "❌ Android setup script not found!" -ForegroundColor Red
        Write-Host "Please run setup-android.ps1 manually for Android setup." -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping Android setup. You can run setup-android.ps1 later." -ForegroundColor Yellow
}

Write-Host ""

# 2. App Branding
Write-Host "🎨 2. APP BRANDING & THEME" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Theme configuration completed!" -ForegroundColor Green
Write-Host "   • MG Investments branding applied" -ForegroundColor Cyan
Write-Host "   • Role-based color themes configured" -ForegroundColor Cyan
Write-Host "   • App package names updated" -ForegroundColor Cyan
Write-Host "   • Theme context provider added" -ForegroundColor Cyan
Write-Host ""

# 3. Firebase Configuration
Write-Host "🔥 3. FIREBASE CONFIGURATION" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Manual configuration required!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Steps to complete Firebase setup:" -ForegroundColor Cyan
Write-Host "1. Go to Firebase Console: https://console.firebase.google.com/" -ForegroundColor White
Write-Host "2. Create/select your project" -ForegroundColor White
Write-Host "3. Add mobile app to project" -ForegroundColor White
Write-Host "4. Copy configuration to src/config/firebase.ts" -ForegroundColor White
Write-Host "5. Enable Authentication, Firestore, and Storage" -ForegroundColor White
Write-Host ""
Write-Host "📖 Detailed guide: FIREBASE_SETUP.md" -ForegroundColor Yellow
Write-Host ""

$firebaseChoice = Get-UserInput "Have you completed Firebase setup? (y/n)" "n"
if ($firebaseChoice -eq "y") {
    Write-Host "✅ Firebase configuration marked as complete!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Remember to complete Firebase setup before testing!" -ForegroundColor Yellow
}

Write-Host ""

# 4. Production Build Setup
Write-Host "🏗️  4. PRODUCTION BUILD SETUP" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Build configuration files created!" -ForegroundColor Green
Write-Host "   • eas.json configured for development, preview, and production" -ForegroundColor Cyan
Write-Host "   • Build profiles set up for Android and iOS" -ForegroundColor Cyan
Write-Host "   • Deployment guide created" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Detailed guide: BUILD_DEPLOYMENT.md" -ForegroundColor Yellow
Write-Host ""

# Install dependencies
Write-Host "📦 5. INSTALLING DEPENDENCIES" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "Installing project dependencies..." -ForegroundColor Yellow

try {
    npm install --legacy-peer-deps
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error installing dependencies!" -ForegroundColor Red
    Write-Host "Please run 'npm install --legacy-peer-deps' manually." -ForegroundColor Yellow
}

Write-Host ""

# Final instructions
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Your MG Investments mobile app is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Complete Firebase configuration (see FIREBASE_SETUP.md)" -ForegroundColor Cyan
Write-Host "2. Test the app:" -ForegroundColor Cyan
Write-Host "   • Run: npx expo start" -ForegroundColor White
Write-Host "   • Use Expo Go app on your phone" -ForegroundColor White
Write-Host "   • Or set up Android emulator" -ForegroundColor White
Write-Host ""
Write-Host "3. For production deployment:" -ForegroundColor Cyan
Write-Host "   • See BUILD_DEPLOYMENT.md" -ForegroundColor White
Write-Host "   • Install EAS CLI: npm install -g @expo/eas-cli" -ForegroundColor White
Write-Host "   • Build: eas build --platform all" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-Host "• README.md - Main documentation" -ForegroundColor Cyan
Write-Host "• ANDROID_SETUP.md - Android development setup" -ForegroundColor Cyan
Write-Host "• FIREBASE_SETUP.md - Firebase configuration" -ForegroundColor Cyan
Write-Host "• BUILD_DEPLOYMENT.md - Production deployment" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Happy coding!" -ForegroundColor Green
