import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenPortal } from './citizen-portal';

describe('CitizenPortal', () => {
  let component: CitizenPortal;
  let fixture: ComponentFixture<CitizenPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitizenPortal],
    }).compileComponents();

    fixture = TestBed.createComponent(CitizenPortal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
