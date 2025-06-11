import { createDefaultAdmin } from './createAdminUser';
import { initializeIfEmpty } from './initializeFirebaseData';

export const quickAdminSetup = async () => {
  try {
    console.log('🚀 Starting quick admin setup...');
    
    // 1. Create default admin user
    console.log('👤 Creating admin user...');
    const adminResult = await createDefaultAdmin();
    
    if (adminResult.success) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@mginvestments.ug');
      console.log('🔑 Password: Admin123!@#');
    } else {
      console.log('⚠️ Admin user creation result:', adminResult);
    }
    
    // 2. Initialize sample data if needed
    console.log('📚 Initializing sample data...');
    const dataResult = await initializeIfEmpty();
    
    if (dataResult.success) {
      console.log('✅ Sample data initialized successfully!');
    } else {
      console.log('⚠️ Sample data initialization result:', dataResult);
    }
    
    return {
      success: true,
      adminCreated: adminResult.success,
      dataInitialized: dataResult.success,
      credentials: {
        email: 'admin@mginvestments.ug',
        password: 'Admin123!@#'
      }
    };
    
  } catch (error) {
    console.error('❌ Quick admin setup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Auto-run setup if this file is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  console.log('🔧 Quick Admin Setup utility loaded');
  console.log('💡 Run quickAdminSetup() in console to create admin user and sample data');
}
