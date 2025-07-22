// Firebase Configuration Checker
// This script helps diagnose Firebase setup issues

const fs = require('fs');
const path = require('path');

console.log('🔍 Firebase Configuration Checker');
console.log('=================================');

// Check if Firebase config file exists
const configPath = path.join(__dirname, 'src', 'integrations', 'firebase', 'config.ts');
if (fs.existsSync(configPath)) {
  console.log('✅ Firebase config file found');
  
  // Read and check config
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check for required fields
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];
  
  let missingFields = [];
  requiredFields.forEach(field => {
    if (!configContent.includes(field) || configContent.includes(`${field}: ""`)) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length === 0) {
    console.log('✅ All required Firebase config fields are present');
  } else {
    console.log('❌ Missing or empty Firebase config fields:', missingFields.join(', '));
    console.log('\n📝 To fix this:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project');
    console.log('3. Go to Project Settings > General');
    console.log('4. Scroll down to "Your apps" section');
    console.log('5. Click on the web app or create one');
    console.log('6. Copy the config object and update src/integrations/firebase/config.ts');
  }
} else {
  console.log('❌ Firebase config file not found at:', configPath);
}

// Check if Firestore rules exist
if (fs.existsSync('firestore.rules')) {
  console.log('✅ Firestore rules file found');
} else {
  console.log('❌ Firestore rules file not found');
}

// Check if firebase.json exists
if (fs.existsSync('firebase.json')) {
  console.log('✅ firebase.json found');
} else {
  console.log('❌ firebase.json not found');
}

// Check package.json for Firebase dependency
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (packageContent.dependencies && packageContent.dependencies.firebase) {
    console.log('✅ Firebase dependency found in package.json');
  } else {
    console.log('❌ Firebase dependency not found in package.json');
    console.log('Run: npm install firebase');
  }
}

console.log('\n🚀 Quick Fix Commands:');
console.log('1. Install Firebase CLI: npm install -g firebase-tools');
console.log('2. Login to Firebase: firebase login');
console.log('3. Initialize project: firebase init');
console.log('4. Deploy rules: firebase deploy --only firestore:rules');
console.log('5. Or run our script: node deploy-rules.js');

console.log('\n📋 Current Status Summary:');
console.log('- Config file:', fs.existsSync(configPath) ? '✅' : '❌');
console.log('- Rules file:', fs.existsSync('firestore.rules') ? '✅' : '❌');
console.log('- Firebase.json:', fs.existsSync('firebase.json') ? '✅' : '❌');
console.log('- Package dependency:', 'Check above');

console.log('\n🔗 Helpful Links:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Firebase Documentation: https://firebase.google.com/docs');
console.log('- Firestore Rules: https://firebase.google.com/docs/firestore/security/get-started');
