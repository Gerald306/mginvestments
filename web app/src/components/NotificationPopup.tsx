import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, UserNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  X,
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
  Check
} from 'lucide-react';

const NotificationPopup: React.FC = () => {
  const { profile } = useAuth();
  const {
    showWelcomePopup,
    setShowWelcomePopup,
    newNotifications,
    markAsRead,
    dismissNotification,
    markAllAsRead
  } = useNotifications();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-show popup when there are new notifications
  useEffect(() => {
    if (newNotifications.length > 0 && !showWelcomePopup) {
      // Small delay to ensure smooth UI transition
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newNotifications.length, showWelcomePopup, setShowWelcomePopup]);

  const handleClose = () => {
    setShowWelcomePopup(false);
    // Mark welcome popup as seen
    if (profile?.id) {
      localStorage.setItem(`welcome_seen_${profile.id}`, 'true');
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleDismiss = (notificationId: string) => {
    dismissNotification(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'job_alert':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'teacher_alert':
        return <GraduationCap className="h-5 w-5 text-purple-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'system':
        return <School className="h-5 w-5 text-gray-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
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

  const displayNotifications = newNotifications.length > 0 ? newNotifications : [];

  if (!showWelcomePopup || displayNotifications.length === 0) {
    return null;
  }

  return (
    <Dialog open={showWelcomePopup} onOpenChange={setShowWelcomePopup}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl">
              <Bell className="h-6 w-6 mr-3 text-orange-600" />
              New Notifications
              <Badge className="ml-3 bg-orange-100 text-orange-800">
                {displayNotifications.length} new
              </Badge>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark All Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  notification.isNew ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
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
                                handleMarkAsRead(notification.id);
                                // In a real app, you'd navigate to the URL
                                console.log('Navigate to:', notification.actionUrl);
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
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismiss(notification.id)}
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

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {profile?.role === 'teacher' && (
              <span>💡 Enable notifications to get instant job alerts</span>
            )}
            {profile?.role === 'school' && (
              <span>💡 Get notified when qualified teachers join the platform</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button 
              onClick={() => {
                handleMarkAllAsRead();
                handleClose();
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
