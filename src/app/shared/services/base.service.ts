import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  constructor(protected http: HttpClient) {}

  endpoint = (url: { action: string; path?: string }) =>
    `/api${url.path}/${url.action}`;
}
