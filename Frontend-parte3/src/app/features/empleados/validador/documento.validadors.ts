import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { EmpleadoService } from '../services/empleado.services';

export function documentoFormatoValidator(): ValidatorFn {
  const pattern = /^[0-9]{6,10}$/;
  return (control: AbstractControl): ValidationErrors | null =>
    !control.value || pattern.test(control.value) ? null : { documentoFormato: true };
}

export function documentoDisponibleValidator(empleadoService: EmpleadoService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.errors?.['documentoFormato']) {
      return of(null);
    }
    return timer(400).pipe(
      switchMap(() => empleadoService.getByDocumento(control.value)),
      map(() => ({ documentoDuplicado: true }) as ValidationErrors | null),
      catchError(() => of(null)),
    );
  };
}
