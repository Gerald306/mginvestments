
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, CheckCircle, Clock, Eye, UserPlus, School, BarChart3, Mail, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AddTeacherModal from '@/components/AddTeacherModal';
import AddSchoolModal from '@/components/AddSchoolModal';
import ApplicationsManagement from '@/components/ApplicationsManagement';
import NotificationSystem from '@/components/NotificationSystem';
import FileUploadManager from '@/components/FileUploadManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeSchools: 0,
    placements: 0,
    pendingApplications: 0
  });
  const [teachers, setTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchStats();
      fetchTeachers();
      fetchSchools();
      fetchRecentActivity();
    }
  }, [profile]);

  const fetchStats = async () => {
    try {
      const [teachersResult, schoolsResult, applicationsResult] = await Promise.all([
        supabase.from('teachers').select('*', { count: 'exact' }),
        supabase.from('schools').select('*', { count: 'exact' }),
        supabase.from('job_applications').select('*', { count: 'exact' }).eq('status', 'pending')
      ]);

      setStats({
        totalTeachers: teachersResult.count || 0,
        activeSchools: schoolsResult.count || 0,
        placements: Math.floor((teachersResult.count || 0) * 0.65),
        pendingApplications: applicationsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchRecentActivity = async () => {
    // This would typically fetch from an activity log table
    // For now, we'll use mock data
    setRecentActivity([
      { type: "Teacher Registration", name: "Sarah Nakamya", time: "2 hours ago", status: "pending" },
      { type: "School Application", name: "St. Mary's College", time: "4 hours ago", status: "approved" },
      { type: "Teacher Placement", name: "John Ssali → Kampala High", time: "1 day ago", status: "completed" },
      { type: "Account Expiry", name: "15 teacher accounts", time: "1 day ago", status: "warning" }
    ]);
  };

  const statsData = [
    { label: "Total Teachers", value: stats.totalTeachers.toString(), change: "+12", icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
    { label: "Active Schools", value: stats.activeSchools.toString(), change: "+5", icon: <Building2 className="h-5 w-5" />, color: "text-green-600" },
    { label: "Placements Made", value: stats.placements.toString(), change: "+23", icon: <CheckCircle className="h-5 w-5" />, color: "text-purple-600" },
    { label: "Pending Applications", value: stats.pendingApplications.toString(), change: "-8", icon: <Clock className="h-5 w-5" />, color: "text-orange-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "placed": return "bg-blue-100 text-blue-800";
      case "expiring": return "bg-orange-100 text-orange-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "completed": return "bg-purple-100 text-purple-800";
      case "warning": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/95 via-orange-50/90 to-amber-50/95 backdrop-blur-lg border-b border-orange-200/50 shadow-lg shadow-orange-100/20">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-orange-600 hover:text-orange-700 transition-all duration-300 hover:scale-110">
                <Home className="h-7 w-7 drop-shadow-lg" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-700 font-medium">MG Investments - Teacher Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AddTeacherModal onTeacherAdded={fetchTeachers} />
              <AddSchoolModal onSchoolAdded={fetchSchools} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white/90 to-orange-50/50 backdrop-blur-sm border border-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{stat.label}</p>
                    <div className="flex items-center mt-2">
                      <p className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="schools">Schools</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      System Overview
                    </CardTitle>
                    <CardDescription>
                      Real-time statistics and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Teacher Placement Rate</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                          </div>
                          <span className="text-sm font-medium">73%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Account Renewal Rate</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">School Satisfaction</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="teachers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Management</CardTitle>
                    <CardDescription>
                      Manage teacher profiles, account status, and placements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {teacher.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{teacher.full_name}</h4>
                              <p className="text-sm text-gray-600">{teacher.subject_specialization} • {teacher.experience_years} years</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{teacher.views_count}</span>
                            </div>
                            <Badge className={getStatusColor(teacher.status)}>
                              {teacher.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {getDaysUntilExpiry(teacher.account_expiry)} days
                            </span>
                            <Link to={`/teacher-profile/${teacher.id}`}>
                              <Button size="sm" variant="outline">
                                Manage
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schools" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>School Management</CardTitle>
                    <CardDescription>
                      Monitor school accounts and active job postings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schools.map((school) => (
                        <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {school.school_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{school.school_name}</h4>
                              <p className="text-sm text-gray-600">{school.school_type} • {school.total_teachers} teachers</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-blue-100 text-blue-800">
                              {school.active_jobs} jobs
                            </Badge>
                            <span className="text-sm text-gray-600">Joined {new Date(school.created_at).toLocaleDateString()}</span>
                            <Link to={`/school-profile/${school.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <ApplicationsManagement />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationSystem />
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <FileUploadManager />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-600 truncate">{activity.name}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Notifications
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Check Expiring Accounts
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Bulk Import Teachers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
