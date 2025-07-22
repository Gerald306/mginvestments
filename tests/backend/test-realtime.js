const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📱 Real-Time MTN MoMo Payment Test');
console.log('==================================');
console.log('This will send a REAL payment request to a phone number!');
console.log('Make sure you have access to the phone to approve the transaction.');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function realTimeTest() {
  try {
    // Get phone number
    console.log('📞 Enter the MTN Uganda phone number to test with:');
    console.log('   Valid prefixes: 77, 78, 76, 39');
    console.log('   Format: 0771234567 or 256771234567');
    const phoneNumber = await askQuestion('Phone Number: ');
    
    if (!phoneNumber.trim()) {
      console.log('❌ Phone number is required!');
      rl.close();
      return;
    }
    
    // Get amount
    console.log('');
    console.log('💰 Enter the amount in UGX (100 - 1,000,000):');
    const amountStr = await askQuestion('Amount (UGX): ');
    const amount = parseInt(amountStr);
    
    if (!amount || amount < 100 || amount > 1000000) {
      console.log('❌ Invalid amount! Must be between 100 and 1,000,000 UGX');
      rl.close();
      return;
    }
    
    // Get description
    console.log('');
    const description = await askQuestion('Payment Description (optional): ') || 'Real-time MTN MoMo Test';
    
    // Confirm before sending
    console.log('');
    console.log('📋 Payment Details:');
    console.log('===================');
    console.log(`📞 Phone: ${phoneNumber}`);
    console.log(`💰 Amount: ${amount} UGX (converted to ~${Math.round(amount/4000)} EUR for sandbox)`);
    console.log(`📝 Description: ${description}`);
    console.log('');
    
    const confirm = await askQuestion('🚨 Send REAL payment request? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Payment cancelled.');
      rl.close();
      return;
    }
    
    console.log('');
    console.log('🚀 Sending payment request...');
    console.log('⏳ Please wait...');
    
    // Send payment request
    const paymentData = {
      amount: amount,
      currency: 'UGX',
      phoneNumber: phoneNumber.trim(),
      reference: 'REALTIME_' + Date.now(),
      description: description,
      payerMessage: 'Real-time payment test from MG Investments',
      payeeNote: 'MTN MoMo Integration Test'
    };
    
    const startTime = Date.now();
    const response = await axios.post('http://localhost:3001/api/mtn/request-payment', paymentData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    const requestTime = Date.now() - startTime;
    
    console.log('');
    console.log('✅ Payment Request Sent!');
    console.log('========================');
    console.log(`⏱️  Request Time: ${requestTime}ms`);
    console.log(`🆔 Reference ID: ${response.data.referenceId}`);
    console.log(`📱 Status: ${response.data.status}`);
    console.log(`🔄 Mode: ${response.data.mode}`);
    console.log(`💬 Message: ${response.data.message}`);
    
    if (response.data.mode === 'real') {
      console.log('');
      console.log('📱 CHECK YOUR PHONE NOW!');
      console.log('========================');
      console.log('You should receive an SMS prompt to approve the payment.');
      console.log('Please approve or decline the payment on your phone.');
      console.log('');
      
      // Monitor payment status
      const referenceId = response.data.referenceId;
      let attempts = 0;
      const maxAttempts = 20; // Check for 2 minutes (6 seconds * 20)
      
      console.log('⏳ Monitoring payment status...');
      console.log('Press Ctrl+C to stop monitoring');
      console.log('');
      
      const statusInterval = setInterval(async () => {
        try {
          attempts++;
          
          const statusResponse = await axios.get(`http://localhost:3001/api/mtn/payment-status/${referenceId}`, {
            timeout: 10000
          });
          
          const status = statusResponse.data;
          const timestamp = new Date().toLocaleTimeString();
          
          console.log(`[${timestamp}] Status Check ${attempts}/${maxAttempts}: ${status.status.toUpperCase()}`);
          
          if (status.status === 'completed') {
            clearInterval(statusInterval);
            console.log('');
            console.log('🎉 PAYMENT SUCCESSFUL! 🎉');
            console.log('=======================');
            console.log(`💰 Amount: ${status.amount} ${status.currency}`);
            console.log(`📱 Payer: ${status.payer?.partyId}`);
            console.log(`✅ Status: ${status.status}`);
            console.log('');
            console.log('The payment has been completed successfully!');
            rl.close();
            
          } else if (status.status === 'failed') {
            clearInterval(statusInterval);
            console.log('');
            console.log('❌ PAYMENT FAILED');
            console.log('=================');
            console.log(`📱 Status: ${status.status}`);
            console.log(`❗ Reason: ${status.reason || 'User declined or payment failed'}`);
            console.log('');
            rl.close();
            
          } else if (attempts >= maxAttempts) {
            clearInterval(statusInterval);
            console.log('');
            console.log('⏰ TIMEOUT - Payment still pending');
            console.log('==================================');
            console.log('The payment request is still pending after 2 minutes.');
            console.log('This might mean:');
            console.log('1. The user hasn\'t responded to the SMS prompt yet');
            console.log('2. There\'s a network delay');
            console.log('3. The phone number might not be active');
            console.log('');
            console.log(`You can check the status later with: ${referenceId}`);
            rl.close();
          }
          
        } catch (statusError) {
          console.log(`[${new Date().toLocaleTimeString()}] Status check error:`, statusError.message);
        }
      }, 6000); // Check every 6 seconds
      
    } else {
      console.log('');
      console.log('⚠️  Using Mock Service');
      console.log('=====================');
      console.log('The request used the mock service instead of real MTN API.');
      console.log('Check the backend logs for the specific error.');
      rl.close();
    }
    
  } catch (error) {
    console.log('');
    console.error('❌ Test Failed:', error.message);
    if (error.response?.data) {
      console.error('📄 Error Details:', error.response.data);
    }
    rl.close();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n');
  console.log('🛑 Test interrupted by user');
  rl.close();
  process.exit(0);
});

console.log('Starting real-time test...');
console.log('');
realTimeTest();
