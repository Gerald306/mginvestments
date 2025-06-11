import { dataService } from './dataService';

export interface EmailNotification {
  id?: string;
  subject: string;
  message: string;
  recipients: 'all' | 'teachers' | 'schools' | 'admins';
  sender_email: string;
  sender_name: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_at?: string;
  sent_at?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  recipient_count?: number;
  success_count?: number;
  failure_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: 'notification' | 'welcome' | 'reminder' | 'announcement';
  created_at: string;
}

export interface EmailRecipient {
  email: string;
  name: string;
  role: 'teacher' | 'school' | 'admin';
  id: string;
}

class EmailService {
  private apiEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';
  private serviceId = 'service_mginvestments'; // EmailJS service ID
  private templateId = 'template_notification'; // EmailJS template ID
  private publicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with actual key

  // Initialize EmailJS (you'll need to set up EmailJS account)
  private initializeEmailJS() {
    // This would be initialized with your EmailJS configuration
    console.log('EmailJS initialized for MG Investments');
  }

  // Get all email recipients based on type
  async getRecipients(type: 'all' | 'teachers' | 'schools' | 'admins'): Promise<EmailRecipient[]> {
    const recipients: EmailRecipient[] = [];

    try {
      if (type === 'all' || type === 'teachers') {
        const { data: teachers } = await dataService.getTeachers();
        if (teachers) {
          teachers.forEach(teacher => {
            if (teacher.email && teacher.is_active) {
              recipients.push({
                email: teacher.email,
                name: teacher.full_name || 'Teacher',
                role: 'teacher',
                id: teacher.id
              });
            }
          });
        }
      }

      if (type === 'all' || type === 'schools') {
        const { data: schools } = await dataService.getSchools();
        if (schools) {
          schools.forEach(school => {
            if (school.contact_email && school.is_active) {
              recipients.push({
                email: school.contact_email,
                name: school.school_name || 'School',
                role: 'school',
                id: school.id
              });
            }
          });
        }
      }

      if (type === 'all' || type === 'admins') {
        // Add admin emails (you can store these in your database or config)
        const adminEmails = [
          { email: 'admin@mginvestments.ug', name: 'Admin Team', id: 'admin-1' },
          { email: 'info@mginvestments.ug', name: 'Info Team', id: 'admin-2' }
        ];
        
        adminEmails.forEach(admin => {
          recipients.push({
            email: admin.email,
            name: admin.name,
            role: 'admin',
            id: admin.id
          });
        });
      }

      return recipients;
    } catch (error) {
      console.error('Error getting recipients:', error);
      return [];
    }
  }

  // Send email notification to multiple recipients
  async sendBulkNotification(notification: Omit<EmailNotification, 'id' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    notification_id?: string;
    message: string;
    recipient_count: number;
    success_count: number;
    failure_count: number;
  }> {
    try {
      // Get recipients
      const recipients = await this.getRecipients(notification.recipients);
      
      if (recipients.length === 0) {
        return {
          success: false,
          message: 'No active recipients found for the selected group',
          recipient_count: 0,
          success_count: 0,
          failure_count: 0
        };
      }

      // Create notification record
      const emailNotification: EmailNotification = {
        ...notification,
        id: `email_${Date.now()}`,
        status: 'sending',
        recipient_count: recipients.length,
        success_count: 0,
        failure_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store notification in database (you can implement this with your database)
      await this.saveNotification(emailNotification);

      // Send emails (simulate for now - replace with actual email service)
      let successCount = 0;
      let failureCount = 0;

      for (const recipient of recipients) {
        try {
          await this.sendSingleEmail({
            to: recipient.email,
            toName: recipient.name,
            subject: notification.subject,
            message: this.personalizeMessage(notification.message, recipient),
            senderName: notification.sender_name,
            senderEmail: notification.sender_email,
            priority: notification.priority
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          failureCount++;
        }
      }

      // Update notification status
      emailNotification.status = failureCount === 0 ? 'sent' : 'sent';
      emailNotification.success_count = successCount;
      emailNotification.failure_count = failureCount;
      emailNotification.sent_at = new Date().toISOString();
      emailNotification.updated_at = new Date().toISOString();

      await this.updateNotification(emailNotification);

      return {
        success: true,
        notification_id: emailNotification.id,
        message: `Email sent successfully to ${successCount} recipients${failureCount > 0 ? ` (${failureCount} failed)` : ''}`,
        recipient_count: recipients.length,
        success_count: successCount,
        failure_count: failureCount
      };

    } catch (error) {
      console.error('Error sending bulk notification:', error);
      return {
        success: false,
        message: 'Failed to send email notification',
        recipient_count: 0,
        success_count: 0,
        failure_count: 0
      };
    }
  }

  // Send single email (implement with your preferred email service)
  private async sendSingleEmail(emailData: {
    to: string;
    toName: string;
    subject: string;
    message: string;
    senderName: string;
    senderEmail: string;
    priority: string;
  }): Promise<void> {
    // Simulate email sending (replace with actual email service like EmailJS, SendGrid, etc.)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          console.log(`✅ Email sent to ${emailData.to}: ${emailData.subject}`);
          resolve();
        } else {
          reject(new Error('Simulated email failure'));
        }
      }, 100);
    });
  }

  // Personalize message with recipient data
  private personalizeMessage(message: string, recipient: EmailRecipient): string {
    return message
      .replace(/\{name\}/g, recipient.name)
      .replace(/\{email\}/g, recipient.email)
      .replace(/\{role\}/g, recipient.role);
  }

  // Save notification to database
  private async saveNotification(notification: EmailNotification): Promise<void> {
    // Implement database save logic
    console.log('Saving notification:', notification.id);
  }

  // Update notification in database
  private async updateNotification(notification: EmailNotification): Promise<void> {
    // Implement database update logic
    console.log('Updating notification:', notification.id);
  }

  // Get email templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return [
      {
        id: 'welcome',
        name: 'Welcome Message',
        subject: 'Welcome to MG Investments Educational Platform',
        content: 'Dear {name},\n\nWelcome to MG Investments! We are excited to have you join our educational platform.\n\nBest regards,\nMG Investments Team',
        variables: ['name'],
        category: 'welcome',
        created_at: new Date().toISOString()
      },
      {
        id: 'announcement',
        name: 'General Announcement',
        subject: 'Important Announcement from MG Investments',
        content: 'Dear {name},\n\n{message}\n\nThank you for your attention.\n\nBest regards,\nMG Investments Team',
        variables: ['name', 'message'],
        category: 'announcement',
        created_at: new Date().toISOString()
      },
      {
        id: 'reminder',
        name: 'Reminder Notice',
        subject: 'Reminder: {subject}',
        content: 'Dear {name},\n\nThis is a friendly reminder about: {message}\n\nPlease take the necessary action.\n\nBest regards,\nMG Investments Team',
        variables: ['name', 'subject', 'message'],
        category: 'reminder',
        created_at: new Date().toISOString()
      }
    ];
  }

  // Get notification history
  async getNotificationHistory(): Promise<EmailNotification[]> {
    // Implement database query for notification history
    return [];
  }
}

export const emailService = new EmailService();
