import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },

  {
    path: 'profile/:userId',
    loadComponent: () =>
      import('./features/booking-profile/booking-profile.component').then(
        (c) => c.BookingProfileComponent
      ),
  },

  {
    path: 'feedback',
    loadComponent: () =>
      import('./features/feedback/feedback.component').then(
        (c) => c.FeedbackComponent
      ),
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((r) => r.authRoutes),
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },

      {
        path: 'availability',
        loadComponent: () =>
          import('./features/availability/availability.component').then(
            (c) => c.AvailabilityComponent
          ),
      },

      {
        path: 'pending-meetings',
        loadComponent: () =>
          import('./features/pending-meetings/pending-meetings.component').then(
            (c) => c.PendingMeetingsComponent
          ),
      },

      {
        path: 'upcoming-meetings',
        loadComponent: () =>
          import('./features/meetings/meetings.component').then(
            (c) => c.MeetingsComponent
          ),
      },

      {
        path: 'past-meetings',
        loadComponent: () =>
          import('./features/past-meetings/past-meetings.component').then(
            (c) => c.PastMeetingsComponent
          ),
      },

      {
        path: 'decline-meetings',
        loadComponent: () =>
          import('./features/archives/archives.component').then(
            (c) => c.ArchivesComponent
          ),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (c) => c.SettingsComponent
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
