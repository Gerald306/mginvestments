# 🚀 Quick Start Guide - MG Investments Mobile App

This guide will help you quickly set up Firebase, Android emulator, and test your app features.

## 🔥 **Step 1: Firebase Configuration**

### **1.1 Get Firebase Credentials**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: "MG Investments Mobile"
3. Click the gear icon → **Project Settings**
4. Scroll to "Your apps" section
5. Click **Add app** → **Web app** (`</>` icon)
6. Register app name: "MG Investments Mobile"
7. Copy the configuration object

### **1.2 Configure Your App**
Edit the file `.env` in your mobile app folder:

```env
# Replace with your actual Firebase credentials
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=mg-investments-12345.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=mg-investments-12345
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=mg-investments-12345.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

### **1.3 Enable Firebase Services**
In Firebase Console:
1. **Authentication** → Get started → Sign-in method → Email/Password → Enable
2. **Firestore Database** → Create database → Start in test mode
3. **Storage** → Get started → Start in test mode

## 📱 **Step 2: Android Emulator Setup**

### **2.1 Install Android Studio**
1. Download from [Android Studio](https://developer.android.com/studio)
2. Run installer with default settings
3. Open Android Studio → Complete setup wizard
4. Install recommended SDK components

### **2.2 Create Virtual Device**
1. Open Android Studio
2. **Tools** → **AVD Manager**
3. **Create Virtual Device**
4. Choose **Pixel 4** → **Next**
5. Download **API 30 (Android 11)** → **Next**
6. Name: "MG_Investments_Pixel4" → **Finish**

### **2.3 Alternative: Use Our Scripts**
```powershell
# Install Android Studio automatically
.\setup-android-enhanced.ps1

# Create recommended emulator
.\setup-android-emulator.ps1 -CreateRecommended

# Quick start emulator
.\manage-emulators.ps1 -Quick
```

## 🧪 **Step 3: Testing App Features**

### **3.1 Start Development Server**
```bash
# Start web version
npx expo start --web

# Start with Android (after emulator is running)
npx expo start --android
```

### **3.2 Test Firebase Integration**
1. Open your app in browser: http://localhost:19006
2. Navigate to **Admin** section (if available)
3. Look for **Firebase Test** option
4. Click **Run Firebase Tests**
5. Check results for:
   - ✅ Firebase connection
   - ✅ Authentication
   - ✅ Firestore operations

### **3.3 Test Core App Features**

#### **Authentication Flow**
1. **Registration**:
   - Go to Sign Up screen
   - Enter test email: `test@mginvestments.com`
   - Enter password: `TestPassword123!`
   - Select role: Teacher/School/Admin
   - Submit registration

2. **Login**:
   - Go to Login screen
   - Use the same credentials
   - Verify successful login

#### **Navigation Testing**
1. **Tab Navigation**:
   - Test all bottom tabs
   - Verify smooth transitions
   - Check role-based navigation

2. **Screen Navigation**:
   - Navigate between screens
   - Test back button functionality
   - Verify proper state management

#### **UI Components Testing**
1. **Enhanced Components**:
   - Test new Button variants
   - Try Input validation
   - Check Card layouts
   - Verify theme consistency

2. **Responsive Design**:
   - Resize browser window
   - Test on different screen sizes
   - Check mobile layout

### **3.4 Android Emulator Testing**
1. **Start Emulator**:
   ```powershell
   .\manage-emulators.ps1 -Quick
   ```

2. **Run App on Android**:
   ```bash
   npx expo start --android
   ```

3. **Test Mobile Features**:
   - Touch interactions
   - Keyboard input
   - Navigation gestures
   - Performance

## 🔍 **Troubleshooting**

### **Firebase Issues**
- **Connection Failed**: Check `.env` file credentials
- **Auth Errors**: Verify Email/Password is enabled in Firebase Console
- **Firestore Errors**: Ensure database is created and rules allow read/write

### **Android Issues**
- **Emulator Won't Start**: Check hardware acceleration (Hyper-V/Intel HAXM)
- **App Won't Install**: Restart ADB: `adb kill-server && adb start-server`
- **Slow Performance**: Allocate more RAM to emulator (2GB+)

### **Development Server Issues**
- **Port Conflicts**: Try different port: `npx expo start --port 19007`
- **Cache Issues**: Clear cache: `npx expo start --clear`
- **Module Errors**: Reinstall: `rm -rf node_modules && npm install`

## ✅ **Feature Testing Checklist**

### **Core Functionality**
- [ ] User registration and login
- [ ] Role-based navigation (Teacher/School/Admin)
- [ ] Firebase data synchronization
- [ ] Real-time updates
- [ ] Offline functionality

### **UI/UX Testing**
- [ ] Button interactions and variants
- [ ] Input validation and error handling
- [ ] Card layouts and styling
- [ ] Theme consistency
- [ ] Responsive design

### **Platform Testing**
- [ ] Web browser functionality
- [ ] Android emulator performance
- [ ] Touch interactions
- [ ] Keyboard navigation
- [ ] Screen orientations

### **Performance Testing**
- [ ] App startup time (< 3 seconds)
- [ ] Navigation smoothness (60 FPS)
- [ ] Memory usage (< 200MB)
- [ ] Network request speed
- [ ] Firebase response times

## 🎯 **Success Criteria**

Your setup is successful when:
1. ✅ Firebase tests pass completely
2. ✅ App loads without console errors
3. ✅ Authentication works end-to-end
4. ✅ Navigation is smooth and responsive
5. ✅ Android emulator runs the app properly

## 📞 **Getting Help**

If you encounter issues:
1. Check the **TROUBLESHOOTING.md** file
2. Review browser console for errors
3. Test with different emulator configurations
4. Verify Firebase project settings

## 🎉 **Next Steps**

After successful testing:
1. **Customize UI** further based on your needs
2. **Add more features** to the app
3. **Optimize performance** for production
4. **Deploy to app stores** when ready

---

**Happy Testing!** 🚀

Your MG Investments mobile app is ready for comprehensive development and testing!
