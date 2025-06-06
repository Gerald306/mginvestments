import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Send, 
  Users, 
  School, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  Eye,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipient_type: 'all' | 'teachers' | 'schools' | 'admins';
  created_at: string;
  read: boolean;
  urgent: boolean;
  sender: string;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    recipient_type: 'all' as const,
    urgent: false
  });

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      message: 'The platform will undergo maintenance on Sunday, 2:00 AM - 4:00 AM. Please save your work.',
      type: 'warning',
      recipient_type: 'all',
      created_at: '2024-01-25T10:00:00Z',
      read: false,
      urgent: true,
      sender: 'System Admin'
    },
    {
      id: '2',
      title: 'New Job Opportunities Available',
      message: '15 new teaching positions have been posted this week. Check them out in the Jobs section.',
      type: 'info',
      recipient_type: 'teachers',
      created_at: '2024-01-24T14:30:00Z',
      read: true,
      urgent: false,
      sender: 'HR Team'
    },
    {
      id: '3',
      title: 'Profile Update Required',
      message: 'Please update your teaching certifications to maintain your active status.',
      type: 'warning',
      recipient_type: 'teachers',
      created_at: '2024-01-23T09:15:00Z',
      read: false,
      urgent: false,
      sender: 'Admin Team'
    },
    {
      id: '4',
      title: 'Welcome to MG Investments!',
      message: 'Thank you for joining our platform. Complete your profile to get started.',
      type: 'success',
      recipient_type: 'all',
      created_at: '2024-01-22T16:45:00Z',
      read: true,
      urgent: false,
      sender: 'Welcome Team'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const notification: Notification = {
        id: Date.now().toString(),
        ...newNotification,
        created_at: new Date().toISOString(),
        read: false,
        sender: 'Admin'
      };

      setNotifications(prev => [notification, ...prev]);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        recipient_type: 'all',
        urgent: false
      });
      setShowComposer(false);

      toast({
        title: "Notification Sent!",
        description: `Notification sent to ${newNotification.recipient_type === 'all' ? 'all users' : newNotification.recipient_type}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRecipientIcon = (type: string) => {
    switch (type) {
      case 'teachers': return <User className="h-4 w-4" />;
      case 'schools': return <School className="h-4 w-4" />;
      case 'admins': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <Button 
          onClick={() => setShowComposer(!showComposer)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      {/* Notification Composer */}
      {showComposer && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-orange-600" />
              Compose Notification
            </CardTitle>
            <CardDescription>
              Send notifications to users across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Recipient Type
                </label>
                <Select 
                  value={newNotification.recipient_type} 
                  onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, recipient_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                    <SelectItem value="schools">Schools Only</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Notification Type
                </label>
                <Select 
                  value={newNotification.type} 
                  onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}
                >
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
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Title
              </label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Message
              </label>
              <Textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter your message..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent"
                checked={newNotification.urgent}
                onChange={(e) => setNewNotification(prev => ({ ...prev, urgent: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
                Mark as urgent
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowComposer(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendNotification}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                {loading ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all duration-300 hover:shadow-lg ${
              !notification.read ? 'border-l-4 border-l-orange-500 bg-orange-50/30' : ''
            } ${notification.urgent ? 'ring-2 ring-red-200' : ''}`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Header Section - Mobile optimized */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm sm:text-base ${!notification.read ? 'text-gray-900' : 'text-gray-700'} truncate`}>
                          {notification.title}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {notification.urgent && (
                            <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                          )}
                          {!notification.read && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">New</Badge>
                          )}
                          <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="pl-0 sm:pl-8">
                  <p className={`mb-3 text-sm sm:text-base ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                </div>

                {/* Meta Information - Mobile optimized */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      {getRecipientIcon(notification.recipient_type)}
                      <span className="ml-1 capitalize">{notification.recipient_type}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>{notification.sender}</span>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile optimized */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Mark Read</span>
                        <span className="sm:hidden">Read</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNotification(notification.id)}
                      className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! No new notifications to display.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSystem;
