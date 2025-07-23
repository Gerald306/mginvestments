const axios = require('axios');
require('dotenv').config();

console.log('🔍 MTN MoMo Environment Analysis');
console.log('=================================');
console.log('');

async function analyzeEnvironment() {
  const config = {
    environment: process.env.MTN_ENVIRONMENT,
    baseUrl: process.env.MTN_API_BASE_URL,
    primaryKey: process.env.MTN_COLLECTION_PRIMARY_KEY
  };
  
  console.log('📊 Current Configuration:');
  console.log(`Environment: ${config.environment}`);
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Primary Key: ${config.primaryKey.substring(0, 8)}...`);
  console.log('');
  
  if (config.environment === 'sandbox') {
    console.log('🧪 SANDBOX ENVIRONMENT DETECTED');
    console.log('===============================');
    console.log('');
    console.log('✅ What works in sandbox:');
    console.log('  • API authentication');
    console.log('  • Payment request acceptance');
    console.log('  • Status tracking');
    console.log('  • All API endpoints');
    console.log('');
    console.log('❌ What does NOT work in sandbox:');
    console.log('  • Real SMS to phones');
    console.log('  • MoMo PIN prompts');
    console.log('  • Actual money transfer');
    console.log('  • Real user interaction');
    console.log('');
    console.log('🎭 Sandbox Simulation:');
    console.log('  • Payments auto-complete after ~3 seconds');
    console.log('  • Status changes to "SUCCESSFUL" automatically');
    console.log('  • No actual phone interaction required');
    console.log('');
    
    console.log('🚀 TO GET REAL SMS PROMPTS:');
    console.log('==========================');
    console.log('1. Go to https://momodeveloper.mtn.com/');
    console.log('2. Apply for PRODUCTION access (not sandbox)');
    console.log('3. Complete MTN\'s verification process');
    console.log('4. Get production Primary Key, API User ID, and API Key');
    console.log('5. Update your .env file with production credentials');
    console.log('6. Change MTN_ENVIRONMENT from "sandbox" to "production"');
    console.log('7. Update MTN_API_BASE_URL to production URL');
    console.log('');
    
    console.log('⚠️  PRODUCTION REQUIREMENTS:');
    console.log('============================');
    console.log('• Business verification with MTN');
    console.log('• Valid business registration');
    console.log('• Compliance documentation');
    console.log('• Integration testing approval');
    console.log('• Production environment approval');
    console.log('');
    
    console.log('💡 ALTERNATIVE FOR TESTING:');
    console.log('===========================');
    console.log('Some developers report that MTN Uganda sandbox');
    console.log('occasionally sends real SMS for testing purposes,');
    console.log('but this is not guaranteed and not documented.');
  }
  
  // Test current environment capabilities
  console.log('🧪 Testing Current Environment Capabilities...');
  console.log('');
  
  try {
    // Test with a different phone number to see behavior
    const testPayment = {
      amount: 1000,
      currency: 'UGX',
      phoneNumber: '256771234567', // Test number
      reference: 'ENV_TEST_' + Date.now(),
      description: 'Environment Capability Test',
      payerMessage: 'Testing SMS capability',
      payeeNote: 'Environment Test'
    };
    
    console.log('📱 Sending test payment to verify SMS behavior...');
    const response = await axios.post('http://localhost:3001/api/mtn/request-payment', testPayment, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
    
    console.log('✅ Test Payment Response:');
    console.log(`  Mode: ${response.data.mode}`);
    console.log(`  Status: ${response.data.status}`);
    console.log(`  Reference: ${response.data.referenceId}`);
    console.log('');
    
    // Check status after a delay
    console.log('⏳ Checking payment status in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const statusResponse = await axios.get(`http://localhost:3001/api/mtn/payment-status/${response.data.referenceId}`);
    console.log('📊 Status Check Result:');
    console.log(`  Status: ${statusResponse.data.status}`);
    console.log(`  Amount: ${statusResponse.data.amount} ${statusResponse.data.currency}`);
    
    if (statusResponse.data.status === 'completed') {
      console.log('');
      console.log('🔍 CONCLUSION:');
      console.log('==============');
      console.log('This confirms sandbox behavior:');
      console.log('• Payment auto-completes without user interaction');
      console.log('• No SMS sent to actual phones');
      console.log('• Status changes automatically');
      console.log('');
      console.log('For real SMS prompts, you need production credentials.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

analyzeEnvironment();
