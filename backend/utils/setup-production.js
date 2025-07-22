const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 MTN MoMo Production Credentials Setup');
console.log('=========================================');
console.log('');
console.log('⚠️  IMPORTANT: This will configure REAL production credentials');
console.log('   that will send actual SMS and process real money!');
console.log('');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupProductionCredentials() {
  try {
    console.log('📋 You need to obtain production credentials from MTN MoMo Developer Portal');
    console.log('');
    console.log('🔗 Steps to get production credentials:');
    console.log('1. Go to https://momodeveloper.mtn.com/');
    console.log('2. Login to your account');
    console.log('3. Navigate to "Products" → "Collections"');
    console.log('4. Apply for PRODUCTION access (not sandbox)');
    console.log('5. Complete business verification process');
    console.log('6. Once approved, generate production keys');
    console.log('');
    
    const hasCredentials = await askQuestion('Do you have production credentials ready? (yes/no): ');
    
    if (hasCredentials.toLowerCase() !== 'yes' && hasCredentials.toLowerCase() !== 'y') {
      console.log('');
      console.log('📝 To get production credentials:');
      console.log('');
      console.log('1. BUSINESS VERIFICATION:');
      console.log('   • Valid business registration certificate');
      console.log('   • Tax identification number');
      console.log('   • Business bank account details');
      console.log('   • Director/owner identification');
      console.log('');
      console.log('2. TECHNICAL REQUIREMENTS:');
      console.log('   • Completed sandbox integration testing');
      console.log('   • Security compliance documentation');
      console.log('   • API usage documentation');
      console.log('   • Error handling implementation');
      console.log('');
      console.log('3. COMPLIANCE:');
      console.log('   • KYC (Know Your Customer) procedures');
      console.log('   • AML (Anti-Money Laundering) compliance');
      console.log('   • Data protection measures');
      console.log('   • Transaction monitoring systems');
      console.log('');
      console.log('⏳ This process typically takes 2-4 weeks for approval.');
      console.log('');
      console.log('🔄 Once approved, return and run this script again.');
      rl.close();
      return;
    }
    
    console.log('');
    console.log('🔑 Enter your PRODUCTION credentials:');
    console.log('');
    
    // Get production credentials
    const prodPrimaryKey = await askQuestion('Production Primary Key: ');
    const prodSecondaryKey = await askQuestion('Production Secondary Key (optional): ');
    const prodApiUserId = await askQuestion('Production API User ID: ');
    const prodApiKey = await askQuestion('Production API Key: ');
    
    // Validate inputs
    if (!prodPrimaryKey || !prodApiUserId || !prodApiKey) {
      console.log('❌ Missing required credentials. Please provide Primary Key, API User ID, and API Key.');
      rl.close();
      return;
    }
    
    console.log('');
    console.log('🌍 Select your country/region:');
    console.log('1. Uganda (UGX)');
    console.log('2. Ghana (GHS)');
    console.log('3. Ivory Coast (XOF)');
    console.log('4. Zambia (ZMW)');
    console.log('5. Cameroon (XAF)');
    console.log('6. Benin (XOF)');
    console.log('7. Congo Brazzaville (XAF)');
    
    const countryChoice = await askQuestion('Enter choice (1-7): ');
    
    let baseUrl, environment, supportedCurrency;
    
    switch (countryChoice) {
      case '1':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Uganda production
        environment = 'mtnuganda';
        supportedCurrency = 'UGX';
        break;
      case '2':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Ghana production
        environment = 'mtnghana';
        supportedCurrency = 'GHS';
        break;
      case '3':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Ivory Coast production
        environment = 'mtnivorycoast';
        supportedCurrency = 'XOF';
        break;
      case '4':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Zambia production
        environment = 'mtnzambia';
        supportedCurrency = 'ZMW';
        break;
      case '5':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Cameroon production
        environment = 'mtncameroon';
        supportedCurrency = 'XAF';
        break;
      case '6':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Benin production
        environment = 'mtnbenin';
        supportedCurrency = 'XOF';
        break;
      case '7':
        baseUrl = 'https://proxy.momoapi.mtn.com'; // Congo production
        environment = 'mtncongodb';
        supportedCurrency = 'XAF';
        break;
      default:
        console.log('❌ Invalid choice. Defaulting to Uganda.');
        baseUrl = 'https://proxy.momoapi.mtn.com';
        environment = 'mtnuganda';
        supportedCurrency = 'UGX';
    }
    
    console.log('');
    console.log('📋 Production Configuration Summary:');
    console.log('===================================');
    console.log(`Environment: ${environment}`);
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Currency: ${supportedCurrency}`);
    console.log(`Primary Key: ${prodPrimaryKey.substring(0, 8)}...`);
    console.log(`API User ID: ${prodApiUserId}`);
    console.log(`API Key: ${prodApiKey.substring(0, 8)}...`);
    console.log('');
    
    const confirm = await askQuestion('🚨 Apply these PRODUCTION credentials? This will enable real SMS and money transfer! (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Production setup cancelled.');
      rl.close();
      return;
    }
    
    // Create production .env content
    const productionEnvContent = `# Backend Environment Variables for MTN MoMo
# PRODUCTION CREDENTIALS - REAL SMS AND MONEY TRANSFER ENABLED

# MTN MoMo API Configuration - PRODUCTION
MTN_COLLECTION_PRIMARY_KEY=${prodPrimaryKey}
MTN_COLLECTION_SECONDARY_KEY=${prodSecondaryKey || ''}
MTN_COLLECTION_API_USER_ID=${prodApiUserId}
MTN_COLLECTION_API_KEY=${prodApiKey}

# MTN Environment - PRODUCTION
MTN_ENVIRONMENT=${environment}

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3003

# API Base URL - PRODUCTION
MTN_API_BASE_URL=${baseUrl}

# Supported Currency
SUPPORTED_CURRENCY=${supportedCurrency}

# Production Settings
PRODUCTION_MODE=true
ENABLE_REAL_SMS=true
ENABLE_REAL_PAYMENTS=true

# Security Settings
RATE_LIMIT_ENABLED=true
MAX_REQUESTS_PER_MINUTE=60
ENABLE_REQUEST_LOGGING=true

# Backup sandbox credentials (commented out)
# SANDBOX_PRIMARY_KEY=237cd3a4e9af425290384fccfdf15d74
# SANDBOX_API_USER_ID=c72025f5-5cd1-4630-99e4-8ba4722fad56
# SANDBOX_API_KEY=fb37b85ce937481aa7dabf57ca7699a5
`;
    
    // Write to .env file
    const fs = require('fs');
    const path = require('path');
    
    // Backup current .env
    const envPath = path.join(__dirname, '.env');
    const backupPath = path.join(__dirname, '.env.sandbox.backup');
    
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, backupPath);
      console.log('✅ Current .env backed up to .env.sandbox.backup');
    }
    
    // Write production .env
    fs.writeFileSync(envPath, productionEnvContent);
    console.log('✅ Production .env file created successfully!');
    
    console.log('');
    console.log('🎉 PRODUCTION CREDENTIALS APPLIED!');
    console.log('==================================');
    console.log('');
    console.log('✅ What happens now:');
    console.log('  • Real SMS will be sent to phones');
    console.log('  • Users must enter MoMo PIN to approve');
    console.log('  • Actual money will be transferred');
    console.log('  • Real transaction fees apply');
    console.log('');
    console.log('⚠️  IMPORTANT REMINDERS:');
    console.log('  • Test with small amounts first');
    console.log('  • Monitor transaction logs carefully');
    console.log('  • Implement proper error handling');
    console.log('  • Set up transaction limits');
    console.log('');
    console.log('🔄 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test with a small amount first');
    console.log('3. Monitor the transaction carefully');
    console.log('');
    console.log('💡 To revert to sandbox: restore .env.sandbox.backup');
    
    rl.close();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n');
  console.log('🛑 Setup interrupted by user');
  rl.close();
  process.exit(0);
});

setupProductionCredentials();
