
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Users, Printer, Palette, Scissors, Phone, Mail, MapPin, Star, CheckCircle, UserPlus, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { dataService, Teacher, Stats } from '@/services/dataService';
import TeacherCard from '@/components/TeacherCard';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const [featuredTeachers, setFeaturedTeachers] = useState<Teacher[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalTeachers: 0,
    activeSchools: 0,
    totalApplications: 0,
    successfulPlacements: 0
  });

  useEffect(() => {
    fetchFeaturedTeachers();
    fetchStats();
  }, []);

  const fetchFeaturedTeachers = async () => {
    try {
      const { data, error } = await dataService.getFeaturedTeachers();

      if (error) {
        console.error('Error fetching teachers:', error);
        return;
      }

      setFeaturedTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await dataService.getStats();

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
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
      <nav className="bg-gradient-to-r from-white/95 via-blue-50/90 to-teal-50/95 backdrop-blur-lg border-b border-blue-200/50 sticky top-0 z-50 shadow-lg shadow-blue-100/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-blue-600 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  MG Investments
                </span>
                <p className="text-xs sm:text-xs text-gray-600 font-medium">Education Services</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Services</a>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">About Us</Link>
              <Link to="/schedule-appointment" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Contact Us</Link>
              <a href="#teachers" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105">Teachers</a>
              <Link to="/hire-teachers">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300 hover:scale-105">
                  Hire Teacher
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
                </div>

                {/* Mobile Action Buttons */}
                <div className="space-y-2 pt-3 border-t border-blue-200/50">
                  <Link to="/hire-teachers" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-base font-medium">
                      <Users className="h-5 w-5 mr-2" />
                      Hire Teacher
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

      {/* Featured Teachers Section */}
      <section id="teachers" className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Teachers</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Meet some of our highly qualified teachers ready to make a difference in your institution
            </p>
          </div>

          {featuredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {featuredTeachers.slice(0, 4).map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No teachers available at the moment.</p>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/hire-teachers">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600">
                View All Teachers
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
              We're committed to excellence in education and reliable service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 bg-white/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Ready to find the perfect teacher or need our educational services? Contact us today!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+256775436046</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@mginvestments.ug</p>
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

      {/* Blog/News Section removed as requested */}

      {/* Contact Form Section removed - replaced with About Us page */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Mobile: Two-column layout, Desktop: Four-column layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {/* Left side - Company Info */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">MG Investments</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Empowering education through innovative services and connecting talented teachers with great schools.
              </p>
            </div>

            {/* Right side - Services */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>Professional Printing</li>
                <li>Graphic Design</li>
                <li>Embroidery Services</li>
                <li>Teacher Placement</li>
              </ul>
            </div>

            {/* Left side - For Schools */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">For Schools</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li><Link to="/hire-teachers" className="hover:text-white transition-colors">Hire Teacher</Link></li>
                <li><Link to="/subscription" className="hover:text-white transition-colors">Premium Access</Link></li>
                <li><Link to="/school-portal" className="hover:text-white transition-colors">School Portal</Link></li>
              </ul>
            </div>

            {/* Right side - Contact Info */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>+256775436046</li>
                <li>info@mginvestments.ug</li>
                <li>Abaita Ababiri, Entebbe</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; 2025 MG Investments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
