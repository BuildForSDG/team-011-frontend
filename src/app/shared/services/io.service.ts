import { Injectable } from "@angular/core";
import { NotificationDto } from "@shared/DTOs/notification.dto";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

import { PaymentDto } from "../../land/land.service";

@Injectable({
  providedIn: "root"
})
export class IoService {
  constructor(private socket: Socket) {}
  sendPaymentNotification(landId: string) {
    this.socket.emit("payment", { landId });
  }
  getPaymentNotification(): Observable<PaymentDto> {
    return this.socket.fromEvent("payment");
  }
  sendLandReqNotification(landId: string) {
    this.socket.emit("land-request", { landId });
  }
  getLandReqNotification() {
    return this.socket.fromEvent("land-request");
  }
  getNotification() {
    return this.socket.fromEvent<NotificationDto>("notification");
  }
}
