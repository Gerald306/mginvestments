import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface FirebaseInitState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

export const useFirebaseInit = () => {
  const [state, setState] = useState<FirebaseInitState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    retryCount: 0,
  });

  const initializeFirebase = async (attempt: number = 0) => {
    try {
      console.log(`🔥 Firebase initialization attempt ${attempt + 1}...`);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: true, 
        error: null,
        retryCount: attempt 
      }));

      // Add delay for React Native to ensure proper module loading
      if (Platform.OS !== 'web') {
        await new Promise(resolve => setTimeout(resolve, 1000 + (attempt * 500)));
      }

      // Dynamic import to ensure Firebase is loaded
      const { auth, db, storage } = await import('../firebase');

      // Test Firebase services
      if (!auth) {
        throw new Error('Firebase Auth not available');
      }

      if (!db) {
        throw new Error('Firestore not available');
      }

      if (!storage) {
        throw new Error('Firebase Storage not available');
      }

      // Additional React Native specific tests
      if (Platform.OS !== 'web') {
        // Test auth state listener
        const unsubscribe = auth.onAuthStateChanged(() => {
          // Just testing if the listener works
        });
        unsubscribe();
        console.log('✅ Auth state listener test passed');
      }

      console.log('✅ Firebase initialization successful');
      setState({
        isInitialized: true,
        isLoading: false,
        error: null,
        retryCount: attempt,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Firebase initialization failed (attempt ${attempt + 1}):`, error);

      // Retry logic for React Native
      if (attempt < 3 && Platform.OS !== 'web') {
        console.log(`🔄 Retrying in ${(attempt + 1) * 1000}ms...`);
        setTimeout(() => {
          initializeFirebase(attempt + 1);
        }, (attempt + 1) * 1000);
      } else {
        setState({
          isInitialized: false,
          isLoading: false,
          error: errorMessage,
          retryCount: attempt,
        });
      }
    }
  };

  useEffect(() => {
    initializeFirebase();
  }, []);

  const retry = () => {
    initializeFirebase(0);
  };

  return {
    ...state,
    retry,
  };
};
