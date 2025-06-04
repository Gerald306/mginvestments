
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, MapPin, Phone, DollarSign, Calendar, Eye, Star, Building2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const TeacherPortal = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Portal</h1>
              <p className="text-gray-600">Find your next teaching opportunity</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">Back to Home</Button>
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                <Star className="h-4 w-4 mr-2" />
                Premium Access
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
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

                    <div className="flex gap-4">
                      <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                        Save Profile
                      </Button>
                      <Button variant="outline">
                        Preview Profile
                      </Button>
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Available Positions</h2>
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="kampala">Kampala</SelectItem>
                    <SelectItem value="entebbe">Entebbe</SelectItem>
                    <SelectItem value="mukono">Mukono</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6">
              {jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
                          {job.urgent && (
                            <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-1" />
                            {job.school}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{job.type} Level</span>
                          <span>•</span>
                          <span>Posted {job.posted}</span>
                          <span>•</span>
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to teaching positions to see them here</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                    Browse Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherPortal;
