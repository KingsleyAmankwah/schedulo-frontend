import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import { MeetingService } from '../../service/meeting.service';
import { MeetingStatus } from '../../types';
import { BookingResponse } from '../../../booking-profile/types';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-accept-modal',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule],
  templateUrl: './accept-modal.component.html',
  styleUrl: './accept-modal.component.css',
})
export class AcceptModalComponent {
  isLoading = false;
  @Input() showModal = false;
  @Input() meetingId = '';
  @Output() meetingAccepted = new EventEmitter();
  private meetStats = MeetingStatus.Upcoming;

  private meetingService = inject(MeetingService);
  private sharedService = inject(SharedService);

  onCancel() {
    this.showModal = !this.showModal;
  }

  protected acceptInvite() {
    this.isLoading = true;
    this.meetingService
      .acceptMeeting(this.meetingId, this.meetStats)
      .subscribe({
        next: (response: BookingResponse) => {
          this.meetingAccepted.emit(this.meetingId);
          this.sharedService.successToastr(response.message);
          this.isLoading = false;
          this.onCancel();
        },
        error: (error) => {
          this.sharedService.errorToastr(error.error.message);
          this.isLoading = false;
        },
      });
  }
}
