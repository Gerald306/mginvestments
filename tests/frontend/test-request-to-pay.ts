// Test Request to Pay - Exact Configuration from Your Library
// This matches your momo-payment-lib example exactly

import { createMTNMoMoClient, getMTNMoMoConfig } from './services/mtnMomoClient';
import { paymentService } from './services/paymentService';

// Create MTN MoMo client instance (same as your library)
const momoClient = createMTNMoMoClient(getMTNMoMoConfig());

// Test Request to Pay - Exact match to your example
const requestPayment = async () => {
  try {
    console.log('🚀 Testing Request to Pay - Your Library Configuration');
    
    const response = await momoClient.requestPayment({
      amount: 100,
      currency: 'EUR', // Using EUR as in your example
      phoneNumber: '256700123456', // Using your example number
      reference: 'Invoice123', // Using your example reference
    });
    
    console.log('✅ Payment requested:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error requesting payment:', error.message);
    throw error;
  }
};

// Test with Uganda Shillings (UGX) for local payments
const requestPaymentUGX = async () => {
  try {
    console.log('🚀 Testing Request to Pay - Uganda Shillings');
    
    const response = await momoClient.requestPayment({
      amount: 25000, // UGX 25,000 for 1 teacher credit
      currency: 'UGX', // Uganda Shillings
      phoneNumber: '256771234567', // MTN Uganda number
      reference: 'MGINV_CREDIT_001', // MG Investments reference
    });
    
    console.log('✅ Payment requested (UGX):', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error requesting payment (UGX):', error.message);
    throw error;
  }
};

// Test with MG Investments Payment Service (integrated)
const requestPaymentViaMGService = async () => {
  try {
    console.log('🚀 Testing via MG Investments Payment Service');
    
    const response = await paymentService.requestMTNPayment({
      amount: 120000, // UGX 120,000 for 5+1 credits
      currency: 'UGX',
      phoneNumber: '256771234567',
      reference: paymentService.generatePaymentReference('CREDIT'),
      description: 'MG Investments - 6 Teacher Credits',
      payerMessage: 'Payment for teacher credits',
      payeeNote: 'Credit purchase for school portal'
    });
    
    console.log('✅ Payment requested via MG Service:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error requesting payment via MG Service:', error.message);
    throw error;
  }
};

// Check Payment Status - Your Library Style
const checkPaymentStatus = async (referenceId: string) => {
  try {
    console.log('🔍 Checking payment status for:', referenceId);
    
    const status = await momoClient.getPaymentStatus(referenceId);
    console.log('📊 Payment status:', status);
    return status;
  } catch (error: any) {
    console.error('❌ Error fetching status:', error.message);
    throw error;
  }
};

// Full End-to-End Test - Your Library Configuration
const fullEndToEndTest = async () => {
  try {
    console.log('🎯 Running Full End-to-End Test - Your Library Style\n');
    
    // Step 1: Request Payment
    console.log('Step 1: Requesting Payment...');
    const paymentResponse = await requestPayment();
    
    if (paymentResponse.success && paymentResponse.referenceId) {
      console.log('✅ Payment request successful!');
      
      // Step 2: Wait a bit then check status
      console.log('\nStep 2: Waiting 3 seconds before checking status...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Check Payment Status
      console.log('Step 3: Checking Payment Status...');
      const statusResponse = await checkPaymentStatus(paymentResponse.referenceId);
      
      console.log('✅ End-to-end test completed!');
      return {
        paymentResponse,
        statusResponse
      };
    } else {
      console.log('❌ Payment request failed');
      return { paymentResponse };
    }
  } catch (error: any) {
    console.error('💥 End-to-end test error:', error.message);
    throw error;
  }
};

// Test Different Currency Configurations
const testCurrencyConfigurations = async () => {
  console.log('🌍 Testing Different Currency Configurations\n');
  
  const testCases = [
    {
      name: 'EUR (Your Example)',
      amount: 100,
      currency: 'EUR',
      phoneNumber: '256700123456',
      reference: 'Invoice123'
    },
    {
      name: 'UGX (Uganda Shillings)',
      amount: 25000,
      currency: 'UGX',
      phoneNumber: '256771234567',
      reference: 'MGINV_UGX_001'
    },
    {
      name: 'USD (US Dollars)',
      amount: 50,
      currency: 'USD',
      phoneNumber: '256781234567',
      reference: 'MGINV_USD_001'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n💰 Testing ${testCase.name}:`);
      console.log(`   Amount: ${testCase.amount} ${testCase.currency}`);
      console.log(`   Phone: ${testCase.phoneNumber}`);
      
      const response = await momoClient.requestPayment({
        amount: testCase.amount,
        currency: testCase.currency,
        phoneNumber: testCase.phoneNumber,
        reference: testCase.reference,
      });
      
      if (response.success) {
        console.log(`   ✅ ${testCase.name} request successful!`);
        console.log(`   📋 Reference: ${response.referenceId}`);
      } else {
        console.log(`   ❌ ${testCase.name} request failed: ${response.error}`);
      }
    } catch (error: any) {
      console.log(`   💥 ${testCase.name} error: ${error.message}`);
    }
  }
};

// Export test functions for browser console usage
export {
  requestPayment,
  requestPaymentUGX,
  requestPaymentViaMGService,
  checkPaymentStatus,
  fullEndToEndTest,
  testCurrencyConfigurations
};

// Example usage in browser console:
// import { requestPayment, fullEndToEndTest } from './test-request-to-pay';
// 
// // Test your exact configuration
// requestPayment();
// 
// // Run full end-to-end test
// fullEndToEndTest();

// Auto-run test if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('🎯 Request to Pay Test Module Loaded!');
  console.log('Available functions:');
  console.log('  - requestPayment() - Your exact example');
  console.log('  - requestPaymentUGX() - Uganda Shillings version');
  console.log('  - fullEndToEndTest() - Complete test flow');
  console.log('  - testCurrencyConfigurations() - Test different currencies');
  console.log('\nExample: requestPayment().then(console.log)');
}

export default {
  requestPayment,
  requestPaymentUGX,
  requestPaymentViaMGService,
  checkPaymentStatus,
  fullEndToEndTest,
  testCurrencyConfigurations,
  momoClient
};
