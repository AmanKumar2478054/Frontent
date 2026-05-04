import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalEnviorment } from './global-enviorment';

describe('GlobalEnviorment', () => {
  let component: GlobalEnviorment;
  let fixture: ComponentFixture<GlobalEnviorment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalEnviorment],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalEnviorment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
