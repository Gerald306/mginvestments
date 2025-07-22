# Android Development Setup Guide

This guide will help you set up Android development environment to run the MG Investments mobile app on Android simulator.

## 📱 Prerequisites

### 1. Install Android Studio
1. Download Android Studio from: https://developer.android.com/studio
2. Run the installer and follow the setup wizard
3. Make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - Intel x86 Emulator Accelerator (HAXM installer) - for Intel processors

### 2. Configure Android SDK
1. Open Android Studio
2. Go to **File > Settings** (or **Android Studio > Preferences** on macOS)
3. Navigate to **Appearance & Behavior > System Settings > Android SDK**
4. In the **SDK Platforms** tab, install:
   - Android 14 (API level 34)
   - Android 13 (API level 33)
   - Android 12 (API level 31)
5. In the **SDK Tools** tab, make sure these are installed:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Intel x86 Emulator Accelerator (HAXM installer)

### 3. Set Environment Variables
Add these to your system environment variables:

**Windows:**
1. Open System Properties > Advanced > Environment Variables
2. Add new system variables:
   - `ANDROID_HOME`: `C:\Users\[USERNAME]\AppData\Local\Android\Sdk`
   - `ANDROID_SDK_ROOT`: `C:\Users\[USERNAME]\AppData\Local\Android\Sdk`
3. Add to PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

**macOS/Linux:**
Add to your `~/.bashrc`, `~/.zshrc`, or `~/.profile`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 4. Create Android Virtual Device (AVD)
1. Open Android Studio
2. Go to **Tools > AVD Manager**
3. Click **Create Virtual Device**
4. Choose a device (recommended: Pixel 4 or Pixel 6)
5. Select a system image (recommended: Android 13 or 14)
6. Configure AVD settings:
   - Name: `MG_Investments_Emulator`
   - Startup orientation: Portrait
   - Enable hardware acceleration
7. Click **Finish**

## 🚀 Running the App on Android

### Method 1: Using Expo CLI (Recommended)
1. Make sure your Android emulator is running
2. In the mobile-app directory, run:
   ```bash
   npx expo start
   ```
3. Press `a` to open on Android
4. The app should automatically install and launch

### Method 2: Using ADB directly
1. Start your Android emulator
2. Check if device is connected:
   ```bash
   adb devices
   ```
3. Install Expo Go on the emulator:
   ```bash
   adb install expo-go.apk
   ```
4. Open Expo Go and scan the QR code from `npx expo start`

### Method 3: Using Development Build
1. Create a development build:
   ```bash
   npx expo run:android
   ```
2. This will build and install the app directly

## 🔧 Troubleshooting

### Common Issues:

**1. "adb not found" error:**
- Make sure Android SDK platform-tools are installed
- Check that PATH includes `%ANDROID_HOME%\platform-tools`
- Restart your terminal/command prompt

**2. Emulator won't start:**
- Enable Virtualization in BIOS (Intel VT-x or AMD-V)
- Install Intel HAXM or configure Hyper-V
- Increase emulator RAM allocation

**3. "SDK location not found":**
- Set ANDROID_HOME environment variable
- Point to correct SDK directory

**4. App crashes on startup:**
- Check Metro bundler logs
- Clear cache: `npx expo start --clear`
- Restart emulator

### Performance Tips:
- Allocate at least 4GB RAM to emulator
- Enable hardware acceleration
- Use x86_64 system images for better performance
- Close unnecessary applications while running emulator

## 📱 Alternative: Physical Device Testing

### Using Expo Go App:
1. Install Expo Go from Google Play Store
2. Enable Developer Options on your phone:
   - Go to Settings > About Phone
   - Tap Build Number 7 times
   - Go back to Settings > Developer Options
   - Enable USB Debugging
3. Connect phone via USB or use same WiFi network
4. Scan QR code from `npx expo start`

### Using Development Build on Physical Device:
1. Enable Developer Options and USB Debugging
2. Connect device via USB
3. Run: `npx expo run:android --device`

## 🎯 Quick Start Commands

```bash
# Start development server
npx expo start

# Run on Android (requires emulator/device)
npx expo run:android

# Build for Android
npx expo build:android

# Check connected devices
adb devices

# Start specific emulator
emulator -avd MG_Investments_Emulator
```

## 📞 Support

If you encounter issues:
1. Check the Expo documentation: https://docs.expo.dev/
2. Android Studio documentation: https://developer.android.com/studio/intro
3. React Native troubleshooting: https://reactnative.dev/docs/troubleshooting

---

**Note**: The first time you run the app, it may take several minutes to build and install. Subsequent runs will be much faster.
