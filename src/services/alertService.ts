import { emailService } from './emailService';
import { dataService } from './dataService';
import { notificationBridge } from './notificationBridge';

export interface AlertConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: AlertTrigger[];
  recipients: AlertRecipient[];
  emailTemplate: string;
  inAppNotification: boolean;
  emailNotification: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertTrigger {
  type: 'new_teacher' | 'new_school' | 'new_job_post' | 'teacher_application' | 'school_registration';
  conditions?: Record<string, any>;
}

export interface AlertRecipient {
  type: 'admin' | 'teachers' | 'schools' | 'specific_users';
  userIds?: string[];
  roles?: string[];
}

export interface AlertNotification {
  id: string;
  alertConfigId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipients: string[];
  triggerData: any;
  sentAt: string;
  emailSent: boolean;
  inAppSent: boolean;
  status: 'pending' | 'sent' | 'failed';
}

class AlertService {
  private alertConfigs: AlertConfig[] = [];
  private pendingNotifications: AlertNotification[] = [];

  constructor() {
    this.initializeDefaultAlerts();
  }

  // Initialize default alert configurations
  private initializeDefaultAlerts() {
    this.alertConfigs = [
      {
        id: 'new-teacher-alert',
        name: 'New Teacher Registration',
        description: 'Alert admins when a new teacher joins the platform',
        enabled: true,
        triggers: [{ type: 'new_teacher' }],
        recipients: [{ type: 'admin' }],
        emailTemplate: 'new_teacher_admin',
        inAppNotification: true,
        emailNotification: true,
        frequency: 'immediate',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'new-school-alert',
        name: 'New School Registration',
        description: 'Alert admins when a new school joins the platform',
        enabled: true,
        triggers: [{ type: 'new_school' }],
        recipients: [{ type: 'admin' }],
        emailTemplate: 'new_school_admin',
        inAppNotification: true,
        emailNotification: true,
        frequency: 'immediate',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'new-job-post-alert',
        name: 'New Job Post Notification',
        description: 'Alert teachers when new job posts are available',
        enabled: true,
        triggers: [{ type: 'new_job_post' }],
        recipients: [{ type: 'teachers' }],
        emailTemplate: 'new_job_post_teachers',
        inAppNotification: true,
        emailNotification: true,
        frequency: 'immediate',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'teacher-seeking-jobs-alert',
        name: 'Teachers Seeking Jobs',
        description: 'Alert schools when new teachers are seeking jobs',
        enabled: true,
        triggers: [{ type: 'new_teacher' }],
        recipients: [{ type: 'schools' }],
        emailTemplate: 'new_teacher_schools',
        inAppNotification: true,
        emailNotification: true,
        frequency: 'daily', // Batch daily to avoid spam
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // Trigger alert when new teacher joins
  async triggerNewTeacherAlert(teacherData: any) {
    console.log('🔔 Triggering new teacher alerts for:', teacherData.full_name);

    const relevantAlerts = this.alertConfigs.filter(alert =>
      alert.enabled && alert.triggers.some(trigger => trigger.type === 'new_teacher')
    );

    for (const alert of relevantAlerts) {
      await this.processAlert(alert, {
        type: 'new_teacher',
        teacher: teacherData,
        timestamp: new Date().toISOString()
      });
    }

    // Send in-app notifications via bridge
    notificationBridge.handleNewTeacherAlert(teacherData);
  }

  // Trigger alert when new school joins
  async triggerNewSchoolAlert(schoolData: any) {
    console.log('🔔 Triggering new school alerts for:', schoolData.school_name);

    const relevantAlerts = this.alertConfigs.filter(alert =>
      alert.enabled && alert.triggers.some(trigger => trigger.type === 'new_school')
    );

    for (const alert of relevantAlerts) {
      await this.processAlert(alert, {
        type: 'new_school',
        school: schoolData,
        timestamp: new Date().toISOString()
      });
    }

    // Send in-app notifications via bridge
    notificationBridge.handleNewSchoolAlert(schoolData);
  }

  // Trigger alert when new job post is created
  async triggerNewJobPostAlert(jobData: any) {
    console.log('🔔 Triggering new job post alerts for:', jobData.title);

    const relevantAlerts = this.alertConfigs.filter(alert =>
      alert.enabled && alert.triggers.some(trigger => trigger.type === 'new_job_post')
    );

    for (const alert of relevantAlerts) {
      await this.processAlert(alert, {
        type: 'new_job_post',
        job: jobData,
        timestamp: new Date().toISOString()
      });
    }

    // Send in-app notifications via bridge
    notificationBridge.handleNewJobPostAlert(jobData);
  }

  // Process individual alert
  private async processAlert(alertConfig: AlertConfig, triggerData: any) {
    try {
      const notification: AlertNotification = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        alertConfigId: alertConfig.id,
        title: this.generateAlertTitle(alertConfig, triggerData),
        message: this.generateAlertMessage(alertConfig, triggerData),
        type: this.getAlertType(triggerData.type),
        recipients: await this.getRecipients(alertConfig.recipients),
        triggerData,
        sentAt: new Date().toISOString(),
        emailSent: false,
        inAppSent: false,
        status: 'pending'
      };

      // Send in-app notification
      if (alertConfig.inAppNotification) {
        await this.sendInAppNotification(notification);
        notification.inAppSent = true;
      }

      // Send email notification
      if (alertConfig.emailNotification) {
        await this.sendEmailNotification(notification, alertConfig);
        notification.emailSent = true;
      }

      notification.status = 'sent';
      this.pendingNotifications.push(notification);

      // Update last triggered time
      alertConfig.lastTriggered = new Date().toISOString();
      alertConfig.updatedAt = new Date().toISOString();

      console.log(`✅ Alert processed successfully: ${notification.title}`);
    } catch (error) {
      console.error('❌ Error processing alert:', error);
    }
  }

  // Generate alert title based on trigger type
  private generateAlertTitle(alertConfig: AlertConfig, triggerData: any): string {
    switch (triggerData.type) {
      case 'new_teacher':
        return alertConfig.recipients[0]?.type === 'admin' 
          ? `New Teacher Registration: ${triggerData.teacher.full_name}`
          : `New Teacher Available: ${triggerData.teacher.subject_specialization} Specialist`;
      case 'new_school':
        return `New School Registration: ${triggerData.school.school_name}`;
      case 'new_job_post':
        return `New Job Opportunity: ${triggerData.job.title}`;
      default:
        return 'New Platform Activity';
    }
  }

  // Generate alert message based on trigger type
  private generateAlertMessage(alertConfig: AlertConfig, triggerData: any): string {
    switch (triggerData.type) {
      case 'new_teacher':
        if (alertConfig.recipients[0]?.type === 'admin') {
          return `A new teacher, ${triggerData.teacher.full_name}, has registered on the platform. Subject: ${triggerData.teacher.subject_specialization}, Location: ${triggerData.teacher.location}. Please review their profile in the admin dashboard.`;
        } else {
          return `A new ${triggerData.teacher.subject_specialization} teacher is now available in ${triggerData.teacher.location}. They have ${triggerData.teacher.experience_years} years of experience. Check out their profile to connect!`;
        }
      case 'new_school':
        return `${triggerData.school.school_name} has joined the platform as a ${triggerData.school.school_type} in ${triggerData.school.location}. Contact: ${triggerData.school.contact_person}. Please review and approve their registration.`;
      case 'new_job_post':
        return `A new ${triggerData.job.title} position has been posted by ${triggerData.job.school_name}. Location: ${triggerData.job.location}. Apply now to secure this opportunity!`;
      default:
        return 'New activity detected on the platform.';
    }
  }

  // Get alert type for notification styling
  private getAlertType(triggerType: string): 'info' | 'success' | 'warning' | 'error' {
    switch (triggerType) {
      case 'new_teacher':
      case 'new_school':
        return 'success';
      case 'new_job_post':
        return 'info';
      default:
        return 'info';
    }
  }

  // Get recipients based on configuration
  private async getRecipients(recipientConfigs: AlertRecipient[]): Promise<string[]> {
    const recipients: string[] = [];
    
    for (const config of recipientConfigs) {
      switch (config.type) {
        case 'admin':
          // Get all admin users
          const { data: adminUsers } = await dataService.getUsersByRole('admin');
          if (adminUsers) {
            recipients.push(...adminUsers.map(user => user.id));
          }
          break;
        case 'teachers':
          // Get all active teachers
          const { data: teachers } = await dataService.getUsersByRole('teacher');
          if (teachers) {
            recipients.push(...teachers.map(user => user.id));
          }
          break;
        case 'schools':
          // Get all active schools
          const { data: schools } = await dataService.getUsersByRole('school');
          if (schools) {
            recipients.push(...schools.map(user => user.id));
          }
          break;
        case 'specific_users':
          if (config.userIds) {
            recipients.push(...config.userIds);
          }
          break;
      }
    }
    
    return [...new Set(recipients)]; // Remove duplicates
  }

  // Send in-app notification
  private async sendInAppNotification(notification: AlertNotification) {
    // This would integrate with your in-app notification system
    // For now, we'll simulate the process
    console.log('📱 Sending in-app notification:', notification.title);
    
    // You can integrate this with your existing notification system
    // or create a new in-app notification store
  }

  // Send email notification
  private async sendEmailNotification(notification: AlertNotification, alertConfig: AlertConfig) {
    try {
      const emailTemplate = this.getEmailTemplate(alertConfig.emailTemplate, notification.triggerData);
      
      // Get recipient emails
      const recipientEmails = await this.getRecipientEmails(notification.recipients);
      
      if (recipientEmails.length === 0) {
        console.log('⚠️ No email recipients found for notification');
        return;
      }

      // Send bulk email
      const result = await emailService.sendBulkNotification({
        subject: notification.title,
        message: emailTemplate.content,
        recipients: this.mapRecipientsToEmailType(alertConfig.recipients),
        sender_email: 'alerts@mginvestments.ug',
        sender_name: 'MG Investments Alert System',
        priority: 'normal',
        status: 'sending'
      });

      if (result.success) {
        console.log(`📧 Email notification sent successfully: ${result.message}`);
      } else {
        console.error('❌ Failed to send email notification:', result.message);
      }
    } catch (error) {
      console.error('❌ Error sending email notification:', error);
    }
  }

  // Get email template for specific alert type
  private getEmailTemplate(templateId: string, triggerData: any) {
    const templates = {
      new_teacher_admin: {
        subject: `New Teacher Registration: ${triggerData.teacher.full_name}`,
        content: `
Dear Admin,

A new teacher has registered on the MG Investments platform:

👤 Name: ${triggerData.teacher.full_name}
📧 Email: ${triggerData.teacher.email}
📱 Phone: ${triggerData.teacher.phone_number}
📚 Subject: ${triggerData.teacher.subject_specialization}
🎓 Education: ${triggerData.teacher.education_level}
⏰ Experience: ${triggerData.teacher.experience_years} years
📍 Location: ${triggerData.teacher.location}

Please review their profile and approve their registration in the admin dashboard.

Best regards,
MG Investments Alert System
        `
      },
      new_school_admin: {
        subject: `New School Registration: ${triggerData.school.school_name}`,
        content: `
Dear Admin,

A new school has registered on the MG Investments platform:

🏫 School: ${triggerData.school.school_name}
👤 Contact: ${triggerData.school.contact_person}
📧 Email: ${triggerData.school.email}
📱 Phone: ${triggerData.school.phone_number}
🏷️ Type: ${triggerData.school.school_type}
📍 Location: ${triggerData.school.location}

Please review their registration and approve their account in the admin dashboard.

Best regards,
MG Investments Alert System
        `
      },
      new_job_post_teachers: {
        subject: `New Job Opportunity: ${triggerData.job?.title || 'Teaching Position'}`,
        content: `
Dear Teacher,

A new teaching opportunity has been posted on MG Investments:

💼 Position: ${triggerData.job?.title || 'Teaching Position'}
🏫 School: ${triggerData.job?.school_name || 'School Name'}
📍 Location: ${triggerData.job?.location || 'Location'}
💰 Salary: ${triggerData.job?.salary || 'Competitive'}

Don't miss this opportunity! Log in to your teacher portal to apply now.

Best regards,
MG Investments Team
        `
      },
      new_teacher_schools: {
        subject: `New Teacher Available: ${triggerData.teacher.subject_specialization} Specialist`,
        content: `
Dear School Administrator,

A new qualified teacher is now available on MG Investments:

👤 Teacher: ${triggerData.teacher.full_name}
📚 Subject: ${triggerData.teacher.subject_specialization}
🎓 Education: ${triggerData.teacher.education_level}
⏰ Experience: ${triggerData.teacher.experience_years} years
📍 Location: ${triggerData.teacher.location}

Visit your school portal to view their full profile and connect with them.

Best regards,
MG Investments Team
        `
      }
    };

    return templates[templateId] || {
      subject: 'Platform Notification',
      content: 'New activity on MG Investments platform.'
    };
  }

  // Get recipient emails from user IDs
  private async getRecipientEmails(userIds: string[]): Promise<string[]> {
    // This would fetch actual user emails from your database
    // For now, we'll return a simulated list
    return userIds.map(id => `user${id}@example.com`);
  }

  // Map recipients to email service format
  private mapRecipientsToEmailType(recipients: AlertRecipient[]): 'all' | 'teachers' | 'schools' | 'admins' {
    if (recipients.some(r => r.type === 'admin')) return 'admins';
    if (recipients.some(r => r.type === 'teachers')) return 'teachers';
    if (recipients.some(r => r.type === 'schools')) return 'schools';
    return 'all';
  }

  // Get alert configurations
  getAlertConfigs(): AlertConfig[] {
    return this.alertConfigs;
  }

  // Update alert configuration
  updateAlertConfig(id: string, updates: Partial<AlertConfig>): boolean {
    const index = this.alertConfigs.findIndex(config => config.id === id);
    if (index !== -1) {
      this.alertConfigs[index] = {
        ...this.alertConfigs[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return true;
    }
    return false;
  }

  // Get notification history
  getNotificationHistory(): AlertNotification[] {
    return this.pendingNotifications.slice().reverse(); // Most recent first
  }

  // Enable/disable alert
  toggleAlert(id: string, enabled: boolean): boolean {
    return this.updateAlertConfig(id, { enabled });
  }

  // Simulate job post creation (for demo purposes)
  async simulateJobPost() {
    const mockJobData = {
      title: 'Mathematics Teacher',
      school_name: 'Kampala International School',
      location: 'Kampala',
      salary: 'UGX 1,200,000 - 1,500,000',
      description: 'We are looking for an experienced Mathematics teacher...',
      requirements: 'Bachelor\'s degree in Mathematics or related field',
      posted_at: new Date().toISOString()
    };

    await this.triggerNewJobPostAlert(mockJobData);
    return mockJobData;
  }

  // Simulate teacher registration (for demo purposes)
  async simulateTeacherRegistration() {
    const mockTeacherData = {
      full_name: `Teacher ${Date.now()}`,
      email: `teacher${Date.now()}@example.com`,
      phone_number: `+25670${Math.floor(Math.random() * 10000000)}`,
      subject_specialization: ['Mathematics', 'English', 'Science', 'History'][Math.floor(Math.random() * 4)],
      education_level: 'Bachelor\'s Degree',
      experience_years: Math.floor(Math.random() * 10) + 1,
      location: ['Kampala', 'Entebbe', 'Jinja'][Math.floor(Math.random() * 3)],
      created_at: new Date().toISOString()
    };

    await this.triggerNewTeacherAlert(mockTeacherData);
    return mockTeacherData;
  }

  // Simulate school registration (for demo purposes)
  async simulateSchoolRegistration() {
    const mockSchoolData = {
      school_name: `School ${Date.now()}`,
      contact_person: `Contact Person ${Date.now()}`,
      email: `school${Date.now()}@example.com`,
      phone_number: `+25670${Math.floor(Math.random() * 10000000)}`,
      location: ['Kampala', 'Entebbe', 'Jinja', 'Mukono'][Math.floor(Math.random() * 4)],
      school_type: ['Private', 'Public', 'International'][Math.floor(Math.random() * 3)],
      created_at: new Date().toISOString()
    };

    await this.triggerNewSchoolAlert(mockSchoolData);
    return mockSchoolData;
  }
}

export const alertService = new AlertService();
