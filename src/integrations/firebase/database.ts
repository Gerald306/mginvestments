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
  limit,
  QueryConstraint,
  DocumentData,
  CollectionReference
} from 'firebase/firestore';
import { db } from './config';

// Query builder class to match Supabase API
class QueryBuilder {
  private constraints: QueryConstraint[] = [];
  private includeCount: boolean = false;

  constructor(private collectionRef: CollectionReference<DocumentData>, includeCount: boolean = false) {
    this.includeCount = includeCount;
  }

  eq(field: string, value: any) {
    this.constraints.push(where(field, '==', value));
    return this;
  }

  gte(field: string, value: any) {
    this.constraints.push(where(field, '>=', value));
    return this;
  }

  lte(field: string, value: any) {
    this.constraints.push(where(field, '<=', value));
    return this;
  }

  order(field: string, options: { ascending: boolean }) {
    this.constraints.push(orderBy(field, options.ascending ? 'asc' : 'desc'));
    return this;
  }

  limit(count: number) {
    this.constraints.push(limit(count));
    return this;
  }

  single() {
    this.constraints.push(limit(1));
    return this;
  }

  async execute(): Promise<{ data: any; error: any; count?: number }> {
    try {
      const q = this.constraints.length > 0
        ? query(this.collectionRef, ...this.constraints)
        : this.collectionRef;

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Check if single() was called by looking for limit(1)
      const hasLimitOne = this.constraints.some(constraint => {
        // Check if this is a limit constraint with value 1
        return constraint.toString().includes('limit') && constraint.toString().includes('1');
      });

      if (hasLimitOne) {
        return {
          data: data[0] || null,
          error: null,
          count: this.includeCount ? data.length : undefined
        };
      }

      return {
        data,
        error: null,
        count: this.includeCount ? data.length : undefined
      };
    } catch (error) {
      console.error('Firebase query error:', error);
      return {
        data: null,
        error,
        count: 0
      };
    }
  }

  // Make the QueryBuilder thenable so it can be awaited directly
  then(onFulfilled?: any, onRejected?: any) {
    return this.execute().then(onFulfilled, onRejected);
  }
}

// Database service class to replace Supabase functionality
export class FirebaseDatabase {
  
  // Generic method to get all documents from a collection
  from(collectionName: string) {
    const collectionRef = collection(db, collectionName);

    return {
      select: (fields: string = '*', options?: { count?: string }) => {
        const queryBuilder = new QueryBuilder(collectionRef, options?.count === 'exact');
        return queryBuilder;
      },
      insert: (data: any) => this.insert(collectionRef, data),
      update: (id: string, data: any) => this.update(collectionName, id, data),
      delete: (id: string) => this.delete(collectionName, id)
    };
  }

  private async insert(collectionRef: CollectionReference<DocumentData>, data: any) {
    try {
      const docRef = await addDoc(collectionRef, {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return { 
        data: { id: docRef.id, ...data }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error 
      };
    }
  }

  private async update(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString()
      });
      
      return { 
        data: { id, ...data }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error 
      };
    }
  }

  private async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      return { 
        data: { id }, 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error 
      };
    }
  }

  // Method to get a single document
  async getDocument(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { 
          data: { id: docSnap.id, ...docSnap.data() }, 
          error: null 
        };
      } else {
        return { 
          data: null, 
          error: new Error('Document not found') 
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

// Create and export a database instance
export const firebaseDb = new FirebaseDatabase();
