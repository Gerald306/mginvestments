import { firebase } from '@/integrations/firebase/client';

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
    is_featured: true,
    account_expiry: "2025-12-31",
    views_count: 245,
    status: "approved",
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
    is_featured: true,
    account_expiry: "2024-11-30",
    views_count: 189,
    status: "approved",
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
    is_featured: true,
    account_expiry: "2025-01-15",
    views_count: 156,
    status: "approved",
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
    is_featured: false,
    account_expiry: "2025-10-30",
    views_count: 203,
    status: "approved",
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
    is_featured: true,
    account_expiry: "2025-02-28",
    views_count: 134,
    status: "approved",
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
    is_featured: true,
    account_expiry: "2024-12-15",
    views_count: 278,
    status: "approved",
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
    const { data: existingTeachers } = await firebase.from('teachers').select('*').limit(1);

    if (existingTeachers && existingTeachers.length > 0) {
      console.log('Database already has data, updating featured status...');

      // Get all teachers and update featured status for specific ones
      const { data: allTeachers } = await firebase.from('teachers').select('*');
      const teachersToFeature = ['Sarah Nakamya', 'John Okello', 'Grace Atuhaire', 'Mary Namugga', 'Peter Wanyama'];

      if (allTeachers) {
        for (const teacher of allTeachers) {
          if (teachersToFeature.includes(teacher.full_name)) {
            await firebase.from('teachers').update(teacher.id, { is_featured: true });
          }
        }
      }

      return { success: true, message: 'Database updated with featured teachers' };
    }

    // Insert teachers with featured status
    for (const teacher of sampleTeachers) {
      const { error: teacherError } = await firebase
        .from('teachers')
        .insert(teacher);

      if (teacherError) {
        console.error('Error seeding teacher:', teacherError);
        throw teacherError;
      }
    }

    // Insert schools
    for (const school of sampleSchools) {
      const { error: schoolError } = await firebase
        .from('schools')
        .insert(school);

      if (schoolError) {
        console.error('Error seeding school:', schoolError);
        throw schoolError;
      }
    }

    // Insert applications
    for (const application of sampleApplications) {
      const { error: applicationError } = await firebase
        .from('applications')
        .insert(application);

      if (applicationError) {
        console.error('Error seeding application:', applicationError);
        throw applicationError;
      }
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
