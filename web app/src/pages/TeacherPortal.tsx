
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, MapPin, Phone, DollarSign, Calendar, Eye, Star, Building2, Clock, Shield, Database, CheckCircle, Send, FileText, AlertCircle, LogOut, Save, Lock, Crown, User, School, Bell, BookOpen, Users, Award, Lightbulb } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobPostings from '@/components/JobPostings';
import LockedJobPostings from '@/components/LockedJobPostings';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationPanel from '@/components/NotificationPanel';
import NotificationPopup from '@/components/NotificationPopup';
import AdminDataImport from '@/components/AdminDataImport';
import DataApprovalWorkflow from '@/components/DataApprovalWorkflow';
import { useToast } from "@/hooks/use-toast";
import { firebase } from '@/integrations/firebase/client';
import ScrollToTop from '@/components/ScrollToTop';
import { Checkbox } from "@/components/ui/checkbox";
import { useState as useReactState } from 'react';

// Ugandan Education System Data
const TEACHING_LEVELS = [
  'Nursery',
  'Lower Primary (P1-P3)',
  'Upper Primary (P4-P7)',
  'Secondary (S1-S6)'
];

const SUBJECTS_BY_LEVEL = {
  'Nursery': [
    'Pre-Reading Skills',
    'Pre-Writing Skills',
    'Pre-Math Skills',
    'Creative Arts',
    'Physical Education',
    'Social Skills',
    'Environmental Studies',
    'Music and Movement',
    'Story Telling',
    'Play Activities'
  ],
  'Lower Primary (P1-P3)': [
    'English',
    'Mathematics',
    'Science',
    'Social Studies',
    'Religious Education',
    'Physical Education',
    'Creative Arts',
    'Local Language (Luganda)',
    'Local Language (Runyankole)',
    'Local Language (Ateso)',
    'Local Language (Luo)',
    'Local Language (Runyoro)',
    'Local Language (Rukiga)',
    'Local Language (Lusoga)',
    'Local Language (Acholi)',
    'Local Language (Langi)',
    'Local Language (Alur)',
    'Life Skills',
    'Music',
    'Art and Craft'
  ],
  'Upper Primary (P4-P7)': [
    'English',
    'Mathematics',
    'Science',
    'Social Studies',
    'Religious Education (Christian)',
    'Religious Education (Islamic)',
    'Physical Education',
    'Creative Arts',
    'Local Language (Luganda)',
    'Local Language (Runyankole)',
    'Local Language (Ateso)',
    'Local Language (Luo)',
    'Local Language (Runyoro)',
    'Local Language (Rukiga)',
    'Local Language (Lusoga)',
    'Local Language (Acholi)',
    'Local Language (Langi)',
    'Local Language (Alur)',
    'Life Skills',
    'Agriculture',
    'Computer Studies',
    'Music',
    'Art and Craft',
    'Home Economics'
  ],
  'Secondary (S1-S6)': [
    // Core Subjects (Compulsory)
    'English Language',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'History',
    'Religious Education (Christian)',
    'Religious Education (Islamic)',
    'Physical Education',

    // Languages
    'Literature in English',
    'French',
    'German',
    'Latin',
    'Arabic',
    'Luganda',
    'Runyankole',
    'Ateso',
    'Luo',
    'Runyoro',
    'Rukiga',
    'Lusoga',
    'Acholi',
    'Langi',
    'Alur',
    'Kiswahili',

    // Sciences & Technology
    'Computer Studies',
    'Agriculture',
    'Technical Drawing',
    'Engineering Science',
    'Applied Mathematics',
    'General Paper',

    // Arts & Humanities
    'Fine Art',
    'Music',
    'Performing Arts',
    'Literature',
    'Philosophy',
    'Divinity',
    'Islamic Studies',

    // Commercial & Business
    'Economics',
    'Commerce',
    'Entrepreneurship',
    'Accounting',
    'Business Studies',
    'Office Practice',

    // Practical Subjects
    'Food and Nutrition',
    'Clothing and Textiles',
    'Home Economics',
    'Building Construction',
    'Electrical Installation',
    'Motor Vehicle Mechanics',
    'Carpentry and Joinery',
    'Plumbing',
    'Masonry',
    'Welding and Fabrication',
    'Electronics',

    // Additional Subjects
    'Environmental Science',
    'Political Education',
    'Subsidiary Mathematics',
    'General Studies',
    'Communication Skills',
    'Research Methods'
  ]
};

