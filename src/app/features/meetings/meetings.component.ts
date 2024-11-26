import { Component, inject, Input } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { MeetingService } from './service/meeting.service';
import { AuthService } from '../auth/services/auth.service';
import { Meeting, MeetingStatus } from './types';
import { CommonModule, DatePipe } from '@angular/common';
import { RescheduleModalComponent } from './components/reschedule-modal/reschedule-modal.component';
import { DeclineModalComponent } from './components/decline-modal/decline-modal.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

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
  ],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css',
})
export class MeetingsComponent {
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  protected userMeetings: Meeting[] = [];
  protected MeetingStatus = MeetingStatus;
  private userId: string | undefined =
    this.authService.getUserDetails()?.user_id;
  meetingId = '';
  inviteeName = '';
  inviteeEmail = '';

  protected isRescheduleModalOpen = false;
  protected isDeclinedModalOpen = false;
  protected acceptMeet = MeetingStatus.Upcoming;

  ngOnInit() {
    this.fetchUserMeetings();
    this.meetingId;
  }

  private fetchUserMeetings() {
    this.meetingService.getUserMeetings(this.userId).subscribe({
      next: (response) => {
        this.userMeetings = response;

        this.userMeetings.forEach((meeting) => {
          this.meetingId = meeting.id;
          this.inviteeEmail = meeting.inviteeEmail;
          this.inviteeName = meeting.inviteeName;
        });
      },
      error: (error) => {
        console.log('Error fetching user meetings', error);
      },
    });
  }

  protected acceptInvite() {
    this.meetingService
      .acceptMeeting(this.meetingId, this.acceptMeet)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.fetchUserMeetings();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onDeclineMeetingSuccess() {
    this.fetchUserMeetings();
  }
  onMeetingRescheduled() {
    this.fetchUserMeetings();
  }

  protected toggleScheduleModal() {
    this.isRescheduleModalOpen = !this.isRescheduleModalOpen;
  }

  protected toggleDeclineModal() {
    this.isDeclinedModalOpen = !this.isDeclinedModalOpen;
  }
}
