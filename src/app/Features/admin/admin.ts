import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  adminName = 'Admin User';

  // Dashboard statistics
  stats = [
    { label: 'Total Reports', value: 24, icon: '📋', change: '+12%', trend: 'up' },
    { label: 'Pending Reviews', value: 8, icon: '⏳', change: '+3', trend: 'up' },
    { label: 'Resolved Issues', value: 16, icon: '✅', change: '+8', trend: 'up' },
    { label: 'Active Users', value: 156, icon: '👥', change: '+23', trend: 'up' }
  ];

  // Recent reports (simulated data)
  recentReports = [
    {
      id: 1,
      issueType: 'Street Lights',
      location: '123 Main Street, Downtown',
      description: 'The street light at the corner has been out for three days.',
      priority: 'High',
      status: 'Pending',
      submittedDate: '2026-04-28',
      submittedBy: 'alex.citizen@greencity.gov'
    },
    {
      id: 2,
      issueType: 'Waste Pickup',
      location: '456 Oak Avenue',
      description: 'Garbage not collected this week, bin overflowing.',
      priority: 'Medium',
      status: 'In Progress',
      submittedDate: '2026-04-27',
      submittedBy: 'sarah.resident@greencity.gov'
    },
    {
      id: 3,
      issueType: 'Pothole',
      location: '789 Pine Street',
      description: 'Large pothole causing vehicle damage.',
      priority: 'High',
      status: 'Resolved',
      submittedDate: '2026-04-26',
      submittedBy: 'mike.driver@greencity.gov'
    }
  ];

  // Recent feedback
  recentFeedback = [
    {
      id: 1,
      title: 'Improve recycling program',
      category: 'Sustainability',
      message: 'The current recycling program is great, but we could improve it by adding more collection points.',
      submittedBy: 'alex.citizen@greencity.gov',
      submittedDate: '2026-04-28',
      status: 'New'
    },
    {
      id: 2,
      title: 'Better public transport',
      category: 'Services',
      message: 'The bus schedule needs to be more frequent during peak hours.',
      submittedBy: 'sarah.resident@greencity.gov',
      submittedDate: '2026-04-27',
      status: 'Reviewed'
    }
  ];

  // System status
  systemStatus = [
    { component: 'Report Submission', status: 'Operational', uptime: '99.9%' },
    { component: 'Feedback System', status: 'Operational', uptime: '99.8%' },
    { component: 'User Authentication', status: 'Operational', uptime: '100%' },
    { component: 'Database', status: 'Operational', uptime: '99.9%' }
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'Operational': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'In Progress': return 'text-blue-600';
      case 'Resolved': return 'text-green-600';
      case 'New': return 'text-blue-600';
      case 'Reviewed': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  updateReportStatus(reportId: number, newStatus: string) {
    const report = this.recentReports.find(r => r.id === reportId);
    if (report) {
      report.status = newStatus;
    }
  }

  updateFeedbackStatus(feedbackId: number, newStatus: string) {
    const feedback = this.recentFeedback.find(f => f.id === feedbackId);
    if (feedback) {
      feedback.status = newStatus;
    }
  }

  onReportStatusChange(reportId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateReportStatus(reportId, target.value);
  }

  onFeedbackStatusChange(feedbackId: number, event: Event) {
    const target = event.target as HTMLSelectElement;
    this.updateFeedbackStatus(feedbackId, target.value);
  }
}
