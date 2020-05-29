import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import urlJoin from 'url-join';
@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  constructor(protected http: HttpClient) {}

  endpoint = (...url: string[]) => urlJoin('/api/', ...url);
  create<TInput, TRes>(input: TInput, url: string) {
    return this.http.post<TRes>(this.endpoint(url), input);
  }
  find<TRes>(url: string, { query = {}, skip = 0, limit = 5 }: { query?: {} | any; skip?: number; limit?: number }) {
    delete query?.skip;
    delete query?.limit;
    const queryStr = JSON.stringify(query);
    const params = { params: new HttpParams({ fromObject: { query: queryStr, skip: `${skip}`, limit: `${limit}` } }) };

    return this.http.get<TRes[]>(url, params);
  }
  delete(url: string) {
    return this.http.delete(url);
  }
}
