import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../../environments/environment";
import { localStoreKeys } from "../../constants/local-store.keys";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Removes trailing slashes in urls and also
  // sets auth headers
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = localStorage.getItem(localStoreKeys.accessToken);
    const baseUrl = environment.apiUrl.replace(/\/$/, "");
    const endpoint = req.url.replace(/^\//, "");
    const url = `${baseUrl}/${endpoint}`;
    const authReq = authToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` }, url })
      : req.clone({ url });
    return next.handle(authReq);
  }
}
