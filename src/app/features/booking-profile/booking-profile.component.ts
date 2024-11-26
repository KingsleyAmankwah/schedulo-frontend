import { Component, Input } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from './services/booking.service';
import { ActivatedRoute } from '@angular/router';
import { BookingRequest, BookingResponse } from './types';
import { ClockTimePickerComponent } from '../../shared/components/clock-time-picker/clock-time-picker.component';
import { SharedService } from '../../shared/services/shared.service';
interface CalendarDate {
  date: number | null;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}
@Component({
  selector: 'app-booking-profile',
  standalone: true,
  imports: [
    CustomButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    ClockTimePickerComponent,
  ],
  templateUrl: './booking-profile.component.html',
  styleUrl: './booking-profile.component.css',
})
export class BookingProfileComponent {
  showModal = false;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: CalendarDate[] = [];
  currentDate: Date = new Date();
  hostSlug: string | null = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private sharedService: SharedService
  ) {}

  protected bookingForm = this.fb.group({
    inviteeName: ['', [Validators.required]],
    inviteeEmail: ['', [Validators.required, Validators.email]],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    summary: ['', [Validators.required]],
  });

  ngOnInit() {
    this.hostSlug = this.route.snapshot.paramMap.get('userId');
    this.generateCalendarDates();
  }

  generateCalendarDates() {
    this.calendarDates = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const today = new Date();

    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Get days in month
    const daysInMonth = lastDay.getDate();
    // Get day of week for first day (0-6)
    const startingDay = firstDay.getDay();

    // Get days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    // Add days from previous month
    for (let i = startingDay - 1; i >= 0; i--) {
      this.calendarDates.push({
        date: prevMonthDays - i,
        isSelected: false,
        isToday: false,
        isCurrentMonth: false,
      });
    }

    // Add days for current month
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDates.push({
        date: i,
        isSelected: false,
        isToday:
          i === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear(),
        isCurrentMonth: true,
      });
    }

    // Add days from next month
    const remainingDays = 42 - this.calendarDates.length; // 6 rows × 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      this.calendarDates.push({
        date: i,
        isSelected: false,
        isToday: false,
        isCurrentMonth: false,
      });
    }
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendarDates();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendarDates();
  }

  selectDate(date: CalendarDate) {
    if (!date.date || !date.isCurrentMonth) return;

    // Deselect all dates
    this.calendarDates.forEach((d) => (d.isSelected = false));

    // Select the clicked date
    date.isSelected = true;

    // Create a full date object using the selected date
    const selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      date.date
    );

    // Format the date as YYYY-MM-DD for the form
    const formattedDate = selectedDate.toISOString().split('T')[0];

    // Update the form control
    this.bookingForm.patchValue({
      date: formattedDate,
    });
  }

  // Method to get the currently selected date (useful for validation or display)
  getSelectedDate(): string | null {
    return this.bookingForm.get('date')?.value || null;
  }

  // Optional: Method to check if a date is valid for selection
  isValidDate(date: CalendarDate): boolean {
    if (!date.isCurrentMonth) return false;

    // Create date objects for comparison
    // Set hours, minutes, seconds, and milliseconds to 0 for accurate date comparison
    const selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      date.date!
    );
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;
      const data: BookingRequest = {
        hostSlug: this.hostSlug,
        inviteeName: formData.inviteeName,
        inviteeEmail: formData.inviteeEmail,
        summary: formData.summary,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      this.bookingService.scheduleMeeting(data).subscribe({
        next: (response: BookingResponse) => {
          this.sharedService.successToastr(response.message);
          this.bookingForm.reset();
        },
        error: (error) => {
          this.sharedService.errorToastr(error.error.error);
        },
      });
    } else {
      this.sharedService.warningToastr(
        'Please all field are required to be filled'
      );
    }
  }

  formatTime(controlName: 'startTime' | 'endTime') {
    const timeControl = this.bookingForm.get(controlName);
    if (timeControl && timeControl.value) {
      const [hours, minutes] = timeControl.value.split(':');
      let formattedTime = this.convertTo12HourFormat(
        parseInt(hours),
        parseInt(minutes)
      );
      timeControl.setValue(formattedTime, { emitEvent: false });
    }
  }

  convertTo12HourFormat(hours: number, minutes: number): string {
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${adjustedHours}:${paddedMinutes} ${period}`;
  }

  onCancel() {
    console.log('clicked');
    this.showModal = !this.showModal;
  }
}
