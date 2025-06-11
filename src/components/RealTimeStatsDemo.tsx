import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRealTimeStats } from '@/services/realTimeStatsService';
import { firebase } from '@/integrations/firebase/client';
import { Plus, Trash2, RefreshCw, Database } from 'lucide-react';

const RealTimeStatsDemo: React.FC = () => {
  const stats = useRealTimeStats();
  const [isLoading, setIsLoading] = useState(false);

  const addSampleTeacher = async () => {
    setIsLoading(true);
    try {
      const sampleTeacher = {
        full_name: `Teacher ${Date.now()}`,
        email: `teacher${Date.now()}@example.com`,
        phone: `+25670${Math.floor(Math.random() * 10000000)}`,
        subject_specialization: ["Mathematics", "English", "Science", "History"][Math.floor(Math.random() * 4)],
        experience_years: Math.floor(Math.random() * 10) + 1,
        education_level: "Bachelor's Degree",
        teaching_levels: ["Primary", "Secondary"],
        languages: ["English"],
        availability: "Full-time",
        location: ["Kampala", "Entebbe", "Jinja"][Math.floor(Math.random() * 3)],
        is_active: true,
        status: "approved",
        views_count: Math.floor(Math.random() * 100),
        account_expiry: "2025-12-31"
      };

      const result = await firebase.from('teachers').insert(sampleTeacher);
      if (result.error) {
        console.error('Error adding teacher:', result.error);
      } else {
        console.log('✅ Added teacher:', sampleTeacher.full_name);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSampleSchool = async () => {
    setIsLoading(true);
    try {
      const sampleSchool = {
        school_name: `School ${Date.now()}`,
        contact_person: `Contact ${Date.now()}`,
        email: `school${Date.now()}@example.com`,
        phone_number: `+25670${Math.floor(Math.random() * 10000000)}`,
        location: ["Kampala", "Entebbe", "Jinja", "Mukono"][Math.floor(Math.random() * 4)],
        school_type: ["Private", "Public"][Math.floor(Math.random() * 2)],
        is_active: true,
        total_teachers: Math.floor(Math.random() * 50) + 10,
        active_jobs: Math.floor(Math.random() * 5) + 1
      };

      const result = await firebase.from('schools').insert(sampleSchool);
      if (result.error) {
        console.error('Error adding school:', result.error);
      } else {
        console.log('✅ Added school:', sampleSchool.school_name);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSampleApplication = async () => {
    setIsLoading(true);
    try {
      const statuses = ['pending', 'hired', 'accepted', 'successful', 'rejected'];
      const sampleApplication = {
        teacher_id: `teacher_${Date.now()}`,
        school_id: `school_${Date.now()}`,
        job_title: ["Mathematics Teacher", "English Teacher", "Science Teacher"][Math.floor(Math.random() * 3)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        applied_at: new Date().toISOString(),
        teacher_name: `Teacher ${Date.now()}`,
        school_name: `School ${Date.now()}`
      };

      const result = await firebase.from('job_applications').insert(sampleApplication);
      if (result.error) {
        console.error('Error adding application:', result.error);
      } else {
        console.log('✅ Added application:', sampleApplication.job_title);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Note: This is a simplified version. In a real app, you'd need proper batch deletion
      console.log('⚠️ Clear all data functionality would be implemented here');
      alert('Clear all data functionality is not implemented in this demo for safety reasons.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          Real-Time Statistics Demo
        </CardTitle>
        <p className="text-sm text-gray-600">
          This demo shows real-time statistics connected to Firebase. Add data to see the stats update instantly!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTeachers}</div>
            <div className="text-sm text-gray-600">Teachers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.activeSchools}</div>
            <div className="text-sm text-gray-600">Schools</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.successfulPlacements}</div>
            <div className="text-sm text-gray-600">Placements</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.totalApplications}</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            onClick={addSampleTeacher} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
          <Button 
            onClick={addSampleSchool} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add School
          </Button>
          <Button 
            onClick={addSampleApplication} 
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
          <Button 
            onClick={clearAllData} 
            disabled={isLoading}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">How to test:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Click the buttons above to add sample data to Firebase</li>
            <li>Watch the statistics update in real-time</li>
            <li>Open multiple browser tabs to see live synchronization</li>
            <li>Check the browser console for Firebase operations</li>
          </ol>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Connected to Firebase</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeStatsDemo;
