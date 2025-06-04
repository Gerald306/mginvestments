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
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {teacher.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{teacher.full_name}</h3>
                        <p className="text-sm text-gray-600">{teacher.subject_specialization} Teacher</p>
                      </div>
                      <div className="flex space-x-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {teacher.phone_number}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {teacher.location}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {teacher.education_level}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {teacher.experience_years} years exp.
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        {teacher.views_count} views
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined: {formatDate(teacher.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Updated: {formatDate(teacher.last_updated)}
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${teacher.profile_completion}%` }}
                          ></div>
                        </div>
                        <span>{teacher.profile_completion}% complete</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(teacher.id, teacher.is_active)}
                      className={teacher.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                    >
                      {teacher.is_active ? (
                        <>
                          <ToggleRight className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(teacher.id, teacher.is_featured)}
                      className={teacher.is_featured ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-600 hover:bg-gray-50'}
                    >
                      <Star className={`h-4 w-4 mr-1 ${teacher.is_featured ? 'fill-current' : ''}`} />
                      {teacher.is_featured ? 'Unfeature' : 'Feature'}
                    </Button>

                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
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
