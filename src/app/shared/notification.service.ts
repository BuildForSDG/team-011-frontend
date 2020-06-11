import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";

import { BaseService } from "./services/base.service";

export interface Notify {
  id: string;
  title: string;
}

@Injectable({
  providedIn: "root"
})
export class NotifyService extends BaseService {
  private socket: any;
  constructor(protected http: HttpClient) {
    super(http);
  }

  getNotification(): Observable<Notify> {
    let observable = new Observable<Notify>(observer => {
      this.socket = io("");
      this.socket.on("new-notification", (data: { fullDocument: Notify }) => {
        let notification: Notify = data.fullDocument;
        observer.next(notification);
      });
      return () => this.socket.disconnect();
    });
    return observable;
  }
}
