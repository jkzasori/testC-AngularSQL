import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmpleadoService } from '../../services/empleado.services';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './empleados-list.html',
  styleUrl: './empleados-list.scss',
})
export class EmpleadosList {
  private readonly empleadoService = inject(EmpleadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: true });

  readonly page = computed(() => Number(this.queryParams().get('page') ?? 1));
  readonly departamento = computed(() => this.queryParams().get('departamento') ?? '');
  readonly pageSize = 10;

  readonly departamentoControl = new FormControl('', { nonNullable: true });

  private readonly resultTrigger = computed(() => ({ page: this.page(), departamento: this.departamento() }));

  private readonly result = toSignal(
    toObservable(this.resultTrigger).pipe(
      switchMap(({ page, departamento }) =>
        this.empleadoService.getEmpleados(page, this.pageSize, departamento || null)),
    ),
    { initialValue: null },
  );

  readonly empleados = computed(() => this.result()?.items ?? []);
  readonly totalPages = computed(() => this.result()?.totalPages ?? 0);

  constructor() {
    this.departamentoControl.setValue(this.departamento(), { emitEvent: false });

    this.departamentoControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => this.goToPage(1, value));
  }

  goToPage(page: number, departamento = this.departamento()): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, departamento: departamento || null },
      queryParamsHandling: 'merge',
    });
  }
}
