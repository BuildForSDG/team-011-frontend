import { Injectable } from '@angular/core';

import { localStoreKeys } from '../constants/local-store.keys';

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  constructor() {}

  storeAccessToken(accessToken: string) {
    localStorage.setItem(localStoreKeys.accessToken, accessToken);
  }
  getAccessToken() {
    return localStorage.getItem(localStoreKeys.accessToken);
  }
}
