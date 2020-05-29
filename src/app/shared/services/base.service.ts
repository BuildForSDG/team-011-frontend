import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import urlJoin from 'url-join';
@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  constructor(protected http: HttpClient) {}

  private endpoint = (...paths: string[]) => urlJoin('/api/', ...paths);
  create<TInput, TRes>(input: TInput, path: string) {
    return this.http.post<TRes>(this.endpoint(path), input);
  }
  find<TRes>(path: string, { query = {}, skip = 0, limit = 5 }: { query?: {} | any; skip?: number; limit?: number }) {
    delete query?.skip;
    delete query?.limit;
    const queryStr = JSON.stringify(query);
    const params = { params: new HttpParams({ fromObject: { query: queryStr, skip: `${skip}`, limit: `${limit}` } }) };

    return this.http.get<TRes[]>(this.endpoint(path), params);
  }

  delete(path: string) {
    return this.http.delete(this.endpoint(path));
  }
}
