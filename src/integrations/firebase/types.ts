// Firebase types to replace Supabase types

export interface Teacher {
  id: string;
  full_name: string;
  subject_specialization: string;
  experience_years: number;
  education_level: string;
  teaching_levels: string[];
  views_count: number;
  status: string;
  account_expiry: string;
  profile_image?: string;
  age: number;
  detailed_experience?: string;
  is_active?: boolean;
  is_hired?: boolean;
  location?: string;
  phone_number?: string;
  profile_id?: string;
  salary_expectation?: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface School {
  id: string;
  school_name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  location: string;
  school_type: string;
  description?: string;
  established_year?: number;
  total_teachers?: number;
  active_jobs?: number;
  profile_id?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'school';
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  subject: string;
  teaching_levels: string[];
  description?: string;
  requirements?: string;
  salary_range?: string;
  application_deadline?: string;
  is_active?: boolean;
  school_id?: string;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id?: string;
  teacher_id?: string;
  status?: string;
  cover_letter?: string;
  applied_at: string;
  reviewed_at?: string;
}

export type UserRole = 'admin' | 'teacher' | 'school';

// Database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: any;
  count?: number;
}

export interface DatabaseListResponse<T> {
  data: T[] | null;
  error: any;
  count?: number;
}
