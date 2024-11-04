import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((r) => r.authRoutes),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((r) => r.adminRoutes),
  },

  {
    path: 'client',
    loadChildren: () =>
      import('./features/client/client.routes').then((r) => r.clientRoutes),
  },
];
