# 📱 Android Setup Guide for MG Investments Mobile App

This guide will help you set up Android development environment and run the MG Investments mobile app on Android simulator.

## 🎯 **Quick Start Options**

### Option 1: Use Expo Go App (Easiest - No Setup Required)
1. Install Expo Go on your Android phone from Google Play Store
2. Run `npx expo start` in the project directory
3. Scan the QR code with Expo Go app
4. App will load instantly on your phone

### Option 2: Android Studio Setup (Full Development Environment)

## 🔧 **Android Studio Installation**

### Step 1: Download and Install Android Studio
1. Go to https://developer.android.com/studio
2. Download Android Studio for Windows
3. Run the installer and follow the setup wizard
4. Choose "Standard" installation type

### Step 2: Configure Android SDK
1. Open Android Studio
2. Go to **File → Settings** (or **Android Studio → Preferences** on Mac)
3. Navigate to **Appearance & Behavior → System Settings → Android SDK**
4. In **SDK Platforms** tab, install:
   - Android 11 (API level 30)
   - Android 12 (API level 31)
   - Android 13 (API level 33)
5. In **SDK Tools** tab, install:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Intel x86 Emulator Accelerator (HAXM installer)

### Step 3: Set Environment Variables
1. Open **System Properties → Advanced → Environment Variables**
2. Add new system variable:
   - **Variable name**: `ANDROID_HOME`
   - **Variable value**: `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`
3. Edit **PATH** variable and add:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

### Step 4: Create Android Virtual Device (AVD)
1. In Android Studio, go to **Tools → AVD Manager**
2. Click **Create Virtual Device**
3. Choose **Phone** category
4. Select **Pixel 4** or **Pixel 6**
5. Choose **Android 11** (API level 30) or higher
6. Click **Next** and **Finish**
7. Start the emulator by clicking the **Play** button

## 🚀 **Running the App**

### Method 1: Using Expo CLI
```bash
# Navigate to mobile app directory
cd mginvestments-mobile

# Install dependencies (if not done already)
npm install --legacy-peer-deps

# Start Expo development server
npx expo start

# Press 'a' to open on Android emulator
# Or scan QR code with Expo Go app on physical device
```

### Method 2: Direct Android Build
```bash
# Build and run on Android
npx expo run:android
```

### Method 3: Web Preview (for testing)
```bash
# Run in web browser
npx expo start --web
```

## 🔍 **Troubleshooting**

### Issue: "adb is not recognized"
**Solution**: Make sure Android SDK platform-tools are in your PATH
```bash
# Check if adb is accessible
adb version

# If not found, add to PATH:
# %ANDROID_HOME%\platform-tools
```

### Issue: "Android SDK not found"
**Solution**: Set ANDROID_HOME environment variable
```bash
# Set environment variable
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
```

### Issue: Emulator won't start
**Solution**: 
1. Enable Hyper-V in Windows Features
2. Install Intel HAXM
3. Enable hardware acceleration in BIOS

### Issue: Metro bundler fails to start
**Solution**:
```bash
# Clear Metro cache
npx expo start --clear

# Or reset project
npx expo start --reset-cache
```

## 📱 **Testing the App Features**

Once the app is running, you can test:

### 🔐 Authentication
- Register as Teacher or School
- Login with credentials
- Test forgot password flow

### 👨‍🏫 Teacher Portal
- View dashboard with statistics
- Search for job opportunities
- Manage profile information
- Check notifications

### 🏫 School Portal
- Access school dashboard
- Search for qualified teachers
- Post job opportunities
- Review applications

### 👑 Admin Portal
- Platform analytics
- User management
- System administration

## 🎨 **Customization**

### Update App Icon
Replace files in `assets/` folder:
- `icon.png` - App icon
- `adaptive-icon.png` - Android adaptive icon
- `splash-icon.png` - Splash screen

### Modify App Configuration
Edit `app.json`:
```json
{
  "expo": {
    "name": "MG Investments",
    "slug": "mginvestments-mobile",
    "version": "1.0.0",
    "android": {
      "package": "com.mginvestments.mobile"
    }
  }
}
```

## 🚀 **Building for Production**

### Generate APK
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for Android
eas build --platform android
```

### Generate AAB (for Google Play)
```bash
# Build Android App Bundle
eas build --platform android --profile production
```

## 📞 **Support**

If you encounter issues:
1. Check Expo documentation: https://docs.expo.dev/
2. Android Studio documentation: https://developer.android.com/studio/intro
3. Create an issue in the GitHub repository

---

**Happy coding! 🚀**
