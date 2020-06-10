import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { BaseService } from "../shared/services/base.service";
import { BaseResDto, CreateLandDto, LandDto, LandRequestStatus, PagedRes, ReqDto, UpdateLandDto } from "./land.dto";

export interface CreateLandReqInput {
  landId: string;
}
export interface CreatPaymentInput {
  metadata: {};
  requestId: string;
}
export interface PaymentDto {
  land: any;
  request: any;
  createdBy: any;
  amount: number;
  metadata: any;
}
@Injectable({
  providedIn: "root"
})
export class LandService extends BaseService {
  land: LandDto;
  constructor(protected http: HttpClient, private authService: AuthService) {
    super(http);
  }

  savePaymentDetails(input: CreatPaymentInput): Observable<PaymentDto> {
    return this.create(input, "/payments");
  }

  getRequestsToLandowner(q: { skip: number; limit: number; query?: any; opts?: any }) {
    return this.find<PagedRes<ReqDto>>("/land_requests/requests_to_landowner", {
      query: q.query || {},
      opts: q.opts || { sort: { createdAt: -1 } },
      skip: q.skip,
      limit: q.limit
    });
  }
  updateRequestsToLandowner(reqId: string, input: LandRequestStatus) {
    return this.update<any, ReqDto>({ status: input }, `/land_requests/requests_to_landowner/${reqId}`);
  }
  createLandRequest(landId: string): Observable<BaseResDto> {
    const input: CreateLandReqInput = { landId };
    return this.create(input, "/land_requests");
  }
  getFarmerRequests(q: { skip: number; limit: number; query?: any; opts?: any }) {
    return this.find<PagedRes<ReqDto>>("/land_requests/farmer_land_requests", {
      query: q.query || {},
      opts: q.opts || { sort: { createdAt: -1 } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getUserLands(q: {
    skip: number;
    limit: number;
    auctionType?: "Lease" | "Rent";
    sortPrice?: 1 | -1;
    query?: any;
    opts?: any;
  }) {
    const currentUser = this.authService.getCurrentUser();
    return this.find<PagedRes<LandDto>>(`/users/${currentUser?.userId}/lands`, {
      query: q.query || { auctionType: q.auctionType },
      opts: q.opts || { sort: { createdAt: -1, price: q.sortPrice } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getLands(q: { skip: number; limit: number; query?: any; opts?: any; countQuery?: any }) {
    return this.find<PagedRes<LandDto>>("/lands", {
      query: q.query || {},
      countQuery: q.countQuery || {},
      opts: q.opts || { sort: { createdAt: -1 } },
      skip: q.skip,
      limit: q.limit
    });
  }
  getLand(id: string) {
    return this.find<LandDto>("/lands", { query: { id }, limit: 1, skip: 0 });
  }
  createLand(input: CreateLandDto | FormData) {
    return this.create<CreateLandDto | FormData, LandDto>(input, "/lands");
  }
  updateLand(id: string, input: UpdateLandDto | FormData) {
    const currentUser = this.authService.getCurrentUser();
    return this.update<UpdateLandDto | FormData, LandDto>(input, `/users/${currentUser.userId}/lands/${id}`);
  }
  deleteLand(id: string) {
    const currentUser = this.authService.getCurrentUser();
    return this.delete(`/users/${currentUser.userId}/lands/${id}`);
  }
}
