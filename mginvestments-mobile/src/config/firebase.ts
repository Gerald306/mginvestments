import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration for MG Investments Mobile App
const firebaseConfig = {
  "apiKey": "AIzaSyDqvLi8ABcH9ZRtRspFcRgqVtHeQ8qXwfM",
  "authDomain": "mg-investments-e8e1b.firebaseapp.com",
  "projectId": "mg-investments-e8e1b",
  "storageBucket": "mg-investments-e8e1b.firebasestorage.app",
  "messagingSenderId": "418702249525",
  "appId": "1:418702249525:web:5cf978f207a0c7ac5f2b7c",
  "measurementId": "G-M1TC2CVPJH"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth with proper React Native persistence
let auth;
try {
  if (Platform.OS === 'web') {
    // For web platform, use regular getAuth
    auth = getAuth(app);
  } else {
    // For React Native, use initializeAuth with AsyncStorage persistence
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    } catch (initError) {
      // If initializeAuth fails, fall back to getAuth
      console.log('InitializeAuth failed, using getAuth:', initError.message);
      auth = getAuth(app);
    }
  }
} catch (error) {
  // If auth is already initialized, get the existing instance
  console.log('Auth already initialized, using existing instance:', error.message);
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;