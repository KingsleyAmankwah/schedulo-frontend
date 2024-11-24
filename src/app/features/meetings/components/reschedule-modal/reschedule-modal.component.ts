import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
interface CalendarDate {
  date: number | null;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-reschedule-modal',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './reschedule-modal.component.html',
  styleUrl: './reschedule-modal.component.css',
})
export class RescheduleModalComponent {
  @Input() showModal = false;
  eventForm: FormGroup;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDates: CalendarDate[] = [];
  currentDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      selectedDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

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

    // Update form control
    const selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      date.date
    );
    this.eventForm.patchValue({
      selectedDate: selectedDate.toISOString().split('T')[0],
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('Form submitted:', this.eventForm.value);
    }
  }

  onCancel() {
    // this.eventForm.reset();
    // this.calendarDates.forEach((date) => (date.isSelected = false));
    this.showModal = !this.showModal;
  }
}
