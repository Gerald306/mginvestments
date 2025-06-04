import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Lightbulb, 
  Globe, 
  BookOpen,
  Printer,
  Palette,
  Scissors,
  GraduationCap,
  Building2,
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const services = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Teacher Matching",
      description: "Connecting qualified teachers with schools across Uganda through our advanced matching system.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Printer className="h-8 w-8" />,
      title: "Professional Printing",
      description: "High-quality printing services for educational materials, certificates, and promotional content.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Creative Design",
      description: "Professional graphic design services for schools, educational materials, and branding solutions.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "Custom Embroidery",
      description: "Premium embroidery services for school uniforms, sports wear, and promotional items.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    }
  ];

  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, ensuring the highest quality of service.",
      color: "text-blue-600"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Integrity",
      description: "We operate with honesty, transparency, and ethical business practices.",
      color: "text-red-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "We believe in building strong communities through education and collaboration.",
      color: "text-green-600"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      description: "We embrace innovation to create better solutions for educational challenges.",
      color: "text-purple-600"
    }
  ];

  const achievements = [
    { number: "500+", label: "Teachers Placed", icon: <Users className="h-5 w-5" /> },
    { number: "150+", label: "Partner Schools", icon: <Building2 className="h-5 w-5" /> },
    { number: "98%", label: "Success Rate", icon: <Award className="h-5 w-5" /> },
    { number: "5+", label: "Years Experience", icon: <Star className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MG Investments
                </h1>
                <p className="text-xs text-gray-600">Educational Excellence</p>
              </div>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link to="/teacher-portal" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Teacher Portal
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Admin
              </Link>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Transforming Education in Uganda
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              About MG Investments
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              We are a leading educational services company dedicated to connecting qualified teachers with schools 
              while providing comprehensive printing, design, and embroidery solutions across Uganda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Users className="h-5 w-5 mr-2" />
                Join Our Network
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Globe className="h-5 w-5 mr-2" />
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">
                  <Target className="h-4 w-4 mr-2" />
                  Our Mission
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Empowering Education Through 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Innovation</span>
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission is to bridge the gap between qualified educators and educational institutions 
                  while providing comprehensive support services that enhance the learning environment. 
                  We believe that quality education is the foundation of a prosperous society.
                </p>
              </div>
              
              <div>
                <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Our Vision
                </Badge>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become Uganda's premier educational services platform, creating a seamless ecosystem 
                  where teachers, schools, and educational support services work together to deliver 
                  exceptional learning experiences for every student.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
              <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                          {achievement.icon}
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{achievement.number}</div>
                        <div className="text-sm text-gray-600">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
              <Shield className="h-4 w-4 mr-2" />
              Our Services
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Educational 
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a complete suite of services designed to support educational institutions and professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  <Button variant="ghost" className="mt-4 text-blue-600 hover:text-blue-700 group-hover:bg-blue-50">
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
              <Heart className="h-4 w-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Drives 
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Our Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide every decision we make and every service we provide
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0">
                <CardContent className="p-8 text-center">
                  <div className={`w-12 h-12 ${value.color} bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <div className={value.color}>
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Education Together?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join our growing community of educators and institutions working together to create 
              better learning experiences across Uganda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Users className="h-5 w-5 mr-2" />
                Join as Teacher
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <Building2 className="h-5 w-5 mr-2" />
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
