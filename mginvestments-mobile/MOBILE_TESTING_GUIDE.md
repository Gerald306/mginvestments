# 📱 Mobile Testing Guide - MG Investments App

## 🚀 **Quick Start: Test on Your Phone**

### **Method 1: Automated Script (Recommended)**
```powershell
# Run the mobile testing script
.\start-expo-mobile.ps1
```

### **Method 2: Manual Commands**
```bash
# Option A: Tunnel mode (works across different networks)
npx expo start --tunnel

# Option B: LAN mode (same WiFi network required)
npx expo start

# Option C: Development mode
npx expo start --dev-client
```

## 📱 **Step-by-Step Phone Testing**

### **1. Install Expo Go App**
- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### **2. Prepare Your Environment**
```bash
# Make sure you're in the mobile app directory
cd mginvestments-mobile

# Install dependencies if needed
npm install --legacy-peer-deps

# Clear cache if you have issues
npx expo start --clear
```

### **3. Start Development Server**
```bash
# Start with QR code generation
npx expo start --tunnel
```

### **4. Connect Your Phone**

#### **Option A: QR Code Scanning**
1. Run the command above
2. Wait for QR code to appear in terminal
3. Open Expo Go app on your phone
4. Tap "Scan QR Code"
5. Point camera at the QR code
6. App will load automatically

#### **Option B: Manual Connection**
1. Note the URL from terminal (e.g., `exp://192.168.1.100:19000`)
2. Open Expo Go app
3. Tap "Enter URL manually"
4. Type the URL from terminal
5. Tap "Connect"

#### **Option C: Development Build**
1. If you have a development build installed
2. The app will automatically reload
3. No QR code needed

## 🔧 **Troubleshooting**

### **QR Code Not Working**
```bash
# Try tunnel mode
npx expo start --tunnel

# Or try clearing cache
npx expo start --clear --tunnel

# Check network connectivity
npx expo doctor
```

### **Connection Issues**
1. **Same WiFi Network**: Ensure phone and computer are on same network
2. **Firewall**: Check if firewall is blocking connections
3. **VPN**: Disable VPN if active
4. **Router Settings**: Some routers block device communication

### **App Loading Issues**
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check for errors
npx expo doctor
```

## 📊 **Testing Checklist for Phone**

### **Basic Functionality**
- [ ] App loads without crashes
- [ ] Login/registration screens work
- [ ] Navigation between tabs functions
- [ ] Touch interactions are responsive
- [ ] Keyboard input works properly

### **Mobile-Specific Features**
- [ ] Touch gestures (tap, swipe, pinch)
- [ ] Virtual keyboard behavior
- [ ] Screen orientation changes
- [ ] App backgrounding/foregrounding
- [ ] Performance on actual device

### **UI/UX on Mobile**
- [ ] Text is readable on small screen
- [ ] Buttons are appropriately sized
- [ ] Forms are easy to fill out
- [ ] Navigation is intuitive
- [ ] Loading states are clear

### **Performance Testing**
- [ ] App starts quickly (< 5 seconds)
- [ ] Smooth scrolling and animations
- [ ] No memory leaks during use
- [ ] Responsive to user interactions
- [ ] Stable during extended use

## 🎯 **Mobile Testing Scenarios**

### **Scenario 1: Teacher Registration on Phone**
1. Open app on phone
2. Navigate to registration
3. Fill out teacher profile using phone keyboard
4. Upload profile photo (if feature exists)
5. Complete registration process
6. Test login with new account

### **Scenario 2: Job Search on Mobile**
1. Login as teacher
2. Browse available jobs
3. Use search and filter features
4. Apply for positions
5. Check application status
6. Test notifications (if implemented)

### **Scenario 3: School Management on Tablet**
1. Login as school administrator
2. Post new job openings
3. Review teacher applications
4. Manage school profile
5. Test responsive design on larger screen

## 🔍 **Mobile-Specific Issues to Watch For**

### **Performance Issues**
- Slow loading times
- Laggy animations
- High memory usage
- Battery drain
- Overheating

### **UI/UX Issues**
- Text too small to read
- Buttons too small to tap
- Forms difficult to fill
- Navigation confusing
- Inconsistent styling

### **Functionality Issues**
- Features not working on mobile
- Keyboard covering input fields
- Touch targets too small
- Gestures not recognized
- Orientation issues

## 📱 **Device Testing Matrix**

### **Recommended Test Devices**
- **iPhone**: iPhone 12/13/14 (iOS 15+)
- **Android**: Samsung Galaxy S21+ (Android 11+)
- **Tablet**: iPad Air (iPadOS 15+)
- **Budget Phone**: Older Android device (Android 9+)

### **Screen Sizes to Test**
- **Small**: 5.4" (iPhone 13 mini)
- **Medium**: 6.1" (iPhone 13)
- **Large**: 6.7" (iPhone 13 Pro Max)
- **Tablet**: 10.9" (iPad Air)

## 🚀 **Advanced Mobile Testing**

### **Development Build Testing**
```bash
# Create development build for more native testing
npx expo run:ios
npx expo run:android
```

### **Performance Profiling**
- Use React Native Performance Monitor
- Check memory usage in device settings
- Monitor network requests
- Test with slow network conditions

### **Real Device Testing**
- Test on multiple device types
- Check different OS versions
- Verify across screen sizes
- Test with various network conditions

## 📞 **Getting Help**

### **Common Commands**
```bash
# Start development server
npx expo start

# Start with tunnel (for different networks)
npx expo start --tunnel

# Clear cache and restart
npx expo start --clear

# Check for issues
npx expo doctor

# View logs
npx expo logs
```

### **Useful Resources**
- [Expo Go Documentation](https://docs.expo.dev/get-started/expo-go/)
- [React Native Testing Guide](https://reactnative.dev/docs/testing-overview)
- [Mobile App Testing Best Practices](https://docs.expo.dev/guides/testing-with-jest/)

---

**Happy Mobile Testing!** 📱

Your MG Investments app is ready for comprehensive mobile device testing!
