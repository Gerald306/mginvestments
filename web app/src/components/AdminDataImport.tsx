import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  FileText, 
  Users, 
  Building2, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { DataImportService } from '@/services/dataImportService';
import { ImportSession, ImportError } from '@/types/dataImport';

const AdminDataImport: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedType, setSelectedType] = useState<'teachers' | 'schools' | 'jobs'>('teachers');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importSession, setImportSession] = useState<ImportSession | null>(null);
  const [validationErrors, setValidationErrors] = useState<ImportError[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { profile } = useAuth();

  const importTypes = [
    { value: 'teachers', label: 'Teachers', icon: Users, description: 'Import teacher profiles and qualifications' },
    { value: 'schools', label: 'Schools', icon: Building2, description: 'Import school information and details' },
    { value: 'jobs', label: 'Job Postings', icon: Briefcase, description: 'Import job opportunities and requirements' }
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Parse file
      const rawData = await DataImportService.parseFile(file);
      
      // Validate data
      const { valid, errors } = DataImportService.validateData(rawData, selectedType);
      
      setPreviewData(valid.slice(0, 10)); // Show first 10 records for preview
      setValidationErrors(errors);
      
      // Create import session
      const sessionId = await DataImportService.createImportSession(
        file.name,
        file.name.endsWith('.csv') ? 'csv' : file.name.endsWith('.json') ? 'json' : 'excel',
        selectedType,
        rawData.length,
        profile?.id || 'unknown'
      );

      setImportSession({
        id: sessionId,
        file_name: file.name,
        file_type: file.name.endsWith('.csv') ? 'csv' : 'json',
        import_type: selectedType,
        total_records: rawData.length,
        successful_imports: valid.length,
        failed_imports: errors.filter(e => e.severity === 'error').length,
        pending_approvals: valid.length,
        approved_records: 0,
        rejected_records: 0,
        imported_by: profile?.id || 'unknown',
        import_date: new Date().toISOString(),
        status: 'completed',
        errors
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (valid.length > 0) {
        // Save valid data for approval
        await DataImportService.saveForApproval(valid, selectedType, sessionId, profile?.id || 'unknown');
        
        toast({
          title: "Import Successful!",
          description: `${valid.length} records imported and pending approval. ${errors.length} errors found.`,
        });
        
        setActiveTab("preview");
      } else {
        toast({
          title: "Import Failed",
          description: "No valid records found. Please check your data and try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = (type: 'teachers' | 'schools' | 'jobs') => {
    const templates = {
      teachers: {
        headers: ['full_name', 'email', 'phone', 'subject', 'experience_years', 'education_level', 'location', 'bio', 'hourly_rate'],
        sample: ['John Doe', 'john@email.com', '+256701234567', 'Mathematics', '5', 'Bachelor\'s Degree', 'Kampala', 'Experienced math teacher', '25000']
      },
      schools: {
        headers: ['name', 'email', 'phone', 'location', 'type', 'description', 'established_year', 'subscription_plan'],
        sample: ['ABC School', 'info@abcschool.com', '+256701234567', 'Kampala', 'Secondary', 'Quality education provider', '2010', 'standard']
      },
      jobs: {
        headers: ['title', 'school_name', 'subject', 'description', 'salary_range', 'location', 'employment_type'],
        sample: ['Math Teacher', 'ABC School', 'Mathematics', 'Teaching secondary mathematics', '800,000 - 1,200,000 UGX', 'Kampala', 'full-time']
      }
    };

    const template = templates[type];
    const csvContent = [template.headers.join(','), template.sample.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Import System</h2>
          <p className="text-gray-600">Import and manage data with approval workflow</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="preview">Preview & Validate</TabsTrigger>
          <TabsTrigger value="status">Import Status</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Import Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Select Import Type
              </CardTitle>
              <CardDescription>
                Choose the type of data you want to import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {importTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedType === type.value 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedType(type.value as any)}
                    >
                      <CardContent className="p-4 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold">{type.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Upload CSV, Excel, or JSON files containing {selectedType} data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => downloadTemplate(selectedType)}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <div className="text-sm text-gray-600">
                  Supported formats: CSV, JSON
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your file here or click to browse
                </h3>
                <p className="text-gray-600 mb-4">
                  Maximum file size: 10MB
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  {uploading ? 'Processing...' : 'Select File'}
                </Button>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {importSession && (
            <>
              {/* Import Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Import Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{importSession.successful_imports}</div>
                      <div className="text-sm text-gray-600">Valid Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{importSession.failed_imports}</div>
                      <div className="text-sm text-gray-600">Failed Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{importSession.pending_approvals}</div>
                      <div className="text-sm text-gray-600">Pending Approval</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{importSession.total_records}</div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Data */}
              {previewData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      Data Preview (First 10 Records)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            {Object.keys(previewData[0] || {}).slice(0, 6).map(key => (
                              <th key={key} className="text-left p-2 font-medium">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 5).map((record, index) => (
                            <tr key={index} className="border-b">
                              {Object.values(record).slice(0, 6).map((value: any, i) => (
                                <td key={i} className="p-2">{String(value).substring(0, 30)}...</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Validation Errors ({validationErrors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {validationErrors.slice(0, 20).map((error, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Badge variant={error.severity === 'error' ? 'destructive' : 'secondary'}>
                              Row {error.row}
                            </Badge>
                            <span className="text-sm">{error.field}: {error.error}</span>
                          </div>
                          <span className="text-xs text-gray-500">{error.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Import Status
              </CardTitle>
              <CardDescription>
                Track the status of your data imports and approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Imports</h3>
                <p className="text-gray-600 mb-4">Import some data to see the status here</p>
                <Button onClick={() => setActiveTab("upload")}>
                  Start Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDataImport;
