const axios = require('axios');
require('dotenv').config();

const config = {
  apiUserId: process.env.MTN_COLLECTION_API_USER_ID,
  primaryKey: process.env.MTN_COLLECTION_PRIMARY_KEY,
  environment: process.env.MTN_ENVIRONMENT || 'sandbox',
  baseUrl: process.env.MTN_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'
};

console.log('🔑 Generating New MTN MoMo API Key');
console.log('==================================');
console.log('API User ID:', config.apiUserId);
console.log('Primary Key:', config.primaryKey.substring(0, 8) + '...');
console.log('Environment:', config.environment);
console.log('');

async function generateNewApiKey() {
  try {
    console.log('🔨 Creating new API Key...');
    
    const response = await axios.post(
      `${config.baseUrl}/v1_0/apiuser/${config.apiUserId}/apikey`,
      null,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': config.primaryKey,
          'X-Target-Environment': config.environment,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const newApiKey = response.data.apiKey;
    
    console.log('✅ New API Key generated successfully!');
    console.log('');
    console.log('🚨 IMPORTANT: Update your .env file with this new API Key:');
    console.log('='.repeat(60));
    console.log(`MTN_COLLECTION_API_KEY=${newApiKey}`);
    console.log('='.repeat(60));
    console.log('');
    console.log('Steps to update:');
    console.log('1. Open d:\\Alpha\\web app\\backend\\.env');
    console.log(`2. Replace the current MTN_COLLECTION_API_KEY value with: ${newApiKey}`);
    console.log('3. Save the file');
    console.log('4. Restart your backend server');
    console.log('');
    
    // Test the new API Key immediately
    console.log('🧪 Testing new API Key...');
    const credentials = Buffer.from(`${config.apiUserId}:${newApiKey}`).toString('base64');
    
    const authResponse = await axios.post(`${config.baseUrl}/collection/token/`, null, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': config.primaryKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ New API Key works perfectly!');
    console.log('- Access Token:', authResponse.data.access_token.substring(0, 20) + '...');
    console.log('- Expires In:', authResponse.data.expires_in, 'seconds');
    
    return newApiKey;
    
  } catch (error) {
    console.error('❌ Failed to generate new API Key:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('');
      console.log('🔍 Possible solutions:');
      console.log('1. Check if your Primary Key is correct');
      console.log('2. Verify your MTN Developer Portal subscription is active');
      console.log('3. Make sure you\'re using the correct environment (sandbox vs production)');
    }
    
    return null;
  }
}

// Run the key generation
generateNewApiKey();
