import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dataService } from '@/services/dataService';
import { initializeIfEmpty } from '@/utils/initializeFirebaseData';
import { RefreshCw, Database, Users, CheckCircle } from 'lucide-react';

interface Teacher {
  id: string;
  full_name: string;
  status: string;
  is_active: boolean;
  account_expiry: string;
}

const TeachersTestPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [approvedTeachers, setApprovedTeachers] = useState<Teacher[]>([]);

  const fetchAllTeachers = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching all teachers...');
      const { data, error } = await dataService.getTeachers();
      
      if (error) {
        console.error('❌ Error fetching teachers:', error);
        return;
      }

      console.log('✅ All teachers fetched:', data?.length || 0);
      setTeachers(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedTeachers = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching approved teachers...');
      const { data, error } = await dataService.getApprovedTeachers();
      
      if (error) {
        console.error('❌ Error fetching approved teachers:', error);
        return;
      }

      console.log('✅ Approved teachers fetched:', data?.length || 0);
      setApprovedTeachers(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Initializing Firebase data...');
      const result = await initializeIfEmpty();
      
      if (result.success) {
        console.log('✅ Data initialized successfully');
        // Refresh the teachers list
        await fetchAllTeachers();
        await fetchApprovedTeachers();
      } else {
        console.error('❌ Failed to initialize data');
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          Teachers Database Test Panel
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test the teachers database functionality and data fetching
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={initializeData} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Database className="h-4 w-4 mr-2" />
            Initialize Data
          </Button>
          <Button 
            onClick={fetchAllTeachers} 
            disabled={isLoading}
            variant="outline"
          >
            <Users className="h-4 w-4 mr-2" />
            Fetch All Teachers
          </Button>
          <Button 
            onClick={fetchApprovedTeachers} 
            disabled={isLoading}
            variant="outline"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Fetch Approved Teachers
          </Button>
        </div>

        {/* Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* All Teachers */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Teachers ({teachers.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{teacher.full_name}</span>
                    <div className="flex gap-1">
                      <Badge variant={teacher.is_active ? "default" : "secondary"}>
                        {teacher.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={teacher.status === "approved" ? "default" : "outline"}>
                        {teacher.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Expires: {teacher.account_expiry}
                  </div>
                </div>
              ))}
              {teachers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No teachers found. Click "Fetch All Teachers" to load data.
                </div>
              )}
            </div>
          </div>

          {/* Approved Teachers */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Approved Teachers ({approvedTeachers.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {approvedTeachers.map((teacher) => (
                <div key={teacher.id} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{teacher.full_name}</span>
                    <div className="flex gap-1">
                      <Badge className="bg-green-100 text-green-800">
                        Qualified
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Expires: {teacher.account_expiry}
                  </div>
                </div>
              ))}
              {approvedTeachers.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No approved teachers found. Click "Fetch Approved Teachers" to load data.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600">Loading...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Ready</span>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Testing Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Click "Initialize Data" to add sample teachers to Firebase</li>
            <li>Click "Fetch All Teachers" to see all teachers in the database</li>
            <li>Click "Fetch Approved Teachers" to see only qualified teachers</li>
            <li>Check the browser console for detailed logs</li>
            <li>The approved teachers should appear in the "Qualified Teachers" section above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeachersTestPanel;
