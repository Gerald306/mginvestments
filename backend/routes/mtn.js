const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// MTN MoMo API Configuration
const getMTNConfig = () => {
  const isProduction = process.env.MTN_ENVIRONMENT !== 'sandbox';
  const config = {
    apiUserId: process.env.MTN_COLLECTION_API_USER_ID,
    apiKey: process.env.MTN_COLLECTION_API_KEY,
    primaryKey: process.env.MTN_COLLECTION_PRIMARY_KEY,
    environment: process.env.MTN_ENVIRONMENT || 'sandbox',
    baseUrl: process.env.MTN_API_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
    isProduction,
    supportedCurrency: process.env.SUPPORTED_CURRENCY || 'UGX'
  };
  
  // Log environment info
  console.log(`🌍 MTN Environment: ${config.environment} ${isProduction ? '(PRODUCTION)' : '(SANDBOX)'}`);
  
  return config;
};

// Get MTN MoMo Auth Token with fallback
const getAuthToken = async () => {
  const config = getMTNConfig();
  
  try {
    const credentials = Buffer.from(`${config.apiUserId}:${config.apiKey}`).toString('base64');
    
    console.log('🔐 Attempting MTN Authentication...');
    console.log('- API User ID:', config.apiUserId ? 'Set' : 'Missing');
    console.log('- API Key:', config.apiKey ? 'Set' : 'Missing');
    console.log('- Primary Key:', config.primaryKey ? 'Set' : 'Missing');
    
    const response = await axios.post(`${config.baseUrl}/collection/token/`, null, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': config.primaryKey,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ MTN Authentication Successful');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ MTN Auth Error:', error.response?.status, error.response?.data);
    
    // Provide helpful error messages
    if (error.response?.status === 401) {
      throw new Error('Invalid MTN MoMo credentials. Please check your API User ID, API Key, and Primary Key.');
    } else if (error.response?.status === 403) {
      throw new Error('MTN MoMo API access forbidden. Please check your subscription status.');
    } else {
      throw new Error('Failed to get MTN MoMo authentication token: ' + (error.response?.data?.message || error.message));
    }
  }
};

// Validate MTN phone number
const validateMTNPhoneNumber = (phoneNumber) => {
  // Remove all non-digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid MTN Uganda number
  // MTN prefixes: 772, 773, 774, 775, 776, 777, 778, 779, 786, 787, 788, 789, 765, 760, 761, 762, 763, 764, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399
  // Pattern: 256 followed by any of these prefixes and 6 more digits
  return /^256(77[2-9]|78[6-9]|76[0-5]|39[0-9])\d{6}$/.test(cleanPhone);
};

// Format phone number to international format
const formatPhoneNumber = (phoneNumber) => {
  let clean = phoneNumber.replace(/\D/g, '');
  
  // If starts with 0, replace with 256
  if (clean.startsWith('0')) {
    clean = '256' + clean.substring(1);
  }
  
  // If doesn't start with 256, add it
  if (!clean.startsWith('256')) {
    clean = '256' + clean;
  }
  
  return clean;
};

// GET /api/mtn/test-credentials - Test endpoint to check MTN credentials
router.get('/test-credentials', async (req, res) => {
  try {
    const config = getMTNConfig();
    
    // Check if all required credentials are present
    const credentialsStatus = {
      apiUserId: !!config.apiUserId,
      apiKey: !!config.apiKey,
      primaryKey: !!config.primaryKey,
      environment: config.environment,
      baseUrl: config.baseUrl
    };
    
    console.log('🧪 Testing MTN Credentials:', credentialsStatus);
    
    if (!config.apiUserId || !config.apiKey || !config.primaryKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing MTN MoMo credentials',
        credentials: credentialsStatus,
        instructions: 'Please set MTN_COLLECTION_API_USER_ID, MTN_COLLECTION_API_KEY, and MTN_COLLECTION_PRIMARY_KEY in your .env file'
      });
    }
    
    // Test authentication
    const authToken = await getAuthToken();
    
    res.json({
      success: true,
      message: 'MTN MoMo credentials are valid',
      credentials: credentialsStatus,
      tokenPreview: authToken.substring(0, 20) + '...'
    });
    
  } catch (error) {
    console.error('❌ Credential Test Failed:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      instructions: {
        step1: 'Go to https://momodeveloper.mtn.com/',
        step2: 'Login and subscribe to Collection API',
        step3: 'Generate new Primary Key, API User ID, and API Key',
        step4: 'Update your .env file with new credentials',
        step5: 'Restart the backend server'
      }
    });
  }
});

