import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.services';
import { AppHttpError } from '../../../../core/http/error.interceptor';

type Step = 'form' | 'confirm' | 'result';

@Component({
  selector: 'app-empleados-aumeto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './empleados-aumeto.html',
  styleUrl: './empleados-aumeto.scss',
})
export class EmpleadosAumeto {
  private readonly fb = inject(FormBuilder);
  private readonly empleadoService = inject(EmpleadoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    departamento: ['', [Validators.required, Validators.maxLength(50)]],
    porcentajeAumento: [0, [Validators.required, Validators.min(0.01), Validators.max(50)]],
    usuario: ['', [Validators.required, Validators.maxLength(50)]],
  });

  readonly step = signal<Step>('form');
  readonly submitting = signal(false);
  readonly resultOk = signal(false);
  readonly resultMessage = signal('');

  goToConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.step.set('confirm');
  }

  cancelConfirm(): void {
    this.step.set('form');
  }

  confirmar(): void {
    this.submitting.set(true);

    this.empleadoService.aplicarAumento(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.resultOk.set(true);
          this.resultMessage.set('Aumento aplicado correctamente.');
          this.step.set('result');
        },
        error: (error: AppHttpError) => {
          this.submitting.set(false);
          this.resultOk.set(false);
          this.resultMessage.set(error.detail);
          this.step.set('result');
        },
      });
  }

  reiniciar(): void {
    this.form.reset({ departamento: '', porcentajeAumento: 0, usuario: '' });
    this.step.set('form');
  }
}
