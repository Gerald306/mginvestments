const axios = require('axios');
require('dotenv').config();

console.log('🧪 Testing MTN MoMo with EUR Currency');
console.log('====================================');

async function testWithEUR() {
  try {
    const paymentData = {
      amount: 10, // EUR amount (equivalent to ~1000 UGX)
      currency: 'EUR',
      phoneNumber: '256771234567',
      reference: 'TEST_EUR_' + Date.now(),
      description: 'EUR Test Payment',
      payerMessage: 'Testing MTN MoMo with EUR',
      payeeNote: 'EUR Integration Test'
    };
    
    console.log('📱 Sending EUR payment request:', paymentData);
    
    const response = await axios.post('http://localhost:3001/api/mtn/request-payment', paymentData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Payment Request Response:', response.data);
    
    if (response.data.mode === 'real') {
      console.log('🎉 SUCCESS: Real MTN MoMo integration is working with EUR!');
      
      // Test status check
      console.log('');
      console.log('⏳ Testing payment status check...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await axios.get(`http://localhost:3001/api/mtn/payment-status/${response.data.referenceId}`);
      console.log('📊 Payment Status:', statusResponse.data);
      
    } else if (response.data.mode === 'mock') {
      console.log('⚠️  Still using mock service. Currency issue might persist.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Also test with UGX to see if we get the same currency error
async function testWithUGX() {
  try {
    console.log('');
    console.log('🧪 Testing MTN MoMo with UGX Currency');
    console.log('====================================');
    
    const paymentData = {
      amount: 1000,
      currency: 'UGX',
      phoneNumber: '256771234567',
      reference: 'TEST_UGX_' + Date.now(),
      description: 'UGX Test Payment',
      payerMessage: 'Testing MTN MoMo with UGX',
      payeeNote: 'UGX Integration Test'
    };
    
    console.log('📱 Sending UGX payment request:', paymentData);
    
    const response = await axios.post('http://localhost:3001/api/mtn/request-payment', paymentData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Payment Request Response:', response.data);
    
  } catch (error) {
    console.error('❌ UGX Test failed:', error.response?.data || error.message);
  }
}

async function runTests() {
  await testWithEUR();
  await testWithUGX();
}

runTests();