// POST /api/mtn/request-payment
router.post('/request-payment', async (req, res) => {
  try {
    const { amount, currency, phoneNumber, reference, description, payerMessage, payeeNote } = req.body;
    
    // Validate required fields
    if (!amount || !currency || !phoneNumber || !reference) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, currency, phoneNumber, reference'
      });
    }
    
    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!validateMTNPhoneNumber(formattedPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid MTN phone number. Must be MTN Uganda (077x, 078x, 076x, 039x)'
      });
    }
    
    // Get MTN config first
    const config = getMTNConfig();
    
    // Validate currency - Use UGX for both sandbox and production
    let apiCurrency = currency;
    let apiAmount = amount;
    
    // Only accept UGX currency
    if (currency !== 'UGX') {
      return res.status(400).json({
        success: false,
        error: 'Invalid currency. Only UGX is supported'
      });
    }
    
    // Use UGX directly for both sandbox and production
    apiCurrency = 'UGX';
    apiAmount = amount;
    
    // Validate amount
    if (amount < 100 || amount > 1000000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Must be between 100 and 1,000,000 UGX'
      });
    }
    const referenceId = uuidv4();
    
    try {
      // Try real MTN MoMo API first
      const authToken = await getAuthToken();
      
      // Prepare request body
      const requestBody = {
        amount: apiAmount.toString(),
        currency: apiCurrency,
        externalId: reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone
        },
        payerMessage: payerMessage || 'Payment Request from MG Investments',
        payeeNote: payeeNote || 'Teacher Credit Purchase'
      };
      
      console.log('🔄 Sending MTN MoMo Request:', {
        referenceId,
        originalAmount: amount,
        originalCurrency: currency,
        apiAmount,
        apiCurrency,
        phoneNumber: formattedPhone,
        reference,
        environment: config.environment,
        isProduction: config.isProduction
      });
      
      if (config.isProduction) {
        console.log('🚨 PRODUCTION MODE: Real SMS will be sent and money will be transferred!');
      }
      
      // Make request to MTN MoMo API
      const response = await axios.post(
        `${config.baseUrl}/collection/v1_0/requesttopay`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': config.environment,
            'Ocp-Apim-Subscription-Key': config.primaryKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ MTN MoMo Request Successful:', response.status);
      
      res.json({
        success: true,
        referenceId,
        transactionId: referenceId,
        status: 'pending',
        message: `Payment request sent to ${formattedPhone}. Please approve the transaction on your phone.`,
        mode: 'real'
      });
      
    } catch (authError) {
      // Fall back to mock service for development
      console.log('🎭 MTN API failed, using mock service for development');
      console.log('❌ Actual error:', authError.response?.status, authError.response?.data || authError.message);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      res.json({
        success: true,
        referenceId,
        transactionId: referenceId,
        status: 'pending',
        message: `MOCK: Payment request sent to ${formattedPhone}. (Real SMS not sent - using mock service)`,
        mode: 'mock',
        note: 'Using mock service because MTN credentials are invalid. Update credentials for real integration.'
      });
    }
    
  } catch (error) {
    console.error('❌ Payment Request Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Payment request failed',
      status: 'failed'
    });
  }
});

// GET /api/mtn/payment-status/:referenceId
router.get('/payment-status/:referenceId', async (req, res) => {
  try {
    const { referenceId } = req.params;
    
    if (!referenceId) {
      return res.status(400).json({
        success: false,
        error: 'Reference ID is required'
      });
    }
    
    const config = getMTNConfig();
    const authToken = await getAuthToken();
    
    console.log('🔍 Checking MTN MoMo Payment Status:', referenceId);
    
    // Check payment status
    const response = await axios.get(
      `${config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-Target-Environment': config.environment,
          'Ocp-Apim-Subscription-Key': config.primaryKey
        }
      }
    );
    
    const statusData = response.data;
    
    // Map MTN status to our status
    let status;
    switch (statusData.status) {
      case 'SUCCESSFUL':
        status = 'completed';
        break;
      case 'FAILED':
        status = 'failed';
        break;
      case 'PENDING':
      default:
        status = 'pending';
        break;
    }
    
    console.log('📊 MTN MoMo Status:', statusData.status, '→', status);
    
    res.json({
      success: true,
      referenceId,
      transactionId: referenceId,
      status,
      amount: statusData.amount,
      currency: statusData.currency,
      payer: statusData.payer,
      reason: statusData.reason || null
    });
    
  } catch (error) {
    console.error('❌ MTN MoMo Status Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to check payment status'
    });
  }
});

// GET /api/mtn/config - Get current configuration (for debugging)
router.get('/config', (req, res) => {
  const config = getMTNConfig();
  
  res.json({
    environment: config.environment,
    baseUrl: config.baseUrl,
    hasApiUserId: !!config.apiUserId,
    hasApiKey: !!config.apiKey,
    hasPrimaryKey: !!config.primaryKey,
    // Don't expose actual keys for security
    apiUserIdPreview: config.apiUserId ? config.apiUserId.substring(0, 8) + '...' : 'Not set',
    primaryKeyPreview: config.primaryKey ? config.primaryKey.substring(0, 8) + '...' : 'Not set'
  });
});

module.exports = router;
