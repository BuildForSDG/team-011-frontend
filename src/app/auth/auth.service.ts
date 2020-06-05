import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import urlJoin from 'url-join';

import { LocalStoreService } from '../shared/services/local-store.service';
import { environment } from './../../environments/environment';
import { LoginInput, LoginResp, SignupInput, SignupResp } from './auth.dto';

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
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient, private localStore: LocalStoreService) {}

  register = (input: SignupInput) =>
    this.http.post<SignupResp>(this.endpoint('register'), {
      ...input,
      clientUrl: `${urlJoin(environment.appUrl, '/account/email-verification')}`
    });
  login = (input: LoginInput) => this.http.post<LoginResp>(this.endpoint('login'), input);
  logout = () => {
    return of(() => {
      this.localStore.disableCaching();
      localStorage.clear();
    });
  };
  endpoint = (action: string) => `/api/auth/${action}`;
  verifyEmail = (token: string) => this.http.get<any>(this.endpoint(`verify/${token}`));
  resendEmailVerification = (email: string) => {
    const clientUrl = `${urlJoin(environment.appUrl, '/account/email-verification')}`;
    return this.http.get<any>(this.endpoint('resend'), { params: { email, clientUrl } });
  };

  getDecodedAccessToken(): DecodedAccessToken {
    const accessToken = this.localStore.getAccessToken();
    const helper = new JwtHelperService();
    const user: User = helper.decodeToken(accessToken);
    const expirationDate = helper.getTokenExpirationDate(accessToken);
    const isExpired = helper.isTokenExpired(accessToken);
    return { user, isExpired, expirationDate };
  }
}
