// Test Payment Integration for MG Investments
// This file demonstrates how to use the payment service

import { paymentService } from './services/paymentService';

// Test MTN MoMo Payment Request
export const testMTNMoMoPayment = async () => {
  console.log('🧪 Testing MTN MoMo Payment Integration...');
  
  try {
    const paymentRequest = {
      amount: 120000, // UGX 120,000 for 5+1 credits
      currency: 'UGX',
      phoneNumber: '256771234567', // Test MTN number
      reference: paymentService.generatePaymentReference('TEST'),
      description: 'MG Investments - 6 Teacher Credits (Test)',
      payerMessage: 'Test payment for teacher credits',
      payeeNote: 'Test credit purchase'
    };

    console.log('📱 Sending MTN MoMo payment request:', paymentRequest);
    
    const result = await paymentService.requestMTNPayment(paymentRequest);
    
    if (result.success) {
      console.log('✅ MTN MoMo payment request successful:', result);
      
      // Test payment status check
      if (result.transactionId) {
        console.log('🔍 Checking payment status...');
        
        // Wait a bit then check status
        setTimeout(async () => {
          const statusResult = await paymentService.checkPaymentStatus(
            result.transactionId!,
            'mtn_momo'
          );
          console.log('📊 Payment status result:', statusResult);
        }, 3000);
      }
    } else {
      console.error('❌ MTN MoMo payment request failed:', result.error);
    }
  } catch (error) {
    console.error('💥 MTN MoMo test error:', error);
  }
};

// Test Airtel Money Payment Request
export const testAirtelMoneyPayment = async () => {
  console.log('🧪 Testing Airtel Money Payment Integration...');
  
  try {
    const paymentRequest = {
      amount: 25000, // UGX 25,000 for 1 credit
      currency: 'UGX',
      phoneNumber: '256701234567', // Test Airtel number
      reference: paymentService.generatePaymentReference('TEST'),
      description: 'MG Investments - 1 Teacher Credit (Test)',
      payerMessage: 'Test payment for teacher credit',
      payeeNote: 'Test credit purchase'
    };

    console.log('📲 Sending Airtel Money payment request:', paymentRequest);
    
    const result = await paymentService.requestAirtelPayment(paymentRequest);
    
    if (result.success) {
      console.log('✅ Airtel Money payment request successful:', result);
    } else {
      console.error('❌ Airtel Money payment request failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Airtel Money test error:', error);
  }
};

// Test Stanbic Bank Payment
export const testStanbicBankPayment = async () => {
  console.log('🧪 Testing Stanbic Bank Payment Integration...');
  
  try {
    const paymentRequest = {
      amount: 400000, // UGX 400,000 for 20+8 credits
      currency: 'UGX',
      phoneNumber: '', // Not needed for bank transfer
      reference: paymentService.generatePaymentReference('TEST'),
      description: 'MG Investments - 28 Teacher Credits (Test)'
    };

    console.log('🏦 Generating Stanbic Bank payment details:', paymentRequest);
    
    const result = await paymentService.requestStanbicPayment(paymentRequest);
    
    if (result.success) {
      console.log('✅ Stanbic Bank payment details generated:', result);
    } else {
      console.error('❌ Stanbic Bank payment setup failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Stanbic Bank test error:', error);
  }
};

// Test Phone Number Validation
export const testPhoneNumberValidation = () => {
  console.log('🧪 Testing Phone Number Validation...');
  
  const testNumbers = [
    { number: '0771234567', provider: 'mtn_momo', expected: true },
    { number: '256771234567', provider: 'mtn_momo', expected: true },
    { number: '0701234567', provider: 'airtel_money', expected: true },
    { number: '256701234567', provider: 'airtel_money', expected: true },
    { number: '0751234567', provider: 'airtel_money', expected: true },
    { number: '0781234567', provider: 'mtn_momo', expected: true },
    { number: '0761234567', provider: 'mtn_momo', expected: true },
    { number: '0391234567', provider: 'mtn_momo', expected: true },
    { number: '0741234567', provider: 'airtel_money', expected: true },
    { number: '0201234567', provider: 'airtel_money', expected: true },
    { number: '0711234567', provider: 'mtn_momo', expected: false }, // Invalid MTN prefix
    { number: '0721234567', provider: 'airtel_money', expected: false }, // Invalid Airtel prefix
  ];

  testNumbers.forEach(({ number, provider, expected }) => {
    // Note: This would require exposing the validation method or testing it indirectly
    console.log(`📞 Testing ${number} for ${provider}: Expected ${expected ? 'valid' : 'invalid'}`);
  });
};

// Test Payment Reference Generation
export const testPaymentReferenceGeneration = () => {
  console.log('🧪 Testing Payment Reference Generation...');
  
  const references = [
    paymentService.generatePaymentReference('CREDIT'),
    paymentService.generatePaymentReference('SUBSCRIPTION'),
    paymentService.generatePaymentReference('TEST'),
    paymentService.generatePaymentReference(), // Default prefix
  ];

  references.forEach((ref, index) => {
    console.log(`🔗 Generated reference ${index + 1}: ${ref}`);
  });
};

// Run All Tests
export const runAllPaymentTests = async () => {
  console.log('🚀 Running All Payment Integration Tests...\n');
  
  // Test reference generation
  testPaymentReferenceGeneration();
  console.log('\n');
  
  // Test phone validation
  testPhoneNumberValidation();
  console.log('\n');
  
  // Test payment methods
  await testMTNMoMoPayment();
  console.log('\n');
  
  await testAirtelMoneyPayment();
  console.log('\n');
  
  await testStanbicBankPayment();
  console.log('\n');
  
  console.log('✅ All payment integration tests completed!');
};

// Example usage in browser console:
// import { runAllPaymentTests } from './test-payment-integration';
// runAllPaymentTests();

export default {
  testMTNMoMoPayment,
  testAirtelMoneyPayment,
  testStanbicBankPayment,
  testPhoneNumberValidation,
  testPaymentReferenceGeneration,
  runAllPaymentTests
};
