const axios = require('axios');
require('dotenv').config();

const config = {
  apiUserId: process.env.MTN_COLLECTION_API_USER_ID,
  apiKey: process.env.MTN_COLLECTION_API_KEY,
  primaryKey: process.env.MTN_COLLECTION_PRIMARY_KEY,
  environment: process.env.MTN_ENVIRONMENT || 'sandbox',
  baseUrl: process.env.MTN_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com'
};

console.log('🔧 MTN MoMo Authentication Debug');
console.log('================================');
console.log('Environment Variables:');
console.log('- MTN_COLLECTION_API_USER_ID:', config.apiUserId);
console.log('- MTN_COLLECTION_API_KEY:', config.apiKey);
console.log('- MTN_COLLECTION_PRIMARY_KEY:', config.primaryKey);
console.log('- MTN_ENVIRONMENT:', config.environment);
console.log('- MTN_API_BASE_URL:', config.baseUrl);
console.log('');

// Step 1: Check if API User exists
async function checkApiUser() {
  try {
    console.log('🔍 Step 1: Checking if API User exists...');
    const response = await axios.get(`${config.baseUrl}/v1_0/apiuser/${config.apiUserId}`, {
      headers: {
        'Ocp-Apim-Subscription-Key': config.primaryKey,
        'X-Target-Environment': config.environment
      }
    });
    
    console.log('✅ API User exists:', response.data);
    return true;
  } catch (error) {
    console.log('❌ API User check failed:', error.response?.status, error.response?.data);
    return false;
  }
}

// Step 2: Create API User if it doesn't exist
async function createApiUser() {
  try {
    console.log('🔨 Step 2: Creating API User...');
    const response = await axios.post(`${config.baseUrl}/v1_0/apiuser`, {
      providerCallbackHost: 'localhost'
    }, {
      headers: {
        'X-Reference-Id': config.apiUserId,
        'Ocp-Apim-Subscription-Key': config.primaryKey,
        'Content-Type': 'application/json',
        'X-Target-Environment': config.environment
      }
    });
    
    console.log('✅ API User created successfully');
    return true;
  } catch (error) {
    console.log('❌ API User creation failed:', error.response?.status, error.response?.data);
    return false;
  }
}

// Step 3: Create API Key
async function createApiKey() {
  try {
    console.log('🔑 Step 3: Creating API Key...');
    const response = await axios.post(`${config.baseUrl}/v1_0/apiuser/${config.apiUserId}/apikey`, null, {
      headers: {
        'Ocp-Apim-Subscription-Key': config.primaryKey,
        'X-Target-Environment': config.environment
      }
    });
    
    console.log('✅ API Key created:', response.data.apiKey);
    console.log('⚠️  IMPORTANT: Update your .env file with this API Key!');
    return response.data.apiKey;
  } catch (error) {
    console.log('❌ API Key creation failed:', error.response?.status, error.response?.data);
    return null;
  }
}

// Step 4: Test Authentication
async function testAuthentication() {
  try {
    console.log('🔐 Step 4: Testing Authentication...');
    const credentials = Buffer.from(`${config.apiUserId}:${config.apiKey}`).toString('base64');
    
    console.log('- Credentials (Base64):', credentials.substring(0, 20) + '...');
    
    const response = await axios.post(`${config.baseUrl}/collection/token/`, null, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': config.primaryKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Authentication successful!');
    console.log('- Access Token:', response.data.access_token.substring(0, 20) + '...');
    console.log('- Token Type:', response.data.token_type);
    console.log('- Expires In:', response.data.expires_in, 'seconds');
    return response.data.access_token;
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.status, error.response?.data);
    return null;
  }
}

// Main debug function
async function debugMTNAuthentication() {
  try {
    // Check if API User exists
    const userExists = await checkApiUser();
    
    if (!userExists) {
      // Create API User
      const userCreated = await createApiUser();
      if (!userCreated) {
        console.log('❌ Cannot proceed without API User');
        return;
      }
      
      // Wait a moment for the user to be created
      console.log('⏳ Waiting 2 seconds for API User to be ready...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create API Key
      const newApiKey = await createApiKey();
      if (newApiKey) {
        console.log('');
        console.log('🚨 ACTION REQUIRED:');
        console.log('Update your .env file with the new API Key:');
        console.log(`MTN_COLLECTION_API_KEY=${newApiKey}`);
        console.log('Then restart this script.');
        return;
      }
    }
    
    // Test authentication with current credentials
    const token = await testAuthentication();
    
    if (token) {
      console.log('');
      console.log('🎉 MTN MoMo setup is working correctly!');
      console.log('Your credentials are valid and authentication is successful.');
    } else {
      console.log('');
      console.log('❌ Authentication still failing. Possible issues:');
      console.log('1. API Key might be incorrect or expired');
      console.log('2. Primary Key might be for wrong environment');
      console.log('3. Subscription might not be active');
      console.log('');
      console.log('Try regenerating your API Key from the MTN Developer Portal:');
      console.log('https://momodeveloper.mtn.com/');
    }
    
  } catch (error) {
    console.error('❌ Debug process failed:', error.message);
  }
}

// Run the debug
debugMTNAuthentication();
