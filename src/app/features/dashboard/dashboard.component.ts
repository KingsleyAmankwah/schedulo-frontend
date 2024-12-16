import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { UserDetails } from '../auth/interfaces';
import { Meeting, MeetingStatus } from '../meetings/types';
import { MeetingService } from '../meetings/service/meeting.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'REVOKED';
  registeredDate: string;
}

interface Feedback {
  id: number;
  user: string;
  message: string;
  rating: number;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, CommonModule, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private meetingService = inject(MeetingService);
  private userId = this.authService.getUserId;
  protected user: UserDetails | null = null;
  isLoading = true;
  profileVisits = 0;
  totalMeetings = 0;
  declinedMeetings: Meeting[] = [];
  upcomingMeetings: Meeting[] = [];
  pendingMeetings: Meeting[] = [];
  pastMeetings: Meeting[] = [];
  totalContacts = 0;
  users: User[] = [];
  feedbacks: Feedback[] = [];

  constructor() {
    this.getUserInfo();
  }

  ngOnInit() {
    this.loadDashboardData();
    this.isLoading = false;
  }

  private getUserInfo() {
    this.authService.fetchUserDetails(this.userId).subscribe({
      next: (response: UserDetails) => {
        this.user = response;
      },
    });
  }

  private loadDashboardData() {
    this.meetingService.getUserMeetings(this.userId).subscribe((meetings) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to midnight for date-only comparison

      // Filter upcoming meetings
      this.upcomingMeetings = meetings
        .filter((m) => {
          const meetingDate = new Date(m.date);
          return (
            m.status === MeetingStatus.Upcoming &&
            meetingDate.getTime() === today.getTime()
          );
        })
        .sort((a, b) => {
          const timeA = new Date(`1970/01/01 ${a.startTime}`);
          const timeB = new Date(`1970/01/01 ${b.startTime}`);
          return timeA.getTime() - timeB.getTime();
        });

      // Filter past meetings (based only on date)
      this.pastMeetings = meetings.filter((m) => {
        const meetingDate = new Date(m.date);
        meetingDate.setHours(0, 0, 0, 0); // Normalize meetingDate to midnight
        return meetingDate < today; // Fetch meetings before today
      });

      // Filter pending meetings
      this.pendingMeetings = meetings.filter(
        (m) => m.status === MeetingStatus.Pending
      );

      // Filter declined meetings
      this.declinedMeetings = meetings.filter(
        (m) => m.status === MeetingStatus.Cancelled
      );

      // Calculate total meetings
      this.totalMeetings = meetings.length;
    });
  }
}
