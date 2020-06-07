export enum LandStatus {
  Available = 'AVAILABLE',
  Occupied = 'OCCUPIED',
  PendingPayment = 'PENDING_PAYMENT'
}
export enum LandRequestStatus {
  Declined = 'DECLINED',
  Approved = 'APPROVED',
  Pending = 'PENDING'
}
export interface BaseResDto {
  id: string;
  updatedAt: Date;
  createdAt: Date;
  createdBy: any;
}
export interface PagedRes<T> {
  totalCount: number;
  items: T[];
}

export interface CreateLandDto {
  description: string;
  acres: number;
  shortLocation: string;
  fullLocation: string;
  price: number;
  status: LandStatus;
  photo?: File;
  auctionType: 'Lease' | 'Rent';
  installmentType: string;
}

export interface LandDto extends CreateLandDto, BaseResDto {
  requests: any[];
}
export interface UpdateLandDto extends CreateLandDto {
  id: string;
}

export interface ReqDto extends BaseResDto {
  landId: any;
  landownerId: string;
  status: LandRequestStatus;
}
