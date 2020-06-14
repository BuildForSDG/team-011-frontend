import { NotificationDto, NotificationType } from "./../DTOs/notification.dto";
import { Injectable } from "@angular/core";

import { localStoreKeys } from "../constants/local-store.keys";

@Injectable({
  providedIn: "root"
})
export class LocalStoreService {
  constructor() {}

  enableCaching() {
    localStorage.setItem(localStoreKeys.shouldCache, "true");
  }
  disableCaching() {
    localStorage.setItem(localStoreKeys.shouldCache, "false");
  }
  shouldCache() {
    return localStorage.getItem(localStoreKeys.shouldCache) === "true";
  }
  storeAccessToken(accessToken: string) {
    localStorage.setItem(localStoreKeys.accessToken, accessToken);
  }
  getAccessToken() {
    return localStorage.getItem(localStoreKeys.accessToken);
  }
  clear() {
    localStorage.clear();
  }
}
