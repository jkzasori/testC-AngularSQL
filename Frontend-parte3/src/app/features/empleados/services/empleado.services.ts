import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { AumentoSalarialRequest, CrearEmpleadoRequest, Empleado, PagedResult } from '../models/empleado.models';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/empleados`;

  getEmpleados(page: number, pageSize: number, departamento?: string | null): Observable<PagedResult<Empleado>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (departamento) params = params.set('departamento', departamento);
    return this.http.get<PagedResult<Empleado>>(this.baseUrl, { params });
  }

  getByDocumento(documento: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/${documento}`);
  }

  crearEmpleado(dto: CrearEmpleadoRequest): Observable<Empleado> {
    return this.http.post<Empleado>(this.baseUrl, dto);
  }

  aplicarAumento(dto: AumentoSalarialRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/aumento`, dto);
  }
}
