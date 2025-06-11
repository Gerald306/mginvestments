// Teacher Data Synchronization Utilities
// Ensures consistency between admin dashboard and live website teacher data

import { Teacher } from '@/services/dataService';

/**
 * Remove duplicate teachers based on email (primary) or full_name (secondary)
 * This ensures only unique teachers are displayed
 */
export const removeDuplicateTeachers = (teachers: Teacher[]): Teacher[] => {
  const seen = new Set<string>();
  const uniqueTeachers: Teacher[] = [];

  for (const teacher of teachers) {
    // Create a unique key based on email (preferred) or full_name
    const uniqueKey = teacher.email?.toLowerCase() || teacher.full_name?.toLowerCase();
    
    if (uniqueKey && !seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      uniqueTeachers.push(teacher);
    } else if (uniqueKey) {
      console.log(`🔄 Duplicate teacher removed: ${teacher.full_name} (${teacher.email || 'no email'})`);
    }
  }

  return uniqueTeachers;
};

/**
 * Normalize teacher data to ensure consistency across admin and website
 * This function standardizes the teacher object format
 */
export const normalizeTeacherData = (teacher: any): Teacher => {
  return {
    id: teacher.id,
    full_name: teacher.full_name || teacher.name || '',
    email: teacher.email || '',
    phone: teacher.phone || teacher.phone_number || '',
    subject_specialization: teacher.subject_specialization || teacher.subject || '',
    experience_years: typeof teacher.experience_years === 'string' 
      ? parseInt(teacher.experience_years) || 0 
      : teacher.experience_years || 0,
    education_level: teacher.education_level || '',
    teaching_levels: Array.isArray(teacher.teaching_levels) 
      ? teacher.teaching_levels 
      : (teacher.teaching_levels ? [teacher.teaching_levels] : []),
    languages: Array.isArray(teacher.languages) 
      ? teacher.languages 
      : (teacher.languages ? [teacher.languages] : []),
    availability: teacher.availability || 'Full-time',
    location: teacher.location || '',
    is_active: teacher.is_active !== undefined ? teacher.is_active : true,
    is_featured: teacher.is_featured || false,
    account_expiry: teacher.account_expiry || '2025-12-31',
    views_count: teacher.views_count || 0,
    status: teacher.status || 'approved',
    profile_picture: teacher.profile_picture || teacher.profile_image,
    bio: teacher.bio || '',
    created_at: teacher.created_at || new Date().toISOString(),
    updated_at: teacher.updated_at || new Date().toISOString()
  };
};

/**
 * Prepare teachers for website display
 * Applies deduplication, normalization, and filtering
 */
export const prepareTeachersForWebsite = (teachers: any[]): Teacher[] => {
  console.log(`🔍 Preparing ${teachers.length} teachers for website display...`);
  
  // Step 1: Normalize all teacher data
  const normalizedTeachers = teachers.map(normalizeTeacherData);
  console.log(`✅ Normalized ${normalizedTeachers.length} teachers`);
  
  // Step 2: Remove duplicates
  const uniqueTeachers = removeDuplicateTeachers(normalizedTeachers);
  console.log(`🔄 Removed duplicates: ${normalizedTeachers.length} -> ${uniqueTeachers.length} teachers`);
  
  // Step 3: Apply website-specific filtering and sorting
  const websiteTeachers = uniqueTeachers
    .map(teacher => ({
      ...teacher,
      is_active: true, // Force active for website display
      status: 'approved' // Force approved status for website display
    }))
    .sort((a, b) => {
      // Sort by featured status first, then by views count
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (b.views_count || 0) - (a.views_count || 0);
    })
    .slice(0, 20); // Limit to 20 teachers for performance
  
  console.log(`✅ Prepared ${websiteTeachers.length} teachers for website display`);
  return websiteTeachers;
};

/**
 * Prepare teachers for admin dashboard
 * Applies deduplication and normalization but keeps original status
 */
export const prepareTeachersForAdmin = (teachers: any[]): any[] => {
  console.log(`🔍 Preparing ${teachers.length} teachers for admin dashboard...`);
  
  // Step 1: Normalize all teacher data
  const normalizedTeachers = teachers.map(teacher => ({
    id: teacher.id,
    full_name: teacher.full_name || teacher.name || '',
    email: teacher.email || '',
    phone_number: teacher.phone || teacher.phone_number || '',
    subject_specialization: teacher.subject_specialization || teacher.subject || '',
    education_level: teacher.education_level || '',
    experience_years: typeof teacher.experience_years === 'string' 
      ? teacher.experience_years 
      : teacher.experience_years?.toString() || '0',
    location: teacher.location || '',
    salary_expectation: teacher.salary_expectation || '0',
    account_expiry: teacher.account_expiry || '2025-12-31',
    is_active: teacher.is_active !== undefined ? teacher.is_active : true,
    is_featured: teacher.is_featured || false,
    created_at: teacher.created_at || new Date().toISOString(),
    last_updated: teacher.updated_at || teacher.last_updated || new Date().toISOString(),
    profile_completion: teacher.profile_completion || 85,
    views_count: teacher.views_count || 0
  }));
  
  // Step 2: Remove duplicates
  const uniqueTeachers = removeDuplicateTeachers(normalizedTeachers);
  console.log(`🔄 Admin: Removed duplicates ${normalizedTeachers.length} -> ${uniqueTeachers.length} teachers`);
  
  console.log(`✅ Prepared ${uniqueTeachers.length} teachers for admin dashboard`);
  return uniqueTeachers;
};

/**
 * Validate teacher data consistency
 * Checks for common data issues
 */
export const validateTeacherData = (teacher: any): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!teacher.id) issues.push('Missing ID');
  if (!teacher.full_name || teacher.full_name.trim() === '') issues.push('Missing full name');
  if (!teacher.email || !teacher.email.includes('@')) issues.push('Invalid or missing email');
  if (!teacher.subject_specialization) issues.push('Missing subject specialization');
  if (teacher.experience_years < 0) issues.push('Invalid experience years');
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Log data synchronization status
 */
export const logDataSyncStatus = (adminCount: number, websiteCount: number) => {
  console.log('📊 Teacher Data Sync Status:');
  console.log(`  Admin Dashboard: ${adminCount} teachers`);
  console.log(`  Website Display: ${websiteCount} teachers`);
  console.log(`  Sync Status: ${adminCount === websiteCount ? '✅ Synchronized' : '⚠️ Different counts'}`);
};
