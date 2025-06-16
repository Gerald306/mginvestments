import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Printer, Palette, Scissors, Phone, Mail, MapPin, Star, CheckCircle, UserPlus, Menu, X, Briefcase, Building, Calendar, GraduationCap, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { dataService, Teacher, School, Stats } from '@/services/dataService';
import { firebase } from '@/integrations/firebase/client';
import { useRealTimeStats } from '@/services/realTimeStatsService';
import { initializeIfEmpty } from '@/utils/initializeFirebaseData';
import { websiteUpdateNotifier } from '@/services/websiteUpdateNotifier';
import Testimonials from '@/components/Testimonials';
import TeacherCarousel from '@/components/TeacherCarousel';
import SchoolCarousel from '@/components/SchoolCarousel';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [qualifiedTeachers, setQualifiedTeachers] = useState<Teacher[]>([]);
  const [partnerSchools, setPartnerSchools] = useState<School[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Use real-time stats hook
  const realTimeStats = useRealTimeStats();

  // Fallback stats for compatibility
  const [fallbackStats, setFallbackStats] = useState<Stats>({
    totalTeachers: 0,
    activeSchools: 0,
    totalApplications: 0,
    successfulPlacements: 0
  });

  // Use real-time stats if available, otherwise fallback
  const stats = {
    totalTeachers: realTimeStats.totalTeachers || fallbackStats.totalTeachers,
    activeSchools: realTimeStats.activeSchools || fallbackStats.activeSchools,
    successfulPlacements: realTimeStats.successfulPlacements || fallbackStats.successfulPlacements,
    totalApplications: realTimeStats.totalApplications || fallbackStats.totalApplications
  };

  useEffect(() => {
    fetchQualifiedTeachers();
    fetchPartnerSchools();
    fetchFallbackStats();

    // Initialize Firebase data if empty
    initializeIfEmpty().then((result) => {
      if (result.success) {
        console.log('✅ Firebase data initialized:', result);
      } else {
        console.error('❌ Failed to initialize Firebase data:', result);
      }
    });
  }, []);

  // Listen for website updates from admin dashboard
  useEffect(() => {
    const unsubscribe = websiteUpdateNotifier.subscribe(() => {
      console.log('🔔 Received website update notification - refreshing data...');
      fetchQualifiedTeachers();
      fetchPartnerSchools();
    });

    return unsubscribe;
  }, []);

  const fetchQualifiedTeachers = async () => {
    try {
      console.log('🔍 Fetching qualified teachers for website display...');
      const { data, error } = await dataService.getApprovedTeachers();

      if (error) {
        console.error('❌ Error fetching qualified teachers:', error);
        // Set empty array to prevent undefined errors
        setQualifiedTeachers([]);
        // Try to initialize sample data if there's an error
        const { initializeIfEmpty } = await import('@/utils/initializeFirebaseData');
        const initResult = await initializeIfEmpty();
        if (initResult.success) {
          console.log('✅ Sample data initialized, retrying fetch...');
          const retryResult = await dataService.getApprovedTeachers();
          setQualifiedTeachers(retryResult.data || []);
        }
        return;
      }

      console.log('✅ Qualified teachers fetched:', data?.length || 0, 'teachers');
      console.log('📋 Teachers data:', data?.map(t => ({
        name: t.full_name,
        status: t.status,
        active: t.is_active,
        approved: t.status === 'approved',
        expiry: t.account_expiry
      })));

      // Filter and validate teacher data to prevent errors
      const validTeachers = data?.filter(teacher =>
        teacher &&
        teacher.id &&
        teacher.full_name &&
        typeof teacher.full_name === 'string' &&
        (teacher.status === 'approved' || teacher.status === 'active')
      ) || [];

      console.log('✅ Valid teachers filtered:', validTeachers.length, 'teachers');

      // Log teacher names to check for duplicates
      const teacherNames = validTeachers.map(t => t.full_name);
      const uniqueNames = [...new Set(teacherNames)];
      if (teacherNames.length !== uniqueNames.length) {
        console.log('⚠️ Potential duplicates detected in qualified teachers');
        console.log('All names:', teacherNames);
        console.log('Unique names:', uniqueNames);
      } else {
        console.log('✅ No duplicates detected in qualified teachers');
      }

      setQualifiedTeachers(validTeachers);

      // If no teachers found, try to initialize sample data
      if (!data || data.length === 0) {
        console.log('⚠️ No qualified teachers found, initializing sample data...');
        const { initializeIfEmpty } = await import('@/utils/initializeFirebaseData');
        const initResult = await initializeIfEmpty();
        if (initResult.success) {
          console.log('✅ Sample data initialized, refetching...');
          const retryResult = await dataService.getApprovedTeachers();
          setQualifiedTeachers(retryResult.data || []);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching qualified teachers:', error);
      setQualifiedTeachers([]); // Set empty array to prevent undefined errors
    }
  };

  const fetchFallbackStats = async () => {
    try {
      const { data, error } = await dataService.getStats();

      if (error) {
        console.error('Error fetching fallback stats:', error);
        return;
      }

      if (data) {
        setFallbackStats(data);
      }
    } catch (error) {
      console.error('Error fetching fallback stats:', error);
    }
  };

  const fetchPartnerSchools = async () => {
    try {
      console.log('🔍 Fetching partner schools for website display...');
      const { data, error } = await dataService.getSchools();

      if (error) {
        console.error('❌ Error fetching partner schools:', error);
        setPartnerSchools([]);
        return;
      }

      console.log('✅ Partner schools fetched:', data?.length || 0, 'schools');

      // Remove duplicates and prepare schools for website display
      const processedSchools = removeDuplicateSchools(data || []);

      console.log('✅ Processed schools (duplicates removed):', processedSchools.length, 'schools');
      setPartnerSchools(processedSchools);

      // If no schools found, try to initialize sample data
      if (!data || data.length === 0) {
        console.log('⚠️ No partner schools found, initializing sample data...');
        const { initializeIfEmpty } = await import('@/utils/initializeFirebaseData');
        const initResult = await initializeIfEmpty();
        if (initResult.success) {
          console.log('✅ Sample data initialized, refetching schools...');
          const retryResult = await dataService.getSchools();
          const retryProcessed = removeDuplicateSchools(retryResult.data || []);
          setPartnerSchools(retryProcessed);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching partner schools:', error);
      setPartnerSchools([]);
    }
  };

  // Function to remove duplicate schools and apply admin bypass logic
  const removeDuplicateSchools = (schools: School[]) => {
    console.log('🔧 Processing schools for website display (ADMIN BYPASS ACTIVE)...');

    // Step 1: Remove duplicates based on school name similarity
    const uniqueSchools = new Map<string, School>();

    schools.forEach(school => {
      if (!school || !school.school_name || typeof school.school_name !== 'string') {
        return; // Skip invalid schools
      }

      const normalizedName = school.school_name.toLowerCase().trim();
      const existingSchool = Array.from(uniqueSchools.values()).find(existing => {
        const existingNormalizedName = existing.school_name.toLowerCase().trim();

        // Check for exact match or high similarity
        if (normalizedName === existingNormalizedName) {
          return true;
        }

        // Check for similarity (e.g., "Kampala International School" vs "Kampala International")
        const similarity = calculateStringSimilarity(normalizedName, existingNormalizedName);
        return similarity > 0.8; // 80% similarity threshold
      });

      if (!existingSchool) {
        // No duplicate found, add this school
        uniqueSchools.set(school.id, {
          ...school,
          // ADMIN BYPASS: Force all schools to be active when admin pushes
          is_active: true,
          // Ensure proper display properties
          school_name: school.school_name.trim(),
          location: school.location || 'Location not specified',
          school_type: school.school_type || 'Educational Institution'
        });
      } else {
        // Duplicate found, keep the one with more recent activity or better data
        const current = uniqueSchools.get(existingSchool.id);
        if (current) {
          const shouldReplace =
            (school.last_activity && current.last_activity &&
             new Date(school.last_activity) > new Date(current.last_activity)) ||
            (!current.last_activity && school.last_activity) ||
            (school.total_teachers && !current.total_teachers);

          if (shouldReplace) {
            uniqueSchools.set(school.id, {
              ...school,
              is_active: true, // ADMIN BYPASS
              school_name: school.school_name.trim(),
              location: school.location || 'Location not specified',
              school_type: school.school_type || 'Educational Institution'
            });
            uniqueSchools.delete(existingSchool.id);
          }
        }
      }
    });

    const finalSchools = Array.from(uniqueSchools.values());

    console.log(`✅ Duplicate removal complete: ${schools.length} → ${finalSchools.length} schools`);
    console.log('🎯 ADMIN BYPASS: All schools forced active for website display');

    return finalSchools;
  };

  // Helper function to calculate string similarity
  const calculateStringSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  };



  const services = [
    {
      icon: <Printer className="h-8 w-8" />,
      title: "Professional Printing",
      description: "High-quality printing services for all your educational materials, from textbooks to certificates.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Graphic Design",
      description: "Creative design solutions for educational content, branding, and marketing materials.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
    },
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "Embroidery Services",
      description: "Custom embroidery for school uniforms, badges, and institutional branding.",
      image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=250&fit=crop"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Teacher Placement",
      description: "Connecting qualified teachers with leading educational institutions across Uganda.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=250&fit=crop"
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Verified Teachers",
      description: "All teachers are thoroughly vetted and verified for qualifications"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Real-time Matching",
      description: "Advanced matching system connects schools with ideal candidates"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Secure Platform",
      description: "Safe and secure platform for all your hiring needs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-white/95 via-blue-50/90 to-teal-50/95 backdrop-blur-lg border-b border-blue-200/50 shadow-lg shadow-blue-100/20">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 hover:opacity-80 transition-opacity duration-200 group">
              <div className="relative flex-shrink-0">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 drop-shadow-lg group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-teal-600 bg-clip-text text-transparent block truncate group-hover:from-blue-800 group-hover:via-purple-700 group-hover:to-teal-700 transition-all duration-200">
                  MG Investments
                </span>
                <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block truncate group-hover:text-gray-700 transition-colors duration-200">Education Services</p>
                <p className="text-xs text-gray-600 font-medium sm:hidden truncate group-hover:text-gray-700 transition-colors duration-200">Education</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Services</a>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">About Us</Link>
              <Link to="/schedule-appointment" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Contact Us</Link>
              <a href="#teachers" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Teachers</a>
              <a href="#schools" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Schools</a>
              <Link to="/school-portal">
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300 hover:scale-105">
                  <Building className="h-4 w-4 mr-2" />
                  School Portal
                </Button>
              </Link>
              <Link to="/teacher-portal">
                <Button variant="outline" size="sm" className="border-teal-300 text-teal-700 hover:bg-teal-50 transition-all duration-300 hover:scale-105">
                  Teacher Portal
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 hidden lg:block">Welcome, {profile?.full_name || user.email}</span>
                    {profile?.role === 'admin' && (
                      <Link to="/admin">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    {profile?.role === 'teacher' && (
                      <Link to="/teacher-portal">
                        <Button size="sm" variant="outline">Teacher Portal</Button>
                      </Link>
                    )}
                    {profile?.role === 'school' && (
                      <Link to="/school-portal">
                        <Button size="sm" variant="outline">School Portal</Button>
                      </Link>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSignOut}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Login / Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-blue-200/50 bg-white/95 backdrop-blur-lg shadow-lg">
              <div className="px-4 py-3 space-y-3">
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  <a
                    href="#services"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-blue-50 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📋 Services
                  </a>
                  <Link
                    to="/about"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-blue-50 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ℹ️ About Us
                  </Link>
                  <Link
                    to="/schedule-appointment"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-blue-50 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📞 Contact Us
                  </Link>
                  <a
                    href="#teachers"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-blue-50 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    👨‍🏫 Teachers
                  </a>
                  <a
                    href="#schools"
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-blue-50 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🏫 Schools
                  </a>
                </div>

                {/* Mobile Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-blue-200/50">
                  <Link to="/school-portal" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-3 text-base font-medium">
                      <Building className="h-5 w-5 mr-2" />
                      School Portal
                    </Button>
                  </Link>
                  <Link to="/schedule-appointment" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 text-base font-medium">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Get a Job
                    </Button>
                  </Link>
                  <Link to="/teacher-portal" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center border-teal-300 text-teal-700 hover:bg-teal-50 py-3 text-base font-medium">
                      🎓 Teacher Portal
                    </Button>
                  </Link>
                </div>

                {/* Mobile User Actions */}
                <div className="pt-3 border-t border-blue-200/50">
                  {user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-700 font-medium px-2 py-1 bg-gray-50 rounded-lg">
                        👋 Welcome, {profile?.full_name || user.email}
                      </div>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 py-3 text-base font-medium">
                            🔧 Admin Dashboard
                          </Button>
                        </Link>
                      )}
                      {profile?.role === 'teacher' && (
                        <Link to="/teacher-portal" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full py-3 text-base font-medium">🎓 Teacher Portal</Button>
                        </Link>
                      )}
                      {profile?.role === 'school' && (
                        <Link to="/school-portal" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full py-3 text-base font-medium">🏫 School Portal</Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        className="w-full py-3 text-base font-medium border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        🚪 Logout
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 py-3 text-base font-medium">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Login / Sign Up
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-teal-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 md:px-6 text-center">
          <Badge className="mb-6 md:mb-8 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 border-blue-200 px-4 md:px-6 py-2 text-xs md:text-sm font-semibold shadow-lg">
            🎓 Welcome to MG Education Services
          </Badge>
          <h1 className="text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 md:mb-8 sm:leading-tight">
            <span className="text-gray-900 block sm:inline">Empowering Education</span>
            <br className="hidden sm:block" />
            <span className="text-gray-700 block sm:inline">Through</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent animate-pulse block sm:inline"> Innovation</span>
          </h1>
          <p className="text-base leading-relaxed sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto sm:leading-relaxed font-medium px-2">
            MG Investments provides comprehensive educational services including
            <span className="text-blue-600 font-semibold"> professional printing</span>,
            <span className="text-purple-600 font-semibold"> creative design</span>,
            <span className="text-teal-600 font-semibold"> quality embroidery</span>,
            and connects qualified teachers with leading schools across Uganda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-6 sm:mb-8 md:mb-12 px-4">
            <Link to="/hire-teachers">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white font-semibold px-4 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                <Users className="mr-2 md:mr-3 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                Hire Teacher
                <ArrowRight className="ml-2 md:ml-3 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
              </Button>
            </Link>
            <Link to="/schedule-appointment">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-semibold px-4 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                <Briefcase className="mr-2 md:mr-3 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                Get a Job
                <ArrowRight className="ml-2 md:ml-3 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
              </Button>
            </Link>
            <a href="#services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold px-4 sm:px-6 md:px-8 py-3 sm:py-3 md:py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                <Palette className="mr-2 md:mr-3 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                Our Services
                <ArrowRight className="ml-2 md:ml-3 h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 px-4">
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
                <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  {stats.totalTeachers}+
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg">Qualified Teachers</div>
                <div className="w-8 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-2 sm:mt-3 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-teal-100">
                <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-2">
                  {stats.activeSchools}+
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg">Partner Schools</div>
                <div className="w-8 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto mt-2 sm:mt-3 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group sm:col-span-2 md:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
                <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
                  {stats.successfulPlacements}+
                </div>
                <div className="text-gray-700 font-semibold text-sm sm:text-base md:text-lg">Successful Placements</div>
                <div className="w-8 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto mt-2 sm:mt-3 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-20 bg-white/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl leading-tight sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Our Services</h2>
            <p className="text-sm leading-relaxed sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive educational solutions designed to support your institution's success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers" className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Qualified Teachers</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Meet our talented teachers actively seeking new opportunities. Browse profiles and find the perfect match for your institution.
            </p>
          </div>

          {/* Teacher Carousel */}
          {qualifiedTeachers && qualifiedTeachers.length > 0 ? (
            <div className="mb-8">
              <TeacherCarousel teachers={qualifiedTeachers} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Amazing Teachers</h3>
              <p className="text-gray-600 mb-6">
                Browse our database of qualified teachers ready to make a difference in your school.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center">
            <Link to="/hire-teachers">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
                View All Teachers & Advanced Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Schools Section */}
      <section id="schools" className="py-16 md:py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Partner Schools</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover leading educational institutions actively seeking qualified teachers. Join our network of partner schools.
            </p>
          </div>

          {/* School Carousel */}
          {partnerSchools && partnerSchools.length > 0 ? (
            <div className="mb-8">
              <SchoolCarousel schools={partnerSchools} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Partner Schools</h3>
              <p className="text-gray-600 mb-6">
                Explore our network of verified schools looking for talented educators.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center">
            <Link to="/teacher-portal">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Apply to Partner Schools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Why Choose MG Investments?</h2>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto px-4">
              We provide comprehensive solutions that make educational excellence accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Ready to transform your educational experience? Contact us today to learn more about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+256 123 456 789</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@mginvestments.com</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">Abaita Ababiri, Entebbe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">MG Investments</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering education through innovative services and connecting qualified teachers with leading schools across Uganda.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><Link to="/hire-teachers" className="text-gray-400 hover:text-white transition-colors">Find Teachers</Link></li>
                <li><Link to="/schedule-appointment" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Portals</h4>
              <ul className="space-y-2">
                <li><Link to="/teacher-portal" className="text-gray-400 hover:text-white transition-colors">Teacher Portal</Link></li>
                <li><Link to="/school-portal" className="text-gray-400 hover:text-white transition-colors">School Portal</Link></li>
                <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MG Investments. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Component */}
      <ScrollToTop showHomeButton={false} />
    </div>
  );
};

export default Index;