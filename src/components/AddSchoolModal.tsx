import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddSchoolModalProps {
  onSchoolAdded?: (school: any) => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ onSchoolAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    school_name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    location: '',
    school_type: '',
    description: '',
    established_year: '',
    total_teachers: '',
    website: ''
  });

  const schoolTypes = [
    'Primary School',
    'Secondary School',
    'Primary & Secondary',
    'International School',
    'Private School',
    'Government School',
    'Religious School',
    'Technical School',
    'University',
    'College'
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
        description: "School profile has been created successfully.",
      });
      
      setOpen(false);
      setFormData({
        school_name: '',
        contact_person: '',
        email: '',
        phone_number: '',
        location: '',
        school_type: '',
        description: '',
        established_year: '',
        total_teachers: '',
        website: ''
      });
      
      if (onSchoolAdded) {
        onSchoolAdded(formData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create school profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105">
          <School className="h-5 w-5 mr-2" />
          Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Add New School
          </DialogTitle>
          <DialogDescription>
            Register a new school in the system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school_name">School Name *</Label>
            <Input
              id="school_name"
              value={formData.school_name}
              onChange={(e) => setFormData(prev => ({ ...prev, school_name: e.target.value }))}
              required
              placeholder="e.g., St. Mary's Primary School"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                required
                placeholder="Head Teacher / Principal"
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
                placeholder="school@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                required
                placeholder="+256..."
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
                placeholder="City, District"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school_type">School Type *</Label>
              <Select value={formData.school_type} onValueChange={(value) => setFormData(prev => ({ ...prev, school_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school type" />
                </SelectTrigger>
                <SelectContent>
                  {schoolTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="established_year">Established Year</Label>
              <Input
                id="established_year"
                type="number"
                value={formData.established_year}
                onChange={(e) => setFormData(prev => ({ ...prev, established_year: e.target.value }))}
                placeholder="e.g., 1995"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_teachers">Current Number of Teachers</Label>
              <Input
                id="total_teachers"
                type="number"
                value={formData.total_teachers}
                onChange={(e) => setFormData(prev => ({ ...prev, total_teachers: e.target.value }))}
                placeholder="e.g., 25"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://school-website.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">School Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the school, its mission, facilities, etc."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create School'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolModal;
