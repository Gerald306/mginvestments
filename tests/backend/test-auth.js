// Test MTN MoMo Authentication
const axios = require('axios');
require('dotenv').config();

const testMTNAuth = async () => {
  console.log('🧪 Testing MTN MoMo Authentication...');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('- API User ID:', process.env.MTN_COLLECTION_API_USER_ID ? '✅ Set' : '❌ Missing');
  console.log('- API Key:', process.env.MTN_COLLECTION_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- Primary Key:', process.env.MTN_COLLECTION_PRIMARY_KEY ? '✅ Set' : '❌ Missing');
  console.log('- Environment:', process.env.MTN_ENVIRONMENT || 'sandbox');
  console.log('- Base URL:', process.env.MTN_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com');

  // Test authentication
  try {
    const credentials = Buffer.from(`${process.env.MTN_COLLECTION_API_USER_ID}:${process.env.MTN_COLLECTION_API_KEY}`).toString('base64');
    
    console.log('\n🔐 Testing Authentication...');
    console.log('- Credentials (Base64):', credentials.substring(0, 20) + '...');
    
    const response = await axios.post(
      `${process.env.MTN_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'}/collection/token/`,
      null,
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': process.env.MTN_COLLECTION_PRIMARY_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Authentication Successful!');
    console.log('- Access Token:', response.data.access_token.substring(0, 20) + '...');
    console.log('- Token Type:', response.data.token_type);
    console.log('- Expires In:', response.data.expires_in, 'seconds');
    
  } catch (error) {
    console.error('❌ Authentication Failed!');
    console.error('- Status:', error.response?.status);
    console.error('- Status Text:', error.response?.statusText);
    console.error('- Error Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Possible Issues:');
      console.log('1. Invalid API User ID or API Key');
      console.log('2. Expired or inactive subscription key');
      console.log('3. API User not properly created');
      console.log('4. Wrong environment (sandbox vs production)');
    }
  }
};

testMTNAuth();
