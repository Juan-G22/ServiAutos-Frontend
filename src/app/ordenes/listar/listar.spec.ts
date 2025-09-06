import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPedidosComponent } from './listar.component';

describe('Listar', () => {
  let component: ListarPedidosComponent;
  let fixture: ComponentFixture<ListarPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
