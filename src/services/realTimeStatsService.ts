import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export interface RealTimeStats {
  totalTeachers: number;
  activeSchools: number;
  successfulPlacements: number;
  totalApplications: number;
  lastUpdated: string;
}

export interface StatsListener {
  (stats: RealTimeStats): void;
}

class RealTimeStatsService {
  private listeners: Set<StatsListener> = new Set();
  private unsubscribers: (() => void)[] = [];
  private currentStats: RealTimeStats = {
    totalTeachers: 0,
    activeSchools: 0,
    successfulPlacements: 0,
    totalApplications: 0,
    lastUpdated: new Date().toISOString()
  };

  constructor() {
    this.initializeRealTimeListeners();
  }

  // Subscribe to real-time stats updates
  subscribe(listener: StatsListener): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current stats
    listener(this.currentStats);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of stats changes
  private notifyListeners() {
    this.currentStats.lastUpdated = new Date().toISOString();
    this.listeners.forEach(listener => listener(this.currentStats));
  }

  // Initialize real-time listeners for all collections
  private initializeRealTimeListeners() {
    this.setupTeachersListener();
    this.setupSchoolsListener();
    this.setupApplicationsListener();
    this.setupPlacementsListener();
  }

  // Listen to teachers collection changes
  private setupTeachersListener() {
    const teachersQuery = query(
      collection(db, 'teachers'),
      where('is_active', '==', true)
    );

    const unsubscribe = onSnapshot(teachersQuery, (snapshot) => {
      this.currentStats.totalTeachers = snapshot.size;
      this.notifyListeners();
    }, (error) => {
      console.error('Error listening to teachers:', error);
    });

    this.unsubscribers.push(unsubscribe);
  }

  // Listen to schools collection changes
  private setupSchoolsListener() {
    const schoolsQuery = query(
      collection(db, 'schools'),
      where('is_active', '==', true)
    );

    const unsubscribe = onSnapshot(schoolsQuery, (snapshot) => {
      this.currentStats.activeSchools = snapshot.size;
      this.notifyListeners();
    }, (error) => {
      console.error('Error listening to schools:', error);
    });

    this.unsubscribers.push(unsubscribe);
  }

  // Listen to applications collection changes
  private setupApplicationsListener() {
    const applicationsQuery = query(
      collection(db, 'job_applications')
    );

    const unsubscribe = onSnapshot(applicationsQuery, (snapshot) => {
      this.currentStats.totalApplications = snapshot.size;
      this.notifyListeners();
    }, (error) => {
      console.error('Error listening to applications:', error);
    });

    this.unsubscribers.push(unsubscribe);
  }

  // Listen to successful placements (applications with status 'hired' or 'accepted')
  private setupPlacementsListener() {
    const placementsQuery = query(
      collection(db, 'job_applications'),
      where('status', 'in', ['hired', 'accepted', 'successful'])
    );

    const unsubscribe = onSnapshot(placementsQuery, (snapshot) => {
      this.currentStats.successfulPlacements = snapshot.size;
      this.notifyListeners();
    }, (error) => {
      console.error('Error listening to placements:', error);
    });

    this.unsubscribers.push(unsubscribe);
  }

  // Get current stats synchronously
  getCurrentStats(): RealTimeStats {
    return { ...this.currentStats };
  }

  // Manually refresh stats (useful for initial load)
  async refreshStats(): Promise<RealTimeStats> {
    try {
      // The real-time listeners will automatically update the stats
      // This method can be used to force a refresh if needed
      return this.getCurrentStats();
    } catch (error) {
      console.error('Error refreshing stats:', error);
      return this.currentStats;
    }
  }

  // Clean up all listeners
  destroy() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
    this.listeners.clear();
  }

  // Add sample data for testing (development only)
  async addSampleData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Sample data can only be added in development mode');
      return;
    }

    try {
      const { firebase } = await import('@/integrations/firebase/client');
      
      // Add sample teachers
      const sampleTeachers = [
        {
          full_name: "John Doe",
          email: "john.doe@example.com",
          phone: "+256701234567",
          subject_specialization: "Mathematics",
          experience_years: 5,
          education_level: "Bachelor's Degree",
          teaching_levels: ["Secondary"],
          languages: ["English"],
          availability: "Full-time",
          location: "Kampala",
          is_active: true,
          status: "approved",
          views_count: 0,
          account_expiry: "2025-12-31"
        },
        {
          full_name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+256701234568",
          subject_specialization: "English",
          experience_years: 3,
          education_level: "Bachelor's Degree",
          teaching_levels: ["Primary", "Secondary"],
          languages: ["English"],
          availability: "Part-time",
          location: "Entebbe",
          is_active: true,
          status: "approved",
          views_count: 0,
          account_expiry: "2024-12-31"
        }
      ];

      // Add sample schools
      const sampleSchools = [
        {
          school_name: "Kampala International School",
          contact_person: "Mary Johnson",
          email: "info@kis.ug",
          phone_number: "+256701234569",
          location: "Kampala",
          school_type: "Private",
          is_active: true,
          total_teachers: 25,
          active_jobs: 3
        }
      ];

      // Add sample applications
      const sampleApplications = [
        {
          teacher_id: "teacher1",
          school_id: "school1",
          job_title: "Mathematics Teacher",
          status: "pending",
          applied_at: new Date().toISOString()
        },
        {
          teacher_id: "teacher2",
          school_id: "school1",
          job_title: "English Teacher",
          status: "hired",
          applied_at: new Date().toISOString()
        }
      ];

      // Insert sample data
      for (const teacher of sampleTeachers) {
        await firebase.from('teachers').insert(teacher);
      }

      for (const school of sampleSchools) {
        await firebase.from('schools').insert(school);
      }

      for (const application of sampleApplications) {
        await firebase.from('job_applications').insert(application);
      }

      console.log('Sample data added successfully');
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  }
}

// Create and export singleton instance
export const realTimeStatsService = new RealTimeStatsService();

// Export hook for React components
export const useRealTimeStats = () => {
  const [stats, setStats] = React.useState<RealTimeStats>(realTimeStatsService.getCurrentStats());

  React.useEffect(() => {
    const unsubscribe = realTimeStatsService.subscribe(setStats);
    return unsubscribe;
  }, []);

  return stats;
};

// For React import
import React from 'react';
