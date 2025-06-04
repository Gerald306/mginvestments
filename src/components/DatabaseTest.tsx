import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createDefaultAdmin } from '@/utils/createAdminUser';
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
        const { data: sessionData } = await supabase.auth.getSession();
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
        const { data: profiles, error } = await supabase.from('profiles').select('*').limit(1);
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
        const { data: adminUsers, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin');
        
        if (error) throw error;
        
        const hasAdmin = adminUsers && adminUsers.length > 0;
        setAdminExists(hasAdmin);
        
        results.push({
          test: 'Admin User Check',
          status: hasAdmin ? 'success' : 'warning',
          message: hasAdmin 
            ? `Found ${adminUsers.length} admin user(s)` 
            : 'No admin users found',
          data: adminUsers
        });
      } catch (error) {
        results.push({
          test: 'Admin User Check',
          status: 'error',
          message: `Admin check error: ${error}`,
          error
        });
      }

      setConnectionStatus('connected');
      
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTest;
