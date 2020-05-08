import { Component, OnInit } from '@angular/core';
import { LandService } from 'src/app/land/land.service';
import { LandDto } from 'src/app/land/land.dto';

@Component({
  selector: 'app-land-section',
  templateUrl: './land-section.component.html',
  styleUrls: ['./land-section.component.css'],
})
export class LandSectionComponent implements OnInit {
  lands: LandDto[];
  rentLands: LandDto[];
  leaseLands: LandDto[];
  constructor(private readonly landService: LandService) {}

  async ngOnInit(): Promise<void> {
    const query = {
      isAvailable: { $ne: false },
    };
    this.lands = await this.landService.getLands({ query, skip: 0, limit: 8 });
    this.rentLands = this.lands.filter(
      (v: LandDto) => v.auctionType === 'Rent'
    );
    this.leaseLands = this.lands.filter(
      (v: LandDto) => v.auctionType === 'Lease'
    );
  }
}
