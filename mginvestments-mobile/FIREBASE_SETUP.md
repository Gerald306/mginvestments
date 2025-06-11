# 🔥 Firebase Setup Guide for MG Investments Mobile App

This guide will help you configure Firebase for your mobile app to enable authentication, database, and other services.

## 📋 **Prerequisites**

- Firebase account (free tier available)
- Access to Firebase Console
- Your web app Firebase project (if you want to share the same backend)

## 🚀 **Step 1: Firebase Project Setup**

### Option A: Use Existing Web App Project (Recommended)
If you already have a Firebase project for your web app:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing MG Investments project
3. Click "Add app" and choose the platform icon (iOS/Android)
4. Follow the setup wizard

### Option B: Create New Firebase Project
If you need a new project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `mginvestments-mobile`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 📱 **Step 2: Add Mobile App to Firebase**

### For Android:
1. In Firebase Console, click "Add app" → Android icon
2. Enter Android package name: `com.mginvestments.mobile`
3. Enter app nickname: `MG Investments Mobile`
4. Download `google-services.json`
5. Place the file in `android/app/` directory

### For iOS:
1. In Firebase Console, click "Add app" → iOS icon
2. Enter iOS bundle ID: `com.mginvestments.mobile`
3. Enter app nickname: `MG Investments Mobile`
4. Download `GoogleService-Info.plist`
5. Add to iOS project in Xcode

## 🔧 **Step 3: Configure Firebase Services**

### Authentication
1. Go to Authentication → Sign-in method
2. Enable the following providers:
   - ✅ Email/Password
   - ✅ Google (optional)
   - ✅ Anonymous (for guest access)

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users

### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore

### Cloud Messaging (for Push Notifications)
1. Go to Cloud Messaging
2. Note down the Server Key (for sending notifications)

## 🔑 **Step 4: Get Firebase Configuration**

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click on your web app or create a new web app
4. Copy the Firebase configuration object

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  measurementId: "G-ABC123..." // Optional
};
```

## 📝 **Step 5: Update Mobile App Configuration**

1. Open `src/config/firebase.ts` in your mobile app
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-measurement-id" // Optional
};
```

## 🔒 **Step 6: Configure Firestore Security Rules**

Update your Firestore rules for mobile app access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Teachers can read/write their own profile
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Schools can read/write their own profile
    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Job applications
    match /applications/{applicationId} {
      allow read, write: if request.auth != null;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Admin access to everything
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🧪 **Step 7: Test Firebase Connection**

1. Start your mobile app:
   ```bash
   cd mginvestments-mobile
   npx expo start
   ```

2. Try to register a new account
3. Check Firebase Console → Authentication to see if user was created
4. Check Firestore to see if user document was created

## 🔔 **Step 8: Configure Push Notifications**

### For Android:
1. In Firebase Console, go to Project Settings
2. Go to Cloud Messaging tab
3. Copy the Server Key
4. Add to your notification service

### For iOS:
1. Upload APNs certificate or key to Firebase
2. Configure iOS app for push notifications

## 🚀 **Step 9: Environment Variables (Optional)**

For better security, you can use environment variables:

1. Create `.env` file in project root:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

2. Update `firebase.ts` to use environment variables:
   ```typescript
   const firebaseConfig = {
     apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
     storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
   };
   ```

## ✅ **Verification Checklist**

- [ ] Firebase project created/configured
- [ ] Mobile app added to Firebase project
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Storage configured
- [ ] Firebase config updated in mobile app
- [ ] Security rules configured
- [ ] Push notifications configured
- [ ] Test registration/login works
- [ ] Test data sync with Firestore

## 🆘 **Troubleshooting**

### Common Issues:

1. **"Firebase app not initialized"**
   - Check if firebase config is correct
   - Ensure all required fields are filled

2. **Authentication errors**
   - Verify email/password is enabled in Firebase Console
   - Check if domain is authorized

3. **Firestore permission denied**
   - Update security rules
   - Ensure user is authenticated

4. **Push notifications not working**
   - Check FCM configuration
   - Verify device registration token

## 📞 **Support**

- Firebase Documentation: https://firebase.google.com/docs
- Expo Firebase Guide: https://docs.expo.dev/guides/using-firebase/
- GitHub Issues: Create an issue in the repository

---

**🔥 Firebase setup complete! Your mobile app is now connected to Firebase.**
