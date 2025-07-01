// Firebase Environment Configuration
// This file handles environment-specific Firebase configuration

export interface FirebaseEnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Production Firebase Configuration
export const FIREBASE_CONFIG: FirebaseEnvConfig = {
  apiKey: "AIzaSyDqvLi8ABcH9ZRtRspFcRgqVtHeQ8qXwfM",
  authDomain: "mg-investments-e8e1b.firebaseapp.com",
  projectId: "mg-investments-e8e1b",
  storageBucket: "mg-investments-e8e1b.firebasestorage.app",
  messagingSenderId: "418702249525",
  appId: "1:418702249525:web:5cf978f207a0c7ac5f2b7c",
  measurementId: "G-M1TC2CVPJH"
};

// Development/Testing Configuration (if needed)
export const FIREBASE_DEV_CONFIG: FirebaseEnvConfig = {
  // Use the same config for now, but this can be changed for development
  ...FIREBASE_CONFIG
};

// Get the appropriate config based on environment
export const getFirebaseConfig = (): FirebaseEnvConfig => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? FIREBASE_DEV_CONFIG : FIREBASE_CONFIG;
};

// Firebase Collections
export const FIREBASE_COLLECTIONS = {
  PROFILES: 'profiles',
  TEACHERS: 'teachers',
  SCHOOLS: 'schools',
  JOB_POSTINGS: 'job_postings',
  JOB_APPLICATIONS: 'job_applications',
  TEACHER_APPLICATIONS: 'teacher_applications',
  IMPORT_SESSIONS: 'import_sessions',
  APPROVAL_REQUESTS: 'approval_requests',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics'
} as const;

// Firebase Security Rules Status
export const FIREBASE_RULES_STATUS = {
  DEPLOYED: true,
  LAST_UPDATED: '2024-01-15',
  VERSION: '1.0.0'
};
