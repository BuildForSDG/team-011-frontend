import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.auth.getAuthToken();
    const baseUrl = environment.apiUrl.replace(/\/$/, '');
    const endpoint = req.url.replace(/^\//, '');
    const authReq = req.clone({
      setHeaders: { Authorization: authToken },
      url: `${baseUrl}/${endpoint}`,
    });
    console.log(authReq);
    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
