
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, MapPin, DollarSign, Users, Star, Eye, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const SchoolPortal = () => {
  const [jobForm, setJobForm] = useState({
    position: '',
    subject: '',
    level: '',
    salary: '',
    description: '',
    requirements: ''
  });

  const teachers = [
    {
      id: 1,
      name: "Sarah Nakamya",
      subject: "Mathematics",
      experience: "5 years",
      qualification: "Bachelor's Degree",
      rating: 4.8,
      views: 12,
      lastActive: "2 hours ago",
      salaryExpectation: "800,000 - 1,200,000 UGX",
      isRestricted: true
    },
    {
      id: 2,
      name: "John Ssali",
      subject: "Physics",
      experience: "8 years",
      qualification: "Master's Degree",
      rating: 4.9,
      views: 8,
      lastActive: "1 day ago",
      salaryExpectation: "1,000,000 - 1,500,000 UGX",
      isRestricted: true
    },
    {
      id: 3,
      name: "Mary Tendo",
      subject: "English",
      experience: "3 years",
      qualification: "Bachelor's Degree",
      rating: 4.7,
      views: 15,
      lastActive: "30 minutes ago",
      salaryExpectation: "600,000 - 900,000 UGX",
      isRestricted: true
    }
  ];

  const myJobs = [
    {
      id: 1,
      position: "Mathematics Teacher",
      level: "Secondary",
      applicants: 12,
      posted: "3 days ago",
      status: "active",
      views: 89
    },
    {
      id: 2,
      position: "Physics Teacher",
      level: "Secondary",
      applicants: 8,
      posted: "1 week ago",
      status: "active",
      views: 67
    }
  ];

  const handleJobFormChange = (field: string, value: string) => {
    setJobForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Portal</h1>
              <p className="text-gray-600">Find and hire qualified teachers</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">Back to Home</Button>
              </Link>
              <Link to="/subscription">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                  <Star className="h-4 w-4 mr-2" />
                  Get Premium Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="teachers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teachers">Browse Teachers</TabsTrigger>
            <TabsTrigger value="jobs">My Job Posts</TabsTrigger>
            <TabsTrigger value="post-job">Post New Job</TabsTrigger>
          </TabsList>

          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Available Teachers</h2>
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
                    <SelectValue placeholder="Experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience</SelectItem>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{teacher.rating}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Subject: <span className="font-medium">{teacher.subject}</span></p>
                              <p className="text-sm text-gray-600">Experience: <span className="font-medium">{teacher.experience}</span></p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Qualification: <span className="font-medium">{teacher.qualification}</span></p>
                              <p className="text-sm text-gray-600">Last Active: <span className="font-medium">{teacher.lastActive}</span></p>
                            </div>
                          </div>
                          {teacher.isRestricted ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                <strong>Limited Information:</strong> Contact details, location, and detailed experience are hidden. 
                                Subscribe to premium access for full teacher profiles.
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600 mb-3">
                              <p>Salary Expectation: {teacher.salaryExpectation}</p>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {teacher.views} views
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {teacher.isRestricted ? (
                          <Link to="/subscription">
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                              View Full Details
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                            Contact Teacher
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium Access CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unlock Full Teacher Profiles
                </h3>
                <p className="text-gray-600 mb-4">
                  Get access to contact information, detailed experience, location, and direct communication with teachers.
                </p>
                <Link to="/subscription">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                    Subscribe Now - Premium Access
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Job Posts</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>

            <div className="grid gap-6">
              {myJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
                          <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>{job.level} Level</span>
                          <span>•</span>
                          <span>{job.applicants} applicants</span>
                          <span>•</span>
                          <span>{job.views} views</span>
                          <span>•</span>
                          <span>Posted {job.posted}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Applicants
                        </Button>
                        <Button size="sm">
                          Edit Job
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="post-job" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post New Teaching Position</CardTitle>
                <CardDescription>
                  Create a job posting to attract qualified teachers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position Title *</Label>
                    <Input
                      id="position"
                      value={jobForm.position}
                      onChange={(e) => handleJobFormChange('position', e.target.value)}
                      placeholder="e.g., Mathematics Teacher"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject/Area *</Label>
                    <Select onValueChange={(value) => handleJobFormChange('subject', value)}>
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Education Level *</Label>
                    <Select onValueChange={(value) => handleJobFormChange('level', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="salary">Salary Range (UGX) *</Label>
                    <Input
                      id="salary"
                      value={jobForm.salary}
                      onChange={(e) => handleJobFormChange('salary', e.target.value)}
                      placeholder="e.g., 800,000 - 1,200,000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={jobForm.description}
                    onChange={(e) => handleJobFormChange('description', e.target.value)}
                    placeholder="Describe the position, responsibilities, and what you're looking for in a candidate..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={jobForm.requirements}
                    onChange={(e) => handleJobFormChange('requirements', e.target.value)}
                    placeholder="List the qualifications, experience, and skills required for this position..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                    Post Job
                  </Button>
                  <Button variant="outline">
                    Save as Draft
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

export default SchoolPortal;
