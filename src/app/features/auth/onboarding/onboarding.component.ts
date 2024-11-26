import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
})
export class OnboardingComponent {
  // ngOnInit() {
  //   this.nylasCode = localStorage.getItem('NylasCode');
  //   if (!this.nylasCode) {
  //     console.warn('No Nylas code found in localStorage.');
  //   }
  // }
  // protected connectCalender() {
  //   const nylasAuthUrl = `https://api.us.nylas.com/v3/connect/auth?client_id=${this.nylasClientId}&redirect_uri=${this.nylasRedirectUri}&access_type=online&response_type=code`;
  //   window.location.href = nylasAuthUrl;
  // }
  // protected handleCalenderConnection() {
  //   if (!this.nylasCode) {
  //     console.error('Missing Nylas code. Cannot connect calendar.');
  //     return;
  //   }
  //   this.authService.connectToNylas(this.nylasCode).subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       localStorage.removeItem('NylasCode'); // Clear after successful connection
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (error) => {
  //       console.error('Failed to connect calendar:', error);
  //     },
  //   });
  // }
}
