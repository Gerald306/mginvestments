import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Eye,
  Star,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useRealTimeData } from '@/contexts/RealTimeDataContext';
import { useToast } from "@/hooks/use-toast";

const RealTimeTeachersDisplay: React.FC = () => {
  const { teachers, updateTeacherStatus, updateTeacherFeatured } = useRealTimeData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const { toast } = useToast();

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject_specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && teacher.is_active) ||
                         (statusFilter === 'inactive' && !teacher.is_active) ||
                         (statusFilter === 'featured' && teacher.is_featured);
    
    const matchesSubject = subjectFilter === 'all' || teacher.subject_specialization === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const subjects = Array.from(new Set(teachers.map(t => t.subject_specialization)));

  const handleToggleStatus = (teacherId: string, currentStatus: boolean) => {
    updateTeacherStatus(teacherId, !currentStatus);
    toast({
      title: "Status Updated",
      description: `Teacher ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
    });
  };

  const handleToggleFeatured = (teacherId: string, currentFeatured: boolean) => {
    updateTeacherFeatured(teacherId, !currentFeatured);
    toast({
      title: "Featured Status Updated",
      description: `Teacher ${!currentFeatured ? 'added to' : 'removed from'} featured list.`,
    });
  };

  const getAccountStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { status: 'expired', color: 'bg-red-100 text-red-800', days: diffDays };
    if (diffDays <= 7) return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800', days: diffDays };
    return { status: 'active', color: 'bg-green-100 text-green-800', days: diffDays };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Teachers</p>
                <p className="text-2xl font-bold">{teachers.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Teachers</p>
                <p className="text-2xl font-bold">{teachers.filter(t => t.is_active).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Featured</p>
                <p className="text-2xl font-bold">{teachers.filter(t => t.is_featured).length}</p>
              </div>
              <Star className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Expiring Soon</p>
                <p className="text-2xl font-bold">
                  {teachers.filter(t => {
                    const expiry = new Date(t.account_expiry);
                    const now = new Date();
                    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays <= 7 && diffDays > 0;
                  }).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            Teacher Management
          </CardTitle>
          <CardDescription>
            Search, filter, and manage teacher accounts in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                <Filter className="h-3 w-3 mr-1" />
                {filteredTeachers.length} results
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <div className="space-y-4">
        {filteredTeachers.map((teacher) => {
          const accountStatus = getAccountStatus(teacher.account_expiry);
          
          return (
            <Card key={teacher.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-4 sm:p-6">
                {/* Mobile-first layout */}
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                      {teacher.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{teacher.full_name}</h3>
                      <p className="text-sm text-gray-600">{teacher.subject_specialization} Teacher</p>

                      {/* Status badges - mobile optimized */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {teacher.is_active && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                        {teacher.is_featured && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge className={accountStatus.color}>
                          {accountStatus.status === 'expired' ? 'Expired' : 
                           accountStatus.status === 'expiring' ? `${accountStatus.days}d left` : 
                           'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information - Mobile optimized */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-sm text-gray-600">
                    <div className="flex items-center truncate">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{teacher.phone_number}</span>
                    </div>
                    <div className="flex items-center truncate">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{teacher.location}</span>
                    </div>
                    <div className="flex items-center truncate">
                      <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{teacher.education_level}</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{teacher.experience_years} years exp.</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{teacher.views_count} views</span>
                    </div>
                  </div>

                  {/* Meta Information - Mobile optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Joined: {formatDate(teacher.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated: {formatDate(teacher.last_updated)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${teacher.profile_completion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{teacher.profile_completion}%</span>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile optimized */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(teacher.id, teacher.is_active)}
                      className={`flex-1 sm:flex-none ${teacher.is_active ? 'text-red-600 hover:bg-red-50 border-red-200' : 'text-green-600 hover:bg-green-50 border-green-200'}`}
                    >
                      {teacher.is_active ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Deactivate</span>
                          <span className="sm:hidden">Deactivate</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Activate</span>
                          <span className="sm:hidden">Activate</span>
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(teacher.id, teacher.is_featured)}
                      className={`flex-1 sm:flex-none ${teacher.is_featured ? 'text-purple-600 hover:bg-purple-50 border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Star className={`h-4 w-4 mr-1 ${teacher.is_featured ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{teacher.is_featured ? 'Unfeature' : 'Feature'}</span>
                      <span className="sm:hidden">{teacher.is_featured ? 'Unfeature' : 'Feature'}</span>
                    </Button>

                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">View Profile</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeTeachersDisplay;
