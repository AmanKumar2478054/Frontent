import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitizenService } from '../../Service/citizen.service';
import { CitizenReport } from '../../core/models/citizen-report';
import { Feedback } from '../../core/models/feedback';
import { TopNavbar } from '../../core/components/top-navbar/top-navbar';
import { NotificationService } from '../../Service/notification.service';
import { NotificationItem } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-citizen-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TopNavbar],
  templateUrl: './citizen-portal.html',
  styleUrl: './citizen-portal.css',
})
export class CitizenPortal implements OnInit, AfterViewInit {
  userName = 'Citizen';
  feedbackForm: FormGroup;
  reportForm: FormGroup;
  showFeedbackModal = false;
  showReportModal = false;
  submittedReports: CitizenReport[] = [];
  submittedFeedbacks: Feedback[] = [];
  loadingReports = false;
  loadingFeedbacks = false;
  loadingNotifications = false;

  overviewCards = [
    { label: 'Open Requests', value: 3, icon: '📬' },
    { label: 'Notifications', value: 5, icon: '🔔' }
  ];
  recentUpdates: NotificationItem[] = [];

  constructor(
    private fb: FormBuilder,
    private citizenService: CitizenService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
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
    this.fetchInitialData();
  }

  ngAfterViewInit(): void {
    // Keep one deferred fetch after first render to avoid route-transition timing races.
    queueMicrotask(() => this.fetchInitialData());
  }

  private fetchInitialData(): void {
    this.loadMyReports();
    this.loadMyFeedbacks();
    this.loadMyNotifications();
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
        error: (err: unknown) => {
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
        error: (err: unknown) => {
          console.error('Report submission failed', err);
          alert('Failed to submit report.');
        }
      });
    }
  }

  private loadMyReports() {
    this.loadingReports = true;
    this.citizenService.getMyReports().subscribe({
      next: (reports: CitizenReport[]) => {
        this.submittedReports = reports ?? [];
        this.loadingReports = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.submittedReports = [];
        this.loadingReports = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadMyFeedbacks() {
    this.loadingFeedbacks = true;
    this.citizenService.getMyFeedbacks().subscribe({
      next: (feedbacks: Feedback[]) => {
        this.submittedFeedbacks = feedbacks ?? [];
        this.loadingFeedbacks = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.submittedFeedbacks = [];
        this.loadingFeedbacks = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadMyNotifications() {
    this.loadingNotifications = true;
    this.notificationService.getMyNotifications().subscribe({
      next: (notifications: NotificationItem[]) => {
        this.recentUpdates = (notifications ?? []).slice(0, 4);
        this.overviewCards = this.overviewCards.map((card) =>
          card.label === 'Notifications'
            ? { ...card, value: this.recentUpdates.length }
            : card
        );
        this.loadingNotifications = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recentUpdates = [];
        this.loadingNotifications = false;
        this.cdr.detectChanges();
      },
    });
  }
}
