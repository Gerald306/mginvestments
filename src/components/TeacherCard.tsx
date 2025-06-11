
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar } from 'lucide-react';
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

interface TeacherCardProps {
  teacher: Teacher;
  showDetails?: boolean;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, showDetails = false }) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {teacher.full_name ? teacher.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {teacher.full_name || 'Teacher Name'}
                </h3>
                <p className="text-blue-600 font-medium">{teacher.subject_specialization || 'Subject Specialist'}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {teacher.education_level || 'Education Level'}
                </div>
              </div>
              <div className="flex items-center">
                <Badge className={
                  teacher.status === 'active' ? 'bg-green-100 text-green-800' :
                  teacher.status === 'expiring' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {teacher.status}
                </Badge>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex flex-wrap gap-1 mb-3">
                {Array.isArray(teacher.teaching_levels) ? (
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
              
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {teacher.experience_years || 0} years experience
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              {showDetails ? (
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-600">
                  Contact Teacher
                </Button>
              ) : (
                <Link to="/subscription">
                  <Button size="sm" variant="outline" className="hover:bg-blue-50">
                    View Full Profile
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;
