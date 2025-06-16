import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Settings,
  Mail,
  Smartphone,
  Users,
  School,
  GraduationCap,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { alertService, AlertConfig, AlertNotification } from '@/services/alertService';

const AlertManagement: React.FC = () => {
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAlertConfigs();
    loadNotificationHistory();
  }, []);

  const loadAlertConfigs = () => {
    const configs = alertService.getAlertConfigs();
    setAlertConfigs(configs);
  };

  const loadNotificationHistory = () => {
    const history = alertService.getNotificationHistory();
    setNotificationHistory(history);
  };

  const toggleAlert = async (alertId: string, enabled: boolean) => {
    setLoading(true);
    try {
      const success = alertService.toggleAlert(alertId, enabled);
      if (success) {
        loadAlertConfigs();
        toast({
          title: enabled ? "Alert Enabled" : "Alert Disabled",
          description: `Alert has been ${enabled ? 'enabled' : 'disabled'} successfully.`,
        });
      } else {
        throw new Error('Failed to update alert');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (triggers: any[]) => {
    const triggerType = triggers[0]?.type;
    switch (triggerType) {
      case 'new_teacher':
        return <GraduationCap className="h-5 w-5 text-blue-600" />;
      case 'new_school':
        return <School className="h-5 w-5 text-green-600" />;
      case 'new_job_post':
        return <Activity className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecipientIcon = (recipients: any[]) => {
    const recipientType = recipients[0]?.type;
    switch (recipientType) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'teachers':
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      case 'schools':
        return <School className="h-4 w-4 text-green-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const testAlert = async (type: 'teacher' | 'school' | 'job') => {
    setLoading(true);
    try {
      let result;
      switch (type) {
        case 'teacher':
          result = await alertService.simulateTeacherRegistration();
          toast({
            title: "Teacher Alert Triggered! 👨‍🏫",
            description: `Simulated registration for ${result.full_name}`,
          });
          break;
        case 'school':
          result = await alertService.simulateSchoolRegistration();
          toast({
            title: "School Alert Triggered! 🏫",
            description: `Simulated registration for ${result.school_name}`,
          });
          break;
        case 'job':
          result = await alertService.simulateJobPost();
          toast({
            title: "Job Post Alert Triggered! 💼",
            description: `Simulated job post: ${result.title}`,
          });
          break;
      }

      // Refresh notification history
      setTimeout(() => {
        loadNotificationHistory();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger test alert.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            <Activity className="h-3 w-3 mr-1" />
            {alertConfigs.filter(a => a.enabled).length} Active Alerts
          </Badge>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => testAlert('teacher')}
              disabled={loading}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <GraduationCap className="h-3 w-3 mr-1" />
              Test Teacher Alert
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => testAlert('school')}
              disabled={loading}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <School className="h-3 w-3 mr-1" />
              Test School Alert
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => testAlert('job')}
              disabled={loading}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <Activity className="h-3 w-3 mr-1" />
              Test Job Alert
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="configurations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configurations">Alert Configurations</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        {/* Alert Configurations Tab */}
        <TabsContent value="configurations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-orange-600" />
                Automatic Alert Settings
              </CardTitle>
              <CardDescription>
                Configure automatic notifications for platform activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alertConfigs.map((config) => (
                  <div key={config.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(config.triggers)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{config.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-2">
                              {getRecipientIcon(config.recipients)}
                              <span className="text-xs text-gray-500 capitalize">
                                {config.recipients[0]?.type || 'All Users'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500 capitalize">
                                {config.frequency}
                              </span>
                            </div>

                            {config.emailNotification && (
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-600">Email</span>
                              </div>
                            )}

                            {config.inAppNotification && (
                              <div className="flex items-center space-x-1">
                                <Smartphone className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-600">In-App</span>
                              </div>
                            )}
                          </div>

                          {config.lastTriggered && (
                            <p className="text-xs text-gray-400 mt-2">
                              Last triggered: {formatDate(config.lastTriggered)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => toggleAlert(config.id, enabled)}
                          disabled={loading}
                        />
                        <Badge className={config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {config.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-orange-600" />
                Recent Notifications
              </CardTitle>
              <CardDescription>
                View history of sent notifications and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notificationHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications Yet</h3>
                  <p className="text-gray-600">
                    Notification history will appear here when alerts are triggered.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notificationHistory.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(notification.sentAt)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{notification.recipients.length} recipients</span>
                            </div>

                            {notification.emailSent && (
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-blue-500" />
                                <span className="text-blue-600">Email Sent</span>
                              </div>
                            )}

                            {notification.inAppSent && (
                              <div className="flex items-center space-x-1">
                                <Smartphone className="h-3 w-3 text-green-500" />
                                <span className="text-green-600">In-App Sent</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertManagement;
