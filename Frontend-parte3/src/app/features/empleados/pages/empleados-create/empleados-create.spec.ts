import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosCreate } from './empleados-create';

describe('EmpleadosCreate', () => {
  let component: EmpleadosCreate;
  let fixture: ComponentFixture<EmpleadosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
