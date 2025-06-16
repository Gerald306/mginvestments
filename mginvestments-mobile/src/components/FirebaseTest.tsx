import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FirebaseTestProps {
  onTestComplete?: (success: boolean) => void;
}

const FirebaseTest: React.FC<FirebaseTestProps> = ({ onTestComplete }) => {
  const [testResults, setTestResults] = useState<{
    app: boolean | null;
    auth: boolean | null;
    db: boolean | null;
    storage: boolean | null;
  }>({
    app: null,
    auth: null,
    db: null,
    storage: null,
  });

  const [isRunning, setIsRunning] = useState(false);

  const runFirebaseTest = async () => {
    setIsRunning(true);
    setTestResults({ app: null, auth: null, db: null, storage: null });

    try {
      console.log('🧪 Starting Firebase test...');

      // Test Firebase app
      try {
        const { app } = await import('../firebase-rn');
        if (app) {
          setTestResults(prev => ({ ...prev, app: true }));
          console.log('✅ Firebase app test passed');
        } else {
          throw new Error('App is null');
        }
      } catch (error) {
        console.error('❌ Firebase app test failed:', error);
        setTestResults(prev => ({ ...prev, app: false }));
      }

      // Test Firebase auth
      try {
        const { auth, firebaseReady } = await import('../firebase-rn');
        await firebaseReady;
        
        if (auth) {
          // Test auth state listener
          const unsubscribe = auth.onAuthStateChanged(() => {
            // Just testing
          });
          unsubscribe();
          
          setTestResults(prev => ({ ...prev, auth: true }));
          console.log('✅ Firebase auth test passed');
        } else {
          throw new Error('Auth is null');
        }
      } catch (error) {
        console.error('❌ Firebase auth test failed:', error);
        setTestResults(prev => ({ ...prev, auth: false }));
      }

      // Test Firestore
      try {
        const { db } = await import('../firebase-rn');
        if (db) {
          setTestResults(prev => ({ ...prev, db: true }));
          console.log('✅ Firestore test passed');
        } else {
          throw new Error('DB is null');
        }
      } catch (error) {
        console.error('❌ Firestore test failed:', error);
        setTestResults(prev => ({ ...prev, db: false }));
      }

      // Test Storage
      try {
        const { storage } = await import('../firebase-rn');
        if (storage) {
          setTestResults(prev => ({ ...prev, storage: true }));
          console.log('✅ Storage test passed');
        } else {
          throw new Error('Storage is null');
        }
      } catch (error) {
        console.error('❌ Storage test failed:', error);
        setTestResults(prev => ({ ...prev, storage: false }));
      }

      const allPassed = Object.values(testResults).every(result => result === true);
      onTestComplete?.(allPassed);
      console.log('🧪 Firebase test completed');

    } catch (error) {
      console.error('❌ Firebase test suite failed:', error);
      onTestComplete?.(false);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Auto-run test on mount
    runFirebaseTest();
  }, []);

  const getIcon = (result: boolean | null) => {
    if (result === null) return 'time-outline';
    return result ? 'checkmark-circle' : 'close-circle';
  };

  const getColor = (result: boolean | null) => {
    if (result === null) return '#999';
    return result ? '#10B981' : '#EF4444';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Firebase Test Suite</Text>
      
      <View style={styles.testList}>
        <View style={styles.testItem}>
          <Ionicons 
            name={getIcon(testResults.app)} 
            size={20} 
            color={getColor(testResults.app)} 
          />
          <Text style={styles.testLabel}>Firebase App</Text>
        </View>
        
        <View style={styles.testItem}>
          <Ionicons 
            name={getIcon(testResults.auth)} 
            size={20} 
            color={getColor(testResults.auth)} 
          />
          <Text style={styles.testLabel}>Firebase Auth</Text>
        </View>
        
        <View style={styles.testItem}>
          <Ionicons 
            name={getIcon(testResults.db)} 
            size={20} 
            color={getColor(testResults.db)} 
          />
          <Text style={styles.testLabel}>Firestore</Text>
        </View>
        
        <View style={styles.testItem}>
          <Ionicons 
            name={getIcon(testResults.storage)} 
            size={20} 
            color={getColor(testResults.storage)} 
          />
          <Text style={styles.testLabel}>Firebase Storage</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.retryButton, isRunning && styles.retryButtonDisabled]} 
        onPress={runFirebaseTest}
        disabled={isRunning}
      >
        <Ionicons 
          name={isRunning ? "hourglass-outline" : "refresh-outline"} 
          size={16} 
          color="#FFFFFF" 
        />
        <Text style={styles.retryButtonText}>
          {isRunning ? 'Testing...' : 'Run Test Again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#374151',
  },
  testList: {
    gap: 12,
    marginBottom: 16,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  testLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8,
  },
  retryButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FirebaseTest;
