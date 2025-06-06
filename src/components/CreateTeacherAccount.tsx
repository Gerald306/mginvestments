import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Key,
  Copy,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface CreateTeacherAccountProps {
  onAccountCreated?: (account: any) => void;
}

interface TeacherAccountData {
  full_name: string;
  email: string;
  phone: string;
  subject_specialization: string;
  experience_years: number;
  education_level: string;
  location: string;
  password: string;
}

const CreateTeacherAccount: React.FC<CreateTeacherAccountProps> = ({ onAccountCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [accountData, setAccountData] = useState<TeacherAccountData>({
    full_name: '',
    email: '',
    phone: '',
    subject_specialization: '',
    experience_years: 0,
    education_level: '',
    location: '',
    password: ''
  });
  const [createdAccount, setCreatedAccount] = useState<any>(null);
  const { toast } = useToast();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setAccountData(prev => ({ ...prev, password }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const handleCreateAccount = async () => {
    if (!accountData.full_name || !accountData.email || !accountData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: {
          data: {
            role: 'teacher',
            full_name: accountData.full_name
          }
        }
      });

      if (authError) throw authError;

      // Create teacher profile
      const teacherProfile = {
        id: authData.user?.id,
        full_name: accountData.full_name,
        email: accountData.email,
        phone_number: accountData.phone,
        subject_specialization: accountData.subject_specialization,
        experience_years: accountData.experience_years,
        education_level: accountData.education_level,
        location: accountData.location,
        is_active: true,
        status: 'approved',
        account_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        views_count: 0,
        teaching_levels: [],
        languages: ['English'],
        availability: 'Full-time',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('teachers')
        .insert([teacherProfile]);

      if (profileError) throw profileError;

      setCreatedAccount({
        ...teacherProfile,
        password: accountData.password
      });

      toast({
        title: "Success!",
        description: "Teacher account created successfully",
      });

      if (onAccountCreated) {
        onAccountCreated(teacherProfile);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create teacher account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAccountData({
      full_name: '',
      email: '',
      phone: '',
      subject_specialization: '',
      experience_years: 0,
      education_level: '',
      location: '',
      password: ''
    });
    setGeneratedPassword('');
    setCreatedAccount(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Create Teacher Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Create Teacher Account
          </DialogTitle>
          <DialogDescription>
            Create a new teacher account with login credentials
          </DialogDescription>
        </DialogHeader>

        {createdAccount ? (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Account Created Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-gray-700">{createdAccount.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-700">{createdAccount.email}</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <Label className="text-sm font-medium text-red-600">Generated Password</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {createdAccount.password}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdAccount.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Save this password securely. It won't be shown again.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Create Another
                </Button>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={accountData.full_name}
                  onChange={(e) => setAccountData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={accountData.phone}
                  onChange={(e) => setAccountData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={accountData.location}
                  onChange={(e) => setAccountData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject Specialization</Label>
                <Select value={accountData.subject_specialization} onValueChange={(value) => setAccountData(prev => ({ ...prev, subject_specialization: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="education">Education Level</Label>
                <Select value={accountData.education_level} onValueChange={(value) => setAccountData(prev => ({ ...prev, education_level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={accountData.experience_years}
                onChange={(e) => setAccountData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                placeholder="Enter years of experience"
              />
            </div>

            <div>
              <Label>Password *</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={accountData.password}
                  onChange={(e) => setAccountData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password or generate one"
                  type="text"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                >
                  <Key className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>
              {generatedPassword && (
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {generatedPassword}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(generatedPassword)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreateAccount} disabled={loading}>
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Create Account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeacherAccount;
