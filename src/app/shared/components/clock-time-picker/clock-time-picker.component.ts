import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-clock-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock-time-picker.component.html',
  styleUrl: './clock-time-picker.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClockTimePickerComponent),
      multi: true,
    },
  ],
})
export class ClockTimePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  isPickerOpen = false;
  selectedHour: number | null = null;
  selectedMinute: string | null = null;
  selectedPeriod: 'AM' | 'PM' | null = null;
  stage: 'hours' | 'minutes' | 'period' = 'hours';
  displayTime = '';

  hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  minuteOptions = [
    '00',
    '05',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
  ];

  togglePicker() {
    this.isPickerOpen = !this.isPickerOpen;
    this.stage = 'hours';
  }

  selectHour(hour: number) {
    this.selectedHour = hour;
    this.stage = 'minutes';
  }

  selectMinute(minute: string) {
    this.selectedMinute = minute;
    this.stage = 'period';
  }

  selectPeriod(period: 'AM' | 'PM') {
    this.selectedPeriod = period;
    this.isPickerOpen = false;
    this.updateTime();
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private updateTime() {
    if (this.selectedHour && this.selectedMinute && this.selectedPeriod) {
      // Ensure time is formatted as hh:mm AM/PM
      const formattedTime = this.formatTime(
        this.selectedHour,
        this.selectedMinute,
        this.selectedPeriod
      );
      this.displayTime = formattedTime; // Update display time

      // Send time in a consistent 12-hour format with AM/PM
      this.onChange(formattedTime);
    }
  }

  private formatTime(
    hour: number,
    minute: string,
    period: 'AM' | 'PM'
  ): string {
    // Ensure minutes are always 2 digits
    const formattedMinute = minute.padStart(2, '0');

    // Format time as hh:mm AM/PM
    return `${hour.toString().padStart(2, '0')}:${formattedMinute} ${period}`;
  }

  // private updateTime() {
  //   if (this.selectedHour && this.selectedMinute && this.selectedPeriod) {
  //     this.displayTime = `${this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}`;

  //     let hours = this.selectedHour;
  //     if (this.selectedPeriod === 'PM' && hours !== 12) {
  //       hours += 12;
  //     }
  //     if (this.selectedPeriod === 'AM' && hours === 12) {
  //       hours = 0;
  //     }

  //     const formattedTime = `${hours.toString().padStart(2, '0')}:${
  //       this.selectedMinute
  //     }`;
  //     this.onChange(`${formattedTime} ${this.selectedPeriod}`);
  //   }
  // }

  writeValue(value: string): void {
    if (value) {
      const [time, periodValue] = value.split(' ');
      const [inputHours, inputMinutes] = time.split(':');

      let convertedHours = parseInt(inputHours);
      const period = convertedHours >= 12 ? 'PM' : 'AM';

      this.selectedHour = convertedHours % 12 || 12;
      this.selectedMinute = inputMinutes;
      this.selectedPeriod = period as 'AM' | 'PM';

      this.displayTime = `${this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}`;
    }
  }
}
