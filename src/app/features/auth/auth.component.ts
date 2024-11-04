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
  @Input() authMode: 'login' | 'register' = 'login';
  @Output() closeModal = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  public switchMode() {
    this.authMode = this.authMode == 'login' ? 'register' : 'login';
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
    password: ['', [Validators.required]],
  });

  protected inputControlName(name: string) {
    return this.registerForm.get(name) as FormControl;
  }

  protected formControlName(name: string) {
    return this.loginForm.get(name) as FormControl;
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
      },
      icon: '/assets/icons/auth-lock-icon.svg',
    },
  ];
}
