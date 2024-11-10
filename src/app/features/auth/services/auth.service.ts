import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  AuthResponse,
  LoginData,
  RegisterData,
  UserRole,
  VerificationResponse,
} from '../interfaces';
import { auth } from '../../../shared/constants/apiEndpoints';
import { cookie } from '../../../shared/utils';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected authStatus: WritableSignal<boolean> = signal(false);
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {}

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

          this.authStatus.set(true);
          this.router.navigate(['/dashboard']);
          console.log('Login successful:', message);
        },

        error: (error) => {
          console.error('Login failed:', error);
        },
      });
  }

  public sendResetLink(email: string) {
    return this.http
      .post<string>(`${auth}/request-password-reset`, email)
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
    this.router.navigate(['']);
  }

  public isLoggedIn(): boolean {
    const accessToken = cookie.get(this.accessTokenKey);
    this.authStatus.set(!!accessToken);
    return !!accessToken;
  }

  get isAuthenticated(): WritableSignal<boolean> {
    return this.authStatus;
  }
}
