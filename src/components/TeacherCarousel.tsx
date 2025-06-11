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
  GraduationCap,
  Calendar,
  Star,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Teacher {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  subject_specialization: string;
  experience_years: number;
  education_level: string;
  teaching_levels: string[];
  languages?: string[];
  availability?: string;
  location?: string;
  is_active?: boolean;
  is_featured?: boolean;
  account_expiry: string;
  views_count: number;
  status: string;
  profile_picture?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for compatibility
  profile_image?: string;
}

interface TeacherCarouselProps {
  teachers: Teacher[];
}

const TeacherCarousel: React.FC<TeacherCarouselProps> = ({ teachers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<any>();

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Update current slide indicator
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  if (!teachers || teachers.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Carousel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-2 sm:px-4 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
          <div className="bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg p-2 sm:p-3 flex-shrink-0">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Available Teachers</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {teachers.length} qualified teacher{teachers.length !== 1 ? 's' : ''} seeking opportunities
            </p>
          </div>
        </div>

        {/* Auto-play indicator */}
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 flex-shrink-0">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
        <CarouselContent className="gap-2 sm:gap-3 md:gap-4">
          {teachers.map((teacher, index) => (
            <CarouselItem key={teacher.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-gradient-to-br from-white to-blue-50/30 overflow-hidden h-full">
                <CardContent className="p-0 h-full">
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-4 sm:p-5 lg:p-6 text-white relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:15px_15px] sm:bg-[length:20px_20px]"></div>

                    {/* Badges */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 space-y-1 sm:space-y-2">
                      {teacher.is_featured && (
                        <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400 block">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {/* Check if teacher was added recently (within last 7 days) */}
                      {teacher.account_expiry && (() => {
                        try {
                          const createdDate = new Date(teacher.account_expiry);
                          const now = new Date();
                          const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                          return daysDiff <= 7 && daysDiff >= -365;
                        } catch {
                          return false;
                        }
                      })() && (
                        <Badge className="bg-emerald-500 text-emerald-900 border-emerald-400 block">
                          <span className="animate-pulse">●</span>
                          <span className="ml-1">New</span>
                        </Badge>
                      )}
                    </div>
                    
                    {/* Teacher avatar and basic info */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 mx-auto border-2 border-white/30">
                        {teacher.full_name ? teacher.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'T'}
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 leading-tight">{teacher.full_name || 'Teacher'}</h3>
                        <p className="text-blue-100 font-medium text-sm sm:text-base truncate">{teacher.subject_specialization || 'Subject Specialist'}</p>
                        <div className="flex items-center justify-center text-xs sm:text-sm text-blue-200 mt-2">
                          <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{teacher.education_level || 'Education Level'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
                    {/* Experience only */}
                    <div className="flex justify-center mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-900">{teacher.experience_years || 0} Years</div>
                        <div className="text-xs text-gray-600">Experience</div>
                      </div>
                    </div>

                    {/* Teaching levels */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {teacher.teaching_levels && Array.isArray(teacher.teaching_levels) ? (
                          <>
                            {teacher.teaching_levels.slice(0, 3).map((level, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {level}
                              </Badge>
                            ))}
                            {teacher.teaching_levels.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{teacher.teaching_levels.length - 3} more
                              </Badge>
                            )}
                          </>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            All Levels
                          </Badge>
                        )}
                      </div>
                    </div>



                    {/* Job seeking status */}
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                          <span className="text-sm font-semibold text-green-800">Actively Seeking Jobs</span>
                        </div>
                        <p className="text-xs text-green-700">Available for immediate placement</p>
                      </div>
                    </div>

                    {/* Bio preview */}
                    {teacher.bio && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 text-center line-clamp-2">
                          {teacher.bio}
                        </p>
                      </div>
                    )}

                    {/* Status only */}
                    <div className="flex justify-center mb-4">
                      <Badge className={
                        teacher.status === 'approved' ? 'bg-green-100 text-green-800' :
                        teacher.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {teacher.status || 'Active'}
                      </Badge>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-auto space-y-2">
                      <Link to="/subscription" className="block">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group text-xs sm:text-sm py-2 sm:py-2.5">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                          <span className="hidden sm:inline">View Full Profile & Hire</span>
                          <span className="sm:hidden">View & Hire</span>
                        </Button>
                      </Link>
                      <div className="grid grid-cols-2 gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors py-1.5 sm:py-2">
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Contact</span>
                          <span className="sm:hidden">Call</span>
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs hover:bg-green-50 hover:border-green-300 transition-colors py-1.5 sm:py-2">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Message</span>
                          <span className="sm:hidden">Mail</span>
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
        <CarouselPrevious className="hidden md:flex bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg" />
        <CarouselNext className="hidden md:flex bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg" />
      </Carousel>

      {/* Mobile navigation dots */}
      <div className="flex justify-center mt-6 md:hidden">
        <div className="flex space-x-2">
          {Array.from({ length: teachers.length }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
              onClick={() => {
                api?.scrollTo(index);
                setCurrentSlide(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* Teacher count indicator */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Showing {teachers.length} qualified teacher{teachers.length !== 1 ? 's' : ''} looking for opportunities
        </p>
      </div>
    </div>
  );
};

export default TeacherCarousel;
