export interface Empleado {
  empleadoId: number;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  cargo: string;
  departamento: string;
  salario: number;
  fechaIngreso: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CrearEmpleadoRequest {
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  cargo: string;
  departamento: string;
  salario: number;
  fechaIngreso: string;
}

export interface AumentoSalarialRequest {
  departamento: string;
  porcentajeAumento: number;
  usuario: string;
}

export interface ProblemDetails {
  status: number;
  title: string;
  detail: string;
  instance?: string;
}
