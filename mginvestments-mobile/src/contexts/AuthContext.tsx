import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../config/firebase';
import { User } from '../types';
import { LoadingScreen } from '../components/LoadingScreen';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'teacher' | 'school') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          // Fetch user profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as User);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Continue without profile data
          }
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      });
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    // Handle demo logins
    if (email.startsWith('demo@') && password === 'demo123') {
      const demoUser = {
        uid: `demo-${Date.now()}`,
        email: email,
        emailVerified: true,
        displayName: null,
        photoURL: null,
        phoneNumber: null,
        providerId: 'demo',
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
      } as FirebaseUser;

      let role: 'teacher' | 'school' | 'admin' = 'teacher';
      if (email === 'demo@school.com') role = 'school';
      else if (email === 'demo@admin.com') role = 'admin';

      const demoProfile: User = {
        id: demoUser.uid,
        email: email,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(demoUser);
      setUserProfile(demoProfile);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, role: 'teacher' | 'school') => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

      // Create user profile in Firestore
      const userProfile: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      setUserProfile(userProfile);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  if (loading) {
    return <LoadingScreen message="Initializing app..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
