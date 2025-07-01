import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Crown, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";

interface LockedJobPostingsProps {
  userRole?: 'admin' | 'teacher' | 'school';
}

const LockedJobPostings: React.FC<LockedJobPostingsProps> = ({ userRole = 'teacher' }) => {
  // Mock preview data to show what's available
  const previewJobs = [
    {
      id: '1',
      title: 'Mathematics Teacher',
      school_name: 'Kampala International School',
      location: 'Kampala',
      salary_range: '800,000 - 1,200,000 UGX',
      applications_count: 12,
      posted_date: '2024-01-15'
    },
    {
      id: '2',
      title: 'English Literature Teacher',
      school_name: 'St. Mary\'s College',
      location: 'Entebbe',
      salary_range: '600,000 - 900,000 UGX',
      applications_count: 8,
      posted_date: '2024-01-18'
    },
    {
      id: '3',
      title: 'Science Teacher (Physics & Chemistry)',
      school_name: 'Makerere College School',
      location: 'Kampala',
      salary_range: '900,000 - 1,400,000 UGX',
      applications_count: 15,
      posted_date: '2024-01-20'
    }
  ];

  const premiumFeatures = [
    "Access to all job postings",
    "Direct application to schools",
    "Contact information for schools",
    "Priority application status",
    "Advanced job filtering",
    "Email notifications for new jobs",
    "Application tracking dashboard",
    "Direct messaging with schools"
  ];

  return (
    <div className="space-y-6">
      {/* Premium Upgrade Banner */}
      <Card className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            🔓 Unlock Premium Job Access
          </CardTitle>
          <CardDescription className="text-lg text-gray-700">
            Get full access to all teaching positions and apply directly to schools
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">What You Get:</h4>
              <ul className="space-y-2 text-sm">
                {premiumFeatures.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Plus More:</h4>
              <ul className="space-y-2 text-sm">
                {premiumFeatures.slice(4).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-gray-900">Special Offer</span>
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              UGX 150,000<span className="text-lg font-normal text-gray-600">/month</span>
            </p>
            <p className="text-sm text-gray-600">Full access to all features</p>
          </div>

          <Link to="/subscription" state={{ from: 'teacher-portal' }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Premium
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Preview of Locked Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-amber-500" />
            Available Jobs (Premium Required)
          </h3>
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            <Briefcase className="h-4 w-4 mr-1" />
            {previewJobs.length}+ Positions
          </Badge>
        </div>

        {/* Locked Job Cards */}
        <div className="grid gap-4">
          {previewJobs.map((job, index) => (
            <Card 
              key={job.id} 
              className="relative overflow-hidden border-l-4 border-l-amber-500 opacity-75"
            >
              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 mb-1">Premium Access Required</p>
                  <p className="text-sm text-gray-600 mb-3">Upgrade to view and apply</p>
                  <Link to="/subscription" state={{ from: 'teacher-portal' }}>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      <Crown className="h-4 w-4 mr-1" />
                      Unlock Now
                    </Button>
                  </Link>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-blue-900">{job.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Building className="h-4 w-4 mr-1" />
                      {job.school_name}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {job.applications_count} applications
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
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
                    Posted {new Date(job.posted_date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Find Your Dream Teaching Job?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of teachers who have found their perfect positions through our platform. 
            Get instant access to all job postings and start applying today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/subscription" state={{ from: 'teacher-portal' }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                <Crown className="h-5 w-5 mr-2" />
                Get Premium Access
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              30-day money-back guarantee
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockedJobPostings;
