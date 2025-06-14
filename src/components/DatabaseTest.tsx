import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { firebase } from '@/integrations/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { createDefaultAdmin } from '@/utils/createAdminUser';
import { seedDatabase } from '@/utils/seedData';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  User, 
  Shield,
  AlertTriangle,
  Loader2
} from "lucide-react";

const DatabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const testDatabaseConnection = async () => {
    setLoading(true);
    const results: any[] = [];

    try {
      // Test 1: Basic Firebase connection
      results.push({
        test: 'Firebase Connection',
        status: 'testing',
        message: 'Testing Firebase connection...'
      });

      // Test 2: Authentication service
      try {
        const { data: sessionData } = await firebase.auth.getSession();
        results.push({
          test: 'Authentication Service',
          status: 'success',
          message: 'Authentication service is working',
          data: sessionData
        });
      } catch (error) {
        results.push({
          test: 'Authentication Service',
          status: 'error',
          message: `Auth error: ${error}`,
          error
        });
      }

      // Test 3: Database read operation
      try {
        const { data: profiles, error } = await firebase.from('profiles').select('*').limit(1);
        if (error) throw error;

        results.push({
          test: 'Database Read',
          status: 'success',
          message: 'Database read operation successful',
          data: profiles
        });
      } catch (error) {
        results.push({
          test: 'Database Read',
          status: 'error',
          message: `Database read error: ${error}`,
          error
        });
      }

      // Test 4: Check for admin users
      try {
        const result = await firebase
          .from('profiles')
          .select('*')
          .eq('role', 'admin');

        if (result.error) throw result.error;

        const hasAdmin = result.data && result.data.length > 0;
        setAdminExists(hasAdmin);

        results.push({
          test: 'Admin User Check',
          status: hasAdmin ? 'success' : 'warning',
          message: hasAdmin
            ? `Found ${result.data.length} admin user(s)`
            : 'No admin users found',
          data: result.data
        });
      } catch (error) {
        results.push({
          test: 'Admin User Check',
          status: 'error',
          message: `Admin check error: ${error}`,
          error
        });
      }

      // Test 5: Check for sample data
      try {
        const result = await firebase
          .from('teachers')
          .select('*')
          .limit(1);

        if (result.error) throw result.error;

        const hasTeachers = result.data && result.data.length > 0;
        setHasData(hasTeachers);

        results.push({
          test: 'Sample Data Check',
          status: hasTeachers ? 'success' : 'warning',
          message: hasTeachers
            ? 'Sample data found in database'
            : 'No sample data found',
          data: result.data
        });
      } catch (error) {
        results.push({
          test: 'Sample Data Check',
          status: 'error',
          message: `Data check error: ${error}`,
          error
        });
      }

      // Check if we have any errors
      const hasErrors = results.some(result => result.status === 'error');
      setConnectionStatus(hasErrors ? 'failed' : 'connected');
      
    } catch (error) {
      setConnectionStatus('failed');
      results.push({
        test: 'Overall Connection',
        status: 'error',
        message: `Connection failed: ${error}`,
        error
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  const seedDatabaseHandler = async () => {
    setLoading(true);
    try {
      const result = await seedDatabase();

      if (result.success) {
        toast({
          title: "Database Seeded",
          description: `Sample data added successfully! ${result.data?.teachers} teachers, ${result.data?.schools} schools, ${result.data?.applications} applications`,
        });

        // Refresh the test
        await testDatabaseConnection();
      } else {
        throw new Error(result.error || result.message);
      }

    } catch (error: any) {
      toast({
        title: "Error Seeding Database",
        description: error.message || "Failed to seed database",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const createAdminUserHandler = async () => {
    setLoading(true);
    try {
      const result = await createDefaultAdmin();

      if (result.success) {
        toast({
          title: "Admin User Created",
          description: "Admin user created successfully! Email: admin@mginvestments.ug, Password: Admin123!@#",
        });

        // Refresh the test
        await testDatabaseConnection();
      } else {
        throw new Error(result.error);
      }

    } catch (error: any) {
      toast({
        title: "Error Creating Admin",
        description: error.message || "Failed to create admin user",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span>Database Connectivity Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {connectionStatus === 'testing' && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
              {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {connectionStatus === 'failed' && <XCircle className="h-5 w-5 text-red-600" />}
              <span className="font-medium">
                {connectionStatus === 'testing' && 'Testing Connection...'}
                {connectionStatus === 'connected' && 'Database Connected'}
                {connectionStatus === 'failed' && 'Connection Failed'}
              </span>
            </div>
            <Button onClick={testDatabaseConnection} disabled={loading} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Retest
            </Button>
          </div>

          {/* Test Results */}
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {result.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Admin User Section */}
          {adminExists === false && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">No Admin User Found</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                You need an admin user to access the admin dashboard. Click below to create one.
              </p>
              <Button
                onClick={createAdminUserHandler}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
                Create Admin User
              </Button>
            </div>
          )}

          {adminExists === true && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Admin User Available</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Admin users found. You can access the admin dashboard.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => window.open('/auth', '_blank')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Login as Admin
                </Button>
                <Button
                  onClick={() => window.open('/admin', '_blank')}
                  size="sm"
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Go to Admin Dashboard
                </Button>
              </div>
              <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-800">
                <strong>Default Admin Credentials:</strong><br />
                Email: admin@mginvestments.ug<br />
                Password: Admin123!@#
              </div>
            </div>
          )}

          {/* Firebase Permission Error Help */}
          {connectionStatus === 'failed' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Firebase Permission Issues Detected</span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Your Firebase database has permission restrictions. Here's how to fix it:
              </p>
              <div className="space-y-2 text-sm text-red-700 mb-4">
                <div className="font-medium">Quick Fix (Development):</div>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                  <li>Select your project</li>
                  <li>Go to Firestore Database → Rules</li>
                  <li>Replace the rules with:</li>
                </ol>
                <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono mt-2">
                  {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </div>
                <div className="text-xs text-red-600 mt-2">
                  ⚠️ This allows public access. Use only for development!
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Open Firebase Console
                </Button>
                <Button
                  onClick={testDatabaseConnection}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Test Again
                </Button>
              </div>
            </div>
          )}

          {/* Sample Data Section */}
          {hasData === false && connectionStatus === 'connected' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">No Sample Data Found</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Your database is empty. Add sample data to see teachers, schools, and applications in your app.
              </p>
              <Button
                onClick={seedDatabaseHandler}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                Add Sample Data
              </Button>
            </div>
          )}

          {hasData === true && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Sample Data Available</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your database contains sample data. You can now view teachers, schools, and applications in your app.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => window.open('/', '_blank')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  View Homepage
                </Button>
                <Button
                  onClick={() => window.open('/teacher-portal', '_blank')}
                  size="sm"
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Teacher Portal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTest;
