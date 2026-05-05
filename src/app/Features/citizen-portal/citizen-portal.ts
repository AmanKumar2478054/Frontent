import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitizenService } from '../../Service/citizen.service';
import { CitizenReport } from '../../core/models/citizen-report';
import { Feedback } from '../../core/models/feedback';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-citizen-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './citizen-portal.html',
  styleUrl: './citizen-portal.css',
})
export class CitizenPortal implements OnInit {
  userName = 'Citizen';
  feedbackForm: FormGroup;
  reportForm: FormGroup;
  showFeedbackModal = false;
  showReportModal = false;
  submittedReports: CitizenReport[] = [];
  submittedFeedbacks: Feedback[] = [];
  loadingReports = false;
  loadingFeedbacks = false;

  overviewCards = [
    { label: 'Open Requests', value: 3, icon: '📬' },
    { label: 'Notifications', value: 5, icon: '🔔' }
  ];
  recentUpdates = [
    { title: 'Water usage report ready', detail: 'Review your monthly water usage for April.', time: 'Today' },
    { title: 'Community meeting scheduled', detail: 'Join the event on sustainable transport.', time: 'Tomorrow' },
    { title: 'New recycling pickup policy', detail: 'Check changes for the next pickup cycle.', time: 'This week' }
  ];

  constructor(
    private fb: FormBuilder,
    private citizenService: CitizenService,
    private authService: AuthService
  ) {
    this.feedbackForm = this.fb.group({
      category: ['Waste', Validators.required],
      comments: ['', [Validators.required, Validators.minLength(10)]],
      status: ['OPEN', Validators.required]
    });
    this.reportForm = this.fb.group({
      type: ['POLLUTION', Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      status: ['OPEN', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMyReports();
    this.loadMyFeedbacks();
  }

  openFeedbackModal() {
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.feedbackForm.reset({ category: 'Waste', comments: '', status: 'OPEN' });
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.citizenService.createFeedback(this.feedbackForm.value).subscribe({
        next: () => {
          alert('Thank you for your feedback!');
          this.loadMyFeedbacks();
          this.closeFeedbackModal();
        },
        error: (err) => {
          console.error('Feedback submission failed', err);
          alert('Failed to submit feedback.');
        }
      });
    }
  }

  openReportModal() {
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.reportForm.reset({ type: 'POLLUTION', location: '', status: 'OPEN' });
  }

  submitReport() {
    if (this.reportForm.valid) {
      this.citizenService.createReport(this.reportForm.value).subscribe({
        next: () => {
          alert('Your report has been submitted successfully!');
          this.loadMyReports();
          this.closeReportModal();
        },
        error: (err) => {
          console.error('Report submission failed', err);
          alert('Failed to submit report.');
        }
      });
    }
  }

  private loadMyReports() {
    this.loadingReports = true;
    this.citizenService.getMyReports().subscribe({
      next: (reports) => {
        this.submittedReports = reports ?? [];
        this.loadingReports = false;
      },
      error: () => {
        this.submittedReports = [];
        this.loadingReports = false;
      }
    });
  }

  private loadMyFeedbacks() {
    this.loadingFeedbacks = true;
    this.citizenService.getMyFeedbacks().subscribe({
      next: (feedbacks) => {
        this.submittedFeedbacks = feedbacks ?? [];
        this.loadingFeedbacks = false;
      },
      error: () => {
        this.submittedFeedbacks = [];
        this.loadingFeedbacks = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
