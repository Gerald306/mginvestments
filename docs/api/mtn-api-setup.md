# MTN MoMo API Setup Guide

## Your Keys
- **Primary Key**: `17db856da0f7487db30f1cbafd22f067`
- **Secondary Key**: `cd8ad175c35f4c1a9b44917da7df1eda`

## Step 1: Create API User

### Option A: Using cURL (Command Line)

```bash
# Generate a UUID for reference (you can use any UUID generator)
# Example UUID: 12345678-1234-1234-1234-123456789abc

curl -X POST \
  https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H 'Content-Type: application/json' \
  -H 'Ocp-Apim-Subscription-Key: 17db856da0f7487db30f1cbafd22f067' \
  -H 'X-Reference-Id: 12345678-1234-1234-1234-123456789abc' \
  -d '{
    "providerCallbackHost": "localhost"
  }'
```

**Expected Response**: HTTP 201 Created
**Your API User ID**: Use the UUID you provided in X-Reference-Id header

### Option B: Using MTN Developer Portal
1. Go to https://sandbox.momodeveloper.mtn.com/
2. Navigate to your Collection API subscription
3. Use the "Try it" feature for POST /v1_0/apiuser
4. Use your primary key: `17db856da0f7487db30f1cbafd22f067`

## Step 2: Create API Key

```bash
# Replace {apiUserId} with the UUID from Step 1
curl -X POST \
  https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/{apiUserId}/apikey \
  -H 'Ocp-Apim-Subscription-Key: 17db856da0f7487db30f1cbafd22f067'
```

**Example**:
```bash
curl -X POST \
  https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/12345678-1234-1234-1234-123456789abc/apikey \
  -H 'Ocp-Apim-Subscription-Key: 17db856da0f7487db30f1cbafd22f067'
```

**Expected Response**: 
```json
{
  "apiKey": "your-generated-api-key-here"
}
```

## Step 3: Update .env File

Add these to your `web app/.env` file:

```env
VITE_MTN_COLLECTION_API_USER_ID=12345678-1234-1234-1234-123456789abc
VITE_MTN_COLLECTION_API_KEY=your-generated-api-key-here
VITE_MTN_COLLECTION_PRIMARY_KEY=17db856da0f7487db30f1cbafd22f067
VITE_MTN_ENVIRONMENT=sandbox
```

## Step 4: Test Your Configuration

Visit: http://localhost:3003/request-to-pay-test

Your exact request to pay configuration will now work:

```javascript
const response = await momoClient.requestPayment({
  amount: 100,
  currency: 'EUR',
  phoneNumber: '256700123456',
  reference: 'Invoice123',
});
```

## Quick Test Commands

### Test API User Creation (PowerShell)
```powershell
$headers = @{
    'Content-Type' = 'application/json'
    'Ocp-Apim-Subscription-Key' = '17db856da0f7487db30f1cbafd22f067'
    'X-Reference-Id' = [System.Guid]::NewGuid().ToString()
}

$body = @{
    providerCallbackHost = 'localhost'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser' -Method POST -Headers $headers -Body $body
```

### Test API Key Creation (PowerShell)
```powershell
# Replace with your actual API User ID
$apiUserId = "your-api-user-id-here"

$headers = @{
    'Ocp-Apim-Subscription-Key' = '17db856da0f7487db30f1cbafd22f067'
}

Invoke-RestMethod -Uri "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$apiUserId/apikey" -Method POST -Headers $headers
```

## Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Check your primary key
2. **400 Bad Request**: Ensure UUID format is correct
3. **404 Not Found**: Verify the API User ID exists

### Test Phone Numbers (Sandbox):
- MTN Uganda: `256771234567`, `256781234567`
- Airtel Uganda: `256701234567`, `256751234567`

### Test Amounts (Sandbox):
- Small amounts: 100, 500, 1000
- Larger amounts: 10000, 25000, 50000

## Success Indicators:
✅ API User created successfully (HTTP 201)
✅ API Key generated successfully (returns JSON with apiKey)
✅ Environment variables set correctly
✅ Test page shows "Set" for all credentials
✅ Request to pay test works without errors

## Next Steps:
1. Complete the API setup above
2. Test at: http://localhost:3003/request-to-pay-test
3. Integrate into your MG Investments subscription flow
4. Test with real MTN MoMo numbers in sandbox
5. Move to production when ready
