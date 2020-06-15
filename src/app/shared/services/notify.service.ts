import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationDto } from "@shared/DTOs/notification.dto";
import { PagedRes } from "@shared/DTOs/paged-response.dto";
import { BaseService } from "@shared/services/base.service";
import { Subject, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class NotifyService extends BaseService {
  notifications = new BehaviorSubject<NotificationDto[]>([]);

  constructor(protected http: HttpClient) {
    super(http);
  }

  deleteNotifications() {
    this.notifications.next([]);
    return this.delete("/notifications");
  }

  getNotifications(q: { skip: number; limit: number; query?: any; opts?: any }) {
    return this.find<PagedRes<NotificationDto>>("/notifications", {
      query: q.query || {},
      opts: q.opts || { sort: { createdAt: -1 } },
      skip: q.skip,
      limit: q.limit
    }).pipe(
      tap(data => {
        this.notifications.next(data.items);
      })
    );
  }
}
