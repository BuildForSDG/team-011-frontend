import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService, DecodedAccessToken } from '../auth/auth.service';
import { BaseService } from '../shared/services/base.service';
import { CreateLandDto, LandDto, PagedRes, UpdateLandDto } from './land.dto';

@Injectable({
  providedIn: 'root'
})
export class LandService extends BaseService {
  land: LandDto;
  jwt: DecodedAccessToken;
  constructor(protected http: HttpClient, authService: AuthService) {
    super(http);
    this.jwt = authService.getDecodedAccessToken();
  }

  getUserLands(q: { skip: number; limit: number; auctionType?: 'Lease' | 'Rent'; sortPrice?: 1 | -1 }) {
    return this.find<PagedRes<LandDto>>(`/users/${this.jwt.user?.userId}/lands`, {
      query: { auctionType: q.auctionType },
      opts: { sort: { createdAt: -1, price: q.sortPrice } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getLands(skip: number, limit: number) {
    return this.find<PagedRes<LandDto>>(`/users/${this.jwt.user.userId}/lands`, { limit, skip });
  }
  getLand(id: string) {
    return this.find<LandDto>('/lands', { query: { id }, limit: 1, skip: 0 });
  }
  createLand(input: CreateLandDto | FormData) {
    return this.create<CreateLandDto | FormData, LandDto>(input, '/lands');
  }
  updateLand(id: string, input: UpdateLandDto | FormData) {
    return this.update<UpdateLandDto | FormData, LandDto>(input, `/users/${this.jwt.user.userId}/lands/${id}`);
  }
  deleteLand(id: string) {
    return this.delete(`/users/${this.jwt.user.userId}/lands/${id}`);
  }
}
