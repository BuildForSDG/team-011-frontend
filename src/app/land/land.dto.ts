export interface CreateLandDto {
  description: string;
  acres: number;
  shortLocation: string;
  fullLocation: string;
  price: number;
  photo?: File;
  auctionType: 'Lease' | 'Rent';
  installmentType: string;
}
export interface LandDto extends CreateLandDto {
  id: string;
}

export interface PagedRes<T> {
  totalCount: number;
  items: T[];
}
