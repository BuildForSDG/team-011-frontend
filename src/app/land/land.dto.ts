export interface CreateLandDto {
  location: string;
  province: string;
  price: number;
  auctionType: 'Rent' | 'Lease';
  acres: number;
  isAvailable: boolean;
  description: string;
  imageStr?: string;
}
export interface LandDto extends CreateLandDto {
  id: string;
}
