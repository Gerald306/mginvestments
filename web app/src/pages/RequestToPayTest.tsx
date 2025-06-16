import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createMTNMoMoClient, getMTNMoMoConfig } from '@/services/mtnMomoClient';
import { paymentService } from '@/services/paymentService';

const RequestToPayTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  // Form state for your exact configuration
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('EUR');
  const [phoneNumber, setPhoneNumber] = useState('256700123456');
  const [reference, setReference] = useState('Invoice123');

  // Create MTN MoMo client
  const momoClient = createMTNMoMoClient(getMTNMoMoConfig());

  // Test your exact request to pay configuration
  const testRequestToPay = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('🚀 Testing Request to Pay - Your Configuration');
      
      const response = await momoClient.requestPayment({
        amount: amount,
        currency: currency,
        phoneNumber: phoneNumber,
        reference: reference,
      });
      
      console.log('✅ Payment requested:', response);
      setResult(response);
      
      // If successful, check status after 3 seconds
      if (response.success && response.referenceId) {
        setTimeout(async () => {
          try {
            const statusResult = await momoClient.getPaymentStatus(response.referenceId!);
            console.log('📊 Payment status:', statusResult);
            setResult(prev => ({ ...prev, statusCheck: statusResult }));
          } catch (statusError) {
            console.error('Status check error:', statusError);
          }
        }, 3000);
      }
      
    } catch (error: any) {
      console.error('❌ Error requesting payment:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Test with MG Investments service
  const testMGInvestmentsService = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('🚀 Testing via MG Investments Payment Service');
      
      const response = await paymentService.requestMTNPayment({
        amount: 25000, // UGX 25,000 for 1 credit
        currency: 'UGX',
        phoneNumber: '256771234567',
        reference: paymentService.generatePaymentReference('TEST'),
        description: 'MG Investments - 1 Teacher Credit (Test)',
        payerMessage: 'Test payment for teacher credit',
        payeeNote: 'Test credit purchase'
      });
      
      console.log('✅ MG Service result:', response);
      setResult(response);
      
    } catch (error: any) {
      console.error('❌ MG Service error:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🧪 MTN MoMo Request to Pay Test
            </CardTitle>
            <p className="text-center text-gray-600">
              Test your exact MTN MoMo library configuration
            </p>
          </CardHeader>
        </Card>

        {/* Your Exact Configuration Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              🎯 Your Exact Configuration Test
            </CardTitle>
            <p className="text-sm text-gray-600">
              This matches your momo-payment-lib example exactly
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

            <Button 
              onClick={testRequestToPay}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Testing...' : '🚀 Test Your Configuration'}
            </Button>
          </CardContent>
        </Card>

        {/* MG Investments Service Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              🏢 MG Investments Service Test
            </CardTitle>
            <p className="text-sm text-gray-600">
              Test the integrated payment service for teacher credits
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">Test Configuration:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Amount: UGX 25,000 (1 Teacher Credit)</li>
                <li>• Currency: UGX (Uganda Shillings)</li>
                <li>• Phone: 256771234567 (MTN Uganda)</li>
                <li>• Reference: Auto-generated</li>
              </ul>
            </div>

            <Button 
              onClick={testMGInvestmentsService}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Testing...' : '🏢 Test MG Investments Service'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                📊 Test Results
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

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              🔧 Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>API User ID:</span>
                <Badge variant={import.meta.env?.VITE_MTN_COLLECTION_API_USER_ID ? "default" : "destructive"}>
                  {import.meta.env?.VITE_MTN_COLLECTION_API_USER_ID ? 'Set' : 'Not Set'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>API Key:</span>
                <Badge variant={import.meta.env?.VITE_MTN_COLLECTION_API_KEY ? "default" : "destructive"}>
                  {import.meta.env?.VITE_MTN_COLLECTION_API_KEY ? 'Set' : 'Not Set'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Primary Key:</span>
                <Badge variant={import.meta.env?.VITE_MTN_COLLECTION_PRIMARY_KEY ? "default" : "destructive"}>
                  {import.meta.env?.VITE_MTN_COLLECTION_PRIMARY_KEY ? 'Set' : 'Not Set'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <Badge>
                  {import.meta.env?.VITE_MTN_ENVIRONMENT || 'sandbox'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestToPayTest;
