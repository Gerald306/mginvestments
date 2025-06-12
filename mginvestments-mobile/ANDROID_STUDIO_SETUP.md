# 🤖 Android Studio Emulator Setup - MG Investments

## 🚀 **Quick Setup Guide**

### **Method 1: Automated Setup (Recommended)**
```powershell
# Run the automated setup script
.\setup-android-studio.ps1
```

### **Method 2: Manual Setup**

## 📋 **Step-by-Step Manual Setup**

### **Step 1: Verify Android Studio Installation**

1. **Open Android Studio**
2. **Check SDK Location**:
   - Go to `File` → `Settings` (or `Android Studio` → `Preferences` on Mac)
   - Navigate to `Appearance & Behavior` → `System Settings` → `Android SDK`
   - Note the **SDK Location** (usually `C:\Users\[USERNAME]\AppData\Local\Android\Sdk`)

### **Step 2: Set Up Environment Variables**

1. **Open System Environment Variables**:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click `Environment Variables`

2. **Add ANDROID_HOME**:
   - Click `New` under System Variables
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\[USERNAME]\AppData\Local\Android\Sdk` (your SDK path)

3. **Update PATH**:
   - Find `Path` in System Variables, click `Edit`
   - Add these paths:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\emulator`

4. **Restart PowerShell/Command Prompt**

### **Step 3: Create Android Virtual Device (AVD)**

1. **Open Android Studio**
2. **Open AVD Manager**:
   - Go to `Tools` → `AVD Manager`
   - Or click the phone icon in the toolbar

3. **Create New Virtual Device**:
   - Click `Create Virtual Device`
   - **Phone Category**: Select `Pixel 4` or `Pixel 6`
   - Click `Next`

4. **Choose System Image**:
   - Select `R (API level 30)` or `S (API level 31)`
   - If not downloaded, click `Download` next to it
   - Click `Next`

5. **Configure AVD**:
   - **AVD Name**: `MG_Investments_Pixel_4`
   - **Startup Orientation**: Portrait
   - **Advanced Settings** (optional):
     - RAM: 2048 MB
     - Internal Storage: 6 GB
     - SD Card: 512 MB
   - Click `Finish`

### **Step 4: Start the Emulator**

1. **In AVD Manager**:
   - Find your created emulator
   - Click the ▶️ **Play** button
   - Wait for the emulator to fully boot (may take 2-3 minutes first time)

2. **Verify Emulator is Running**:
   ```powershell
   # Check if emulator is detected
   adb devices
   ```
   You should see something like:
   ```
   List of devices attached
   emulator-5554    device
   ```

### **Step 5: Connect Expo to Android Emulator**

#### **Option A: Using Current Expo Server**
If Expo is already running from the previous QR code setup:

1. **In the Expo terminal**, press `a` to open Android
2. The app will automatically install and run on your emulator

#### **Option B: Start Fresh with Android Focus**
```powershell
# Stop current Expo server (Ctrl+C)
# Start with Android focus
npx expo start --android
```

#### **Option C: Use Both (Recommended)**
```powershell
# Start Expo normally
npx expo start

# Then press 'a' for Android when emulator is ready
```

## 🔧 **Troubleshooting**

### **Common Issues and Solutions**

#### **1. "adb not found" Error**
```powershell
# Check if Android SDK is in PATH
echo $env:ANDROID_HOME
echo $env:PATH

# If not found, add manually:
$env:PATH += ";C:\Users\[USERNAME]\AppData\Local\Android\Sdk\platform-tools"
```

#### **2. "No devices found" Error**
- Make sure emulator is fully booted (Android home screen visible)
- Try restarting ADB:
  ```powershell
  adb kill-server
  adb start-server
  adb devices
  ```

#### **3. Emulator Won't Start**
- **Enable Virtualization** in BIOS (Intel VT-x or AMD-V)
- **Disable Hyper-V** if using Intel HAXM:
  ```powershell
  # Run as Administrator
  bcdedit /set hypervisorlaunchtype off
  # Restart computer
  ```

#### **4. Expo App Won't Install**
- Clear Expo cache:
  ```powershell
  npx expo start --clear
  ```
- Restart emulator
- Try installing manually:
  ```powershell
  adb install [path-to-expo-app.apk]
  ```

#### **5. Performance Issues**
- **Increase RAM**: Edit AVD → Advanced → RAM: 3072 MB
- **Enable Hardware Acceleration**: AVD → Advanced → Graphics: Hardware - GLES 2.0
- **Close other applications** to free up system resources

## 🎯 **Recommended Emulator Configurations**

### **For Development (Recommended)**
- **Device**: Pixel 4
- **API Level**: 30 (Android 11)
- **RAM**: 2048 MB
- **Storage**: 6 GB
- **Graphics**: Hardware - GLES 2.0

### **For Testing Latest Features**
- **Device**: Pixel 6
- **API Level**: 33 (Android 13)
- **RAM**: 3072 MB
- **Storage**: 8 GB

### **For Performance Testing**
- **Device**: Pixel 4a
- **API Level**: 29 (Android 10)
- **RAM**: 1536 MB (simulates lower-end devices)

## 📱 **Testing Your App on Emulator**

### **Advantages of Emulator vs Phone**
✅ **Faster Development**: No need to scan QR codes  
✅ **Better Debugging**: Access to Chrome DevTools  
✅ **Multiple Devices**: Test different screen sizes  
✅ **Network Simulation**: Test slow/offline conditions  
✅ **Hardware Simulation**: Camera, GPS, sensors  

### **Testing Checklist**
- [ ] App installs successfully
- [ ] Navigation works smoothly
- [ ] Touch interactions are responsive
- [ ] Keyboard input functions properly
- [ ] Firebase authentication works
- [ ] Network requests complete successfully
- [ ] App handles orientation changes
- [ ] Performance is acceptable (no lag)

## 🚀 **Advanced Setup**

### **Multiple Emulators for Testing**
Create different emulators for comprehensive testing:

1. **Phone - Pixel 4** (API 30) - Primary development
2. **Tablet - Pixel C** (API 30) - Tablet layout testing
3. **Old Device - Nexus 5** (API 28) - Compatibility testing
4. **Latest - Pixel 7** (API 33) - Latest features testing

### **Emulator Shortcuts**
- **Ctrl + M**: Open developer menu
- **F2**: Rename emulator
- **Ctrl + Shift + P**: Power button
- **Ctrl + H**: Home button
- **Ctrl + B**: Back button

## 📞 **Getting Help**

### **Useful Commands**
```powershell
# List all emulators
emulator -list-avds

# Start specific emulator
emulator -avd MG_Investments_Pixel_4

# Check connected devices
adb devices

# Install APK manually
adb install app.apk

# View logs
adb logcat

# Restart ADB
adb kill-server && adb start-server
```

### **Resources**
- [Android Studio AVD Manager](https://developer.android.com/studio/run/managing-avds)
- [Expo Android Development](https://docs.expo.dev/workflow/android-studio-emulator/)
- [ADB Commands Reference](https://developer.android.com/studio/command-line/adb)

---

**Ready to develop on Android emulator!** 🤖📱
