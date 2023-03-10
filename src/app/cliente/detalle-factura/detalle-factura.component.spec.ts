import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFacturaComponent } from './detalle-factura.component';

describe('DetalleFacturaComponent', () => {
  let component: DetalleFacturaComponent;
  let fixture: ComponentFixture<DetalleFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
