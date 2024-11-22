import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((r) => r.authRoutes),
  },

  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
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
        path: 'event',
        loadComponent: () =>
          import('./features/events/events.component').then(
            (c) => c.EventsComponent
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
];
