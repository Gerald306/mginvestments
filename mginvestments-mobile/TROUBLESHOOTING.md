# 🔧 Troubleshooting Guide - MG Investments Mobile App

This guide helps resolve common issues when running the mobile app.

## 🚨 **Common Console Errors & Solutions**

### **1. "Failed to load resource: 500 (Internal Server Error)"**

**Cause**: Server configuration or bundling issues
**Solution**:
```bash
# Clear cache and restart
npx expo start --clear

# Or reset everything
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start
```

### **2. "Refused to execute script from... Content Security Policy"**

**Cause**: Web security restrictions
**Solution**: ✅ **FIXED** - Updated web configuration in `app.json` and created custom `web/index.html`

### **3. "Amplitude logger (Warn): defaultTracking is set to undefined"**

**Cause**: Analytics configuration warning
**Solution**: ✅ **FIXED** - Disabled Amplitude analytics in `app.json`

### **4. Navigation Component Errors**

**Cause**: Incorrect component rendering in navigation
**Solution**: ✅ **FIXED** - Updated `MainNavigator.tsx` to properly render components

## 🔄 **Development Server Issues**

### **Server Won't Start**
```bash
# Kill any existing processes
npx expo start --clear

# Check if ports are in use
netstat -ano | findstr :19006
netstat -ano | findstr :8081

# Start with specific port
npx expo start --port 19007
```

### **Metro Bundler Issues**
```bash
# Reset Metro cache
npx expo start --reset-cache

# Clear all caches
npx expo start --clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📱 **Platform-Specific Issues**

### **Android Emulator**
```bash
# Check if Android SDK is configured
echo $ANDROID_HOME

# Start emulator manually
emulator -avd Pixel_4_API_30

# Run on Android
npx expo start --android
```

### **iOS Simulator (macOS only)**
```bash
# Open iOS Simulator
open -a Simulator

# Run on iOS
npx expo start --ios
```

### **Web Browser**
```bash
# Start web version
npx expo start --web

# Open specific browser
npx expo start --web --host localhost --port 19006
```

## 🔥 **Firebase Connection Issues**

### **"Firebase app not initialized"**
1. Check `src/config/firebase.ts` has correct credentials
2. Ensure Firebase project is created
3. Verify API keys are valid

### **"Permission denied" in Firestore**
1. Update Firestore security rules
2. Ensure user is authenticated
3. Check user role permissions

### **Authentication Errors**
1. Enable Email/Password in Firebase Console
2. Add authorized domains
3. Check network connectivity

## 🎨 **UI/Styling Issues**

### **Theme Not Applied**
1. Ensure `ThemeProvider` wraps the app in `App.tsx`
2. Check `useTheme()` hook usage
3. Verify theme configuration in `src/config/theme.ts`

### **Icons Not Showing**
```bash
# Install vector icons
npx expo install @expo/vector-icons

# Clear cache
npx expo start --clear
```

### **Fonts Not Loading**
```bash
# Install custom fonts
npx expo install expo-font

# Preload fonts in App.tsx
```

## 🔧 **Build Issues**

### **TypeScript Errors**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Fix import/export issues
# Update type definitions
```

### **Dependency Conflicts**
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps

# Check for conflicting versions
npm ls

# Update Expo SDK
npx expo install --fix
```

### **Build Failures**
```bash
# Clean build
npx expo start --clear

# Check EAS build logs
eas build:list
eas build:view [build-id]
```

## 📊 **Performance Issues**

### **Slow Loading**
1. Optimize images and assets
2. Enable code splitting
3. Use lazy loading for screens
4. Minimize bundle size

### **Memory Issues**
1. Check for memory leaks
2. Optimize image sizes
3. Use FlatList for large lists
4. Implement proper cleanup

## 🌐 **Network Issues**

### **API Calls Failing**
1. Check network connectivity
2. Verify API endpoints
3. Check CORS configuration
4. Test with Postman/curl

### **Slow Network**
1. Implement offline support
2. Add loading states
3. Cache frequently used data
4. Optimize API responses

## 🔍 **Debugging Tools**

### **React Native Debugger**
```bash
# Install React Native Debugger
# Enable remote debugging in Expo

# Use Flipper for advanced debugging
```

### **Console Logging**
```javascript
// Add debug logs
console.log('Debug info:', data);
console.error('Error:', error);

// Use React Native Logs
npx react-native log-android
npx react-native log-ios
```

### **Performance Monitoring**
```javascript
// Add performance monitoring
import { Performance } from 'react-native-performance';

// Monitor render times
// Track memory usage
```

## 🆘 **Getting Help**

### **Check Documentation**
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Documentation](https://firebase.google.com/docs)

### **Community Support**
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://reactnative.dev/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### **Report Issues**
1. Check existing issues in GitHub repository
2. Provide detailed error messages
3. Include steps to reproduce
4. Share relevant code snippets

## ✅ **Quick Fixes Checklist**

- [ ] Clear Metro cache: `npx expo start --clear`
- [ ] Reinstall dependencies: `npm install --legacy-peer-deps`
- [ ] Check TypeScript: `npx tsc --noEmit`
- [ ] Verify Firebase config
- [ ] Test on different platforms
- [ ] Check network connectivity
- [ ] Review console errors
- [ ] Update Expo SDK: `npx expo install --fix`

## 🎯 **Prevention Tips**

1. **Regular Updates**: Keep dependencies updated
2. **Testing**: Test on multiple platforms regularly
3. **Error Handling**: Implement proper error boundaries
4. **Monitoring**: Set up crash reporting
5. **Documentation**: Keep setup instructions updated

---

**Need more help?** Check the main documentation files:
- `README.md` - General setup
- `ANDROID_SETUP.md` - Android development
- `FIREBASE_SETUP.md` - Firebase configuration
- `BUILD_DEPLOYMENT.md` - Production builds
