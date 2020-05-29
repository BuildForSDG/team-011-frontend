import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../shared/services/base.service';
import { LandDto, CreateLandDto } from './land.dto';

@Injectable({
  providedIn: 'root'
})
export class LandService extends BaseService {
  land: LandDto;
  constructor(protected http: HttpClient) {
    super(http);
  }

  getLands(skip: number, limit: number) {
    return this.find<LandDto>('/land', { limit, skip });
  }
  getLand(id: string) {
    return this.find<LandDto>('/land', { query: { id }, limit: 1, skip: 0 });
  }
  createLand(input: CreateLandDto | FormData) {
    return this.create<CreateLandDto | FormData, LandDto>(input, '/land');
  }
  deleteLand(id: string) {
    return this.delete(`/land/${id}`);
  }
}
