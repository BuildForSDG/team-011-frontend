export interface CreateLandDto {
  title: string;
  description: string;
  acres: number;
  shortLocation: string;
  fullLocation: string;
  price: number;
  photo?: string;
  auctionType: 'Lease' | 'Rent';
  installmentType: string;
  currency: string;
}
export interface LandDto extends CreateLandDto {
  id: string;
}
