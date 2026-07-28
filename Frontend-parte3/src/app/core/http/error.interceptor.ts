import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';
import { ProblemDetails } from '../../features/empleados/models/empleado.models';

export interface AppHttpError {
  status: number;
  title: string;
  detail: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const problem = error.error as Partial<ProblemDetails> | null;
      const normalized: AppHttpError = {
        status: error.status,
        title: problem?.title ?? 'Error inesperado',
        detail: problem?.detail ?? error.message,
      };

      if (error.status === 0 || error.status >= 500) {
        notifications.showError(normalized.detail || 'Ocurrió un error inesperado. Intenta de nuevo.');
      }

      return throwError(() => normalized);
    }),
  );
};
