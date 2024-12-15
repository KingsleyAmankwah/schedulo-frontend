import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  AuthResponse,
  LoginData,
  ResetPasswordResponse,
  RegisterData,
  UserDetails,
  VerificationResponse,
  JwtPayLoad,
} from '../interfaces';
import { auth, user } from '../../../shared/constants/apiEndpoints';
import { cookie } from '../../../shared/utils';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Subject, take, tap } from 'rxjs';
import { SharedService } from '../../../shared/services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private sharedService = inject(SharedService);
  public authStatus: WritableSignal<boolean> = signal(false);

  // User details as a BehaviorSubject
  private userSubject = new BehaviorSubject<UserDetails | null>(null);
  private userIdSubject = new BehaviorSubject<string | undefined>(undefined);

  // Signal for token refresh
  private refreshTokenInProgress: WritableSignal<boolean> = signal(false);
  private refreshTokenSubject: Subject<string> = new Subject<string>();

  // Keys for tokens in cookies
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {
    // this.checkAuthStatus();
  }

  public checkAuthStatus() {
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
      this.clearAuthState();
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
    const publicRoutes = [
      '/auth',
      '/auth/activate-account',
      '/auth/callback',
      '/auth/request-token',
      '/auth/reset-password',
      '/auth/password-reset-failed',
      '/auth/onboarding',
      '/home',
    ];

    if (publicRoutes.includes(currentRoute)) {
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

  public fetchUserDetails(userId: string | undefined) {
    return this.http.get<UserDetails>(`${user}/${userId}`);
  }

  public logout() {
    try {
      cookie.remove(this.accessTokenKey);
      cookie.remove(this.refreshTokenKey);
      this.clearAuthState();

      this.router.navigate(['/home']).then(() => {
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

  get getUserId(): string | undefined {
    return this.userIdSubject.value;
  }

  public setUserDetailsFromToken(token: string): void {
    try {
      const decodedToken: JwtPayLoad = jwtDecode(token);
      const userId = decodedToken.user_id;
      this.userIdSubject.next(userId);
    } catch {
      this.clearAuthState();
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

  // Helper to clear auth state
  private clearAuthState(): void {
    this.authStatus.set(false);
    this.userSubject.next(null);
  }
}
