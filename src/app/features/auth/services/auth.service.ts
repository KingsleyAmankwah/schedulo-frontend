import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  AuthResponse,
  ErrorResponse,
  LoginData,
  ResetPasswordResponse,
  RegisterData,
  UserDetails,
  VerificationResponse,
} from '../interfaces';
import { auth, events } from '../../../shared/constants/apiEndpoints';
import { cookie } from '../../../shared/utils';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { map, Subject, take, tap } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sharedService = inject(SharedService);
  public authStatus: WritableSignal<boolean> = signal(false);
  private userDetails = signal<UserDetails | null>(null);
  private refreshTokenInProgress: WritableSignal<boolean> = signal(false);
  private refreshTokenSubject: Subject<string> = new Subject<string>();

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const accessToken = cookie.get(this.accessTokenKey);
    if (accessToken && !this.isTokenExpired(accessToken)) {
      this.authStatus.set(true);
      this.setUserDetailsFromToken(accessToken);
      this.redirectToAppropriateRoute();
    } else if (accessToken && this.isTokenExpired(accessToken)) {
      this.refreshToken()
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.redirectToAppropriateRoute();
          },
          error: () => {
            this.logout();
          },
        });
    } else {
      this.authStatus.set(false);
      this.userDetails.set(null);
    }
  }

  public register(userData: RegisterData) {
    return this.http.post<VerificationResponse>(`${auth}/register`, userData);
  }

  public verifyAccount(token: string) {
    return this.http.get<VerificationResponse>(`${auth}/verify?token=${token}`);
  }

  public requestNewVerificationToken(email: string) {
    return this.http.post<VerificationResponse>(`${auth}/request-token`, email);
  }

  public login(credentials: LoginData) {
    return this.http.post<AuthResponse>(`${auth}/login`, credentials);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp! < currentTime;
    } catch (error) {
      return true; // If there's an error decoding, consider the token expired
    }
  }

  private redirectToAppropriateRoute() {
    const currentRoute = this.router.url;
    if (currentRoute === '/') {
      this.router.navigate(['/dashboard']);
    }
  }

  public refreshToken() {
    if (this.refreshTokenInProgress()) {
      return this.refreshTokenSubject.asObservable().pipe(take(1));
    }

    this.refreshTokenInProgress.set(true);
    const refreshToken = cookie.get(this.refreshTokenKey);
    if (!refreshToken) {
      this.logout();
      this.sharedService.infoToastr('Refresh token not found');
      return this.refreshTokenSubject.asObservable();
    }

    return this.http
      .post<AuthResponse>(`${auth}/refresh-token`, {
        refreshToken,
      })
      .pipe(
        take(1),
        tap({
          next: (response) => {
            this.setTokens(response.accessToken, response.refreshToken);
            this.refreshTokenInProgress.set(false);
            this.refreshTokenSubject.next(response.accessToken);
            this.refreshTokenSubject.complete();
          },
          error: (error) => {
            this.refreshTokenInProgress.set(false);
            this.refreshTokenSubject.error(error);
            this.logout();
            this.sharedService.warningToastr(error);
          },
        }),
        map((response) => response.accessToken)
      );
  }

  public sendResetLink(email: string) {
    return this.http
      .post<ResetPasswordResponse>(`${auth}/request-password-reset`, { email })
      .subscribe({
        next: (response: ResetPasswordResponse) => {
          this.sharedService.successToastr(response.message);
        },
        error: (error) => {
          this.sharedService.errorToastr(error.error.error);
        },
      });
  }

  public verifyResetToken(token: string) {
    const params = new HttpParams().set('token', token);
    return this.http
      .get<ResetPasswordResponse>(`${auth}/verify-reset-token`, {
        params,
      })
      .subscribe({
        next: (response: ResetPasswordResponse) => {
          this.sharedService.successToastr(response.message);
        },

        error: (error) => {
          this.sharedService.errorToastr(error.error.error);
        },
      });
  }

  public resetPassword(token: string, newPassword: string) {
    return this.http
      .post<ResetPasswordResponse>(`${auth}/reset-password?token=${token}`, {
        newPassword,
      })
      .subscribe({
        next: (response: ResetPasswordResponse) => {
          this.sharedService.successToastr(response.message);
        },
        error: (error) => {
          this.sharedService.errorToastr(error.error.error);
        },
      });
  }

  public logout() {
    try {
      cookie.remove(this.accessTokenKey);
      cookie.remove(this.refreshTokenKey);
      this.authStatus.set(false);
      this.userDetails.set(null);

      this.router.navigate(['/auth']).then(() => {
        window.location.reload();
      });
    } catch (error) {
      this.sharedService.warningToastr('Error during logout');
    }
  }

  public isLoggedIn(): boolean {
    const token = cookie.get(this.accessTokenKey);
    return !!token && !this.isTokenExpired(token);
  }

  get isAuthenticated(): WritableSignal<boolean> {
    return this.authStatus;
  }

  get getUserDetails(): WritableSignal<UserDetails | null> {
    return this.userDetails;
  }

  public setUserDetailsFromToken(token: string) {
    try {
      const decodedToken: UserDetails = jwtDecode(token);
      this.userDetails.set(decodedToken);
    } catch (error) {
      console.error('Error decoding token', error);
      this.userDetails.set(null);
    }
  }

  public setTokens(accessToken: string, refreshToken: string) {
    cookie.set({
      name: this.accessTokenKey,
      value: accessToken,
      hours: 24,
    });

    cookie.set({
      name: this.refreshTokenKey,
      value: refreshToken,
      hours: 168,
    });
  }
}
