import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';

import { LoginInput, SignupInput, LoginResp, SignupResp } from './auth.dto';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from '../shared/services/local-store.service';
import { of } from 'rxjs';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
export interface DecodedAccessToken {
  user: User;
  isExpired: boolean;
  expirationDate: Date;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private localStore: LocalStoreService
  ) {}

  register = (input: SignupInput) =>
    this.http.post<SignupResp>(this.endpoint('register'), input);
  login = (input: LoginInput) =>
    this.http.post<LoginResp>(this.endpoint('login'), input);
  logout = () => of(localStorage.clear());
  endpoint = (action: string) => `/api/auth/${action}`;

  getDecodedAccessToken(): DecodedAccessToken {
    const accessToken = this.localStore.getAccessToken();
    const helper = new JwtHelperService();
    const user: User = helper.decodeToken(accessToken);
    const expirationDate = helper.getTokenExpirationDate(accessToken);
    const isExpired = helper.isTokenExpired(accessToken);
    return { user, isExpired, expirationDate };
  }
}
