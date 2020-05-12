import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EnsureHttpsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // make request secure
    const secureReq = req.clone({
      url: req.url.replace('http://', 'https://'),
    });

    // send the cloned, "secure" request to the next handler.
    return next.handle(secureReq);
  }
}
