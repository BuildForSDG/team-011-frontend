import { Injectable } from '@angular/core';

import { LoginInput, SignupInput, LoginResp, SignupResp } from './auth.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  register = (input: SignupInput) =>
    this.http.post<SignupResp>(this.endpoint('register'), input);
  login = (input: LoginInput) =>
    this.http.post<LoginResp>(this.endpoint('login'), input);
  endpoint = (action: string) => `/api/auth/${action}`;
}
