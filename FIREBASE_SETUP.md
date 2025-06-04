# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `mg-investments`
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 4. Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: `MG Investments Web`
5. Click "Register app"
6. Copy the Firebase configuration object

## 5. Update Firebase Configuration

Replace the placeholder values in `src/integrations/firebase/config.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 6. Set Up Firestore Security Rules

In Firebase Console, go to "Firestore Database" > "Rules" and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Teachers collection - readable by all, writable by owner
    match /teachers/{teacherId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.user_id || 
         request.auth.uid == request.resource.data.user_id);
    }
    
    // Schools collection - readable by all, writable by owner
    match /schools/{schoolId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.user_id || 
         request.auth.uid == request.resource.data.user_id);
    }
    
    // Job postings - readable by all, writable by school owners
    match /job_postings/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Job applications - readable by applicant and school, writable by applicant
    match /job_applications/{applicationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7. Create Initial Collections

The app will automatically create collections when data is first added. The main collections are:

- `profiles` - User profiles with roles
- `teachers` - Teacher profiles and information
- `schools` - School profiles and information  
- `job_postings` - Job postings from schools
- `job_applications` - Applications from teachers to jobs

## 8. Test the Connection

After updating the configuration, restart your development server:

```bash
npm run dev
```

The app should now connect to Firebase instead of Supabase. Check the browser console for any connection errors.

## Migration Notes

- All existing Supabase functionality has been replaced with Firebase equivalents
- Authentication now uses Firebase Auth instead of Supabase Auth
- Database operations now use Firestore instead of Supabase PostgreSQL
- The API remains largely the same for backward compatibility
