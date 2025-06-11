// Bridge service to connect alert system with notification context
// This allows the alert system to add notifications to user contexts

import { UserNotification } from '@/contexts/NotificationContext';

type NotificationCallback = (notification: Omit<UserNotification, 'id' | 'createdAt' | 'isRead' | 'isNew'>) => void;

class NotificationBridge {
  private callbacks: Map<string, NotificationCallback> = new Map();

  // Register a callback for a specific user role
  registerCallback(userRole: string, callback: NotificationCallback) {
    this.callbacks.set(userRole, callback);
  }

  // Remove callback for a user role
  unregisterCallback(userRole: string) {
    this.callbacks.delete(userRole);
  }

  // Send notification to specific user role
  sendNotification(userRole: string, notification: Omit<UserNotification, 'id' | 'createdAt' | 'isRead' | 'isNew'>) {
    const callback = this.callbacks.get(userRole);
    if (callback) {
      callback(notification);
    }
  }

  // Send notification to all registered users
  broadcastNotification(notification: Omit<UserNotification, 'id' | 'createdAt' | 'isRead' | 'isNew'>) {
    this.callbacks.forEach((callback) => {
      callback(notification);
    });
  }

  // Convert alert data to notification format
  convertAlertToNotification(alertType: string, alertData: any): Omit<UserNotification, 'id' | 'createdAt' | 'isRead' | 'isNew'> {
    switch (alertType) {
      case 'new_teacher':
        return {
          title: `New Teacher Available: ${alertData.teacher.subject_specialization} Specialist 👨‍🏫`,
          message: `${alertData.teacher.full_name} with ${alertData.teacher.experience_years} years of experience is now available in ${alertData.teacher.location}.`,
          type: 'teacher_alert',
          category: 'teacher_available',
          actionUrl: '/school-portal',
          actionText: 'View Profile',
          metadata: {
            teacherId: alertData.teacher.id,
            subject: alertData.teacher.subject_specialization,
            location: alertData.teacher.location
          }
        };

      case 'new_job_post':
        return {
          title: `New Job Opportunity: ${alertData.job.title} 💼`,
          message: `${alertData.job.school_name} is hiring! Location: ${alertData.job.location}. Salary: ${alertData.job.salary}`,
          type: 'job_alert',
          category: 'job_post',
          actionUrl: '/teacher-portal',
          actionText: 'Apply Now',
          metadata: {
            jobId: alertData.job.id,
            location: alertData.job.location,
            salary: alertData.job.salary
          }
        };

      case 'new_school':
        return {
          title: `New School Joined: ${alertData.school.school_name} 🏫`,
          message: `${alertData.school.school_name} has joined the platform and is looking for qualified teachers.`,
          type: 'system',
          category: 'system_update',
          actionUrl: '/teacher-portal',
          actionText: 'Explore Opportunities',
          metadata: {
            schoolId: alertData.school.id,
            location: alertData.school.location
          }
        };

      default:
        return {
          title: 'Platform Update',
          message: 'New activity on MG Investments platform.',
          type: 'info',
          category: 'general'
        };
    }
  }

  // Handle new teacher alert
  handleNewTeacherAlert(teacherData: any) {
    // Send to schools
    const schoolNotification = this.convertAlertToNotification('new_teacher', { teacher: teacherData });
    this.sendNotification('school', schoolNotification);

    // Send system notification to teachers about platform growth
    const teacherNotification = {
      title: 'Platform Growing! 🚀',
      message: `Welcome ${teacherData.full_name}! Our teacher community is expanding with qualified professionals.`,
      type: 'system' as const,
      category: 'system_update' as const,
      actionUrl: '/teacher-portal',
      actionText: 'Explore Network'
    };
    this.sendNotification('teacher', teacherNotification);
  }

  // Handle new school alert
  handleNewSchoolAlert(schoolData: any) {
    // Send to teachers
    const teacherNotification = this.convertAlertToNotification('new_school', { school: schoolData });
    this.sendNotification('teacher', teacherNotification);

    // Send system notification to schools about platform growth
    const schoolNotification = {
      title: 'Platform Growing! 🚀',
      message: `Welcome ${schoolData.school_name}! Our school network is expanding with quality institutions.`,
      type: 'system' as const,
      category: 'system_update' as const,
      actionUrl: '/school-portal',
      actionText: 'Explore Network'
    };
    this.sendNotification('school', schoolNotification);
  }

  // Handle new job post alert
  handleNewJobPostAlert(jobData: any) {
    // Send to teachers
    const notification = this.convertAlertToNotification('new_job_post', { job: jobData });
    this.sendNotification('teacher', notification);
  }
}

export const notificationBridge = new NotificationBridge();
