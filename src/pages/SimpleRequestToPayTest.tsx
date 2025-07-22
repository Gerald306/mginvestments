import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const SimpleRequestToPayTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  // Form state for your exact configuration
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('EUR');
  const [phoneNumber, setPhoneNumber] = useState('256700123456');
  const [reference, setReference] = useState('Invoice123');

  // Simulate your exact request to pay configuration
  const simulateRequestToPay = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('🚀 Simulating Request to Pay - Your Configuration');
      
      // Simulate the exact request format
      const requestData = {
        amount: amount,
        currency: currency,
        phoneNumber: phoneNumber,
        reference: reference,
      };
      
      console.log('📱 Request Data:', requestData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      const response = {
        success: true,
        referenceId: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        transactionId: `TXN_${Date.now()}`,
        status: 'pending',
        message: 'Payment request sent to your phone. Please approve the transaction.',
        requestData: requestData
      };
      
      console.log('✅ Simulated Response:', response);
      setResult(response);
      
      // Simulate status check after 3 seconds
      setTimeout(() => {
        const statusUpdate = {
          ...response,
          status: 'completed',
          message: 'Payment completed successfully',
          statusCheck: {
            amount: requestData.amount.toString(),
            currency: requestData.currency,
            status: 'SUCCESSFUL',
            payer: {
              partyIdType: 'MSISDN',
              partyId: requestData.phoneNumber
            }
          }
        };
        console.log('📊 Status Update:', statusUpdate);
        setResult(statusUpdate);
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Error in simulation:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test phone number validation
  const testPhoneValidation = () => {
    const testNumbers = [
      { number: '256700123456', provider: 'Airtel', expected: true },
      { number: '256771234567', provider: 'MTN', expected: true },
      { number: '256781234567', provider: 'MTN', expected: true },
      { number: '0771234567', provider: 'MTN Local', expected: true },
      { number: '1234567890', provider: 'Invalid', expected: false },
    ];

    console.log('🧪 Testing Phone Number Validation:');
    testNumbers.forEach(({ number, provider, expected }) => {
      const isValid = /^256(77|78|76|39|70|75|74|20)\d{7}$/.test(number.replace(/^0/, '256'));
      const status = isValid === expected ? '✅' : '❌';
      console.log(`${status} ${provider}: ${number} -> ${isValid ? 'VALID' : 'INVALID'}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🧪 Simple Request to Pay Test
            </CardTitle>
            <p className="text-center text-gray-600">
              Test your MTN MoMo configuration without API credentials
            </p>
          </CardHeader>
        </Card>

        {/* Configuration Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              🎯 Your Request to Pay Configuration
            </CardTitle>
            <p className="text-sm text-gray-600">
              This simulates your exact momo-payment-lib example
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="EUR">EUR</option>
                  <option value="UGX">UGX</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="256700123456"
                />
              </div>
              <div>
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Invoice123"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Your Configuration:</h4>
              <pre className="text-sm text-blue-800">
{`const response = await momoClient.requestPayment({
  amount: ${amount},
  currency: '${currency}',
  phoneNumber: '${phoneNumber}',
  reference: '${reference}',
});`}
              </pre>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={simulateRequestToPay}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Testing...' : '🚀 Simulate Request to Pay'}
              </Button>
              
              <Button 
                onClick={testPhoneValidation}
                variant="outline"
                className="flex-1"
              >
                🧪 Test Phone Validation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                📊 Simulation Results
                <Badge className="ml-2" variant={result.success ? "default" : "destructive"}>
                  {result.success ? 'Success' : 'Failed'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600">
                ❌ Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              📋 Next Steps for Real Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">To use real MTN MoMo API:</h4>
              <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                <li>Register at <a href="https://momodeveloper.mtn.com/" target="_blank" rel="noopener noreferrer" className="underline">MTN Developer Portal</a></li>
                <li>Subscribe to Collection API</li>
                <li>Get your API credentials</li>
                <li>Create <code>.env</code> file with your credentials</li>
                <li>Test with real API at <code>/request-to-pay-test</code></li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Environment Variables Needed:</h4>
              <pre className="text-sm text-blue-800">
{`VITE_MTN_COLLECTION_API_USER_ID=your-api-user-id
VITE_MTN_COLLECTION_API_KEY=your-api-key
VITE_MTN_COLLECTION_PRIMARY_KEY=your-primary-key
VITE_MTN_ENVIRONMENT=sandbox`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleRequestToPayTest;
