import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Teacher, School } from '../types';

export const seedDataService = {
  // Seed sample teachers
  async seedTeachers(): Promise<void> {
    try {
      const teachersRef = collection(db, 'teachers');
      
      // Check if teachers already exist
      const existingTeachers = await getDocs(teachersRef);
      if (existingTeachers.docs.length > 0) {
        console.log('Teachers already exist, skipping seed');
        return;
      }

      const sampleTeachers: Omit<Teacher, 'id'>[] = [
        {
          userId: 'teacher1',
          full_name: 'Sarah Nakamya',
          email: 'sarah.nakamya@email.com',
          phone: '+256701234567',
          subjects: ['Mathematics', 'Physics'],
          experience: 5,
          education: 'Bachelor of Science in Mathematics - Makerere University',
          location: 'Kampala',
          bio: 'Passionate mathematics teacher with 5 years of experience in secondary education.',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          profileViews: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'teacher2',
          full_name: 'John Mukasa',
          email: 'john.mukasa@email.com',
          phone: '+256702345678',
          subjects: ['English', 'Literature'],
          experience: 8,
          education: 'Bachelor of Arts in English - Kyambogo University',
          location: 'Entebbe',
          bio: 'Experienced English teacher specializing in literature and creative writing.',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          profileViews: 62,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'teacher3',
          full_name: 'Grace Namuli',
          email: 'grace.namuli@email.com',
          phone: '+256703456789',
          subjects: ['Biology', 'Chemistry'],
          experience: 3,
          education: 'Bachelor of Science in Biology - Mbarara University',
          location: 'Jinja',
          bio: 'Young and enthusiastic science teacher with a passion for laboratory work.',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          profileViews: 38,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'teacher4',
          full_name: 'David Ssemakula',
          email: 'david.ssemakula@email.com',
          phone: '+256704567890',
          subjects: ['History', 'Geography'],
          experience: 12,
          education: 'Master of Arts in History - Makerere University',
          location: 'Masaka',
          bio: 'Senior teacher with extensive experience in humanities subjects.',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          profileViews: 89,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'teacher5',
          full_name: 'Mary Akello',
          email: 'mary.akello@email.com',
          phone: '+256705678901',
          subjects: ['Computer Science', 'ICT'],
          experience: 6,
          education: 'Bachelor of Computer Science - Uganda Christian University',
          location: 'Gulu',
          bio: 'Technology enthusiast teaching the next generation of digital natives.',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          profileViews: 71,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const teacher of sampleTeachers) {
        await addDoc(teachersRef, teacher);
      }

      console.log('Sample teachers seeded successfully');
    } catch (error) {
      console.error('Error seeding teachers:', error);
    }
  },

  // Seed sample schools
  async seedSchools(): Promise<void> {
    try {
      const schoolsRef = collection(db, 'schools');
      
      // Check if schools already exist
      const existingSchools = await getDocs(schoolsRef);
      if (existingSchools.docs.length > 0) {
        console.log('Schools already exist, skipping seed');
        return;
      }

      const sampleSchools: Omit<School, 'id'>[] = [
        {
          userId: 'school1',
          name: 'Kampala International School',
          email: 'info@kis.ac.ug',
          phone: '+256414123456',
          location: 'Kampala',
          type: 'International',
          description: 'Leading international school offering world-class education with modern facilities.',
          website: 'https://kis.ac.ug',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          teacherCount: 45,
          studentCount: 800,
          isActivelyHiring: true,
          openJobsCount: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'school2',
          name: 'St. Mary\'s College Kisubi',
          email: 'admin@smack.ac.ug',
          phone: '+256414234567',
          location: 'Wakiso',
          type: 'Secondary',
          description: 'Historic Catholic school known for academic excellence and character formation.',
          website: 'https://smack.ac.ug',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          teacherCount: 38,
          studentCount: 1200,
          isActivelyHiring: true,
          openJobsCount: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'school3',
          name: 'Makerere College School',
          email: 'info@makererecollege.ac.ug',
          phone: '+256414345678',
          location: 'Kampala',
          type: 'Secondary',
          description: 'Premier secondary school with strong academic traditions and modern facilities.',
          website: 'https://makererecollege.ac.ug',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          teacherCount: 42,
          studentCount: 1000,
          isActivelyHiring: false,
          openJobsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'school4',
          name: 'Gayaza High School',
          email: 'info@gayaza.ac.ug',
          phone: '+256414456789',
          location: 'Wakiso',
          type: 'Secondary',
          description: 'All-girls boarding school with a rich history of empowering young women.',
          website: 'https://gayaza.ac.ug',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          teacherCount: 35,
          studentCount: 900,
          isActivelyHiring: true,
          openJobsCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 'school5',
          name: 'Buddo Junior School',
          email: 'info@buddojunior.ac.ug',
          phone: '+256414567890',
          location: 'Wakiso',
          type: 'Primary',
          description: 'Quality primary education with focus on holistic child development.',
          website: 'https://buddojunior.ac.ug',
          isActive: true,
          isApproved: true,
          isPushedToWebsite: true,
          teacherCount: 28,
          studentCount: 600,
          isActivelyHiring: true,
          openJobsCount: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      for (const school of sampleSchools) {
        await addDoc(schoolsRef, school);
      }

      console.log('Sample schools seeded successfully');
    } catch (error) {
      console.error('Error seeding schools:', error);
    }
  },

  // Seed all data
  async seedAllData(): Promise<void> {
    console.log('Starting data seeding...');
    await Promise.all([
      this.seedTeachers(),
      this.seedSchools(),
    ]);
    console.log('Data seeding completed');
  },
};
