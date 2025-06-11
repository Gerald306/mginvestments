import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Search, 
  Filter,
  Briefcase,
  Clock,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobPosting {
  id: string;
  title: string;
  school_name: string;
  location: string;
  subject: string;
  teaching_levels: string[];
  salary_range: string;
  description: string;
  requirements: string;
  application_deadline: string;
  posted_date: string;
  applications_count: number;
  is_active: boolean;
  school_type: string;
}

const JobPostings: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockJobs: JobPosting[] = [
    {
      id: '1',
      title: 'Mathematics Teacher',
      school_name: 'Kampala International School',
      location: 'Kampala',
      subject: 'Mathematics',
      teaching_levels: ['Secondary O-Level', 'Secondary A-Level'],
      salary_range: '800,000 - 1,200,000 UGX',
      description: 'We are seeking a qualified Mathematics teacher to join our dynamic team.',
      requirements: 'Bachelor\'s degree in Mathematics or related field, 2+ years experience',
      application_deadline: '2024-02-15',
      posted_date: '2024-01-15',
      applications_count: 12,
      is_active: true,
      school_type: 'International School'
    },
    {
      id: '2',
      title: 'English Literature Teacher',
      school_name: 'St. Mary\'s College',
      location: 'Entebbe',
      subject: 'English',
      teaching_levels: ['Secondary O-Level'],
      salary_range: '600,000 - 900,000 UGX',
      description: 'Join our English department and inspire students in literature and language.',
      requirements: 'Bachelor\'s in English Literature, Teaching certification required',
      application_deadline: '2024-02-20',
      posted_date: '2024-01-18',
      applications_count: 8,
      is_active: true,
      school_type: 'Private School'
    },
    {
      id: '3',
      title: 'Science Teacher (Physics & Chemistry)',
      school_name: 'Makerere College School',
      location: 'Kampala',
      subject: 'Science',
      teaching_levels: ['Secondary O-Level', 'Secondary A-Level'],
      salary_range: '900,000 - 1,400,000 UGX',
      description: 'Teach Physics and Chemistry to motivated students in a well-equipped laboratory.',
      requirements: 'Bachelor\'s in Physics/Chemistry, Laboratory experience preferred',
      application_deadline: '2024-02-25',
      posted_date: '2024-01-20',
      applications_count: 15,
      is_active: true,
      school_type: 'Government School'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(job => job.subject === subjectFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => job.location === locationFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, subjectFilter, locationFilter, jobs]);

  const handleApply = (jobId: string) => {
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent to the school.",
    });
  };

  const subjects = ['Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology'];
  const locations = ['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            Find Your Perfect Teaching Position
          </CardTitle>
          <CardDescription>
            Search and filter through available teaching positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search jobs, schools, subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
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
            <div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
        </h3>
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          <Briefcase className="h-4 w-4 mr-1" />
          Active Positions
        </Badge>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">{job.title}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <Building className="h-4 w-4 mr-1" />
                    {job.school_name} • {job.school_type}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {job.applications_count} applications
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {job.salary_range}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Teaching Levels:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.teaching_levels.map((level, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <p className="text-gray-700 text-sm">{job.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <p className="text-gray-700 text-sm">{job.requirements}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Posted {new Date(job.posted_date).toLocaleDateString()}
                  </div>
                  <Button 
                    onClick={() => handleApply(job.id)}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobPostings;
