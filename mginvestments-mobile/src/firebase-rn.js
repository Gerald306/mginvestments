// firebase-rn.js - React Native optimized Firebase setup
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqvLi8ABcH9ZRtRspFcRgqVtHeQ8qXwfM",
  authDomain: "mg-investments-e8e1b.firebaseapp.com",
  projectId: "mg-investments-e8e1b",
  storageBucket: "mg-investments-e8e1b.firebasestorage.app",
  messagingSenderId: "418702249525",
  appId: "1:418702249525:web:5cf978f207a0c7ac5f2b7c",
  measurementId: "G-M1TC2CVPJH"
};

// Import AsyncStorage safely
let AsyncStorage = null;
try {
  if (Platform.OS !== 'web') {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
    console.log('✅ AsyncStorage loaded for React Native');
  }
} catch (error) {
  console.warn('⚠️ AsyncStorage not available:', error.message);
}

// Initialize Firebase App
let app;
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
    console.log('✅ Using existing Firebase app');
  } else {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
  }
} catch (error) {
  console.error('❌ Firebase app initialization failed:', error);
  throw error;
}

// Initialize Firebase Auth with React Native specific handling
let auth;
const initAuth = () => {
  try {
    console.log('🔥 Initializing Firebase Auth...');
    
    // For web platform
    if (Platform.OS === 'web') {
      auth = getAuth(app);
      console.log('✅ Web Auth initialized');
      return auth;
    }

    // For React Native - try different approaches
    console.log('📱 Setting up React Native Auth...');
    
    // Approach 1: Try to get existing auth
    try {
      auth = getAuth(app);
      console.log('✅ Got existing auth instance');
      return auth;
    } catch (getAuthError) {
      console.log('🔄 No existing auth, creating new...');
    }

    // Approach 2: Initialize with AsyncStorage if available
    if (AsyncStorage) {
      try {
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage)
        });
        console.log('✅ Auth initialized with AsyncStorage');
        return auth;
      } catch (persistenceError) {
        if (persistenceError.code === 'auth/already-initialized') {
          auth = getAuth(app);
          console.log('✅ Auth already initialized, using existing');
          return auth;
        }
        console.warn('⚠️ AsyncStorage persistence failed:', persistenceError.message);
      }
    }

    // Approach 3: Basic initialization without persistence
    try {
      auth = initializeAuth(app);
      console.log('✅ Basic auth initialized');
      return auth;
    } catch (basicError) {
      if (basicError.code === 'auth/already-initialized') {
        auth = getAuth(app);
        console.log('✅ Using existing auth after basic init');
        return auth;
      }
      throw basicError;
    }

  } catch (error) {
    console.error('❌ Auth initialization failed:', error);
    
    // Final fallback
    try {
      auth = getAuth(app);
      console.log('✅ Fallback auth successful');
      return auth;
    } catch (fallbackError) {
      console.error('❌ All auth initialization methods failed');
      throw new Error(`Firebase Auth setup failed: ${error.message}`);
    }
  }
};

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

// Initialize Storage
let storage;
try {
  storage = getStorage(app);
  console.log('✅ Storage initialized');
} catch (error) {
  console.error('❌ Storage initialization failed:', error);
  throw error;
}

// Initialize auth with delay for React Native
const setupAuth = async () => {
  if (Platform.OS !== 'web') {
    // Add delay for React Native to ensure proper module loading
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  auth = initAuth();
  return auth;
};

// Export a promise that resolves when Firebase is ready
export const firebaseReady = setupAuth();

// Export services
export { auth, db, storage, app };

// Default export
export default app;
