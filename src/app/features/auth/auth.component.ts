import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './services/auth.service';
import { LoginData, RegisterData, VerificationResponse } from './interfaces';
import { SharedService } from '../../shared/services/shared.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CustomButtonComponent,
    CommonModule,
    CustomInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  @Input() authMode: 'login' | 'register' | 'forgotPassword' = 'login';
  @Output() closeModal = new EventEmitter();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  public switchMode(newMode?: 'login' | 'register' | 'forgotPassword') {
    if (newMode) {
      this.authMode = newMode;
    } else {
      switch (this.authMode) {
        case 'login':
          this.authMode = 'register';
          break;
        case 'register':
        case 'forgotPassword':
          this.authMode = 'login';
          break;
      }
    }
  }

  public triggerModalClose() {
    this.closeModal.emit();
  }

  protected loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?.&_]).{8,}$/
        ),
      ],
    ],
  });

  protected forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected registerFormInputControlName(name: string) {
    return this.registerForm.get(name) as FormControl;
  }

  protected loginFormInputControlName(name: string) {
    return this.loginForm.get(name) as FormControl;
  }
  protected forgotPasswordFormInputControlName(name: string) {
    return this.loginForm.get(name) as FormControl;
  }

  public registerUser() {
    if (!this.registerForm.invalid) {
      this.isLoading = true;

      const userData: RegisterData = {
        name: this.registerForm.value.name!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
      };

      this.authService.register(userData).subscribe({
        next: (response: VerificationResponse) => {
          this.sharedService.successToastr(response.message);
          this.registerForm.reset();
          this.triggerModalClose();
          this.isLoading = false;
        },
        error: (error) => {
          this.sharedService.errorToastr(error.error.message);
          this.isLoading = false;
        },
      });
    }
  }

  public loginUser() {
    if (!this.loginForm.invalid) {
      this.isLoading = true;

      const userData: LoginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.authService.login(userData).subscribe({
        next: (response) => {
          const { accessToken, refreshToken, message } = response;
          this.authService.setTokens(accessToken, refreshToken);
          this.authService.authStatus.set(true);
          this.authService.setUserDetailsFromToken(accessToken);
          this.triggerModalClose();
          this.router.navigate(['/dashboard']);
          this.sharedService.successToastr(message);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.sharedService.errorToastr(error.error.message);
        },
      });
    }
  }

  public sendResetPasswordLink() {
    if (!this.forgotPasswordForm.invalid) {
      this.isLoading = true;

      this.authService.sendResetLink(this.forgotPasswordForm.value.email!);
      this.forgotPasswordForm.reset();
    }
  }

  protected googleLogin() {
    localStorage.setItem('oauthProvider', 'google');
    window.location.href = `${environment.BASE_URL}/oauth2/authorization/google`;
  }

  protected githubLogin() {
    localStorage.setItem('oauthProvider', 'github');
    window.location.href = `${environment.BASE_URL}/oauth2/authorization/githu`;
  }

  protected microsoftLogin() {
    localStorage.setItem('oauthProvider', 'microsoft');
    window.location.href = `${environment.BASE_URL}/oauth2/authorization/microsoft`;
  }

  protected LoginInputFields = [
    {
      type: 'email',
      label: 'Email',
      control: 'email',
      placeholder: 'Enter email',
      errorMessage: {
        required: 'Email field is required',
        email: 'Invalid email address',
        pattern: 'Invalid email address',
      } as Record<string, string>,
      icon: '/assets/icons/auth-mail.svg',
    },

    {
      type: 'password',
      label: 'Password',
      control: 'password',
      placeholder: 'Enter password',
      errorMessage: {
        required: 'Password field is required',
      },
      icon: '/assets/icons/auth-lock-icon.svg',
    },
  ];

  protected RegisterInputFields = [
    {
      type: 'text',
      label: 'Full Name',
      control: 'name',
      placeholder: 'Enter name',
      errorMessage: {
        required: 'Name field is required',
      } as Record<string, string>,
      icon: '/assets/icons/auth-user-icon.svg',
    },

    {
      type: 'email',
      label: 'Email',
      control: 'email',
      placeholder: 'Enter email',
      errorMessage: {
        required: 'Email field is required',
        email: 'Invalid email address',
        pattern: 'Invalid email address',
      } as Record<string, string>,
      icon: '/assets/icons/auth-mail.svg',
    },

    {
      type: 'password',
      label: 'Password',
      control: 'password',
      placeholder: 'Enter password',
      errorMessage: {
        required: 'Password field is required',
        pattern:
          'Password must be at least 8 characters including upper and lower case characters, one or more numbers and special characters.',
      },
      icon: '/assets/icons/auth-lock-icon.svg',
    },
  ];

  protected forgotPasswordInputField = {
    type: 'email',
    label: 'Email',
    control: 'email',
    placeholder: 'Enter email',
    errorMessage: {
      required: 'Email is required',
      email: 'Invalid email',
      pattern: 'Email must be in the format: example@domain.com.',
    } as Record<string, string>,
    icon: '/assets/icons/auth-mail.svg',
  };
}
