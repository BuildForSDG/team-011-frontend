import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { of } from "rxjs";
import urlJoin from "url-join";

import { LocalStoreService } from "../shared/services/local-store.service";
import { environment } from "./../../environments/environment";
import { LoginInput, LoginResp, SignupInput, SignupResp } from "./auth.dto";

export interface CurrentUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Farmer" | "Landowner" | "Admin";
}
interface DecodedAccessToken {
  user: CurrentUser;
  isExpired: boolean;
  expirationDate: Date;
}
@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private readonly http: HttpClient, private localStore: LocalStoreService) {}

  register = (input: SignupInput) =>
    this.http.post<SignupResp>(this.endpoint("register"), {
      ...input,
      clientUrl: `${urlJoin(environment.appUrl, "/account/email-verification")}`
    });
  login = (input: LoginInput) => this.http.post<LoginResp>(this.endpoint("login"), input);
  logout = () => {
    this.localStore.disableCaching();
    return of(this.localStore.clear());
  };
  endpoint = (action: string) => `/api/auth/${action}`;
  verifyEmail = (token: string) => this.http.get<any>(this.endpoint(`verify/${token}`));
  resendEmailVerification = (email: string) => {
    const clientUrl = `${urlJoin(environment.appUrl, "/account/email-verification")}`;
    return this.http.get<any>(this.endpoint("resend"), { params: { email, clientUrl } });
  };

  private getDecodedAccessToken(): DecodedAccessToken {
    const accessToken = this.localStore.getAccessToken();
    const helper = new JwtHelperService();
    const user: CurrentUser = helper.decodeToken(accessToken);
    const expirationDate = helper.getTokenExpirationDate(accessToken);
    const isExpired = helper.isTokenExpired(accessToken);
    return { user, isExpired, expirationDate };
  }
  isLoggedIn = () => {
    const { isExpired } = this.getDecodedAccessToken();
    return !isExpired;
  };
  getCurrentUser = () => {
    return this.getDecodedAccessToken().user;
  };
  getAccessToken = () => this.localStore.getAccessToken();
}
