import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandComponent } from '../land/land.component';
import { LandSectionComponent } from './land-section/land-section.component';
import { SectionsComponent } from './sections.component';

describe('SectionsComponent', () => {
  let component: SectionsComponent;
  let fixture: ComponentFixture<SectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SectionsComponent, LandSectionComponent, LandComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
