import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Notiflix from 'notiflix-angular';

import { SignupInput } from '../auth.dto';
import { AuthService } from '../auth.service';
import { authConstants } from '../constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.maxLength(24)]],
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    Notiflix.Loading.Pulse();
    const input = new SignupInput(this.signupForm.value);
    console.log(input);
    this.authService.register(input).subscribe((res) => {
      const { emailConfirmKey } = authConstants;
      this.router.navigate(['/login'], {
        queryParams: { [emailConfirmKey]: !res.canLogin },
      });
      Notiflix.Loading.Remove();
    });
  }
}
