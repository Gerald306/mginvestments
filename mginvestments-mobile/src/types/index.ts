// User Types
export interface User {
  id: string;
  email: string;
  role: 'teacher' | 'school' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Teacher Types
export interface Teacher {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  subjects: string[];
  experience: number;
  qualifications: string[];
  bio: string;
  profileImage?: string;
  isActive: boolean;
  isApproved: boolean;
  isPushedToWebsite: boolean;
  isPartTime: boolean;
  profileViews: number;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// School Types
export interface School {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  description: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  isApproved: boolean;
  isPushedToWebsite: boolean;
  teacherCount: number;
  openJobsCount: number;
  isActivelyHiring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Job Application Types
export interface JobApplication {
  id: string;
  teacherId: string;
  schoolId: string;
  jobTitle: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: Date;
  respondedAt?: Date;
}

// Job Post Types
export interface JobPost {
  id: string;
  schoolId: string;
  title: string;
  subject: string;
  description: string;
  requirements: string[];
  location: string;
  salary?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  TeacherPortal: undefined;
  SchoolPortal: undefined;
  AdminDashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TeacherStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  JobSearch: undefined;
  Applications: undefined;
  Settings: undefined;
};

export type SchoolStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  TeacherSearch: undefined;
  JobPosts: undefined;
  Applications: undefined;
  Settings: undefined;
};

export type AdminStackParamList = {
  Dashboard: undefined;
  Teachers: undefined;
  Schools: undefined;
  Applications: undefined;
  Analytics: undefined;
  Settings: undefined;
};