const MARITAL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated'
];

const PAYMENT_METHODS = [
  'MTN Mobile Money',
  'Airtel Money',
  'Stanbic Bank'
];

const TeacherPortal = () => {
  const { profile, user, signOut } = useAuth();
  const { hasPremiumAccess, subscriptionStatus, updateSubscription } = useSubscription();
  const { unreadCount } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Test function for admins to toggle subscription status
  const handleTestSubscription = async () => {
    if (!isAdmin) return;

    try {
      const newStatus = hasPremiumAccess ? 'free' : 'premium';
      const expiresAt = newStatus === 'premium'
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        : undefined;

      await updateSubscription(newStatus, expiresAt);

      toast({
        title: "Subscription Updated",
        description: `Subscription status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive",
      });
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    experience: '',
    teachingLevel: '',
    subject: '',
    qualification: '',
    maritalStatus: '',
    salaryExpectation: '',
    housingAllowance: false,
    otherAllowances: false,
    paymentMethod: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'draft' | 'submitted' | 'approved' | 'rejected'>('draft');
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');

  const jobListings = [
    {
      id: 1,
      school: "Kampala High School",
      position: "Mathematics Teacher",
      type: "Secondary",
      location: "Kampala Central",
      salary: "800,000 - 1,200,000 UGX",
      posted: "2 days ago",
      applicants: 12,
      urgent: true
    },
    {
      id: 2,
      school: "St. Mary's College",
      position: "Physics Teacher",
      type: "Secondary",
      location: "Entebbe",
      salary: "900,000 - 1,400,000 UGX",
      posted: "1 week ago",
      applicants: 8,
      urgent: false
    },
    {
      id: 3,
      school: "Green Valley Primary",
      position: "Primary Teacher",
      type: "Primary",
      location: "Mukono",
      salary: "600,000 - 900,000 UGX",
      posted: "3 days ago",
      applicants: 15,
      urgent: false
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      // Clear subject when teaching level changes
      if (field === 'teachingLevel') {
        console.log('Teaching level changed to:', value);
        return { ...prev, [field]: value, subject: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  // Load existing teacher profile data
  useEffect(() => {
    const loadTeacherProfile = async () => {
      if (user && profile?.role === 'teacher') {
        try {
          const result = await firebase
            .from('teachers')
            .select('*')
            .eq('id', user.id)
            .single();

          const { data: teacherData, error } = result;

          if (teacherData && !error) {
            setFormData({
              fullName: teacherData.full_name || '',
              email: teacherData.email || '',
              phone: teacherData.phone_number || '',
              age: teacherData.age?.toString() || '',
              location: teacherData.location || '',
              experience: teacherData.experience_years?.toString() || '',
              teachingLevel: teacherData.teaching_level || '',
              subject: teacherData.subject_specialization || '',
              qualification: teacherData.education_level || '',
              maritalStatus: teacherData.marital_status || '',
              salaryExpectation: teacherData.salary_expectation || '',
              housingAllowance: teacherData.housing_allowance || false,
              otherAllowances: teacherData.other_allowances || false,
              paymentMethod: teacherData.payment_method || '',
              bio: teacherData.bio || ''
            });

            // Check if application has been submitted
            const result = await firebase
              .from('teacher_applications')
              .select('*')
              .eq('teacher_id', user.id)
              .single();

            const { data: applicationData } = result;

            if (applicationData) {
              setApplicationStatus(applicationData.status || 'submitted');
              setSubmittedAt(applicationData.submitted_at);
            }
          }
        } catch (error) {
          console.error('Error loading teacher profile:', error);
        }
      }
    };

    loadTeacherProfile();
  }, [user, profile]);

  const handleSaveProfile = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to save your profile",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save the teacher profile without submitting application
      const updateResult = await firebase
        .from('teachers')
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          ...(formData.age && parseInt(formData.age) > 0 ? { age: parseInt(formData.age) } : {}),
          location: formData.location,
          experience_years: parseInt(formData.experience) || 0,
          teaching_level: formData.teachingLevel,
          subject_specialization: formData.subject,
          education_level: formData.qualification,
          marital_status: formData.maritalStatus,
          salary_expectation: formData.salaryExpectation,
          housing_allowance: formData.housingAllowance,
          other_allowances: formData.otherAllowances,
          payment_method: formData.paymentMethod,
          bio: formData.bio,
          status: 'draft', // Keep as draft when just saving
          last_updated: new Date().toISOString()
        });

      const { error: updateError } = updateResult;

      if (updateError) throw updateError;

      toast({
        title: "Profile Saved!",
        description: "Your profile has been saved successfully.",
      });

    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewProfile = () => {
    setShowPreview(true);
  };

  const handleSubmitApplication = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.teachingLevel ||
        !formData.subject || !formData.qualification || !formData.maritalStatus || !formData.paymentMethod) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First, update the teacher profile
      const updateResult = await firebase
        .from('teachers')
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          ...(formData.age && parseInt(formData.age) > 0 ? { age: parseInt(formData.age) } : {}),
          location: formData.location,
          experience_years: parseInt(formData.experience) || 0,
          teaching_level: formData.teachingLevel,
          subject_specialization: formData.subject,
          education_level: formData.qualification,
          marital_status: formData.maritalStatus,
          salary_expectation: formData.salaryExpectation,
          housing_allowance: formData.housingAllowance,
          other_allowances: formData.otherAllowances,
          payment_method: formData.paymentMethod,
          bio: formData.bio,
          status: 'pending',
          last_updated: new Date().toISOString()
        });

      const { error: updateError } = updateResult;

      if (updateError) throw updateError;

      // Create or update the application record
      const applicationData = {
        teacher_id: user.id,
        teacher_name: formData.fullName,
        teacher_email: formData.email,
        teacher_phone: formData.phone,
        teaching_level: formData.teachingLevel,
        subject_specialization: formData.subject,
        education_level: formData.qualification,
        marital_status: formData.maritalStatus,
        experience_years: parseInt(formData.experience) || 0,
        salary_expectation: formData.salaryExpectation,
        housing_allowance: formData.housingAllowance,
        other_allowances: formData.otherAllowances,
        payment_method: formData.paymentMethod,
        bio: formData.bio,
        location: formData.location,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        application_type: 'profile_submission'
      };

      const applicationResult = await firebase
        .from('teacher_applications')
        .upsert(applicationData);

      const { error: applicationError } = applicationResult;

      if (applicationError) throw applicationError;

      setApplicationStatus('submitted');
      setSubmittedAt(new Date().toISOString());

      toast({
        title: "Application Submitted!",
        description: "Your teacher application has been submitted to the admin for review.",
      });

    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Link to="/" className="hover:opacity-80 transition-opacity duration-200 group">
                  <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Teacher Portal</h1>
                </Link>
                {isAdmin && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Access
                  </Badge>
                )}
              </div>
              <Link to="/" className="hover:opacity-80 transition-opacity duration-200 group">
                <p className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200">
                  {isAdmin ? 'Admin access to teacher portal with data management capabilities' : 'Find your next teaching opportunity'} - MG Investments
                </p>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">Back to Home</Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                <Star className="h-4 w-4 mr-2" />
                Premium Access
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'Teacher'}! 👨‍🏫
                </h1>
                <p className="text-green-100 text-sm sm:text-base md:text-lg leading-relaxed">
                  {isAdmin ? 'Admin access to teacher portal with data management capabilities' : 'Find your next teaching opportunity and manage your career'}
                </p>
              </div>
              <div className="hidden md:block flex-shrink-0">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/5 rounded-full -translate-y-16 sm:-translate-y-24 md:-translate-y-32 translate-x-16 sm:translate-x-24 md:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-white/5 rounded-full translate-y-12 sm:translate-y-18 md:translate-y-24 -translate-x-12 sm:-translate-x-18 md:-translate-x-24"></div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-4'} gap-1 sm:gap-0 h-auto sm:h-10 p-1`}>
            <TabsTrigger value="profile" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="relative text-xs sm:text-sm py-2 sm:py-1.5">
              <div className="flex items-center justify-center">
                <span className="hidden sm:inline">Available Jobs</span>
                <span className="sm:hidden">Jobs</span>
                {!hasPremiumAccess && (
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-amber-500" />
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs sm:text-sm py-2 sm:py-1.5">
              <span className="hidden sm:inline">My Applications</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="relative text-xs sm:text-sm py-2 sm:py-1.5">
              <div className="flex items-center justify-center">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
                {unreadCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="data-import" className="text-red-700 text-xs sm:text-sm py-2 sm:py-1.5">
                  <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden lg:inline">Data Import</span>
                  <span className="lg:hidden">Import</span>
                </TabsTrigger>
                <TabsTrigger value="approvals" className="text-red-700 text-xs sm:text-sm py-2 sm:py-1.5">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden lg:inline">Approvals</span>
                  <span className="lg:hidden">Approve</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Teacher Profile</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Complete your profile to get matched with the best opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+256 700 000 000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="Kampala, Uganda"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Select onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="2-3">2-3 years</SelectItem>
                            <SelectItem value="4-5">4-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status *</Label>
                        <Select onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            {MARITAL_STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status.toLowerCase()}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="teachingLevel">Teaching Level *</Label>
                        <Select onValueChange={(value) => handleInputChange('teachingLevel', value)} value={formData.teachingLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teaching level" />
                          </SelectTrigger>
                          <SelectContent>
                            {TEACHING_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{level}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({SUBJECTS_BY_LEVEL[level]?.length || 0} subjects)
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject">
                          Teaching Subject *
                          {formData.teachingLevel && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({SUBJECTS_BY_LEVEL[formData.teachingLevel]?.length || 0} available)
                            </span>
                          )}
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange('subject', value)}
                          disabled={!formData.teachingLevel}
                          value={formData.subject}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              formData.teachingLevel
                                ? "Select your teaching subject"
                                : "Select teaching level first"
                            } />
                          </SelectTrigger>
                          <SelectContent className="max-h-[400px]">
                            {formData.teachingLevel && SUBJECTS_BY_LEVEL[formData.teachingLevel]?.map((subject, index) => (
                              <SelectItem key={subject} value={subject.toLowerCase()}>
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-400 mr-2 w-6">
                                    {(index + 1).toString().padStart(2, '0')}.
                                  </span>
                                  <span>{subject}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.teachingLevel && (
                          <p className="text-xs text-gray-500 mt-1">
                            ✅ Aligned with Uganda's {formData.teachingLevel} curriculum
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qualification">Highest Qualification *</Label>
                        <Select onValueChange={(value) => handleInputChange('qualification', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certificate">Certificate</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="salaryExpectation">Salary Expectation (UGX) *</Label>
                        <Input
                          id="salaryExpectation"
                          value={formData.salaryExpectation}
                          onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                          placeholder="800,000"
                        />
                      </div>
                    </div>

                    {/* Additional Priorities Section */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Additional Priorities</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="housingAllowance"
                            checked={formData.housingAllowance}
                            onCheckedChange={(checked) => handleInputChange('housingAllowance', checked as boolean)}
                          />
                          <Label htmlFor="housingAllowance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Housing Allowance
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="otherAllowances"
                            checked={formData.otherAllowances}
                            onCheckedChange={(checked) => handleInputChange('otherAllowances', checked as boolean)}
                          />
                          <Label htmlFor="otherAllowances" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Other Allowances
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Section */}
                    <div>
                      <Label htmlFor="paymentMethod">Preferred Payment Method *</Label>
                      <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method} value={method.toLowerCase()}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about your teaching experience, specializations, and what makes you a great educator..."
                        rows={4}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handlePreviewProfile}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Profile
                      </Button>

                      {/* Submit Application Button */}
                      {applicationStatus === 'draft' && (
                        <Button
                          onClick={handleSubmitApplication}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      )}

                      {applicationStatus === 'submitted' && (
                        <div className="flex items-center text-blue-600">
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Application Submitted</span>
                        </div>
                      )}

                      {applicationStatus === 'approved' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Application Approved</span>
                        </div>
                      )}

                      {applicationStatus === 'rejected' && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">Application Rejected</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Status */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profile Completion</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge className="bg-green-100 text-green-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Account Active (67 days left)
                        </Badge>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            Profile viewed 23 times
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Applications Sent</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Interviews Scheduled</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">School Interest</span>
                        <span className="font-medium">8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {hasPremiumAccess ? (
              <JobPostings />
            ) : (
              <LockedJobPostings userRole={profile?.role} />
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicationStatus === 'draft' ? (
                  <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                    <p className="text-gray-600 mb-4">Complete your profile and submit your application to get started</p>
                    <Button
                      onClick={() => document.querySelector('[value="profile"]')?.click()}
                      className="bg-gradient-to-r from-blue-600 to-teal-600"
                    >
                      Complete Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">Teacher Application</CardTitle>
                            <CardDescription>
                              General teaching position application
                            </CardDescription>
                          </div>
                          <Badge
                            className={
                              applicationStatus === 'submitted' ? 'bg-blue-100 text-blue-800' :
                              applicationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                              applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {applicationStatus === 'submitted' && <Clock className="h-3 w-3 mr-1" />}
                            {applicationStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {applicationStatus === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Subject:</span>
                            <span className="ml-2 text-gray-600">{formData.subject}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Experience:</span>
                            <span className="ml-2 text-gray-600">{formData.experience} years</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Qualification:</span>
                            <span className="ml-2 text-gray-600">{formData.qualification}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Location:</span>
                            <span className="ml-2 text-gray-600">{formData.location}</span>
                          </div>
                        </div>

                        {submittedAt && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              Submitted on {new Date(submittedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        )}

                        {applicationStatus === 'submitted' && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                              <div>
                                <h4 className="text-sm font-medium text-blue-800">Under Review</h4>
                                <p className="text-sm text-blue-600 mt-1">
                                  Your application is being reviewed by our admin team. You'll be notified once a decision is made.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {applicationStatus === 'approved' && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                              <div>
                                <h4 className="text-sm font-medium text-green-800">Application Approved!</h4>
                                <p className="text-sm text-green-600 mt-1">
                                  Congratulations! Your application has been approved. You can now apply for specific job positions.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {applicationStatus === 'rejected' && (
                          <div className="mt-4 p-3 bg-red-50 rounded-lg">
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                              <div>
                                <h4 className="text-sm font-medium text-red-800">Application Needs Review</h4>
                                <p className="text-sm text-red-600 mt-1">
                                  Your application requires some updates. Please review your profile and resubmit.
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2 border-red-200 text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setApplicationStatus('draft');
                                    document.querySelector('[value="profile"]')?.click();
                                  }}
                                >
                                  Update Profile
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationPanel />
          </TabsContent>

          {/* Admin-only tabs */}
          {isAdmin && (
            <>
              <TabsContent value="data-import" className="space-y-6">
                <AdminDataImport />

                {/* Test Subscription Toggle (Admin Only) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700">🧪 Test Subscription System</CardTitle>
                    <CardDescription>
                      Test the subscription paywall functionality (Admin only)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Current Status: <Badge variant={hasPremiumAccess ? "default" : "secondary"}>
                            {subscriptionStatus.toUpperCase()}
                          </Badge>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hasPremiumAccess ? "Jobs are unlocked" : "Jobs are locked"}
                        </p>
                      </div>
                      <Button
                        onClick={handleTestSubscription}
                        variant={hasPremiumAccess ? "destructive" : "default"}
                        size="sm"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        {hasPremiumAccess ? "Test Free Mode" : "Test Premium Mode"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approvals" className="space-y-6">
                <DataApprovalWorkflow />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Profile Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Profile Preview
            </DialogTitle>
            <DialogDescription>
              This is how your profile will appear to schools and administrators
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{formData.fullName || 'Your Name'}</h2>
                  <p className="text-lg text-gray-600">{formData.subject || 'Subject'} Teacher</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.location || 'Location'}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {formData.experience || '0'} years experience
                </Badge>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{formData.phone || 'Phone number'}</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{formData.email || 'Email address'}</span>
                  </div>
                  {formData.age && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{formData.age} years old</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qualifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Education Level</Label>
                    <p className="text-sm text-gray-600">{formData.qualification || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Subject Specialization</Label>
                    <p className="text-sm text-gray-600">{formData.subject || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Salary Expectation</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-600">{formData.salaryExpectation || 'Not specified'} UGX</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio Section */}
            {formData.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Professional Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {formData.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false);
                  handleSaveProfile();
                }}
                className="bg-gradient-to-r from-blue-600 to-teal-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Popup */}
      <NotificationPopup />

      {/* Scroll to Top Component */}
      <ScrollToTop showHomeButton={true} />
    </div>
  );
};

export default TeacherPortal;
