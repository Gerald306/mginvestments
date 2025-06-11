# MG Investments Mobile App

A React Native mobile application built with Expo for the MG Investments platform, providing teachers and schools with a comprehensive mobile experience for job searching, profile management, and platform administration.

## 🚀 Features

### 📱 **Cross-Platform Support**
- iOS and Android compatibility
- Responsive design optimized for mobile devices
- Native performance with React Native

### 🔐 **Authentication & User Management**
- Secure Firebase authentication
- Role-based access (Teacher, School, Admin)
- Password reset functionality
- Persistent login sessions

### 👨‍🏫 **Teacher Portal**
- Interactive dashboard with statistics
- Job search and filtering
- Application tracking
- Profile management
- Push notifications

### 🏫 **School Portal**
- School dashboard and analytics
- Teacher search and discovery
- Job posting management
- Application review system
- Recruitment tools

### 👑 **Admin Portal**
- Platform-wide analytics
- User management (Teachers & Schools)
- Application oversight
- System administration
- Content moderation

### 🔔 **Notifications**
- Real-time push notifications
- In-app notification center
- Email integration
- Custom notification preferences

## 🛠 **Tech Stack**

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI Components**: React Native Paper, Expo Vector Icons
- **Notifications**: Expo Notifications
- **Development**: Expo CLI

## 📋 **Prerequisites**

Before running the mobile app, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

## 🚀 **Getting Started**

### 1. **Clone the Repository**
```bash
git clone https://github.com/Gerald306/mginvestments.git
cd mginvestments/mginvestments-mobile
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Firebase**
Update the Firebase configuration in `src/config/firebase.ts` with your project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. **Start the Development Server**
```bash
npm start
# or
expo start
```

### 5. **Run on Device/Simulator**

#### **Using Expo Go (Recommended for Development)**
1. Install Expo Go on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

#### **Using Android Emulator**
```bash
npm run android
```

#### **Using iOS Simulator (macOS only)**
```bash
npm run ios
```

#### **Web Browser (for testing)**
```bash
npm run web
```

## 📁 **Project Structure**

```
mginvestments-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── teacher/       # Teacher portal screens
│   │   ├── school/        # School portal screens
│   │   ├── admin/         # Admin portal screens
│   │   └── common/        # Shared screens
│   ├── services/          # API and Firebase services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── config/            # Configuration files
├── assets/                # Images, icons, fonts
├── App.tsx               # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## 🔧 **Available Scripts**

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

## 📱 **Building for Production**

### **Android APK**
```bash
expo build:android
```

### **iOS IPA**
```bash
expo build:ios
```

### **Using EAS Build (Recommended)**
```bash
npm install -g @expo/eas-cli
eas build --platform android
eas build --platform ios
```

## 🔔 **Push Notifications Setup**

1. Configure Firebase Cloud Messaging (FCM)
2. Add your FCM server key to Expo
3. Test notifications using the Expo push notification tool

## 🧪 **Testing**

The app includes comprehensive testing for:
- Authentication flows
- Navigation between screens
- Firebase integration
- Push notifications
- Cross-platform compatibility

## 🚀 **Deployment**

### **App Store (iOS)**
1. Build the iOS app using EAS Build
2. Upload to App Store Connect
3. Submit for review

### **Google Play Store (Android)**
1. Build the Android app using EAS Build
2. Upload to Google Play Console
3. Submit for review

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 📞 **Support**

For support and questions:
- Email: support@mginvestments.com
- GitHub Issues: [Create an issue](https://github.com/Gerald306/mginvestments/issues)

---

**MG Investments Mobile App** - Connecting teachers and schools through innovative mobile technology.
