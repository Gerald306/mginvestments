import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Calendar,
  Eye,
  Crown,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";
import { useRealTimeData } from '@/contexts/RealTimeDataContext';
import { useToast } from "@/hooks/use-toast";

const RealTimeSchoolsDisplay: React.FC = () => {
  const { schools } = useRealTimeData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  // Debug logging
  React.useEffect(() => {
    console.log('🏫 Schools data received:', schools);
    console.log('🏫 Schools count:', schools.length);
    if (schools.length > 0) {
      console.log('🏫 First school sample:', schools[0]);
    }
  }, [schools]);

  const filteredSchools = schools.filter(school => {
    // Safe string operations with null checks
    const schoolName = school.school_name || '';
    const contactPerson = school.contact_person || '';
    const location = school.location || '';
    const schoolType = school.school_type || '';

    const matchesSearch = schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || schoolType === typeFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && school.is_active) ||
                         (statusFilter === 'inactive' && !school.is_active);

    return matchesSearch && matchesType && matchesStatus;
  });

  const schoolTypes = Array.from(new Set(schools.map(s => s.school_type || 'Unknown').filter(Boolean)));

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Basic': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubscriptionIcon = (status: string) => {
    switch (status) {
      case 'Premium': return <Crown className="h-3 w-3 mr-1" />;
      case 'Standard': return <Star className="h-3 w-3 mr-1" />;
      default: return <CheckCircle className="h-3 w-3 mr-1" />;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getActivityStatus = (lastActivity?: string) => {
    if (!lastActivity) return { status: 'unknown', color: 'bg-gray-500', text: 'Unknown' };

    try {
      const activity = new Date(lastActivity);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60 * 60));

      if (diffHours < 1) return { status: 'online', color: 'bg-green-500', text: 'Online now' };
      if (diffHours < 24) return { status: 'recent', color: 'bg-yellow-500', text: `${diffHours}h ago` };
      if (diffHours < 168) return { status: 'week', color: 'bg-orange-500', text: `${Math.floor(diffHours/24)}d ago` };
      return { status: 'inactive', color: 'bg-gray-500', text: 'Inactive' };
    } catch (error) {
      return { status: 'error', color: 'bg-red-400', text: 'Invalid date' };
    }
  };

  // Loading state
  if (!schools) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading schools...</h3>
          <p className="text-gray-600">Please wait while we fetch the school data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Total Schools</p>
                <p className="text-2xl font-bold">{schools.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-indigo-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Active Schools</p>
                <p className="text-2xl font-bold">{schools.filter(s => s.is_active).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Premium Schools</p>
                <p className="text-2xl font-bold">{schools.filter(s => s.subscription_status === 'Premium' || s.subscription_type === 'premium').length}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Teachers</p>
                <p className="text-2xl font-bold">
                  {schools.reduce((sum, school) => sum + (typeof school.total_teachers === 'number' ? school.total_teachers : parseInt(school.total_teachers || '0')), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-gray-50 to-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-indigo-600" />
            School Management
          </CardTitle>
          <CardDescription>
            Monitor and manage school partnerships in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {schoolTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="text-indigo-600 border-indigo-300">
                <Filter className="h-3 w-3 mr-1" />
                {filteredSchools.length} results
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schools List */}
      <div className="space-y-4">
        {filteredSchools.map((school) => {
          const activityStatus = getActivityStatus(school.last_activity);
          
          return (
            <Card key={school.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {(school.school_name || 'Unknown').split(' ').map(n => n[0] || '').join('').slice(0, 2) || 'UN'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{school.school_name || 'Unknown School'}</h3>
                        <p className="text-sm text-gray-600">{school.school_type || 'Unknown Type'}</p>
                      </div>
                      <div className="flex space-x-2">
                        {school.is_active && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                        <Badge className={getSubscriptionColor(school.subscription_status || school.subscription_type || 'Basic')}>
                          {getSubscriptionIcon(school.subscription_status || school.subscription_type || 'Basic')}
                          {school.subscription_status || school.subscription_type || 'Basic'}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${activityStatus.color}`}></div>
                          <span className="text-xs text-gray-500">{activityStatus.text}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {school.email || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {school.phone_number || school.phone || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {school.location || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Contact: {school.contact_person || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {school.total_teachers || 0} teachers
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Member since {formatDate(school.created_at)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined: {formatDate(school.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Last Activity: {school.last_activity ? formatDate(school.last_activity) : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>

                    <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>

                    <Button size="sm" variant="outline" className="text-purple-600 hover:bg-purple-50">
                      <Crown className="h-4 w-4 mr-1" />
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSchools.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeSchoolsDisplay;
