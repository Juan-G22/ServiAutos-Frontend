import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPedidoComponent } from './crear.component';

describe('CrearPedidoComponent', () => {
  let component: CrearPedidoComponent;
  let fixture: ComponentFixture<CrearPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPedidoComponent] // como es standalone, se importa aquí
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

