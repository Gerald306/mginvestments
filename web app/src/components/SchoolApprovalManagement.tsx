import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  School, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  FileText,
  Edit,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface SchoolApproval {
  id: string;
  school_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  school_type: string;
  description: string;
  established_year: string;
  total_teachers: number;
  website?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_date: string;
  documents: string[];
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

const SchoolApprovalManagement: React.FC = () => {
  const [schoolApprovals, setSchoolApprovals] = useState<SchoolApproval[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<SchoolApproval[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolApproval | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  // Mock data for demonstration
  const mockSchoolApprovals: SchoolApproval[] = [
    {
      id: '1',
      school_name: 'Kampala International Academy',
      contact_person: 'Dr. Sarah Mukasa',
      email: 'admin@kia.ac.ug',
      phone: '+256701234567',
      location: 'Kampala, Uganda',
      school_type: 'International School',
      description: 'A leading international school offering Cambridge curriculum from nursery to A-levels.',
      established_year: '2010',
      total_teachers: 45,
      website: 'https://kia.ac.ug',
      status: 'pending',
      submitted_date: '2024-01-20',
      documents: ['Registration Certificate', 'Tax Clearance', 'Academic License']
    },
    {
      id: '2',
      school_name: 'St. Mary\'s Secondary School',
      contact_person: 'Mr. John Okello',
      email: 'info@stmarys.ug',
      phone: '+256702345678',
      location: 'Entebbe, Uganda',
      school_type: 'Government Aided',
      description: 'A well-established secondary school with excellent academic performance.',
      established_year: '1985',
      total_teachers: 32,
      status: 'pending',
      submitted_date: '2024-01-22',
      documents: ['Registration Certificate', 'Ministry Approval']
    },
    {
      id: '3',
      school_name: 'Mbarara High School',
      contact_person: 'Mrs. Grace Atuhaire',
      email: 'principal@mbarahs.ug',
      phone: '+256703456789',
      location: 'Mbarara, Uganda',
      school_type: 'Private',
      description: 'A modern private school focusing on science and technology education.',
      established_year: '2015',
      total_teachers: 28,
      website: 'https://mbarahs.ug',
      status: 'approved',
      submitted_date: '2024-01-18',
      documents: ['Registration Certificate', 'Tax Clearance', 'Academic License'],
      admin_notes: 'Excellent documentation and facilities.',
      reviewed_by: 'Admin User',
      reviewed_at: '2024-01-25'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchoolApprovals(mockSchoolApprovals);
      setFilteredApprovals(mockSchoolApprovals);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = schoolApprovals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(school => 
        school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(school => school.status === statusFilter);
    }

    setFilteredApprovals(filtered);
  }, [searchTerm, statusFilter, schoolApprovals]);

  const handleApprovalAction = async (schoolId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      setSchoolApprovals(prev => 
        prev.map(school => 
          school.id === schoolId ? {
            ...school,
            status: action === 'approve' ? 'approved' : 'rejected',
            admin_notes: notes,
            reviewed_by: profile?.full_name || 'Admin',
            reviewed_at: new Date().toISOString()
          } : school
        )
      );

      toast({
        title: `School ${action}d!`,
        description: `${action === 'approve' ? 'School has been approved and can now post jobs.' : 'School application has been rejected.'}`,
      });

      setActionNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} school application.`,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (school: SchoolApproval) => {
    setSelectedSchool(school);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const statusCounts = {
    pending: schoolApprovals.filter(school => school.status === 'pending').length,
    approved: schoolApprovals.filter(school => school.status === 'approved').length,
    rejected: schoolApprovals.filter(school => school.status === 'rejected').length,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <School className="h-5 w-5 mr-2 text-orange-600" />
            School Approval Management
          </CardTitle>
          <CardDescription>
            Review and approve school registration applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search schools..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* School Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((school) => (
          <Card key={school.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{school.school_name}</CardTitle>
                  <CardDescription>
                    Contact: {school.contact_person} • {school.school_type}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(school.status)}>
                  {getStatusIcon(school.status)}
                  <span className="ml-1 capitalize">{school.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {school.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {school.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {school.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {school.total_teachers} teachers
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">{school.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Est. {school.established_year}</Badge>
                  <Badge variant="outline">{school.documents.length} documents</Badge>
                  {school.website && (
                    <Badge variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      Website
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(school)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {school.status === 'pending' && (
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
                            <AlertDialogTitle>Approve School</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve {school.school_name}? This will allow them to post job openings.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-2">
                            <Label htmlFor="approve-notes">Approval notes (optional)</Label>
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
                              onClick={() => handleApprovalAction(school.id, 'approve', actionNotes)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve School
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
                            <AlertDialogTitle>Reject School Application</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject {school.school_name}'s application?
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
                              onClick={() => handleApprovalAction(school.id, 'reject', actionNotes)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Reject Application
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApprovals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No school applications found</h3>
            <p className="text-gray-600">No applications match your current filters.</p>
          </CardContent>
        </Card>
      )}

      {/* School Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">School Application Details</DialogTitle>
            <DialogDescription>
              Complete information about the school registration application
            </DialogDescription>
          </DialogHeader>
          
          {selectedSchool && (
            <div className="space-y-6">
              {/* School Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <School className="h-5 w-5 mr-2" />
                      School Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-medium">Name:</span>
                      <span className="ml-2">{selectedSchool.school_name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Type:</span>
                      <span className="ml-2">{selectedSchool.school_type}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Established:</span>
                      <span className="ml-2">{selectedSchool.established_year}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Total Teachers:</span>
                      <span className="ml-2">{selectedSchool.total_teachers}</span>
                    </div>
                    {selectedSchool.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedSchool.website}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <span className="font-medium">Contact Person:</span>
                      <span className="ml-2">{selectedSchool.contact_person}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="ml-2">{selectedSchool.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="ml-2">{selectedSchool.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="ml-2">{selectedSchool.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="ml-2">Applied: {new Date(selectedSchool.submitted_date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    School Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{selectedSchool.description}</p>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Submitted Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSchool.documents.map((doc, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              {selectedSchool.status === 'pending' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Edit className="h-5 w-5 mr-2" />
                      Admin Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Button 
                        onClick={() => {
                          handleApprovalAction(selectedSchool.id, 'approve');
                          setShowDetailsDialog(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve School
                      </Button>
                      <Button 
                        onClick={() => {
                          handleApprovalAction(selectedSchool.id, 'reject');
                          setShowDetailsDialog(false);
                        }}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Application
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Information */}
              {selectedSchool.status !== 'pending' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedSchool.status)}`}>
                        {selectedSchool.status}
                      </Badge>
                    </div>
                    {selectedSchool.reviewed_by && (
                      <div>
                        <span className="font-medium">Reviewed by:</span>
                        <span className="ml-2">{selectedSchool.reviewed_by}</span>
                      </div>
                    )}
                    {selectedSchool.reviewed_at && (
                      <div>
                        <span className="font-medium">Reviewed on:</span>
                        <span className="ml-2">{new Date(selectedSchool.reviewed_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedSchool.admin_notes && (
                      <div>
                        <span className="font-medium">Admin Notes:</span>
                        <p className="mt-1 text-gray-700">{selectedSchool.admin_notes}</p>
                      </div>
                    )}
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

export default SchoolApprovalManagement;
