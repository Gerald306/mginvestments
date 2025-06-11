import { firebase } from '@/integrations/firebase/client';

// Initialize Firebase with sample data for testing
export const initializeFirebaseData = async () => {
  try {
    console.log('🔥 Initializing Firebase with sample data...');

    // Sample teachers data
    const sampleTeachers = [
      {
        full_name: "Sarah Nakamya",
        email: "sarah.nakamya@example.com",
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
        full_name: "John Mukasa",
        email: "john.mukasa@example.com",
        phone: "+256701234568",
        subject_specialization: "English Literature",
        experience_years: 5,
        education_level: "Master's Degree",
        teaching_levels: ["Secondary"],
        languages: ["English"],
        availability: "Full-time",
        location: "Entebbe",
        is_active: true,
        is_featured: true,
        account_expiry: "2025-12-31",
        views_count: 189,
        status: "approved",
        bio: "Passionate English teacher dedicated to developing students' critical thinking and communication skills."
      },
      {
        full_name: "Grace Namuli",
        email: "grace.namuli@example.com",
        phone: "+256701234569",
        subject_specialization: "Science",
        experience_years: 6,
        education_level: "Bachelor's Degree",
        teaching_levels: ["Primary", "Secondary"],
        languages: ["English", "Luganda"],
        availability: "Part-time",
        location: "Jinja",
        is_active: true,
        is_featured: false,
        account_expiry: "2025-12-31",
        views_count: 156,
        status: "approved",
        bio: "Science educator with expertise in making laboratory experiments safe and engaging for students."
      },
      {
        full_name: "David Ssemakula",
        email: "david.ssemakula@example.com",
        phone: "+256701234570",
        subject_specialization: "History",
        experience_years: 4,
        education_level: "Bachelor's Degree",
        teaching_levels: ["Secondary"],
        languages: ["English", "Luganda"],
        availability: "Full-time",
        location: "Mukono",
        is_active: true,
        is_featured: false,
        account_expiry: "2025-12-31",
        views_count: 98,
        status: "approved",
        bio: "History teacher passionate about connecting past events to current world affairs."
      },
      {
        full_name: "Mary Nakirya",
        email: "mary.nakirya@example.com",
        phone: "+256701234571",
        subject_specialization: "Art & Design",
        experience_years: 3,
        education_level: "Diploma",
        teaching_levels: ["Primary"],
        languages: ["English"],
        availability: "Part-time",
        location: "Kampala",
        is_active: true,
        is_featured: false,
        account_expiry: "2025-12-31",
        views_count: 67,
        status: "approved",
        bio: "Creative arts teacher who believes in nurturing every child's artistic potential."
      }
    ];

    // Sample schools data
    const sampleSchools = [
      {
        school_name: "Kampala International School",
        contact_person: "Mary Johnson",
        email: "info@kis.ug",
        phone_number: "+256701234572",
        location: "Kampala",
        school_type: "Private",
        description: "Leading international school providing quality education with IB curriculum",
        established_year: 1995,
        total_teachers: 45,
        active_jobs: 3,
        is_active: true,
        subscription_type: "premium",
        website: "https://kis.ug",
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
        last_activity: new Date().toISOString()
      },
      {
        school_name: "St. Mary's College Kisubi",
        contact_person: "Brother Francis",
        email: "admin@smack.ug",
        phone_number: "+256701234573",
        location: "Wakiso",
        school_type: "Private",
        description: "Catholic school with strong academic tradition and holistic education approach",
        established_year: 1906,
        total_teachers: 38,
        active_jobs: 2,
        is_active: true,
        subscription_type: "standard",
        website: "https://smack.ug",
        created_at: new Date(Date.now() - 86400000 * 45).toISOString(), // 45 days ago
        last_activity: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        school_name: "Makerere College School",
        contact_person: "Dr. Patricia Musoke",
        email: "info@mcs.ug",
        phone_number: "+256701234574",
        location: "Kampala",
        school_type: "Private",
        description: "Premier secondary school with excellent facilities and academic excellence",
        established_year: 1945,
        total_teachers: 52,
        active_jobs: 4,
        is_active: true,
        subscription_type: "premium",
        website: "https://mcs.ug",
        created_at: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 days ago
        last_activity: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        school_name: "Gulu University High School",
        contact_person: "Prof. Sarah Akello",
        email: "info@guhs.ug",
        phone_number: "+256701234575",
        location: "Gulu",
        school_type: "Public",
        description: "University-affiliated high school focusing on science and technology education",
        established_year: 2010,
        total_teachers: 28,
        active_jobs: 5,
        is_active: true,
        subscription_type: "standard",
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago (New Partner)
        last_activity: new Date().toISOString()
      },
      {
        school_name: "Mbarara High School",
        contact_person: "Mr. James Tumusiime",
        email: "admin@mhs.ug",
        phone_number: "+256701234576",
        location: "Mbarara",
        school_type: "Public",
        description: "Leading public secondary school in Western Uganda with strong community ties",
        established_year: 1965,
        total_teachers: 42,
        active_jobs: 3,
        is_active: true,
        subscription_type: "basic",
        created_at: new Date(Date.now() - 86400000 * 35).toISOString(), // 35 days ago
        last_activity: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        school_name: "International School of Uganda",
        contact_person: "Ms. Jennifer Williams",
        email: "admissions@isu.ug",
        phone_number: "+256701234577",
        location: "Kampala",
        school_type: "Private",
        description: "Multicultural international school offering American curriculum and global perspectives",
        established_year: 1993,
        total_teachers: 65,
        active_jobs: 6,
        is_active: true,
        subscription_type: "premium",
        website: "https://isu.ug",
        created_at: new Date(Date.now() - 86400000 * 25).toISOString(), // 25 days ago (New Partner)
        last_activity: new Date().toISOString()
      },
      {
        school_name: "Jinja College",
        contact_person: "Dr. Moses Waiswa",
        email: "info@jinjacollege.ug",
        phone_number: "+256701234578",
        location: "Jinja",
        school_type: "Private",
        description: "Historic institution known for academic excellence and character development",
        established_year: 1923,
        total_teachers: 48,
        active_jobs: 2,
        is_active: true,
        subscription_type: "standard",
        website: "https://jinjacollege.ug",
        created_at: new Date(Date.now() - 86400000 * 50).toISOString(), // 50 days ago
        last_activity: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        school_name: "Mbale Secondary School",
        contact_person: "Mrs. Grace Nambozo",
        email: "admin@mbalesec.ug",
        phone_number: "+256701234579",
        location: "Mbale",
        school_type: "Public",
        description: "Community-focused school promoting inclusive education and local development",
        established_year: 1978,
        total_teachers: 35,
        active_jobs: 4,
        is_active: true,
        subscription_type: "basic",
        created_at: new Date(Date.now() - 86400000 * 40).toISOString(), // 40 days ago
        last_activity: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        school_name: "Greenhill Academy",
        contact_person: "Mr. Robert Kiggundu",
        email: "info@greenhill.ug",
        phone_number: "+256701234580",
        location: "Kampala",
        school_type: "Private",
        description: "Modern academy emphasizing STEM education and innovation in learning",
        established_year: 2015,
        total_teachers: 32,
        active_jobs: 7,
        is_active: true,
        subscription_type: "premium",
        website: "https://greenhill.ug",
        created_at: new Date(Date.now() - 86400000 * 12).toISOString(), // 12 days ago (New Partner)
        last_activity: new Date().toISOString()
      },
      {
        school_name: "Fort Portal Secondary School",
        contact_person: "Sister Margaret Kyomuhendo",
        email: "admin@fpss.ug",
        phone_number: "+256701234581",
        location: "Fort Portal",
        school_type: "Private",
        description: "Mission school providing quality education with emphasis on moral values",
        established_year: 1962,
        total_teachers: 29,
        active_jobs: 3,
        is_active: true,
        subscription_type: "standard",
        created_at: new Date(Date.now() - 86400000 * 55).toISOString(), // 55 days ago
        last_activity: new Date(Date.now() - 86400000 * 6).toISOString()
      },
      {
        school_name: "Arua Technical Institute",
        contact_person: "Mr. Peter Draku",
        email: "info@ati.ug",
        phone_number: "+256701234582",
        location: "Arua",
        school_type: "Public",
        description: "Technical institute specializing in vocational training and practical skills development",
        established_year: 1985,
        total_teachers: 24,
        active_jobs: 5,
        is_active: true,
        subscription_type: "basic",
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
        last_activity: new Date(Date.now() - 86400000 * 7).toISOString()
      },
      {
        school_name: "Masaka Elite School",
        contact_person: "Dr. Christine Nakato",
        email: "admissions@masaka-elite.ug",
        phone_number: "+256701234583",
        location: "Masaka",
        school_type: "Private",
        description: "Elite institution offering Cambridge curriculum with small class sizes",
        established_year: 2008,
        total_teachers: 38,
        active_jobs: 4,
        is_active: true,
        subscription_type: "premium",
        website: "https://masaka-elite.ug",
        created_at: new Date(Date.now() - 86400000 * 18).toISOString(), // 18 days ago (New Partner)
        last_activity: new Date().toISOString()
      }
    ];

    // Sample job applications
    const sampleApplications = [
      {
        teacher_id: "teacher_1",
        school_id: "school_1",
        job_title: "Mathematics Teacher",
        status: "pending",
        applied_at: new Date().toISOString(),
        teacher_name: "Sarah Nakamya",
        school_name: "Kampala International School"
      },
      {
        teacher_id: "teacher_2",
        school_id: "school_1",
        job_title: "English Teacher",
        status: "hired",
        applied_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        teacher_name: "John Mukasa",
        school_name: "Kampala International School"
      },
      {
        teacher_id: "teacher_3",
        school_id: "school_2",
        job_title: "Science Teacher",
        status: "accepted",
        applied_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        teacher_name: "Grace Namuli",
        school_name: "St. Mary's College Kisubi"
      },
      {
        teacher_id: "teacher_4",
        school_id: "school_3",
        job_title: "History Teacher",
        status: "pending",
        applied_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        teacher_name: "David Ssemakula",
        school_name: "Makerere College School"
      },
      {
        teacher_id: "teacher_5",
        school_id: "school_3",
        job_title: "Art Teacher",
        status: "successful",
        applied_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        teacher_name: "Mary Nakirya",
        school_name: "Makerere College School"
      },
      {
        teacher_id: "teacher_1",
        school_id: "school_4",
        job_title: "Physics Teacher",
        status: "pending",
        applied_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        teacher_name: "Sarah Nakamya",
        school_name: "Gulu University High School"
      },
      {
        teacher_id: "teacher_2",
        school_id: "school_6",
        job_title: "Computer Science Teacher",
        status: "accepted",
        applied_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        teacher_name: "John Mukasa",
        school_name: "International School of Uganda"
      },
      {
        teacher_id: "teacher_3",
        school_id: "school_9",
        job_title: "Chemistry Teacher",
        status: "hired",
        applied_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        teacher_name: "Grace Namuli",
        school_name: "Greenhill Academy"
      },
      {
        teacher_id: "teacher_4",
        school_id: "school_5",
        job_title: "Geography Teacher",
        status: "pending",
        applied_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
        teacher_name: "David Ssemakula",
        school_name: "Mbarara High School"
      },
      {
        teacher_id: "teacher_5",
        school_id: "school_12",
        job_title: "Biology Teacher",
        status: "successful",
        applied_at: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
        teacher_name: "Mary Nakirya",
        school_name: "Masaka Elite School"
      }
    ];

    // Insert sample data
    console.log('📚 Adding sample teachers...');
    for (const teacher of sampleTeachers) {
      const result = await firebase.from('teachers').insert(teacher);
      if (result.error) {
        console.error('Error adding teacher:', result.error);
      } else {
        console.log(`✅ Added teacher: ${teacher.full_name}`);
      }
    }

    console.log('🏫 Adding sample schools...');
    for (const school of sampleSchools) {
      const result = await firebase.from('schools').insert(school);
      if (result.error) {
        console.error('Error adding school:', result.error);
      } else {
        console.log(`✅ Added school: ${school.school_name}`);
      }
    }

    console.log('📝 Adding sample applications...');
    for (const application of sampleApplications) {
      const result = await firebase.from('job_applications').insert(application);
      if (result.error) {
        console.error('Error adding application:', result.error);
      } else {
        console.log(`✅ Added application: ${application.job_title} at ${application.school_name}`);
      }
    }

    console.log('🎉 Firebase initialization complete!');
    console.log(`📊 Added: ${sampleTeachers.length} teachers, ${sampleSchools.length} schools, ${sampleApplications.length} applications`);

    return {
      success: true,
      data: {
        teachers: sampleTeachers.length,
        schools: sampleSchools.length,
        applications: sampleApplications.length
      }
    };

  } catch (error) {
    console.error('❌ Error initializing Firebase data:', error);
    return {
      success: false,
      error
    };
  }
};

