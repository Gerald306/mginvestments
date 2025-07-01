import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Search,
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { emailService, EmailNotification } from '@/services/emailService';

const EmailNotificationHistory: React.FC = () => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [recipientFilter, setRecipientFilter] = useState<string>('all');

  // Mock notification history data
  const mockNotifications: EmailNotification[] = [
    {
      id: 'email_1',
      subject: 'Welcome to MG Investments Platform',
      message: 'Dear {name}, Welcome to our educational platform...',
      recipients: 'all',
      sender_email: 'admin@mginvestments.ug',
      sender_name: 'MG Investments Admin',
      priority: 'normal',
      status: 'sent',
      recipient_count: 45,
      success_count: 43,
      failure_count: 2,
      sent_at: '2024-01-25T10:30:00Z',
      created_at: '2024-01-25T10:25:00Z',
      updated_at: '2024-01-25T10:35:00Z'
    },
    {
      id: 'email_2',
      subject: 'New Job Opportunities Available',
      message: 'Dear Teachers, We have 15 new teaching positions...',
      recipients: 'teachers',
      sender_email: 'admin@mginvestments.ug',
      sender_name: 'MG Investments Admin',
      priority: 'high',
      status: 'sent',
      recipient_count: 28,
      success_count: 28,
      failure_count: 0,
      sent_at: '2024-01-24T14:15:00Z',
      created_at: '2024-01-24T14:10:00Z',
      updated_at: '2024-01-24T14:20:00Z'
    },
    {
      id: 'email_3',
      subject: 'System Maintenance Notice',
      message: 'Dear Users, Our platform will undergo maintenance...',
      recipients: 'all',
      sender_email: 'admin@mginvestments.ug',
      sender_name: 'MG Investments Admin',
      priority: 'urgent',
      status: 'sending',
      recipient_count: 45,
      success_count: 35,
      failure_count: 1,
      created_at: '2024-01-25T16:00:00Z',
      updated_at: '2024-01-25T16:05:00Z'
    }
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from the email service
        // const history = await emailService.getNotificationHistory();
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error loading notification history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sending':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'bg-green-100 text-green-800 border-green-200',
      sending: 'bg-blue-100 text-blue-800 border-blue-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      scheduled: 'bg-orange-100 text-orange-800 border-orange-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };
    
    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants] || variants.normal}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getRecipientIcon = (recipients: string) => {
    switch (recipients) {
      case 'teachers':
        return '👨‍🏫';
      case 'schools':
        return '🏫';
      case 'admins':
        return '👨‍💼';
      default:
        return '👥';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesRecipient = recipientFilter === 'all' || notification.recipients === recipientFilter;
    
    return matchesSearch && matchesStatus && matchesRecipient;
  });

  const totalSent = notifications.filter(n => n.status === 'sent').length;
  const totalRecipients = notifications.reduce((sum, n) => sum + (n.recipient_count || 0), 0);
  const successRate = notifications.length > 0 ? 
    (notifications.reduce((sum, n) => sum + (n.success_count || 0), 0) / 
     notifications.reduce((sum, n) => sum + (n.recipient_count || 0), 0) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="h-6 w-6 mr-2 text-blue-600" />
            Email Notification History
          </h2>
          <p className="text-gray-600">Track and manage sent email notifications</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecipients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.status === 'sending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="sending">Sending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Recipients</label>
              <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recipients</SelectItem>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="schools">Schools</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading notification history...</p>
            </CardContent>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No notifications found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(notification.status)}
                      <h3 className="font-semibold text-gray-900">{notification.subject}</h3>
                      {getStatusBadge(notification.status)}
                      {getPriorityBadge(notification.priority)}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {notification.message.substring(0, 150)}...
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Recipients</p>
                    <p className="font-medium">
                      {getRecipientIcon(notification.recipients)} {notification.recipients} 
                      ({notification.recipient_count})
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Success Rate</p>
                    <p className="font-medium text-green-600">
                      {notification.recipient_count ? 
                        ((notification.success_count || 0) / notification.recipient_count * 100).toFixed(1) : '0'}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sent Date</p>
                    <p className="font-medium">
                      {notification.sent_at ? 
                        new Date(notification.sent_at).toLocaleDateString() : 
                        'Not sent yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sender</p>
                    <p className="font-medium">{notification.sender_name}</p>
                  </div>
                </div>
                
                {notification.failure_count && notification.failure_count > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-700">
                        {notification.failure_count} email(s) failed to deliver
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EmailNotificationHistory;
