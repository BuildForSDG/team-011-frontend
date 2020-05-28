import { Injectable } from '@angular/core';
import { LandDto, CreateLandDto } from './land.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LandService {
  constructor(private http: HttpClient) {}
  lands: LandDto[] = [
    {
      id: '0',
      acres: 45,
      description: 'Large fertile virgin land',
      location: 'Close to Kainji Dam',
      price: 70000,
      province: 'Niger',
      auctionType: 'Lease',
      isAvailable: true,
    },
    {
      id: '1',
      acres: 45,
      description: 'Large flat land, ideal for tomato plantation',
      location: 'Behind matura, college of education, Ajakuta',
      price: 49500.85,
      province: 'Osun',
      auctionType: 'Rent',
      isAvailable: true,
    },
    {
      id: '2',
      acres: 45,
      description: 'Large fertile virgin land',
      location: 'Close to Lekki Dam',
      price: 6800.55,
      province: 'Gombe',
      auctionType: 'Rent',
      isAvailable: false,
    },
    {
      id: '3',
      acres: 45,
      description: 'Large fertile virgin land',
      location: 'Across wofira rakkon camp, Pkatiki',
      price: 4500,
      province: 'Enugu',
      auctionType: 'Lease',
      isAvailable: true,
    },
    {
      id: '4',
      acres: 45,
      description: 'Used to plant only tuber crops, extremely fertile',
      location: 'Mokwa, along Bida road, GRA, Asaba.',
      price: 5600,
      province: 'Delta',
      auctionType: 'Lease',
      isAvailable: true,
    },
    {
      id: '5',
      acres: 67,
      description: 'Never used land, with tick grasses',
      location: 'Few meters from Turoku Municipal',
      price: 2400.57,
      province: 'Abuja',
      auctionType: 'Rent',
      isAvailable: true,
    },
  ];

  async getLand(id: string): Promise<LandDto> {
    return this.lands.find((v: LandDto) => v.id === id);
  }
  async getLands({
    query = {},
    skip = 0,
    limit = 1,
  }: {
    query?: any;
    skip?: number;
    limit?: number;
  }): Promise<LandDto[]> {
    console.log(query, skip, limit);
    return this.lands;
  }
  async createLand(input: CreateLandDto): Promise<string> {
    const id = this.lands.length - 1 + '';
    const land = { ...input, id } as LandDto;
    this.lands.push(land);
    return id;
  }
  async deleteLand(id: string): Promise<void> {
    this.lands = this.lands.filter((v: LandDto) => v.id !== id);
  }
}
