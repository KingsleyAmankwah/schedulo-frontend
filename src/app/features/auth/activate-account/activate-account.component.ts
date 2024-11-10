import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css',
})
export class ActivateAccountComponent {
  countdownSeconds = 10;
  countdownSubscription!: Subscription;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.startCountdown();
  }

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyAccount(token);
    } else {
      this.router.navigate(['/']);
      console.log('No token available');
    }
  }

  startCountdown() {
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdownSeconds--;
      if (this.countdownSeconds === 0) {
        this.proceedToLogin();
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  protected proceedToLogin() {
    this.router.navigate(['/']);

    setTimeout(() => {
      this.sharedService.triggerLoginModal();
    }, 100);
  }
}
