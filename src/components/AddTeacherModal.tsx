import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTeacherModalProps {
  onTeacherAdded?: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ onTeacherAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    subject_specialization: '',
    education_level: '',
    experience_years: '',
    age: '',
    location: '',
    teaching_levels: [] as string[],
    detailed_experience: '',
    salary_expectation: '',
    profile_image: '',
    cv_document: '',
    certifications: [] as string[],
    languages: [] as string[],
    availability: 'full-time',
    preferred_location: '',
    emergency_contact: '',
    national_id: '',
    references: ''
  });

  const educationLevels = [
    'Certificate',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD'
  ];

  const teachingLevels = [
    'Nursery',
    'Primary 1-3',
    'Primary 4-7',
    'Secondary O-Level',
    'Secondary A-Level',
    'University'
  ];

  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Literature',
    'Computer Science',
    'Art',
    'Music',
    'Physical Education',
    'French',
    'Kiswahili',
    'Religious Education',
    'Agriculture',
    'Technical Drawing',
    'Home Economics',
    'Business Studies',
    'Economics',
    'Entrepreneurship'
  ];

  const languages = [
    'English',
    'Luganda',
    'Kiswahili',
    'French',
    'Arabic',
    'Runyankole',
    'Luo',
    'Ateso',
    'Lugbara'
  ];

  const availabilityOptions = [
    'full-time',
    'part-time',
    'contract',
    'substitute',
    'weekend-only'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically save to Firebase
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success!",
        description: "Teacher profile has been created successfully.",
      });
      
      setOpen(false);
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        subject_specialization: '',
        education_level: '',
        experience_years: '',
        age: '',
        location: '',
        teaching_levels: [],
        detailed_experience: '',
        salary_expectation: '',
        profile_image: '',
        cv_document: '',
        certifications: [],
        languages: [],
        availability: 'full-time',
        preferred_location: '',
        emergency_contact: '',
        national_id: '',
        references: ''
      });
      
      if (onTeacherAdded) {
        onTeacherAdded();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create teacher profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTeachingLevelChange = (level: string) => {
    setFormData(prev => ({
      ...prev,
      teaching_levels: prev.teaching_levels.includes(level)
        ? prev.teaching_levels.filter(l => l !== level)
        : [...prev.teaching_levels, level]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Add New Teacher
          </DialogTitle>
          <DialogDescription>
            Create a new teacher profile in the system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject_specialization">Subject Specialization *</Label>
              <Select value={formData.subject_specialization} onValueChange={(value) => setFormData(prev => ({ ...prev, subject_specialization: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="education_level">Education Level *</Label>
              <Select value={formData.education_level} onValueChange={(value) => setFormData(prev => ({ ...prev, education_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Teaching Levels</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {teachingLevels.map(level => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.teaching_levels.includes(level)}
                    onChange={() => handleTeachingLevelChange(level)}
                    className="rounded"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="detailed_experience">Detailed Experience</Label>
            <Textarea
              id="detailed_experience"
              value={formData.detailed_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_experience: e.target.value }))}
              placeholder="Describe teaching experience, achievements, etc."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="salary_expectation">Salary Expectation (UGX)</Label>
            <Input
              id="salary_expectation"
              type="number"
              value={formData.salary_expectation}
              onChange={(e) => setFormData(prev => ({ ...prev, salary_expectation: e.target.value }))}
              placeholder="e.g., 800000"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Teacher'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherModal;
