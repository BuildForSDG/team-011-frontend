import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Notiflix from 'notiflix-angular';
import { ObservableInput, throwError } from 'rxjs';
import { NotifyService } from '../services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor() {}
  handleHttpError(err: HttpErrorResponse): ObservableInput<any> {
    const { error } = err;

    let errorMsg: string;
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      NotifyService.notify({
        message: error.message,
        notifyType: 'warning',
        icon: 'warning'
      });
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (err.status >= 500) {
        errorMsg = 'This is not your fault, it our fault; please try again later';
        errorMsg = error ? error.message || errorMsg : errorMsg;
        NotifyService.notify({
          message: error ? error.message || errorMsg : errorMsg,
          notifyType: 'danger',
          icon: 'error_outline'
        });
      } else {
        errorMsg = 'You might be doing something wrong; please check and try again';
        errorMsg = error ? error.message || errorMsg : errorMsg;

        if (err.status === 0)
          NotifyService.notify({
            icon: 'warning',
            message: 'You request could not reach our servers. Check your internet connectivity and try again.',
            notifyType: 'warning'
          });
        else
          NotifyService.notify({
            message: errorMsg,
            notifyType: 'info',
            icon: 'feedback'
          });
      }

      //  this.modalService.open(error.error.message, { centered: true });
    }
    Notiflix.Loading.Remove();
    return throwError(error.message || err.message || err);
  }
}
