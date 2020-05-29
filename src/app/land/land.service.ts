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
    return this.find<LandDto>(this.endpoint('/land'), { limit, skip });
  }
  createLand(input: CreateLandDto) {
    return this.create(input, '/land');
  }
}
