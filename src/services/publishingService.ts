import { dataService } from './dataService';
import { Teacher, School, JobApplication } from './dataService';

export interface PublishableContent {
  id: string;
  type: 'teacher' | 'school' | 'job' | 'announcement';
  title: string;
  content: any;
  status: 'draft' | 'pending' | 'published' | 'archived';
  featured: boolean;
  publish_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    views?: number;
    clicks?: number;
    engagement_score?: number;
  };
}

export interface WebsiteSection {
  id: string;
  name: string;
  slug: string;
  description: string;
  content_types: string[];
  is_active: boolean;
  display_order: number;
}

export interface PublishingStats {
  total_published: number;
  pending_review: number;
  featured_content: number;
  total_views: number;
  engagement_rate: number;
  top_performing: PublishableContent[];
}

class PublishingService {
  // Get all publishable content from different sections
  async getAllPublishableContent(): Promise<{
    teachers: Teacher[];
    schools: School[];
    applications: JobApplication[];
    announcements: any[];
  }> {
    try {
      const [teachersResult, schoolsResult, applicationsResult] = await Promise.all([
        dataService.getTeachers(),
        dataService.getSchools(),
        dataService.getApplications()
      ]);

      // Mock announcements for now
      const announcements = [
        {
          id: 'ann_1',
          title: 'New Teacher Registration Open',
          content: 'We are now accepting applications from qualified teachers...',
          type: 'announcement',
          status: 'published',
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 'ann_2',
          title: 'School Partnership Program',
          content: 'Join our exclusive school partnership program...',
          type: 'announcement',
          status: 'published',
          featured: false,
          created_at: new Date().toISOString()
        }
      ];

      return {
        teachers: teachersResult.data || [],
        schools: schoolsResult.data || [],
        applications: applicationsResult.data || [],
        announcements
      };
    } catch (error) {
      console.error('Error fetching publishable content:', error);
      return {
        teachers: [],
        schools: [],
        applications: [],
        announcements: []
      };
    }
  }

