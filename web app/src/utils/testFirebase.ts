import { firebase } from '@/integrations/firebase/client';

// Simple test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test basic query
    const result = await firebase
      .from('teachers')
      .select('*');
    
    console.log('📊 Firebase test result:', {
      success: !result.error,
      dataCount: result.data?.length || 0,
      error: result.error?.message || 'none'
    });
    
    if (result.error) {
      console.error('❌ Firebase connection error:', result.error);
      return { success: false, error: result.error };
    }
    
    console.log('✅ Firebase connection successful!');
    console.log('📋 Sample data:', result.data?.slice(0, 2));
    
    return { 
      success: true, 
      data: result.data,
      count: result.data?.length || 0
    };
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return { success: false, error };
  }
};

// Test function to add a sample teacher
export const testAddTeacher = async () => {
  try {
    console.log('🧪 Testing add teacher...');
    
    const sampleTeacher = {
      full_name: "Test Teacher",
      email: "test@example.com",
      phone: "+256700000000",
      subject_specialization: "Mathematics",
      experience_years: 5,
      education_level: "Bachelor's Degree",
      teaching_levels: ["Secondary"],
      languages: ["English"],
      availability: "Full-time",
      location: "Kampala",
      is_active: true,
      is_featured: false,
      account_expiry: "2025-12-31",
      views_count: 0,
      status: "approved",
      bio: "Test teacher for Firebase connection verification"
    };
    
    const result = await firebase
      .from('teachers')
      .insert(sampleTeacher);
    
    console.log('📊 Add teacher result:', {
      success: !result.error,
      data: result.data,
      error: result.error?.message || 'none'
    });
    
    return result;
  } catch (error) {
    console.error('❌ Add teacher test failed:', error);
    return { data: null, error };
  }
};

// Initialize sample data if needed
export const initializeSampleData = async () => {
  try {
    console.log('🔄 Initializing sample data...');
    
    const { initializeIfEmpty } = await import('@/utils/initializeFirebaseData');
    const result = await initializeIfEmpty();
    
    console.log('📊 Initialize result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Initialize failed:', error);
    return { success: false, error };
  }
};

// Run all tests
export const runAllFirebaseTests = async () => {
  console.log('🚀 Running all Firebase tests...');
  
  const results = {
    connection: await testFirebaseConnection(),
    initialize: await initializeSampleData(),
    connectionAfterInit: await testFirebaseConnection()
  };
  
  console.log('📋 All test results:', results);
  
  return results;
};
