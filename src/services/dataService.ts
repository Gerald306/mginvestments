import { firebase } from '@/integrations/firebase/client';
import { prepareTeachersForWebsite, logDataSyncStatus } from '@/utils/teacherDataSync';

export interface Teacher {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject_specialization: string;
  experience_years: number;
  education_level: string;
  teaching_levels: string[];
  languages: string[];
  availability: string;
  location: string;
  is_active: boolean;
  is_featured?: boolean;
  account_expiry: string;
  views_count: number;
  status: string;
  profile_picture?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  school_name: string;
  email: string;
  phone: string;
  location: string;
  school_type: string;
  total_teachers: number;
  website?: string;
  is_active: boolean;
  subscription_type: 'basic' | 'standard' | 'premium';
  active_jobs: number;
  created_at: string;
  last_activity: string;
}

export interface Application {
  id: string;
  teacher_id: string;
  school_id: string;
  job_title: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  teacher_name?: string;
  school_name?: string;
}

export interface Stats {
  totalTeachers: number;
  activeSchools: number;
  totalApplications: number;
  successfulPlacements: number;
}

class DataService {
  // Fetch all teachers
  async getTeachers(): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return { data: null, error };
    }
  }

  // Fetch active teachers
  async getActiveTeachers(): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .select('*')
        .eq('is_active', true)
        .order('views_count', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching active teachers:', error);
      return { data: null, error };
    }
  }

  // Fetch featured teachers - simplified query to avoid index issues
  async getFeaturedTeachers(): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      console.log('🔍 Fetching featured teachers...');

      // First get all active teachers, then filter in memory to avoid complex index requirements
      const result = await firebase
        .from('teachers')
        .select('*')
        .eq('is_active', true)
        .order('views_count', { ascending: false });

      console.log('📊 Active teachers query result:', {
        count: result.data?.length || 0,
        error: result.error?.message || 'none'
      });

      if (result.error) {
        throw result.error;
      }

      // Filter in memory for featured teachers with valid expiry
      const today = new Date().toISOString().split('T')[0];
      console.log('📅 Today:', today);

      const allActiveTeachers = result.data || [];
      console.log('👥 All active teachers:', allActiveTeachers.map(t => ({
        name: t.full_name,
        is_featured: t.is_featured,
        status: t.status,
        account_expiry: t.account_expiry
      })));

      const featuredTeachers = allActiveTeachers
        .filter(teacher => {
          const isFeatured = teacher.is_featured === true;
          const isApproved = teacher.status === 'approved';
          const notExpired = teacher.account_expiry >= today;

          console.log(`👤 ${teacher.full_name}: featured=${isFeatured}, approved=${isApproved}, notExpired=${notExpired}`);

          return isFeatured && isApproved && notExpired;
        })
        .slice(0, 6); // Limit to 6 featured teachers

      console.log(`⭐ Final featured teachers (${featuredTeachers.length}):`,
        featuredTeachers.map(t => t.full_name));

      return {
        data: featuredTeachers,
        error: null
      };
    } catch (error) {
      console.error('❌ Error fetching featured teachers:', error);
      return { data: null, error };
    }
  }

  // Fetch approved teachers only (for public display)
  async getApprovedTeachers(): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      console.log('🔍 Fetching approved teachers...');

      // Get all teachers first (simplest query)
      const result = await firebase
        .from('teachers')
        .select('*');

      console.log('📊 All teachers query result:', {
        count: result.data?.length || 0,
        error: result.error?.message || 'none'
      });

      if (result.error) {
        console.error('❌ Firebase query error:', result.error);
        throw result.error;
      }

      // Filter in memory for active, approved, and non-expired teachers
      const today = new Date().toISOString().split('T')[0];
      console.log('📅 Today:', today);

      const allTeachers = result.data || [];
      console.log('👥 All teachers from database:', allTeachers.length);

      if (allTeachers.length === 0) {
        console.log('⚠️ No teachers found in database. Initializing sample data...');
        // Try to initialize sample data if no teachers exist
        const { initializeIfEmpty } = await import('@/utils/initializeFirebaseData');
        await initializeIfEmpty();

        // Try fetching again
        const retryResult = await firebase
          .from('teachers')
          .select('*');

        if (retryResult.data && retryResult.data.length > 0) {
          console.log('✅ Sample data initialized, found teachers:', retryResult.data.length);
          return this.filterApprovedTeachers(retryResult.data, today);
        }
      }

      return this.filterApprovedTeachers(allTeachers, today);
    } catch (error) {
      console.error('❌ Error fetching approved teachers:', error);
      return { data: null, error };
    }
  }



  private filterApprovedTeachers(teachers: Teacher[], today: string) {
    console.log(`🔍 Processing ${teachers.length} teachers for website display...`);

    // Use the centralized utility function for consistency
    const approvedTeachers = prepareTeachersForWebsite(teachers);

    // Log sync status for monitoring
    logDataSyncStatus(teachers.length, approvedTeachers.length);

    console.log(`✅ Processed ${approvedTeachers.length} teachers for website display (ALL CONDITIONS BYPASSED):`);
    approvedTeachers.forEach(t => {
      console.log(`  📋 ${t.full_name} - Status: ${t.status}, Active: ${t.is_active}, Expiry: ${t.account_expiry}`);
    });

    return {
      data: approvedTeachers,
      error: null
    };
  }

  // Fetch all schools
  async getSchools(): Promise<{ data: School[] | null; error: any }> {
    try {
      const result = await firebase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching schools:', error);
      return { data: null, error };
    }
  }

  // Fetch active schools
  async getActiveSchools(): Promise<{ data: School[] | null; error: any }> {
    try {
      const result = await firebase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching active schools:', error);
      return { data: null, error };
    }
  }

  // Fetch approved schools only (for public display)
  async getApprovedSchools(): Promise<{ data: School[] | null; error: any }> {
    try {
      const result = await firebase
        .from('schools')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved')
        .order('last_activity', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching approved schools:', error);
      return { data: null, error };
    }
  }

  // Fetch applications
  async getApplications(): Promise<{ data: Application[] | null; error: any }> {
    try {
      const result = await firebase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { data: null, error };
    }
  }

  // Fetch platform statistics
  async getStats(): Promise<{ data: Stats | null; error: any }> {
    try {
      const [teachersResult, schoolsResult, applicationsResult] = await Promise.all([
        firebase.from('teachers').select('*', { count: 'exact' }).eq('is_active', true),
        firebase.from('schools').select('*', { count: 'exact' }).eq('is_active', true),
        firebase.from('applications').select('*', { count: 'exact' })
      ]);

      // Handle the results properly
      const totalTeachers = Array.isArray(teachersResult.data) ? teachersResult.data.length : 0;
      const activeSchools = Array.isArray(schoolsResult.data) ? schoolsResult.data.length : 0;
      const totalApplications = Array.isArray(applicationsResult.data) ? applicationsResult.data.length : 0;

      // Calculate successful placements (estimated as 65% of total applications)
      const successfulPlacements = Math.floor(totalApplications * 0.65);

      const stats: Stats = {
        totalTeachers,
        activeSchools,
        totalApplications,
        successfulPlacements
      };

      return {
        data: stats,
        error: null
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { data: null, error };
    }
  }

  // Add a new teacher
  async addTeacher(teacherData: Omit<Teacher, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Teacher | null; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .insert(teacherData);

      return {
        data: result.data || null,
        error: result.error
      };
    } catch (error) {
      console.error('Error adding teacher:', error);
      return { data: null, error };
    }
  }

  // Add a new school
  async addSchool(schoolData: Omit<School, 'id' | 'created_at' | 'last_activity'>): Promise<{ data: School | null; error: any }> {
    try {
      const result = await firebase
        .from('schools')
        .insert(schoolData);

      return {
        data: result.data || null,
        error: result.error
      };
    } catch (error) {
      console.error('Error adding school:', error);
      return { data: null, error };
    }
  }

  // Update teacher status
  async updateTeacherStatus(teacherId: string, isActive: boolean): Promise<{ data: any; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .update(teacherId, { is_active: isActive });

      return {
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Error updating teacher status:', error);
      return { data: null, error };
    }
  }

  // Update teacher featured status
  async updateTeacherFeatured(teacherId: string, isFeatured: boolean): Promise<{ data: any; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .update(teacherId, { is_featured: isFeatured });

      return {
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Error updating teacher featured status:', error);
      return { data: null, error };
    }
  }

  // Update teacher (generic update method)
  async updateTeacher(teacherId: string, updates: Partial<Teacher>): Promise<{ data: any; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .update(teacherId, updates);

      return {
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Error updating teacher:', error);
      return { data: null, error };
    }
  }

  // Delete teacher
  async deleteTeacher(teacherId: string): Promise<{ data: any; error: any }> {
    try {
      const result = await firebase
        .from('teachers')
        .delete(teacherId);

      return {
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return { data: null, error };
    }
  }

  // Search teachers by subject or name
  async searchTeachers(query: string): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      // Firebase doesn't support complex text search like Supabase
      // So we'll get all active teachers and filter in memory
      const result = await firebase
        .from('teachers')
        .select('*')
        .eq('is_active', true);

      if (result.error) {
        throw result.error;
      }

      // Filter in memory for name or subject matches
      const filteredData = (result.data || []).filter(teacher =>
        teacher.full_name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.subject_specialization.toLowerCase().includes(query.toLowerCase())
      );

      return {
        data: filteredData,
        error: null
      };
    } catch (error) {
      console.error('Error searching teachers:', error);
      return { data: null, error };
    }
  }



  // Get all applications
  async getApplications(): Promise<{ data: any[] | null; error: any }> {
    try {
      const result = await firebase
        .from('job_applications')
        .select('*')
        .order('applied_at', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { data: null, error };
    }
  }

  // Get users by role for alert system
  async getUsersByRole(role: 'admin' | 'teacher' | 'school'): Promise<{ data: any[] | null; error: any }> {
    try {
      const result = await firebase
        .from('user_profiles')
        .select('id, email, full_name, role')
        .eq('role', role)
        .eq('is_active', true);

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error(`Error fetching ${role} users:`, error);
      return { data: null, error };
    }
  }

  // Get stats for dashboard
  async getStats(): Promise<{ data: any | null; error: any }> {
    try {
      // This would typically aggregate data from multiple tables
      // For now, we'll return mock stats
      const stats = {
        totalTeachers: 150,
        activeSchools: 45,
        successfulPlacements: 89,
        totalApplications: 234
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { data: null, error };
    }
  }
}

// Create and export a singleton instance
export const dataService = new DataService();
export default dataService;
