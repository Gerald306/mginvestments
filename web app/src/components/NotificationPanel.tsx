import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, UserNotification, simulateNewNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  BellRing,
  CheckCircle,
  Info,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  School,
  Clock,
  ExternalLink,
  Eye,
  Trash2,
  Check,
  Filter,
  Settings,
  Plus,
  RefreshCw
} from 'lucide-react';

const NotificationPanel: React.FC = () => {
  const { profile } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    dismissNotification,
    markAllAsRead,
    addNotification,
    getNotificationsByCategory
  } = useNotifications();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'job_alert':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      case 'teacher_alert':
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'system':
        return <School className="h-4 w-4 text-gray-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'job_alert':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'teacher_alert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSimulateNotification = () => {
    if (!profile) return;

    const notificationType = profile.role === 'teacher' ? 'job' : 'teacher';
    const newNotification = simulateNewNotification(profile.role as 'teacher' | 'school', notificationType);
    
    addNotification(newNotification);
    
    toast({
      title: "New Notification! 🔔",
      description: `Simulated ${notificationType} alert for testing`,
    });
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    if (activeTab !== 'all') {
      if (activeTab === 'unread') {
        filtered = filtered.filter(n => !n.isRead);
      } else {
        filtered = getNotificationsByCategory(activeTab);
      }
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredNotifications = getFilteredNotifications();

  const notificationCategories = [
    { id: 'all', label: 'All Notifications', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    ...(profile?.role === 'teacher' ? [
      { id: 'job_post', label: 'Job Alerts', count: getNotificationsByCategory('job_post').length },
      { id: 'account', label: 'Account', count: getNotificationsByCategory('account').length }
    ] : []),
    ...(profile?.role === 'school' ? [
      { id: 'teacher_available', label: 'Teacher Alerts', count: getNotificationsByCategory('teacher_available').length },
      { id: 'general', label: 'General', count: getNotificationsByCategory('general').length }
    ] : []),
    { id: 'system_update', label: 'System', count: getNotificationsByCategory('system_update').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BellRing className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateNotification}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Test Alert
          </Button>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-orange-600" />
            Your Notifications
          </CardTitle>
          <CardDescription>
            Stay updated with the latest alerts and platform activities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              {notificationCategories.slice(0, 6).map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.label}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-600">
                    {activeTab === 'unread' 
                      ? "You're all caught up! No unread notifications."
                      : "You'll see notifications here when there's activity."}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                          !notification.isRead 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`font-semibold truncate ${
                                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h3>
                                {notification.isNew && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    NEW
                                  </Badge>
                                )}
                                <Badge className={`text-xs ${getNotificationBadgeColor(notification.type)}`}>
                                  {notification.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {notification.message}
                              </p>

                              {/* Metadata */}
                              {notification.metadata && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {notification.metadata.location && (
                                    <Badge variant="outline" className="text-xs">
                                      📍 {notification.metadata.location}
                                    </Badge>
                                  )}
                                  {notification.metadata.subject && (
                                    <Badge variant="outline" className="text-xs">
                                      📚 {notification.metadata.subject}
                                    </Badge>
                                  )}
                                  {notification.metadata.salary && (
                                    <Badge variant="outline" className="text-xs">
                                      💰 {notification.metadata.salary}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTimeAgo(notification.createdAt)}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {notification.actionText && notification.actionUrl && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => {
                                        markAsRead(notification.id);
                                        // In a real app, you'd navigate to the URL
                                        console.log('Navigate to:', notification.actionUrl);
                                        toast({
                                          title: "Action Triggered",
                                          description: `Would navigate to ${notification.actionText}`,
                                        });
                                      }}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      {notification.actionText}
                                    </Button>
                                  )}
                                  
                                  {!notification.isRead && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Read
                                    </Button>
                                  )}
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => dismissNotification(notification.id)}
                                    className="text-xs text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
