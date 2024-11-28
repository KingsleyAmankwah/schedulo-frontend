import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { auth } from '../../../shared/constants/apiEndpoints';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../interfaces';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css',
})
export class OauthCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const provider = localStorage.getItem('oauthProvider');

    if (code && provider) {
      this.exchangeToken(code, provider);
    } else {
      this.sharedService.errorToastr(
        'Authorization code or provider not found'
      );
    }
  }

  private exchangeToken(code: string, provider: string) {
    const apiUrl = `${auth}/token`;

    this.http.post<AuthResponse>(apiUrl, { code, provider }).subscribe({
      next: (response) => {
        const { accessToken, refreshToken } = response;
        this.authService.setTokens(accessToken, refreshToken);
        this.authService.authStatus.set(true);
        this.authService.setUserDetailsFromToken(response.accessToken);

        localStorage.removeItem('oauthProvider');
        this.router.navigate(['/dashboard']);
      },
      error: (error) =>
        this.sharedService.errorToastr('OAuth token exchange failed'),
    });
  }
}
