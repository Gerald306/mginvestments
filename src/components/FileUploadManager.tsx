import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  Folder,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  description: string;
  uploadDate: string;
  url: string;
  isPublic: boolean;
}

const FileUploadManager: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [uploadForm, setUploadForm] = useState({
    category: 'documents',
    description: '',
    isPublic: true
  });

  // Mock uploaded files
  const mockFiles: UploadedFile[] = [
    {
      id: '1',
      name: 'Teacher_Handbook_2024.pdf',
      type: 'application/pdf',
      size: 2048000,
      category: 'documents',
      description: 'Updated teacher handbook for 2024',
      uploadDate: '2024-01-25',
      url: '/uploads/teacher_handbook_2024.pdf',
      isPublic: true
    },
    {
      id: '2',
      name: 'School_Logo_Template.png',
      type: 'image/png',
      size: 512000,
      category: 'images',
      description: 'Official school logo template for partners',
      uploadDate: '2024-01-24',
      url: '/uploads/school_logo_template.png',
      isPublic: false
    },
    {
      id: '3',
      name: 'Application_Form_Template.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1024000,
      category: 'templates',
      description: 'Standard application form template',
      uploadDate: '2024-01-23',
      url: '/uploads/application_form_template.docx',
      isPublic: true
    }
  ];

  React.useEffect(() => {
    setFiles(mockFiles);
  }, []);

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'documents', label: 'Documents' },
    { value: 'images', label: 'Images' },
    { value: 'templates', label: 'Templates' },
    { value: 'resources', label: 'Resources' },
    { value: 'media', label: 'Media' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(Array.from(selectedFiles));
    }
  };

  const handleFileUpload = async (filesToUpload: File[]) => {
    if (!uploadForm.category || !uploadForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields before uploading.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newFiles: UploadedFile[] = filesToUpload.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        category: uploadForm.category,
        description: uploadForm.description,
        uploadDate: new Date().toISOString().split('T')[0],
        url: `/uploads/${file.name}`,
        isPublic: uploadForm.isPublic
      }));

      setFiles(prev => [...newFiles, ...prev]);
      
      // Reset form
      setUploadForm({
        category: 'documents',
        description: '',
        isPublic: true
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({
        title: "Upload Successful!",
        description: `${filesToUpload.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File Deleted",
      description: "The file has been removed successfully.",
    });
  };

  const toggleFileVisibility = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, isPublic: !file.isPublic } : file
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="h-5 w-5 text-blue-600" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const filteredFiles = selectedCategory === 'all' 
    ? files 
    : files.filter(file => file.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">File Manager</h2>
          <p className="text-gray-600">Upload and manage files for your platform</p>
        </div>
        <Badge className="bg-orange-100 text-orange-800">
          {files.length} files uploaded
        </Badge>
      </div>

      {/* Upload Section */}
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2 text-orange-600" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Upload documents, images, templates, and other resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={uploadForm.category} 
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the file(s)"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={uploadForm.isPublic}
              onChange={(e) => setUploadForm(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="isPublic" className="text-sm">
              Make files publicly accessible
            </Label>
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.txt,.xlsx,.pptx"
            />
            <Upload className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Supports: PDF, DOC, DOCX, PNG, JPG, JPEG, GIF, TXT, XLSX, PPTX
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {uploading ? 'Uploading...' : 'Select Files'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Filter */}
      <div className="flex items-center space-x-4">
        <Label>Filter by category:</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Files List */}
      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* File Info Section - Mobile optimized */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{file.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{file.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{file.category}</span>
                      <span>•</span>
                      <span>{file.uploadDate}</span>
                    </div>
                  </div>
                  <Badge className={`${file.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} flex-shrink-0 text-xs`}>
                    {file.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </div>

                {/* Action Buttons - Mobile optimized */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">View</span>
                    <span className="sm:hidden">View</span>
                  </Button>

                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Download</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFileVisibility(file.id)}
                    className="w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">{file.isPublic ? 'Make Private' : 'Make Public'}</span>
                    <span className="sm:hidden">{file.isPublic ? 'Private' : 'Public'}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFile(file.id)}
                    className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all' 
                ? 'Upload your first file to get started.' 
                : `No files in the ${categories.find(c => c.value === selectedCategory)?.label} category.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploadManager;
