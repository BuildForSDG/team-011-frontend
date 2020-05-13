import { Injectable } from '@angular/core';

import { LoginInput, SignupInput, LoginResp, SignupResp } from './auth.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}
  register = (input: SignupInput) =>
    this.http.post<SignupResp>(this.url('register'), input);
  login = (input: LoginInput) =>
    this.http.post<LoginResp>(this.url('login'), input);
  private url = (action: string) => `/api/auth/${action}`;
}
