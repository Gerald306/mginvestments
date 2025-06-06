import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  Upload, 
  Users, 
  Edit, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Eye,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface TeacherPortalData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  experience_years: number;
  education_level: string;
  location: string;
  bio: string;
  salary_expectation: string;
  availability: string;
  status: 'pending' | 'approved' | 'rejected';
  imported_date: string;
  last_updated: string;
}

const TeacherPortalDataImport: React.FC = () => {
  const [teacherData, setTeacherData] = useState<TeacherPortalData[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<TeacherPortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { profile } = useAuth();

  // Mock data for demonstration
  const mockTeacherData: TeacherPortalData[] = [
    {
      id: '1',
      full_name: 'Sarah Nakamya',
      email: 'sarah.nakamya@email.com',
      phone: '+256701234567',
      subject: 'Mathematics',
      experience_years: 5,
      education_level: 'Bachelor\'s Degree in Mathematics',
      location: 'Kampala',
      bio: 'Passionate mathematics teacher with 5 years of experience in secondary education.',
      salary_expectation: '1,000,000 UGX',
      availability: 'Full-time',
      status: 'pending',
      imported_date: '2024-01-20',
      last_updated: '2024-01-20'
    },
    {
      id: '2',
      full_name: 'John Okello',
      email: 'john.okello@email.com',
      phone: '+256702345678',
      subject: 'English Literature',
      experience_years: 7,
      education_level: 'Master\'s Degree in English',
      location: 'Entebbe',
      bio: 'Experienced English teacher specializing in literature and creative writing.',
      salary_expectation: '1,200,000 UGX',
      availability: 'Full-time',
      status: 'pending',
      imported_date: '2024-01-22',
      last_updated: '2024-01-22'
    },
    {
      id: '3',
      full_name: 'Grace Atuhaire',
      email: 'grace.atuhaire@email.com',
      phone: '+256703456789',
      subject: 'Science',
      experience_years: 4,
      education_level: 'Bachelor\'s Degree in Biology',
      location: 'Mbarara',
      bio: 'Science teacher with expertise in biology and chemistry.',
      salary_expectation: '950,000 UGX',
      availability: 'Part-time',
      status: 'pending',
      imported_date: '2024-01-25',
      last_updated: '2024-01-25'
    }
  ];

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      // Simulate API call to fetch teacher portal data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTeacherData(mockTeacherData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teacher data from portal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromPortal = async () => {
    setImporting(true);
    try {
      // Simulate importing fresh data from teacher portal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Import Successful!",
        description: `Imported ${mockTeacherData.length} teacher profiles from the portal.`,
      });
      
      await loadTeacherData();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import data from teacher portal",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleEditTeacher = (teacher: TeacherPortalData) => {
    setEditingTeacher({ ...teacher });
  };

  const handleSaveEdit = async () => {
    if (!editingTeacher) return;

    try {
      setTeacherData(prev => 
        prev.map(teacher => 
          teacher.id === editingTeacher.id 
            ? { ...editingTeacher, last_updated: new Date().toISOString() }
            : teacher
        )
      );

      toast({
        title: "Changes Saved",
        description: "Teacher information has been updated successfully.",
      });

      setEditingTeacher(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleBulkApprove = async () => {
    if (selectedTeachers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select teachers to approve",
        variant: "destructive",
      });
      return;
    }

    try {
      setTeacherData(prev => 
        prev.map(teacher => 
          selectedTeachers.includes(teacher.id)
            ? { ...teacher, status: 'approved' as const, last_updated: new Date().toISOString() }
            : teacher
        )
      );

      toast({
        title: "Bulk Approval Complete",
        description: `${selectedTeachers.length} teachers have been approved.`,
      });

      setSelectedTeachers([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve selected teachers",
        variant: "destructive",
      });
    }
  };

  const filteredTeachers = teacherData.filter(teacher => {
    const matchesSearch = teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Portal Data Import</h2>
          <p className="text-gray-600">Import and manage teacher data from the Teacher Portal</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleImportFromPortal}
            disabled={importing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {importing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {importing ? 'Importing...' : 'Import from Portal'}
          </Button>
          {selectedTeachers.length > 0 && (
            <Button 
              onClick={handleBulkApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Selected ({selectedTeachers.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teacher Data Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeachers(prev => [...prev, teacher.id]);
                        } else {
                          setSelectedTeachers(prev => prev.filter(id => id !== teacher.id));
                        }
                      }}
                      className="rounded"
                    />
                    <div>
                      <CardTitle className="text-lg">{teacher.full_name}</CardTitle>
                      <CardDescription>{teacher.subject} Teacher • {teacher.location}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(teacher.status)}>
                      {teacher.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {teacher.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {teacher.phone}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      {teacher.experience_years} years experience
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      {teacher.education_level}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Salary:</span> {teacher.salary_expectation}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Availability:</span> {teacher.availability}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{teacher.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Teacher Dialog */}
      <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Teacher Information</DialogTitle>
            <DialogDescription>
              Make changes to the teacher's profile before approval
            </DialogDescription>
          </DialogHeader>
          
          {editingTeacher && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editingTeacher.full_name}
                    onChange={(e) => setEditingTeacher({...editingTeacher, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({...editingTeacher, subject: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingTeacher.phone}
                    onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingTeacher.location}
                    onChange={(e) => setEditingTeacher({...editingTeacher, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="experience_years">Experience (Years)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={editingTeacher.experience_years}
                    onChange={(e) => setEditingTeacher({...editingTeacher, experience_years: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="education_level">Education Level</Label>
                <Input
                  id="education_level"
                  value={editingTeacher.education_level}
                  onChange={(e) => setEditingTeacher({...editingTeacher, education_level: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editingTeacher.bio}
                  onChange={(e) => setEditingTeacher({...editingTeacher, bio: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingTeacher(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherPortalDataImport;
