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
import { Teacher } from '../types';

export const teacherService = {
  // Get all teachers
  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const teachersRef = collection(db, 'teachers');
      const snapshot = await getDocs(teachersRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Teacher));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },

  // Get teacher by ID
  async getTeacherById(id: string): Promise<Teacher | null> {
    try {
      const teacherRef = doc(db, 'teachers', id);
      const snapshot = await getDoc(teacherRef);
      
      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as Teacher;
      }
      return null;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw error;
    }
  },

  // Get teacher by user ID
  async getTeacherByUserId(userId: string): Promise<Teacher | null> {
    try {
      const teachersRef = collection(db, 'teachers');
      const q = query(teachersRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Teacher;
      }
      return null;
    } catch (error) {
      console.error('Error fetching teacher by user ID:', error);
      throw error;
    }
  },

  // Create new teacher profile
  async createTeacher(teacherData: Omit<Teacher, 'id'>): Promise<string> {
    try {
      const teachersRef = collection(db, 'teachers');
      const docRef = await addDoc(teachersRef, {
        ...teacherData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  },

  // Update teacher profile
  async updateTeacher(id: string, updates: Partial<Teacher>): Promise<void> {
    try {
      const teacherRef = doc(db, 'teachers', id);
      await updateDoc(teacherRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  },

  // Delete teacher
  async deleteTeacher(id: string): Promise<void> {
    try {
      const teacherRef = doc(db, 'teachers', id);
      await deleteDoc(teacherRef);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  },

  // Search teachers by subject
  async searchTeachersBySubject(subject: string): Promise<Teacher[]> {
    try {
      const teachersRef = collection(db, 'teachers');
      const q = query(
        teachersRef, 
        where('subjects', 'array-contains', subject),
        where('isActive', '==', true),
        where('isApproved', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Teacher));
    } catch (error) {
      console.error('Error searching teachers:', error);
      throw error;
    }
  },

  // Get featured teachers
  async getFeaturedTeachers(limitCount: number = 10): Promise<Teacher[]> {
    try {
      const teachersRef = collection(db, 'teachers');
      const q = query(
        teachersRef,
        where('isActive', '==', true),
        where('isApproved', '==', true),
        where('isPushedToWebsite', '==', true),
        orderBy('profileViews', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Teacher));
    } catch (error) {
      console.error('Error fetching featured teachers:', error);
      throw error;
    }
  },

  // Increment profile views
  async incrementProfileViews(id: string): Promise<void> {
    try {
      const teacherRef = doc(db, 'teachers', id);
      const teacherDoc = await getDoc(teacherRef);
      
      if (teacherDoc.exists()) {
        const currentViews = teacherDoc.data().profileViews || 0;
        await updateDoc(teacherRef, {
          profileViews: currentViews + 1,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error incrementing profile views:', error);
      throw error;
    }
  },
};
