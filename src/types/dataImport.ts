// Data Import Types for Admin System

export interface ImportedTeacher {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  experience_years: number;
  education_level: string;
  location: string;
  bio: string;
  hourly_rate: number;
  availability: string;
  languages: string[];
  certifications: string[];
  profile_image?: string;
  status: 'pending' | 'approved' | 'rejected';
  import_date: string;
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
}

export interface ImportedSchool {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  type: string;
  description: string;
  website?: string;
  established_year: number;
  student_count: number;
  teacher_count: number;
  facilities: string[];
  subscription_plan: 'basic' | 'standard' | 'premium';
  status: 'pending' | 'approved' | 'rejected';
  import_date: string;
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
}

export interface ImportedJobPosting {
  id?: string;
  title: string;
  school_name: string;
  school_id?: string;
  subject: string;
  description: string;
  requirements: string[];
  salary_range: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract';
  application_deadline: string;
  posted_date: string;
  status: 'pending' | 'approved' | 'rejected';
  import_date: string;
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
}

export interface ImportSession {
  id: string;
  file_name: string;
  file_type: 'csv' | 'excel' | 'json';
  import_type: 'teachers' | 'schools' | 'jobs';
  total_records: number;
  successful_imports: number;
  failed_imports: number;
  pending_approvals: number;
  approved_records: number;
  rejected_records: number;
  imported_by: string;
  import_date: string;
  status: 'processing' | 'completed' | 'failed';
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  field: string;
  value: string;
  error: string;
  severity: 'error' | 'warning';
}

export interface DataApprovalRequest {
  id: string;
  type: 'teacher' | 'school' | 'job';
  data: ImportedTeacher | ImportedSchool | ImportedJobPosting;
  import_session_id: string;
  requested_by: string;
  request_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  review_date?: string;
  review_notes?: string;
}

export interface BulkApprovalAction {
  action: 'approve' | 'reject';
  record_ids: string[];
  notes?: string;
}

export interface ImportValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'email' | 'phone' | 'date' | 'array';
  min_length?: number;
  max_length?: number;
  pattern?: string;
  allowed_values?: string[];
}

export interface ImportTemplate {
  type: 'teachers' | 'schools' | 'jobs';
  name: string;
  description: string;
  fields: ImportValidationRule[];
  sample_data: Record<string, any>[];
}

// Import Statistics
export interface ImportStats {
  total_imports: number;
  pending_approvals: number;
  approved_today: number;
  rejected_today: number;
  success_rate: number;
  most_imported_type: string;
  recent_sessions: ImportSession[];
}

// Website Publishing
export interface PublishingStatus {
  teachers: {
    total: number;
    published: number;
    pending: number;
    last_published: string;
  };
  schools: {
    total: number;
    published: number;
    pending: number;
    last_published: string;
  };
  jobs: {
    total: number;
    published: number;
    pending: number;
    last_published: string;
  };
  website_status: 'live' | 'maintenance' | 'updating';
  last_full_publish: string;
}

export interface PublishRequest {
  type: 'teachers' | 'schools' | 'jobs' | 'all';
  record_ids?: string[];
  publish_immediately: boolean;
  scheduled_time?: string;
  notes?: string;
}
