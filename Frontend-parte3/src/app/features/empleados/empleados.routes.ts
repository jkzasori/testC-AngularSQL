import { Routes } from '@angular/router';

export const EMPLEADOS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/empleados-list/empleados-list').then(m => m.EmpleadosList) }
];
