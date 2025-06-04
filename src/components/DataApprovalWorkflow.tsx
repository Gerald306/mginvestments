import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Building2, 
  Briefcase,
  Eye,
  Filter,
  Search,
  Globe,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { DataImportService } from '@/services/dataImportService';
import { DataApprovalRequest, BulkApprovalAction } from '@/types/dataImport';

const DataApprovalWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingApprovals, setPendingApprovals] = useState<DataApprovalRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'teachers' | 'schools' | 'jobs'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    loadPendingApprovals();
  }, [filterType]);

  const loadPendingApprovals = async () => {
    setLoading(true);
    try {
      const approvals = await DataImportService.getPendingApprovals(
        filterType === 'all' ? undefined : filterType
      );
      setPendingApprovals(approvals);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending approvals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSingleApproval = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await DataImportService.processApproval(
        requestId, 
        action, 
        profile?.id || 'unknown',
        reviewNotes
      );
      
      toast({
        title: `${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        description: `Record has been ${action}d successfully.`,
      });
      
      await loadPendingApprovals();
      setReviewNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} record`,
        variant: "destructive",
      });
    }
  };

  const handleBulkApproval = async (action: 'approve' | 'reject') => {
    if (selectedRequests.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select records to process",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const requestId of selectedRequests) {
        await DataImportService.processApproval(
          requestId, 
          action, 
          profile?.id || 'unknown',
          reviewNotes
        );
      }
      
      toast({
        title: `Bulk ${action === 'approve' ? 'Approval' : 'Rejection'} Complete!`,
        description: `${selectedRequests.length} records have been ${action}d.`,
      });
      
      setSelectedRequests([]);
      await loadPendingApprovals();
      setReviewNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process bulk ${action}`,
        variant: "destructive",
      });
    }
  };

  const handlePublishToWebsite = async () => {
    try {
      // Simulate publishing approved data to website
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Published Successfully!",
        description: "Approved data has been published to the website.",
      });
      
      setShowPublishDialog(false);
    } catch (error) {
      toast({
        title: "Publishing Error",
        description: "Failed to publish data to website",
        variant: "destructive",
      });
    }
  };

  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(approval.data).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teachers': return <Users className="h-4 w-4" />;
      case 'schools': return <Building2 className="h-4 w-4" />;
      case 'jobs': return <Briefcase className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'teachers': return 'bg-blue-100 text-blue-800';
      case 'schools': return 'bg-green-100 text-green-800';
      case 'jobs': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDataPreview = (data: any, type: string) => {
    switch (type) {
      case 'teachers':
        return (
          <div className="space-y-2">
            <div><strong>Name:</strong> {data.full_name}</div>
            <div><strong>Email:</strong> {data.email}</div>
            <div><strong>Subject:</strong> {data.subject}</div>
            <div><strong>Experience:</strong> {data.experience_years} years</div>
            <div><strong>Location:</strong> {data.location}</div>
          </div>
        );
      case 'schools':
        return (
          <div className="space-y-2">
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Email:</strong> {data.email}</div>
            <div><strong>Type:</strong> {data.type}</div>
            <div><strong>Location:</strong> {data.location}</div>
            <div><strong>Plan:</strong> {data.subscription_plan}</div>
          </div>
        );
      case 'jobs':
        return (
          <div className="space-y-2">
            <div><strong>Title:</strong> {data.title}</div>
            <div><strong>School:</strong> {data.school_name}</div>
            <div><strong>Subject:</strong> {data.subject}</div>
            <div><strong>Type:</strong> {data.employment_type}</div>
            <div><strong>Salary:</strong> {data.salary_range}</div>
          </div>
        );
      default:
        return <div>No preview available</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Approval Workflow</h2>
          <p className="text-gray-600">Review and approve imported data before publishing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {filteredApprovals.length} Pending
          </Badge>
          <Button 
            onClick={() => setShowPublishDialog(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Globe className="h-4 w-4 mr-2" />
            Publish to Website
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type Filter</label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="schools">Schools</SelectItem>
                  <SelectItem value="jobs">Job Postings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Bulk Actions</label>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => handleBulkApproval('approve')}
                  disabled={selectedRequests.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve Selected
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkApproval('reject')}
                  disabled={selectedRequests.length === 0}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject Selected
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Review Notes</CardTitle>
          <CardDescription>Add notes for approval/rejection decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter review notes (optional)..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading approvals...</p>
            </CardContent>
          </Card>
        ) : filteredApprovals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending approvals at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          filteredApprovals.map((approval) => (
            <Card key={approval.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedRequests.includes(approval.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRequests([...selectedRequests, approval.id]);
                        } else {
                          setSelectedRequests(selectedRequests.filter(id => id !== approval.id));
                        }
                      }}
                    />
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        {getTypeIcon(approval.type)}
                        <span className="ml-2">
                          {approval.type === 'teachers' ? (approval.data as any).full_name :
                           approval.type === 'schools' ? (approval.data as any).name :
                           (approval.data as any).title}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Requested by {approval.requested_by} • {new Date(approval.request_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getTypeColor(approval.type)}>
                    {getTypeIcon(approval.type)}
                    <span className="ml-1 capitalize">{approval.type}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Data Preview</h4>
                    {renderDataPreview(approval.data, approval.type)}
                  </div>
                  <div className="flex flex-col justify-end space-y-2">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSingleApproval(approval.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleSingleApproval(approval.id, 'reject')}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Publish Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Publish to Website
              </CardTitle>
              <CardDescription>
                This will make all approved data visible on the public website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-800">
                    This action will update the live website
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPublishDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePublishToWebsite}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Publish Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataApprovalWorkflow;
