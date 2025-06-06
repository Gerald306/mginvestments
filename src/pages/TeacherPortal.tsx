
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, MapPin, Phone, DollarSign, Calendar, Eye, Star, Building2, Clock, Shield, Database, CheckCircle, Send, FileText, AlertCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import JobPostings from '@/components/JobPostings';
import { useAuth } from '@/contexts/AuthContext';
import AdminDataImport from '@/components/AdminDataImport';
import DataApprovalWorkflow from '@/components/DataApprovalWorkflow';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const TeacherPortal = () => {
  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const isAdmin = profile?.role === 'admin';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    location: '',
    experience: '',
    subject: '',
    qualification: '',
    salaryExpectation: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'draft' | 'submitted' | 'approved' | 'rejected'>('draft');
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Load existing teacher profile data
  useEffect(() => {
    const loadTeacherProfile = async () => {
      if (user && profile?.role === 'teacher') {
        try {
          const { data: teacherData, error } = await supabase
            .from('teachers')
            .select('*')
            .eq('id', user.id)
            .single();

          if (teacherData && !error) {
            setFormData({
              fullName: teacherData.full_name || '',
              email: teacherData.email || '',
              phone: teacherData.phone_number || '',
              age: teacherData.age?.toString() || '',
              location: teacherData.location || '',
              experience: teacherData.experience_years?.toString() || '',
              subject: teacherData.subject_specialization || '',
              qualification: teacherData.education_level || '',
              salaryExpectation: teacherData.salary_expectation || '',
              bio: teacherData.bio || ''
            });

            // Check if application has been submitted
            const { data: applicationData } = await supabase
              .from('teacher_applications')
              .select('*')
              .eq('teacher_id', user.id)
              .single();

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
    if (!formData.fullName || !formData.email || !formData.subject || !formData.qualification) {
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
      const { error: updateError } = await supabase
        .from('teachers')
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          age: parseInt(formData.age) || null,
          location: formData.location,
          experience_years: parseInt(formData.experience) || 0,
          subject_specialization: formData.subject,
          education_level: formData.qualification,
          salary_expectation: formData.salaryExpectation,
          bio: formData.bio,
          status: 'pending',
          last_updated: new Date().toISOString()
        });

      if (updateError) throw updateError;

      // Create or update the application record
      const applicationData = {
        teacher_id: user.id,
        teacher_name: formData.fullName,
        teacher_email: formData.email,
        teacher_phone: formData.phone,
        subject_specialization: formData.subject,
        education_level: formData.qualification,
        experience_years: parseInt(formData.experience) || 0,
        salary_expectation: formData.salaryExpectation,
        bio: formData.bio,
        location: formData.location,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        application_type: 'profile_submission'
      };

      const { error: applicationError } = await supabase
        .from('teacher_applications')
        .upsert(applicationData);

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
                <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
                {isAdmin && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Access
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">
                {isAdmin ? 'Admin access to teacher portal with data management capabilities' : 'Find your next teaching opportunity'}
              </p>
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
                onClick={signOut}
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
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="data-import" className="text-red-700">
                  <Database className="h-4 w-4 mr-1" />
                  Data Import
                </TabsTrigger>
                <TabsTrigger value="approvals" className="text-red-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approvals
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Profile</CardTitle>
                    <CardDescription>
                      Complete your profile to get matched with the best opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
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
                        <Label htmlFor="salaryExpectation">Salary Expectation (UGX) *</Label>
                        <Input
                          id="salaryExpectation"
                          value={formData.salaryExpectation}
                          onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
                          placeholder="800,000"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Teaching Subject *</Label>
                        <Select onValueChange={(value) => handleInputChange('subject', value)}>
                          <SelectTrigger>
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
                      <div>
                        <Label htmlFor="qualification">Highest Qualification *</Label>
                        <Select onValueChange={(value) => handleInputChange('qualification', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                      <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                        Save Profile
                      </Button>
                      <Button variant="outline">
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
            <JobPostings />
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

          {/* Admin-only tabs */}
          {isAdmin && (
            <>
              <TabsContent value="data-import" className="space-y-6">
                <AdminDataImport />
              </TabsContent>

              <TabsContent value="approvals" className="space-y-6">
                <DataApprovalWorkflow />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherPortal;
