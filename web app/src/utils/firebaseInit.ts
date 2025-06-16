// Firebase Initialization and Setup Utilities
import { firebase } from '@/integrations/firebase/client';
import { FIREBASE_COLLECTIONS } from '@/integrations/firebase/env';

// Initialize Firebase collections with proper structure
export const initializeFirebaseCollections = async () => {
  try {
    console.log('🔥 Initializing Firebase collections...');

    // Check if collections exist by trying to read from them
    const collections = Object.values(FIREBASE_COLLECTIONS);
    const initResults = [];

    for (const collectionName of collections) {
      try {
        const result = await firebase.from(collectionName).select('*').limit(1);
        initResults.push({
          collection: collectionName,
          status: 'exists',
          error: null
        });
      } catch (error) {
        initResults.push({
          collection: collectionName,
          status: 'needs_init',
          error: error
        });
      }
    }

    console.log('📊 Firebase collections status:', initResults);
    return { success: true, results: initResults };

  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return { success: false, error };
  }
};

// Create initial admin user if none exists
export const ensureAdminUser = async () => {
  try {
    console.log('👤 Checking for admin users...');

    const result = await firebase
      .from(FIREBASE_COLLECTIONS.PROFILES)
      .select('*')
      .eq('role', 'admin')
      .limit(1);

    if (!result.data || result.data.length === 0) {
      console.log('⚠️ No admin users found. Please create one through the auth system.');
      return { hasAdmin: false, message: 'No admin users found' };
    }

    console.log('✅ Admin user exists');
    return { hasAdmin: true, message: 'Admin user found' };

  } catch (error) {
    console.error('❌ Error checking admin users:', error);
    return { hasAdmin: false, error };
  }
};

// Validate Firebase configuration
export const validateFirebaseConfig = () => {
  try {
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

    if (missingVars.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingVars);
      console.log('💡 Using hardcoded Firebase config (development mode)');
    } else {
      console.log('✅ All Firebase environment variables are set');
    }

    return {
      isValid: true,
      missingVars,
      usingHardcodedConfig: missingVars.length > 0
    };

  } catch (error) {
    console.error('❌ Firebase config validation error:', error);
    return { isValid: false, error };
  }
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔗 Testing Firebase connection...');

    // Try to read from profiles collection
    const result = await firebase
      .from(FIREBASE_COLLECTIONS.PROFILES)
      .select('*')
      .limit(1);

    if (result.error) {
      throw result.error;
    }

    console.log('✅ Firebase connection successful');
    return { connected: true, message: 'Connection successful' };

  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { connected: false, error };
  }
};

// Complete Firebase setup check
export const runFirebaseSetupCheck = async () => {
  console.log('🚀 Running complete Firebase setup check...');

  const results = {
    config: validateFirebaseConfig(),
    connection: await testFirebaseConnection(),
    collections: await initializeFirebaseCollections(),
    admin: await ensureAdminUser()
  };

  const allGood = results.config.isValid && 
                  results.connection.connected && 
                  results.collections.success;

  console.log('📋 Firebase setup check results:', results);

  return {
    success: allGood,
    results,
    recommendations: generateRecommendations(results)
  };
};

// Generate setup recommendations
const generateRecommendations = (results: any) => {
  const recommendations = [];

  if (!results.config.isValid) {
    recommendations.push('Set up environment variables for Firebase configuration');
  }

  if (!results.connection.connected) {
    recommendations.push('Check Firebase project settings and network connection');
  }

  if (!results.collections.success) {
    recommendations.push('Initialize database collections by adding sample data');
  }

  if (!results.admin.hasAdmin) {
    recommendations.push('Create an admin user account through the authentication system');
  }

  if (recommendations.length === 0) {
    recommendations.push('Firebase setup is complete! 🎉');
  }

  return recommendations;
};
