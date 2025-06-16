import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle } from 'lucide-react';

const MTNSetupGuide = () => {
  const [apiUserId, setApiUserId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [step, setStep] = useState(1);

  // Your actual keys from MTN
  const primaryKey = '17db856da0f7487db30f1cbafd22f067';
  const secondaryKey = 'cd8ad175c35f4c1a9b44917da7df1eda';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateApiUser = async () => {
    try {
      // This would be the actual API call to create user
      const response = await fetch('https://sandbox.momodeveloper.mtn.com/v1_0/apiuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': primaryKey,
          'X-Reference-Id': crypto.randomUUID(),
        },
        body: JSON.stringify({
          providerCallbackHost: window.location.origin
        })
      });

      if (response.ok) {
        const referenceId = response.headers.get('X-Reference-Id');
        setApiUserId(referenceId || '');
        setStep(2);
      }
    } catch (error) {
      console.error('Error creating API user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🔑 MTN MoMo API Setup Guide
            </CardTitle>
            <p className="text-center text-gray-600">
              Complete setup for your request to pay configuration
            </p>
          </CardHeader>
        </Card>

        {/* Current Keys Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              ✅ Your Current Keys
              <Badge className="ml-2" variant="default">Ready</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-green-900">Primary Key</h4>
                    <code className="text-sm text-green-800">{primaryKey}</code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(primaryKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-blue-900">Secondary Key</h4>
                    <code className="text-sm text-blue-800">{secondaryKey}</code>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(secondaryKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              📋 Complete API Setup - Step {step} of 3
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: Create API User */}
            <div className={`border rounded-lg p-4 ${step >= 1 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Step 1: Create API User</h3>
                {step > 1 && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Create an API User ID using your primary key. This is required for authentication.
              </p>

              <div className="bg-gray-100 p-3 rounded mb-4">
                <h4 className="font-semibold mb-2">Manual Method (Recommended):</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Open <a href="https://sandbox.momodeveloper.mtn.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MTN Developer Portal <ExternalLink className="inline h-3 w-3" /></a></li>
                  <li>Go to your Collection API subscription</li>
                  <li>Use the "API Console" or "Try it" feature</li>
                  <li>Create API User with POST /v1_0/apiuser</li>
                  <li>Copy the generated User ID</li>
                </ol>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <Button onClick={generateApiUser} className="w-full">
                    🚀 Try Auto-Generate API User
                  </Button>
                  <div className="text-center text-sm text-gray-500">or</div>
                  <div>
                    <Label htmlFor="manualUserId">Enter API User ID manually:</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="manualUserId"
                        value={apiUserId}
                        onChange={(e) => setApiUserId(e.target.value)}
                        placeholder="e.g., 12345678-1234-1234-1234-123456789abc"
                      />
                      <Button 
                        onClick={() => apiUserId && setStep(2)}
                        disabled={!apiUserId}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Create API Key */}
            {step >= 2 && (
              <div className={`border rounded-lg p-4 ${step >= 2 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Step 2: Create API Key</h3>
                  {step > 2 && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Generate an API Key for your API User ID: <code className="bg-gray-200 px-1 rounded">{apiUserId}</code>
                </p>

                <div className="bg-gray-100 p-3 rounded mb-4">
                  <h4 className="font-semibold mb-2">Create API Key:</h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Use POST /v1_0/apiuser/{apiUserId}/apikey</li>
                    <li>Use your API User ID: <code className="bg-white px-1 rounded">{apiUserId}</code></li>
                    <li>Copy the generated API Key</li>
                  </ol>
                </div>

                {step === 2 && (
                  <div>
                    <Label htmlFor="apiKey">Enter Generated API Key:</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="e.g., abcdef123456789..."
                      />
                      <Button 
                        onClick={() => apiKey && setStep(3)}
                        disabled={!apiKey}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Update Environment */}
            {step >= 3 && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Step 3: Update Environment File</h3>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Add your API credentials to the environment file:
                </p>

                <div className="bg-white border rounded p-4">
                  <h4 className="font-semibold mb-2">Add to .env file:</h4>
                  <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`VITE_MTN_COLLECTION_API_USER_ID=${apiUserId}
VITE_MTN_COLLECTION_API_KEY=${apiKey}
VITE_MTN_COLLECTION_PRIMARY_KEY=${primaryKey}
VITE_MTN_ENVIRONMENT=sandbox`}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => copyToClipboard(`VITE_MTN_COLLECTION_API_USER_ID=${apiUserId}\nVITE_MTN_COLLECTION_API_KEY=${apiKey}\nVITE_MTN_COLLECTION_PRIMARY_KEY=${primaryKey}\nVITE_MTN_ENVIRONMENT=sandbox`)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Configuration
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-blue-100 border border-blue-200 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">🎉 Ready to Test!</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Your MTN MoMo API is now configured. Test your exact request to pay configuration:
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => window.open('/working-request-to-pay', '_blank')}
                    >
                      🚀 Test Your Configuration
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open('/request-to-pay-test', '_blank')}
                    >
                      🔧 Real API Test
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              🔗 Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4"
                onClick={() => window.open('https://sandbox.momodeveloper.mtn.com/', '_blank')}
              >
                <div className="text-center">
                  <ExternalLink className="h-5 w-5 mx-auto mb-2" />
                  <div className="font-semibold">MTN Developer Portal</div>
                  <div className="text-xs text-gray-500">Create API credentials</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4"
                onClick={() => window.open('https://momodeveloper.mtn.com/docs/services/collection/operations/requesttopay-POST', '_blank')}
              >
                <div className="text-center">
                  <ExternalLink className="h-5 w-5 mx-auto mb-2" />
                  <div className="font-semibold">API Documentation</div>
                  <div className="text-xs text-gray-500">Request to Pay docs</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MTNSetupGuide;
