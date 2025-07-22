// MTN MoMo Integration Test Script
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/mtn';

const runTests = async () => {
  console.log('🧪 MTN MoMo Integration Test Suite');
  console.log('=====================================\n');

  // Test 1: Health Check
  console.log('📋 Test 1: Health Check');
  try {
    const response = await axios.get('http://localhost:3001/health');
    console.log('✅ Health Check:', response.data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }
  console.log('');

  // Test 2: Configuration Check
  console.log('📋 Test 2: Configuration Check');
  try {
    const response = await axios.get(`${BASE_URL}/config`);
    console.log('✅ Configuration:', response.data);
  } catch (error) {
    console.log('❌ Configuration Failed:', error.message);
  }
  console.log('');

  // Test 3: Credentials Test
  console.log('📋 Test 3: Credentials Test');
  try {
    const response = await axios.get(`${BASE_URL}/test-credentials`);
    console.log('✅ Credentials Test:', response.data);
  } catch (error) {
    console.log('❌ Credentials Test Failed:', error.response?.data || error.message);
  }
  console.log('');

  // Test 4: Payment Request (Mock Test)
  console.log('📋 Test 4: Payment Request');
  try {
    const paymentData = {
      amount: 1000,
      currency: 'UGX',
      phoneNumber: '256771234567',
      reference: 'TEST_' + Date.now(),
      description: 'Test Payment',
      payerMessage: 'Testing MTN MoMo Integration',
      payeeNote: 'Integration Test'
    };

    console.log('📱 Sending payment request:', paymentData);
    const response = await axios.post(`${BASE_URL}/request-payment`, paymentData);
    console.log('✅ Payment Request Success:', response.data);

    // Test 5: Payment Status Check
    if (response.data.success && response.data.referenceId) {
      console.log('\n📋 Test 5: Payment Status Check');
      
      // Wait a moment before checking status
      console.log('⏳ Waiting 3 seconds before status check...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const statusResponse = await axios.get(`${BASE_URL}/payment-status/${response.data.referenceId}`);
        console.log('✅ Payment Status:', statusResponse.data);
      } catch (statusError) {
        console.log('❌ Payment Status Failed:', statusError.response?.data || statusError.message);
      }
    }

  } catch (error) {
    console.log('❌ Payment Request Failed:', error.response?.data || error.message);
  }
  console.log('');

  // Test 6: Invalid Phone Number Test
  console.log('📋 Test 6: Invalid Phone Number Test');
  try {
    const invalidPaymentData = {
      amount: 1000,
      currency: 'UGX',
      phoneNumber: '256701234567', // Airtel number (should fail for MTN)
      reference: 'INVALID_TEST_' + Date.now()
    };

    const response = await axios.post(`${BASE_URL}/request-payment`, invalidPaymentData);
    console.log('❌ Should have failed but got:', response.data);
  } catch (error) {
    console.log('✅ Invalid phone number correctly rejected:', error.response?.data?.error);
  }
  console.log('');

  // Test 7: Invalid Amount Test
  console.log('📋 Test 7: Invalid Amount Test');
  try {
    const invalidAmountData = {
      amount: 50, // Below minimum
      currency: 'UGX',
      phoneNumber: '256771234567',
      reference: 'INVALID_AMOUNT_' + Date.now()
    };

    const response = await axios.post(`${BASE_URL}/request-payment`, invalidAmountData);
    console.log('❌ Should have failed but got:', response.data);
  } catch (error) {
    console.log('✅ Invalid amount correctly rejected:', error.response?.data?.error);
  }

  console.log('\n🎉 MTN MoMo Integration Test Complete!');
};

// Run the tests
runTests().catch(console.error);
