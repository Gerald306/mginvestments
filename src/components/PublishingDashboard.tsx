import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Eye, 
  Star, 
  TrendingUp, 
  Users, 
  School, 
  Briefcase,
  Megaphone,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Settings,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { publishingService, PublishableContent, PublishingStats } from '@/services/publishingService';

const PublishingDashboard: React.FC = () => {
  const [publishableContent, setPublishableContent] = useState<PublishableContent[]>([]);
  const [publishingStats, setPublishingStats] = useState<PublishingStats | null>(null);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { toast } = useToast();

  const [publishOptions, setPublishOptions] = useState({
    immediate: true,
    scheduled_date: '',
    featured: false,
    sections: ['all']
  });

  useEffect(() => {
    loadPublishingData();
  }, []);

  const loadPublishingData = async () => {
    setLoading(true);
    try {
      const [content, stats] = await Promise.all([
        publishingService.getPublishReadyContent(),
        publishingService.getPublishingStats()
      ]);
      
      setPublishableContent(content);
      setPublishingStats(stats);
    } catch (error) {
      console.error('Error loading publishing data:', error);
      toast({
        title: "Error",
        description: "Failed to load publishing data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToWebsite = async () => {
    if (selectedContent.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select content to publish",
        variant: "destructive",
      });
      return;
    }

    setPublishing(true);
    try {
      const result = await publishingService.publishToWebsite(selectedContent, publishOptions);
      
      if (result.success) {
        toast({
          title: "Publishing Successful! 🚀",
          description: result.message,
          duration: 5000,
        });
        
        // Reload data
        await loadPublishingData();
        setSelectedContent([]);
        setShowPublishDialog(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to publish content to website",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleToggleFeatured = async (contentId: string, featured: boolean) => {
    try {
      const success = await publishingService.toggleFeatured(contentId, featured);
      if (success) {
        toast({
          title: featured ? "Featured!" : "Unfeatured",
          description: `Content has been ${featured ? 'featured' : 'unfeatured'} successfully`,
        });
        await loadPublishingData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'teacher':
        return <Users className="h-4 w-4" />;
      case 'school':
        return <School className="h-4 w-4" />;
      case 'job':
        return <Briefcase className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      archived: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredContent = publishableContent.filter(content => {
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedContent.length === filteredContent.length) {
      setSelectedContent([]);
    } else {
      setSelectedContent(filteredContent.map(content => content.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Globe className="h-6 w-6 mr-2 text-blue-600" />
            Website Publishing Dashboard
          </h2>
          <p className="text-gray-600">Manage and publish content to your website</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowPublishDialog(true)}
            disabled={selectedContent.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Globe className="h-4 w-4 mr-2" />
            Publish to Website ({selectedContent.length})
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {publishingStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishingStats.total_published}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{publishingStats.pending_review}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">{publishingStats.featured_content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{publishingStats.total_views}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{publishingStats.engagement_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">Search</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">Content Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="teacher">Teachers</SelectItem>
                  <SelectItem value="school">Schools</SelectItem>
                  <SelectItem value="job">Jobs</SelectItem>
                  <SelectItem value="announcement">Announcements</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleSelectAll}
                variant="outline"
                className="w-full"
              >
                {selectedContent.length === filteredContent.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading publishable content...</p>
            </CardContent>
          </Card>
        ) : filteredContent.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No content found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((content) => (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(content.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContent(prev => [...prev, content.id]);
                        } else {
                          setSelectedContent(prev => prev.filter(id => id !== content.id));
                        }
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getContentIcon(content.type)}
                        <h3 className="font-semibold text-gray-900">{content.title}</h3>
                        {getStatusBadge(content.status)}
                        {content.featured && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Type:</span> {content.type}
                        </div>
                        <div>
                          <span className="font-medium">Views:</span> {content.metadata?.views || 0}
                        </div>
                        <div>
                          <span className="font-medium">Engagement:</span> {content.metadata?.engagement_score || 0}%
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span> {new Date(content.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(content.id, !content.featured)}
                    >
                      <Star className={`h-4 w-4 mr-1 ${content.featured ? 'fill-current text-orange-500' : ''}`} />
                      {content.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Publish to Website
            </DialogTitle>
            <DialogDescription>
              Configure publishing options for {selectedContent.length} selected items
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="immediate"
                checked={publishOptions.immediate}
                onChange={(e) => setPublishOptions(prev => ({ ...prev, immediate: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="immediate">Publish immediately</Label>
            </div>

            {!publishOptions.immediate && (
              <div>
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={publishOptions.scheduled_date}
                  onChange={(e) => setPublishOptions(prev => ({ ...prev, scheduled_date: e.target.value }))}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={publishOptions.featured}
                onChange={(e) => setPublishOptions(prev => ({ ...prev, featured: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured">Mark as featured content</Label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handlePublishToWebsite} 
                disabled={publishing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Publish Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublishingDashboard;
