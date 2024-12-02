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
    console.log(this.user);

    this.meetingService.getUserMeetings(this.userId).subscribe((meetings) => {
      this.upcomingMeetings = meetings
        .filter((m) => {
          const today = new Date();
          const meetingDate = new Date(m.date);

          return (
            m.status == 'UPCOMING' &&
            meetingDate.getDate() === today.getDate() &&
            meetingDate.getMonth() === today.getMonth() &&
            meetingDate.getFullYear() === today.getFullYear()
          );
        })
        .sort((a, b) => {
          const timeA = new Date(`1970/01/01 ${a.startTime}`);
          const timeB = new Date(`1970/01/01 ${b.startTime}`);

          return timeA.getTime() - timeB.getTime();
        });
      this.pendingMeetings = meetings.filter((m) => m.status == 'PENDING');
      this.totalMeetings = meetings.length;
    });
  }
}