// Function to check if data already exists
export const checkExistingData = async () => {
  try {
    const [teachersResult, schoolsResult, applicationsResult] = await Promise.all([
      firebase.from('teachers').select('*'),
      firebase.from('schools').select('*'),
      firebase.from('job_applications').select('*')
    ]);

    const teachersCount = teachersResult.data?.length || 0;
    const schoolsCount = schoolsResult.data?.length || 0;
    const applicationsCount = applicationsResult.data?.length || 0;

    return {
      teachers: teachersCount,
      schools: schoolsCount,
      applications: applicationsCount,
      hasData: teachersCount > 0 || schoolsCount > 0 || applicationsCount > 0
    };
  } catch (error) {
    console.error('Error checking existing data:', error);
    return {
      teachers: 0,
      schools: 0,
      applications: 0,
      hasData: false
    };
  }
};

// Initialize data only if it doesn't exist
export const initializeIfEmpty = async () => {
  const existingData = await checkExistingData();

  if (!existingData.hasData) {
    console.log('🔄 No existing data found. Initializing with sample data...');
    return await initializeFirebaseData();
  } else {
    console.log('✅ Data already exists:', existingData);
    return {
      success: true,
      message: 'Data already exists',
      data: existingData
    };
  }
};

// Force initialize data (even if data exists) - useful for adding more sample data
export const forceInitializeData = async () => {
  console.log('🔄 Force initializing sample data...');
  return await initializeFirebaseData();
};
