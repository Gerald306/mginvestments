import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Ensure Firebase is only initialized once
let app;
let auth;
let db;
let storage;

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

// Initialize Firebase App
function initializeFirebaseApp() {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

// Initialize Auth
function initializeFirebaseAuth() {
  if (!auth) {
    const firebaseApp = initializeFirebaseApp();

    try {
      if (Platform.OS === 'web') {
        // For web platform, use regular getAuth
        auth = getAuth(firebaseApp);
      } else {
        // For React Native, try initializeAuth first
        try {
          auth = initializeAuth(firebaseApp, {
            persistence: getReactNativePersistence(AsyncStorage)
          });
        } catch (initError) {
          // If initializeAuth fails, fall back to getAuth
          console.log('InitializeAuth failed, using getAuth:', initError.message);
          auth = getAuth(firebaseApp);
        }
      }
    } catch (error) {
      // If auth is already initialized, get the existing instance
      console.log('Auth already initialized, using existing instance:', error.message);
      auth = getAuth(firebaseApp);
    }
  }
  return auth;
}

// Initialize Firestore
function initializeFirebaseFirestore() {
  if (!db) {
    const firebaseApp = initializeFirebaseApp();
    db = getFirestore(firebaseApp);
  }
  return db;
}

// Initialize Storage
function initializeFirebaseStorage() {
  if (!storage) {
    const firebaseApp = initializeFirebaseApp();
    storage = getStorage(firebaseApp);
  }
  return storage;
}

// Export initialized instances
export const getFirebaseAuth = () => initializeFirebaseAuth();
export const getFirebaseDb = () => initializeFirebaseFirestore();
export const getFirebaseStorage = () => initializeFirebaseStorage();

// Legacy exports for backward compatibility
export { initializeFirebaseAuth as auth, initializeFirebaseFirestore as db, initializeFirebaseStorage as storage };
export default initializeFirebaseApp;