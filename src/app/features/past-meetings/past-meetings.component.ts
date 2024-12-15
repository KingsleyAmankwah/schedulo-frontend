import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { AuthService } from '../auth/services/auth.service';
import { MeetingService } from '../meetings/service/meeting.service';
import { SharedService } from '../../shared/services/shared.service';
import { Meeting, MeetingStatus } from '../meetings/types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-past-meetings',
  standalone: true,
  imports: [LoaderComponent, DatePipe],
  templateUrl: './past-meetings.component.html',
  styleUrl: './past-meetings.component.css',
})
export class PastMeetingsComponent {
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  private sharedService = inject(SharedService);
  protected pastMeetings: Meeting[] = [];
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
        this.pastMeetings = response
          .filter(
            (meeting) =>
              meeting.status === MeetingStatus.Upcoming &&
              new Date(meeting.date).setHours(0, 0, 0, 0) < currentDate
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
}
