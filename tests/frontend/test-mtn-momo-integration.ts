// Test MTN MoMo Integration for MG Investments
// This file tests the real MTN MoMo API integration

import { paymentService } from './services/paymentService';

// Test MTN MoMo Payment Request with Real API
export const testRealMTNMoMoPayment = async () => {
  console.log('🧪 Testing REAL MTN MoMo Payment Integration...');
  
  try {
    const paymentRequest = {
      amount: 25000, // UGX 25,000 for 1 credit (small test amount)
      currency: 'UGX',
      phoneNumber: '256771234567', // Test MTN number
      reference: paymentService.generatePaymentReference('TEST'),
      description: 'MG Investments - 1 Teacher Credit (Test)',
      payerMessage: 'Test payment for teacher credit',
      payeeNote: 'Test credit purchase'
    };

    console.log('📱 Sending REAL MTN MoMo payment request:', paymentRequest);
    
    const result = await paymentService.requestMTNPayment(paymentRequest);
    
    if (result.success) {
      console.log('✅ REAL MTN MoMo payment request successful:', result);
      
      // Test payment status check with real API
      if (result.transactionId) {
        console.log('🔍 Checking REAL payment status...');
        
        // Wait a bit then check status
        setTimeout(async () => {
          const statusResult = await paymentService.checkPaymentStatus(
            result.transactionId!,
            'mtn_momo'
          );
          console.log('📊 REAL Payment status result:', statusResult);
        }, 5000); // Wait 5 seconds before checking status
      }
    } else {
      console.error('❌ REAL MTN MoMo payment request failed:', result.error);
    }
  } catch (error) {
    console.error('💥 REAL MTN MoMo test error:', error);
  }
};

// Test Phone Number Validation with Real MTN Client
export const testRealPhoneValidation = () => {
  console.log('🧪 Testing REAL Phone Number Validation...');
  
  const testNumbers = [
    { number: '0771234567', expected: true, description: 'MTN local format' },
    { number: '256771234567', expected: true, description: 'MTN international format' },
    { number: '0781234567', expected: true, description: 'MTN 78 prefix' },
    { number: '0761234567', expected: true, description: 'MTN 76 prefix' },
    { number: '0391234567', expected: true, description: 'MTN 39 prefix' },
    { number: '0701234567', expected: false, description: 'Airtel number (should fail)' },
    { number: '0751234567', expected: false, description: 'Airtel number (should fail)' },
    { number: '1234567890', expected: false, description: 'Invalid number' },
  ];

  testNumbers.forEach(({ number, expected, description }) => {
    try {
      const isValid = paymentService['mtnMomoClient'].validateMTNPhoneNumber(number);
      const status = isValid === expected ? '✅' : '❌';
      console.log(`${status} ${description}: ${number} -> ${isValid ? 'VALID' : 'INVALID'}`);
    } catch (error) {
      console.error(`❌ Error testing ${number}:`, error);
    }
  });
};

// Test Phone Number Formatting with Real MTN Client
export const testRealPhoneFormatting = () => {
  console.log('🧪 Testing REAL Phone Number Formatting...');
  
  const testNumbers = [
    '0771234567',
    '771234567',
    '256771234567',
    '+256771234567',
    '0781234567',
    '0761234567',
    '0391234567'
  ];

  testNumbers.forEach((number) => {
    try {
      const formatted = paymentService['mtnMomoClient'].formatPhoneNumber(number);
      console.log(`📞 ${number} -> ${formatted}`);
    } catch (error) {
      console.error(`❌ Error formatting ${number}:`, error);
    }
  });
};

// Test Payment Service Configuration
export const testPaymentServiceConfig = () => {
  console.log('🧪 Testing Payment Service Configuration...');
  
  try {
    // Test if MTN MoMo client is properly initialized
    const mtnClient = paymentService['mtnMomoClient'];
    console.log('✅ MTN MoMo client initialized:', !!mtnClient);
    
    // Test payment methods
    const paymentMethods = paymentService.getPaymentMethods();
    console.log('✅ Payment methods available:', paymentMethods.length);
    
    paymentMethods.forEach((method) => {
      console.log(`  - ${method.name} (${method.id}): ${method.enabled ? 'ENABLED' : 'DISABLED'}`);
    });
    
    // Test reference generation
    const reference = paymentService.generatePaymentReference('TEST');
    console.log('✅ Payment reference generated:', reference);
    
  } catch (error) {
    console.error('❌ Payment service configuration error:', error);
  }
};

// Test Environment Variables
export const testEnvironmentConfig = () => {
  console.log('🧪 Testing Environment Configuration...');
  
  const requiredEnvVars = [
    'REACT_APP_MTN_COLLECTION_API_USER_ID',
    'REACT_APP_MTN_COLLECTION_API_KEY',
    'REACT_APP_MTN_COLLECTION_PRIMARY_KEY',
    'REACT_APP_MTN_ENVIRONMENT'
  ];

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar];
    const status = value ? '✅' : '❌';
    const displayValue = value ? (value.length > 10 ? value.substring(0, 10) + '...' : value) : 'NOT SET';
    console.log(`${status} ${envVar}: ${displayValue}`);
  });
  
  if (requiredEnvVars.every(envVar => process.env[envVar])) {
    console.log('✅ All required environment variables are set!');
  } else {
    console.log('❌ Some environment variables are missing. Check your .env file.');
  }
};

// Run All Tests
export const runAllMTNMoMoTests = async () => {
  console.log('🚀 Running All REAL MTN MoMo Integration Tests...\n');
  
  // Test environment configuration
  testEnvironmentConfig();
  console.log('\n');
  
  // Test payment service configuration
  testPaymentServiceConfig();
  console.log('\n');
  
  // Test phone validation
  testRealPhoneValidation();
  console.log('\n');
  
  // Test phone formatting
  testRealPhoneFormatting();
  console.log('\n');
  
  // Test real payment (only if environment is configured)
  const hasCredentials = process.env.REACT_APP_MTN_COLLECTION_API_USER_ID && 
                        process.env.REACT_APP_MTN_COLLECTION_API_KEY && 
                        process.env.REACT_APP_MTN_COLLECTION_PRIMARY_KEY;
  
  if (hasCredentials) {
    console.log('🔑 MTN MoMo credentials found. Testing real payment...\n');
    await testRealMTNMoMoPayment();
  } else {
    console.log('⚠️ MTN MoMo credentials not found. Skipping real payment test.');
    console.log('   Add your credentials to .env file to test real payments.');
  }
  
  console.log('\n✅ All MTN MoMo integration tests completed!');
};

// Example usage in browser console:
// import { runAllMTNMoMoTests } from './test-mtn-momo-integration';
// runAllMTNMoMoTests();

export default {
  testRealMTNMoMoPayment,
  testRealPhoneValidation,
  testRealPhoneFormatting,
  testPaymentServiceConfig,
  testEnvironmentConfig,
  runAllMTNMoMoTests
};