  // Get content ready for publishing (approved and active)
  async getPublishReadyContent(): Promise<PublishableContent[]> {
    const allContent = await this.getAllPublishableContent();
    const publishableItems: PublishableContent[] = [];

    // Convert teachers to publishable content
    allContent.teachers
      .filter(teacher => teacher.is_active && teacher.status === 'approved')
      .forEach(teacher => {
        publishableItems.push({
          id: `teacher_${teacher.id}`,
          type: 'teacher',
          title: `${teacher.full_name} - ${teacher.subject_specialization}`,
          content: teacher,
          status: teacher.is_featured ? 'published' : 'pending',
          featured: teacher.is_featured || false,
          created_by: 'system',
          created_at: teacher.created_at || new Date().toISOString(),
          updated_at: teacher.updated_at || new Date().toISOString(),
          metadata: {
            views: teacher.views_count || 0,
            engagement_score: this.calculateEngagementScore(teacher)
          }
        });
      });

    // Convert schools to publishable content
    allContent.schools
      .filter(school => school.is_active && school.status === 'approved')
      .forEach(school => {
        publishableItems.push({
          id: `school_${school.id}`,
          type: 'school',
          title: `${school.school_name} - ${school.school_type}`,
          content: school,
          status: 'published',
          featured: false,
          created_by: 'system',
          created_at: school.created_at || new Date().toISOString(),
          updated_at: school.updated_at || new Date().toISOString(),
          metadata: {
            views: 0,
            engagement_score: this.calculateSchoolEngagementScore(school)
          }
        });
      });

    // Add announcements
    allContent.announcements.forEach(announcement => {
      publishableItems.push({
        id: announcement.id,
        type: 'announcement',
        title: announcement.title,
        content: announcement,
        status: announcement.status,
        featured: announcement.featured,
        created_by: 'admin',
        created_at: announcement.created_at,
        updated_at: announcement.created_at,
        metadata: {
          views: 0,
          engagement_score: 0
        }
      });
    });

    return publishableItems.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  // Publish content to website
  async publishToWebsite(contentIds: string[], options: {
    immediate?: boolean;
    scheduled_date?: string;
    featured?: boolean;
    sections?: string[];
  } = {}): Promise<{
    success: boolean;
    published_count: number;
    failed_count: number;
    message: string;
  }> {
    try {
      const publishableContent = await this.getPublishReadyContent();
      const contentToPublish = publishableContent.filter(item => 
        contentIds.includes(item.id)
      );

      if (contentToPublish.length === 0) {
        return {
          success: false,
          published_count: 0,
          failed_count: 0,
          message: 'No valid content found to publish'
        };
      }

      // Simulate publishing process
      let publishedCount = 0;
      let failedCount = 0;

      for (const content of contentToPublish) {
        try {
          // Simulate API call to website CMS
          await this.publishSingleItem(content, options);
          publishedCount++;
        } catch (error) {
          console.error(`Failed to publish ${content.id}:`, error);
          failedCount++;
        }
      }

      return {
        success: publishedCount > 0,
        published_count: publishedCount,
        failed_count: failedCount,
        message: `Successfully published ${publishedCount} items${failedCount > 0 ? `, ${failedCount} failed` : ''}`
      };
    } catch (error) {
      console.error('Error publishing to website:', error);
      return {
        success: false,
        published_count: 0,
        failed_count: 0,
        message: 'Failed to publish content to website'
      };
    }
  }

  // Publish single item
  private async publishSingleItem(content: PublishableContent, options: any): Promise<void> {
    // Simulate publishing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Here you would make actual API calls to your website CMS
    console.log(`Publishing ${content.type}: ${content.title}`);
    
    // Update content status
    content.status = 'published';
    content.publish_date = options.immediate ? new Date().toISOString() : options.scheduled_date;
    content.featured = options.featured || content.featured;
  }

  // Calculate engagement score for teachers
  private calculateEngagementScore(teacher: Teacher): number {
    let score = 0;
    
    // Base score from profile completeness
    if (teacher.full_name) score += 10;
    if (teacher.email) score += 10;
    if (teacher.phone) score += 10;
    if (teacher.subject_specialization) score += 15;
    if (teacher.experience_years && teacher.experience_years > 0) score += 15;
    if (teacher.education_level) score += 10;
    if (teacher.location) score += 10;
    
    // Bonus for being featured
    if (teacher.is_featured) score += 20;
    
    // Views contribution
    if (teacher.views_count) score += Math.min(teacher.views_count * 0.1, 20);
    
    return Math.round(score);
  }

  // Calculate engagement score for schools
  private calculateSchoolEngagementScore(school: School): number {
    let score = 0;
    
    if (school.school_name) score += 15;
    if (school.contact_email) score += 10;
    if (school.phone_number) score += 10;
    if (school.location) score += 10;
    if (school.school_type) score += 15;
    if (school.website) score += 20;
    if (school.established_year) score += 10;
    
    return Math.round(score);
  }

  // Get website sections
  async getWebsiteSections(): Promise<WebsiteSection[]> {
    return [
      {
        id: 'teachers',
        name: 'Teachers Directory',
        slug: 'teachers',
        description: 'Browse qualified teachers available for hire',
        content_types: ['teacher'],
        is_active: true,
        display_order: 1
      },
      {
        id: 'schools',
        name: 'Partner Schools',
        slug: 'schools',
        description: 'Educational institutions in our network',
        content_types: ['school'],
        is_active: true,
        display_order: 2
      },
      {
        id: 'jobs',
        name: 'Job Opportunities',
        slug: 'jobs',
        description: 'Teaching positions available',
        content_types: ['job'],
        is_active: true,
        display_order: 3
      },
      {
        id: 'news',
        name: 'News & Announcements',
        slug: 'news',
        description: 'Latest updates and announcements',
        content_types: ['announcement'],
        is_active: true,
        display_order: 4
      }
    ];
  }

  // Get publishing statistics
  async getPublishingStats(): Promise<PublishingStats> {
    const content = await this.getPublishReadyContent();
    
    const published = content.filter(item => item.status === 'published');
    const pending = content.filter(item => item.status === 'pending');
    const featured = content.filter(item => item.featured);
    
    const totalViews = content.reduce((sum, item) => sum + (item.metadata?.views || 0), 0);
    const engagementRate = content.length > 0 ? 
      content.reduce((sum, item) => sum + (item.metadata?.engagement_score || 0), 0) / content.length : 0;
    
    const topPerforming = content
      .sort((a, b) => (b.metadata?.engagement_score || 0) - (a.metadata?.engagement_score || 0))
      .slice(0, 5);

    return {
      total_published: published.length,
      pending_review: pending.length,
      featured_content: featured.length,
      total_views: totalViews,
      engagement_rate: Math.round(engagementRate),
      top_performing: topPerforming
    };
  }

  // Feature/unfeature content
  async toggleFeatured(contentId: string, featured: boolean): Promise<boolean> {
    try {
      // Extract type and ID from contentId
      const [type, id] = contentId.split('_');
      
      if (type === 'teacher') {
        // Update teacher featured status
        await dataService.updateTeacher(id, { is_featured: featured });
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      return false;
    }
  }
}

export const publishingService = new PublishingService();
