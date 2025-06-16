import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  User,
  School,
  Award,
  Heart
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  image?: string;
  category: 'teacher' | 'school' | 'service';
  date: string;
}

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'teacher' | 'school' | 'service'>('all');

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Nakamya',
      role: 'Mathematics Teacher',
      organization: 'Kampala International School',
      content: 'MG Investments helped me find the perfect teaching position. Their platform is user-friendly and the support team is incredibly helpful. I found my dream job within two weeks!',
      rating: 5,
      category: 'teacher',
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Dr. James Mukasa',
      role: 'Head Teacher',
      organization: 'St. Mary\'s College Kisubi',
      content: 'We\'ve been using MG Investments for teacher recruitment for over a year. The quality of candidates is exceptional, and the process is streamlined. Highly recommended!',
      rating: 5,
      category: 'school',
      date: '2024-01-10'
    },
    {
      id: '3',
      name: 'Grace Achieng',
      role: 'Science Teacher',
      organization: 'Makerere College School',
      content: 'The professional development resources and job matching service exceeded my expectations. I not only found a great position but also improved my teaching skills.',
      rating: 5,
      category: 'teacher',
      date: '2024-01-08'
    },
    {
      id: '4',
      name: 'Principal Mary Ssebunya',
      role: 'Principal',
      organization: 'Gayaza High School',
      content: 'MG Investments\' printing services for our school materials are top-notch. Fast delivery, excellent quality, and competitive prices. They understand educational needs.',
      rating: 5,
      category: 'service',
      date: '2024-01-05'
    },
    {
      id: '5',
      name: 'John Ssali',
      role: 'English Teacher',
      organization: 'King\'s College Budo',
      content: 'The platform made my job search so much easier. I could filter positions by location, subject, and salary range. Found multiple opportunities that matched my criteria.',
      rating: 4,
      category: 'teacher',
      date: '2024-01-03'
    },
    {
      id: '6',
      name: 'Mrs. Rebecca Namuli',
      role: 'HR Manager',
      organization: 'Kampala Parents School',
      content: 'Their embroidery services for our school uniforms and sports wear are exceptional. Attention to detail and timely delivery make them our preferred partner.',
      rating: 5,
      category: 'service',
      date: '2024-01-01'
    }
  ];

  const filteredTestimonials = selectedCategory === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedCategory);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [filteredTestimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'teacher': return <User className="h-4 w-4" />;
      case 'school': return <School className="h-4 w-4" />;
      case 'service': return <Award className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'school': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (filteredTestimonials.length === 0) {
    return null;
  }

  const currentTestimonial = filteredTestimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from teachers, schools, and clients who have experienced the MG Investments difference
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Reviews', icon: <Heart className="h-4 w-4" /> },
              { key: 'teacher', label: 'Teachers', icon: <User className="h-4 w-4" /> },
              { key: 'school', label: 'Schools', icon: <School className="h-4 w-4" /> },
              { key: 'service', label: 'Services', icon: <Award className="h-4 w-4" /> }
            ].map(({ key, label, icon }) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key as any)}
                className={`${
                  selectedCategory === key 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                } transition-all duration-300`}
              >
                {icon}
                <span className="ml-2">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full">
                    <Quote className="h-8 w-8 text-purple-600" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {renderStars(currentTestimonial.rating)}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed mb-8 italic">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900">{currentTestimonial.name}</h4>
                    <p className="text-gray-600">{currentTestimonial.role}</p>
                    <p className="text-sm text-gray-500">{currentTestimonial.organization}</p>
                  </div>

                  <Badge className={getCategoryColor(currentTestimonial.category)}>
                    {getCategoryIcon(currentTestimonial.category)}
                    <span className="ml-1 capitalize">{currentTestimonial.category}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          {filteredTestimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm border-purple-300 hover:bg-purple-50 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm border-purple-300 hover:bg-purple-50 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Testimonial Indicators */}
        {filteredTestimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-purple-300 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Teachers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">150+</div>
            <div className="text-gray-600">Partner Schools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
