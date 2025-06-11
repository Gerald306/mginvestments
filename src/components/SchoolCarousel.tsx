import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import {
  Building,
  MapPin,
  Star,
  Phone,
  Mail,
  Users,
  Eye,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface School {
  id: string;
  school_name: string;
  email: string;
  phone: string;
  location: string;
  school_type: string;
  total_teachers: number;
  website?: string;
  is_active: boolean;
  subscription_type: 'basic' | 'standard' | 'premium';
  active_jobs: number;
  created_at: string;
  last_activity: string;
  // Additional properties for display
  is_featured?: boolean;
  description?: string;
}

interface SchoolCarouselProps {
  schools: School[];
}

const SchoolCarousel: React.FC<SchoolCarouselProps> = ({ schools }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>();

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000); // Auto-advance every 6 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Update current slide indicator
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  if (!schools || schools.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Carousel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-2 sm:px-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-2 sm:p-3 flex-shrink-0">
            <Building className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Our Partner Schools</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {schools.length} verified school{schools.length !== 1 ? 's' : ''} seeking qualified teachers
            </p>
          </div>
        </div>

        {/* Auto-play indicator */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 flex-shrink-0">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Auto-advancing</span>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
          {schools.map((school, index) => (
            <CarouselItem key={school.id} className="pl-1 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden h-full">
                <CardContent className="p-0 h-full">
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-4 sm:p-5 lg:p-6 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:15px_15px] sm:bg-[length:20px_20px]"></div>

                    {/* Badges */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 space-y-1 sm:space-y-2">
                      {school.is_featured && (
                        <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 block">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {/* Check if school was added recently (within last 30 days) */}
                      {school.created_at && (() => {
                        try {
                          const createdDate = new Date(school.created_at);
                          const now = new Date();
                          const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                          return daysDiff <= 30 && daysDiff >= 0;
                        } catch {
                          return false;
                        }
                      })() && (
                        <Badge className="bg-blue-500 text-blue-900 border-blue-400 block">
                          <span className="animate-pulse">●</span>
                          <span className="ml-1">New Partner</span>
                        </Badge>
                      )}
                    </div>
                    
                    {/* School logo and basic info */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 mx-auto border-2 border-white/30">
                        {school.school_name ? school.school_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'S'}
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 leading-tight">{school.school_name || 'School'}</h3>
                        <p className="text-emerald-100 font-medium text-sm sm:text-base truncate">{school.school_type || 'Educational Institution'}</p>
                        {school.location && (
                          <div className="flex items-center justify-center text-xs sm:text-sm text-emerald-200 mt-2">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{school.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
                    {/* School info - simplified without sensitive data */}
                    <div className="mb-4">
                      <div className="text-center p-4 bg-emerald-50 rounded-lg">
                        <Building className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-gray-900">Educational Institution</div>
                        <div className="text-xs text-gray-600">Quality Education Provider</div>
                      </div>
                    </div>

                    {/* Description preview */}
                    {school.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 text-center line-clamp-2">
                          {school.description}
                        </p>
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex justify-center mb-4">
                      <Badge className={
                        school.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }>
                        {school.is_active ? 'Active Partner' : 'Inactive'}
                      </Badge>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-auto space-y-2">
                      <Link to="/teacher-portal" className="block">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group text-xs sm:text-sm py-2 sm:py-2.5">
                          <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Apply to Teach Here</span>
                          <span className="sm:hidden">Apply Now</span>
                        </Button>
                      </Link>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="text-xs hover:bg-emerald-50 hover:border-emerald-300 transition-colors py-1.5 sm:py-2">
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Contact</span>
                          <span className="sm:hidden">Call</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors py-1.5 sm:py-2">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">Details</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom navigation buttons */}
        <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg" />
        <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg" />
      </Carousel>

      {/* Mobile navigation dots */}
      <div className="flex justify-center mt-6 md:hidden">
        <div className="flex space-x-2">
          {Array.from({ length: schools.length }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-emerald-600 w-6' : 'bg-gray-300'
              }`}
              onClick={() => {
                api?.scrollTo(index);
                setCurrentSlide(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* School count indicator */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {schools.length} verified partner school{schools.length !== 1 ? 's' : ''} actively hiring
        </p>
      </div>
    </div>
  );
};

export default SchoolCarousel;
