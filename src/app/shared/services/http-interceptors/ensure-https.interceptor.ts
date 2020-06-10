import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../../environments/environment";

@Injectable()
export class EnsureHttpsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const url = environment.production ? req.url.replace("http://", "https://") : req.url;
    // make request secure
    const secureReq = req.clone({ url });
    // send the cloned, "secure" request to the next handler.
    return next.handle(secureReq);
  }
}
