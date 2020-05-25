import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Notiflix from 'notiflix-angular';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

import { LoginInput } from '../auth.dto';
import { AuthService } from '../auth.service';
import { authConstants } from '../constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isUserRegistered: boolean;
  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly localStore: LocalStoreService
  ) {}
  ngOnInit(): void {
    this.notifyFreshSignup();
    this.form = this.fb.group({
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
    const input: LoginInput = this.form.value;
    this.authService.login(input).subscribe((res) => {
      this.localStore.storeAccessToken(res.accessToken);
      this.router.navigate(['/dashboard']);
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
          'Okay'
        );
      }
    });
  }
}
