import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dataService } from '@/services/dataService';
import { firebase } from '@/integrations/firebase/client';
import { prepareTeachersForAdmin } from '@/utils/teacherDataSync';
import { alertService } from '@/services/alertService';

interface Teacher {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  subject_specialization: string;
  education_level: string;
  experience_years: string;
  location: string;
  salary_expectation: string;
  account_expiry: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  last_updated: string;
  profile_completion: number;
  views_count: number;
}

interface School {
  id: string;
  school_name: string;
  contact_person?: string;
  email: string;
  phone_number?: string;
  phone?: string;
  location: string;
  school_type: string;
  total_teachers?: number | string;
  created_at: string;
  is_active: boolean;
  subscription_status?: string;
  subscription_type?: 'basic' | 'standard' | 'premium';
  last_activity?: string;
  active_jobs?: number;
  website?: string;
}

interface Application {
  id: string;
  teacher_id: string;
  teacher_name: string;
  job_title: string;
  school_name: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'hired';
  applied_date: string;
  last_updated: string;
}

interface RealTimeStats {
  totalTeachers: number;
  activeTeachers: number;
  totalSchools: number;
  activeSchools: number;
  pendingApplications: number;
  expiringAccounts: number;
  todayRegistrations: number;
  monthlyGrowth: number;
}

interface RealTimeDataContextType {
  teachers: Teacher[];
  schools: School[];
  applications: Application[];
  stats: RealTimeStats;
  recentActivity: any[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'created_at' | 'last_updated'>) => Promise<void>;
  addSchool: (school: Omit<School, 'id' | 'created_at' | 'last_activity'>) => Promise<void>;
  updateTeacherStatus: (teacherId: string, isActive: boolean) => void;
  updateTeacherFeatured: (teacherId: string, isFeatured: boolean) => void;
  removeTeacher: (teacherId: string) => Promise<void>;
  getExpiringAccounts: () => Teacher[];
  refreshData: () => void;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};

interface RealTimeDataProviderProps {
  children: ReactNode;
}

