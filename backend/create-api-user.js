// Create New MTN MoMo API User
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const createNewAPIUser = async () => {
  console.log('🔧 Creating New MTN MoMo API User...');
  
  const newAPIUserId = uuidv4();
  const primaryKey = process.env.MTN_COLLECTION_PRIMARY_KEY;
  
  console.log('📋 Using:');
  console.log('- Primary Key:', primaryKey);
  console.log('- New API User ID:', newAPIUserId);
  
  try {
    // Step 1: Create API User
    console.log('\n🔄 Step 1: Creating API User...');
    
    const createUserResponse = await axios.post(
      'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser',
      {
        providerCallbackHost: 'localhost'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': primaryKey,
          'X-Reference-Id': newAPIUserId
        }
      }
    );
    
    console.log('✅ API User Created Successfully!');
    console.log('- Status:', createUserResponse.status);
    
    // Wait a moment for the user to be ready
    console.log('\n⏳ Waiting 3 seconds for user to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 2: Generate API Key
    console.log('\n🔄 Step 2: Generating API Key...');
    
    const apiKeyResponse = await axios.post(
      `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${newAPIUserId}/apikey`,
      null,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': primaryKey
        }
      }
    );
    
    console.log('✅ API Key Generated Successfully!');
    console.log('- API Key:', apiKeyResponse.data.apiKey);
    
    // Step 3: Update .env file content
    console.log('\n📝 Updated Credentials:');
    console.log('MTN_COLLECTION_API_USER_ID=' + newAPIUserId);
    console.log('MTN_COLLECTION_API_KEY=' + apiKeyResponse.data.apiKey);
    console.log('MTN_COLLECTION_PRIMARY_KEY=' + primaryKey);
    
    console.log('\n💡 Copy these values to your .env file and restart the server!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.statusText);
    console.error('- Error Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('\n💡 The Primary Key might be invalid or expired.');
      console.log('You need to:');
      console.log('1. Go to https://momodeveloper.mtn.com/');
      console.log('2. Login to your account');
      console.log('3. Subscribe to Collection API (if not already)');
      console.log('4. Get a new Primary Key');
      console.log('5. Update the MTN_COLLECTION_PRIMARY_KEY in .env');
    }
  }
};

createNewAPIUser();
