import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  AuthResponse,
  LoginData,
  RegisterData,
  UserDetails,
  VerificationResponse,
} from '../interfaces';
import { auth } from '../../../shared/constants/apiEndpoints';
import { cookie } from '../../../shared/utils';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { map, Subject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    return this.http
      .post<VerificationResponse>(`${auth}/register`, userData)
      .subscribe({
        next: (response) => {
          console.log('Registration Successful:', response);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
      });
  }

  public verifyAccount(token: string) {
    return this.http.get<string>(`${auth}/verify?token=${token}`).subscribe({
      next: (message) => {
        console.log('Verification successful:', message);
      },

      error: (error) => {
        console.error('Verification failed:', error);
      },
    });
  }

  public login(credentials: LoginData) {
    return this.http
      .post<AuthResponse>(`${auth}/login`, credentials)
      .subscribe({
        next: (response) => {
          const { accessToken, refreshToken, message } = response;
          this.setTokens(accessToken, refreshToken);
          this.authStatus.set(true);
          this.setUserDetailsFromToken(accessToken);
          console.log('Login successful:', message);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
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
      console.log('Refresh token not found');
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
            console.error(error);
          },
        }),
        map((response) => response.accessToken)
      );
  }

  public sendResetLink(email: string) {
    return this.http
      .post<string>(`${auth}/request-password-reset`, { email })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public verifyResetToken(token: string) {
    const params = new HttpParams().set('token', token);
    return this.http
      .get<string>(`${auth}/verify-reset-token`, {
        params,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },

        error: (error) => {
          console.error(error);
        },
      });
  }

  public resetPassword(token: string, newPassword: string) {
    return this.http
      .post<string>(`${auth}/reset-password?token=${token}`, { newPassword })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public logout() {
    cookie.remove(this.accessTokenKey);
    cookie.remove(this.refreshTokenKey);
    this.authStatus.set(false);
    this.userDetails.set(null);
    this.router.navigate(['']);
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
