import { Component, Input } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface CalendarDate {
  date: number | null;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}
@Component({
  selector: 'app-booking-profile',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './booking-profile.component.html',
  styleUrl: './booking-profile.component.css',
})
export class BookingProfileComponent {
  showModal = false;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: CalendarDate[] = [];
  currentDate: Date = new Date();

  constructor(private fb: FormBuilder) {}

  protected bookingForm = this.fb.group({
    inviteeName: ['', [Validators.required]],
    inviteeEmail: ['', [Validators.required, Validators.email]],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    summary: ['', [Validators.required]],
  });

  ngOnInit() {
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

    // Optional: Log the selected date for debugging
    console.log('Selected date:', formattedDate);
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
      console.log('Form submitted:', formData);
    } else {
      console.log('Form is invalid');
    }
  }

  onCancel() {
    console.log('clicked');
    this.showModal = !this.showModal;
  }
}
