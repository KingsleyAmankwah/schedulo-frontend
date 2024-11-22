import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'activate-account',
    loadComponent: () =>
      import('./activate-account/activate-account.component').then(
        (c) => c.ActivateAccountComponent
      ),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent
      ),
  },

  {
    path: 'password-reset-failed',
    loadComponent: () =>
      import('./password-reset-failed/password-reset-failed.component').then(
        (c) => c.PasswordResetFailedComponent
      ),
  },

  {
    path: 'callback',
    loadComponent: () =>
      import('./oauth-callback/oauth-callback.component').then(
        (c) => c.OauthCallbackComponent
      ),
  },

  {
    path: 'onboarding',
    loadComponent: () =>
      import('./onboarding/onboarding.component').then(
        (c) => c.OnboardingComponent
      ),
  },
];
