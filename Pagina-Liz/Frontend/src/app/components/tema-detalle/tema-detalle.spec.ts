import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemaDetalle } from './tema-detalle';

describe('TemaDetalle', () => {
  let component: TemaDetalle;
  let fixture: ComponentFixture<TemaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemaDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemaDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
