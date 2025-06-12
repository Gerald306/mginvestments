import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { auth, db, storage } from '../config/firebase';

interface FirebaseInitializerProps {
  children: React.ReactNode;
}

const FirebaseInitializer: React.FC<FirebaseInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Test Firebase services
        console.log('Initializing Firebase services...');
        
        // Test Auth
        if (auth) {
          console.log('✅ Firebase Auth initialized');
        } else {
          throw new Error('Firebase Auth not initialized');
        }
        
        // Test Firestore
        if (db) {
          console.log('✅ Firebase Firestore initialized');
        } else {
          throw new Error('Firebase Firestore not initialized');
        }
        
        // Test Storage
        if (storage) {
          console.log('✅ Firebase Storage initialized');
        } else {
          throw new Error('Firebase Storage not initialized');
        }
        
        console.log('🎉 All Firebase services initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        setError(error instanceof Error ? error.message : 'Unknown Firebase error');
        
        // Still allow app to continue with limited functionality
        setTimeout(() => {
          setIsInitialized(true);
        }, 2000);
      }
    };

    initializeFirebase();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Firebase Configuration Issue</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.infoText}>
          The app will continue with limited functionality.
          Please check your Firebase configuration.
        </Text>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MG Investments</Text>
        <Text style={styles.subtitle}>Initializing Firebase services...</Text>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  loader: {
    marginTop: 20,
  },
});

export default FirebaseInitializer;
