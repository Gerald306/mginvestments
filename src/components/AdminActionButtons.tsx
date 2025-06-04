import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Send, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Users, 
  Globe,
  Download,
  Calendar,
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeData } from '@/contexts/RealTimeDataContext';

const AdminActionButtons: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();
  const { stats, getExpiringAccounts, teachers, updateTeacherFeatured } = useRealTimeData();

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    recipients: 'all' as 'all' | 'teachers' | 'schools'
  });

  const [reportForm, setReportForm] = useState({
    type: 'teachers' as 'teachers' | 'schools' | 'applications' | 'analytics',
    format: 'pdf' as 'pdf' | 'excel' | 'csv',
    dateRange: '30days' as '7days' | '30days' | '90days' | 'custom'
  });

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading('notification');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Notification Sent!",
        description: `Notification sent to ${notificationForm.recipients === 'all' ? 'all users' : notificationForm.recipients}.`,
      });
      
      setNotificationForm({ title: '', message: '', type: 'info', recipients: 'all' });
      setShowNotificationDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCheckExpiringAccounts = async () => {
    setLoading('expiring');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const expiringAccounts = getExpiringAccounts();
      
      toast({
        title: "Account Check Complete",
        description: `Found ${expiringAccounts.length} accounts expiring within 7 days.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check expiring accounts.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportForm.type || !reportForm.format) {
      toast({
        title: "Error",
        description: "Please select report type and format.",
        variant: "destructive",
      });
      return;
    }

    setLoading('report');
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Report Generated!",
        description: `${reportForm.type} report in ${reportForm.format.toUpperCase()} format is ready for download.`,
      });
      
      setShowReportDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleBulkImport = async () => {
    setLoading('import');
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast({
        title: "Import Successful!",
        description: "Teachers have been imported successfully.",
      });
      
      setShowBulkImportDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import teachers.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handlePushTeachersToWebsite = async () => {
    setLoading('push');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate pushing featured teachers to website
      const featuredCount = teachers.filter(t => t.is_featured).length;
      
      toast({
        title: "Teachers Pushed to Website!",
        description: `${featuredCount} featured teachers are now visible on the website.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to push teachers to website.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const actionButtons = [
    {
      id: 'notification',
      title: 'Send Notification',
      description: 'Send platform-wide notifications',
      icon: <Send className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      action: () => setShowNotificationDialog(true),
      badge: 'Instant'
    },
    {
      id: 'expiring',
      title: 'Check Expiring Accounts',
      description: 'Review accounts expiring soon',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600',
      action: handleCheckExpiringAccounts,
      badge: `${stats.expiringAccounts} expiring`
    },
    {
      id: 'report',
      title: 'Generate Reports',
      description: 'Create detailed analytics reports',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600',
      action: () => setShowReportDialog(true),
      badge: 'Analytics'
    },
    {
      id: 'import',
      title: 'Bulk Import Teachers',
      description: 'Import multiple teachers at once',
      icon: <Upload className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600',
      action: () => setShowBulkImportDialog(true),
      badge: 'CSV/Excel'
    },
    {
      id: 'push',
      title: 'Push Teachers to Website',
      description: 'Update featured teachers on website',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-indigo-500 to-blue-500',
      hoverColor: 'hover:from-indigo-600 hover:to-blue-600',
      action: handlePushTeachersToWebsite,
      badge: 'Live Update'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          <p className="text-gray-600">Manage your platform efficiently</p>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200">
          <Zap className="h-3 w-3 mr-1" />
          Admin Tools
        </Badge>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actionButtons.map((button) => (
          <Card 
            key={button.id}
            className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg"
            onClick={button.action}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${button.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {button.icon}
                </div>
                <Badge variant="outline" className="text-xs font-medium">
                  {button.badge}
                </Badge>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                {button.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {button.description}
              </p>
              
              <Button 
                className={`w-full bg-gradient-to-r ${button.color} ${button.hoverColor} text-white shadow-md hover:shadow-lg transition-all duration-300`}
                disabled={loading === button.id}
              >
                {loading === button.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {button.icon}
                    <span className="ml-2">Execute</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Send Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-blue-600" />
              Send Notification
            </DialogTitle>
            <DialogDescription>
              Send a notification to users across the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Select value={notificationForm.recipients} onValueChange={(value: any) => setNotificationForm(prev => ({ ...prev, recipients: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="teachers">Teachers Only</SelectItem>
                  <SelectItem value="schools">Schools Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={notificationForm.type} onValueChange={(value: any) => setNotificationForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Notification title..."
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={notificationForm.message}
                onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Your message..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification} disabled={loading === 'notification'}>
                {loading === 'notification' ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Generate Report
            </DialogTitle>
            <DialogDescription>
              Create detailed analytics and data reports
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportForm.type} onValueChange={(value: any) => setReportForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teachers">Teachers Report</SelectItem>
                  <SelectItem value="schools">Schools Report</SelectItem>
                  <SelectItem value="applications">Applications Report</SelectItem>
                  <SelectItem value="analytics">Analytics Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={reportForm.format} onValueChange={(value: any) => setReportForm(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={reportForm.dateRange} onValueChange={(value: any) => setReportForm(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={loading === 'report'}>
                {loading === 'report' ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkImportDialog} onOpenChange={setShowBulkImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-green-600" />
              Bulk Import Teachers
            </DialogTitle>
            <DialogDescription>
              Import multiple teachers from CSV or Excel file
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drop your file here or click to browse</p>
              <p className="text-xs text-gray-500">Supports CSV and Excel files</p>
              <Button variant="outline" className="mt-3">
                Choose File
              </Button>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowBulkImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkImport} disabled={loading === 'import'}>
                {loading === 'import' ? 'Importing...' : 'Import Teachers'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminActionButtons;
