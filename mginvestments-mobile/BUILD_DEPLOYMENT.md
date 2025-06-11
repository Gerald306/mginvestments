# 🚀 Production Build & Deployment Guide

This guide covers building and deploying the MG Investments mobile app to Google Play Store and Apple App Store.

## 📋 **Prerequisites**

- Expo CLI installed globally: `npm install -g @expo/eas-cli`
- Expo account (free tier available)
- Google Play Console account ($25 one-time fee)
- Apple Developer account ($99/year)
- App icons and screenshots prepared

## 🔧 **Step 1: Prepare for Production**

### Update App Configuration
1. Ensure `app.json` has correct production values:
   ```json
   {
     "expo": {
       "name": "MG Investments",
       "slug": "mginvestments-mobile",
       "version": "1.0.0",
       "android": {
         "package": "com.mginvestments.mobile",
         "versionCode": 1
       },
       "ios": {
         "bundleIdentifier": "com.mginvestments.mobile",
         "buildNumber": "1.0.0"
       }
     }
   }
   ```

### Prepare App Assets
1. **App Icon**: 1024x1024px PNG (no transparency)
2. **Splash Screen**: 1242x2436px PNG
3. **Screenshots**: Various sizes for store listings
4. **Feature Graphic**: 1024x500px (Google Play)

### Environment Configuration
1. Create production Firebase project
2. Update `src/config/firebase.ts` with production credentials
3. Test all features thoroughly

## 🏗️ **Step 2: Configure EAS Build**

### Initialize EAS
```bash
cd mginvestments-mobile
eas login
eas build:configure
```

### Configure Build Profiles
The `eas.json` file is already configured with:
- **Development**: For testing with development client
- **Preview**: For internal testing (APK for Android)
- **Production**: For store submission (AAB for Android, IPA for iOS)

## 📱 **Step 3: Build for Android**

### Build APK for Testing
```bash
# Build APK for internal testing
eas build --platform android --profile preview
```

### Build AAB for Google Play
```bash
# Build Android App Bundle for production
eas build --platform android --profile production
```

### Download and Test
1. Download the APK/AAB from EAS dashboard
2. Install APK on test devices
3. Test all functionality thoroughly

## 🍎 **Step 4: Build for iOS**

### Prerequisites
- Apple Developer account
- iOS distribution certificate
- App Store provisioning profile

### Build IPA
```bash
# Build for iOS App Store
eas build --platform ios --profile production
```

### Handle Code Signing
EAS will guide you through:
1. Creating distribution certificate
2. Creating provisioning profile
3. Uploading to Apple servers

## 🏪 **Step 5: Google Play Store Deployment**

### Prepare Store Listing
1. **App Title**: MG Investments
2. **Short Description**: Connect teachers and schools
3. **Full Description**: Detailed app description
4. **Screenshots**: Upload for different device sizes
5. **Feature Graphic**: 1024x500px promotional image

### Upload to Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Upload AAB file to Internal Testing track
4. Fill out store listing information
5. Set content rating and target audience
6. Submit for review

### Release Process
```bash
# Option 1: Manual upload to Google Play Console
# Download AAB from EAS and upload manually

# Option 2: Automated submission (requires setup)
eas submit --platform android
```

## 🍎 **Step 6: Apple App Store Deployment**

### Prepare App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill out app information
4. Upload screenshots and metadata
5. Set pricing and availability

### Upload IPA
```bash
# Option 1: Manual upload via Xcode or Application Loader
# Download IPA from EAS and upload manually

# Option 2: Automated submission
eas submit --platform ios
```

### App Review Process
1. Submit for review
2. Wait for Apple review (1-7 days)
3. Address any feedback
4. Release when approved

## 🔄 **Step 7: Update Process**

### Version Updates
1. Update version in `app.json`:
   ```json
   {
     "version": "1.0.1",
     "android": { "versionCode": 2 },
     "ios": { "buildNumber": "1.0.1" }
   }
   ```

2. Build new version:
   ```bash
   eas build --platform all --profile production
   ```

3. Submit updates to stores

### Over-the-Air Updates
For non-native changes, use Expo Updates:
```bash
# Publish update without rebuilding
eas update --branch production --message "Bug fixes and improvements"
```

## 📊 **Step 8: Analytics & Monitoring**

### Firebase Analytics
1. Enable Analytics in Firebase Console
2. Track user engagement and app performance
3. Monitor crash reports

### App Store Analytics
1. Monitor downloads and user ratings
2. Track conversion rates
3. Analyze user feedback

## 🧪 **Step 9: Testing Strategy**

### Pre-Release Testing
1. **Internal Testing**: Team members
2. **Alpha Testing**: Closed group of users
3. **Beta Testing**: Larger group of external users
4. **Production**: Public release

### Testing Checklist
- [ ] Authentication flows work
- [ ] All screens load correctly
- [ ] Push notifications function
- [ ] Offline functionality works
- [ ] Performance is acceptable
- [ ] No crashes or critical bugs

## 🔒 **Step 10: Security & Compliance**

### App Store Requirements
- [ ] Privacy policy URL provided
- [ ] Data usage clearly described
- [ ] Age-appropriate content rating
- [ ] Accessibility features implemented

### Security Best Practices
- [ ] API keys secured
- [ ] User data encrypted
- [ ] Secure authentication implemented
- [ ] Regular security updates

## 📈 **Step 11: Post-Launch**

### Monitor Performance
1. Track app store ratings and reviews
2. Monitor crash reports and fix issues
3. Analyze user behavior and engagement
4. Plan feature updates based on feedback

### Marketing
1. Create app store optimization (ASO) strategy
2. Share on social media and website
3. Reach out to education industry publications
4. Consider paid advertising campaigns

## 🆘 **Troubleshooting**

### Common Build Issues
1. **Build fails**: Check logs in EAS dashboard
2. **Code signing errors**: Verify certificates and profiles
3. **App rejected**: Address store review feedback
4. **Performance issues**: Optimize bundle size and loading

### Useful Commands
```bash
# Check build status
eas build:list

# View build logs
eas build:view [build-id]

# Cancel build
eas build:cancel [build-id]

# Check submission status
eas submit:list
```

## 📞 **Support Resources**

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

---

**🎉 Congratulations! Your MG Investments mobile app is ready for production deployment!**
