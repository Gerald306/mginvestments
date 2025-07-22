const axios = require('axios');
require('dotenv').config();

console.log('🧪 Testing Real MTN MoMo Payment Request');
console.log('==========================================');

async function testRealPaymentRequest() {
  try {
    const paymentData = {
      amount: 1000,
      currency: 'UGX',
      phoneNumber: '256771234567',
      reference: 'TEST_REAL_' + Date.now(),
      description: 'Real MTN Test Payment',
      payerMessage: 'Testing Real MTN MoMo Integration',
      payeeNote: 'Real Integration Test'
    };
    
    console.log('📱 Sending real payment request:', paymentData);
    
    const response = await axios.post('http://localhost:3001/api/mtn/request-payment', paymentData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Payment Request Response:', response.data);
    
    if (response.data.mode === 'real') {
      console.log('🎉 SUCCESS: Real MTN MoMo integration is working!');
      
      // Test status check
      console.log('');
      console.log('⏳ Testing payment status check...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(`http://localhost:3001/api/mtn/payment-status/${response.data.referenceId}`);
      console.log('📊 Payment Status:', statusResponse.data);
      
    } else if (response.data.mode === 'mock') {
      console.log('⚠️  Still using mock service. Let me check the logs...');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRealPaymentRequest();
