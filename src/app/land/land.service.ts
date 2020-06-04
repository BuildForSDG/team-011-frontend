import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService, DecodedAccessToken } from '../auth/auth.service';
import { BaseService } from '../shared/services/base.service';
import { CreateLandDto, LandDto, PagedRes, UpdateLandDto, ReqDto } from './land.dto';

@Injectable({
  providedIn: 'root'
})
export class LandService extends BaseService {
  land: LandDto;
  jwt: DecodedAccessToken;
  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http);
  }

  getLandRequests(q: { skip: number; limit: number; query?: any; opts?: any }) {
    const jwt = this.authService.getDecodedAccessToken();
    return this.find<PagedRes<ReqDto>>(`/users/${jwt.user?.userId}/land_requests`, {
      query: q.query || {},
      opts: q.opts || { sort: { createdAt: -1 } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getUserLands(q: {
    skip: number;
    limit: number;
    auctionType?: 'Lease' | 'Rent';
    sortPrice?: 1 | -1;
    query?: any;
    opts?: any;
  }) {
    const jwt = this.authService.getDecodedAccessToken();
    return this.find<PagedRes<LandDto>>(`/users/${jwt.user?.userId}/lands`, {
      query: q.query || { auctionType: q.auctionType },
      opts: q.opts || { sort: { createdAt: -1, price: q.sortPrice } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getLands(skip: number, limit: number) {
    const jwt = this.authService.getDecodedAccessToken();
    return this.find<PagedRes<LandDto>>(`/users/${jwt.user.userId}/lands`, { limit, skip });
  }
  getLand(id: string) {
    return this.find<LandDto>('/lands', { query: { id }, limit: 1, skip: 0 });
  }
  createLand(input: CreateLandDto | FormData) {
    return this.create<CreateLandDto | FormData, LandDto>(input, '/lands');
  }
  updateLand(id: string, input: UpdateLandDto | FormData) {
    const jwt = this.authService.getDecodedAccessToken();
    return this.update<UpdateLandDto | FormData, LandDto>(input, `/users/${jwt.user.userId}/lands/${id}`);
  }
  deleteLand(id: string) {
    const jwt = this.authService.getDecodedAccessToken();
    return this.delete(`/users/${jwt.user.userId}/lands/${id}`);
  }
}
