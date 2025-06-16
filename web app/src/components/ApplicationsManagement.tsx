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
import { firebase } from '@/integrations/firebase/client';
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
    const fetchApplications = async () => {
      try {
        // Fetch teacher applications from the database
        const result = await firebase
          .from('teacher_applications')
          .select('*')
          .order('submitted_at', { ascending: false });

        const { data: teacherApplications, error } = result;

        if (error) {
          console.error('Error fetching teacher applications:', error);
          // Fall back to mock data if table doesn't exist yet
          setApplications(mockApplications);
          setFilteredApplications(mockApplications);
          setLoading(false);
          return;
        }

        // Transform teacher applications to match the JobApplication interface
        const transformedApplications: JobApplication[] = (teacherApplications || []).map(app => ({
          id: app.id || app.teacher_id,
          teacher_name: app.teacher_name,
          teacher_email: app.teacher_email,
          teacher_phone: app.teacher_phone || '',
          job_title: `${app.subject_specialization} Teacher`,
          school_name: 'General Application',
          subject: app.subject_specialization,
          applied_date: app.submitted_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          status: app.status as any,
          cover_letter: app.bio || 'No cover letter provided',
          experience_years: app.experience_years || 0,
          education_level: app.education_level,
          salary_expectation: app.salary_expectation || 'Not specified',
          teacher_id: app.teacher_id,
          job_id: 'general_application'
        }));

        // Combine with mock applications for now
        const allApplications = [...transformedApplications, ...mockApplications];
        setApplications(allApplications);
        setFilteredApplications(allApplications);

      } catch (error) {
        console.error('Error in fetchApplications:', error);
        // Fall back to mock data
        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
      const statusMap = {
        'approve': 'approved',
        'reject': 'rejected',
        'hire': 'hired'
      };

      // Update in database if it's a teacher application
      const application = applications.find(app => app.id === applicationId);

      if (application && application.job_id === 'general_application') {
        // First, find the teacher application document by teacher_id
        const findResult = await firebase
          .from('teacher_applications')
          .select('*')
          .eq('teacher_id', application.teacher_id)
          .single();

        if (findResult.data && !findResult.error) {
          // Update the teacher application using the document ID
          const updateResult = await firebase
            .from('teacher_applications')
            .update(findResult.data.id, {
              status: statusMap[action],
              admin_notes: notes,
              reviewed_by: profile?.full_name || 'Admin',
              reviewed_at: new Date().toISOString()
            });

          if (updateResult.error) {
            console.error('Error updating application in database:', updateResult.error);
            throw updateResult.error;
          }

          // Also update the teacher's status in the teachers table if teacher_id exists
          if (application.teacher_id) {
            const teacherUpdateResult = await firebase
              .from('teachers')
              .update(application.teacher_id, { status: statusMap[action] });

            if (teacherUpdateResult.error) {
              console.error('Error updating teacher status:', teacherUpdateResult.error);
              // Don't throw error for teacher update failure, just log it
              console.warn('Teacher status update failed, but application status was updated successfully');
            }
          }
        }
        // If no Firebase data found, it might be mock data - we'll still update local state
      }

      // Update local state
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
      console.error('Error in handleAdminAction:', error);
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
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg truncate">{application.teacher_name}</CardTitle>
                  <CardDescription className="text-sm">
                    Applied for {application.job_title} at {application.school_name}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(application.status)} flex-shrink-0 justify-center`}>
                  {getStatusIcon(application.status)}
                  <span className="ml-1 capitalize">{application.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600 truncate">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{application.teacher_email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{application.teacher_phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{new Date(application.applied_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{application.experience_years} years exp.</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Cover Letter:</h4>
                <p className="text-sm text-gray-700 line-clamp-2">{application.cover_letter}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{application.education_level}</Badge>
                  <Badge variant="outline" className="text-xs">{application.salary_expectation}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(application)}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                  </Button>

                  {isAdmin && application.status === 'pending' && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Approve</span>
                            <span className="sm:hidden">Approve</span>
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
                          <Button size="sm" variant="destructive" className="w-full sm:w-auto">
                            <XCircle className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Reject</span>
                            <span className="sm:hidden">Reject</span>
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
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                          <UserCheck className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Mark as Hired</span>
                          <span className="sm:hidden">Hire</span>
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
