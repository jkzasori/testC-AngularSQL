import { Component, input, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Empleado } from './empleado.model';

@Component({
  selector: 'app-resumen-salarios',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="resumen">
      Total nomina: {{ total() | currency:'USD':'symbol':'1.0-0' }}
      — Promedio: {{ promedio() | currency:'USD':'symbol':'1.0-0' }}
    </div>
  `
})
export class ResumenSalariosComponent {
  empleados = input.required<Empleado[]>();

  total = computed(() =>
    this.empleados().reduce((acumula: number, empleado: Empleado) => acumula + empleado.salario, 0)
  );

  promedio = computed(() => {
    const lista = this.empleados();
    return lista.length ? this.total() / lista.length : 0;
  });
}
