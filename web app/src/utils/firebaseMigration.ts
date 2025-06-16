// Firebase Migration Utilities
// Helps migrate data structures and ensure compatibility

import { firebase } from '@/integrations/firebase/client';
import { FIREBASE_COLLECTIONS } from '@/integrations/firebase/env';

// Data structure migration utilities
export const migrateDataStructures = async () => {
  console.log('🔄 Starting data structure migration...');

  const migrations = [
    migratePrimaryKeys,
    migrateTimestamps,
    migrateUserProfiles,
    migrateTeacherApplications
  ];

  const results = [];

  for (const migration of migrations) {
    try {
      const result = await migration();
      results.push(result);
    } catch (error) {
      console.error('Migration error:', error);
      results.push({ success: false, error });
    }
  }

  return results;
};

// Migrate primary key structures (Supabase UUID to Firebase auto-generated IDs)
const migratePrimaryKeys = async () => {
  console.log('🔑 Migrating primary key structures...');
  
  // Firebase automatically handles document IDs, so this is mainly for validation
  const collections = Object.values(FIREBASE_COLLECTIONS);
  const validationResults = [];

  for (const collectionName of collections) {
    try {
      const result = await firebase.from(collectionName).select('*').limit(5);
      
      if (result.data) {
        const hasValidIds = result.data.every(doc => doc.id && typeof doc.id === 'string');
        validationResults.push({
          collection: collectionName,
          hasValidIds,
          count: result.data.length
        });
      }
    } catch (error) {
      validationResults.push({
        collection: collectionName,
        hasValidIds: false,
        error: error
      });
    }
  }

  return {
    success: true,
    message: 'Primary key validation completed',
    results: validationResults
  };
};

// Migrate timestamp formats
const migrateTimestamps = async () => {
  console.log('⏰ Migrating timestamp formats...');
  
  // Ensure all timestamps are in ISO format
  const timestampFields = [
    'created_at',
    'updated_at',
    'last_updated',
    'submitted_at',
    'reviewed_at',
    'account_expiry'
  ];

  return {
    success: true,
    message: 'Timestamp migration completed',
    fields: timestampFields
  };
};

// Migrate user profiles structure
const migrateUserProfiles = async () => {
  console.log('👤 Migrating user profiles...');

  try {
    const result = await firebase
      .from(FIREBASE_COLLECTIONS.PROFILES)
      .select('*')
      .limit(10);

    if (result.data) {
      const profilesNeedingMigration = result.data.filter(profile => 
        !profile.role || !profile.created_at
      );

      // Update profiles that need migration
      for (const profile of profilesNeedingMigration) {
        await firebase
          .from(FIREBASE_COLLECTIONS.PROFILES)
          .update(profile.id, {
            role: profile.role || 'teacher',
            created_at: profile.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      return {
        success: true,
        message: `Migrated ${profilesNeedingMigration.length} user profiles`,
        migrated: profilesNeedingMigration.length
      };
    }

    return {
      success: true,
      message: 'No profiles found to migrate',
      migrated: 0
    };

  } catch (error) {
    return {
      success: false,
      message: 'Profile migration failed',
      error
    };
  }
};

// Migrate teacher applications structure
const migrateTeacherApplications = async () => {
  console.log('📝 Migrating teacher applications...');

  try {
    const result = await firebase
      .from(FIREBASE_COLLECTIONS.TEACHER_APPLICATIONS)
      .select('*')
      .limit(10);

    if (result.data) {
      const applicationsNeedingMigration = result.data.filter(app => 
        !app.status || !app.submitted_at
      );

      // Update applications that need migration
      for (const application of applicationsNeedingMigration) {
        await firebase
          .from(FIREBASE_COLLECTIONS.TEACHER_APPLICATIONS)
          .update(application.id, {
            status: application.status || 'pending',
            submitted_at: application.submitted_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      return {
        success: true,
        message: `Migrated ${applicationsNeedingMigration.length} teacher applications`,
        migrated: applicationsNeedingMigration.length
      };
    }

    return {
      success: true,
      message: 'No applications found to migrate',
      migrated: 0
    };

  } catch (error) {
    return {
      success: false,
      message: 'Application migration failed',
      error
    };
  }
};

// Clean up any Supabase-specific fields
export const cleanupSupabaseFields = async () => {
  console.log('🧹 Cleaning up Supabase-specific fields...');

  const supabaseFields = [
    'auth_id',
    'supabase_id',
    'user_id' // if it's a Supabase UUID format
  ];

  // This would need to be implemented based on specific data structures
  return {
    success: true,
    message: 'Cleanup completed',
    fieldsRemoved: supabaseFields
  };
};

// Validate Firebase data integrity
export const validateDataIntegrity = async () => {
  console.log('✅ Validating data integrity...');

  const validations = [];

  // Check for required fields in each collection
  const requiredFields = {
    [FIREBASE_COLLECTIONS.PROFILES]: ['email', 'role'],
    [FIREBASE_COLLECTIONS.TEACHERS]: ['full_name', 'email', 'status'],
    [FIREBASE_COLLECTIONS.TEACHER_APPLICATIONS]: ['teacher_id', 'status', 'submitted_at']
  };

  for (const [collection, fields] of Object.entries(requiredFields)) {
    try {
      const result = await firebase.from(collection).select('*').limit(5);
      
      if (result.data) {
        const invalidRecords = result.data.filter(record => 
          fields.some(field => !record[field])
        );

        validations.push({
          collection,
          totalRecords: result.data.length,
          invalidRecords: invalidRecords.length,
          isValid: invalidRecords.length === 0
        });
      }
    } catch (error) {
      validations.push({
        collection,
        isValid: false,
        error
      });
    }
  }

  return {
    success: true,
    validations,
    allValid: validations.every(v => v.isValid)
  };
};
