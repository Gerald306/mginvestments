import { supabase } from '@/integrations/supabase/client';

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
      const result = await supabase
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
      const result = await supabase
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

  // Fetch featured teachers (top 6 by views) - only approved
  async getFeaturedTeachers(): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await supabase
        .from('teachers')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved')
        .gte('account_expiry', today)
        .order('views_count', { ascending: false })
        .limit(6);

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching featured teachers:', error);
      return { data: null, error };
    }
  }

  // Fetch approved teachers only (for public display)
  async getApprovedTeachers(): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await supabase
        .from('teachers')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved')
        .gte('account_expiry', today)
        .order('views_count', { ascending: false });

      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error fetching approved teachers:', error);
      return { data: null, error };
    }
  }

  // Fetch all schools
  async getSchools(): Promise<{ data: School[] | null; error: any }> {
    try {
      const result = await supabase
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
      const result = await supabase
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
      const result = await supabase
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
      const result = await supabase
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
        supabase.from('teachers').select('*', { count: 'exact' }).eq('is_active', true),
        supabase.from('schools').select('*', { count: 'exact' }).eq('is_active', true),
        supabase.from('applications').select('*', { count: 'exact' })
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
      const result = await supabase
        .from('teachers')
        .insert([teacherData]);
      
      return {
        data: result.data?.[0] || null,
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
      const result = await supabase
        .from('schools')
        .insert([schoolData]);
      
      return {
        data: result.data?.[0] || null,
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
      const result = await supabase
        .from('teachers')
        .update({ is_active: isActive })
        .eq('id', teacherId);
      
      return {
        data: result.data,
        error: result.error
      };
    } catch (error) {
      console.error('Error updating teacher status:', error);
      return { data: null, error };
    }
  }

  // Search teachers by subject or name
  async searchTeachers(query: string): Promise<{ data: Teacher[] | null; error: any }> {
    try {
      const result = await supabase
        .from('teachers')
        .select('*')
        .eq('is_active', true)
        .or(`full_name.ilike.%${query}%,subject_specialization.ilike.%${query}%`);
      
      return {
        data: result.data || [],
        error: result.error
      };
    } catch (error) {
      console.error('Error searching teachers:', error);
      return { data: null, error };
    }
  }
}

// Create and export a singleton instance
export const dataService = new DataService();
export default dataService;
