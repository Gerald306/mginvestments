import jsPDF from 'jspdf';
import { Teacher, School, JobApplication, Stats } from '@/services/dataService';

export interface ReportData {
  teachers?: Teacher[];
  schools?: School[];
  applications?: JobApplication[];
  stats?: Stats;
}

export class ReportGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.margin = 20;
  }

  private addHeader(title: string, subtitle?: string) {
    // Add logo/company header
    this.doc.setFontSize(20);
    this.doc.setTextColor(59, 130, 246); // Blue color
    this.doc.text('MG Investments', this.margin, 30);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(107, 114, 128); // Gray color
    this.doc.text('Educational Services & Teacher Matching Platform', this.margin, 40);
    
    // Add title
    this.doc.setFontSize(16);
    this.doc.setTextColor(17, 24, 39); // Dark gray
    this.doc.text(title, this.margin, 60);
    
    if (subtitle) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(subtitle, this.margin, 70);
    }
    
    // Add date
    this.doc.setFontSize(10);
    this.doc.setTextColor(107, 114, 128);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    this.doc.text(`Generated on: ${date}`, this.margin, 80);
    
    // Add separator line
    this.doc.setDrawColor(229, 231, 235);
    this.doc.line(this.margin, 85, this.pageWidth - this.margin, 85);
    
    return 95; // Return Y position for next content
  }

  private addFooter(pageNumber: number) {
    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text(
      `Page ${pageNumber} | MG Investments Educational Services`,
      this.margin,
      this.pageHeight - 10
    );
    this.doc.text(
      'Contact: +256775436046 | info@mginvestments.ug',
      this.pageWidth - 80,
      this.pageHeight - 10
    );
  }

  generateTeachersReport(teachers: Teacher[]): Blob {
    let yPosition = this.addHeader(
      'Teachers Report',
      `Comprehensive overview of ${teachers.length} registered professional educators`
    );

    // Enhanced summary statistics
    const activeTeachers = teachers.filter(t => t.is_active).length;
    const inactiveTeachers = teachers.length - activeTeachers;
    const featuredTeachers = teachers.filter(t => t.is_featured).length;
    const subjects = [...new Set(teachers.map(t => t.subject_specialization).filter(Boolean))];
    const avgExperience = teachers.length > 0 ?
      (teachers.reduce((sum, t) => sum + (t.experience_years || 0), 0) / teachers.length).toFixed(1) : '0';

    // Experience level breakdown
    const experienceLevels = {
      'Entry Level (0-2 years)': teachers.filter(t => (t.experience_years || 0) <= 2).length,
      'Mid Level (3-7 years)': teachers.filter(t => (t.experience_years || 0) >= 3 && (t.experience_years || 0) <= 7).length,
      'Senior Level (8+ years)': teachers.filter(t => (t.experience_years || 0) >= 8).length
    };

    // Statistics Section with enhanced layout
    yPosition += 10;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('📊 Teacher Analytics', this.margin, yPosition);

    // Add background box for statistics
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(this.margin - 5, yPosition + 5, this.pageWidth - (this.margin * 2) + 10, 45, 'F');

    yPosition += 15;
    this.doc.setFontSize(11);
    this.doc.setTextColor(75, 85, 99);

    // Row 1: Basic counts
    this.doc.text(`Total Teachers: ${teachers.length}`, this.margin, yPosition);
    this.doc.text(`Active: ${activeTeachers}`, this.margin + 80, yPosition);
    this.doc.text(`Featured: ${featuredTeachers}`, this.margin + 130, yPosition);

    yPosition += 10;
    // Row 2: Experience and subjects
    this.doc.text(`Inactive: ${inactiveTeachers}`, this.margin, yPosition);
    this.doc.text(`Avg Experience: ${avgExperience} years`, this.margin + 80, yPosition);
    this.doc.text(`Subject Areas: ${subjects.length}`, this.margin + 130, yPosition);

    yPosition += 10;
    // Row 3: Activation rate
    const activationRate = teachers.length > 0 ? ((activeTeachers / teachers.length) * 100).toFixed(1) : '0';
    this.doc.text(`Activation Rate: ${activationRate}%`, this.margin, yPosition);
    const featuredRate = teachers.length > 0 ? ((featuredTeachers / teachers.length) * 100).toFixed(1) : '0';
    this.doc.text(`Featured Rate: ${featuredRate}%`, this.margin + 80, yPosition);

    // Experience Level Distribution
    yPosition += 25;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('📈 Experience Distribution', this.margin, yPosition);

    yPosition += 10;
    this.doc.setFontSize(10);
    this.doc.setTextColor(75, 85, 99);

    Object.entries(experienceLevels).forEach(([level, count]) => {
      if (count > 0) {
        const percentage = teachers.length > 0 ? ((count / teachers.length) * 100).toFixed(1) : '0';
        this.doc.text(`• ${level}: ${count} teachers (${percentage}%)`, this.margin, yPosition);
        yPosition += 8;
      }
    });

    // Top Subject Areas
    if (subjects.length > 0) {
      yPosition += 10;
      this.doc.setFontSize(14);
      this.doc.setTextColor(17, 24, 39);
      this.doc.text('📚 Subject Specializations', this.margin, yPosition);

      yPosition += 10;
      this.doc.setFontSize(10);
      this.doc.setTextColor(75, 85, 99);

      const subjectCounts = subjects.map(subject => ({
        subject,
        count: teachers.filter(t => t.subject_specialization === subject).length
      })).sort((a, b) => b.count - a.count).slice(0, 8);

      subjectCounts.forEach((subjectData, index) => {
        const percentage = teachers.length > 0 ? ((subjectData.count / teachers.length) * 100).toFixed(1) : '0';
        this.doc.text(`• ${subjectData.subject}: ${subjectData.count} teachers (${percentage}%)`, this.margin, yPosition);
        yPosition += 8;
      });
    }

    // Teachers Directory
    yPosition += 15;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('👨‍🏫 Teachers Directory', this.margin, yPosition);

    yPosition += 5;
    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text('(Sorted by experience level - most experienced first)', this.margin, yPosition);

    yPosition += 10;
    this.doc.setFontSize(9);

    // Sort teachers by experience (most experienced first)
    const sortedTeachers = [...teachers]
      .sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0))
      .slice(0, 25);

    sortedTeachers.forEach((teacher, index) => {
      if (yPosition > this.pageHeight - 70) {
        this.doc.addPage();
        this.addHeader('Teachers Report (Continued)', 'Teachers Directory');
        yPosition = 100;
      }

      // Teacher header with status indicators
      this.doc.setFontSize(11);
      this.doc.setTextColor(17, 24, 39);

      const statusIcon = teacher.is_active ? '🟢' : '🔴';
      const featuredIcon = teacher.is_featured ? '⭐' : '';
      const teacherHeader = `${index + 1}. ${statusIcon}${featuredIcon} ${teacher.full_name || 'Unnamed Teacher'}`;
      this.doc.text(teacherHeader, this.margin, yPosition);
      yPosition += 8;

      // Teacher details in organized format
      this.doc.setFontSize(9);
      this.doc.setTextColor(75, 85, 99);

      // Subject and Experience
      const subjectExp = `   📚 ${teacher.subject_specialization || 'Subject not specified'} • 🎓 ${teacher.experience_years || 0} years experience`;
      this.doc.text(subjectExp, this.margin, yPosition);
      yPosition += 7;

      // Education and Location
      const eduLocation = `   🎓 ${teacher.education_level || 'Education not specified'} • 📍 ${teacher.location || 'Location not specified'}`;
      this.doc.text(eduLocation, this.margin, yPosition);
      yPosition += 7;

      // Contact Information
      if (teacher.email || teacher.phone) {
        const contact = `   📞 ${teacher.phone || 'No phone'} • ✉️ ${teacher.email || 'No email'}`;
        this.doc.text(contact, this.margin, yPosition);
        yPosition += 7;
      }

      // Status and additional info
      const statusInfo = `   📊 Status: ${teacher.is_active ? 'Active' : 'Inactive'} • ⭐ Featured: ${teacher.is_featured ? 'Yes' : 'No'} • 🆔 ID: ${teacher.id?.substring(0, 8) || 'N/A'}`;
      this.doc.text(statusInfo, this.margin, yPosition);
      yPosition += 10;

      // Add separator line
      this.doc.setDrawColor(229, 231, 235);
      this.doc.line(this.margin, yPosition - 2, this.pageWidth - this.margin, yPosition - 2);
      yPosition += 5;
    });

    // Summary footer
    if (teachers.length > 25) {
      yPosition += 10;
      this.doc.setFontSize(10);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`📋 Showing top 25 teachers by experience. ${teachers.length - 25} additional teachers not displayed.`, this.margin, yPosition);
      yPosition += 8;
      this.doc.text(`💡 For complete teacher profiles, access the admin dashboard or teacher portal.`, this.margin, yPosition);
    }

    this.addFooter(1);
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  generateSchoolsReport(schools: School[]): Blob {
    let yPosition = this.addHeader(
      'Schools Report',
      `Comprehensive overview of ${schools.length} registered educational institutions`
    );

    // Summary statistics with better organization
    const activeSchools = schools.filter(s => s.is_active).length;
    const inactiveSchools = schools.length - activeSchools;
    const schoolTypes = [...new Set(schools.map(s => s.school_type).filter(Boolean))];
    const schoolsByType = schoolTypes.map(type => ({
      type,
      count: schools.filter(s => s.school_type === type).length
    }));

    // Statistics Section
    yPosition += 10;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('📊 Summary Statistics', this.margin, yPosition);

    // Add background box for statistics
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(this.margin - 5, yPosition + 5, this.pageWidth - (this.margin * 2) + 10, 35, 'F');

    yPosition += 15;
    this.doc.setFontSize(11);
    this.doc.setTextColor(75, 85, 99);
    this.doc.text(`Total Registered Schools: ${schools.length}`, this.margin, yPosition);
    this.doc.text(`Active Schools: ${activeSchools}`, this.margin + 90, yPosition);

    yPosition += 10;
    this.doc.text(`Inactive Schools: ${inactiveSchools}`, this.margin, yPosition);
    this.doc.text(`School Types: ${schoolTypes.length}`, this.margin + 90, yPosition);

    yPosition += 10;
    this.doc.text(`Activation Rate: ${schools.length > 0 ? ((activeSchools / schools.length) * 100).toFixed(1) : 0}%`, this.margin, yPosition);

    // School Types Breakdown
    if (schoolTypes.length > 0) {
      yPosition += 25;
      this.doc.setFontSize(14);
      this.doc.setTextColor(17, 24, 39);
      this.doc.text('🏫 School Types Distribution', this.margin, yPosition);

      yPosition += 10;
      this.doc.setFontSize(10);
      this.doc.setTextColor(75, 85, 99);

      schoolsByType.forEach((typeData, index) => {
        const percentage = ((typeData.count / schools.length) * 100).toFixed(1);
        this.doc.text(`• ${typeData.type}: ${typeData.count} schools (${percentage}%)`, this.margin, yPosition);
        yPosition += 8;
      });
    }

    // Schools Directory
    yPosition += 15;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('🏛️ Schools Directory', this.margin, yPosition);

    yPosition += 10;
    this.doc.setFontSize(9);

    schools.slice(0, 20).forEach((school, index) => {
      if (yPosition > this.pageHeight - 60) {
        this.doc.addPage();
        this.addHeader('Schools Report (Continued)', 'Schools Directory');
        yPosition = 100;
      }

      // School header with status indicator
      this.doc.setFontSize(11);
      this.doc.setTextColor(17, 24, 39);
      const statusIcon = school.is_active ? '🟢' : '🔴';
      const schoolHeader = `${index + 1}. ${statusIcon} ${school.school_name || 'Unnamed School'}`;
      this.doc.text(schoolHeader, this.margin, yPosition);
      yPosition += 8;

      // School details in organized format
      this.doc.setFontSize(9);
      this.doc.setTextColor(75, 85, 99);

      // Type and Location
      if (school.school_type || school.location) {
        const typeLocation = `   📍 ${school.school_type || 'Type not specified'} • ${school.location || 'Location not specified'}`;
        this.doc.text(typeLocation, this.margin, yPosition);
        yPosition += 7;
      }

      // Contact Information
      if (school.contact_email || school.phone_number) {
        const contact = `   📞 ${school.phone_number || 'No phone'} • ✉️ ${school.contact_email || 'No email'}`;
        this.doc.text(contact, this.margin, yPosition);
        yPosition += 7;
      }

      // Additional info if available
      if (school.website || school.established_year) {
        const additional = `   🌐 ${school.website || 'No website'} • 📅 Est. ${school.established_year || 'Unknown'}`;
        this.doc.text(additional, this.margin, yPosition);
        yPosition += 7;
      }

      // Status and registration info
      const statusInfo = `   📊 Status: ${school.is_active ? 'Active' : 'Inactive'} • 📝 ID: ${school.id?.substring(0, 8) || 'N/A'}`;
      this.doc.text(statusInfo, this.margin, yPosition);
      yPosition += 12;

      // Add separator line
      this.doc.setDrawColor(229, 231, 235);
      this.doc.line(this.margin, yPosition - 2, this.pageWidth - this.margin, yPosition - 2);
      yPosition += 3;
    });

    // Summary footer
    if (schools.length > 20) {
      yPosition += 10;
      this.doc.setFontSize(10);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`📋 Showing first 20 schools. ${schools.length - 20} additional schools not displayed.`, this.margin, yPosition);
      yPosition += 8;
      this.doc.text(`💡 For complete school listings, contact MG Investments administration.`, this.margin, yPosition);
    }

    this.addFooter(1);
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  generateApplicationsReport(applications: JobApplication[]): Blob {
    let yPosition = this.addHeader(
      'Job Applications Report',
      `Comprehensive analysis of ${applications.length} job applications and hiring activities`
    );

    // Enhanced summary statistics
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    const approvedApps = applications.filter(a => a.status === 'approved').length;
    const rejectedApps = applications.filter(a => a.status === 'rejected').length;
    const reviewingApps = applications.filter(a => a.status === 'reviewing').length;

    // Calculate success rate and other metrics
    const processedApps = approvedApps + rejectedApps;
    const successRate = processedApps > 0 ? ((approvedApps / processedApps) * 100).toFixed(1) : '0';

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApps = applications.filter(a =>
      a.applied_at && new Date(a.applied_at) >= thirtyDaysAgo
    ).length;

    // Statistics Section with enhanced layout
    yPosition += 10;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('📊 Application Analytics', this.margin, yPosition);

    // Add background box for statistics
    this.doc.setFillColor(248, 250, 252);
    this.doc.rect(this.margin - 5, yPosition + 5, this.pageWidth - (this.margin * 2) + 10, 45, 'F');

    yPosition += 15;
    this.doc.setFontSize(11);
    this.doc.setTextColor(75, 85, 99);

    // Row 1: Basic counts
    this.doc.text(`Total Applications: ${applications.length}`, this.margin, yPosition);
    this.doc.text(`Recent (30 days): ${recentApps}`, this.margin + 90, yPosition);

    yPosition += 10;
    // Row 2: Status breakdown
    this.doc.text(`⏳ Pending: ${pendingApps}`, this.margin, yPosition);
    this.doc.text(`👀 Reviewing: ${reviewingApps}`, this.margin + 60, yPosition);
    this.doc.text(`✅ Approved: ${approvedApps}`, this.margin + 120, yPosition);

    yPosition += 10;
    // Row 3: Performance metrics
    this.doc.text(`❌ Rejected: ${rejectedApps}`, this.margin, yPosition);
    this.doc.text(`📈 Success Rate: ${successRate}%`, this.margin + 60, yPosition);
    this.doc.text(`🔄 Processing: ${pendingApps + reviewingApps}`, this.margin + 120, yPosition);

    // Status Distribution Chart (Text-based)
    yPosition += 25;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('📈 Status Distribution', this.margin, yPosition);

    yPosition += 10;
    this.doc.setFontSize(10);
    this.doc.setTextColor(75, 85, 99);

    const statusData = [
      { status: 'Pending', count: pendingApps, icon: '⏳', color: 'orange' },
      { status: 'Reviewing', count: reviewingApps, icon: '👀', color: 'blue' },
      { status: 'Approved', count: approvedApps, icon: '✅', color: 'green' },
      { status: 'Rejected', count: rejectedApps, icon: '❌', color: 'red' }
    ];

    statusData.forEach((item, index) => {
      if (item.count > 0) {
        const percentage = applications.length > 0 ? ((item.count / applications.length) * 100).toFixed(1) : '0';
        this.doc.text(`${item.icon} ${item.status}: ${item.count} applications (${percentage}%)`, this.margin, yPosition);
        yPosition += 8;
      }
    });

    // Applications Timeline
    yPosition += 15;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('📋 Application Details', this.margin, yPosition);

    yPosition += 5;
    this.doc.setFontSize(8);
    this.doc.setTextColor(107, 114, 128);
    this.doc.text('(Sorted by application date - most recent first)', this.margin, yPosition);

    yPosition += 10;
    this.doc.setFontSize(9);

    // Sort applications by date (most recent first)
    const sortedApps = [...applications]
      .sort((a, b) => new Date(b.applied_at || '').getTime() - new Date(a.applied_at || '').getTime())
      .slice(0, 25);

    sortedApps.forEach((app, index) => {
      if (yPosition > this.pageHeight - 70) {
        this.doc.addPage();
        this.addHeader('Job Applications Report (Continued)', 'Application Details');
        yPosition = 100;
      }

      // Application header with status indicator
      this.doc.setFontSize(11);
      this.doc.setTextColor(17, 24, 39);

      const statusIcons = {
        'pending': '⏳',
        'reviewing': '👀',
        'approved': '✅',
        'rejected': '❌'
      };

      const statusIcon = statusIcons[app.status as keyof typeof statusIcons] || '📄';
      const appHeader = `${index + 1}. ${statusIcon} ${app.teacher_name || 'Unknown Teacher'}`;
      this.doc.text(appHeader, this.margin, yPosition);
      yPosition += 8;

      // Application details in organized format
      this.doc.setFontSize(9);
      this.doc.setTextColor(75, 85, 99);

      // Position and School
      const positionSchool = `   🎯 Position: ${app.job_title || 'Not specified'} • 🏫 School: ${app.school_name || 'Not specified'}`;
      this.doc.text(positionSchool, this.margin, yPosition);
      yPosition += 7;

      // Application date and status
      const dateStatus = `   📅 Applied: ${app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'Unknown'} • 📊 Status: ${app.status || 'Unknown'}`;
      this.doc.text(dateStatus, this.margin, yPosition);
      yPosition += 7;

      // Contact and additional info
      if (app.teacher_email || app.teacher_phone) {
        const contact = `   📞 ${app.teacher_phone || 'No phone'} • ✉️ ${app.teacher_email || 'No email'}`;
        this.doc.text(contact, this.margin, yPosition);
        yPosition += 7;
      }

      // Notes and comments
      if (app.notes && app.notes.trim() !== '') {
        const notes = `   💬 Notes: ${app.notes.length > 60 ? app.notes.substring(0, 60) + '...' : app.notes}`;
        this.doc.text(notes, this.margin, yPosition);
        yPosition += 7;
      }

      // Application ID for reference
      const appId = `   🔗 Application ID: ${app.id?.substring(0, 12) || 'N/A'}`;
      this.doc.text(appId, this.margin, yPosition);
      yPosition += 10;

      // Add separator line
      this.doc.setDrawColor(229, 231, 235);
      this.doc.line(this.margin, yPosition - 2, this.pageWidth - this.margin, yPosition - 2);
      yPosition += 5;
    });

    // Summary footer
    if (applications.length > 25) {
      yPosition += 10;
      this.doc.setFontSize(10);
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(`📋 Showing 25 most recent applications. ${applications.length - 25} additional applications not displayed.`, this.margin, yPosition);
      yPosition += 8;
      this.doc.text(`💡 For complete application history, access the admin dashboard or contact support.`, this.margin, yPosition);
    }

    // Recommendations section
    yPosition += 15;
    this.doc.setFontSize(12);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('💡 Recommendations', this.margin, yPosition);

    yPosition += 10;
    this.doc.setFontSize(9);
    this.doc.setTextColor(75, 85, 99);

    const recommendations = [];
    if (pendingApps > 5) {
      recommendations.push(`• Review ${pendingApps} pending applications to improve response time`);
    }
    if (parseFloat(successRate) < 50 && processedApps > 10) {
      recommendations.push(`• Success rate is ${successRate}% - consider reviewing selection criteria`);
    }
    if (recentApps < 5) {
      recommendations.push(`• Only ${recentApps} applications in last 30 days - consider marketing outreach`);
    }
    if (recommendations.length === 0) {
      recommendations.push('• Application processing is performing well - maintain current standards');
    }

    recommendations.forEach((rec, index) => {
      this.doc.text(rec, this.margin, yPosition);
      yPosition += 8;
    });

    this.addFooter(1);
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  generateAnalyticsReport(stats: Stats, data: ReportData): Blob {
    let yPosition = this.addHeader(
      'Analytics Report',
      'Comprehensive platform analytics and insights'
    );

    // Key metrics
    yPosition += 10;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('Key Performance Indicators', this.margin, yPosition);

    yPosition += 15;
    this.doc.setFontSize(12);
    this.doc.setTextColor(75, 85, 99);

    // Display metrics
    this.doc.text(`Total Teachers: ${stats.totalTeachers?.toString() || '0'}`, this.margin, yPosition);
    yPosition += 10;
    this.doc.text(`Active Schools: ${stats.activeSchools?.toString() || '0'}`, this.margin, yPosition);
    yPosition += 10;
    this.doc.text(`Total Applications: ${stats.totalApplications?.toString() || '0'}`, this.margin, yPosition);
    yPosition += 10;
    this.doc.text(`Successful Placements: ${stats.successfulPlacements?.toString() || '0'}`, this.margin, yPosition);

    // Additional insights
    yPosition += 20;
    this.doc.setFontSize(14);
    this.doc.setTextColor(17, 24, 39);
    this.doc.text('Platform Insights', this.margin, yPosition);

    yPosition += 15;
    this.doc.setFontSize(10);
    this.doc.setTextColor(75, 85, 99);

    const insights = [
      `• Teacher-to-School Ratio: ${stats.totalTeachers && stats.activeSchools ?
        (stats.totalTeachers / stats.activeSchools).toFixed(1) : 'N/A'}:1`,
      `• Application Success Rate: ${stats.totalApplications && stats.successfulPlacements ?
        ((stats.successfulPlacements / stats.totalApplications) * 100).toFixed(1) : '0'}%`,
      `• Platform Growth: Active since ${new Date().getFullYear()}`,
      `• Geographic Coverage: Uganda (Primary focus on Entebbe region)`,
      `• Report Generated: ${new Date().toLocaleDateString()}`,
      `• Data Quality: ${data.teachers?.length || 0} teacher records, ${data.schools?.length || 0} school records`
    ];

    insights.forEach((insight, index) => {
      this.doc.text(insight, this.margin, yPosition + (index * 10));
    });

    this.addFooter(1);
    return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
  }

  downloadReport(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const reportGenerator = new ReportGenerator();
