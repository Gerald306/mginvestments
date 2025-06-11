import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { firebaseDb } from './database';
import { Profile } from './types';

// Firebase client to replace Supabase client functionality
export class FirebaseClient {
  // Database operations
  from(collection: string) {
    return firebaseDb.from(collection);
  }

  // Authentication operations
  auth = {
    // Sign in with email and password
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        return { 
          data: { user: userCredential.user }, 
          error: null 
        };
      } catch (error) {
        return { 
          data: null, 
          error 
        };
      }
    },

    // Sign up with email and password
    signUp: async (credentials: { 
      email: string; 
      password: string; 
      options?: { data?: { role?: string; full_name?: string } } 
    }) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;

        // Create user profile in Firestore
        if (credentials.options?.data) {
          const profileData: Profile = {
            id: user.uid,
            email: user.email || credentials.email,
            role: (credentials.options.data.role as 'admin' | 'teacher' | 'school') || 'teacher',
            full_name: credentials.options.data.full_name || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          await setDoc(doc(db, 'profiles', user.uid), profileData);
        }

        return { 
          data: { user }, 
          error: null 
        };
      } catch (error) {
        return { 
          data: null, 
          error 
        };
      }
    },

    // Sign out
    signOut: async () => {
      try {
        await firebaseSignOut(auth);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },

    // Get current session
    getSession: async () => {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve({
            data: { 
              session: user ? { user } : null 
            }
          });
        });
      });
    },

    // Auth state change listener
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        const session = user ? { user } : null;
        const event = user ? 'SIGNED_IN' : 'SIGNED_OUT';
        callback(event, session);
      });

      return {
        data: {
          subscription: {
            unsubscribe
          }
        }
      };
    }
  };

  // Get user profile from Firestore
  async getUserProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { 
          data: docSnap.data() as Profile, 
          error: null 
        };
      } else {
        return { 
          data: null, 
          error: new Error('Profile not found') 
        };
      }
    } catch (error) {
      return { 
        data: null, 
        error 
      };
    }
  }
}

// Create and export the Firebase client instance
export const firebase = new FirebaseClient();

// Export for backward compatibility with existing Supabase imports
export { firebase as supabase };
