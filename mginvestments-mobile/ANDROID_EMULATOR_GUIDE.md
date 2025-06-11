# 📱 Android Emulator Setup Guide - MG Investments Mobile App

This guide will help you set up and configure Android emulators specifically optimized for testing the MG Investments mobile app.

## 🚀 **Quick Start (Recommended)**

### **1. One-Command Setup**
```powershell
# Create recommended emulator for MG Investments
.\setup-android-emulator.ps1 -CreateRecommended
```

### **2. Start Testing**
```powershell
# Quick start emulator
.\manage-emulators.ps1 -Quick

# Start your app
npx expo start --android
```

## 📋 **Prerequisites**

Before setting up emulators, ensure you have:

- ✅ **Android Studio installed** (run `.\setup-android-enhanced.ps1`)
- ✅ **Android SDK configured** (ANDROID_HOME environment variable)
- ✅ **At least 8GB RAM** (16GB recommended)
- ✅ **10GB+ free disk space**
- ✅ **Hardware acceleration enabled** (Intel HAXM or Hyper-V)

## 🎯 **Recommended Emulator Configurations**

### **Primary Testing Device**
- **Name**: `MG_Pixel_4_API_30`
- **Device**: Pixel 4
- **Android Version**: 11 (API 30)
- **RAM**: 2GB
- **Storage**: 6GB
- **Use Case**: Primary development and testing

### **Latest Features Testing**
- **Name**: `MG_Pixel_6_API_33`
- **Device**: Pixel 6
- **Android Version**: 13 (API 33)
- **RAM**: 3GB
- **Storage**: 6GB
- **Use Case**: Testing latest Android features

### **Tablet Testing**
- **Name**: `MG_Tablet_API_30`
- **Device**: Pixel C Tablet
- **Android Version**: 11 (API 30)
- **RAM**: 2GB
- **Storage**: 6GB
- **Use Case**: Tablet layout testing

## 🔧 **Setup Commands**

### **Initial Setup**
```powershell
# Check system status
.\setup-android-emulator.ps1 -CheckStatus

# Install required packages
.\setup-android-emulator.ps1 -InstallPackages

# Create recommended emulator
.\setup-android-emulator.ps1 -CreateRecommended

# Create all test emulators
.\setup-android-emulator.ps1 -CreateAll
```

### **Daily Management**
```powershell
# Quick start for testing
.\manage-emulators.ps1 -Quick

# Check emulator status
.\manage-emulators.ps1 -Status

# Start specific emulator
.\manage-emulators.ps1 -Start -Name "MG_Pixel_4_API_30"

# Stop all emulators
.\manage-emulators.ps1 -Stop

# List all emulators
.\manage-emulators.ps1 -List
```

## 🎮 **Emulator Management**

### **Starting Emulators**
```powershell
# Interactive start (choose from list)
.\manage-emulators.ps1 -Start

# Start specific emulator
.\manage-emulators.ps1 -Start -Name "MG_Pixel_4_API_30"

# Quick start (auto-select best emulator)
.\manage-emulators.ps1 -Quick
```

### **Stopping Emulators**
```powershell
# Stop all running emulators
.\manage-emulators.ps1 -Stop

# Restart emulator
.\manage-emulators.ps1 -Restart -Name "MG_Pixel_4_API_30"
```

### **Maintenance**
```powershell
# Delete emulator (interactive)
.\manage-emulators.ps1 -Delete

# Delete specific emulator
.\manage-emulators.ps1 -Delete -Name "MG_Pixel_4_API_30"

# List detailed emulator info
.\setup-android-emulator.ps1 -ListDevices
```

## 🧪 **Testing MG Investments App**

### **1. Start Emulator**
```powershell
.\manage-emulators.ps1 -Quick
```

### **2. Start Development Server**
```powershell
# In your project directory
npx expo start --android
```

### **3. Test Key Features**
- **Authentication**: Login/Register flows
- **Navigation**: Tab navigation and screen transitions
- **Firebase**: Data sync and real-time updates
- **UI Components**: Buttons, inputs, cards
- **Responsive Design**: Different screen sizes

### **4. Performance Testing**
- **App startup time**
- **Navigation smoothness**
- **Memory usage**
- **Network requests**

## 🔍 **Troubleshooting**

### **Emulator Won't Start**
```powershell
# Check system status
.\setup-android-emulator.ps1 -CheckStatus

# Verify Android SDK
echo $env:ANDROID_HOME

# Check available emulators
.\manage-emulators.ps1 -List
```

### **Slow Performance**
1. **Increase RAM allocation**:
   - Edit emulator settings
   - Allocate more RAM (2GB minimum)

2. **Enable hardware acceleration**:
   - Ensure Intel HAXM or Hyper-V is enabled
   - Check GPU acceleration settings

3. **Close other applications**:
   - Free up system resources
   - Close unnecessary programs

### **App Won't Install**
```powershell
# Check ADB connection
adb devices

# Restart ADB server
adb kill-server
adb start-server

# Clear Expo cache
npx expo start --clear
```

### **Network Issues**
1. **Check emulator network settings**
2. **Verify firewall settings**
3. **Test with different emulator**

## ⚡ **Performance Optimization**

### **Emulator Settings**
- **RAM**: 2GB minimum, 4GB for better performance
- **CPU Cores**: 4 cores recommended
- **GPU**: Hardware acceleration enabled
- **Storage**: 6GB+ for app data

### **Host System**
- **Close unnecessary applications**
- **Ensure adequate RAM (8GB+ total)**
- **Use SSD for better I/O performance**
- **Enable virtualization in BIOS**

### **Development Workflow**
```powershell
# Quick development cycle
.\manage-emulators.ps1 -Quick          # Start emulator
npx expo start --android               # Start app
# Make changes and test
.\manage-emulators.ps1 -Stop           # Stop when done
```

## 📊 **Testing Checklist**

### **Device Compatibility**
- [ ] Phone layout (Pixel 4)
- [ ] Tablet layout (Pixel C)
- [ ] Different screen densities
- [ ] Portrait and landscape orientations

### **Android Versions**
- [ ] Android 11 (API 30) - Primary target
- [ ] Android 13 (API 33) - Latest features
- [ ] Older versions if needed

### **App Features**
- [ ] User authentication
- [ ] Data synchronization
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Camera/media access
- [ ] Location services

### **Performance**
- [ ] App startup time < 3 seconds
- [ ] Smooth navigation (60 FPS)
- [ ] Memory usage < 200MB
- [ ] Network requests complete quickly

## 🎯 **Best Practices**

### **Development**
1. **Use recommended emulator** for consistent testing
2. **Test on multiple screen sizes** regularly
3. **Monitor performance** during development
4. **Test offline scenarios** frequently

### **Emulator Management**
1. **Stop emulators** when not in use to save resources
2. **Wipe data** periodically for clean testing
3. **Update system images** regularly
4. **Backup important emulator configurations**

### **Debugging**
1. **Use Chrome DevTools** for web debugging
2. **Enable USB debugging** for device testing
3. **Monitor logs** with `adb logcat`
4. **Use React Native Debugger** for advanced debugging

## 🚀 **Next Steps**

After setting up emulators:

1. **Test Firebase integration** with the test suite
2. **Verify all app features** work correctly
3. **Test performance** under different conditions
4. **Prepare for production deployment**

## 📞 **Support**

If you encounter issues:

1. **Check troubleshooting section** above
2. **Review console logs** for error messages
3. **Test with different emulator configurations**
4. **Consult Android Studio documentation**

---

**Happy Testing!** 🎉

Your MG Investments mobile app is now ready for comprehensive Android testing across multiple device configurations.
