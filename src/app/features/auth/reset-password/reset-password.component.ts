import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  isLoading = false;
  private token: string | null = '';
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        console.log('Invalid reset link');
        return;
      }

      this.verifyToken();
    });

    this.resetPasswordForm.statusChanges.subscribe((status) => {
      console.log('Form Status:', status); // Should show "VALID" when form is valid
      console.log('Form Errors:', this.resetPasswordForm.errors);
      console.log(
        'Password Errors:',
        this.resetPasswordForm.get('password')?.errors
      );
      console.log(
        'Confirm Password Errors:',
        this.resetPasswordForm.get('confirmPassword')?.errors
      );
    });
  }

  resetPasswordForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?.&]).{8,}$/
          ),
        ],
      ],

      confirmPassword: ['', Validators.required],
    },
    { validator: this.passwordMatchValidator }
  );

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private verifyToken() {
    this.isLoading = true;
    this.authService.verifyResetToken(this.token!);
    this.isLoading = false;
  }

  public onSubmit() {
    if (this.resetPasswordForm.valid && this.resetPasswordForm.value.password) {
      this.isLoading = true;

      this.authService.resetPassword(
        this.token!,
        this.resetPasswordForm.value.password
      );
      this.isLoading = false;
      this.resetPasswordForm.reset();
    }
  }
}
