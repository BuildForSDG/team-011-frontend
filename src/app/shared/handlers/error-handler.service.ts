import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Notiflix from 'notiflix-angular';
import { ObservableInput, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  /**
   *
   */
  constructor() {
    Notiflix.Report.Init({ messageFontSize: '16', plainText: false });
  }
  handleHttpError(err: HttpErrorResponse): ObservableInput<any> {
    const { error } = err;
    const errorTitle = 'Oops';
    const okStr = 'Okay';
    let errorMsg: string;
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      Notiflix.Report.Warning(errorTitle, error.message, okStr);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (err.status >= 500) {
        errorMsg =
          'This is not your fault, it our fault; please try again later';
        errorMsg = error ? error.message || errorMsg : errorMsg;
        Notiflix.Report.Failure(
          errorTitle,
          error ? error.message || errorMsg : errorMsg,
          okStr
        );
      } else {
        errorMsg =
          'You might be doing something wrong; please check and try again';
        errorMsg = error ? error.message || errorMsg : errorMsg;

        if (err.status === 0)
          Notiflix.Report.Warning(
            errorTitle,
            'You do not have internet connectivity. Please check your internet and try again',
            okStr
          );
        else Notiflix.Report.Info(errorTitle, errorMsg, okStr);
      }

      //  this.modalService.open(error.error.message, { centered: true });
    }
    Notiflix.Loading.Remove();
    return throwError(errorTitle);
  }
}
