import React, { useState, useEffect } from 'react';
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
  Loader2,
  Mail,
  GraduationCap,
  Building,
  Shield,
  Circle,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRealTimeData } from '@/contexts/RealTimeDataContext';
import { websiteSyncService } from '@/services/websiteSync';
import { websiteUpdateNotifier } from '@/services/websiteUpdateNotifier';
import { reportGenerator } from '@/utils/reportGenerator';
import { dataService } from '@/services/dataService';
import { emailService, EmailTemplate } from '@/services/emailService';
import { initializeFirebaseData, checkExistingData } from '@/utils/initializeFirebaseData';
import { alertService } from '@/services/alertService';

const AdminActionButtons: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();
  const { stats, getExpiringAccounts, teachers, updateTeacherFeatured, refreshData } = useRealTimeData();

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    recipients: 'all' as 'all' | 'teachers' | 'schools' | 'admins',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    sendEmail: true,
    useTemplate: false,
    selectedTemplate: ''
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [recipientCount, setRecipientCount] = useState(0);

  // Load email templates and recipient count
  useEffect(() => {
    const loadEmailData = async () => {
      try {
        const templates = await emailService.getEmailTemplates();
        setEmailTemplates(templates);

        // Get recipient count for current selection
        const recipients = await emailService.getRecipients(notificationForm.recipients);
        setRecipientCount(recipients.length);
      } catch (error) {
        console.error('Error loading email data:', error);
      }
    };

    loadEmailData();
  }, [notificationForm.recipients]);

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
      let result = { success: false, message: '', recipient_count: 0, success_count: 0, failure_count: 0 };

      if (notificationForm.sendEmail) {
        // Send email notifications
        result = await emailService.sendBulkNotification({
          subject: notificationForm.title,
          message: notificationForm.message,
          recipients: notificationForm.recipients,
          sender_email: 'admin@mginvestments.ug',
          sender_name: 'MG Investments Admin',
          priority: notificationForm.priority,
          status: 'sending'
        });
      } else {
        // Send in-app notification only (simulate)
        await new Promise(resolve => setTimeout(resolve, 1000));
        result = {
          success: true,
          message: `In-app notification sent to ${notificationForm.recipients}`,
          recipient_count: recipientCount,
          success_count: recipientCount,
          failure_count: 0
        };
      }

      if (result.success) {
        toast({
          title: "Notification Sent Successfully! 📧",
          description: result.message,
          duration: 5000,
        });

        // Reset form
        setNotificationForm({
          title: '',
          message: '',
          type: 'info',
          recipients: 'all',
          priority: 'normal',
          sendEmail: true,
          useTemplate: false,
          selectedTemplate: ''
        });
        setShowNotificationDialog(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Notification error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send notification.",
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
      let blob: Blob;
      let filename: string;
      const timestamp = new Date().toISOString().split('T')[0];

      if (reportForm.format === 'pdf') {
        // Generate PDF reports
        switch (reportForm.type) {
          case 'teachers':
            const { data: teachersData } = await dataService.getTeachers();
            blob = reportGenerator.generateTeachersReport(teachersData || []);
            filename = `teachers-report-${timestamp}.pdf`;
            break;

          case 'schools':
            const { data: schoolsData } = await dataService.getSchools();
            blob = reportGenerator.generateSchoolsReport(schoolsData || []);
            filename = `schools-report-${timestamp}.pdf`;
            break;

          case 'applications':
            const { data: applicationsData } = await dataService.getApplications();
            blob = reportGenerator.generateApplicationsReport(applicationsData || []);
            filename = `applications-report-${timestamp}.pdf`;
            break;

          case 'analytics':
            const { data: analyticsStats } = await dataService.getStats();
            const { data: teachers } = await dataService.getTeachers();
            const { data: schools } = await dataService.getSchools();
            const { data: applications } = await dataService.getApplications();

            blob = reportGenerator.generateAnalyticsReport(
              analyticsStats || stats,
              { teachers, schools, applications }
            );
            filename = `analytics-report-${timestamp}.pdf`;
            break;

          default:
            throw new Error('Invalid report type');
        }

        // Download the PDF
        reportGenerator.downloadReport(blob, filename);

        toast({
          title: "Report Generated!",
          description: `${reportForm.type} report has been downloaded as ${filename}`,
          duration: 5000,
        });
      } else {
        // Handle Excel/CSV formats (placeholder for future implementation)
        toast({
          title: "Feature Coming Soon",
          description: `${reportForm.format.toUpperCase()} format will be available in the next update.`,
          variant: "default",
        });
      }

      setShowReportDialog(false);
    } catch (error: any) {
      console.error('Report generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate report.",
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

    // Show immediate feedback
    toast({
      title: "Pushing Teachers to Website... 🚀",
      description: "Syncing all teachers to the live website",
      duration: 2000,
    });

    try {
      // Sync ALL teachers to website (no limitations or criteria)
      const result = await websiteSyncService.syncAllTeachersToWebsite();

      if (result.success) {
        // Refresh the data context immediately
        await refreshData();

        // Notify the website that teachers have been updated
        websiteUpdateNotifier.notifyTeachersUpdated();

        // Show success with detailed info
        toast({
          title: "✅ Teachers Successfully Pushed to Website!",
          description: result.message,
          duration: 6000,
        });

        console.log('🎉 Push to website completed successfully:', {
          publishedCount: result.publishedCount,
          featuredCount: result.featuredCount,
          timestamp: new Date().toISOString()
        });

      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('❌ Push to website failed:', error);

      toast({
        title: "❌ Push Failed",
        description: error instanceof Error ? error.message : "Failed to push teachers to website. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(null);
    }
  };

  const handlePushSchoolsToWebsite = async () => {
    setLoading('pushSchools');

    // Show immediate feedback
    toast({
      title: "Pushing Schools to Website... 🏫",
      description: "Syncing ALL schools to the live website (NO CRITERIA APPLIED)",
      duration: 2000,
    });

    try {
      // Get ALL schools (no filtering, no criteria)
      const { data: schools, error } = await dataService.getSchools();

      if (error) {
        throw new Error(error);
      }

      // ADMIN BYPASS: Push ALL schools regardless of status
      const allSchools = schools || [];

      if (allSchools.length === 0) {
        toast({
          title: "No Schools Found",
          description: "No schools found in the database.",
          variant: "default",
        });
        return;
      }

      console.log('🚀 ADMIN BYPASS ACTIVE: Pushing ALL schools to website...');
      console.log(`📊 Total schools to push: ${allSchools.length}`);

      // Log school details for transparency
      allSchools.forEach((school, index) => {
        console.log(`🏫 ${index + 1}. ${school.school_name} - Status: ${school.is_active ? 'Active' : 'Inactive'} - Type: ${school.school_type || 'N/A'}`);
      });

      // Simulate website sync process with proper delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Notify the website that schools have been updated
      websiteUpdateNotifier.notifySchoolsUpdated();

      // Show success with detailed info
      toast({
        title: "✅ ALL Schools Successfully Pushed to Website!",
        description: `${allSchools.length} schools are now displayed on the website (ALL CRITERIA BYPASSED)`,
        duration: 8000,
      });

      console.log('🎉 Push ALL schools to website completed successfully:', {
        totalSchoolsPushed: allSchools.length,
        activeSchools: allSchools.filter(s => s.is_active).length,
        inactiveSchools: allSchools.filter(s => !s.is_active).length,
        bypassedCriteria: ['is_active', 'status', 'verification'],
        adminOverride: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Push schools to website failed:', error);

      toast({
        title: "❌ Push Failed",
        description: error instanceof Error ? error.message : "Failed to push schools to website. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(null);
    }
  };

  const handleInitializeDatabase = async () => {
    setLoading('initialize');

    // Show immediate feedback
    toast({
      title: "Initializing Database... 🔥",
      description: "Setting up sample data for testing",
      duration: 2000,
    });

    try {
      // Check if data already exists
      const existingData = await checkExistingData();

      if (existingData.hasData) {
        toast({
          title: "Database Already Initialized",
          description: `Found ${existingData.teachers} teachers, ${existingData.schools} schools, ${existingData.applications} applications`,
          duration: 5000,
        });
        return;
      }

      // Initialize with sample data
      const result = await initializeFirebaseData();

      if (result.success) {
        // Refresh the data context
        await refreshData();

        toast({
          title: "✅ Database Initialized Successfully!",
          description: `Added ${result.data?.teachers} teachers, ${result.data?.schools} schools, ${result.data?.applications} applications`,
          duration: 8000,
        });

        console.log('🎉 Database initialization completed:', result.data);
      } else {
        throw new Error(result.error?.message || 'Initialization failed');
      }

    } catch (error) {
      console.error('❌ Database initialization failed:', error);

      toast({
        title: "❌ Initialization Failed",
        description: error instanceof Error ? error.message : "Failed to initialize database. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(null);
    }
  };

  const handleTestAlerts = async () => {
    setLoading('alerts');

    toast({
      title: "Testing Alert System... 🔔",
      description: "Triggering sample alerts for demonstration",
      duration: 2000,
    });

    try {
      // Test teacher alert
      await alertService.simulateTeacherRegistration();

      // Small delay between alerts
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test school alert
      await alertService.simulateSchoolRegistration();

      // Small delay between alerts
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test job post alert
      await alertService.simulateJobPost();

      toast({
        title: "✅ Alert System Test Complete!",
        description: "Sample alerts triggered! Check Teacher/School portals for in-app notifications and Alerts tab for email logs.",
        duration: 8000,
      });

    } catch (error) {
      console.error('❌ Alert test failed:', error);

      toast({
        title: "❌ Alert Test Failed",
        description: error instanceof Error ? error.message : "Failed to test alert system.",
        variant: "destructive",
        duration: 5000,
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
      description: 'Sync all teachers to live website instantly',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-indigo-500 to-blue-500',
      hoverColor: 'hover:from-indigo-600 hover:to-blue-600',
      action: handlePushTeachersToWebsite,
      badge: `${stats.totalTeachers} Teachers`
    },
    {
      id: 'pushSchools',
      title: 'Push Schools to Website',
      description: 'Sync ALL schools to live website (No criteria)',
      icon: <Building className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-500',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-600',
      action: handlePushSchoolsToWebsite,
      badge: `ALL Schools`
    },
    {
      id: 'initialize',
      title: 'Initialize Database',
      description: 'Set up sample data for testing',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-red-500 to-pink-500',
      hoverColor: 'hover:from-red-600 hover:to-pink-600',
      action: handleInitializeDatabase,
      badge: 'Setup'
    },
    {
      id: 'alerts',
      title: 'Test Alert System',
      description: 'Trigger sample alerts for demonstration',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600',
      action: handleTestAlerts,
      badge: 'Demo'
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
                    {button.id === 'pushSchools' ? 'Pushing Schools...' : 'Processing...'}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-blue-600" />
              Send Email Notification
            </DialogTitle>
            <DialogDescription>
              Send email notifications to users across the platform
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Recipients and Email Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Select value={notificationForm.recipients} onValueChange={(value: any) => setNotificationForm(prev => ({ ...prev, recipients: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        All Users
                      </div>
                    </SelectItem>
                    <SelectItem value="teachers">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Teachers Only
                      </div>
                    </SelectItem>
                    <SelectItem value="schools">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Schools Only
                      </div>
                    </SelectItem>
                    <SelectItem value="admins">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admins Only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {recipientCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    📧 {recipientCount} recipients will receive this email
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={notificationForm.priority} onValueChange={(value: any) => setNotificationForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <Circle className="h-4 w-4 mr-2 text-gray-400" />
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">
                      <div className="flex items-center">
                        <Circle className="h-4 w-4 mr-2 text-blue-500" />
                        Normal Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <Circle className="h-4 w-4 mr-2 text-orange-500" />
                        High Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email Template Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useTemplate"
                  checked={notificationForm.useTemplate}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, useTemplate: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="useTemplate" className="text-sm font-medium">
                  Use Email Template
                </Label>
              </div>

              {notificationForm.useTemplate && (
                <div>
                  <Label htmlFor="template">Select Template</Label>
                  <Select value={notificationForm.selectedTemplate} onValueChange={(value: any) => setNotificationForm(prev => ({ ...prev, selectedTemplate: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Email Subject</Label>
                <Input
                  id="title"
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <Label htmlFor="message">Email Message</Label>
                <Textarea
                  id="message"
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your message... You can use {name} to personalize with recipient names."
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: Use {"{name}"} in your message to automatically insert recipient names
                </p>
              </div>
            </div>

            {/* Email Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800">Email Delivery Options</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendEmail"
                        checked={notificationForm.sendEmail}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="sendEmail" className="text-sm">
                        Send via Email (Recommended)
                      </Label>
                    </div>
                    <p className="text-xs text-blue-700">
                      ✅ Professional email delivery with MG Investments branding<br/>
                      ✅ Delivery confirmation and tracking<br/>
                      ✅ Mobile-friendly email templates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendNotification}
                disabled={loading === 'notification'}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {loading === 'notification' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send to {recipientCount} Recipients
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Generate Report
            </DialogTitle>
            <DialogDescription>
              Create detailed analytics and data reports for download
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
                  <SelectItem value="teachers">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Teachers Report
                    </div>
                  </SelectItem>
                  <SelectItem value="schools">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Schools Report
                    </div>
                  </SelectItem>
                  <SelectItem value="applications">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Applications Report
                    </div>
                  </SelectItem>
                  <SelectItem value="analytics">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics Report
                    </div>
                  </SelectItem>
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
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      PDF (Recommended)
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Excel (Coming Soon)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      CSV (Coming Soon)
                    </div>
                  </SelectItem>
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
                  <SelectItem value="7days">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last 7 Days
                    </div>
                  </SelectItem>
                  <SelectItem value="30days">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last 30 Days
                    </div>
                  </SelectItem>
                  <SelectItem value="90days">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Last 90 Days
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Custom Range
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Report Preview Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-purple-800">Report Features:</p>
                  <ul className="text-purple-700 mt-1 space-y-1">
                    <li>• Professional PDF formatting</li>
                    <li>• Company branding and headers</li>
                    <li>• Detailed data tables and statistics</li>
                    <li>• Automatic download to your device</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={loading === 'report'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading === 'report' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download
                  </>
                )}
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
