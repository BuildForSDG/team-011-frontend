import { BaseResDto } from "@shared/DTOs/base-response.dto";

import { LandStatus } from "./land-request.dto";

export interface LandDto extends CreateLandDto, BaseResDto {
  requests: any[];
}
export interface CreateLandDto {
  description: string;
  acres: number;
  shortLocation: string;
  fullLocation: string;
  price: number;
  status: LandStatus;
  photo?: File;
  auctionType: "Lease" | "Rent";
  installmentType: string;
}
export interface UpdateLandDto extends CreateLandDto {
  id: string;
}
