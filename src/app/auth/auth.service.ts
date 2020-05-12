import { Injectable } from '@angular/core';

import { LoginInput, SignupInput } from './auth.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = '/api/auth';
  constructor(private readonly http: HttpClient) {}
  getAuthToken = () => 'access_token';
  register = (input: SignupInput) => {
    return this.http.post(this.url('register'), input);
  };
  login = async (input: LoginInput) => {};
  private url = (action: string) => `${this.endpoint}/${action}`;
}
