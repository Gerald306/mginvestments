// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - same as web app
const firebaseConfig = {
  apiKey: "AIzaSyDqvLi8ABcH9ZRtRspFcRgqVtHeQ8qXwfM",
  authDomain: "mg-investments-e8e1b.firebaseapp.com",
  projectId: "mg-investments-e8e1b",
  storageBucket: "mg-investments-e8e1b.firebasestorage.app",
  messagingSenderId: "418702249525",
  appId: "1:418702249525:web:5cf978f207a0c7ac5f2b7c",
  measurementId: "G-M1TC2CVPJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { auth, db, storage };
export default app;
