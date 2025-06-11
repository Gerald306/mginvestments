import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface FirebaseTestResult {
  test: string;
  success: boolean;
  message: string;
  duration: number;
  error?: any;
}

export class FirebaseTestSuite {
  private results: FirebaseTestResult[] = [];
  private testUser: User | null = null;

  async runAllTests(): Promise<FirebaseTestResult[]> {
    console.log('🔥 Starting Firebase Test Suite...');
    this.results = [];

    // Test Firebase connection
    await this.testFirebaseConnection();
    
    // Test Authentication
    await this.testAuthentication();
    
    // Test Firestore
    await this.testFirestore();
    
    // Cleanup
    await this.cleanup();

    return this.results;
  }

  private async runTest(
    testName: string, 
    testFunction: () => Promise<void>
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      await testFunction();
      const duration = Date.now() - startTime;
      
      this.results.push({
        test: testName,
        success: true,
        message: 'Test passed successfully',
        duration
      });
      
      console.log(`✅ ${testName} - Passed (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        test: testName,
        success: false,
        message: error.message || 'Unknown error',
        duration,
        error
      });
      
      console.log(`❌ ${testName} - Failed (${duration}ms):`, error.message);
    }
  }

  private async testFirebaseConnection(): Promise<void> {
    await this.runTest('Firebase Connection', async () => {
      // Test if Firebase is properly initialized
      if (!auth || !db) {
        throw new Error('Firebase services not initialized');
      }

      // Test auth connection
      if (!auth.app) {
        throw new Error('Firebase Auth not connected');
      }

      // Test firestore connection
      if (!db.app) {
        throw new Error('Firebase Firestore not connected');
      }

      console.log('Firebase services initialized successfully');
    });
  }

  private async testAuthentication(): Promise<void> {
    const testEmail = `test-${Date.now()}@mginvestments.com`;
    const testPassword = 'TestPassword123!';

    // Test user creation
    await this.runTest('User Registration', async () => {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        testEmail, 
        testPassword
      );
      
      this.testUser = userCredential.user;
      
      if (!this.testUser) {
        throw new Error('User creation failed - no user returned');
      }

      console.log('Test user created:', this.testUser.uid);
    });

    // Test user login
    await this.runTest('User Login', async () => {
      if (!this.testUser) {
        throw new Error('No test user available for login test');
      }

      await signOut(auth);
      
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        testEmail, 
        testPassword
      );
      
      if (!userCredential.user) {
        throw new Error('Login failed - no user returned');
      }

      console.log('Test user logged in successfully');
    });

    // Test user logout
    await this.runTest('User Logout', async () => {
      await signOut(auth);
      
      if (auth.currentUser) {
        throw new Error('User logout failed - user still authenticated');
      }

      console.log('Test user logged out successfully');
    });
  }

  private async testFirestore(): Promise<void> {
    let testDocId: string | null = null;

    // Test document creation
    await this.runTest('Firestore Write', async () => {
      const testData = {
        name: 'Test Document',
        email: 'test@mginvestments.com',
        role: 'teacher',
        createdAt: serverTimestamp(),
        testId: Date.now()
      };

      const docRef = await addDoc(collection(db, 'test_users'), testData);
      testDocId = docRef.id;
      
      if (!testDocId) {
        throw new Error('Document creation failed - no ID returned');
      }

      console.log('Test document created:', testDocId);
    });

    // Test document reading
    await this.runTest('Firestore Read', async () => {
      const querySnapshot = await getDocs(collection(db, 'test_users'));
      
      if (querySnapshot.empty) {
        throw new Error('No documents found in test collection');
      }

      let foundTestDoc = false;
      querySnapshot.forEach((doc) => {
        if (doc.id === testDocId) {
          foundTestDoc = true;
          console.log('Test document found:', doc.data());
        }
      });

      if (!foundTestDoc && testDocId) {
        throw new Error('Test document not found in collection');
      }
    });

    // Test document update
    await this.runTest('Firestore Update', async () => {
      if (!testDocId) {
        throw new Error('No test document ID available for update');
      }

      const updateData = {
        updatedAt: serverTimestamp(),
        status: 'updated'
      };

      await setDoc(doc(db, 'test_users', testDocId), updateData, { merge: true });
      
      console.log('Test document updated successfully');
    });

    // Test document deletion
    await this.runTest('Firestore Delete', async () => {
      if (!testDocId) {
        throw new Error('No test document ID available for deletion');
      }

      await deleteDoc(doc(db, 'test_users', testDocId));
      
      console.log('Test document deleted successfully');
    });
  }

  private async cleanup(): Promise<void> {
    await this.runTest('Cleanup', async () => {
      // Delete test user if it exists
      if (this.testUser) {
        try {
          await this.testUser.delete();
          console.log('Test user deleted successfully');
        } catch (error: any) {
          // User might already be deleted or not authenticated
          console.log('Test user cleanup note:', error.message);
        }
      }

      // Sign out any remaining session
      if (auth.currentUser) {
        await signOut(auth);
      }

      console.log('Cleanup completed');
    });
  }

  getTestSummary(): {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return { total, passed, failed, duration };
  }

  printResults(): void {
    console.log('\n🔥 Firebase Test Results Summary');
    console.log('================================');
    
    const summary = this.getTestSummary();
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Total Duration: ${summary.duration}ms`);
    
    console.log('\nDetailed Results:');
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test} (${result.duration}ms)`);
      if (!result.success) {
        console.log(`   Error: ${result.message}`);
      }
    });
  }
}
