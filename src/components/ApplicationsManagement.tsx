import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  School, 
  Calendar, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobApplication {
  id: string;
  teacher_name: string;
  teacher_email: string;
  teacher_phone: string;
  job_title: string;
  school_name: string;
  subject: string;
  applied_date: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'hired';
  cover_letter: string;
  experience_years: number;
  education_level: string;
  salary_expectation: string;
  cv_url?: string;
  teacher_id: string;
  job_id: string;
}

const ApplicationsManagement: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockApplications: JobApplication[] = [
    {
      id: '1',
      teacher_name: 'Sarah Nakamya',
      teacher_email: 'sarah.nakamya@email.com',
      teacher_phone: '+256701234567',
      job_title: 'Mathematics Teacher',
      school_name: 'Kampala International School',
      subject: 'Mathematics',
      applied_date: '2024-01-20',
      status: 'pending',
      cover_letter: 'I am excited to apply for the Mathematics teacher position...',
      experience_years: 5,
      education_level: 'Bachelor\'s Degree',
      salary_expectation: '1,000,000 UGX',
      teacher_id: 'teacher_1',
      job_id: 'job_1'
    },
    {
      id: '2',
      teacher_name: 'John Ssali',
      teacher_email: 'john.ssali@email.com',
      teacher_phone: '+256702345678',
      job_title: 'English Literature Teacher',
      school_name: 'St. Mary\'s College',
      subject: 'English',
      applied_date: '2024-01-22',
      status: 'reviewed',
      cover_letter: 'With my passion for English literature and 7 years of experience...',
      experience_years: 7,
      education_level: 'Master\'s Degree',
      salary_expectation: '1,200,000 UGX',
      teacher_id: 'teacher_2',
      job_id: 'job_2'
    },
    {
      id: '3',
      teacher_name: 'Grace Achieng',
      teacher_email: 'grace.achieng@email.com',
      teacher_phone: '+256703456789',
      job_title: 'Science Teacher',
      school_name: 'Makerere College School',
      subject: 'Science',
      applied_date: '2024-01-25',
      status: 'approved',
      cover_letter: 'I bring extensive laboratory experience and innovative teaching methods...',
      experience_years: 4,
      education_level: 'Bachelor\'s Degree',
      salary_expectation: '950,000 UGX',
      teacher_id: 'teacher_3',
      job_id: 'job_3'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.school_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(app => app.subject === subjectFilter);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, subjectFilter, applications]);

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus as any } : app
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Application status changed to ${newStatus}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'hired': return <User className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    hired: applications.filter(app => app.status === 'hired').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(status)}
              </div>
              <div className="text-2xl font-bold text-orange-600">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-orange-600" />
            Application Management
          </CardTitle>
          <CardDescription>
            Review and manage teacher applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{application.teacher_name}</CardTitle>
                  <CardDescription>
                    Applied for {application.job_title} at {application.school_name}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusIcon(application.status)}
                  <span className="ml-1 capitalize">{application.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {application.teacher_email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {application.teacher_phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(application.applied_date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {application.experience_years} years exp.
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Cover Letter:</h4>
                <p className="text-sm text-gray-700 line-clamp-2">{application.cover_letter}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{application.education_level}</Badge>
                  <Badge variant="outline">{application.salary_expectation}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Select 
                    value={application.status} 
                    onValueChange={(value) => handleStatusChange(application.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">No applications match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationsManagement;
