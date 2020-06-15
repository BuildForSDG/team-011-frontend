import { Injectable } from "@angular/core";
declare var $: any;
export type NotifyType = "default" | "success" | "info" | "warning" | "danger" | "primary" | "rose";
@Injectable({
  providedIn: "root"
})
export class Toast {
  constructor() {}
  static dismissAll() {
    $.notifyClose();
  }
  static notify(opt: {
    from?: string;
    align?: string;
    icon?: string;
    message: string;
    title?: string;
    notifyType: NotifyType;
    timer?: number;
    delay?: number;
    showProgressBar?: boolean;
  }) {
    $.notify(
      {
        icon: "notifications",
        message: opt.message,
        title: opt.title
      },
      {
        type: opt.notifyType,
        timer: opt.timer * 1000 || 4000,
        delay: opt.delay * 1000 || 5000,
        mouse_over: "pause",
        z_index: 2000,
        showProgressbar: opt.showProgressBar,
        placement: {
          from: opt.from || "top",
          align: opt.align || "center"
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          `<i class="material-icons" data-notify="icon">${opt.icon || "notifications"}</i> ` +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>"
      }
    );
  }
}
