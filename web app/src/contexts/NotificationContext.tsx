import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { notificationBridge } from '@/services/notificationBridge';

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'job_alert' | 'teacher_alert' | 'system';
  category: 'job_post' | 'teacher_available' | 'system_update' | 'account' | 'general';
  isRead: boolean;
  isNew: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    jobId?: string;
    teacherId?: string;
    schoolId?: string;
    location?: string;
    subject?: string;
    salary?: string;
  };
}

interface NotificationContextType {
  notifications: UserNotification[];
  unreadCount: number;
  newNotifications: UserNotification[];
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  addNotification: (notification: Omit<UserNotification, 'id' | 'createdAt' | 'isRead' | 'isNew'>) => void;
  getNotificationsByCategory: (category: string) => UserNotification[];
  hasNewNotifications: boolean;
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Initialize notifications based on user role
  useEffect(() => {
    if (profile) {
      initializeNotifications();
      checkForWelcomePopup();

      // Register with notification bridge for real-time alerts
      if (profile.role === 'teacher' || profile.role === 'school') {
        notificationBridge.registerCallback(profile.role, addNotification);
      }
    }

    // Cleanup on unmount
    return () => {
      if (profile?.role) {
        notificationBridge.unregisterCallback(profile.role);
      }
    };
  }, [profile]);

  const initializeNotifications = () => {
    if (!profile) return;

    const baseNotifications: UserNotification[] = [];

    // Role-specific notifications
    if (profile.role === 'teacher') {
      baseNotifications.push(
        {
          id: 'welcome_teacher',
          title: 'Welcome to MG Investments! 🎓',
          message: 'Your teacher profile is now active. Start exploring job opportunities and connect with schools.',
          type: 'success',
          category: 'account',
          isRead: false,
          isNew: true,
          createdAt: new Date().toISOString(),
          actionUrl: '/teacher-portal',
          actionText: 'Explore Jobs'
        },
        {
          id: 'job_alert_sample',
          title: 'New Job Opportunity: Mathematics Teacher 📚',
          message: 'Kampala International School is looking for a Mathematics teacher. Salary: UGX 1,200,000 - 1,500,000',
          type: 'job_alert',
          category: 'job_post',
          isRead: false,
          isNew: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          actionUrl: '/teacher-portal',
          actionText: 'View Job',
          metadata: {
            location: 'Kampala',
            subject: 'Mathematics',
            salary: 'UGX 1,200,000 - 1,500,000'
          }
        },
        {
          id: 'profile_tips',
          title: 'Complete Your Profile for Better Matches 💡',
          message: 'Add more details to your profile to get matched with relevant job opportunities.',
          type: 'info',
          category: 'account',
          isRead: false,
          isNew: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          actionUrl: '/teacher-portal',
          actionText: 'Update Profile'
        }
      );
    } else if (profile.role === 'school') {
      baseNotifications.push(
        {
          id: 'welcome_school',
          title: 'Welcome to MG Investments! 🏫',
          message: 'Your school account is now active. Start posting jobs and finding qualified teachers.',
          type: 'success',
          category: 'account',
          isRead: false,
          isNew: true,
          createdAt: new Date().toISOString(),
          actionUrl: '/school-portal',
          actionText: 'Post a Job'
        },
        {
          id: 'teacher_alert_sample',
          title: 'New Teacher Available: Science Specialist 👨‍🔬',
          message: 'A qualified Science teacher with 5 years experience is now available in your area.',
          type: 'teacher_alert',
          category: 'teacher_available',
          isRead: false,
          isNew: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          actionUrl: '/school-portal',
          actionText: 'View Profile',
          metadata: {
            subject: 'Science',
            location: 'Kampala'
          }
        },
        {
          id: 'hiring_tips',
          title: 'Tips for Effective Teacher Recruitment 📋',
          message: 'Learn best practices for posting job requirements and attracting quality candidates.',
          type: 'info',
          category: 'general',
          isRead: false,
          isNew: false,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
          actionUrl: '/school-portal',
          actionText: 'Learn More'
        }
      );
    }

    // Add system notifications for all users
    baseNotifications.push({
      id: 'system_update',
      title: 'Platform Update: Enhanced Matching System 🚀',
      message: 'We\'ve improved our matching algorithm to provide better job and candidate recommendations.',
      type: 'system',
      category: 'system_update',
      isRead: false,
      isNew: false,
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    });

    setNotifications(baseNotifications);
  };

  const checkForWelcomePopup = () => {
    // Show welcome popup for new users or first-time visitors
    const hasSeenWelcome = localStorage.getItem(`welcome_seen_${profile?.id}`);
    if (!hasSeenWelcome) {
      setShowWelcomePopup(true);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true, isNew: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ 
        ...notification, 
        isRead: true, 
        isNew: false 
      }))
    );
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const addNotification = (notificationData: Omit<UserNotification, 'id' | 'createdAt' | 'isRead' | 'isNew'>) => {
    const newNotification: UserNotification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      isNew: true
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(notification => notification.category === category);
  };

  // Computed values
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const newNotifications = notifications.filter(n => n.isNew);
  const hasNewNotifications = newNotifications.length > 0;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    newNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification,
    getNotificationsByCategory,
    hasNewNotifications,
    showWelcomePopup,
    setShowWelcomePopup
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Utility function to simulate receiving new notifications
export const simulateNewNotification = (role: 'teacher' | 'school', type: 'job' | 'teacher' | 'system') => {
  const notifications = {
    teacher: {
      job: {
        title: 'New Job Alert: English Teacher Position 📚',
        message: 'St. Mary\'s College is hiring an English teacher. Apply now!',
        type: 'job_alert' as const,
        category: 'job_post' as const,
        actionText: 'Apply Now',
        metadata: { subject: 'English', location: 'Entebbe' }
      },
      system: {
        title: 'Profile Views Increased 📈',
        message: 'Your profile has been viewed 5 times this week by potential employers.',
        type: 'info' as const,
        category: 'account' as const,
        actionText: 'View Stats'
      }
    },
    school: {
      teacher: {
        title: 'New Teacher Alert: Mathematics Specialist 🧮',
        message: 'A highly qualified Mathematics teacher is now available in your area.',
        type: 'teacher_alert' as const,
        category: 'teacher_available' as const,
        actionText: 'View Profile',
        metadata: { subject: 'Mathematics', location: 'Kampala' }
      },
      system: {
        title: 'Job Post Performance 📊',
        message: 'Your recent job posting has received 12 applications.',
        type: 'success' as const,
        category: 'general' as const,
        actionText: 'Review Applications'
      }
    }
  };

  return notifications[role][type] || notifications[role].system;
};
