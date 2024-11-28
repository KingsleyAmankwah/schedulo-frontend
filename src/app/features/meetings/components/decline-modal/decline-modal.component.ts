import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../service/meeting.service';
import { MeetingStatus } from '../../types';
import { response } from 'express';
import { SharedService } from '../../../../shared/services/shared.service';
import { BookingResponse } from '../../../booking-profile/types';

@Component({
  selector: 'app-decline-modal',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule],
  templateUrl: './decline-modal.component.html',
  styleUrl: './decline-modal.component.css',
})
export class DeclineModalComponent {
  @Input() meetingId = '';
  @Input() showModal = false;
  @Output() meetingCancelled = new EventEmitter<string>();

  private meetingService = inject(MeetingService);
  private sharedService = inject(SharedService);
  private meetStats = MeetingStatus.Cancelled;

  onClose() {
    this.showModal = false;
  }
  protected declineMeeting() {
    if (!this.meetingId) {
      this.sharedService.infoToastr('No meeting id found');
      return;
    }

    this.meetingService
      .cancelMeeting(this.meetingId, this.meetStats)
      .subscribe({
        next: (response: BookingResponse) => {
          this.sharedService.successToastr(response.message);
          this.meetingCancelled.emit(this.meetingId);
          this.onClose();
        },

        error: (error) => {
          this.sharedService.errorToastr(error.error.message);
        },
      });
  }
}
