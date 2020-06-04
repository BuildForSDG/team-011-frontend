export interface BaseResDto {
  id: string;
  updatedAt: Date;
  createdAt: Date;
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
  isAvailable: boolean;
  photo?: File;
  auctionType: 'Lease' | 'Rent';
  installmentType: string;
}

export interface LandDto extends CreateLandDto, BaseResDto {
  requests: string[];
}
export interface UpdateLandDto extends CreateLandDto {
  id: string;
}

export interface ReqDto extends BaseResDto {
  landId: any;
  landownerId: string;
  isAccepted: boolean;
  createdBy: any;
}
