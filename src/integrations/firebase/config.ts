import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;