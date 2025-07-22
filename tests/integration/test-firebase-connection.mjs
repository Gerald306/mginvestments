// Firebase Database Connectivity Test for MG Investments
// This script tests the Firebase database connection directly

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

// Collections to test
const collections = [
  'profiles',
  'teachers', 
  'schools',
  'job_postings',
  'notifications'
];

async function testDatabaseConnection() {
  console.log('🔥 Starting MG Investments Database Connectivity Test...');
  console.log('================================================');
  
  try {
    // Initialize Firebase
    console.log('1️⃣ Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log(`📱 Project ID: ${firebaseConfig.projectId}`);
    console.log(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);
    
    // Test Firestore connection
    console.log('\n2️⃣ Testing Firestore Database Connection...');
    
    const testResults = [];
    
    for (const collectionName of collections) {
      try {
        console.log(`   📂 Testing collection: ${collectionName}`);
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        const result = {
          collection: collectionName,
          status: 'connected',
          documentCount: snapshot.size,
          error: null
        };
        
        testResults.push(result);
        console.log(`   ✅ ${collectionName}: ${snapshot.size} documents found`);
        
      } catch (error) {
        const result = {
          collection: collectionName,
          status: 'error',
          documentCount: 0,
          error: error.message
        };
        
        testResults.push(result);
        console.log(`   ❌ ${collectionName}: ${error.message}`);
      }
    }
    
    // Summary
    console.log('\n📊 DATABASE CONNECTIVITY SUMMARY');
    console.log('================================');
    
    const connectedCollections = testResults.filter(r => r.status === 'connected');
    const errorCollections = testResults.filter(r => r.status === 'error');
    
    console.log(`✅ Connected Collections: ${connectedCollections.length}/${collections.length}`);
    console.log(`❌ Failed Collections: ${errorCollections.length}/${collections.length}`);
    
    if (connectedCollections.length > 0) {
      console.log('\n🎉 SUCCESSFUL CONNECTIONS:');
      connectedCollections.forEach(result => {
        console.log(`   • ${result.collection}: ${result.documentCount} documents`);
      });
    }
    
    if (errorCollections.length > 0) {
      console.log('\n⚠️  FAILED CONNECTIONS:');
      errorCollections.forEach(result => {
        console.log(`   • ${result.collection}: ${result.error}`);
      });
    }
    
    // Overall status
    const overallStatus = connectedCollections.length === collections.length ? 'HEALTHY' : 
                         connectedCollections.length > 0 ? 'PARTIAL' : 'FAILED';
    
    console.log(`\n🏥 OVERALL DATABASE STATUS: ${overallStatus}`);
    
    if (overallStatus === 'HEALTHY') {
      console.log('🎯 Your MG Investments website is fully connected to the database!');
      console.log('✨ All features should work properly:');
      console.log('   • User authentication and registration');
      console.log('   • Teacher and school profiles');
      console.log('   • Job postings and applications');
      console.log('   • Admin dashboard functionality');
      console.log('   • Notifications system');
    } else if (overallStatus === 'PARTIAL') {
      console.log('⚠️  Your website has partial database connectivity.');
      console.log('   Some features may not work properly.');
      console.log('   Check Firebase security rules and permissions.');
    } else {
      console.log('🚨 Database connection failed. Website may not function properly.');
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Check your internet connection');
      console.log('2. Verify Firebase project is active');
      console.log('3. Check Firebase security rules');
      console.log('4. Ensure Firestore is enabled in Firebase Console');
    }
    
    // Test specific admin functionality
    console.log('\n3️⃣ Testing Admin User Availability...');
    try {
      const profilesRef = collection(db, 'profiles');
      const snapshot = await getDocs(profilesRef);
      
      let adminCount = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.role === 'admin') {
          adminCount++;
        }
      });
      
      if (adminCount > 0) {
        console.log(`✅ Found ${adminCount} admin user(s) in the database`);
        console.log('🔑 Admin dashboard should be accessible');
        console.log('📧 Default admin: admin@mginvestments.ug');
      } else {
        console.log('⚠️  No admin users found in the database');
        console.log('🔧 You may need to create an admin user');
      }
    } catch (error) {
      console.log(`❌ Error checking admin users: ${error.message}`);
    }
    
    return {
      success: overallStatus !== 'FAILED',
      status: overallStatus,
      results: testResults,
      connectedCount: connectedCollections.length,
      totalCount: collections.length
    };
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Failed to initialize Firebase');
    console.error('Error details:', error.message);
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Firebase project is active');
    console.log('3. Check Firebase configuration keys');
    console.log('4. Ensure Firestore is enabled in Firebase Console');
    
    return {
      success: false,
      status: 'CRITICAL_ERROR',
      error: error.message,
      results: []
    };
  }
}

// Run the test
testDatabaseConnection()
  .then(result => {
    console.log('\n🏁 Database connectivity test completed!');
    console.log(`📈 Success Rate: ${result.connectedCount}/${result.totalCount} collections`);
    
    if (result.success) {
      console.log('🎉 Your MG Investments website database connectivity is working!');
    } else {
      console.log('⚠️  Database connectivity issues detected. Please review the results above.');
    }
    
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Unexpected error during test:', error);
    process.exit(1);
  });
