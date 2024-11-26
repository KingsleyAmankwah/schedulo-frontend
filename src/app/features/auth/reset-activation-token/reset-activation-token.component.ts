import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../../../shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-activation-token',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-activation-token.component.html',
  styleUrl: './reset-activation-token.component.css',
})
export class ResetActivationTokenComponent {
  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  requestNewToken() {
    if (!this.email) {
      this.sharedService.warningToastr('Please enter your email');
      return;
    }

    this.authService.requestNewVerificationToken(this.email).subscribe({
      next: (response) => {
        this.sharedService.successToastr(response.message);
        this.email = '';
      },
      error: (errorResponse) => {
        this.sharedService.errorToastr(errorResponse.error.error);
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/']);
    this.sharedService.triggerLoginModal();
  }
}
