import { Component, inject } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { MeetingService } from './service/meeting.service';
import { AuthService } from '../auth/services/auth.service';
import { Meeting, MeetingStatus } from './types';
import { CommonModule, DatePipe } from '@angular/common';
import { RescheduleModalComponent } from './components/reschedule-modal/reschedule-modal.component';
import { DeclineModalComponent } from './components/decline-modal/decline-modal.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SharedService } from '../../shared/services/shared.service';
import { AcceptModalComponent } from './components/accept-modal/accept-modal.component';

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [
    CustomButtonComponent,
    DatePipe,
    RescheduleModalComponent,
    DeclineModalComponent,
    LoaderComponent,
    CommonModule,
    AcceptModalComponent,
  ],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css',
})
export class MeetingsComponent {
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  protected upcomingMeetings: Meeting[] = [];
  protected MeetingStatus = MeetingStatus;
  private userId = this.authService.getUserId;
  meetingId = '';
  inviteeName = '';
  inviteeEmail = '';

  protected isRescheduleModalOpen = false;
  protected isDeclinedModalOpen = false;
  protected isAcceptModalOpen = false;
  protected isLoading = true;
  protected acceptMeet = MeetingStatus.Upcoming;

  ngOnInit() {
    this.fetchUserMeetings();
  }

  private fetchUserMeetings() {
    this.meetingService.getUserMeetings(this.userId).subscribe({
      next: (response) => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        this.upcomingMeetings = response
          .filter(
            (meeting) =>
              meeting.status === MeetingStatus.Upcoming &&
              new Date(meeting.date).setHours(0, 0, 0, 0) >= currentDate
          )
          .sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.startTime}`);
            const dateB = new Date(`${b.date} ${b.startTime}`);
            return dateA.getTime() - dateB.getTime();
          });

        this.isLoading = false;
      },
      error: (error) => {
        this.sharedService.warningToastr(error);
        this.isLoading = false;
      },
    });
  }

  onAcceptMeeting() {
    this.fetchUserMeetings();
  }

  onDeclineMeetingSuccess() {
    this.fetchUserMeetings();
  }
  onMeetingRescheduled() {
    this.fetchUserMeetings();
  }

  protected toggleScheduleModal(meeting: Meeting) {
    this.meetingId = meeting.id;
    this.inviteeEmail = meeting.inviteeEmail;
    this.inviteeName = meeting.inviteeName;
    this.isRescheduleModalOpen = !this.isRescheduleModalOpen;
  }

  protected toggleDeclineModal(meeting: Meeting) {
    this.meetingId = meeting.id;
    this.isDeclinedModalOpen = !this.isDeclinedModalOpen;
  }

  protected toggleAcceptModal(meeting: Meeting) {
    this.meetingId = meeting.id;
    this.isAcceptModalOpen = !this.isAcceptModalOpen;
  }
}
