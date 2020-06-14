import { BaseResDto } from "@shared/DTOs/base-response.dto";

export enum LandStatus {
  Available = "AVAILABLE",
  Occupied = "OCCUPIED",
  PendingPayment = "PENDING_PAYMENT"
}
export enum LandRequestStatus {
  Declined = "DECLINED",
  Approved = "APPROVED",
  Pending = "PENDING"
}

export interface LandReqDto extends BaseResDto {
  landId: any;
  landownerId: any;
  status: LandRequestStatus;
}
