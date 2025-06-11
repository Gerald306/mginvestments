#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Configuration Setup for MG Investments Mobile App');
console.log('============================================================');
console.log('');
console.log('Please gather your Firebase configuration from:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Select your project (or create a new one)');
console.log('3. Go to Project Settings (gear icon)');
console.log('4. Scroll down to "Your apps" section');
console.log('5. Click on the web app or create a new web app');
console.log('6. Copy the configuration object');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function configureFirebase() {
  try {
    console.log('Enter your Firebase configuration details:');
    console.log('');

    const apiKey = await askQuestion('API Key: ');
    const authDomain = await askQuestion('Auth Domain (e.g., your-project.firebaseapp.com): ');
    const projectId = await askQuestion('Project ID: ');
    const storageBucket = await askQuestion('Storage Bucket (e.g., your-project.appspot.com): ');
    const messagingSenderId = await askQuestion('Messaging Sender ID: ');
    const appId = await askQuestion('App ID: ');
    const measurementId = await askQuestion('Measurement ID (optional, press Enter to skip): ');

    // Validate required fields
    if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
      console.log('❌ Error: All fields except Measurement ID are required!');
      process.exit(1);
    }

    // Create Firebase configuration
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      ...(measurementId && { measurementId })
    };

    // Generate the Firebase configuration file
    const configContent = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for MG Investments Mobile App
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage };
export default app;`;

    // Write to file
    const configPath = path.join(__dirname, 'src', 'config', 'firebase.ts');
    fs.writeFileSync(configPath, configContent);

    console.log('');
    console.log('✅ Firebase configuration saved successfully!');
    console.log(`📁 Configuration saved to: ${configPath}`);
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Enable Authentication in Firebase Console');
    console.log('2. Create Firestore database');
    console.log('3. Set up Storage bucket');
    console.log('4. Configure security rules');
    console.log('');
    console.log('📖 See FIREBASE_SETUP.md for detailed instructions');

  } catch (error) {
    console.error('❌ Error configuring Firebase:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

configureFirebase();
