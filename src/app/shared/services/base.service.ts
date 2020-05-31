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
  update<TInput, TRes>(input: TInput, path: string) {
    return this.http.put<TRes>(this.endpoint(path), input);
  }
  find<TRes>(
    path: string,
    { query = {}, opts = {}, skip = 0, limit = 5 }: { query?: {} | any; opts?: {} | any; skip?: number; limit?: number }
  ) {
    const queryStr = JSON.stringify(query);
    const optsStr = JSON.stringify({ ...opts, skip, limit });
    const params = {
      params: new HttpParams({ fromObject: { query: queryStr, opts: optsStr } })
    };

    return this.http.get<TRes>(this.endpoint(path), params);
  }

  delete(path: string) {
    return this.http.delete(this.endpoint(path));
  }
}
