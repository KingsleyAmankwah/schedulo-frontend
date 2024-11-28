import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  settingsForm: FormGroup;
  notifications = true;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      workHoursStart: ['09:00'],
      workHoursEnd: ['17:00'],
    });
  }

  toggleNotifications() {
    this.notifications = !this.notifications;
  }

  saveChanges() {
    if (this.settingsForm.valid) {
      console.log('Settings saved:', this.settingsForm.value);
    }
  }
}
