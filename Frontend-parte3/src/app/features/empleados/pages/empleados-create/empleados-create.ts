import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.services';
import { documentoDisponibleValidator, documentoFormatoValidator } from '../../validador/documento.validadors';
import { AppHttpError } from '../../../../core/http/error.interceptor';

@Component({
  selector: 'app-empleados-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './empleados-create.html',
})
export class EmpleadosCreate {
  private readonly fb = inject(FormBuilder);
  private readonly empleadoService = inject(EmpleadoService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    documento: ['', {
      validators: [Validators.required, documentoFormatoValidator()],
      asyncValidators: [documentoDisponibleValidator(this.empleadoService)],
      updateOn: 'blur',
    }],
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    cargo: ['', [Validators.required, Validators.maxLength(100)]],
    departamento: ['', [Validators.required, Validators.maxLength(100)]],
    salario: [0, [Validators.required, Validators.min(0.01)]],
    fechaIngreso: ['', Validators.required],
  });

  readonly submitting = signal(false);
  readonly serverError = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.serverError.set(null);

    this.empleadoService.crearEmpleado(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/empleados']),
        error: (error: AppHttpError) => {
          this.submitting.set(false);
          this.serverError.set(error.detail);
        },
      });
  }
}
