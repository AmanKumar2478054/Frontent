import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceOfficer } from './compliance-officer';

describe('ComplianceOfficer', () => {
  let component: ComplianceOfficer;
  let fixture: ComponentFixture<ComplianceOfficer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceOfficer],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplianceOfficer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
