import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { BaseService } from '../shared/services/base.service';
import { CreateLandDto, LandDto, PagedRes } from './land.dto';

@Injectable({
  providedIn: 'root'
})
export class LandService extends BaseService {
  land: LandDto;
  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http);
  }

  getUserLands(q: { skip: number; limit: number; auctionType?: 'Lease' | 'Rent'; sortPrice?: 1 | -1 }) {
    return this.find<PagedRes<LandDto>>(`/users/${this.authService.getDecodedAccessToken().user?.userId}/lands`, {
      query: { auctionType: q.auctionType },
      opts: { sort: { createdAt: -1, price: q.sortPrice } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getLands(skip: number, limit: number) {
    return this.find<PagedRes<LandDto>>('/lands', { limit, skip });
  }
  getLand(id: string) {
    return this.find<LandDto>('/lands', { query: { id }, limit: 1, skip: 0 });
  }
  createLand(input: CreateLandDto | FormData) {
    return this.create<CreateLandDto | FormData, LandDto>(input, '/lands');
  }
  updateLand(id: string, input: LandDto | FormData) {
    return this.update<LandDto | FormData, LandDto>(input, `/lands/${id}`);
  }
  deleteLand(id: string) {
    return this.delete(`/lands/${id}`);
  }
}