export const RealTimeDataProvider: React.FC<RealTimeDataProviderProps> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<RealTimeStats>({
    totalTeachers: 0,
    activeTeachers: 0,
    totalSchools: 0,
    activeSchools: 0,
    pendingApplications: 0,
    expiringAccounts: 0,
    todayRegistrations: 0,
    monthlyGrowth: 15.2
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Mock initial data
  const mockTeachers: Teacher[] = [
    {
      id: '1',
      full_name: 'Sarah Nakamya',
      email: 'sarah.nakamya@email.com',
      phone_number: '+256701234567',
      subject_specialization: 'Mathematics',
      education_level: 'Bachelor\'s Degree',
      experience_years: '5',
      location: 'Kampala',
      salary_expectation: '1,000,000',
      account_expiry: '2024-12-31',
      is_active: true,
      is_featured: false,
      created_at: '2024-01-25T10:30:00Z',
      last_updated: '2024-01-25T10:30:00Z',
      profile_completion: 85,
      views_count: 23
    },
    {
      id: '2',
      full_name: 'John Ssali',
      email: 'john.ssali@email.com',
      phone_number: '+256702345678',
      subject_specialization: 'English',
      education_level: 'Master\'s Degree',
      experience_years: '7',
      location: 'Entebbe',
      salary_expectation: '1,200,000',
      account_expiry: '2024-02-15',
      is_active: true,
      is_featured: true,
      created_at: '2024-01-24T14:20:00Z',
      last_updated: '2024-01-25T09:15:00Z',
      profile_completion: 92,
      views_count: 45
    },
    {
      id: '3',
      full_name: 'Grace Achieng',
      email: 'grace.achieng@email.com',
      phone_number: '+256703456789',
      subject_specialization: 'Science',
      education_level: 'Bachelor\'s Degree',
      experience_years: '3',
      location: 'Jinja',
      salary_expectation: '900,000',
      account_expiry: '2024-01-30',
      is_active: true,
      is_featured: false,
      created_at: '2024-01-25T16:45:00Z',
      last_updated: '2024-01-25T16:45:00Z',
      profile_completion: 78,
      views_count: 12
    }
  ];

  const mockSchools: School[] = [
    {
      id: '1',
      school_name: 'Kampala International School',
      contact_person: 'Dr. James Mukasa',
      email: 'admin@kis.ac.ug',
      phone_number: '+256704567890',
      location: 'Kampala',
      school_type: 'International School',
      total_teachers: 45,
      created_at: '2024-01-20T09:00:00Z',
      is_active: true,
      subscription_status: 'Premium',
      last_activity: '2024-01-25T11:30:00Z'
    },
    {
      id: '2',
      school_name: 'St. Mary\'s College Kisubi',
      contact_person: 'Sister Mary Catherine',
      email: 'info@smack.ac.ug',
      phone_number: '+256705678901',
      location: 'Wakiso',
      school_type: 'Private School',
      total_teachers: 32,
      created_at: '2024-01-22T11:15:00Z',
      is_active: true,
      subscription_status: 'Standard',
      last_activity: '2024-01-24T15:20:00Z'
    }
  ];

  const mockApplications: Application[] = [
    {
      id: '1',
      teacher_id: '1',
      teacher_name: 'Sarah Nakamya',
      job_title: 'Mathematics Teacher',
      school_name: 'Kampala International School',
      status: 'pending',
      applied_date: '2024-01-25T08:00:00Z',
      last_updated: '2024-01-25T08:00:00Z'
    },
    {
      id: '2',
      teacher_id: '2',
      teacher_name: 'John Ssali',
      job_title: 'English Teacher',
      school_name: 'St. Mary\'s College',
      status: 'approved',
      applied_date: '2024-01-24T10:30:00Z',
      last_updated: '2024-01-25T09:15:00Z'
    }
  ];

  useEffect(() => {
    // Load real data from Firebase instead of mock data
    loadRealData();

    // Set up real-time updates
    const interval = setInterval(() => {
      loadRealData();
      updateRecentActivity();
    }, 10000); // Update every 10 seconds for real-time feel

    return () => clearInterval(interval);
  }, []);

  const loadRealData = async () => {
    try {
      // Fetch real teachers data
      const { data: teachersData } = await dataService.getTeachers();
      if (teachersData) {
        // Use the centralized utility function for consistency
        const preparedTeachers = prepareTeachersForAdmin(teachersData);
        setTeachers(preparedTeachers);
      }

      // Fetch real schools data
      const { data: schoolsData } = await dataService.getSchools();
      if (schoolsData) {
        setSchools(schoolsData);
      }

      // Fetch real applications data
      const { data: applicationsData } = await dataService.getApplications();
      if (applicationsData) {
        setApplications(applicationsData);
      }

      // Update stats with real data
      updateStats(
        teachersData || [],
        schoolsData || [],
        applicationsData || []
      );

    } catch (error) {
      console.error('Error loading real data:', error);
      // Fallback to mock data if real data fails
      setTeachers(mockTeachers);
      setSchools(mockSchools);
      setApplications(mockApplications);
      updateStats(mockTeachers, mockSchools, mockApplications);
    }
  };

  const updateStats = (teacherList: any[], schoolList: any[], applicationList: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayRegistrations = teacherList.filter(t =>
      t.created_at && t.created_at.split('T')[0] === today
    ).length;

    const expiringAccounts = teacherList.filter(t => {
      if (!t.account_expiry) return false;
      const expiry = new Date(t.account_expiry);
      const now = new Date();
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length;

    setStats({
      totalTeachers: teacherList.length,
      activeTeachers: teacherList.filter(t => t.is_active).length,
      totalSchools: schoolList.length,
      activeSchools: schoolList.filter(s => s.is_active).length,
      pendingApplications: applicationList.filter(a => a.status === 'pending').length,
      expiringAccounts,
      todayRegistrations,
      monthlyGrowth: 15.2
    });
  };

  const updateRecentActivity = () => {
    const activities = [
      { type: "Teacher Registration", name: "New teacher joined", time: "Just now", status: "success" },
      { type: "Application Submitted", name: "Math teacher applied", time: "2 min ago", status: "pending" },
      { type: "Profile Updated", name: "Teacher profile updated", time: "5 min ago", status: "info" },
      { type: "School Registration", name: "New school registered", time: "10 min ago", status: "success" }
    ];
    setRecentActivity(activities);
  };

  const addTeacher = async (teacherData: Omit<Teacher, 'id' | 'created_at' | 'last_updated'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      profile_completion: 60,
      views_count: 0
    };

    setTeachers(prev => {
      const updated = [newTeacher, ...prev];
      updateStats(updated, schools, applications);
      return updated;
    });

    // Add to recent activity
    setRecentActivity(prev => [
      { type: "Teacher Registration", name: `${newTeacher.full_name} joined`, time: "Just now", status: "success" },
      ...prev.slice(0, 9)
    ]);

    // Trigger automatic alerts
    try {
      await alertService.triggerNewTeacherAlert(newTeacher);
      console.log('✅ Teacher alerts triggered successfully');
    } catch (error) {
      console.error('❌ Error triggering teacher alerts:', error);
    }
  };

  const addSchool = async (schoolData: Omit<School, 'id' | 'created_at' | 'last_activity'>) => {
    const newSchool: School = {
      ...schoolData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    };

    setSchools(prev => {
      const updated = [newSchool, ...prev];
      updateStats(teachers, updated, applications);
      return updated;
    });

    // Add to recent activity
    setRecentActivity(prev => [
      { type: "School Registration", name: `${newSchool.school_name} registered`, time: "Just now", status: "success" },
      ...prev.slice(0, 9)
    ]);

    // Trigger automatic alerts
    try {
      await alertService.triggerNewSchoolAlert(newSchool);
      console.log('✅ School alerts triggered successfully');
    } catch (error) {
      console.error('❌ Error triggering school alerts:', error);
    }
  };

  const updateTeacherStatus = (teacherId: string, isActive: boolean) => {
    setTeachers(prev => {
      const updated = prev.map(teacher => 
        teacher.id === teacherId 
          ? { ...teacher, is_active: isActive, last_updated: new Date().toISOString() }
          : teacher
      );
      updateStats(updated, schools, applications);
      return updated;
    });
  };

  const updateTeacherFeatured = async (teacherId: string, isFeatured: boolean) => {
    try {
      // Update in database
      await dataService.updateTeacherFeatured(teacherId, isFeatured);

      // Update local state
      setTeachers(prev => {
        const updated = prev.map(teacher =>
          teacher.id === teacherId
            ? { ...teacher, is_featured: isFeatured, last_updated: new Date().toISOString() }
            : teacher
        );
        return updated;
      });
    } catch (error) {
      console.error('Error updating teacher featured status:', error);
    }
  };

  const removeTeacher = async (teacherId: string) => {
    try {
      // Remove from database
      await dataService.deleteTeacher(teacherId);

      // Update local state
      setTeachers(prev => {
        const updated = prev.filter(teacher => teacher.id !== teacherId);
        updateStats(updated, schools, applications);
        return updated;
      });

      // Add to recent activity
      setRecentActivity(prev => [
        { type: "Teacher Removal", name: "Duplicate teacher record removed", time: "Just now", status: "warning" },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      console.error('Error removing teacher:', error);
      throw error;
    }
  };

  const getExpiringAccounts = () => {
    return teachers.filter(teacher => {
      const expiry = new Date(teacher.account_expiry);
      const now = new Date();
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    });
  };

  const refreshData = async () => {
    // Refresh real data from Firebase
    await loadRealData();
    updateRecentActivity();
  };

  const value: RealTimeDataContextType = {
    teachers,
    schools,
    applications,
    stats,
    recentActivity,
    addTeacher,
    addSchool,
    updateTeacherStatus,
    updateTeacherFeatured,
    removeTeacher,
    getExpiringAccounts,
    refreshData
  };

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
};
