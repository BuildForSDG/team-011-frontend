import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandSectionComponent } from './land-section.component';

describe('LandSectionComponent', () => {
  let component: LandSectionComponent;
  let fixture: ComponentFixture<LandSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
