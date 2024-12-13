import { Component, inject } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { Meeting, MeetingStatus } from '../meetings/types';
import { MeetingService } from '../meetings/service/meeting.service';
import { AuthService } from '../auth/services/auth.service';
import { SharedService } from '../../shared/services/shared.service';
import { RescheduleModalComponent } from '../meetings/components/reschedule-modal/reschedule-modal.component';
import { DeclineModalComponent } from '../meetings/components/decline-modal/decline-modal.component';
import { AcceptModalComponent } from '../meetings/components/accept-modal/accept-modal.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pending-meetings',
  standalone: true,
  imports: [
    CustomButtonComponent,
    RescheduleModalComponent,
    DeclineModalComponent,
    AcceptModalComponent,
    LoaderComponent,
    DatePipe,
  ],
  templateUrl: './pending-meetings.component.html',
  styleUrl: './pending-meetings.component.css',
})
export class PendingMeetingsComponent {
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);

  protected pendingMeetings: Meeting[] = [];
  protected MeetingStatus = MeetingStatus;
  private userId: string | undefined =
    this.authService.getUserDetails()?.user_id;
  meetingId = '';
  inviteeName = '';
  inviteeEmail = '';

  protected isRescheduleModalOpen = false;
  protected isDeclinedModalOpen = false;
  protected isAcceptModalOpen = false;
  protected isLoading = true;
  protected acceptMeet = MeetingStatus.Upcoming;

  ngOnInit() {
    this.fetchUserPendingMeetings();
  }

  private fetchUserPendingMeetings() {
    this.meetingService.getUserMeetings(this.userId).subscribe({
      next: (response) => {
        this.pendingMeetings = response
          .filter((meeting) => meeting.status === MeetingStatus.Pending)
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
    this.fetchUserPendingMeetings();
  }

  onDeclineMeetingSuccess() {
    this.fetchUserPendingMeetings();
  }
  onMeetingRescheduled() {
    this.fetchUserPendingMeetings();
  }

  protected toggleScheduleModal(meeting: Meeting) {
    this.meetingId = meeting.id;
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
