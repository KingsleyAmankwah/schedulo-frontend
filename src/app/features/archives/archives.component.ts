import { Component, inject } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { MeetingService } from '../meetings/service/meeting.service';
import { Meeting, MeetingStatus } from '../meetings/types';
import { AuthService } from '../auth/services/auth.service';
import { response } from 'express';
import { DatePipe } from '@angular/common';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CustomButtonComponent, DatePipe, LoaderComponent],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.css',
})
export class ArchivesComponent {
  private meetingService = inject(MeetingService);
  private authService = inject(AuthService);
  private userId = this.authService.getUserId;
  protected userDeclinedMeetings: Meeting[] = [];
  protected isLoading = true;

  protected meetingStatus = MeetingStatus;
  private sharedService = inject(SharedService);

  ngOnInit() {
    this.fetchUserMeetings();
  }

  protected fetchUserMeetings() {
    this.meetingService.getDeclinedMeetings(this.userId).subscribe({
      next: (response) => {
        this.userDeclinedMeetings = response;
        this.isLoading = false;
      },

      error: (error) => {
        this.sharedService.warningToastr(error);
        this.isLoading = false;
      },
    });
  }
}
