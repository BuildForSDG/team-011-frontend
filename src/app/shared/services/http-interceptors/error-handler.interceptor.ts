import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorHandlerService } from "../../handlers/error-handler.service";

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(this.errorHandler.handleHttpError));
  }
}
