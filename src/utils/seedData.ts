import { supabase } from '@/integrations/supabase/client';

// Sample teachers data
const sampleTeachers = [
  {
    full_name: "Sarah Nakamya",
    email: "sarah.nakamya@email.com",
    phone: "+256701234567",
    subject_specialization: "Mathematics",
    experience_years: 8,
    education_level: "Bachelor's Degree",
    teaching_levels: ["Primary", "Secondary"],
    languages: ["English", "Luganda"],
    availability: "Full-time",
    location: "Kampala",
    is_active: true,
    account_expiry: "2024-12-31",
    views_count: 245,
    status: "active",
    bio: "Experienced mathematics teacher with a passion for making complex concepts simple and engaging for students."
  },
  {
    full_name: "John Okello",
    email: "john.okello@email.com",
    phone: "+256702345678",
    subject_specialization: "English Literature",
    experience_years: 12,
    education_level: "Master's Degree",
    teaching_levels: ["Secondary", "A-Level"],
    languages: ["English", "Luo"],
    availability: "Full-time",
    location: "Gulu",
    is_active: true,
    account_expiry: "2024-11-30",
    views_count: 189,
    status: "active",
    bio: "Dedicated English literature teacher with extensive experience in preparing students for national examinations."
  },
  {
    full_name: "Grace Atuhaire",
    email: "grace.atuhaire@email.com",
    phone: "+256703456789",
    subject_specialization: "Biology",
    experience_years: 6,
    education_level: "Bachelor's Degree",
    teaching_levels: ["Secondary", "A-Level"],
    languages: ["English", "Runyankole"],
    availability: "Part-time",
    location: "Mbarara",
    is_active: true,
    account_expiry: "2025-01-15",
    views_count: 156,
    status: "active",
    bio: "Passionate biology teacher who loves inspiring students to explore the wonders of life sciences."
  },
  {
    full_name: "David Musoke",
    email: "david.musoke@email.com",
    phone: "+256704567890",
    subject_specialization: "Physics",
    experience_years: 10,
    education_level: "Master's Degree",
    teaching_levels: ["Secondary", "A-Level"],
    languages: ["English", "Luganda"],
    availability: "Full-time",
    location: "Entebbe",
    is_active: true,
    account_expiry: "2024-10-30",
    views_count: 203,
    status: "expiring",
    bio: "Experienced physics teacher with a knack for making complex scientific concepts accessible to all students."
  },
  {
    full_name: "Mary Namugga",
    email: "mary.namugga@email.com",
    phone: "+256705678901",
    subject_specialization: "Chemistry",
    experience_years: 5,
    education_level: "Bachelor's Degree",
    teaching_levels: ["Secondary"],
    languages: ["English", "Luganda"],
    availability: "Full-time",
    location: "Jinja",
    is_active: true,
    account_expiry: "2025-02-28",
    views_count: 134,
    status: "active",
    bio: "Young and enthusiastic chemistry teacher committed to hands-on learning and laboratory excellence."
  },
  {
    full_name: "Peter Wanyama",
    email: "peter.wanyama@email.com",
    phone: "+256706789012",
    subject_specialization: "History",
    experience_years: 15,
    education_level: "Master's Degree",
    teaching_levels: ["Primary", "Secondary"],
    languages: ["English", "Lugisu"],
    availability: "Full-time",
    location: "Mbale",
    is_active: true,
    account_expiry: "2024-12-15",
    views_count: 278,
    status: "active",
    bio: "Veteran history teacher with deep knowledge of African and world history, inspiring critical thinking."
  }
];

// Sample schools data
const sampleSchools = [
  {
    school_name: "Kampala International School",
    email: "admin@kis.ug",
    phone: "+256701111111",
    location: "Kampala",
    school_type: "International",
    total_teachers: 45,
    website: "www.kis.ug",
    is_active: true,
    subscription_type: "premium" as const,
    active_jobs: 3,
    last_activity: "2024-01-15"
  },
  {
    school_name: "St. Mary's Secondary School",
    email: "info@stmarys.ug",
    phone: "+256702222222",
    location: "Entebbe",
    school_type: "Private",
    total_teachers: 28,
    is_active: true,
    subscription_type: "standard" as const,
    active_jobs: 2,
    last_activity: "2024-01-14"
  },
  {
    school_name: "Mbarara High School",
    email: "admin@mhs.ug",
    phone: "+256703333333",
    location: "Mbarara",
    school_type: "Government",
    total_teachers: 35,
    is_active: true,
    subscription_type: "basic" as const,
    active_jobs: 1,
    last_activity: "2024-01-13"
  },
  {
    school_name: "Gulu Primary School",
    email: "head@gps.ug",
    phone: "+256704444444",
    location: "Gulu",
    school_type: "Government",
    total_teachers: 18,
    is_active: true,
    subscription_type: "basic" as const,
    active_jobs: 4,
    last_activity: "2024-01-12"
  }
];

// Sample applications data
const sampleApplications = [
  {
    teacher_id: "teacher1",
    school_id: "school1",
    job_title: "Mathematics Teacher",
    status: "pending" as const,
    applied_at: "2024-01-10",
    teacher_name: "Sarah Nakamya",
    school_name: "Kampala International School"
  },
  {
    teacher_id: "teacher2",
    school_id: "school2",
    job_title: "English Teacher",
    status: "accepted" as const,
    applied_at: "2024-01-08",
    teacher_name: "John Okello",
    school_name: "St. Mary's Secondary School"
  },
  {
    teacher_id: "teacher3",
    school_id: "school3",
    job_title: "Science Teacher",
    status: "reviewed" as const,
    applied_at: "2024-01-05",
    teacher_name: "Grace Atuhaire",
    school_name: "Mbarara High School"
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Check if data already exists
    const { data: existingTeachers } = await supabase.from('teachers').select('id').limit(1);
    
    if (existingTeachers && existingTeachers.length > 0) {
      console.log('Database already has data, skipping seeding');
      return { success: true, message: 'Database already seeded' };
    }

    // Insert teachers
    const { error: teachersError } = await supabase
      .from('teachers')
      .insert(sampleTeachers);

    if (teachersError) {
      console.error('Error seeding teachers:', teachersError);
      throw teachersError;
    }

    // Insert schools
    const { error: schoolsError } = await supabase
      .from('schools')
      .insert(sampleSchools);

    if (schoolsError) {
      console.error('Error seeding schools:', schoolsError);
      throw schoolsError;
    }

    // Insert applications
    const { error: applicationsError } = await supabase
      .from('applications')
      .insert(sampleApplications);

    if (applicationsError) {
      console.error('Error seeding applications:', applicationsError);
      throw applicationsError;
    }

    console.log('Database seeding completed successfully!');
    return { 
      success: true, 
      message: 'Database seeded successfully with sample data',
      data: {
        teachers: sampleTeachers.length,
        schools: sampleSchools.length,
        applications: sampleApplications.length
      }
    };

  } catch (error) {
    console.error('Database seeding failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to seed database'
    };
  }
};

export { sampleTeachers, sampleSchools, sampleApplications };
