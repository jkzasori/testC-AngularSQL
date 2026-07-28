import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosAumeto } from './empleados-aumeto';

describe('EmpleadosAumeto', () => {
  let component: EmpleadosAumeto;
  let fixture: ComponentFixture<EmpleadosAumeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadosAumeto],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosAumeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
