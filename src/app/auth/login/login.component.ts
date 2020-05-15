import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Notiflix from 'notiflix-angular';

import { LoginInput, LoginResp } from '../auth.dto';
import { AuthService } from '../auth.service';
import { authConstants } from '../constants';
import { localStoreKeys } from 'src/app/shared/constants/local-store.keys';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isUserRegistered: boolean;
  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}
  ngOnInit(): void {
    this.notifyFreshSignup();
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
    });
  }
  onSubmit() {
    Notiflix.Loading.Pulse();
    const input: LoginInput = this.loginForm.value;
    this.authService.login(input).subscribe((res: LoginResp) => {
      localStorage.setItem(localStoreKeys.accessToken, res.accessToken);
      // TODO: route to dashboard
      Notiflix.Loading.Remove();
    });
  }

  private notifyFreshSignup() {
    const { emailConfirmKey } = authConstants;
    this.route.queryParams.subscribe((params) => {
      if (params[emailConfirmKey] === 'true') {
        Notiflix.Report.Success(
          'Thank you for onboarding',
          "We've sent a confirmation email to you. Please confirm your email to proceed.",
          '<br><br>Okay'
        );
      }
    });
  }
}
