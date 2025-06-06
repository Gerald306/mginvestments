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
  Phone,
  UserCheck,
  MessageSquare,
  Edit,
  FileText,
  MapPin,
  GraduationCap,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

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

  const handleAdminAction = async (applicationId: string, action: 'approve' | 'reject' | 'hire', notes?: string) => {
    try {
      // Here you would typically make an API call to update the application status
      const statusMap = {
        'approve': 'approved',
        'reject': 'rejected',
        'hire': 'hired'
      };

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? {
            ...app,
            status: statusMap[action] as any,
            admin_notes: notes,
            reviewed_by: profile?.full_name || 'Admin',
            reviewed_at: new Date().toISOString()
          } : app
        )
      );

      toast({
        title: `Application ${action}d!`,
        description: `The application has been ${action}d successfully.`,
      });

      setActionNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} application. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(application)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>

                  {isAdmin && application.status === 'pending' && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Application</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve {application.teacher_name}'s application for {application.job_title}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="approve-notes">Notes (optional)</Label>
                            <Textarea
                              id="approve-notes"
                              placeholder="Add any notes about this approval..."
                              value={actionNotes}
                              onChange={(e) => setActionNotes(e.target.value)}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAdminAction(application.id, 'approve', actionNotes)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Application</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject {application.teacher_name}'s application for {application.job_title}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="reject-notes">Reason for rejection</Label>
                            <Textarea
                              id="reject-notes"
                              placeholder="Please provide a reason for rejection..."
                              value={actionNotes}
                              onChange={(e) => setActionNotes(e.target.value)}
                              required
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleAdminAction(application.id, 'reject', actionNotes)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {isAdmin && application.status === 'approved' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Mark as Hired
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mark as Hired</AlertDialogTitle>
                          <AlertDialogDescription>
                            Confirm that {application.teacher_name} has been hired for {application.job_title} at {application.school_name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="hire-notes">Hiring details (optional)</Label>
                          <Textarea
                            id="hire-notes"
                            placeholder="Add any hiring details..."
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAdminAction(application.id, 'hire', actionNotes)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Mark as Hired
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {!isAdmin && (
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
                  )}
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

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Application Details</DialogTitle>
            <DialogDescription>
              Complete information about the teacher application
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Teacher Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Teacher Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{selectedApplication.teacher_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{selectedApplication.teacher_email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedApplication.teacher_phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Experience:</span>
                      <span className="ml-2">{selectedApplication.experience_years} years</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Education:</span>
                      <span className="ml-2">{selectedApplication.education_level}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Salary Expectation:</span>
                      <span className="ml-2">{selectedApplication.salary_expectation}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <School className="h-5 w-5 mr-2" />
                      Job Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Position:</span>
                      <span className="ml-2">{selectedApplication.job_title}</span>
                    </div>
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">School:</span>
                      <span className="ml-2">{selectedApplication.school_name}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Subject:</span>
                      <span className="ml-2">{selectedApplication.subject}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Applied Date:</span>
                      <span className="ml-2">{new Date(selectedApplication.applied_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        <span className="ml-1 capitalize">{selectedApplication.status}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{selectedApplication.cover_letter}</p>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Edit className="h-5 w-5 mr-2" />
                      Admin Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      {selectedApplication.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => {
                              handleAdminAction(selectedApplication.id, 'approve');
                              setShowDetailsDialog(false);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Application
                          </Button>
                          <Button
                            onClick={() => {
                              handleAdminAction(selectedApplication.id, 'reject');
                              setShowDetailsDialog(false);
                            }}
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Application
                          </Button>
                        </>
                      )}
                      {selectedApplication.status === 'approved' && (
                        <Button
                          onClick={() => {
                            handleAdminAction(selectedApplication.id, 'hire');
                            setShowDetailsDialog(false);
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Mark as Hired
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManagement;
