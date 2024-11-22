import { Component, inject, OnInit } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { AuthService } from '../auth/services/auth.service';
import { AvailabilityService } from './service/availability.service';
import { CommonModule } from '@angular/common';
import { AvailabilityEntry, UserAvailability } from './types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CustomButtonComponent, FormsModule, CommonModule],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css',
})
export class AvailabilityComponent implements OnInit {
  private userId: string | undefined = '';
  private authService = inject(AuthService);
  private availabilityService = inject(AvailabilityService);

  protected dayOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  protected availability: AvailabilityEntry[] = this.dayOfWeek.map((day) => ({
    dayOfWeek: day,
    enabled: false,
    startTime: '',
    endTime: '',
    error: '',
  }));

  ngOnInit() {
    this.userId = this.authService.getUserDetails()?.user_id;
    // this.getUserAvailability();
  }
  protected validateAvalability() {
    let isValid = true;
    this.availability.forEach((entry) => {
      if (entry.enabled) {
        if (!entry.startTime || !entry.endTime) {
          entry.error = 'Start and end times are requried.';
          isValid = false;
        } else if (entry.startTime >= entry.endTime) {
          entry.error = 'Start time must be earlier than end time.';
          isValid = false;
        } else {
          entry.error = '';
        }
      }
    });

    return isValid;
  }

  protected submitAvailability() {
    if (!this.validateAvalability) return;

    const userId = this.userId;
    const availabilities = this.availability
      .filter((a) => a.enabled)
      .map((a) => ({
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      }));

    const payload = { userId, availabilities };
    console.log(payload);

    this.availabilityService.createAvailability(payload).subscribe({
      next: (response) => {
        console.log(response);
      },

      error: (error) => {
        console.log(error);
      },
    });
  }

  protected getUserAvailability() {
    this.availabilityService
      .getAvailability(this.userId!)
      .subscribe((data: UserAvailability[]) => {
        data.forEach((entry) => {
          const index = this.availability.findIndex(
            (item) => item.dayOfWeek === entry.dayOfWeek
          );
          if (index !== -1) {
            this.availability[index].enabled = true;
            this.availability[index].startTime = entry.startTime.substring(
              0,
              5
            );
            this.availability[index].endTime = entry.endTime.substring(0, 5);
          } else {
            console.log('Index not found');
          }
        });
      });
  }

  protected times = [
    { id: 1, time: '00:00' },
    { id: 2, time: '00:30' },
    { id: 3, time: '01:00' },
    { id: 4, time: '01:30' },
    { id: 5, time: '02:00' },
    { id: 6, time: '02:30' },
    { id: 7, time: '03:00' },
    { id: 8, time: '03:30' },
    { id: 9, time: '04:00' },
    { id: 10, time: '04:30' },
    { id: 11, time: '05:00' },
    { id: 12, time: '05:30' },
    { id: 13, time: '06:00' },
    { id: 14, time: '06:30' },
    { id: 15, time: '07:00' },
    { id: 16, time: '07:30' },
    { id: 17, time: '08:00' },
    { id: 18, time: '08:30' },
    { id: 19, time: '09:00' },
    { id: 20, time: '09:30' },
    { id: 21, time: '10:00' },
    { id: 22, time: '10:30' },
    { id: 23, time: '11:00' },
    { id: 24, time: '11:30' },
    { id: 25, time: '12:00' },
    { id: 26, time: '12:30' },
    { id: 27, time: '13:00' },
    { id: 28, time: '13:30' },
    { id: 29, time: '14:00' },
    { id: 30, time: '14:30' },
    { id: 31, time: '15:00' },
    { id: 32, time: '15:30' },
    { id: 33, time: '16:00' },
    { id: 34, time: '16:30' },
    { id: 35, time: '17:00' },
    { id: 36, time: '17:30' },
    { id: 37, time: '18:00' },
    { id: 38, time: '18:30' },
    { id: 39, time: '19:00' },
    { id: 40, time: '19:30' },
    { id: 41, time: '20:00' },
    { id: 42, time: '20:30' },
    { id: 43, time: '21:00' },
    { id: 44, time: '21:30' },
    { id: 45, time: '22:00' },
    { id: 46, time: '22:30' },
    { id: 47, time: '23:00' },
    { id: 48, time: '23:30' },
  ];
}
