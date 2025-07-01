import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Clock,
  Eye
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  views: number;
  featured: boolean;
  image?: string;
  tags: string[];
}

const BlogNews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Education in Uganda: Embracing Digital Learning',
      excerpt: 'Exploring how technology is transforming the educational landscape and what it means for teachers and students.',
      content: 'Full article content here...',
      author: 'Dr. Sarah Mukasa',
      date: '2024-01-25',
      category: 'Education Technology',
      readTime: '5 min read',
      views: 1250,
      featured: true,
      tags: ['Technology', 'Digital Learning', 'Uganda', 'Innovation']
    },
    {
      id: '2',
      title: 'Top 10 Teaching Strategies for Effective Classroom Management',
      excerpt: 'Proven techniques that help teachers create engaging and productive learning environments.',
      content: 'Full article content here...',
      author: 'John Ssali',
      date: '2024-01-22',
      category: 'Teaching Tips',
      readTime: '7 min read',
      views: 980,
      featured: false,
      tags: ['Teaching', 'Classroom Management', 'Education', 'Tips']
    },
    {
      id: '3',
      title: 'MG Investments Partners with 50 New Schools Across Uganda',
      excerpt: 'We are excited to announce our expansion, bringing quality educational services to more institutions.',
      content: 'Full article content here...',
      author: 'MG Investments Team',
      date: '2024-01-20',
      category: 'Company News',
      readTime: '3 min read',
      views: 2100,
      featured: true,
      tags: ['Partnership', 'Expansion', 'Schools', 'Uganda']
    },
    {
      id: '4',
      title: 'Professional Development: Upskilling Teachers for the Modern Classroom',
      excerpt: 'Why continuous learning is essential for educators and how to pursue professional growth.',
      content: 'Full article content here...',
      author: 'Grace Achieng',
      date: '2024-01-18',
      category: 'Professional Development',
      readTime: '6 min read',
      views: 750,
      featured: false,
      tags: ['Professional Development', 'Skills', 'Career Growth', 'Training']
    },
    {
      id: '5',
      title: 'Sustainable Printing Solutions for Educational Institutions',
      excerpt: 'How schools can reduce their environmental impact while maintaining high-quality printing services.',
      content: 'Full article content here...',
      author: 'Environmental Team',
      date: '2024-01-15',
      category: 'Sustainability',
      readTime: '4 min read',
      views: 650,
      featured: false,
      tags: ['Sustainability', 'Printing', 'Environment', 'Schools']
    },
    {
      id: '6',
      title: 'Success Story: How Teacher Mary Found Her Dream Job',
      excerpt: 'A heartwarming story of how our platform helped connect a passionate teacher with the perfect school.',
      content: 'Full article content here...',
      author: 'Success Stories Team',
      date: '2024-01-12',
      category: 'Success Stories',
      readTime: '5 min read',
      views: 1800,
      featured: true,
      tags: ['Success Story', 'Teacher', 'Job Placement', 'Inspiration']
    }
  ];

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Education Technology': 'bg-blue-100 text-blue-800',
      'Teaching Tips': 'bg-green-100 text-green-800',
      'Company News': 'bg-purple-100 text-purple-800',
      'Professional Development': 'bg-orange-100 text-orange-800',
      'Sustainability': 'bg-teal-100 text-teal-800',
      'Success Stories': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education Technology': return <TrendingUp className="h-4 w-4" />;
      case 'Teaching Tips': return <BookOpen className="h-4 w-4" />;
      case 'Company News': return <Award className="h-4 w-4" />;
      case 'Professional Development': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Insights</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest trends in education, success stories, and company news
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search articles, topics, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? 'bg-blue-600' : ''}
                    >
                      {category === 'all' ? 'All' : category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Award className="h-6 w-6 mr-2 text-yellow-500" />
              Featured Articles
            </h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-yellow-200">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">{post.category}</span>
                      </Badge>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      Read Full Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
            Latest Articles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <Badge className={getCategoryColor(post.category)} style={{ width: 'fit-content' }}>
                    {getCategoryIcon(post.category)}
                    <span className="ml-1">{post.category}</span>
                  </Badge>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new content.</p>
            </CardContent>
          </Card>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest educational insights, company updates, and success stories directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="bg-white/20 border-white/30 text-white placeholder:text-blue-200"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogNews;
