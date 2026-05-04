import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-citizen-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './citizen-portal.html',
  styleUrl: './citizen-portal.css',
})
export class CitizenPortal {
  userName = 'Alex';
  feedbackForm: FormGroup;
  reportForm: FormGroup;
  showFeedbackModal = false;
  showReportModal = false;
  submittedReports: any[] = [];

  overviewCards = [
    { label: 'Open Requests', value: 3, icon: '📬' },
    { label: 'Notifications', value: 5, icon: '🔔' }
  ];
  recentUpdates = [
    { title: 'Water usage report ready', detail: 'Review your monthly water usage for April.', time: 'Today' },
    { title: 'Community meeting scheduled', detail: 'Join the event on sustainable transport.', time: 'Tomorrow' },
    { title: 'New recycling pickup policy', detail: 'Check changes for the next pickup cycle.', time: 'This week' }
  ];

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['General', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.reportForm = this.fb.group({
      issueType: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['Medium', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  openFeedbackModal() {
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackForm.reset();
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      console.log('Feedback submitted:', this.feedbackForm.value);
      alert('Thank you for your feedback!');
      this.closeFeedbackModal();
    }
  }

  openReportModal() {
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.reportForm.reset();
  }

  submitReport() {
    if (this.reportForm.valid) {
      const newReport = {
        id: Date.now(),
        ...this.reportForm.value,
        status: 'Submitted',
        submittedDate: new Date().toLocaleDateString()
      };
      this.submittedReports.unshift(newReport);
      console.log('Report submitted:', newReport);
      alert('Your report has been submitted successfully!');
      this.closeReportModal();
    }
  }
}
