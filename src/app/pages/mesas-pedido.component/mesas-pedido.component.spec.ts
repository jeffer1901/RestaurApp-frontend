import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasPedidoComponent } from './mesas-pedido.component';

describe('MesasPedidoComponent', () => {
  let component: MesasPedidoComponent;
  let fixture: ComponentFixture<MesasPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
