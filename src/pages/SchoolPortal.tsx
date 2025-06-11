import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Star,
  Eye,
  Plus,
  LogOut,
  User,
  School,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  BookOpen,
  Award,
  Clock,
  Home,
  Settings,
  Bell,
  Search,
  Filter,
  ArrowLeft,
  DollarSign,
  FileText,
  Heart,
  MessageCircle,
  Download,
  Share2,
  MoreVertical,
  ChevronRight,
  Building,
  GraduationCap,
  Target,
  Zap,
  Crown,
  Shield,
  Save,
  CheckCircle
} from 'lucide-react';
import ScrollToTop from '@/components/ScrollToTop';
import NotificationPanel from '@/components/NotificationPanel';
import NotificationPopup from '@/components/NotificationPopup';

const SchoolPortal = () => {
  const { profile, user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user is admin accessing school portal
  const isAdmin = profile?.role === 'admin';

  // Enhanced mock data for teachers
  const teachers = [
    {
      id: 1,
      name: "Sarah Nakamya",
      subject: "Mathematics",
      experience: "5 years",
      qualification: "BSc Mathematics, PGDE",
      rating: 4.8,
      views: 156,
      lastActive: "2 days ago",
      salaryExpectation: "UGX 1,200,000 - 1,500,000",
      isRestricted: true,
      location: "Kampala",
      avatar: "SN",
      specializations: ["Algebra", "Calculus", "Statistics"],
      languages: ["English", "Luganda"],
      availability: "Immediate",
      verified: true
    },
    {
      id: 2,
      name: "James Okello",
      subject: "Physics",
      experience: "8 years",
      qualification: "BSc Physics, MSc Education",
      rating: 4.9,
      views: 203,
      lastActive: "1 day ago",
      salaryExpectation: "UGX 1,400,000 - 1,800,000",
      isRestricted: false,
      location: "Entebbe",
      avatar: "JO",
      specializations: ["Mechanics", "Thermodynamics", "Optics"],
      languages: ["English", "Swahili"],
      availability: "2 weeks notice",
      verified: true
    },
    {
      id: 3,
      name: "Grace Atim",
      subject: "English",
      experience: "3 years",
      qualification: "BA English Literature, PGDE",
      rating: 4.7,
      views: 89,
      lastActive: "3 hours ago",
      salaryExpectation: "UGX 900,000 - 1,200,000",
      isRestricted: true,
      location: "Jinja",
      avatar: "GA",
      specializations: ["Literature", "Creative Writing", "Grammar"],
      languages: ["English", "Luganda"],
      availability: "Immediate",
      verified: false
    }
  ];



  // Mock data for school's job posts
  const myJobs = [
    {
      id: 1,
      position: "Mathematics Teacher",
      level: "Secondary",
      applicants: 12,
      views: 45,
      posted: "3 days ago",
      status: "active"
    },
    {
      id: 2,
      position: "Physics Teacher",
      level: "Advanced",
      applicants: 8,
      views: 32,
      posted: "1 week ago",
      status: "active"
    }
  ];

  // Job posting form state
  const [jobForm, setJobForm] = useState({
    position: '',
    subject: '',
    level: '',
    salary: '',
    description: '',
    requirements: ''
  });

  const handleJobFormChange = (field: string, value: string) => {
    setJobForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Set document title
  useEffect(() => {
    document.title = 'MG Investments - School Portal';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-200 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <School className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">Schools Portal</h1>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate group-hover:text-blue-600 transition-colors duration-200">MG Investments</p>
                </div>
              </Link>
              {isAdmin && (
                <Badge className="bg-red-100 text-red-800 border-red-200 flex-shrink-0">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin Access
                </Badge>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Admin Dashboard</span>
                    <span className="sm:hidden">Admin</span>
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut} className="border-red-200 text-red-600 hover:bg-red-50">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section - Always visible */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 leading-tight">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'Admin'}! 👋
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {isAdmin
                    ? 'Admin access to schools portal with full management capabilities'
                    : 'Manage your school\'s hiring process and find the perfect teachers'
                  }
                </p>
              </div>
              <div className="hidden md:block flex-shrink-0">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <School className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/5 rounded-full -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 translate-x-16 sm:translate-x-24 lg:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-white/5 rounded-full translate-y-12 sm:translate-y-18 lg:translate-y-24 -translate-x-12 sm:-translate-x-18 lg:-translate-x-24"></div>
        </div>

        {/* Tab Navigation - Under Welcome Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-blue-100/50 mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('dashboard')}
              className={`${activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'} transition-all duration-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 text-xs sm:text-sm lg:text-base w-full lg:w-auto`}
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 lg:mr-3" />
              <span className="hidden sm:inline lg:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </Button>
            <Button
              variant={activeTab === 'teachers' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('teachers')}
              className={`${activeTab === 'teachers' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'} transition-all duration-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 text-xs sm:text-sm lg:text-base w-full lg:w-auto`}
            >
              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 lg:mr-3" />
              <span className="hidden sm:inline lg:inline">Browse Teachers</span>
              <span className="sm:hidden">Teachers</span>
            </Button>
            <Button
              variant={activeTab === 'jobs' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('jobs')}
              className={`${activeTab === 'jobs' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'} transition-all duration-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 text-xs sm:text-sm lg:text-base w-full lg:w-auto`}
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 lg:mr-3" />
              <span className="hidden sm:inline lg:inline">My Job Posts</span>
              <span className="sm:hidden">Jobs</span>
            </Button>
            <Button
              variant={activeTab === 'post-job' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('post-job')}
              className={`${activeTab === 'post-job' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'} transition-all duration-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 text-xs sm:text-sm lg:text-base w-full lg:w-auto`}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 lg:mr-3" />
              <span className="hidden sm:inline lg:inline">Post New Job</span>
              <span className="sm:hidden">Post</span>
            </Button>
            <Button
              variant={activeTab === 'applications' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('applications')}
              className={`${activeTab === 'applications' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'} transition-all duration-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 text-xs sm:text-sm lg:text-base w-full lg:w-auto`}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 lg:mr-3" />
              <span className="hidden sm:inline lg:inline">Applications</span>
              <span className="sm:hidden">Apps</span>
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('notifications')}
              className={`${activeTab === 'notifications' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'} transition-all duration-300 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 text-xs sm:text-sm lg:text-base w-full lg:w-auto relative`}
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 lg:mr-3" />
              <span className="hidden sm:inline lg:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* My Profile Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* School Profile Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <School className="h-5 w-5 text-blue-600" />
                      School Profile
                    </CardTitle>
                    <CardDescription>
                      Complete your school profile to attract the best teachers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schoolName" className="text-sm font-semibold text-gray-700 mb-2 block">School Name *</Label>
                        <Input
                          id="schoolName"
                          placeholder="Enter your school name"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="schoolType" className="text-sm font-semibold text-gray-700 mb-2 block">School Type *</Label>
                        <Select>
                          <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select school type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primary School</SelectItem>
                            <SelectItem value="secondary">Secondary School</SelectItem>
                            <SelectItem value="combined">Primary & Secondary</SelectItem>
                            <SelectItem value="international">International School</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location" className="text-sm font-semibold text-gray-700 mb-2 block">Location *</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Kampala, Uganda"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail" className="text-sm font-semibold text-gray-700 mb-2 block">Contact Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="school@example.com"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="+256 XXX XXX XXX"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website" className="text-sm font-semibold text-gray-700 mb-2 block">Website</Label>
                        <Input
                          id="website"
                          placeholder="https://yourschool.com"
                          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">School Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell teachers about your school, mission, values, and what makes it a great place to work..."
                        rows={4}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </Button>
                      <Button variant="outline" className="border-gray-300 px-8">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Status Sidebar */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Profile Completion</span>
                        <span className="font-semibold text-blue-600">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-600">Account Active (30 days left)</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Eye className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-gray-600">Profile viewed 45 times</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Job Posts</span>
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Applications</span>
                      <span className="text-2xl font-bold text-green-600">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Teachers Contacted</span>
                      <span className="text-2xl font-bold text-purple-600">12</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            {/* Search and Filter Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Teachers</h2>
                  <p className="text-gray-600">Find qualified teachers for your institution</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search teachers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Teacher Cards */}
            <div className="grid gap-6">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Teacher Avatar & Quick Info */}
                      <div className="w-32 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 flex flex-col items-center justify-center text-white relative">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold mb-2 backdrop-blur-sm">
                          {teacher.avatar}
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="h-3 w-3 text-yellow-300 fill-current" />
                            <span className="text-xs font-medium">{teacher.rating}</span>
                          </div>
                          <p className="text-xs opacity-90">{teacher.views} views</p>
                        </div>
                        {teacher.verified && (
                          <div className="absolute top-2 right-2">
                            <Shield className="h-4 w-4 text-green-300" />
                          </div>
                        )}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                              {teacher.verified && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {teacher.availability}
                              </Badge>
                            </div>
                            <p className="text-blue-600 font-semibold mb-1">{teacher.subject} Teacher</p>
                            <p className="text-sm text-gray-600">{teacher.qualification}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Last active</p>
                            <p className="text-sm font-medium text-gray-900">{teacher.lastActive}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Experience</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">{teacher.experience}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Location</span>
                            </div>
                            {teacher.isRestricted ? (
                              <div className="flex items-center ml-6">
                                <Crown className="h-3 w-3 text-amber-500 mr-1" />
                                <span className="text-sm text-amber-600 font-medium">Premium Only</span>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600 ml-6">{teacher.location}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-gray-700">Salary Range</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">{teacher.salaryExpectation}</p>
                          </div>
                        </div>

                        {/* Specializations */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
                          <div className="flex flex-wrap gap-2">
                            {teacher.specializations.map((spec, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
                          <div className="flex space-x-2">
                            {teacher.languages.map((lang, index) => (
                              <Badge key={index} variant="outline" className="border-gray-300 text-gray-600">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Restriction Notice */}
                        {teacher.isRestricted && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
                            <div className="flex items-start space-x-3">
                              <Crown className="h-5 w-5 text-amber-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-amber-800 mb-1">Premium Access Required</p>
                                <p className="text-xs text-amber-700">
                                  Contact details, location information, detailed experience, and direct communication features are available with premium subscription.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            {teacher.isRestricted ? (
                              <Link to="/subscription">
                                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                                  <Crown className="h-4 w-4 mr-2" />
                                  Unlock Profile
                                </Button>
                              </Link>
                            ) : (
                              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Teacher
                              </Button>
                            )}
                            <Button variant="outline" className="border-gray-300">
                              <Heart className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium Access CTA */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Unlock Full Teacher Profiles
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get access to contact information, teacher locations, detailed experience, and direct communication with teachers.
                </p>
                <Link to="/subscription">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold">
                    <Crown className="h-5 w-5 mr-2" />
                    Subscribe Now - Premium Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Jobs Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">My Job Posts</h2>
                  <p className="text-gray-600">Manage your active job postings and applications</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setActiveTab('post-job')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </div>

            {/* Enhanced Job Cards */}
            <div className="grid gap-6">
              {myJobs.map((job) => (
                <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{job.position}</h3>
                          <Badge className={`${job.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${job.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            {job.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">{job.level} Level</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">{job.applicants} applicants</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600">{job.views} views</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="text-sm text-gray-600">Posted {job.posted}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Users className="h-4 w-4 mr-2" />
                          View Applicants
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Job
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Post New Job Tab */}
        {activeTab === 'post-job' && (
          <div className="space-y-6">
            {/* Post Job Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Post New Teaching Position</h2>
                <p className="text-gray-600">Create a job posting to attract qualified teachers</p>
              </div>
            </div>

            {/* Job Posting Form */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="position" className="text-sm font-semibold text-gray-700 mb-2 block">Position Title *</Label>
                      <Input
                        id="position"
                        value={jobForm.position}
                        onChange={(e) => handleJobFormChange('position', e.target.value)}
                        placeholder="e.g., Mathematics Teacher"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 mb-2 block">Subject/Area *</Label>
                      <Select onValueChange={(value) => handleJobFormChange('subject', value)}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="physics">Physics</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="biology">Biology</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="geography">Geography</SelectItem>
                          <SelectItem value="primary">Primary Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="level" className="text-sm font-semibold text-gray-700 mb-2 block">Education Level *</Label>
                      <Select onValueChange={(value) => handleJobFormChange('level', value)}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="advanced">Advanced Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salary" className="text-sm font-semibold text-gray-700 mb-2 block">Salary Range (UGX) *</Label>
                      <Input
                        id="salary"
                        value={jobForm.salary}
                        onChange={(e) => handleJobFormChange('salary', e.target.value)}
                        placeholder="e.g., 800,000 - 1,200,000"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2 block">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={jobForm.description}
                      onChange={(e) => handleJobFormChange('description', e.target.value)}
                      placeholder="Describe the position, responsibilities, and what you're looking for in a candidate..."
                      rows={4}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements" className="text-sm font-semibold text-gray-700 mb-2 block">Requirements *</Label>
                    <Textarea
                      id="requirements"
                      value={jobForm.requirements}
                      onChange={(e) => handleJobFormChange('requirements', e.target.value)}
                      placeholder="List the qualifications, experience, and skills required for this position..."
                      rows={4}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </Button>
                    <Button variant="outline" className="border-gray-300 px-8">
                      <FileText className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Applications Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Applications</h2>
                <p className="text-gray-600">Review and manage applications from qualified teachers</p>
              </div>
            </div>

            {/* Applications List */}
            <div className="grid gap-6">
              {[
                {
                  id: 1,
                  name: "Sarah Johnson",
                  position: "Mathematics Teacher",
                  subject: "Mathematics",
                  experience: "5 years",
                  qualification: "Bachelor's Degree",
                  appliedDate: "2 days ago",
                  status: "pending",
                  avatar: "SJ",
                  rating: 4.8,
                  location: "Kampala"
                },
                {
                  id: 2,
                  name: "Michael Chen",
                  position: "Physics Teacher",
                  subject: "Physics",
                  experience: "8 years",
                  qualification: "Master's Degree",
                  appliedDate: "1 week ago",
                  status: "reviewed",
                  avatar: "MC",
                  rating: 4.9,
                  location: "Entebbe"
                },
                {
                  id: 3,
                  name: "Grace Nakato",
                  position: "English Teacher",
                  subject: "English",
                  experience: "3 years",
                  qualification: "Bachelor's Degree",
                  appliedDate: "3 days ago",
                  status: "shortlisted",
                  avatar: "GN",
                  rating: 4.7,
                  location: "Mukono"
                }
              ].map((application) => (
                <Card key={application.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {application.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{application.name}</h3>
                            <Badge className={`${
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              application.status === 'reviewed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              'bg-green-100 text-green-800 border-green-200'
                            }`}>
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-blue-600 font-semibold mb-1">{application.position}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{application.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{application.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <span>Applied {application.appliedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Subject</p>
                        <p className="text-sm text-gray-600">{application.subject}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Experience</p>
                        <p className="text-sm text-gray-600">{application.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Qualification</p>
                        <p className="text-sm text-gray-600">{application.qualification}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex space-x-3">
                        <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <NotificationPanel />
          </div>
        )}
      </div>

      {/* Notification Popup */}
      <NotificationPopup />

      {/* Scroll to Top Component */}
      <ScrollToTop showHomeButton={true} />
    </div>
  );
};

export default SchoolPortal;
