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
        path: 'meetings',
        loadComponent: () =>
          import('./features/meetings/meetings.component').then(
            (c) => c.MeetingsComponent
          ),
      },

      {
        path: 'archives',
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
