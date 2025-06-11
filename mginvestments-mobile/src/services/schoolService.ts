import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { School } from '../types';

export const schoolService = {
  // Get all schools
  async getAllSchools(): Promise<School[]> {
    try {
      const schoolsRef = collection(db, 'schools');
      const snapshot = await getDocs(schoolsRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as School));
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },

  // Get school by ID
  async getSchoolById(id: string): Promise<School | null> {
    try {
      const schoolRef = doc(db, 'schools', id);
      const snapshot = await getDoc(schoolRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as School;
      }
      return null;
    } catch (error) {
      console.error('Error fetching school:', error);
      throw error;
    }
  },

  // Get school by user ID
  async getSchoolByUserId(userId: string): Promise<School | null> {
    try {
      const schoolsRef = collection(db, 'schools');
      const q = query(schoolsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as School;
      }
      return null;
    } catch (error) {
      console.error('Error fetching school by user ID:', error);
      throw error;
    }
  },

  // Create new school profile
  async createSchool(schoolData: Omit<School, 'id'>): Promise<string> {
    try {
      const schoolsRef = collection(db, 'schools');
      const docRef = await addDoc(schoolsRef, {
        ...schoolData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  },

  // Update school profile
  async updateSchool(id: string, updates: Partial<School>): Promise<void> {
    try {
      const schoolRef = doc(db, 'schools', id);
      await updateDoc(schoolRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  },

  // Delete school
  async deleteSchool(id: string): Promise<void> {
    try {
      const schoolRef = doc(db, 'schools', id);
      await deleteDoc(schoolRef);
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  },

  // Search schools by location
  async searchSchoolsByLocation(location: string): Promise<School[]> {
    try {
      const schoolsRef = collection(db, 'schools');
      const q = query(
        schoolsRef, 
        where('location', '==', location),
        where('isActive', '==', true),
        where('isApproved', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as School));
    } catch (error) {
      console.error('Error searching schools:', error);
      throw error;
    }
  },

  // Get partner schools
  async getPartnerSchools(limitCount: number = 10): Promise<School[]> {
    try {
      const schoolsRef = collection(db, 'schools');
      const q = query(
        schoolsRef,
        where('isActive', '==', true),
        where('isApproved', '==', true),
        where('isPushedToWebsite', '==', true),
        orderBy('teacherCount', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as School));
    } catch (error) {
      console.error('Error fetching partner schools:', error);
      throw error;
    }
  },

  // Get actively hiring schools
  async getActivelyHiringSchools(): Promise<School[]> {
    try {
      const schoolsRef = collection(db, 'schools');
      const q = query(
        schoolsRef,
        where('isActive', '==', true),
        where('isApproved', '==', true),
        where('isActivelyHiring', '==', true),
        orderBy('openJobsCount', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as School));
    } catch (error) {
      console.error('Error fetching actively hiring schools:', error);
      throw error;
    }
  },

  // Update teacher count
  async updateTeacherCount(id: string, count: number): Promise<void> {
    try {
      const schoolRef = doc(db, 'schools', id);
      await updateDoc(schoolRef, {
        teacherCount: count,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating teacher count:', error);
      throw error;
    }
  },

  // Update open jobs count
  async updateOpenJobsCount(id: string, count: number): Promise<void> {
    try {
      const schoolRef = doc(db, 'schools', id);
      await updateDoc(schoolRef, {
        openJobsCount: count,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating open jobs count:', error);
      throw error;
    }
  },
};
