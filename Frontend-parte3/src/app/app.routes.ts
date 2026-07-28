import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'empleados' },
  { path: 'empleados', loadChildren: () => import('./features/empleados/empleados.routes').then(m => m.EMPLEADOS_ROUTES) },
];
