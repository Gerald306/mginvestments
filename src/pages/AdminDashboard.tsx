
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, CheckCircle, Clock, Eye, School, BarChart3, Mail, ArrowLeft, Home, TrendingUp, Activity, Zap, GraduationCap, Calendar, Menu, X, ChevronDown, Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useRealTimeData } from '@/contexts/RealTimeDataContext';
import { supabase } from '@/integrations/supabase/client';
import AddTeacherModal from '@/components/AddTeacherModal';
import AddSchoolModal from '@/components/AddSchoolModal';
import ApplicationsManagement from '@/components/ApplicationsManagement';
import NotificationSystem from '@/components/NotificationSystem';
import FileUploadManager from '@/components/FileUploadManager';
import AdminActionButtons from '@/components/AdminActionButtons';
import RealTimeTeachersDisplay from '@/components/RealTimeTeachersDisplay';
import RealTimeSchoolsDisplay from '@/components/RealTimeSchoolsDisplay';
import AdminDataImport from '@/components/AdminDataImport';
import DataApprovalWorkflow from '@/components/DataApprovalWorkflow';
import TeacherPortalDataImport from '@/components/TeacherPortalDataImport';
import SchoolApprovalManagement from '@/components/SchoolApprovalManagement';
import CreateTeacherAccount from '@/components/CreateTeacherAccount';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { stats, recentActivity, addTeacher, addSchool } = useRealTimeData();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActionsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Using real-time data context - no need for manual fetching

  // All data is now managed by the RealTimeDataContext

  const statsData = [
    {
      label: "Total Teachers",
      value: stats.totalTeachers.toString(),
      change: `+${stats.todayRegistrations}`,
      icon: <Users className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      label: "Active Schools",
      value: stats.activeSchools.toString(),
      change: `${stats.monthlyGrowth}%`,
      icon: <Building2 className="h-5 w-5" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-r from-emerald-500 to-teal-500"
    },
    {
      label: "Pending Applications",
      value: stats.pendingApplications.toString(),
      change: "Live",
      icon: <Clock className="h-5 w-5" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-500"
    },
    {
      label: "Expiring Accounts",
      value: stats.expiringAccounts.toString(),
      change: "7 days",
      icon: <Activity className="h-5 w-5" />,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-red-500 to-pink-500"
    }
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
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Link to="/" className="text-orange-600 hover:text-orange-700 transition-all duration-300 hover:scale-110 flex-shrink-0">
                <Home className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow-lg" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent truncate">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-700 font-medium hidden sm:block">MG Investments - Teacher Management System</p>
                <p className="text-xs text-gray-700 font-medium sm:hidden">MG Investments</p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/teacher-portal">
                  <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50 transition-all duration-300 hover:scale-105">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Teacher Portal
                  </Button>
                </Link>
                <CreateTeacherAccount onAccountCreated={addTeacher} />
                <AddTeacherModal onTeacherAdded={addTeacher} />
                <AddSchoolModal onSchoolAdded={addSchool} />
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="text-red-600 border-red-300 hover:bg-red-50 transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile Actions Dropdown */}
              <div className="lg:hidden relative" ref={dropdownRef}>
                <Button
                  type="button"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 p-2"
                  onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                >
                  {isActionsDropdownOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>

                {/* Mobile Dropdown Menu */}
                {isActionsDropdownOpen && (
                  <>
                    {/* Backdrop overlay */}
                    <div
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                      onClick={() => setIsActionsDropdownOpen(false)}
                    />
                    {/* Dropdown content */}
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-lg border border-orange-200/50 rounded-lg shadow-xl z-50">
                      <div className="p-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-700 px-2 py-1 bg-orange-50 rounded">
                          🔧 Quick Actions
                        </div>

                        <Link to="/teacher-portal" onClick={() => setIsActionsDropdownOpen(false)}>
                          <Button variant="outline" className="w-full justify-start text-sm py-3 border-teal-300 text-teal-700 hover:bg-teal-50">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Teacher Portal
                          </Button>
                        </Link>

                        <div className="border-t border-orange-200/50 pt-2">
                          <div className="text-xs font-semibold text-gray-700 px-2 py-1 mb-2">
                            ➕ Add New
                          </div>
                          <div className="space-y-2">
                            <div onClick={() => setIsActionsDropdownOpen(false)}>
                              <CreateTeacherAccount onAccountCreated={addTeacher} />
                            </div>
                            <div onClick={() => setIsActionsDropdownOpen(false)}>
                              <AddTeacherModal onTeacherAdded={addTeacher} isMobile={true} />
                            </div>
                            <div onClick={() => setIsActionsDropdownOpen(false)}>
                              <AddSchoolModal onSchoolAdded={addSchool} isMobile={true} />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-orange-200/50 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsActionsDropdownOpen(false);
                              signOut();
                            }}
                            className="w-full justify-start text-sm py-3 text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{stat.label}</p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{stat.change}</span>
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg flex-shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          {/* Tab Navigation - Full Width */}
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 h-auto lg:h-14 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-lg shadow-lg gap-1 sm:gap-2 p-1 sm:p-2">
                <TabsTrigger
                  value="overview"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  📊 Overview
                </TabsTrigger>
                <TabsTrigger
                  value="teachers"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  👨‍🏫 Teachers
                </TabsTrigger>
                <TabsTrigger
                  value="schools"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  🏫 Schools
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  📝 Apps
                </TabsTrigger>
                <TabsTrigger
                  value="portal-import"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  📥 Import
                </TabsTrigger>
                <TabsTrigger
                  value="school-approvals"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  ✅ Approvals
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  🔔 Alerts
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  📅 Meetings
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="flex-1 text-xs sm:text-sm font-medium px-1 sm:px-2 py-2 sm:py-2 rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50"
                >
                  📁 Files
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                    <AdminActionButtons />
                  </div>

                  {/* Quick Actions Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Primary Actions */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Core Management</h4>
                          <CreateTeacherAccount onAccountCreated={addTeacher} />
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("teachers")}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Manage Teachers
                          </Button>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("schools")}
                          >
                            <School className="h-4 w-4 mr-2" />
                            Manage Schools
                          </Button>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("applications")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Teacher Applications
                          </Button>
                        </div>

                        {/* Approval Actions */}
                        <div className="space-y-2 pt-3 border-t">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Approvals & Import</h4>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("portal-import")}
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            Portal Data Import
                          </Button>
                          <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => setActiveTab("school-approvals")}
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                            School Approvals
                          </Button>
                          <Link to="/teacher-portal" className="block">
                            <Button className="w-full justify-start" variant="outline">
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Teacher Portal Access
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="teachers" className="space-y-6">
                <RealTimeTeachersDisplay />
              </TabsContent>

              <TabsContent value="schools" className="space-y-6">
                <RealTimeSchoolsDisplay />
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <ApplicationsManagement />
              </TabsContent>

              <TabsContent value="portal-import" className="space-y-6">
                <TeacherPortalDataImport />
              </TabsContent>

              <TabsContent value="school-approvals" className="space-y-6">
                <SchoolApprovalManagement />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationSystem />
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                      Appointment Management
                    </CardTitle>
                    <CardDescription>
                      Manage and track all scheduled appointments and consultations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment System</h3>
                      <p className="text-gray-600 mb-4">
                        View and manage all scheduled appointments from the Schedule Appointment page.
                      </p>
                      <Link to="/schedule-appointment">
                        <Button className="bg-gradient-to-r from-orange-500 to-amber-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          View Appointments
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <div className="space-y-6">
                  <FileUploadManager />

                  {/* Data Import Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Advanced Data Import
                      </CardTitle>
                      <CardDescription>
                        Import data from CSV, Excel, or JSON files with validation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdminDataImport />
                    </CardContent>
                  </Card>

                  {/* Data Approval Workflow */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Data Approval Workflow
                      </CardTitle>
                      <CardDescription>
                        Review and approve imported data before publishing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataApprovalWorkflow />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Full-Width Recent Activity Section */}
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm border border-blue-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Activity className="h-5 w-5 mr-2" />
                    Real-time Activity
                  </CardTitle>
                  <CardDescription>Live platform activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status).split(' ')[0]} animate-pulse`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.type}</p>
                            <p className="text-sm text-gray-600">{activity.name}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm border border-purple-100 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-900">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Teacher Placement Rate</span>
                      <span className="text-sm font-bold text-green-600">73%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-[73%]"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Account Renewal Rate</span>
                      <span className="text-sm font-bold text-blue-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">School Satisfaction</span>
                      <span className="text-sm font-bold text-purple-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
