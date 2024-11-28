import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { UserDetails } from '../auth/interfaces';
import { Meeting } from '../meetings/types';
import { MeetingService } from '../meetings/service/meeting.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private meetingService = inject(MeetingService);
  private userId = this.authService.getUserDetails()?.user_id;

  protected user: UserDetails | null = null;
  profileVisits = 0;
  totalMeetings = 0;
  completedMeetings = 0;
  upcomingMeetings: Meeting[] = [];
  pendingMeetings: Meeting[] = [];
  totalContacts = 0;

  constructor() {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.user = this.authService.getUserDetails();

    this.meetingService.getUserMeetings(this.userId).subscribe((meetings) => {
      this.upcomingMeetings = meetings.filter((m) => m.status == 'UPCOMING');
      this.pendingMeetings = meetings.filter((m) => m.status == 'PENDING');
      this.totalMeetings = meetings.length;
    });
  }
}
