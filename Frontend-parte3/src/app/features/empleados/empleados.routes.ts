import { Routes } from '@angular/router';

export const EMPLEADOS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/empleados-list/empleados-list').then(m => m.EmpleadosList) },
  { path: 'createEmpleado', loadComponent: () => import('./pages/empleados-create/empleados-create').then(m => m.EmpleadosCreate) }

];
