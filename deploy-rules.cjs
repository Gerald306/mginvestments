// Firebase Rules Deployment Script
// This script helps deploy Firestore rules to fix permission issues

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Firebase Rules Deployment Script');
console.log('===================================');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.log('❌ Firebase CLI not found. Installing...');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    console.log('✅ Firebase CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Firebase CLI:', installError.message);
    console.log('\n📝 Manual Installation Instructions:');
    console.log('1. Run: npm install -g firebase-tools');
    console.log('2. Run: firebase login');
    console.log('3. Run: firebase use --add (select your project)');
    console.log('4. Run: firebase deploy --only firestore:rules');
    process.exit(1);
  }
}

// Check if firebase.json exists
if (!fs.existsSync('firebase.json')) {
  console.log('❌ firebase.json not found. Creating...');
  const firebaseConfig = {
    "firestore": {
      "rules": "firestore.rules",
      "indexes": "firestore.indexes.json"
    },
    "hosting": {
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  };
  
  fs.writeFileSync('firebase.json', JSON.stringify(firebaseConfig, null, 2));
  console.log('✅ firebase.json created');
}

// Check if firestore.rules exists
if (!fs.existsSync('firestore.rules')) {
  console.log('❌ firestore.rules not found');
  process.exit(1);
}

console.log('\n🚀 Deploying Firestore rules...');
console.log('This will update your Firebase project with the new security rules.');

try {
  // Deploy only the Firestore rules
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('\n✅ Firestore rules deployed successfully!');
  console.log('\n🎉 Your database should now be accessible.');
  console.log('📝 Next steps:');
  console.log('1. Refresh your database test page');
  console.log('2. Click "Add Sample Data" to populate your database');
  console.log('3. Create an admin user if needed');
  
} catch (error) {
  console.error('\n❌ Failed to deploy rules:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure you are logged in: firebase login');
  console.log('2. Make sure you have selected a project: firebase use --add');
  console.log('3. Check your internet connection');
  console.log('4. Verify you have permission to deploy to this project');
}
