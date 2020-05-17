import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../auth.service';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show sign-up form', () => {
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const form = el.querySelector('form');
    const formCtrl = form
      .getElementsByTagName('input')[0]
      .getAttribute('formcontrolname');

    expect(form).toBeTruthy();
    expect(formCtrl).toEqual('firstName');
  });

  it('should show sign-up form', () => {
    const el: HTMLElement = fixture.debugElement.nativeElement;
    const form = el.querySelector('form');
    const formCtrl = form
      .getElementsByTagName('input')[0]
      .getAttribute('formcontrolname');

    expect(form).toBeTruthy();
    expect(formCtrl).toEqual('firstName');
  });
});
