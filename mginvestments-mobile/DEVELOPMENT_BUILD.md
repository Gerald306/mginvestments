# Development Build Guide

## Why Use a Development Build?

Starting with Expo SDK 53, push notifications are no longer supported in Expo Go. To enable full functionality including push notifications, you need to create a development build.

## Benefits of Development Build

✅ **Full Push Notifications Support**
- Remote push notifications
- Background notifications
- Rich notifications with images/actions

✅ **Better Performance**
- Native performance
- Faster app startup
- Better memory management

✅ **Full Native Module Support**
- Access to all native modules
- Custom native code integration
- Third-party native libraries

## Quick Setup

### Prerequisites
1. Install EAS CLI globally:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

### Build for Android

1. **Create development build:**
   ```bash
   eas build --profile development --platform android
   ```

2. **Install the build:**
   - Download the APK from the EAS build page
   - Install it on your Android device
   - Or scan the QR code to install directly

3. **Start development server:**
   ```bash
   npx expo start --dev-client
   ```

4. **Connect to your app:**
   - Open the development build on your device
   - Scan the QR code or enter the URL manually

### Build for iOS

1. **Create development build:**
   ```bash
   eas build --profile development --platform ios
   ```

2. **Install via TestFlight or direct install**

## Current Expo Go Limitations

When using Expo Go, the following features have limitations:

❌ **Push Notifications**
- Remote push notifications don't work
- Local notifications work but with limitations

⚠️ **Workarounds in Expo Go**
- Local notifications show as alerts
- Push notification registration is skipped
- Console messages explain limitations

## Testing Push Notifications

Once you have a development build:

1. **Register for notifications:**
   ```javascript
   const token = await notificationService.registerForPushNotifications();
   console.log('Push token:', token);
   ```

2. **Send test notification:**
   ```javascript
   await notificationService.sendLocalNotification(
     'Test Notification',
     'This is a test notification from your development build!'
   );
   ```

## Troubleshooting

### Build Issues
- Make sure you're logged into EAS CLI
- Check your internet connection
- Verify your Expo account has build credits

### Installation Issues
- Enable "Install from Unknown Sources" on Android
- For iOS, make sure the device is registered in your Apple Developer account

### Runtime Issues
- Clear Metro cache: `npx expo start --clear`
- Restart the development server
- Check device logs for errors

## Next Steps

1. **Create your first development build**
2. **Test push notifications**
3. **Deploy to app stores when ready**

For more information, visit: https://docs.expo.dev/develop/development-builds/introduction/
