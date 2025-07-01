import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/config';

export interface AdminUserData {
  email: string;
  password: string;
  fullName: string;
}

export const createAdminUser = async (userData: AdminUserData) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;

    // Create profile document in Firestore
    const profileData = {
      id: user.uid,
      email: user.email,
      role: 'admin',
      full_name: userData.fullName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };

    await setDoc(doc(db, 'profiles', user.uid), profileData);

    return {
      success: true,
      user: user,
      profile: profileData,
      message: 'Admin user created successfully'
    };

  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      error: error.message || 'Failed to create admin user',
      code: error.code
    };
  }
};

// Default admin user credentials
export const DEFAULT_ADMIN = {
  email: 'admin@mginvestments.ug',
  password: 'Admin123!@#',
  fullName: 'System Administrator'
};

// Function to create default admin user
export const createDefaultAdmin = () => createAdminUser(DEFAULT_ADMIN);
