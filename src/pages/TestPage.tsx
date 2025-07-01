import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🎉 Test Page - MG Investments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Application is working correctly!
              </h2>
              <p className="text-gray-600 mb-6">
                This test page confirms that the React app is running and routing is functional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold text-green-600 mb-2">✅ Working Components:</h3>
                <ul className="text-sm space-y-1">
                  <li>• React Router</li>
                  <li>• UI Components (Cards, Buttons)</li>
                  <li>• Tailwind CSS Styling</li>
                  <li>• TypeScript Compilation</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-blue-600 mb-2">🔧 Next Steps:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Test Firebase Connection</li>
                  <li>• Test Payment Integration</li>
                  <li>• Test Credit Purchase Modal</li>
                  <li>• Test Subscription Page</li>
                </ul>
              </Card>
            </div>

            <div className="flex justify-center space-x-4">
              <Link to="/">
                <Button variant="outline">
                  Go to Home
                </Button>
              </Link>
              <Link to="/subscription">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Test Subscription Page
                </Button>
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🚀 Payment Integration Status:</h4>
              <p className="text-blue-800 text-sm">
                MTN MoMo payment integration has been successfully implemented with:
              </p>
              <ul className="text-blue-800 text-sm mt-2 space-y-1">
                <li>• Request to Pay functionality</li>
                <li>• Phone number validation</li>
                <li>• Credit purchase modal</li>
                <li>• Payment status tracking</li>
                <li>• Error handling and user feedback</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
