import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernemntAuditor } from './governemnt-auditor';

describe('GovernemntAuditor', () => {
  let component: GovernemntAuditor;
  let fixture: ComponentFixture<GovernemntAuditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernemntAuditor],
    }).compileComponents();

    fixture = TestBed.createComponent(GovernemntAuditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
