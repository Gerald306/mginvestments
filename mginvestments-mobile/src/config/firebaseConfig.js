// firebaseConfig.js - Centralized Firebase configuration
import { Platform } from 'react-native';

// Firebase configuration from environment variables
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
export const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    const error = `Missing Firebase configuration: ${missingFields.join(', ')}`;
    console.error('❌ Firebase Config Error:', error);
    throw new Error(error);
  }

  console.log('✅ Firebase configuration validated');
  return true;
};

// Platform-specific Firebase settings
export const getFirebaseSettings = () => {
  const settings = {
    persistence: true,
    cacheSizeBytes: Platform.OS === 'web' ? 40000000 : 20000000, // 40MB for web, 20MB for mobile
    experimentalForceLongPolling: Platform.OS !== 'web', // Better for mobile networks
  };

  console.log(`🔥 Firebase settings for ${Platform.OS}:`, settings);
  return settings;
};

// Export validated config
validateFirebaseConfig();
export default firebaseConfig;
